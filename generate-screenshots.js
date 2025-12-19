/**
 * Script Node.js pour générer des screenshots mobile de PTT
 *
 * Prérequis:
 * npm install puppeteer
 *
 * Usage:
 * node generate-screenshots.js
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// Configuration
const CONFIG = {
    // Taille mobile moyenne (iPhone 8/SE 2020)
    viewport: {
        width: 375,
        height: 667,
        deviceScaleFactor: 2, // Retina display
        isMobile: true,
        hasTouch: true,
    },

    // URL de l'application (à adapter)
    appUrl: 'file://' + path.resolve(__dirname, 'index.html'),

    // Dossier de sortie
    outputDir: path.resolve(__dirname, 'screenshots'),

    // Écrans à capturer
    screens: [
        { name: 'briefing', selector: '#screen-briefing', waitTime: 1000 },
        { name: 'game', selector: '#screen-game', waitTime: 2000, setup: async (page) => {
            // Cliquer sur "Je suis prêt" pour voir l'écran de jeu
            await page.click('#btn-ready');
            await page.waitForTimeout(1500);
        }},
        { name: 'summary', selector: '#screen-summary', waitTime: 1000, setup: async (page) => {
            // Simuler une session complète (ou charger des données de test)
            await page.evaluate(() => {
                document.getElementById('metric-stability').textContent = '8.5/10';
                document.getElementById('metric-flexibility').textContent = '7.8/10';
                document.getElementById('metric-regularity').textContent = 'Bon';
            });
        }},
        { name: 'settings', selector: '#screen-settings', waitTime: 1000, setup: async (page) => {
            await page.click('#btn-settings-briefing');
            await page.waitForTimeout(500);
        }},
        { name: 'help', selector: '#screen-help', waitTime: 1000, setup: async (page) => {
            await page.click('#btn-settings-briefing');
            await page.waitForTimeout(300);
            await page.click('#btn-help');
            await page.waitForTimeout(500);
        }},
        { name: 'stats', selector: '#screen-stats', waitTime: 1000, setup: async (page) => {
            await page.click('#btn-settings-briefing');
            await page.waitForTimeout(300);
            await page.click('#btn-stats');
            await page.waitForTimeout(500);
        }},
    ]
};

async function generateScreenshots() {
    // Créer le dossier de sortie s'il n'existe pas
    if (!fs.existsSync(CONFIG.outputDir)) {
        fs.mkdirSync(CONFIG.outputDir, { recursive: true });
    }

    console.log('🚀 Lancement de Puppeteer...');

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();

        // Configurer le viewport mobile
        await page.setViewport(CONFIG.viewport);

        console.log(`📱 Viewport configuré: ${CONFIG.viewport.width}x${CONFIG.viewport.height}`);

        // Charger l'application
        console.log(`🌐 Chargement de l'application: ${CONFIG.appUrl}`);
        await page.goto(CONFIG.appUrl, { waitUntil: 'networkidle0' });

        // Générer les screenshots pour chaque écran
        for (const screen of CONFIG.screens) {
            console.log(`\n📸 Capture de l'écran: ${screen.name}`);

            // Recharger la page pour repartir de l'état initial
            await page.goto(CONFIG.appUrl, { waitUntil: 'networkidle0' });
            await page.waitForTimeout(500);

            // Exécuter le setup spécifique à l'écran si défini
            if (screen.setup) {
                console.log(`   ⚙️  Configuration de l'écran...`);
                await screen.setup(page);
            }

            // Attendre que l'écran soit visible
            await page.waitForSelector(screen.selector, { visible: true });
            await page.waitForTimeout(screen.waitTime);

            // Prendre le screenshot
            const filename = `ptt-mobile-${screen.name}-${CONFIG.viewport.width}x${CONFIG.viewport.height}.png`;
            const filepath = path.join(CONFIG.outputDir, filename);

            // Screenshot de l'écran complet
            await page.screenshot({
                path: filepath,
                fullPage: true,
                type: 'png'
            });

            console.log(`   ✅ Sauvegardé: ${filename}`);
        }

        console.log('\n✨ Tous les screenshots ont été générés avec succès!');
        console.log(`📁 Dossier de sortie: ${CONFIG.outputDir}`);

    } catch (error) {
        console.error('❌ Erreur lors de la génération des screenshots:', error);
        throw error;
    } finally {
        await browser.close();
    }
}

// Exécution
(async () => {
    try {
        await generateScreenshots();
        process.exit(0);
    } catch (error) {
        console.error('Échec de la génération:', error);
        process.exit(1);
    }
})();
