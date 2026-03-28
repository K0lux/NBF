# Architecture de NBF Nexus (FSD Deep Dive)

NBF Nexus utilise le framework **Feature-Sliced Design (FSD)**. Cette méthodologie nous permet de découpler la logique métier de l'interface et de garantir qu'une modification dans une fonctionnalité n'en casse pas une autre.

## Les Couches (Layers)

### 1. Shared (Socle Technique)
Contient les éléments atomiques sans logique métier.
- `ui/` : Design System (boutons, inputs, modals) basé sur Radix UI et Tailwind.
- `lib/` : Utilitaires de formatage, hooks Supabase génériques.
- `api/` : Instance de base du client Supabase.

### 2. Entities (Le Domaine Métier)
Représente les objets réels du monde NBF.
- **Trainee** : Profil, métadonnées, type de stage.
- **Schedule** : Créneaux de présence, calendrier.
- **Attendance** : Logs de présence, tokens QR.
- **Request** : Demandes de permission, changements de planning.

Chaque entité expose :
- `model/` : Types TypeScript et schémas Zod.
- `api/` : Fonctions de récupération de données (Supabase queries).
- `ui/` : Composants visuels simples (ex: `TraineeAvatar`).

### 3. Features (Les Actions Utilisateur)
Contient la logique d'interaction qui apporte de la valeur.
- `invite-trainee` : Formulaire et logique d'invitation par mail.
- `generate-attendance-qr` : Logique de rotation du token QR.
- `ai-chat` : Interface de discussion avec le modèle RAG.

### 4. Widgets (Composition Complexe)
Grands blocs autonomes assemblant entités et features.
- `TraineeManagementWidget` : Table de données + filtres + actions de masse.
- `ScheduleCalendarWidget` : Calendrier interactif avec drag-and-drop.

### 5. Pages
Composants de structure qui assemblent les widgets pour une route spécifique.

---

## 🔒 Sécurité & Data Flow
1. **Authentification** : Gérée par Clerk (Middleware Next.js).
2. **Autorisation** : Les métadonnées Clerk (`role: admin/trainee`) déterminent l'accès aux routes.
3. **Base de données** : Supabase avec **Row Level Security (RLS)** activé. Un stagiaire ne peut jamais lire les logs de présence d'un autre stagiaire.
