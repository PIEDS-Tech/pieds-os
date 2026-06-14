// Generate unique ID
function generateUniqueId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Mock contacts data store
export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  organization: string;
  type: "founder" | "mentor" | "investor" | "sponsor" | "alumni" | "faculty" | "partner";
  tags: string[];
  notes: string;
  lastContact: string; // ISO date string
  status: "active" | "inactive" | "pending";
}

// Mock data
const mockContacts: Contact[] = [
  {
    id: "1",
    name: "Ananya Sharma",
    email: "ananya@microsoft.com",
    phone: "+91-98765-43210",
    linkedin: "linkedin.com/in/ananya",
    organization: "Microsoft",
    type: "investor",
    tags: ["tech", "enterprise"],
    notes: "Strong interest in sponsorship",
    lastContact: "2026-06-10",
    status: "active",
  },
  {
    id: "2",
    name: "Rahul Patel",
    email: "rahul@amazon.com",
    phone: "+91-98765-43211",
    linkedin: "linkedin.com/in/rahul",
    organization: "Amazon",
    type: "mentor",
    tags: ["cloud", "startup"],
    notes: "Available for mentoring sessions",
    lastContact: "2026-05-15",
    status: "active",
  },
  {
    id: "3",
    name: "Priya Singh",
    email: "priya@startupfund.com",
    phone: "+91-98765-43212",
    linkedin: "linkedin.com/in/priya",
    organization: "StartupFund Ventures",
    type: "investor",
    tags: ["venture", "funding"],
    notes: "Interested in tech startups",
    lastContact: "2026-04-20",
    status: "active",
  },
  {
    id: "4",
    name: "Amit Kumar",
    email: "amit@google.com",
    phone: "+91-98765-43213",
    linkedin: "linkedin.com/in/amit",
    organization: "Google",
    type: "sponsor",
    tags: ["tech", "enterprise"],
    notes: "Previous sponsor for 2 years",
    lastContact: "2026-03-10",
    status: "pending",
  },
  {
    id: "5",
    name: "Neha Gupta",
    email: "neha@bits-pilani.ac.in",
    phone: "+91-98765-43214",
    linkedin: "linkedin.com/in/neha",
    organization: "BITS Pilani",
    type: "faculty",
    tags: ["alumni", "faculty"],
    notes: "Faculty advisor for the club",
    lastContact: "2026-06-12",
    status: "active",
  },
  {
    id: "6",
    name: "Vikram Reddy",
    email: "vikram@corporate.com",
    phone: "+91-98765-43215",
    linkedin: "linkedin.com/in/vikram",
    organization: "TechCorp India",
    type: "partner",
    tags: ["corporate", "partnership"],
    notes: "Looking for partnership opportunities",
    lastContact: "2026-02-01",
    status: "inactive",
  },
];

// Storage key
const CONTACTS_STORAGE_KEY = "pieds_contacts";

