/* ===================================================
 * PRENDS TON TEMPS - ENGINE
 * Version: 1.0
 * ================================================= */

// ===== CONFIGURATION =====
const CONFIG = {
    durationMs: 180000, // 3 minutes
    responseWindowMs: 6000,
    initialPaceMs: 1200,
    switchEvery: { min: 8, max: 14 },
    hintMode: 'auto',
    ruleset: ['R1', 'R2', 'R3'],
    levelStart: 1,
    colors: ['blue', 'red', 'gray'],
    debugMode: false
};

// ===== RÈGLES =====
const RULES = {
    R1: {
        id: 'R1',
        label: 'Appuie si c\'est une LETTRE',
        kind: 'kind_is',
        params: { kind: 'letter' }
    },
    R2: {
        id: 'R2',
        label: 'Appuie si c\'est un CERCLE',
        kind: 'shape_is',
        params: { shape: 'circle' }
    },
    R3: {
        id: 'R3',
        label: 'Appuie si c\'est BLEU',
        kind: 'color_is',
        params: { color: 'blue' }
    },
    R4: {
        id: 'R4',
        label: 'Appuie si c\'est le MÊME qu\'avant',
        kind: 'same_as_prev',
        params: {}
    }
};

// ===== ÉTAT GLOBAL =====
const STATE = {
    currentState: 'IDLE',
    sessionId: null,
    userId: 'user_001',
    startTime: null,
    endTime: null,
    currentRule: null,
    currentStimulus: null,
    currentTrial: null,
    trialIndex: 0,
    trials: [],
    previousStimulus: null,
    // Adaptation
    level: CONFIG.levelStart,
    paceMs: CONFIG.initialPaceMs,
    switchEvery: { ...CONFIG.switchEvery },
    hintMode: CONFIG.hintMode,
    // Stats glissantes
    recentTrials: [],
    streakCorrect: 0,
    streakErrors: 0,
    fatigueIndex: 0,
    // Timers
    stimulusTimer: null,
    responseTimer: null,
    // Switch
    trialsUntilSwitch: 0,
    totalSwitches: 0
};

// ===== GÉNÉRATION ID =====
function generateId(prefix = 'id') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// ===== GÉNÉRATION STIMULI =====
function generateStimulus() {
    const types = ['letter', 'shape', 'number'];
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const shapes = ['circle', 'square', 'triangle'];
    const numbers = ['2', '3', '4', '5', '6', '7', '8', '9'];

    const type = types[Math.floor(Math.random() * types.length)];
    const color = CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];

    let stimulus = {
        id: generateId('S'),
        kind: type,
        value: { color },
        render: { text: null, asset: null }
    };

    switch (type) {
        case 'letter':
            stimulus.value.letter = letters[Math.floor(Math.random() * letters.length)];
            stimulus.render.text = stimulus.value.letter;
            break;
        case 'shape':
            stimulus.value.shape = shapes[Math.floor(Math.random() * shapes.length)];
            stimulus.render.asset = `shape_${stimulus.value.shape}`;
            break;
        case 'number':
            stimulus.value.number = numbers[Math.floor(Math.random() * numbers.length)];
            stimulus.render.text = stimulus.value.number;
            stimulus.value.isEven = parseInt(stimulus.value.number) % 2 === 0;
            break;
    }

    return stimulus;
}

// ===== ÉVALUATION RÉPONSE =====
function evaluateResponse(rule, stimulus, prevStimulus) {
    switch (rule.kind) {
        case 'kind_is':
            return stimulus.kind === rule.params.kind;
        case 'shape_is':
            return stimulus.value.shape === rule.params.shape;
        case 'color_is':
            return stimulus.value.color === rule.params.color;
        case 'same_as_prev':
            if (!prevStimulus) return false;
            return JSON.stringify(stimulus.value) === JSON.stringify(prevStimulus.value);
        case 'number_is_even':
            return stimulus.value.isEven === true;
        default:
            return false;
    }
}

