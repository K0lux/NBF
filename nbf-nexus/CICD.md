# Stratégie CI/CD & DevOps - NBF Nexus

## Pipeline Overview
Notre pipeline est divisé en trois phases : **Vérification (CI)**, **Déploiement (CD)**, et **Maintenance**.

### 1. Intégration Continue (CI) - `.github/workflows/ci.yml`
Déclenché sur chaque PR vers `main`.
- **Linting** : Vérification du style de code (ESLint).
- **Type Checking** : Validation TypeScript (`tsc`).
- **Unit & Integration Tests** : Exécution de Vitest.
- **Security Scan** : Audit des dépendances (npm audit).

### 2. Déploiement Continu (CD) - Vercel Integration
- **Staging** : Chaque PR génère une "Preview URL" unique sur Vercel.
- **Production** : Le merge sur `main` déploie automatiquement sur l'URL de production.
- **Rollback** : En cas d'échec, Vercel permet un "Instant Rollback" via le tableau de bord ou la CLI.

### 3. Gestion des Versions (SemVer)
- Nous utilisons le **Semantic Versioning** (`vMAJOR.MINOR.PATCH`).
- Les releases sont automatisées via GitHub Actions lors de la création d'un tag.

---

## Gestion de l'Infrastructure (Docker & Externes)
Pour garantir que les mises à jour de nos images Docker ne cassent pas le système :
1. **Pinning** : Nous utilisons des versions spécifiques (ex: `node:20.11-alpine` et non `node:latest`).
2. **Automated Updates** : Renovate ou Dependabot propose des PRs pour monter les versions.
3. **Smoke Tests** : Avant validation, une image Docker est construite pour vérifier sa viabilité.

---

## Stratégie de Test & Documentation
### Tests
- **Unitaires** : Logique métier dans `entities` et `shared/lib`.
- **Intégration** : Interaction entre `features` et `widgets`.
- **E2E (Playwright)** : Parcours critiques (Check-in, Admin Login).

### Documentation
- **Code** : JSDoc pour les fonctions complexes.
- **Architecture** : Maintenue dans `GEMINI.md` (FSD).
- **API** : Auto-documentée via les types TypeScript.

---

## Incidents vs Bugs
| Type | Définition | Action |
| :--- | :--- | :--- |
| **Bug** | Dysfonctionnement fonctionnel | Issue standard -> Fix sur branche `fix/` |
| **Incident** | Service indisponible / Fuite de données | Rollback immédiat -> War room -> Post-mortem |
