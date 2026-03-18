# Guide de Contribution - NBF Nexus

Merci de vouloir contribuer à **NBF Nexus** ! Nous sommes un projet Open Source né au Togo 🇹🇬 et nous accueillons toutes les contributions.

## 🛠 Installation Locale (Development)

### Prérequis
- **Node.js 20+**
- **Docker Desktop** (pour Supabase local)
- **Supabase CLI**

### Étapes
1. **Cloner le repo**
   ```bash
   git clone https://github.com/K0lux/nbf-nexus.git
   cd nbf-nexus
   ```
2. **Installation**
   ```bash
   npm install
   ```
3. **Lancement de l'Infrastructure (Supabase Local)**
   ```bash
   npx supabase start
   ```
   Cela lance les containers Docker pour la base de données PostgreSQL, Auth, S3, et Edge Functions.

4. **Variables d'Environnement**
   Copiez `.env.example` en `.env.local` et remplissez vos clés API.

5. **Lancement de l'App**
   ```bash
   npm run dev
   ```

## 📜 Conventions de Code
- **Architecture** : Respectez scrupuleusement le **Feature-Sliced Design (FSD)**.
- **TypeScript** : Pas de type `any`. Utilisez des interfaces strictes.
- **Git** : Utilisez des commits conventionnels (`feat:`, `fix:`, `chore:`, `docs:`).

## 🚀 Workflow de Pull Request
1. Créez une branche à partir de `main` : `git checkout -b feat/ma-nouvelle-feature`.
2. Codez et ajoutez des tests.
3. Vérifiez que les tests passent : `npm run test`.
4. Ouvrez une Pull Request avec une description détaillée.
5. Attendez la revue technique (Code Review).