// ===== CALCUL MÉTRIQUES =====
function calculateMetrics(trials) {
    if (trials.length === 0) {
        return {
            ACC: 0,
            RT_MEDIAN_CORRECT: 0,
            RTVAR_ROBUST: 0,
            SWITCH_COST: 0,
            POST_SWITCH_ERROR: 0,
            HINT_RATE: 0,
            TIMEOUT_RATE: 0
        };
    }

    const correctTrials = trials.filter(t => t.isCorrect);
    const switchTrials = trials.filter(t => t.isSwitchTrial);
    const postSwitchTrials = trials.filter(t => t.isSwitchTrial);

    const ACC = correctTrials.length / trials.length;

    const correctRTs = correctTrials.map(t => t.rtMs).sort((a, b) => a - b);
    const RT_MEDIAN_CORRECT = correctRTs.length > 0 ?
        correctRTs[Math.floor(correctRTs.length / 2)] : 0;

    // Variance robuste (IQR)
    const q1 = correctRTs[Math.floor(correctRTs.length * 0.25)] || 0;
    const q3 = correctRTs[Math.floor(correctRTs.length * 0.75)] || 0;
    const RTVAR_ROBUST = q3 - q1;

    // Switch cost (moyenne RT post-switch - moyenne RT normale)
    const nonSwitchCorrect = trials.filter(t => !t.isSwitchTrial && t.isCorrect);
    const switchCorrect = switchTrials.filter(t => t.isCorrect);
    const avgNonSwitch = nonSwitchCorrect.length > 0 ?
        nonSwitchCorrect.reduce((sum, t) => sum + t.rtMs, 0) / nonSwitchCorrect.length : 0;
    const avgSwitch = switchCorrect.length > 0 ?
        switchCorrect.reduce((sum, t) => sum + t.rtMs, 0) / switchCorrect.length : 0;
    const SWITCH_COST = avgSwitch - avgNonSwitch;

    const POST_SWITCH_ERROR = postSwitchTrials.length > 0 ?
        postSwitchTrials.filter(t => !t.isCorrect).length / postSwitchTrials.length : 0;

    const HINT_RATE = trials.filter(t => t.hintUsed).length / trials.length;
    const TIMEOUT_RATE = trials.filter(t => t.isTimeout).length / trials.length;

    return {
        ACC,
        RT_MEDIAN_CORRECT,
        RTVAR_ROBUST,
        SWITCH_COST,
        POST_SWITCH_ERROR,
        HINT_RATE,
        TIMEOUT_RATE
    };
}

// ===== ADAPTATION =====
function updateAdaptation() {
    // Stats récentes (10 derniers trials)
    const recent = STATE.recentTrials.slice(-10);
    if (recent.length < 3) return; // Pas assez de données

    const metrics = calculateMetrics(recent);

    // Calcul fatigue
    const rtTrend = recent.length > 5 ?
        (recent.slice(-3).reduce((s, t) => s + t.rtMs, 0) / 3) -
        (recent.slice(0, 3).reduce((s, t) => s + t.rtMs, 0) / 3) : 0;

    STATE.fatigueIndex = Math.max(0, Math.min(1,
        (rtTrend / 1000) * 0.3 +
        metrics.RTVAR_ROBUST / 1000 * 0.3 +
        metrics.TIMEOUT_RATE * 0.2 +
        (1 - metrics.ACC) * 0.2
    ));

    // Adaptation sécurité/confort
    if (STATE.streakErrors >= 2 || STATE.fatigueIndex > 0.7) {
        STATE.paceMs = Math.min(2000, STATE.paceMs + 150);
        STATE.hintMode = 'auto';
        STATE.switchEvery.min = Math.min(20, STATE.switchEvery.min + 1);
        STATE.switchEvery.max = Math.min(22, STATE.switchEvery.max + 1);
    }

    // Progression
    if (STATE.streakCorrect >= 6 && STATE.fatigueIndex < 0.4) {
        STATE.paceMs = Math.max(900, STATE.paceMs - 100);
        STATE.hintMode = 'off';
        STATE.switchEvery.min = Math.max(6, STATE.switchEvery.min - 1);
        STATE.switchEvery.max = Math.max(10, STATE.switchEvery.max - 1);
    }

    // Level
    if (recent.length >= 10) {
        if (metrics.ACC > 0.9 && metrics.POST_SWITCH_ERROR < 0.2) {
            STATE.level = Math.min(3, STATE.level + 1);
            if (STATE.level >= 2 && !CONFIG.ruleset.includes('R4')) {
                CONFIG.ruleset.push('R4');
            }
        } else if (metrics.ACC < 0.75) {
            STATE.level = Math.max(1, STATE.level - 1);
        }
    }
}

