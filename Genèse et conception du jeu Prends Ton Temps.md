# Genèse et conception du jeu **Prends Ton Temps**

*Récit structuré des étapes de conception, de l’idée clinique au produit fini*

---

## 1\. Point de départ : comprendre les atteintes cognitives de la MP

Le projet est né d’une question clinique simple mais structurante :  
**quelles fonctions cognitives sont touchées par la maladie de Parkinson ?**

L’analyse initiale a permis d’identifier que, au-delà des troubles moteurs, la MP affecte de manière fréquente et précoce :

- les **fonctions exécutives** (flexibilité mentale, inhibition, planification),  
- l’**attention** (soutenue et divisée),  
- la **mémoire de travail**,  
- la **vitesse de traitement** (bradyphrénie), avec une grande variabilité interindividuelle et une évolution progressive.

Cette cartographie a posé une contrainte fondatrice :  
👉 le jeu devait être **cliniquement pertinent**, mais aussi **adaptable**, **non stigmatisant** et **respectueux du rythme** de chaque personne.

---

## 2\. Choix d’un cadre décisionnel : fréquence × sensibilité à la stimulation

Afin d’orienter la conception vers un impact réel, les symptômes cognitifs ont ensuite été classés selon deux axes :

- leur **fréquence** chez les personnes vivant avec une MP,  
- leur **sensibilité à la stimulation cognitive**.

Cette matrice a permis de dégager un noyau prioritaire :

- fonctions **très fréquentes**,  
- et **fortement modulables** par l’entraînement et la compensation.

Il est alors apparu clairement que le cœur du jeu devait cibler :

- l’attention,  
- la mémoire de travail,  
- la flexibilité mentale,  
- la gestion du changement de règle, plutôt que des fonctions plus tardives ou moins plastiques.

---

## 3\. Passage à l’outil : le choix d’un serious game ciblé

À partir de cette matrice, la décision a été prise de concevoir un **mini-jeu de stimulation cognitive**, et non un test neuropsychologique déguisé.

Le parti pris fondamental a été le suivant :

le jeu ne doit pas évaluer la personne,  
il doit **s’adapter à elle**, silencieusement.

Cela a conduit à un cahier des charges clair :

- pas de pression temporelle punitive,  
- pas de score anxiogène,  
- pas d’échec visible,  
- mais une **mesure fine et implicite** des comportements cognitifs.

---

## 4\. Conception du gameplay : un MVP volontairement simple

Un premier mini-jeu MVP a alors été défini, autour d’un principe central : **répondre OUI / NON à des stimuli successifs selon une règle active,**  
**cette règle changeant à intervalles imprévisibles mais annoncés.**

Ce concept — baptisé plus tard *Switch & Hold* en interne — permet d’entraîner simultanément :

- le maintien d’une règle en mémoire de travail,  
- la capacité à ignorer des distracteurs,  
- la flexibilité cognitive lors des changements,  
- sans jamais pénaliser la lenteur.

Le cœur du défi n’est donc pas la vitesse,  
mais le **maintien et le changement contrôlé**.

---

## 5\. Intégration du temps : une adaptation au rythme, pas une contrainte

Très tôt, un point clé est apparu :  
dans la MP, le temps est une variable clinique majeure.

Le jeu a donc été conçu pour :

- **mesurer** le temps de réponse,  
- mais **ne jamais l’imposer**.

Concrètement :

- chaque stimulus dispose d’une large fenêtre de réponse,  
- l’absence de réponse est interprétée par défaut comme “NON”,  
- le tempo du jeu s’adapte automatiquement à la fatigue, aux erreurs ou à la variabilité.

Ainsi, le jeu ralentit quand c’est nécessaire,  
et n’accélère que lorsque la stabilité est manifeste.

---

## 6\. Instrumentation clinique implicite

Sans jamais afficher de test ou de score, le jeu collecte néanmoins des indicateurs riches :

- temps de réponse médian,  
- variabilité intra-session,  
- coût cognitif des changements de règle,  
- erreurs post-switch,  
- recours aux aides,  
- abandon ou pauses.

Ces données permettent :

- un **suivi longitudinal**,  
- une lecture indirecte des fluctuations ON/OFF,  
- et une exploitation clinique ou de recherche, sans alourdir l’expérience patient.

---

## 7\. Spécifications techniques : séparer moteur et interface

Pour garantir robustesse et évolutivité, l’architecture a été pensée en deux couches :

1. un **moteur cognitif** (règles, adaptation, métriques),  
2. une **interface sobre et accessible** (UI).

Les spécifications détaillées ont ensuite été formalisées :

- structures de données (stimuli, règles, essais),  
- machine à états front-end,  
- contrats JSON/CSV d’export,  
- règles d’adaptation déterministes.

L’objectif était clair :  
👉 permettre à un **codeur IA ou humain** d’implémenter le jeu sans ambiguïté.

---

## 8\. Design et identité : incarner la philosophie du jeu

Une fois le gameplay stabilisé, la question du nom et de l’identité s’est imposée.

Plusieurs propositions ont été testées auprès de publics simulés :

- patients,  
- cliniciens,  
- partenaires,  
- grand public.

Le nom **Prends Ton Temps** s’est imposé naturellement, car il :

- reflète la philosophie du jeu,  
- valorise la lenteur comme une stratégie,  
- désamorce l’anxiété de performance,  
- et parle immédiatement aux personnes concernées.

---

## 9\. Construction d’une charte cohérente MP-friendly

Une charte d’identité complète a ensuite été définie pour garantir la cohérence :

- palette douce et accessible,  
- typographie lisible,  
- boutons larges et tolérants aux tremblements,  
- micro-textes non évaluatifs,  
- absence de signaux d’urgence.

Chaque choix visuel devait répondre à une question simple :

est-ce que cela rassure et respecte le rythme de la personne ?

Si la réponse était non, l’élément était rejeté.

---

## 10\. Résultat : un jeu qui accompagne, plutôt qu’il ne teste

Au terme de ce processus, *Prends Ton Temps* est devenu :

- un **outil de stimulation cognitive**,  
- un **capteur longitudinal discret**,  
- un **espace sûr** pour les personnes vivant avec une MP.

Le jeu n’entraîne pas **contre** la maladie,  
il entraîne **avec la personne**,  
en respectant ses fluctuations, sa lenteur, et sa dignité.

---

## 11\. Conclusion

La conception de *Prends Ton Temps* n’a pas suivi une logique descendante classique (clinique → test → score),  
mais une logique **human-centered**, où :

- la clinique informe le design,  
- le design protège la personne,  
- et la technologie s’efface au profit de l’expérience.

Ce cheminement progressif, itératif et intentionnel constitue aujourd’hui le socle du jeu.

---

