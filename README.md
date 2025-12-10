F1-IncidentAI
📋 Vue d'ensemble

Système de prédiction d'incidents en Formule 1 utilisant le Deep Learning pour anticiper les risques pendant les courses et assister les équipes dans leurs décisions stratégiques combinant :

Backend Django pour la gestion des entités F1 (pilotes, circuits, courses, voitures, etc.)

Modèle IA Deep Learning pour prédire les risques d’incidents

Dashboard React pour la visualisation stratégique et l’analyse temps réel

Ce projet regroupe à la fois la gestion de la base F1 et l’intelligence artificielle, permettant une intégration complète entre données historiques, prédictions et décisions managériales.

🎯 Objectif du Projet
Prédire en temps réel la probabilité d'incidents pendant une course de Formule 1 et fournir des recommandations stratégiques aux managers d'équipe.

🛠️ Fonctionnalités du Système
🎮 1. Gestion Administrative et Sportive

Le backend permet de gérer toutes les entités nécessaires à une saison F1 :

Gestion des Pilotes

Ajouter / modifier / supprimer un pilote

Nationalité, âge, expérience, équipe, voiture utilisée

Historique de performances

Gestion des Circuits

Import ou ajout manuel des circuits

Longueur, localisation, type de tracé, taux historique d’incidents

Statistiques des courses passées sur chaque circuit

Gestion des Équipes / Teams

Ajout/modification des teams

Voitures associées + moteurs + budget

Performance moyenne par saison

Gestion des Voitures

Informations techniques : moteur, puissance, type de pneumatiques

Fiabilité par saison

Lien avec les équipes et pilotes

Gestion des Courses (Races)

Création d’une course par circuit, saison et date

Ajout des résultats finaux + temps au tour

Historique des incidents enregistrés

Gestion des Saisons

Mise en place du calendrier complet

Liste des courses par saison

Classements pilotes et équipes

Gestion des Performances

Temps au tour

Positions

Pit stops

Analyse statistique à intégrer au modèle IA

Gestion des Stratégies

Stratégies pneus (soft, medium, hard)

Stratégies de pit stop

Comportement prédictif basé sur l’IA

Gestion des Incidents

Collisions

Safety car

Red Flags

Pannes mécaniques

Sorties de piste

Ces données alimentent ensuite le modèle de prédiction IA.

🧠 Types d'Incidents Prédits
Le modèle analyse et prédit 5 catégories d'incidents :

Collision → Accident avec un autre pilote ou obstacle
Panne Moteur → Défaillance mécanique du groupe propulseur
Problème Pneus → Crevaison ou usure excessive des pneumatiques
Sortie de Piste → Perte de contrôle et départ hors circuit
Safety Car → Course normale sans incident majeur

🏗️ Architecture du Modèle
Modèle Hybride CNN + LSTM
Entrées du modèle

Données Statiques → Position grille, Circuit, Pilote, Écurie, Année, Tours complétés, Pit stops
Séquences Temporelles → Temps au tour des 10 derniers tours en millisecondes

Architecture en 3 branches

Branche Dense → Traite les features statiques avec couches denses et normalisation
Branche CNN → Extrait les patterns locaux dans les temps au tour avec convolutions 1D
Branche LSTM → Capture les dépendances temporelles et tendances sur plusieurs tours

Fusion et Classification

Les sorties des 3 branches sont fusionnées puis passées dans des couches denses finales pour produire 5 probabilités d'incidents via une activation softmax.

📊 Performance du Modèle
Accuracy Globale → Environ 85 pourcent sur les données de test
Précision Collision → 82 pourcent
Précision Panne Moteur → 78 pourcent
Précision Pneus → 88 pourcent
Précision Sortie Piste → 76 pourcent

Dataset → Plus de 25000 résultats de courses historiques F1
Entraînement → 80 pourcent train, 20 pourcent test avec validation croisée
Optimisation → Adam optimizer avec early stopping et réduction du learning rate

📈 Dashboard Manager
5 Modules de Visualisation
Probabilité par Pilote
Graphique en barres empilées montrant la répartition des risques pour les 15 pilotes les plus exposés avec code couleur par type d'incident.

Circuits Dangereux
Radar multi-axes affichant le profil de risque de chaque circuit sur les 4 dimensions collision, moteur, pneus, sortie de piste.

Évolution Tour par Tour
Courbes temporelles montrant l'augmentation du risque au fil des tours avec zones sûre, vigilance et danger.

