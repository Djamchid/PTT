Prends Ton Temps — Spécifications complètes

\*\*Version :\*\* 1.0  

\*\*Public :\*\* développeur \+ “codeur IA” (implémentation web/mobile)  

\*\*Objectif :\*\* mini-jeu de stimulation cognitive Parkinson-friendly, centré sur fonctions exécutives (attention, mémoire de travail, flexibilité), sans pression temporelle punitive, avec instrumentation clinique.

\---

\#\# 0\) Résumé produit (1 phrase)

Un jeu de réponses binaires \*\*OUI/NON\*\* à des stimuli successifs, sous une \*\*règle active\*\* qui \*\*change\*\* à intervalles imprévisibles (“switch”), avec \*\*tempo adaptatif\*\* et \*\*export structuré\*\* (JSON/CSV).

\---

\#\# 1\) Principes de design (contraintes non négociables)

1\. \*\*Ne jamais pénaliser la lenteur\*\* : pas de “game over”, pas de chronomètre agressif.

2\. \*\*Règle visible en permanence\*\* (charge cognitive réduite).

3\. \*\*Changement de règle explicitement annoncé\*\* (on entraîne le switch, pas le “piège”).

4\. \*\*Réponse manquante \= NON par défaut\*\* (évite stress; la latence est mesurée).

5\. \*\*Adaptation automatique\*\* : tempo, fréquence des switches, aide (hints), complexité.

6\. \*\*Accessibilité MP\*\* : gros boutons, contraste élevé, peu d’animations, pause simple.

7\. \*\*Instrumentation\*\* : chaque essai (trial) est loggé avec temps/erreurs/switch/hints.

\---

\#\# 2\) Périmètre v1

\#\#\# Inclus

\- Session 2–5 minutes (par défaut 3 min)

\- Règles simples (3–5)

\- Stimuli simples (lettres/formes/couleurs; chiffres optionnel)

\- Deux boutons \*\*OUI\*\* et \*\*NON\*\*

\- Adaptation minimale (tempo \+ switch frequency \+ hints)

\- Export JSON \+ CSV

\- Écran Résumé (3 métriques simples)

\#\#\# Exclu (pour v1)

\- Multi-joueurs, narration, boutique, gamification lourde

\- Personnalisation avancée (avatars, etc.)

