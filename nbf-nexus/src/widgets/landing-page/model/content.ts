import {
  ArrowRight,
  Bell,
  Bot,
  LayoutGrid,
  QrCode,
  Shield,
  Sparkles,
  UserCog,
  Workflow,
  Zap,
} from "lucide-react"

export const servicePainPoints = [
  {
    icon: LayoutGrid,
    title: "Le Casse-tete du Flex-Office",
    subtitle: "Le probleme des 'Chaises Musicales'",
    description:
      "Allocation stricte des ressources exemple: 12 places physiques pour 30+ collaborateurs. Evite la surreservation et le gaspillage d'espace.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    gradient: "from-blue-500/20 to-transparent",
  },
  {
    icon: Sparkles,
    title: "Mentor Virtuel 24/7",
    subtitle: "Goulot d'etranglement de l'Onboarding",
    description:
      "L'IA absorbe les questions repetitives sur les process et rapports. Libere le temps precieux des mentors seniors.",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    gradient: "from-purple-500/20 to-transparent",
  },
  {
    icon: Workflow,
    title: "Centralisation Administrative",
    subtitle: "Fin de la Micro-gestion RH",
    description:
      "Workflows standards pour absences et permissions. Une file d'attente unique pour valider en un clic.",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    gradient: "from-orange-500/20 to-transparent",
  },
  {
    icon: QrCode,
    title: "Presence Infalsifiable",
    subtitle: "Visibilite Live sur Site",
    description:
      "Pointage par QR Code dynamique ou Geolocalisation. Preuve numerique instantanee pour le pilotage en temps reel.",
    color: "text-green-500",
    bg: "bg-green-500/10",
    gradient: "from-green-500/20 to-transparent",
  },
  {
    icon: Bell,
    title: "Communication Automatisee",
    subtitle: "Zero Absenteisme non intentionnel",
    description:
      "Rappels WhatsApp/Email proactifs. L'information va vers l'utilisateur (planning, validations, alertes).",
    color: "text-pink-500",
    bg: "bg-pink-500/10",
    gradient: "from-pink-500/20 to-transparent",
  },
  {
    icon: UserCog,
    title: "Gestion de Profils Hybrides",
    subtitle: "On-site, Remote & Alternance",
    description:
      "Regles metier adaptees par profil. Un suivi coherent peu importe le mode de travail de l'etudiant.",
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
    gradient: "from-cyan-500/20 to-transparent",
  },
]

export const impactHighlights = [
  "Passage a l'echelle (Scale) sans embauche administrative.",
  "Productivite accrue des mentors via le support IA.",
  "Optimisation de l'occupation des locaux physiques.",
]

export const impactStats = [
  { value: "3x", label: "Capacite de Scale" },
  { value: "100%", label: "Fiabilite Presence" },
  { value: "24/7", label: "Mentor IA Dispo" },
  { value: "-40%", label: "Charge Mentale RH" },
]

export const platformStats = [
  { value: "100%", label: "Uptime Platform", icon: Zap },
  { value: "24/7", label: "Support Assistant", icon: Bot },
  { value: "Secure", label: "SSO & RLS Ready", icon: Shield },
  { value: "Modern", label: "FSD Architecture", icon: Zap },
]

export { ArrowRight }
