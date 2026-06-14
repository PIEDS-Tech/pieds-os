export interface ActionItem {
  id: string;
  description: string;
  owner: string;
  deadline: string;
  status: "pending" | "completed";
}

export interface MeetingMOM {
  id: string;
  meetingId: string;
  summary: string;
  keyDecisions: string[];
  actionItems: ActionItem[];
  nextSteps: string[];
  generatedAt: string;
}

const MOM_STORAGE_KEY = "pieds_moms";

export function getMOMByMeetingId(meetingId: string): MeetingMOM | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(MOM_STORAGE_KEY);
  const moms: MeetingMOM[] = stored ? JSON.parse(stored) : [];
  return moms.find((m) => m.meetingId === meetingId) || null;
}

export function saveMOM(mom: MeetingMOM): void {
  if (typeof window === "undefined") return;
  const stored = localStorage.getItem(MOM_STORAGE_KEY);
  const moms: MeetingMOM[] = stored ? JSON.parse(stored) : [];
  const index = moms.findIndex((m) => m.meetingId === mom.meetingId);
  if (index >= 0) {
    moms[index] = mom;
  } else {
    moms.push(mom);
  }
  localStorage.setItem(MOM_STORAGE_KEY, JSON.stringify(moms));
}

export function generateMockMOM(meetingId: string, meetingTitle: string): MeetingMOM {
  const mom: MeetingMOM = {
    id: `mom-${Date.now()}`,
    meetingId,
    summary: `During this meeting, we discussed the key objectives for ${meetingTitle}. All participants agreed on the strategic direction and identified critical action items for the next phase. The discussion was productive and aligned all stakeholders on priorities.`,
    keyDecisions: [
      "Approved budget allocation for Q3 initiatives",
      "Decided to prioritize mobile app optimization",
      "Agreed on weekly sync schedule for next month",
      "Confirmed partnership terms with sponsor company",
    ],
    actionItems: [
      {
        id: `ai-1`,
        description: "Prepare detailed budget breakdown document",
        owner: "Finance Team",
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        status: "pending",
      },
      {
        id: `ai-2`,
        description: "Schedule follow-up call with sponsor contacts",
        owner: "Partnership Manager",
        deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        status: "pending",
      },
      {
        id: `ai-3`,
        description: "Complete mobile app feature spec document",
        owner: "Technical Lead",
        deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        status: "pending",
      },
      {
        id: `ai-4`,
        description: "Send meeting summary to all attendees",
        owner: "Event Coordinator",
        deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        status: "pending",
      },
    ],
    nextSteps: [
      "Review and approve MOM within 24 hours",
      "Begin implementation of approved action items",
      "Schedule follow-up meeting for next week",
    ],
    generatedAt: new Date().toISOString(),
  };
  return mom;
}
