# Comment créer des screenshots mobile de PTT

## Méthode 1 : Utiliser Chrome DevTools (Recommandé)

1. **Ouvrir l'application** :
   - Ouvrir `index.html` dans Google Chrome
   - Ou accéder à l'URL déployée

2. **Activer le mode mobile** :
   - Appuyer sur `F12` pour ouvrir DevTools
   - Cliquer sur l'icône de toggle device toolbar (ou `Ctrl+Shift+M`)

3. **Configurer la taille d'écran** :
   - Sélectionner "Responsive" ou un device spécifique
   - **Pour mobile moyen** :
     - Width: `375px` (iPhone SE, standard)
     - Ou: `390px` (iPhone 12/13/14)
     - Ou: `393px` (Pixel 7)
   - Height: `667px` à `844px` selon le device

4. **Prendre les screenshots** :
   - Méthode A : Clic droit sur la page → "Capture screenshot"
   - Méthode B : `Ctrl+Shift+P` → taper "screenshot" → "Capture full size screenshot"

## Méthode 2 : Utiliser le script Node.js (si Chrome installé)

```bash
# Installer les dépendances
npm init -y
npm install puppeteer

# Exécuter le script de screenshot
node generate-screenshots.js
```

## Écrans à capturer

### 1. **Écran Briefing** (screen-briefing)
- État initial de l'application
- Affiche la règle du jeu
- Bouton "Je suis prêt·e"

### 2. **Écran Jeu** (screen-game)
- Affichage d'un stimulus (lettre, chiffre ou forme)
- Boutons OUI/NON
- Bannière de règle en haut

### 3. **Écran Résumé** (screen-summary)
- Métriques de la session
- Boutons "Rejouer" et paramètres

### 4. **Écran Paramètres** (screen-settings)
- Configuration de la durée
- Boutons d'export et de suppression

### 5. **Écran Aide** (screen-help)
- Mode d'emploi détaillé
- Explications des règles

### 6. **Écran Statistiques** (screen-stats)
- Comparaison avec historique
- Graphiques et barres

## Tailles recommandées pour screenshots

- **Mobile petit** : 320x568 (iPhone SE gen 1)
- **Mobile moyen** : 375x667 (iPhone 8, standard)
- **Mobile large** : 414x896 (iPhone 11 Pro Max)
- **Android moyen** : 360x740 (Pixel 4)
- **Android Pixel** : 393x851 (Pixel 7)

## Format de nommage

```
ptt-mobile-[ecran]-[taille].png

Exemples:
- ptt-mobile-briefing-375x667.png
- ptt-mobile-game-375x667.png
- ptt-mobile-summary-375x667.png
- ptt-mobile-settings-375x667.png
- ptt-mobile-help-375x667.png
- ptt-mobile-stats-375x667.png
```