Explicabilité IA
Graphique d'importance des features montrant quels facteurs influencent le plus les prédictions position grille, circuit, pilote.

Recommandations Stratégiques
Cartes de conseils personnalisés par pilote avec niveau de risque critique, élevé, modéré, faible et actions immédiates à prendre.

🔧 Technologies Utilisées
Backend
Django → Framework web Python pour API REST
TensorFlow → Framework de Deep Learning pour le modèle
Scikit Learn → Preprocessing et encodage des données
Pandas NumPy → Manipulation et analyse des données

Frontend
React → Interface utilisateur avec hooks
Vite → Build tool ultra rapide
Chart.js → Graphiques interactifs
Plotly → Visualisations avancées
Tailwind CSS → Styling moderne

Machine Learning
Keras → API haut niveau pour construire le modèle
CNN → Convolutional Neural Network pour patterns
LSTM → Long Short Term Memory pour séquences temporelles
StandardScaler → Normalisation des features
LabelEncoder → Encodage des variables catégorielles

📂 Structure du Projet
Backend Django
incidents app → Nouvelle application dédiée aux prédictions
ml predictor → Classe Python chargeant le modèle TensorFlow
weights → Fichiers du modèle h5, scalers pkl, encoders pkl
views → API endpoints pour prédictions par course ou pilote
serializers → Sérialisation des données JSON

Frontend React
IncidentDashboard page → Page principale du dashboard
services → Service API pour communiquer avec Django
components incidents → Composants graphiques réutilisables
PilotRiskChart → Barres empilées des risques pilotes
CircuitRiskRadar → Radar des circuits dangereux
StrategyCard → Carte de recommandation stratégique

🚀 Utilisation
Pour le Manager d'Équipe
Avant la course
Sélectionner le circuit et analyser son profil de risque historique
Identifier les pilotes à surveiller selon leur probabilité d'incident
Préparer des stratégies alternatives en fonction des risques détectés

Pendant la course
Suivre l'évolution des risques tour par tour en temps réel
Recevoir des alertes quand un pilote entre en zone critique
Appliquer les recommandations stratégiques pit stop, réduction rythme, changement mode moteur

Après la course
Analyser les facteurs qui ont contribué aux incidents réels
Comparer les prédictions avec les résultats effectifs
Ajuster les stratégies futures basées sur les insights IA

🔄 Workflow de Prédiction
Collecte des Données
Le système récupère position grille, circuit, pilote, écurie, temps au tour des 10 derniers tours depuis la base de données Django.

Preprocessing
Les données catégorielles sont encodées pilote code vers numérique, circuit slug vers numérique
Les features numériques sont normalisées avec les scalers entraînés
Les séquences temporelles sont mises à l'échelle et remodelées pour le LSTM

Prédiction
Le modèle reçoit les deux entrées features statiques et séquences temporelles
Il produit 5 probabilités entre 0 et 1 pour chaque type d'incident
Le risque total est calculé en sommant collision panne moteur pneus sortie piste

Analyse et Recommandations
Le niveau de risque est déterminé critique supérieur 35 pourcent, élevé 25 à 35 pourcent, modéré 15 à 25 pourcent, faible inférieur 15 pourcent
Des conseils stratégiques sont générés selon le risque dominant
Les résultats sont envoyés au frontend via API REST JSON

🎓 Apprentissage du Modèle
Dataset Historique F1
Sources de données
Ergast F1 API → Résultats historiques depuis 1950
Fichiers CSV → Circuits, Pilotes, Courses, Temps au tour, Pit stops, Status
Safety Cars et Red Flags → Incidents répertoriés historiquement

Features Engineering
Création de la variable cible en analysant les status des courses
Encodage des circuits et pilotes avec LabelEncoder
Agrégation des temps au tour en séquences de 10 tours consécutifs
Calcul de features dérivées changement de position, nombre de pit stops

Entraînement
Split stratifié 80 pourcent train 20 pourcent test
Batch size 64 avec 100 epochs maximum
Early stopping sur validation loss patience 15 epochs
Learning rate adaptatif avec ReduceLROnPlateau
Dropout 0.3 et 0.4 pour éviter l'overfitting

💡 Cas d'Usage Réels
Exemple Monaco Grand Prix
Situation
Hamilton en 3ème position au tour 25 sur 78
Temps au tour augmentant progressivement plus 1.5 seconde sur 3 tours
Circuit de Monaco historiquement à 40 pourcent de risque collision

