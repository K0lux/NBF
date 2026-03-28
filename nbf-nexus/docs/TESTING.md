# Guide de Test - NBF Nexus

## Pourquoi tester ?
Pour un projet Open Source, les tests sont la seule garantie que les contributions externes ne brisent pas le noyau de l'application.

---

## 1. Tests Unitaires (Vitest)
Ciblent la logique pure (fonctions utilitaires, calculs de date, validations de tokens).

- **Localisation** : `src/**/*.test.ts`
- **Exécution** : `npm run test`
- **Mocks** : Utilisation de `vi.mock` pour simuler Supabase et Clerk.

### Exemple : Validation du Token de Présence
Nous testons que le token QR expire après 60 secondes et qu'un token expiré renvoie une erreur 403.

---

## 2. Tests d'Intégration (React Testing Library)
Vérifient que les composants interagissent correctement entre eux.

- **Focus** : Les `features` et `widgets`.
- **Objectif** : Vérifier que si l'utilisateur remplit le formulaire d'invitation, l'appel API est déclenché avec les bonnes données.

---

## 3. Tests de Bout-en-Bout (Playwright)
Simulent un utilisateur réel dans un navigateur.

- **Localisation** : `src/tests/e2e/*.spec.ts`
- **Exécution** : `npx playwright test`
- **Scénarios critiques** :
    1. Un Admin se connecte, crée un planning, et voit le changement s'afficher.
    2. Un Stagiaire scanne un QR Code et reçoit une confirmation visuelle.

---

## 4. Tests de Sécurité (RLS & Clerk)
Nous utilisons des tests automatisés pour vérifier que :
- L'API de production rejette les requêtes sans Token Clerk.
- Les politiques **RLS (Row Level Security)** de Supabase interdisent à un stagiaire de modifier le profil d'un autre via des appels directs à l'API.

## Workflow Git & CI
Chaque Pull Request déclenche automatiquement la suite de tests via **GitHub Actions**. Un échec de test bloque la fusion (Merge).