// ===== SÉLECTION RÈGLE =====
function selectNextRule() {
    const availableRules = CONFIG.ruleset.filter(id => RULES[id]);
    if (availableRules.length === 0) return RULES.R1;

    // Éviter de répéter la même règle
    let candidates = availableRules.filter(id => id !== STATE.currentRule?.id);
    if (candidates.length === 0) candidates = availableRules;

    const ruleId = candidates[Math.floor(Math.random() * candidates.length)];
    return RULES[ruleId];
}

// ===== SESSION =====
function startSession() {
    STATE.sessionId = generateId('sess');
    STATE.startTime = new Date().toISOString();
    STATE.trialIndex = 0;
    STATE.trials = [];
    STATE.recentTrials = [];
    STATE.currentRule = selectNextRule();
    STATE.trialsUntilSwitch = randomInt(STATE.switchEvery.min, STATE.switchEvery.max);
    STATE.totalSwitches = 0;
    STATE.level = CONFIG.levelStart;
    STATE.paceMs = CONFIG.initialPaceMs;
    STATE.switchEvery = { ...CONFIG.switchEvery };
    STATE.hintMode = CONFIG.hintMode;
    STATE.streakCorrect = 0;
    STATE.streakErrors = 0;
    STATE.fatigueIndex = 0;
    STATE.previousStimulus = null;

    console.log('Session started:', STATE.sessionId);
    return {
        sessionId: STATE.sessionId,
        initialRule: STATE.currentRule
    };
}

function endSession() {
    STATE.endTime = new Date().toISOString();
    const durationMs = new Date(STATE.endTime) - new Date(STATE.startTime);

    const metrics = calculateMetrics(STATE.trials);

    const summary = {
        sessionId: STATE.sessionId,
        startedAt: STATE.startTime,
        endedAt: STATE.endTime,
        durationMs,
        metrics,
        config: {
            responseWindowMs: CONFIG.responseWindowMs,
            initialPaceMs: CONFIG.initialPaceMs,
            switchEvery: CONFIG.switchEvery,
            ruleset: CONFIG.ruleset,
            levelStart: CONFIG.levelStart
        }
    };

    console.log('Session ended:', summary);
    return summary;
}

// ===== TRIAL =====
function startTrial() {
    STATE.trialIndex++;

    // Check si switch
    const isSwitchTrial = STATE.trialsUntilSwitch <= 0;
    if (isSwitchTrial) {
        STATE.currentRule = selectNextRule();
        STATE.trialsUntilSwitch = randomInt(STATE.switchEvery.min, STATE.switchEvery.max);
        STATE.totalSwitches++;
    } else {
        STATE.trialsUntilSwitch--;
    }

    // Génération stimulus
    STATE.currentStimulus = generateStimulus();
    const shouldPress = evaluateResponse(STATE.currentRule, STATE.currentStimulus, STATE.previousStimulus);

    STATE.currentTrial = {
        trialIndex: STATE.trialIndex,
        ruleId: STATE.currentRule.id,
        stimulusId: STATE.currentStimulus.id,
        isSwitchTrial,
        shouldPress,
        startTime: performance.now(),
        level: STATE.level,
        paceMs: STATE.paceMs,
        fatigueIndex: STATE.fatigueIndex
    };

    return {
        stimulus: STATE.currentStimulus,
        rule: STATE.currentRule,
        isSwitchTrial,
        trialMeta: {
            trialIndex: STATE.trialIndex,
            isSwitchTrial,
            level: STATE.level,
            paceMs: STATE.paceMs,
            responseWindowMs: CONFIG.responseWindowMs,
            hintMode: STATE.hintMode,
            hintThresholdMs: 2000
        }
    };
}

