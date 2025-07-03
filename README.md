# TrouvTout

TrouvTout est une plateforme d’annonces qui permet aux utilisateurs de s’inscrire, se connecter, publier des annonces avec photo, et parcourir toutes les annonces en ligne.

## Fonctionnalités

- Authentification (inscription, connexion, session sécurisée)
- Création d’annonces (titre, description, prix, lieu, catégorie, image)
- Upload et affichage d’images (stockage Supabase en mode public)
- Sécurité avancée via RLS sur les tables principales
- Affichage public de toutes les annonces (accessible sans compte)
- Espace personnel “Mes annonces” (accès protégé)

## Installation

1. **Cloner le projet :**
   ```bash
   git clone https://github.com/tonuser/trouvtout.git
   cd trouvtout
   ```

2. **Configurer les variables d’environnement :**
   - Duplique le fichier `.env.example` en `.env`
   - Renseigne les valeurs de ton projet Supabase

3. **Installer les dépendances :**
   ```bash
   npm install
   ```

4. **Lancer le serveur :**
   ```bash
   npm run dev
   ```

## Supabase

- Crée les tables nécessaires : `Users`, `Ads`, `Images`, `Categories`
- Configure un bucket **public** appelé `ads-images` dans Storage
- Active et configure les politiques RLS recommandées pour la sécurité

## Développement

- Backend : Node.js / Express, gestion des fichiers avec Multer
- Frontend : HTML & JavaScript vanilla, DOM sécurisé sans innerHTML
- Auth/session : iron-session/express
- Toutes les interactions avec Supabase sont réalisées côté modèle backend

---

**Projet open source réalisé pour l’apprentissage et le fun.**
