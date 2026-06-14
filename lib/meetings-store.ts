// Generate unique ID
function generateUniqueId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export interface MeetingParticipant {
  contactId: string;
  contactName: string;
  contactEmail: string;
  role?: string; // e.g., "Organizer", "Attendee", "Stakeholder"
}

export interface Meeting {
  id: string;
  title: string;
  description: string;
  date: string; // ISO date format
  time: string; // HH:MM format
  duration: number; // in minutes
  location?: string;
  meetingLink?: string; // for virtual meetings
  participants: MeetingParticipant[];
  agenda: string;
  notes: string;
  recordingLink?: string;
  linkedTasks: string[]; // task IDs
  linkedContacts: string[]; // contact IDs directly (not just via participants)
  linkedOrganizations: string[]; // org IDs
  status: "scheduled" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

// Mock meetings data
const mockMeetings: Meeting[] = [
  {
    id: "1",
    title: "Microsoft Sponsorship Discussion",
    description: "Initial meeting to discuss sponsorship opportunities for PIEDS 2026",
    date: "2026-06-18",
    time: "14:30",
    duration: 60,
    location: "Virtual - Google Meet",
    meetingLink: "https://meet.google.com/example",
    participants: [
      {
        contactId: "1",
        contactName: "Ananya Sharma",
        contactEmail: "ananya@microsoft.com",
        role: "Sponsor Contact",
      },
    ],
    agenda: `
      1. Introduction to PIEDS festival
      2. Sponsorship tiers and benefits
      3. Marketing opportunities
      4. Q&A and next steps
    `,
    notes:
      "Ananya showed interest in Silver tier sponsorship. Follow up with formal proposal by next week.",
    linkedTasks: [],
    linkedContacts: ["1"],
    linkedOrganizations: [],
    status: "completed",
    createdAt: "2026-06-10",
    updatedAt: "2026-06-10",
  },
  {
    id: "2",
    title: "Amazon Partnership Kickoff",
    description: "Kickoff meeting for potential AWS partnership",
    date: "2026-06-20",
    time: "10:00",
    duration: 90,
    location: "Amazon Office, Bangalore",
    participants: [
      {
        contactId: "2",
        contactName: "Rahul Patel",
        contactEmail: "rahul@amazon.com",
        role: "Partnership Lead",
      },
    ],
    agenda: `
      1. Partnership scope and goals
      2. AWS services available for student programs
      3. Timeline and deliverables
      4. Agreement on next phases
    `,
    notes: "",
    linkedTasks: [],
    linkedContacts: ["2"],
    linkedOrganizations: [],
    status: "scheduled",
    createdAt: "2026-06-12",
    updatedAt: "2026-06-12",
  },
];

// Storage key
const MEETINGS_STORAGE_KEY = "pieds_meetings";

// Get all meetings
export function getMeetings(): Meeting[] {
  if (typeof window === "undefined") return mockMeetings;
  const stored = localStorage.getItem(MEETINGS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : mockMeetings;
}

// Save meetings to localStorage
export function saveMeetings(meetings: Meeting[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(MEETINGS_STORAGE_KEY, JSON.stringify(meetings));
}

// Initialize localStorage with mock data
export function initializeMeetings(): void {
  if (typeof window === "undefined") return;
  if (!localStorage.getItem(MEETINGS_STORAGE_KEY)) {
    saveMeetings(mockMeetings);
  }
}

// Add meeting
export function addMeeting(meeting: Omit<Meeting, "id">): Meeting {
  const newMeeting: Meeting = {
    ...meeting,
    id: generateUniqueId(),
  };
  const meetings = getMeetings();
  meetings.push(newMeeting);
  saveMeetings(meetings);
  return newMeeting;
}

// Update meeting
export function updateMeeting(
  id: string,
  updates: Partial<Meeting>
): Meeting | null {
  const meetings = getMeetings();
  const index = meetings.findIndex((m) => m.id === id);
  if (index === -1) return null;
  meetings[index] = {
    ...meetings[index],
    ...updates,
    updatedAt: new Date().toISOString().split("T")[0],
  };
  saveMeetings(meetings);
  return meetings[index];
}

// Delete meeting
export function deleteMeeting(id: string): boolean {
  const meetings = getMeetings();
  const index = meetings.findIndex((m) => m.id === id);
  if (index === -1) return false;
  meetings.splice(index, 1);
  saveMeetings(meetings);
  return true;
}

// Get meeting by ID
export function getMeetingById(id: string): Meeting | null {
  const meetings = getMeetings();
  return meetings.find((m) => m.id === id) || null;
}

// Get meetings for a contact
export function getMeetingsByContact(contactId: string): Meeting[] {
  const meetings = getMeetings();
  return meetings.filter((m) => m.linkedContacts.includes(contactId));
}

// Get meetings for an organization
export function getMeetingsByOrganization(orgId: string): Meeting[] {
  const meetings = getMeetings();
  return meetings.filter((m) => m.linkedOrganizations.includes(orgId));
}

// Get upcoming meetings
export function getUpcomingMeetings(): Meeting[] {
  const meetings = getMeetings();
  const today = new Date().toISOString().split("T")[0];
  return meetings
    .filter(
      (m) => m.date >= today && m.status === "scheduled"
    )
    .sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.time.localeCompare(b.time);
    });
}

// Get past meetings
export function getPastMeetings(): Meeting[] {
  const meetings = getMeetings();
  const today = new Date().toISOString().split("T")[0];
  return meetings
    .filter((m) => m.date < today || m.status === "completed")
    .sort((a, b) => b.date.localeCompare(a.date));
}

// Meeting statuses
export const MEETING_STATUSES = [
  "scheduled",
  "completed",
  "cancelled",
] as const;