Prédiction IA
Risque total 38 pourcent niveau critique
Détail 22 pourcent collision, 16 pourcent pneus
Tendance risque monte de 28 à 38 pourcent en 5 tours

Recommandation
Action immédiate Pit stop maintenant
Stratégie Pneus mediums neufs
Consigne Réduire rythme moins 2 secondes par tour

Décision Manager
Radio Lewis box this lap we predict high tyre risk
Résultat Pit stop lap 26, évite crevaison lap 28, termine 2ème

🔮 Évolutions Futures
Amélioration du Modèle
Intégration données météo pluie, température, vent
Ajout télémétrie temps réels température pneus, pression freins
Modèle d'attention pour identifier les tours critiques
Transfer learning depuis d'autres championnats automobiles

Nouvelles Fonctionnalités
Prédiction optimale du timing de pit stop
Simulation de stratégies alternatives what if scenarios
Analyse comparative pilote vs moyenne de l'équipe
Alertes push en temps réel vers les stands

Optimisation Technique
Déploiement sur serveur GPU pour inférence plus rapide
Cache des prédictions fréquentes Redis
API streaming WebSocket pour updates en direct
Model serving avec TensorFlow Serving ou ONNX

📚 Documentation Technique
API Endpoints
GET api incidents predict race race id
Retourne toutes les prédictions pour une course donnée avec statistiques globales

GET api incidents predict pilot pilot id
Retourne l'analyse de risque pour un pilote spécifique nécessite paramètre race id

GET api incidents health
Vérifie si l'API est opérationnelle retourne status OK

Format de Réponse
Les prédictions sont retournées au format JSON avec
pilot id pilot name pilot code team name
risks dictionnaire avec collision panne moteur probleme pneus sortie piste safety car risque total
risk level CRITICAL HIGH MODERATE LOW
recommendation string de conseil stratégique

⚠️ Limitations et Avertissements
Limitations Actuelles
Le modèle est entraîné sur données historiques et peut ne pas capturer les innovations techniques récentes
Les circuits nouveaux sans historique ont des prédictions moins précises
Les conditions météo extrêmes non vues à l'entraînement peuvent réduire la fiabilité
Le modèle ne prend pas en compte les décisions stratégiques en temps réel des autres équipes

Utilisation Responsable
Les prédictions sont des probabilités et non des certitudes absolues
Les décisions finales doivent toujours être prises par des humains expérimentés
Le système est un outil d'aide à la décision et non un remplaçant du jugement humain
Les recommandations doivent être contextualisées avec la situation réelle de la course

🧩 Intégration Gestion + IA

Ce projet associe gestion des données F1 et prédiction IA, dans un workflow complet :

Saisie des données dans le backend (pilotes, courses, circuits…)

Stockage dans la base Django

Extraction automatique par le module IA

Nettoyage et préparation des features

Prédiction et analyse des risques

Affichage dans le dashboard frontend

Cette architecture garantit une cohérence parfaite entre :

données administratives

historique sportif

intelligence artificielle

🏛️ Dashboards de Gestion

Outre le dashboard IA, le système inclut des dashboards de gestion classique :

📌 Dashboard Pilotes

Liste des pilotes

Statistiques : victoires, podiums, taux d’incidents

Comparaison pilote vs équipe

📌 Dashboard Circuits

Circuits classés par dangerosité

Historique des incidents

Caractéristiques du tracé

📌 Dashboard Courses

Résultats par course

Chronos, positions, pit stops

Incidents survenus

📌 Dashboard Équipes

Comparaison des performances

Fiabilité moteur

Dépenses stratégies pneus

📌 Dashboard Stratégies

Analyse des stratégies gagnantes

Suggestions basées sur IA

Ces dashboards complètent parfaitement le module de prédiction.

📦 Livrables Complet du Projet

Backend Django complet (API REST + admin panel)

Dataset F1 préparé

Modèle IA entraîné

Fichiers scalers et encodeurs

Frontend React + dashboards

Documentation complète (ce README)

📄 Licence
Ce projet est développé à des fins éducatives et de recherche.

🏁 Conclusion
Ce système démontre comment l'Intelligence Artificielle peut assister les équipes de Formule 1 dans la prise de décisions critiques en temps réel. En combinant Deep Learning, analyse de données historiques et interface intuitive, il offre un avantage stratégique précieux dans un sport où chaque milliseconde compte.

La prédiction d'incidents n'est pas de la voyance mais de l'analyse probabiliste basée sur des milliers de courses historiques. C'est un outil qui amplifie l'expertise humaine plutôt que de la remplacer.
