/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TranslationDictionary {
  // Navigation & General
  brandTitle: string;
  brandSubtitle: string;
  home: string;
  services: string;
  portfolio: string;
  team: string;
  apply: string;
  contact: string;
  clientPortal: string;
  signOut: string;
  wordCount: string;
  urgency: string;
  status: string;
  price: string;
  dialect: string;
  confidentialFlag: string;
  recurringTitle: string;
  progressPercentage: string;
  actions: string;
  sourceLang: string;
  targetLang: string;
  createNewJob: string;
  assignedTo: string;

  // Statuses
  Draft: string;
  "Pending Assignment": string;
  Assigned: string;
  "In Progress": string;
  "Under Review": string;
  "Revision Requested": string;
  Approved: string;
  Completed: string;
  Archived: string;

  // Client Dashboard
  placeNewTranslationRequest: string;
  uploadDocument: string;
  submitRequestBtn: string;
  yourActiveJobs: string;
  completedJobsHistory: string;
  starFeedbackLabel: string;
  submitRatingBtn: string;

  // Freelancer Dashboard
  freelancerWorkspaceTitle: string;
  availabilityCalendar: string;
  dailyWordLimitLabel: string;
  earningsLedger: string;
  invoiceAndWithdrawal: string;
  certificationLevelLabel: string;
  segmentBySegmentEditor: string;
  autoSaveStatus: string;
  aiSmartDraftHelperBtn: string;
  qaCheckReport: string;
  noJobWarning: string;

  // Employee Dashboard
  employeeControlTower: string;
  glossaryManagement: string;
  translationMemoryLabel: string;
  commentsPanelTitle: string;
  sideBySideCompare: string;
  markApprovedBtn: string;
  confidentialitySeal: string;

  // Admin Ecosystem
  userAccountsManagement: string;
  assignTranslatorBtn: string;
  automaticAllocation: string;
  languagePairsConfig: string;
  reportsAndAnalytics: string;
  disputeResolutionLogs: string;
}

export type LanType = 'ENG' | 'AMH' | 'FRE';

