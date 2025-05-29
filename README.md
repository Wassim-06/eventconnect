# EventConnect - Votre Plateforme de Gestion d'Événements Tout-en-Un

![EventConnect Logo Placeholder](/public/Logo.png)

EventConnect est une application web full-stack moderne et performante, conçue pour simplifier la création, la gestion, la promotion et l'analyse d'événements. Elle offre une suite complète d'outils pour les organisateurs, leur permettant d'engager leur public et de prendre des décisions éclairées grâce à une interface utilisateur intuitive et des fonctionnalités robustes.

## ✨ Fonctionnalités Clés

*   **Authentification Sécurisée** : Système d'inscription et de connexion basé sur les tokens (JWT) pour les organisateurs.
*   **Tableau de Bord Intuitif** : Un hub centralisé pour une gestion efficace des événements, la visualisation des analyses et l'accès aux paramètres du compte.
*   **Gestion Complète des Événements** :
    *   Création d'événements détaillés : titres, descriptions, dates, lieux, images, catégories, capacité maximale.
    *   Publication et dépublication d'événements.
    *   Affichage clair de la liste des événements créés par l'organisateur.
    *   Suppression sécurisée d'événements avec confirmation.
    *   (Prochainement) Modification des événements existants.
*   **Catalogue Public d'Événements** : Une page dédiée permettant aux utilisateurs de découvrir les événements publiés.
*   **Analyses et Rapports** : Une section Analytics pour visualiser les performances et tendances des événements (actuellement avec des données de démonstration, prête pour l'intégration de données réelles).
*   **Paramètres Utilisateur Personnalisables** : Gestion du profil, des préférences de notification et des options de sécurité.
*   **Aide et Support Intégrés** : Section FAQ, informations de contact et liens vers la documentation.
*   **Design Réactif et Moderne** : Expérience utilisateur optimisée sur ordinateurs de bureau, tablettes et mobiles.
*   **Notifications en Temps Réel** : Feedback utilisateur clair et instantané grâce à `react-hot-toast`.
*   **Interface Soignée** : Utilisation de `lucide-react` pour des icônes cohérentes et esthétiques.

## 🛠️ Stack Technique

Ce projet met en œuvre des technologies modernes et des bonnes pratiques pour garantir performance, maintenabilité et une excellente expérience développeur :

*   **Frontend** :
    *   **Next.js 14+ (App Router)** : Framework React de production avec rendu côté serveur (SSR), génération de sites statiques (SSG), et une architecture moderne.
    *   **React 18** : Bibliothèque JavaScript pour la construction d'interfaces utilisateur dynamiques et interactives.
    *   **TypeScript** : Sur-ensemble de JavaScript apportant un typage statique pour une meilleure qualité de code, une détection précoce des erreurs et une auto-complétion améliorée.
    *   **Tailwind CSS** : Framework CSS utility-first pour un développement UI rapide et personnalisable.
    *   **Lucide React**: Bibliothèque d'icônes SVG légères et personnalisables.
    *   **Recharts**: Bibliothèque de graphiques composable pour la visualisation de données.
    *   **React Hot Toast**: Notifications toast élégantes et non intrusives.
*   **Backend (API)** :
    *   **Next.js API Routes** : Construction d'endpoints API robustes et scalables directement au sein du projet Next.js.
    *   **Prisma ORM**: ORM de nouvelle génération pour une interaction type-safe avec la base de données (compatible PostgreSQL, MySQL, SQLite, SQL Server, MongoDB).
*   **Authentification** :
    *   Système d'authentification basé sur les tokens JWT, avec stockage sécurisé côté client (`localStorage`).
    *   Middleware d'authentification pour la protection des routes API.
*   **Base de Données** :
    *   (Précisez votre base de données, ex: PostgreSQL, MongoDB). Prisma gère la communication.
*   **Qualité de Code et Outillage** :
    *   **ESLint & Prettier**: Pour le linting et le formatage automatique du code, garantissant une base de code cohérente et propre.
    *   **Gestion des Dépendances**: (npm/yarn/pnpm - précisez celui que vous utilisez).

## 📂 Structure du Projet

Le projet est organisé de manière logique pour faciliter la navigation et la maintenance :

