// Generate unique ID
function generateUniqueId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export interface CampaignRecipient {
  contactId: string;
  contactName: string;
  contactEmail: string;
  status: "pending" | "sent" | "opened" | "replied" | "bounced";
  sentAt?: string;
  openedAt?: string;
  repliedAt?: string;
}

export interface Campaign {
  id: string;
  name: string;
  type: "sponsorship" | "partnership" | "mentor" | "investor";
  templateId: string;
  templateName: string;
  status: "draft" | "scheduled" | "sent" | "completed";
  recipients: CampaignRecipient[];
  createdAt: string;
  scheduledFor?: string;
  sentAt?: string;
  stats: {
    total: number;
    sent: number;
    opened: number;
    replied: number;
    bounced: number;
  };
}

// Mock campaigns data
const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "TechCorp Sponsorship Drive",
    type: "sponsorship",
    templateId: "1",
    templateName: "Sponsorship Proposal",
    status: "sent",
    recipients: [
      {
        contactId: "1",
        contactName: "Ananya Sharma",
        contactEmail: "ananya@microsoft.com",
        status: "opened",
        sentAt: "2026-06-10",
        openedAt: "2026-06-10",
      },
      {
        contactId: "2",
        contactName: "Rahul Patel",
        contactEmail: "rahul@amazon.com",
        status: "sent",
        sentAt: "2026-06-10",
      },
    ],
    createdAt: "2026-06-08",
    sentAt: "2026-06-10",
    stats: {
      total: 2,
      sent: 2,
      opened: 1,
      replied: 0,
      bounced: 0,
    },
  },
  {
    id: "2",
    name: "Investor Outreach - Q3",
    type: "investor",
    templateId: "2",
    templateName: "Investor Pitch",
    status: "draft",
    recipients: [],
    createdAt: "2026-06-12",
    stats: {
      total: 0,
      sent: 0,
      opened: 0,
      replied: 0,
      bounced: 0,
    },
  },
];

// Storage key
const CAMPAIGNS_STORAGE_KEY = "pieds_campaigns";

// Get all campaigns
export function getCampaigns(): Campaign[] {
  if (typeof window === "undefined") return mockCampaigns;
  const stored = localStorage.getItem(CAMPAIGNS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : mockCampaigns;
}

// Save campaigns to localStorage
export function saveCampaigns(campaigns: Campaign[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CAMPAIGNS_STORAGE_KEY, JSON.stringify(campaigns));
}

// Initialize localStorage with mock data
export function initializeCampaigns(): void {
  if (typeof window === "undefined") return;
  if (!localStorage.getItem(CAMPAIGNS_STORAGE_KEY)) {
    saveCampaigns(mockCampaigns);
  }
}

// Add campaign
export function addCampaign(campaign: Omit<Campaign, "id">): Campaign {
  const newCampaign: Campaign = {
    ...campaign,
    id: generateUniqueId(),
  };
  const campaigns = getCampaigns();
  campaigns.push(newCampaign);
  saveCampaigns(campaigns);
  return newCampaign;
}

// Update campaign
export function updateCampaign(id: string, updates: Partial<Campaign>): Campaign | null {
  const campaigns = getCampaigns();
  const index = campaigns.findIndex((c) => c.id === id);
  if (index === -1) return null;
  campaigns[index] = { ...campaigns[index], ...updates };
  saveCampaigns(campaigns);
  return campaigns[index];
}

// Delete campaign
export function deleteCampaign(id: string): boolean {
  const campaigns = getCampaigns();
  const index = campaigns.findIndex((c) => c.id === id);
  if (index === -1) return false;
  campaigns.splice(index, 1);
  saveCampaigns(campaigns);
  return true;
}

// Get campaign by ID
export function getCampaignById(id: string): Campaign | null {
  const campaigns = getCampaigns();
  return campaigns.find((c) => c.id === id) || null;
}

// Campaign types
export const CAMPAIGN_TYPES = ["sponsorship", "partnership", "mentor", "investor"] as const;

// Campaign statuses
export const CAMPAIGN_STATUSES = ["draft", "scheduled", "sent", "completed"] as const;