export const translations: Record<LanType, TranslationDictionary> = {
  ENG: {
    brandTitle: "የኛ ልሳን",
    brandSubtitle: "Yegna Lisan",
    home: "Home",
    services: "Services",
    portfolio: "Portfolio",
    team: "Team",
    apply: "Apply",
    contact: "Contact",
    clientPortal: "Client Portal",
    signOut: "Sign Out Securely",
    wordCount: "Word Count",
    urgency: "Urgency",
    status: "Status",
    price: "Price (ETB)",
    dialect: "Dialect Specialization",
    confidentialFlag: "Confidential (Restricted Access)",
    recurringTitle: "Recurring (Scheduled)",
    progressPercentage: "Translation Progress",
    actions: "Actions",
    sourceLang: "Source Language",
    targetLang: "Target Language",
    createNewJob: "Place New Translation Request",
    assignedTo: "Assigned Translator",

    // Statuses
    Draft: "Draft",
    "Pending Assignment": "Pending Assignment",
    Assigned: "Assigned",
    "In Progress": "In Progress",
    "Under Review": "Under Review",
    "Revision Requested": "Revision Requested",
    Approved: "Approved",
    Completed: "Completed",
    Archived: "Archived",

    // Client Dashboard
    placeNewTranslationRequest: "Place New Translation Request",
    uploadDocument: "Drag & Drop or Click to Upload File",
    submitRequestBtn: "Submit Translation Request",
    yourActiveJobs: "Your Active Translation Projects",
    completedJobsHistory: "Completed & Certified Deliveries",
    starFeedbackLabel: "Rate Translation Quality & Leave Feedback",
    submitRatingBtn: "Submit Review",

    // Freelancer Dashboard
    freelancerWorkspaceTitle: "Linguist Pro Workspace",
    availabilityCalendar: "Availability Status",
    dailyWordLimitLabel: "Daily Word Capacity",
    earningsLedger: "Earnings & Invoiced Ledger",
    invoiceAndWithdrawal: "Payments & Wallet Withdrawal Tracker",
    certificationLevelLabel: "Linguist Grade Level",
    segmentBySegmentEditor: "Segment-by-Segment Translator Desk",
    autoSaveStatus: "Draft saved locally & synced",
    aiSmartDraftHelperBtn: "Enhance Segment with Gemini",
    qaCheckReport: "Segment QA Validation Checks",
    noJobWarning: "No active translation jobs allocated right now.",

    // Employee Dashboard
    employeeControlTower: "Staff Coordination Tower",
    glossaryManagement: "Company Terminology Glossary",
    translationMemoryLabel: "Translation Memory Records",
    commentsPanelTitle: "Segment Comments & Revisions Notes",
    sideBySideCompare: "Side-by-Side Review Matrix",
    markApprovedBtn: "Approve for Delivery",
    confidentialitySeal: "Confidentiality Protection Seal Activated",

    // Admin Ecosystem
    userAccountsManagement: "Ecosystem Users Management",
    assignTranslatorBtn: "Assign Translator",
    automaticAllocation: "Auto-Assign Best Linguistic Match",
    languagePairsConfig: "Active Operational Language Pairs",
    reportsAndAnalytics: "System Analytics & KPI Reports",
    disputeResolutionLogs: "Dispute Arbitrations Logs"
  },
  AMH: {
    brandTitle: "የኛ ልሳን",
    brandSubtitle: "የኛ ልሳን",
    home: "ዋና ገጽ",
    services: "አገልግሎቶቻችን",
    portfolio: "የሰራናቸው ስራዎች",
    team: "የባለሙያዎች ቡድን",
    apply: "የፍሪላንስ ማመልከቻ",
    contact: "ያግኙን",
    clientPortal: "የደንበኞች መግቢያ",
    signOut: "በሰላም ውጡ",
    wordCount: "የቃላት ብዛት",
    urgency: "አስቸኳይነት",
    status: "ሁኔታ",
    price: "ዋጋ (ብር)",
    dialect: "የበቀበሌኛ ዘይቤ ልዩ ሙያ",
    confidentialFlag: "ሚስጥራዊ (የተገደበ መዳረሻ)",
    recurringTitle: "ተደጋጋሚ (የጊዜ ሰሌዳ ያለው)",
    progressPercentage: "የትርጉም ሂደት",
    actions: "እርምጃዎች",
    sourceLang: "ምንጭ ቋንቋ",
    targetLang: "ዒላማ ቋንቋ",
    createNewJob: "አዲስ የትርጉም ጥያቄ ያቅርቡ",
    assignedTo: "የተመደበለት ተርጓሚ",

    // Statuses
    Draft: "ረቂቅ",
    "Pending Assignment": "ተርጓሚ በመጠባበቅ ላይ",
    Assigned: "የተመደበ",
    "In Progress": "በትርጉም ላይ ያለ",
    "Under Review": "በግምገማ ላይ ያለ",
    "Revision Requested": "ማሻሻያ የተጠየቀበት",
    Approved: "የጸደቀ",
    Completed: "የተጠናቀቀ",
    Archived: "የተቀመጠ (አርካይቭ)",

    // Client Dashboard
    placeNewTranslationRequest: "አዲስ የትርጉም ትዕዛዝ ማስገቢያ",
    uploadDocument: "ሰነዱን እዚህ ይጎትቱት ወይም ፋይል ለመምረጥ ይጫኑ",
    submitRequestBtn: "የትርጉም ጥያቄውን ያስገቡ",
    yourActiveJobs: "በአሁኑ ሰአት ያሉዎት ንቁ የትርጉም ፕሮጀክቶች",
    completedJobsHistory: "ላለፉት የተጠናቀቁ እና የተረጋገጡ ትርጉሞች",
    starFeedbackLabel: "በትርጉም ጥራት ላይ አስተያየትዎን ይስጡ",
    submitRatingBtn: "አስተያየቱን ይላኩ",

    // Freelancer Dashboard
    freelancerWorkspaceTitle: "የትርጓሜ ምሁራን መሥሪያ ገበታ",
    availabilityCalendar: "የስራ ዝግጁነት ሁኔታ",
    dailyWordLimitLabel: "በቀን መተርጎም የሚችሉት የቃላት ገደብ",
    earningsLedger: "የገቢ ማህደር እና የሂሳብ መዝገብ",
    invoiceAndWithdrawal: "የክፍያ ታሪክ እና ከአጠቃላይ ሂሳብ ገንዘብ ማውጫ",
    certificationLevelLabel: "የትርጉም ማረጋገጫ የምስክር ወረቀት ደረጃ",
    segmentBySegmentEditor: "የአንቀፅ-በአንቀፅ የትርጉም መስሪያ ገበታ",
    autoSaveStatus: "ረቂቁ በኮምፒውተርዎ ላይ ተቀምጧል",
    aiSmartDraftHelperBtn: "በጄሚኒ (Gemini) AI ረቂቅ ትርጉም አግኝ",
    qaCheckReport: "የትርጉም ጥራት እና ደንቦች ማረጋገጫ ሪፖርት",
    noJobWarning: "በአሁኑ ሰዓት የተመደበልዎት ምንም ስራ የለም።",

    // Employee Dashboard
    employeeControlTower: "የባለሙያዎች እና የጥራት ቁጥጥር ማዕከል",
    glossaryManagement: "የኩባንያው ሰነድ መዝገበ-ቃላት (Glossary)",
    translationMemoryLabel: "የትርጉም ትውስታዎች መዝገብ (TM)",
    commentsPanelTitle: "የአንቀፅ አስተያየቶች እና የማሻሻያ ማስታወሻዎች",
    sideBySideCompare: "የጎን-ለጎን የንፅፅር መመልከቻ ሰሌዳ",
    markApprovedBtn: "ለደንበኛ እንዲደርስ አጽድቅ",
    confidentialitySeal: "የሰነድ ሚስጥራዊነት ደህንነት ማህተም ነቅቷል",

    // Admin Ecosystem
    userAccountsManagement: "የስርዓቱ ተጠቃሚዎች መቆጣጠሪያ ሰሌዳ",
    assignTranslatorBtn: "ተርጓሚ መድብ",
    automaticAllocation: "በራስ-ሰር ተስማሚ ተርጓሚዎችን መድብ",
    languagePairsConfig: "ንቁ የስርዓቱ የቋንቋ ጥንዶች",
    reportsAndAnalytics: "የስራ ክንውን እና መጠናዊ ስታቲስቲክስ ሪፖርት",
    disputeResolutionLogs: "የማጣሪያ እና የግጭት መፍቻ ማህደሮች"
  },
  FRE: {
    brandTitle: "የኛ ልሳን",
    brandSubtitle: "Notre Langue",
    home: "Accueil",
    services: "Services",
    portfolio: "Portfolio",
    team: "Équipe",
    apply: "S'inscrire",
    contact: "Contact",
    clientPortal: "Portail Client",
    signOut: "Se déconnecter",
    wordCount: "Nombre de mots",
    urgency: "Urgence",
    status: "Statut",
    price: "Prix (ETB)",
    dialect: "Spécialité dialectale",
    confidentialFlag: "Confidentiel (Accès Restreint)",
    recurringTitle: "Récurrent (Planifié)",
    progressPercentage: "Progrès de la traduction",
    actions: "Actions",
    sourceLang: "Langue Source",
    targetLang: "Langue Cible",
    createNewJob: "Placer une nouvelle demande",
    assignedTo: "Traducteur assigné",

    // Statuses
    Draft: "Brouillon",
    "Pending Assignment": "En attente d'assignation",
    Assigned: "Assigné",
    "In Progress": "En cours",
    "Under Review": "En révision",
    "Revision Requested": "Révision demandée",
    Approved: "Approuvé",
    Completed: "Terminé",
    Archived: "Archivé",

    // Client Dashboard
    placeNewTranslationRequest: "Soumettre une nouvelle demande de traduction",
    uploadDocument: "Glisser-déposer ou cliquer pour télécharger le fichier",
    submitRequestBtn: "Soumettre la demande de traduction",
    yourActiveJobs: "Vos projets de traduction actifs",
    completedJobsHistory: "Livrables complétés et certifiés",
    starFeedbackLabel: "Notez la qualité de notre service",
    submitRatingBtn: "Soumettre l'avis",

    // Freelancer Dashboard
    freelancerWorkspaceTitle: "Espace de travail linguistique Pro",
    availabilityCalendar: "Statut de disponibilité",
    dailyWordLimitLabel: "Capacité quotidienne en mots",
    earningsLedger: "Registre des revenus et factures",
    invoiceAndWithdrawal: "Suivi des paiements et retrait",
    certificationLevelLabel: "Niveau de certification",
    segmentBySegmentEditor: "Bureau de traduction segment par segment",
    autoSaveStatus: "Brouillon enregistré localement",
    aiSmartDraftHelperBtn: "Améliorer le segment de texte avec Gemini",
    qaCheckReport: "Contrôles de validation de la qualité",
    noJobWarning: "Aucun travail de traduction actif actuellement.",

    // Employee Dashboard
    employeeControlTower: "Tour de contrôle du personnel",
    glossaryManagement: "Glossaire terminologique",
    translationMemoryLabel: "Mémoire de traduction",
    commentsPanelTitle: "Commentaires et notes de révision",
    sideBySideCompare: "Matrice d'évaluation comparative",
    markApprovedBtn: "Approuver pour livraison",
    confidentialitySeal: "Sceau de confidentialité activé",

    // Admin Ecosystem
    userAccountsManagement: "Gestion des utilisateurs de l'écosystème",
    assignTranslatorBtn: "Assigner le traducteur",
    automaticAllocation: "Allocation automatique par correspondance",
    languagePairsConfig: "Paires de langues opérationnelles",
    reportsAndAnalytics: "Rapports analytiques et indicateurs de performance",
    disputeResolutionLogs: "Registre de résolution des litiges"
  }
};