function commitResponse(action, isTimeout = false) {
    if (!STATE.currentTrial) return null;

    const rtMs = Math.round(performance.now() - STATE.currentTrial.startTime);
    const didPress = action === 'YES';
    const isCorrect = didPress === STATE.currentTrial.shouldPress;

    const result = {
        t: new Date().toISOString(),
        sessionId: STATE.sessionId,
        userId: STATE.userId,
        trialIndex: STATE.currentTrial.trialIndex,
        ruleId: STATE.currentTrial.ruleId,
        stimulusId: STATE.currentTrial.stimulusId,
        stimulusKind: STATE.currentStimulus.kind,
        stimulusValue: STATE.currentStimulus.value,
        isSwitchTrial: STATE.currentTrial.isSwitchTrial,
        shouldPress: STATE.currentTrial.shouldPress,
        didPress,
        rtMs,
        isTimeout,
        isCorrect,
        hintUsed: false,
        paceMs: STATE.currentTrial.paceMs,
        level: STATE.currentTrial.level,
        fatigueIndex: STATE.currentTrial.fatigueIndex
    };

    STATE.trials.push(result);
    STATE.recentTrials.push(result);
    if (STATE.recentTrials.length > 20) {
        STATE.recentTrials.shift();
    }

    // Update streaks
    if (isCorrect) {
        STATE.streakCorrect++;
        STATE.streakErrors = 0;
    } else {
        STATE.streakErrors++;
        STATE.streakCorrect = 0;
    }

    // Adaptation
    updateAdaptation();

    // Sauvegarder pour "same_as_prev"
    STATE.previousStimulus = STATE.currentStimulus;
    STATE.currentTrial = null;

    return result;
}

// ===== EXPORT =====
function exportJSON(summary) {
    const data = {
        summary,
        trials: STATE.trials
    };
    const json = JSON.stringify(data, null, 2);
    downloadFile(json, `session_export_${STATE.sessionId}.json`, 'application/json');
}

