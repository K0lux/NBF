# NBF Nexus

NBF Nexus is an integrated web platform designed for the New Brain Factory (NBF) to manage the complete lifecycle of its trainees. The application handles profile management, advanced scheduling, attendance tracking (QR code/Geo), request workflows, and includes an AI companion powered by RAG (Retrieval-Augmented Generation).

## Project Overview

*   **Goal:** Streamline trainee management and automate administrative tasks.
*   **Architecture:** Feature-Sliced Design (FSD).
*   **Tech Stack:** Next.js 16.1, Supabase, Clerk, Vercel AI SDK.

## Architecture: Feature-Sliced Design (FSD)

L'architecture Feature-Sliced Design (FSD) divise le projet en 7 couches (layers) avec une hiérarchie stricte (une couche ne peut importer que des éléments de couches inférieures). Voici la responsabilité de chaque dossier :

1.  **app/** (La couche de configuration) : Point d'entrée, providers globaux (Clerk, Theme), styles globaux, et routage Next.js (layout.tsx / page.tsx). Ces fichiers appellent les composants de la couche `pages`.
2.  **pages/** (Les routes logiques) : Composition complète d'une page en assemblant widgets et features. Gère le Data Fetching.
3.  **widgets/** (Les grands blocs autonomes) : Combine des entités et fonctionnalités pour créer des sections complexes (ex: Navigation, Dashboard).
4.  **features/** (Les actions utilisateur) : Interactions avec valeur commerciale (ex: `invite-trainee`, `generate-qr`). Contient la logique de mutation.
5.  **entities/** (Le domaine métier) : Définit les objets métier (User, Attendance, Schedule). Contient l'UI simple, les schémas et types.
6.  **shared/** (Le socle technique) : Réutilisable et indépendant du métier. Contient le Design System (`ui/`), les instances API (`api/`) et utilitaires (`lib/`).
7.  **processes/** (Optionnel) : Flux multi-pages complexes (souvent intégré dans `app` ou `features` en Next.js).

**Règle d'or (Public API) :** Chaque dossier doit avoir un fichier `index.ts` qui expose uniquement le nécessaire. On n'importe jamais un fichier interne directement (ex: `@/entities/user/ui/card`), on passe par l'index (`@/entities/user`).

## Key Documentation

*   **Master Plan:** [nbf_nexus_architecture_and_roadmap.md](plans/nbf_nexus_architecture_and_roadmap.md) - Contains the detailed directory structure, logical architecture, and the 37-issue implementation roadmap.

## Technical Integrity & Testing Standards

For every issue implemented, the following standards MUST be met:
1.  **Mandatory Testing:** Every task must include:
    *   **Unit Tests:** For business logic, API calls, and utility functions.
    *   **Integration Tests:** For component interaction and state management.
    *   **E2E Tests:** For critical user journeys and full-system validation.
2.  **Regression Testing:** Ensure new implementations are fully compatible with existing code and features.
3.  **Mocking:** Use established mocks (Supabase, Clerk) for database and auth interactions to ensure test isolation.
4.  **Validation:** No issue is considered "Done" until all tests (unit, integration, and E2E) are passing.

## Implementation Roadmap (Summary)

1.  **Foundations:** Next.js setup, FSD structure, Supabase & Clerk integration.
2.  **Trainee Management:** Profile sync, admin lists, metadata editing.
3.  **Scheduling:** Admin calendar view, slot assignment.
4.  **Attendance:** QR Code generation/scanning, Geolocation check-in, Real-time dashboard.
5.  **Requests:** Workflow for schedule changes and presentation slots.
6.  **AI Companion:** RAG pipeline for documentation and chat interface.

For detailed development steps, refer to the Master Plan in the `plans/` directory.



Malipita@@123