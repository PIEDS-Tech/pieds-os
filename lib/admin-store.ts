export type UserRole = "admin" | "manager" | "member" | "viewer";

export interface TeamUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  joinedAt: string;
  status: "active" | "inactive";
}

export interface AuditLog {
  id: string;
  actor: string;
  action: string;
  resource: string;
  resourceId: string;
  changes: string;
  timestamp: string;
  ipAddress?: string;
}

export interface IntegrationSettings {
  supabaseUrl: string;
  supabaseKey: string;
  resendApiKey: string;
  openaiApiKey: string;
  anthropicApiKey: string;
}

export interface AppSettings {
  organizationName: string;
  organizationLogo?: string;
  timezone: string;
  emailFrom: string;
}

const USERS_STORAGE_KEY = "pieds_team_users";
const AUDIT_LOG_KEY = "pieds_audit_log";
const INTEGRATION_SETTINGS_KEY = "pieds_integration_settings";
const APP_SETTINGS_KEY = "pieds_app_settings";

// Mock team users
const mockUsers: TeamUser[] = [
  {
    id: "u1",
    name: "You (Admin)",
    email: "admin@pieds.local",
    role: "admin",
    joinedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
  },
  {
    id: "u2",
    name: "Alice Johnson",
    email: "alice@pieds.local",
    role: "manager",
    joinedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
  },
  {
    id: "u3",
    name: "Bob Smith",
    email: "bob@pieds.local",
    role: "member",
    joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
  },
  {
    id: "u4",
    name: "Carol White",
    email: "carol@pieds.local",
    role: "member",
    joinedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
  },
];

// Mock audit logs
const mockAuditLogs: AuditLog[] = [
  {
    id: "a1",
    actor: "You",
    action: "created",
    resource: "Contact",
    resourceId: "c1",
    changes: "New contact: John Doe",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    ipAddress: "192.168.1.100",
  },
  {
    id: "a2",
    actor: "Alice Johnson",
    action: "updated",
    resource: "Campaign",
    resourceId: "camp1",
    changes: "Status changed from Draft to Sent",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    ipAddress: "192.168.1.101",
  },
  {
    id: "a3",
    actor: "Bob Smith",
    action: "deleted",
    resource: "Task",
    resourceId: "t1",
    changes: "Task removed from system",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    ipAddress: "192.168.1.102",
  },
  {
    id: "a4",
    actor: "Carol White",
    action: "created",
    resource: "Meeting",
    resourceId: "m1",
    changes: "New meeting scheduled",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    ipAddress: "192.168.1.103",
  },
  {
    id: "a5",
    actor: "You",
    action: "updated",
    resource: "User",
    resourceId: "u2",
    changes: "Role changed from Member to Manager",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    ipAddress: "192.168.1.100",
  },
];

// Mock settings
const mockIntegrationSettings: IntegrationSettings = {
  supabaseUrl: "",
  supabaseKey: "",
  resendApiKey: "",
  openaiApiKey: "",
  anthropicApiKey: "",
};

const mockAppSettings: AppSettings = {
  organizationName: "PIEDS Ignite",
  timezone: "Asia/Kolkata",
  emailFrom: "noreply@pieds.local",
};

export function getTeamUsers(): TeamUser[] {
  if (typeof window === "undefined") return mockUsers;
  const stored = localStorage.getItem(USERS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : mockUsers;
}

export function saveTeamUsers(users: TeamUser[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export function updateUserRole(userId: string, newRole: UserRole): void {
  const users = getTeamUsers();
  const user = users.find((u) => u.id === userId);
  if (user) {
    user.role = newRole;
    saveTeamUsers(users);
  }
}

export function inviteUser(email: string, role: UserRole): TeamUser {
  const users = getTeamUsers();
  const newUser: TeamUser = {
    id: `u-${Date.now()}`,
    name: email.split("@")[0],
    email,
    role,
    joinedAt: new Date().toISOString(),
    status: "active",
  };
  users.push(newUser);
  saveTeamUsers(users);
  return newUser;
}

export function getAuditLogs(): AuditLog[] {
  if (typeof window === "undefined") return mockAuditLogs;
  const stored = localStorage.getItem(AUDIT_LOG_KEY);
  return stored ? JSON.parse(stored) : mockAuditLogs;
}

export function getIntegrationSettings(): IntegrationSettings {
  if (typeof window === "undefined") return mockIntegrationSettings;
  const stored = localStorage.getItem(INTEGRATION_SETTINGS_KEY);
  return stored ? JSON.parse(stored) : mockIntegrationSettings;
}

export function saveIntegrationSettings(settings: IntegrationSettings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(INTEGRATION_SETTINGS_KEY, JSON.stringify(settings));
}

export function getAppSettings(): AppSettings {
  if (typeof window === "undefined") return mockAppSettings;
  const stored = localStorage.getItem(APP_SETTINGS_KEY);
  return stored ? JSON.parse(stored) : mockAppSettings;
}

export function saveAppSettings(settings: AppSettings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(APP_SETTINGS_KEY, JSON.stringify(settings));
}