\- Auth complexe (mais prévoir \`userId\` optionnel)

\- Analyse cloud obligatoire (export local suffit)

\---

\#\# 3\) UX / Écrans

\#\#\# 3.1 Écran A — Briefing

\- Affiche la règle initiale (grande carte)

\- Bouton \*\*“Je suis prêt”\*\*

\- Option (facultatif) : “Démo 10s”

\*\*Acceptance\*\*

\- Impossible de démarrer sans avoir vu la règle (au moins 1 rendu UI).

\#\#\# 3.2 Écran B — Jeu

Layout (mobile-first) :

\- Bandeau haut : \*\*Règle active\*\* (toujours visible)

\- Centre : \*\*Stimulus\*\* (très grand)

\- Bas : Deux boutons larges

  \- ✅ OUI (j’appuie)

  \- ⛔ NON (je n’appuie pas)

\- Bouton pause (icône) accessible

\*\*Feedback\*\*

\- Par défaut : minimal (pas de “rouge/vert” agressif)

\- Au switch : micro-animation douce \+ (option) vibration courte

\#\#\# 3.3 Écran C — Résumé

Afficher :

\- \*\*Stabilité\*\* (variabilité)

\- \*\*Switch\*\* (coût de switch / erreurs post-switch)

\- \*\*Régularité\*\* (taux d’essais complétés / abandon / hints)

Boutons :

\- Rejouer

\- Export (JSON/CSV)

\- (Option) partager (si intégré)

\---

\#\# 4\) Modèle de données (contrats)

\#\#\# 4.1 Rule (règle)

\`\`\`json

{

  "id": "R2",

  "label": "Appuie si c'est un CERCLE",

  "kind": "shape\_is",

  "params": { "shape": "circle" }

}

#### Règles v1 recommandées

* `R1 kind=kind_is params={kind:"letter"} label="Appuie si c'est une LETTRE"`  
* `R2 kind=shape_is params={shape:"circle"} label="Appuie si c'est un CERCLE"`  
* `R3 kind=color_is params={color:"blue"} label="Appuie si c'est BLEU"`  
* (Option niveau 2+) `R4 kind=same_as_prev label="Appuie si c'est le MÊME qu'avant"`  
* (Option niveau 3+) `R5 kind=number_is_even label="Appuie si c'est PAIR"`

### 4.2 Stimulus

{

  "id": "S\_1042",

  "kind": "shape",

  "value": { "shape": "circle", "color": "blue" },

  "render": { "asset": "shape\_circle", "text": null }

}

**Règles de rendu**

* `render.asset` correspond à une icône/shape pack  
* `render.text` utilisé si lettre/chiffre

### 4.3 TrialMeta (moteur → UI)

{

  "trialIndex": 17,

  "isSwitchTrial": true,

  "level": 2,

  "paceMs": 1200,

  "responseWindowMs": 6000,

  "hintMode": "auto",

  "hintThresholdMs": 2000

}

### 4.4 TrialResult (export)

{

  "t": "2025-12-17T10:12:33.120Z",

  "sessionId": "sess\_abc123",

  "userId": "optional\_user",

  "trialIndex": 17,

  "ruleId": "R2",

  "stimulusId": "S\_1042",

  "stimulusKind": "shape",

  "stimulusValue": {"shape":"circle","color":"blue"},

  "isSwitchTrial": true,

  "shouldPress": true,

  "didPress": true,

  "rtMs": 1820,

  "isTimeout": false,

  "isCorrect": true,

  "hintUsed": false,

  "paceMs": 1200,

  "level": 2,

  "fatigueIndex": 0.42

}

### 4.5 SessionSummary

{

  "sessionId": "sess\_abc123",

  "startedAt": "ISO",

  "endedAt": "ISO",

  "durationMs": 180000,

  "metrics": {

    "ACC": 0.91,

    "RT\_MEDIAN\_CORRECT": 1950,

    "RTVAR\_ROBUST": 410,

    "SWITCH\_COST": 520,

    "POST\_SWITCH\_ERROR": 0.17,

    "HINT\_RATE": 0.08,

    "TIMEOUT\_RATE": 0.04

  },

  "config": {

    "responseWindowMs": 6000,

    "initialPaceMs": 1200,

    "switchEvery": {"min": 8, "max": 14},

    "ruleset": \["R1","R2","R3","R4"\],

    "levelStart": 1

  }

}

---

## 5\) API interne (moteur) — interfaces attendues

### 5.1 Fonctions moteur

* `startSession(config) -> {sessionId, initialRule, firstTrial}`  
* `commitResponse(input) -> {nextTrial, uiEvents[], pacingMs}`  
* `endSession() -> {summary, exportJson, exportCsv}`

### 5.2 Input commitResponse (UI → moteur)

{

  "sessionId":"sess\_abc123",

  "trialIndex":17,

  "action":"YES",   // "YES" | "NO"

  "rtMs":1820,

  "isTimeout":false,

  "hintUsed":false,

  "timestamp":"ISO"

}

### 5.3 UI Events (moteur → UI)

Liste d’événements ordonnée :

* `SHOW_RULE {rule, mode:"confirm"|"auto"}`  
* `PRESENT_STIMULUS {stimulus, trialMeta}`  
* `SHOW_HINT {type:"highlight_rule"}`  
* `MICRO_FEEDBACK {type:"neutral_ok"|"take_your_time"|"pause"}`  
* `SESSION_END {summary}`

---

## 6\) Logique de session (machine à états front)

### États UI

* `IDLE`  
* `RULE_BRIEFING`  
* `TRIAL_ACTIVE` (stimulus affiché \+ attente réponse)  
* `INTER_TRIAL` (pacing)  
* `PAUSED`  
* `SUMMARY`

### Transitions (simplifiées)

* `IDLE -> RULE_BRIEFING -> TRIAL_ACTIVE -> INTER_TRIAL -> TRIAL_ACTIVE ... -> SUMMARY`  
* Pause : `* -> PAUSED -> (return previous state)`

**Requirement**

* Aucune double soumission : une réponse max par trial.  
* Timeout \-\> envoi `action="NO", isTimeout=true`.

---

## 7\) Adaptation (spécification minimale, deterministic)

### Variables d’adaptation (state)

* `paceMs` (900–2000)  
* `switchEvery.min/max` (min 6–max 22\)  
* `hintMode` ("off"|"auto")  
* `level` (1..N)

### Rolling stats (fenêtre glissante 10 derniers trials)

* `accRecent`  
* `rtMedianRecent` (correct)  
* `rtVarRecent` (robuste)  
* `switchCostRecent`  
* `postSwitchErrorRecent`  
* `timeoutRecent`

### FatigueIndex (0..1)

Définition (simple et stable) :

* normaliser `rtTrendUp` \+ `rtVarRecent` \+ `timeoutRecent` \+ `errorRecent`  
* clamp 0..1

### Règles d’adaptation (priorité)

1. **Sécurité / confort**  
     
* si `streakErrors >= 2` OU `fatigueIndex > 0.7` :  
    
  * `paceMs += 150` (cap 2000\)  
  * `hintMode="auto"`  
  * réduire fréquence de switch : `switchEvery.min += 1`, `switchEvery.max += 1`  
2. **Progression douce**  
     
* si `streakCorrect >= 6` ET `fatigueIndex < 0.4` :  
    
  * `paceMs -= 100` (cap 900\)  
  * `hintMode="off"`  
  * augmenter un peu la fréquence de switch : `switchEvery.min -= 1`, `switchEvery.max -= 1` (caps)  
3. **Complexité**  
     
* si stabilité durable (ex: 2 fenêtres glissantes consécutives avec `ACC>0.9` et `postSwitchError<0.2`) :  
    
  * `level += 1` (cap)


* si difficulté persistante (ex: 2 fenêtres avec `ACC<0.75`) :  
    
  * `level = max(1, level-1)`

---

## 8\) Génération stimuli (contrôle de distribution)

**Objectif :** éviter biais “toujours oui” / “toujours non”.

### Contraintes

* Taux cible `shouldPress` \~ 0.5 sur une fenêtre de 20 trials  
* Éviter répétitions identiques trop fréquentes (sauf règle R4 “même qu’avant”)  
* Palette stable (pas trop de couleurs) : 3 couleurs max (ex: bleu, rouge, gris)

### Pseudocode

* générer candidat aléatoire  
* calculer `shouldPress` via règle courante  
* accepter si distribution reste proche de cible et si contraintes de répétition respectées

---

## 9\) Accessibilité & ergonomie (exigences testables)

* Boutons : hauteur min 64px; largeur \>= 40% écran; spacing \>= 12px  
    
* Police règle : \>= 20px  
    
* Stimulus : \>= 96px (ou équivalent)  
    
* Contraste : ratio élevé (utiliser design system accessible)  
    
* Animations : éviter clignotement / transitions rapides  
    
* Pause disponible en 1 tap  
    
* Mode “tremor-friendly” (option) :  
    
  * tolérance tap (debounce)  
  * ignorer “drag” minime  
  * zone de hitbox élargie

---

## 10\) Export & fichiers

### JSON

* `session_export_<sessionId>.json` : `{summary, trials[]}`

### CSV

* colonnes :  
    
  * `t,sessionId,userId,trialIndex,ruleId,stimulusId,stimulusKind,stimulusValue,isSwitchTrial,shouldPress,didPress,rtMs,isTimeout,isCorrect,hintUsed,paceMs,level,fatigueIndex`

**Requirement**

* Export doit être possible offline (download local / partage natif mobile).

---

## 11\) Observabilité / debug (pour dev)

* Mode debug : affiche discretement `trialIndex`, `isSwitchTrial`, `shouldPress` (dev-only)  
* Seed RNG optionnel (reproductibilité)  
* Logs console désactivables

---

## 12\) Plan de tests (acceptance \+ edge cases)

### Fonctionnel

1. La règle s’affiche au début \+ après chaque switch.  
2. Chaque stimulus produit 0 ou 1 réponse; double clic ne doit pas doubler un trial.  
3. Timeout produit un TrialResult avec `isTimeout=true` et `didPress=false`.  
4. Export JSON/CSV contient exactement N trials joués.  
5. Pause stoppe timers (timeout/hints) et reprend proprement.

### Adaptation

6. Deux erreurs consécutives \=\> `paceMs` augmente (dans le trial suivant).  
7. Série de bonnes réponses \+ faible fatigue \=\> `paceMs` diminue progressivement.  
8. Post-switch errors élevés \=\> switchEvery s’élargit (moins fréquent).

### Edge cases

9. L’utilisateur tape pendant le switch banner : ignorer jusqu’à stimulus visible.  
10. App en arrière-plan : auto-pause \+ reprise sans corrompre les essais.  
11. Device slow : utiliser `performance.now()` pour RT; pas `Date.now()` seul.  
12. Accessibilité : tailles min respectées sur petits écrans.

---

## 13\) Stack & structure de repo (suggestion)

### HTML/JS pur

* `engine.js`, `ui.js`, `screens.js`, `export.js`, `assets/*`

---

## 14\) “Prompt” pour un codeur IA (copier-coller)

Implémente le mini-jeu “Prends Ton Temps” selon ces spécifications. Contraintes : règle visible, OUI/NON, timeout=NO, adaptation tempo/switch/hints, export JSON+CSV, pause, accessibilité MP. Sépare le code en : engine (state machine \+ adaptation \+ logs), UI (render), export (CSV/JSON). Fournis : 1\) code complet, 2\) tests unitaires pour adaptation/export, 3\) README exécution.

---

## 15\) Paramètres par défaut

* `durationMs = 180000` (3 min)  
* `responseWindowMs = 6000`  
* `initialPaceMs = 1200`  
* `switchEvery = {min: 8, max: 14}`  
* `hintMode = "auto"` si erreurs/latence, sinon "off"  
* `ruleset = [R1,R2,R3]` (ajouter R4 au niveau 2\)

---

## 16\) Définition de “Done”

* On peut jouer 3 minutes sans bug (mobile \+ desktop)  
* Export JSON/CSV correct  
* Adaptation observable (pace/switch/hints changent)  
* UI lisible et utilisable par une personne avec tremblement \+ lenteur  
* Résumé session affiché

