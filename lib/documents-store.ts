// Generate unique ID
function generateUniqueId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export interface Document {
  id: string;
  name: string;
  type: "pdf" | "document" | "spreadsheet" | "presentation" | "image" | "other";
  size: number; // in KB
  uploadedBy: string; // user/contact name
  uploadedAt: string; // ISO date
  linkedContactId?: string;
  linkedOrganizationId?: string;
  linkedMeetingId?: string;
  tags: string[];
  description: string;
  fileUrl?: string; // placeholder for actual file URL
}

// Mock documents data
const mockDocuments: Document[] = [
  {
    id: "1",
    name: "Microsoft Sponsorship Proposal 2026",
    type: "presentation",
    size: 2450,
    uploadedBy: "Admin",
    uploadedAt: "2026-06-12",
    linkedOrganizationId: "1",
    linkedContactId: "1",
    tags: ["sponsorship", "proposal", "microsoft"],
    description: "Formal sponsorship proposal for Microsoft partnership",
    fileUrl: "/documents/microsoft-proposal-2026.pptx",
  },
  {
    id: "2",
    name: "PIEDS 2026 Budget Breakdown",
    type: "spreadsheet",
    size: 350,
    uploadedBy: "Finance Team",
    uploadedAt: "2026-06-10",
    tags: ["budget", "finance", "planning"],
    description: "Complete budget allocation for PIEDS 2026 event",
    fileUrl: "/documents/pieds-2026-budget.xlsx",
  },
  {
    id: "3",
    name: "Amazon AWS Partnership Agreement",
    type: "document",
    size: 1200,
    uploadedBy: "Legal",
    uploadedAt: "2026-06-08",
    linkedOrganizationId: "2",
    linkedContactId: "2",
    tags: ["partnership", "agreement", "aws"],
    description: "Partnership agreement terms and conditions",
    fileUrl: "/documents/aws-partnership-agreement.pdf",
  },
  {
    id: "4",
    name: "Event Timeline & Milestones",
    type: "document",
    size: 450,
    uploadedBy: "Event Manager",
    uploadedAt: "2026-06-05",
    tags: ["timeline", "planning", "milestones"],
    description: "PIEDS 2026 event schedule and key milestones",
    fileUrl: "/documents/event-timeline.docx",
  },
  {
    id: "5",
    name: "Marketing Collateral Assets",
    type: "image",
    size: 5600,
    uploadedBy: "Marketing",
    uploadedAt: "2026-06-01",
    tags: ["marketing", "assets", "design"],
    description: "Logos, banners, and promotional graphics",
    fileUrl: "/documents/marketing-assets.zip",
  },
];

// Storage key
const DOCUMENTS_STORAGE_KEY = "pieds_documents";

// Get all documents
export function getDocuments(): Document[] {
  if (typeof window === "undefined") return mockDocuments;
  const stored = localStorage.getItem(DOCUMENTS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : mockDocuments;
}

// Save documents to localStorage
export function saveDocuments(documents: Document[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(documents));
}

// Initialize localStorage with mock data
export function initializeDocuments(): void {
  if (typeof window === "undefined") return;
  if (!localStorage.getItem(DOCUMENTS_STORAGE_KEY)) {
    saveDocuments(mockDocuments);
  }
}

// Add document
export function addDocument(document: Omit<Document, "id">): Document {
  const newDocument: Document = {
    ...document,
    id: generateUniqueId(),
  };
  const documents = getDocuments();
  documents.push(newDocument);
  saveDocuments(documents);
  return newDocument;
}

// Update document
export function updateDocument(
  id: string,
  updates: Partial<Document>
): Document | null {
  const documents = getDocuments();
  const index = documents.findIndex((d) => d.id === id);
  if (index === -1) return null;
  documents[index] = { ...documents[index], ...updates };
  saveDocuments(documents);
  return documents[index];
}

// Delete document
export function deleteDocument(id: string): boolean {
  const documents = getDocuments();
  const index = documents.findIndex((d) => d.id === id);
  if (index === -1) return false;
  documents.splice(index, 1);
  saveDocuments(documents);
  return true;
}

// Get document by ID
export function getDocumentById(id: string): Document | null {
  const documents = getDocuments();
  return documents.find((d) => d.id === id) || null;
}

// Get documents by contact
export function getDocumentsByContact(contactId: string): Document[] {
  const documents = getDocuments();
  return documents.filter((d) => d.linkedContactId === contactId);
}

// Get documents by organization
export function getDocumentsByOrganization(orgId: string): Document[] {
  const documents = getDocuments();
  return documents.filter((d) => d.linkedOrganizationId === orgId);
}

// Get documents by meeting
export function getDocumentsByMeeting(meetingId: string): Document[] {
  const documents = getDocuments();
  return documents.filter((d) => d.linkedMeetingId === meetingId);
}

// Get all tags
export function getAllDocumentTags(): string[] {
  const documents = getDocuments();
  const tagsSet = new Set<string>();
  documents.forEach((d) => d.tags.forEach((t) => tagsSet.add(t)));
  return Array.from(tagsSet).sort();
}

// Search documents
export function searchDocuments(query: string): Document[] {
  const documents = getDocuments();
  const q = query.toLowerCase();
  return documents.filter(
    (d) =>
      d.name.toLowerCase().includes(q) ||
      d.description.toLowerCase().includes(q) ||
      d.tags.some((t) => t.toLowerCase().includes(q))
  );
}

// Document types
export const DOCUMENT_TYPES = [
  "pdf",
  "document",
  "spreadsheet",
  "presentation",
  "image",
  "other",
] as const;
