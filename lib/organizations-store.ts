// Generate unique ID
function generateUniqueId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Mock organizations data store
export interface Organization {
  id: string;
  name: string;
  type: "corporate" | "startup" | "university" | "ngo" | "government" | "other";
  sector: string;
  website: string;
  description: string;
  status: "active" | "inactive" | "prospect";
  linkedContacts: string[]; // contact IDs
  lastInteraction: string; // ISO date string
}

// Mock data
const mockOrganizations: Organization[] = [
  {
    id: "1",
    name: "Microsoft India",
    type: "corporate",
    sector: "Technology",
    website: "microsoft.com",
    description: "Global technology leader",
    status: "active",
    linkedContacts: ["1", "2"],
    lastInteraction: "2026-06-12",
  },
  {
    id: "2",
    name: "Amazon India",
    type: "corporate",
    sector: "E-commerce",
    website: "amazon.in",
    description: "E-commerce and cloud services",
    status: "active",
    linkedContacts: ["2"],
    lastInteraction: "2026-06-10",
  },
  {
    id: "3",
    name: "Google India",
    type: "corporate",
    sector: "Technology",
    website: "google.com",
    description: "Search and advertising giant",
    status: "active",
    linkedContacts: [],
    lastInteraction: "2026-05-20",
  },
  {
    id: "4",
    name: "StartupFund Ventures",
    type: "startup",
    sector: "Venture Capital",
    website: "startupfund.com",
    description: "Venture capital and startup accelerator",
    status: "active",
    linkedContacts: ["3"],
    lastInteraction: "2026-04-15",
  },
  {
    id: "5",
    name: "BITS Pilani",
    type: "university",
    sector: "Education",
    website: "bits-pilani.ac.in",
    description: "Premier engineering university",
    status: "active",
    linkedContacts: ["5"],
    lastInteraction: "2026-06-11",
  },
];

// Storage key
const ORGANIZATIONS_STORAGE_KEY = "pieds_organizations";

// Get all organizations
export function getOrganizations(): Organization[] {
  if (typeof window === "undefined") return mockOrganizations;
  const stored = localStorage.getItem(ORGANIZATIONS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : mockOrganizations;
}

// Save organizations to localStorage
export function saveOrganizations(orgs: Organization[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ORGANIZATIONS_STORAGE_KEY, JSON.stringify(orgs));
}

// Initialize localStorage with mock data
export function initializeOrganizations(): void {
  if (typeof window === "undefined") return;
  if (!localStorage.getItem(ORGANIZATIONS_STORAGE_KEY)) {
    saveOrganizations(mockOrganizations);
  } else {
    // Check for and fix duplicate IDs
    const stored = localStorage.getItem(ORGANIZATIONS_STORAGE_KEY);
    if (stored) {
      try {
        const orgs = JSON.parse(stored);
        const idSet = new Set<string>();
        let hasDuplicates = false;

        for (const org of orgs) {
          if (idSet.has(org.id)) {
            hasDuplicates = true;
            break;
          }
          idSet.add(org.id);
        }

        // If duplicates found, regenerate IDs
        if (hasDuplicates) {
          const fixedOrgs = orgs.map((o: Organization) => ({
            ...o,
            id: generateUniqueId(),
          }));
          saveOrganizations(fixedOrgs);
        }
      } catch (e) {
        // If parsing fails, reset to mock data
        saveOrganizations(mockOrganizations);
      }
    }
  }
}

// Add organization
export function addOrganization(org: Omit<Organization, "id">): Organization {
  const newOrg: Organization = {
    ...org,
    id: generateUniqueId(),
  };
  const orgs = getOrganizations();
  orgs.push(newOrg);
  saveOrganizations(orgs);
  return newOrg;
}

// Update organization
export function updateOrganization(id: string, updates: Partial<Organization>): Organization | null {
  const orgs = getOrganizations();
  const index = orgs.findIndex((o) => o.id === id);
  if (index === -1) return null;
  orgs[index] = { ...orgs[index], ...updates };
  saveOrganizations(orgs);
  return orgs[index];
}

// Delete organization
export function deleteOrganization(id: string): boolean {
  const orgs = getOrganizations();
  const index = orgs.findIndex((o) => o.id === id);
  if (index === -1) return false;
  orgs.splice(index, 1);
  saveOrganizations(orgs);
  return true;
}

// Get organization by ID
export function getOrganizationById(id: string): Organization | null {
  const orgs = getOrganizations();
  return orgs.find((o) => o.id === id) || null;
}

// Link contact to organization
export function linkContactToOrg(orgId: string, contactId: string): boolean {
  const org = getOrganizationById(orgId);
  if (!org) return false;
  if (!org.linkedContacts.includes(contactId)) {
    org.linkedContacts.push(contactId);
    updateOrganization(orgId, org);
  }
  return true;
}

// Unlink contact from organization
export function unlinkContactFromOrg(orgId: string, contactId: string): boolean {
  const org = getOrganizationById(orgId);
  if (!org) return false;
  org.linkedContacts = org.linkedContacts.filter((id) => id !== contactId);
  updateOrganization(orgId, org);
  return true;
}

// Get unique sectors
export function getAllSectors(): string[] {
  const orgs = getOrganizations();
  const sectorsSet = new Set(orgs.map((o) => o.sector));
  return Array.from(sectorsSet).sort();
}

// Organization types
export const ORGANIZATION_TYPES = ["corporate", "startup", "university", "ngo", "government", "other"] as const;

// Organization statuses
export const ORGANIZATION_STATUSES = ["active", "inactive", "prospect"] as const;
