"use client"

import * as React from "react"

export type Language = 'en' | 'fr'

interface Translations {
  [key: string]: {
    en: string
    fr: string
  }
}

export const translations: Translations = {
  // General
  settings: { en: "Settings", fr: "Paramètres" },
  language: { en: "Language", fr: "Langue" },
  preferences: { en: "Preferences", fr: "Préférences" },
  save: { en: "Save", fr: "Enregistrer" },
  cancel: { en: "Cancel", fr: "Annuler" },
  notifications: { en: "Notifications", fr: "Notifications" },
  theme: { en: "Theme", fr: "Thème" },
  
  // Navigation
  home: { en: "Home", fr: "Accueil" },
  schedules: { en: "Schedules", fr: "Plannings" },
  trainees: { en: "Trainees", fr: "Stagiaires" },
  attendance: { en: "Attendance", fr: "Présences" },
  requests: { en: "Requests", fr: "Demandes" },
  my_schedule: { en: "My Schedule", fr: "Mon Planning" },
  check_in: { en: "Check-In", fr: "Pointage" },
  my_requests: { en: "My Requests", fr: "Mes Demandes" },
  ai_companion: { en: "AI Companion", fr: "Compagnon IA" },
  
  // Trainee Page
  my_schedule_title: { en: "My Schedule", fr: "Mon Planning" },
  my_schedule_description: { en: "Your assigned internship days for this month.", fr: "Vos jours de stage assignés pour ce mois." },
  upcoming_assignments: { en: "Upcoming Assignments", fr: "Missions à Venir" },
  no_assignments: { en: "No assignments found for this month.", fr: "Aucune mission trouvée pour ce mois." },
  loading_schedule: { en: "Loading your schedule...", fr: "Chargement de votre planning..." },

  // Chat
  how_can_i_help: { en: "How can I help you today?", fr: "Comment puis-je vous aider aujourd'hui ?" },
  ai_mistakes: { en: "AI can make mistakes. Verify important info about your schedule.", fr: "L'IA peut faire des erreurs. Vérifiez les informations importantes concernant votre planning." },
  upload_document: { en: "Upload document", fr: "Télécharger un document" },
  new_chat: { en: "New Chat", fr: "Nouvelle Discussion" },
  message_placeholder: { en: "Message Nexus AI...", fr: "Message pour Nexus IA..." },
  
  // Admin & Management
  administration: { en: "Administration", fr: "Administration" },
  manage_trainees: { en: "Manage your trainees, their specialties, and internship details.", fr: "Gérez vos stagiaires, leurs spécialités et les détails de leur stage." },
  trainee_management: { en: "Trainee Management", fr: "Gestion des Stagiaires" },
  invite_trainee: { en: "Invite Trainee", fr: "Inviter un Stagiaire" },
  invite_description: { en: "Send an email invitation to a new trainee.", fr: "Envoyez une invitation par email à un nouveau stagiaire." },
  email_address: { en: "Email Address", fr: "Adresse Email" },
  send_invitation: { en: "Send Invitation", fr: "Envoyer l'Invitation" },
  invitation_sent: { en: "Invitation sent successfully.", fr: "Invitation envoyée avec succès." },
  invitation_error: { en: "Failed to send invitation.", fr: "Échec de l'envoi de l'invitation." },
  refresh: { en: "Refresh", fr: "Actualiser" },
  filter_by: { en: "Filter by", fr: "Filtrer par" },
  no_results: { en: "No results.", fr: "Aucun résultat." },
  previous: { en: "Previous", fr: "Précédent" },
  next: { en: "Next", fr: "Suivant" },
  rows_selected: { en: "row(s) selected.", fr: "ligne(s) sélectionnée(s)." },
  
  // Requests
  my_requests_title: { en: "My Requests", fr: "Mes Demandes" },
  my_requests_description: { en: "Manage your schedule changes and presentation slots.", fr: "Gérez vos changements de planning et vos créneaux de présentation." },
  new_request: { en: "New Request", fr: "Nouvelle Demande" },
  submit_request: { en: "Submit a Request", fr: "Soumettre une Demande" },
  request_form_description: { en: "Fill out the form below to request a schedule change or a presentation slot.", fr: "Remplissez le formulaire ci-dessous pour demander un changement de planning ou un créneau de présentation." },
  no_requests: { en: "You haven't submitted any requests yet.", fr: "Vous n'avez pas encore soumis de demandes." },
  loading_requests: { en: "Loading requests...", fr: "Chargement des demandes..." },
  admin_comment: { en: "Admin Comment", fr: "Commentaire Admin" },
  submitted_on: { en: "Submitted on", fr: "Soumis le" },
  target_date: { en: "Target Date", fr: "Date Cible" },
  request_type: { en: "Request Type", fr: "Type de Demande" },
  schedule_change: { en: "Schedule Change", fr: "Changement de Planning" },
  presentation_slot: { en: "Presentation Slot", fr: "Créneau de Présentation" },
  title: { en: "Title", fr: "Titre" },
  description: { en: "Description", fr: "Description" },
  target_date_optional: { en: "Target Date (Optional)", fr: "Date Cible (Optionnel)" },
  target_date_description: { en: "The date this request refers to.", fr: "La date concernée par cette demande." },
  detailed_description: { en: "Detailed Description", fr: "Description Détaillée" },
  explain_reason: { en: "Explain the reason for your request...", fr: "Expliquez la raison de votre demande..." },
  submit_request_button: { en: "Submit Request", fr: "Envoyer la Demande" },
  manage_requests: { en: "Manage Requests", fr: "Gérer les Demandes" },
  manage_requests_description: { en: "Review and respond to trainee schedule and presentation requests.", fr: "Examinez et répondez aux demandes de planning et de présentation des stagiaires." },
  reject: { en: "Reject", fr: "Rejeter" },
  approve: { en: "Approve", fr: "Approuver" },
  save_changes: { en: "Save Changes", fr: "Enregistrer" },
  add_comment_placeholder: { en: "Add a comment or reason for your decision...", fr: "Ajoutez un commentaire ou une raison..." },
  no_requests_system: { en: "No requests found in the system.", fr: "Aucune demande trouvée dans le système." },
  admin_decision_comment: { en: "Admin Decision Comment:", fr: "Commentaire de Décision Admin :" },
  add_comment: { en: "Add a comment", fr: "Ajouter un commentaire" },

  // Settings Page
  settings_description: { en: "Manage your account settings and preferences.", fr: "Gérez les paramètres de votre compte et vos préférences." },
  language_description: { en: "Select your preferred language.", fr: "Sélectionnez votre langue préférée." },
  notifications_description: { en: "Receive notifications about your schedule.", fr: "Recevez des notifications concernant votre planning." },
  success_message: { en: "Settings updated successfully.", fr: "Paramètres mis à jour avec succès." },
  error_message: { en: "Failed to update settings.", fr: "Échec de la mise à jour des paramètres." },
  loading: { en: "Loading...", fr: "Chargement..." },
  general: { en: "General", fr: "Général" },
  account: { en: "Account", fr: "Compte" },
}

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const I18nContext = React.createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = React.useState<Language>('fr')

  // Load from localStorage on mount
  React.useEffect(() => {
    const savedLang = localStorage.getItem('app-language') as Language
    if (savedLang && (savedLang === 'en' || savedLang === 'fr')) {
      setLanguageState(savedLang)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('app-language', lang)
    // Optional: Update document lang attribute
    document.documentElement.lang = lang
  }

  const t = (key: string) => {
    return translations[key]?.[language] || key
  }

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = React.useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}