// Get all contacts
export function getContacts(): Contact[] {
  if (typeof window === "undefined") return mockContacts;
  const stored = localStorage.getItem(CONTACTS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : mockContacts;
}

// Save contacts to localStorage
export function saveContacts(contacts: Contact[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(contacts));
}

// Initialize localStorage with mock data
export function initializeContacts(): void {
  if (typeof window === "undefined") return;
  if (!localStorage.getItem(CONTACTS_STORAGE_KEY)) {
    saveContacts(mockContacts);
  } else {
    // Check for and fix duplicate IDs
    const stored = localStorage.getItem(CONTACTS_STORAGE_KEY);
    if (stored) {
      try {
        const contacts = JSON.parse(stored);
        const idSet = new Set<string>();
        let hasDuplicates = false;

        for (const contact of contacts) {
          if (idSet.has(contact.id)) {
            hasDuplicates = true;
            break;
          }
          idSet.add(contact.id);
        }

        // If duplicates found, regenerate IDs
        if (hasDuplicates) {
          const fixedContacts = contacts.map((c: Contact) => ({
            ...c,
            id: generateUniqueId(),
          }));
          saveContacts(fixedContacts);
        }
      } catch (e) {
        // If parsing fails, reset to mock data
        saveContacts(mockContacts);
      }
    }
  }
}

// Add contact
export function addContact(contact: Omit<Contact, "id">): Contact {
  const newContact: Contact = {
    ...contact,
    id: generateUniqueId(),
  };
  const contacts = getContacts();
  contacts.push(newContact);
  saveContacts(contacts);
  return newContact;
}

// Update contact
export function updateContact(id: string, updates: Partial<Contact>): Contact | null {
  const contacts = getContacts();
  const index = contacts.findIndex((c) => c.id === id);
  if (index === -1) return null;
  contacts[index] = { ...contacts[index], ...updates };
  saveContacts(contacts);
  return contacts[index];
}

// Delete contact
export function deleteContact(id: string): boolean {
  const contacts = getContacts();
  const index = contacts.findIndex((c) => c.id === id);
  if (index === -1) return false;
  contacts.splice(index, 1);
  saveContacts(contacts);
  return true;
}

// Get contact by ID
export function getContactById(id: string): Contact | null {
  const contacts = getContacts();
  return contacts.find((c) => c.id === id) || null;
}

// Bulk import contacts
export function bulkImportContacts(newContacts: Omit<Contact, "id">[]): { added: number; skipped: number } {
  const contacts = getContacts();
  let added = 0;
  let skipped = 0;

  newContacts.forEach((newContact) => {
    // Check for duplicates by email
    if (contacts.some((c) => c.email === newContact.email)) {
      skipped++;
      return;
    }
    const contact: Contact = {
      ...newContact,
      id: generateUniqueId(),
    };
    contacts.push(contact);

    // Auto-sync with organization (create if needed)
    if (contact.organization) {
      syncContactWithOrganization(contact.id, contact.organization);
    }
    added++;
  });

  saveContacts(contacts);
  return { added, skipped };
}

// Get unique tags
export function getAllTags(): string[] {
  const contacts = getContacts();
  const tagsSet = new Set<string>();
  contacts.forEach((c) => c.tags.forEach((t) => tagsSet.add(t)));
  return Array.from(tagsSet).sort();
}

// Get unique organizations
export function getAllOrganizations(): string[] {
  const contacts = getContacts();
  const orgsSet = new Set(contacts.map((c) => c.organization));
  return Array.from(orgsSet).sort();
}

// Get contact types
export const CONTACT_TYPES = ["founder", "mentor", "investor", "sponsor", "alumni", "faculty", "partner"] as const;

// Get statuses
export const CONTACT_STATUSES = ["active", "inactive", "pending"] as const;

// Auto-match contact to organization
export function autoMatchOrganization(contactOrg: string): string | null {
  if (!contactOrg || typeof window === "undefined") return null;

  try {
    const { getOrganizations } = require("./organizations-store");
    const orgs = getOrganizations();

    // Exact match
    const exactMatch = orgs.find(
      (o: any) => o.name.toLowerCase() === contactOrg.toLowerCase()
    );
    if (exactMatch) return exactMatch.id;

    // Partial match (first word)
    const firstWord = contactOrg.split(" ")[0].toLowerCase();
    const partialMatch = orgs.find(
      (o: any) => o.name.toLowerCase().includes(firstWord)
    );
    if (partialMatch) return partialMatch.id;

    return null;
  } catch (e) {
    return null;
  }
}

// Sync contact with organization (link/unlink as needed, create org if not found)
export function syncContactWithOrganization(contactId: string, orgName: string, currentOrgId?: string): void {
  if (typeof window === "undefined") return;

  try {
    const { linkContactToOrg, unlinkContactFromOrg, getOrganizations, addOrganization } = require("./organizations-store");

    // Find matching organization
    let matchedOrgId = autoMatchOrganization(orgName);

    // If not found, create the organization
    if (!matchedOrgId && orgName) {
      const newOrg = addOrganization({
        name: orgName,
        type: "corporate",
        sector: "Other",
        website: "",
        description: "",
        status: "prospect",
        linkedContacts: [],
        lastInteraction: new Date().toISOString().split("T")[0],
      });
      matchedOrgId = newOrg.id;
    }

    // Unlink from old org if different
    if (currentOrgId && currentOrgId !== matchedOrgId) {
      unlinkContactFromOrg(currentOrgId, contactId);
    }

    // Link to new org if found or created
    if (matchedOrgId) {
      linkContactToOrg(matchedOrgId, contactId);
    }
  } catch (e) {
    // Silently fail if organizations store not available
  }
}