function exportCSV() {
    const headers = 't,sessionId,userId,trialIndex,ruleId,stimulusId,stimulusKind,stimulusValue,isSwitchTrial,shouldPress,didPress,rtMs,isTimeout,isCorrect,hintUsed,paceMs,level,fatigueIndex';
    const rows = STATE.trials.map(t => {
        const sv = JSON.stringify(t.stimulusValue).replace(/"/g, '""');
        return `${t.t},${t.sessionId},${t.userId},${t.trialIndex},${t.ruleId},${t.stimulusId},${t.stimulusKind},"${sv}",${t.isSwitchTrial},${t.shouldPress},${t.didPress},${t.rtMs},${t.isTimeout},${t.isCorrect},${t.hintUsed},${t.paceMs},${t.level},${t.fatigueIndex.toFixed(2)}`;
    });
    const csv = [headers, ...rows].join('\n');
    downloadFile(csv, `session_export_${STATE.sessionId}.csv`, 'text/csv');
}

function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ===== UTILS =====
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* ===================================================
 * UI CONTROLLER
 * ================================================= */

const UI = {
    screens: {
        briefing: document.getElementById('screen-briefing'),
        game: document.getElementById('screen-game'),
        summary: document.getElementById('screen-summary')
    },
    elements: {
        briefingRule: document.getElementById('briefing-rule'),
        btnReady: document.getElementById('btn-ready'),
        gameRuleBanner: document.getElementById('game-rule-banner'),
        stimulus: document.getElementById('stimulus'),
        btnYes: document.getElementById('btn-yes'),
        btnNo: document.getElementById('btn-no'),
        btnPause: document.getElementById('btn-pause'),
        metricStability: document.getElementById('metric-stability'),
        metricFlexibility: document.getElementById('metric-flexibility'),
        metricRegularity: document.getElementById('metric-regularity'),
        btnReplay: document.getElementById('btn-replay'),
        btnExportJSON: document.getElementById('btn-export-json'),
        btnExportCSV: document.getElementById('btn-export-csv'),
        feedback: document.getElementById('feedback'),
        debugInfo: document.getElementById('debug-info')
    },
    sessionTimer: null,
    debounceTimer: null,
    isPaused: false,
    responseDisabled: false,

    init() {
        this.bindEvents();
        this.showScreen('briefing');
        if (CONFIG.debugMode) {
            document.body.classList.add('debug-mode');
        }
    },

    bindEvents() {
        this.elements.btnReady.addEventListener('click', () => this.onReady());
        this.elements.btnYes.addEventListener('click', () => this.onResponse('YES'));
        this.elements.btnNo.addEventListener('click', () => this.onResponse('NO'));
        this.elements.btnPause.addEventListener('click', () => this.onPause());
        this.elements.btnReplay.addEventListener('click', () => this.onReplay());
        this.elements.btnExportJSON.addEventListener('click', () => this.onExportJSON());
        this.elements.btnExportCSV.addEventListener('click', () => this.onExportCSV());
    },

    showScreen(name) {
        Object.values(this.screens).forEach(s => s.classList.remove('active'));
        this.screens[name].classList.add('active');
        STATE.currentState = name.toUpperCase();
    },

    onReady() {
        const session = startSession();
        this.elements.briefingRule.textContent = session.initialRule.label;
        this.elements.gameRuleBanner.textContent = session.initialRule.label;

        setTimeout(() => {
            this.showScreen('game');
            this.startGameLoop();
        }, 300);
    },

    startGameLoop() {
        this.sessionTimer = setTimeout(() => {
            this.endGame();
        }, CONFIG.durationMs);

        this.nextTrial();
    },

    nextTrial() {
        if (this.isPaused) return;

        const trial = startTrial();

        // Si switch, afficher feedback
        if (trial.isSwitchTrial) {
            this.elements.gameRuleBanner.textContent = trial.rule.label;
            this.showFeedback('Nouvelle règle.', 1500);

            setTimeout(() => {
                this.renderStimulus(trial.stimulus);
                this.startResponseWindow();
            }, 1500);
        } else {
            this.renderStimulus(trial.stimulus);
            this.startResponseWindow();
        }

        this.updateDebug(trial);
    },

    renderStimulus(stimulus) {
        const el = this.elements.stimulus;
        el.className = 'stimulus';
        el.style.color = stimulus.value.color || 'black';

        if (stimulus.render.text) {
            el.textContent = stimulus.render.text;
        } else if (stimulus.render.asset) {
            el.className = `stimulus shape ${stimulus.value.shape}`;
            el.style.backgroundColor = stimulus.value.color;
            el.textContent = '';
        }

        el.style.opacity = '1';
    },

    startResponseWindow() {
        this.responseDisabled = false;

        STATE.responseTimer = setTimeout(() => {
            if (!this.responseDisabled) {
                this.onResponse('NO', true);
            }
        }, CONFIG.responseWindowMs);
    },

    onResponse(action, isTimeout = false) {
        if (this.responseDisabled || this.isPaused) return;

        // Debounce
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            this.processResponse(action, isTimeout);
        }, 50);
    },

    processResponse(action, isTimeout) {
        this.responseDisabled = true;
        clearTimeout(STATE.responseTimer);

        const result = commitResponse(action, isTimeout);

        // Feedback subtil
        this.elements.stimulus.style.opacity = '0.3';

        // Inter-trial
        setTimeout(() => {
            this.nextTrial();
        }, STATE.paceMs);
    },

    onPause() {
        this.isPaused = !this.isPaused;
        this.elements.btnPause.textContent = this.isPaused ? '▶' : '⏸';

        if (this.isPaused) {
            clearTimeout(STATE.responseTimer);
            clearTimeout(this.sessionTimer);
            this.showFeedback('Pause', 0);
        } else {
            this.elements.feedback.classList.remove('show');
            this.nextTrial();
        }
    },

    endGame() {
        clearTimeout(this.sessionTimer);
        clearTimeout(STATE.responseTimer);

        const summary = endSession();
        this.showSummary(summary);
        this.showScreen('summary');
    },

    showSummary(summary) {
        const m = summary.metrics;

        // Stabilité (basé sur variance)
        let stability = 'Stable';
        if (m.RTVAR_ROBUST > 800) stability = 'Variable';
        if (m.RTVAR_ROBUST < 400) stability = 'Très stable';
        this.elements.metricStability.textContent = stability;

        // Flexibilité (basé sur switch cost et erreurs)
        let flexibility = 'Fluide';
        if (m.POST_SWITCH_ERROR > 0.25) flexibility = 'En adaptation';
        if (m.POST_SWITCH_ERROR < 0.15 && m.SWITCH_COST < 400) flexibility = 'Très fluide';
        this.elements.metricFlexibility.textContent = flexibility;

        // Régularité (basé sur accuracy et timeouts)
        let regularity = 'Régulier';
        if (m.ACC < 0.75 || m.TIMEOUT_RATE > 0.15) regularity = 'Irrégulier';
        if (m.ACC > 0.9 && m.TIMEOUT_RATE < 0.05) regularity = 'Très régulier';
        this.elements.metricRegularity.textContent = regularity;
    },

    onReplay() {
        location.reload();
    },

    onExportJSON() {
        const summary = {
            sessionId: STATE.sessionId,
            startedAt: STATE.startTime,
            endedAt: STATE.endTime,
            durationMs: new Date(STATE.endTime) - new Date(STATE.startTime),
            metrics: calculateMetrics(STATE.trials),
            config: {
                responseWindowMs: CONFIG.responseWindowMs,
                initialPaceMs: CONFIG.initialPaceMs,
                switchEvery: CONFIG.switchEvery,
                ruleset: CONFIG.ruleset
            }
        };
        exportJSON(summary);
    },

    onExportCSV() {
        exportCSV();
    },

    showFeedback(text, duration = 2000) {
        this.elements.feedback.textContent = text;
        this.elements.feedback.classList.add('show');

        if (duration > 0) {
            setTimeout(() => {
                this.elements.feedback.classList.remove('show');
            }, duration);
        }
    },

    updateDebug(trial) {
        if (!CONFIG.debugMode) return;

        this.elements.debugInfo.textContent =
            `Trial: ${trial.trialMeta.trialIndex} | ` +
            `Switch: ${trial.isSwitchTrial} | ` +
            `ShouldPress: ${trial.trialMeta.shouldPress} | ` +
            `Pace: ${trial.trialMeta.paceMs}ms | ` +
            `Level: ${trial.trialMeta.level} | ` +
            `Fatigue: ${STATE.fatigueIndex.toFixed(2)}`;
    }
};

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    UI.init();
    console.log('Prends Ton Temps initialized');
});

// Mode debug avec Ctrl+D
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        CONFIG.debugMode = !CONFIG.debugMode;
        document.body.classList.toggle('debug-mode');
    }
});
