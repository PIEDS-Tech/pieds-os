/**
 * Centralized routing configuration for PIEDS OS
 * All routes are type-safe and organized by module
 */

export const ROUTES = {
  // Auth
  LOGIN: "/login",

  // Dashboard
  DASHBOARD: "/",

  // Contacts
  CONTACTS: {
    ROOT: "/contacts",
    NEW: "/contacts/new",
    DETAIL: (id: string) => `/contacts/${id}`,
    EDIT: (id: string) => `/contacts/${id}/edit`,
  },

  // Organizations
  ORGANIZATIONS: {
    ROOT: "/organizations",
    NEW: "/organizations/new",
    DETAIL: (id: string) => `/organizations/${id}`,
    EDIT: (id: string) => `/organizations/${id}/edit`,
  },

  // Outreach & Campaigns
  OUTREACH: {
    ROOT: "/outreach",
    NEW: "/outreach/new",
    DETAIL: (id: string) => `/outreach/${id}`,
    EDIT: (id: string) => `/outreach/${id}/edit`,
    TEMPLATES: {
      ROOT: "/outreach/templates",
      NEW: "/outreach/templates/new",
      EDIT: (id: string) => `/outreach/templates/${id}/edit`,
    },
  },

  // Meetings
  MEETINGS: {
    ROOT: "/meetings",
    NEW: "/meetings/new",
    DETAIL: (id: string) => `/meetings/${id}`,
    EDIT: (id: string) => `/meetings/${id}/edit`,
  },

  // Tasks
  TASKS: {
    ROOT: "/tasks",
    NEW: "/tasks/new",
    DETAIL: (id: string) => `/tasks/${id}`,
    EDIT: (id: string) => `/tasks/${id}/edit`,
  },

  // Knowledge Base
  KNOWLEDGE_BASE: "/knowledge-base",

  // Decks (Pitch Decks)
  DECKS: {
    ROOT: "/decks",
    NEW: "/decks/new",
    DETAIL: (id: string) => `/decks/${id}`,
  },

  // Analytics
  ANALYTICS: "/analytics",

  // Settings
  SETTINGS: "/settings",

  // Admin
  ADMIN: {
    ROOT: "/admin",
    USERS: "/admin/users",
    AUDIT_LOGS: "/admin/audit-logs",
    INTEGRATIONS: "/admin/integrations",
    APP_SETTINGS: "/admin/settings",
  },
} as const;

/**
 * Navigation menu items for the sidebar
 */
export const NAVIGATION_ITEMS = [
  { label: "Dashboard", href: ROUTES.DASHBOARD, icon: "BarChart3" },
  { label: "Contacts", href: ROUTES.CONTACTS.ROOT, icon: "Users" },
  { label: "Organizations", href: ROUTES.ORGANIZATIONS.ROOT, icon: "Building2" },
  { label: "Outreach", href: ROUTES.OUTREACH.ROOT, icon: "Mail" },
  { label: "Meetings", href: ROUTES.MEETINGS.ROOT, icon: "Calendar" },
  { label: "Tasks", href: ROUTES.TASKS.ROOT, icon: "CheckSquare" },
  { label: "Knowledge Base", href: ROUTES.KNOWLEDGE_BASE, icon: "BookOpen" },
  { label: "Analytics", href: ROUTES.ANALYTICS, icon: "Zap" },
] as const;
