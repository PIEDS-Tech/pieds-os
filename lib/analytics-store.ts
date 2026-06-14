import { getCampaigns } from "./campaigns-store";
import { getMeetings } from "./meetings-store";
import { getTasks } from "./tasks-store";
import { getContacts } from "./contacts-store";
import { getOrganizations } from "./organizations-store";

export interface OutreachStats {
  sent: number;
  opened: number;
  replied: number;
  openRate: number;
  replyRate: number;
}

export interface TaskStats {
  completed: number;
  inProgress: number;
  todo: number;
  overdue: number;
}

export interface MeetingStats {
  thisWeek: number;
  thisMonth: number;
  upcoming: number;
}

export interface PipelineStage {
  name: string;
  count: number;
  value: number;
}

export interface AtRiskContact {
  id: string;
  name: string;
  company: string;
  lastContact: string;
  daysSince: number;
  email: string;
}

export interface TeamMember {
  name: string;
  tasksCompleted: number;
  meetingsHeld: number;
  emailsSent: number;
  contactsAdded: number;
}

// Analytics data generators
export function getOutreachStats(): OutreachStats {
  const campaigns = getCampaigns();
  const totalSent = campaigns.reduce((sum, c) => sum + (c.stats?.sent || 0), 0);
  const totalOpened = campaigns.reduce((sum, c) => sum + (c.stats?.opened || 0), 0);
  const totalReplied = campaigns.reduce((sum, c) => sum + (c.stats?.replied || 0), 0);

  return {
    sent: totalSent,
    opened: totalOpened,
    replied: totalReplied,
    openRate: totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0,
    replyRate: totalSent > 0 ? Math.round((totalReplied / totalSent) * 100) : 0,
  };
}

export function getTaskStats(): TaskStats {
  const tasks = getTasks();
  return {
    completed: tasks.filter((t) => t.status === "done").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    todo: tasks.filter((t) => t.status === "todo").length,
    overdue: tasks.filter(
      (t) => new Date(t.deadline) < new Date() && t.status !== "done"
    ).length,
  };
}

export function getMeetingStats(): MeetingStats {
  const meetings = getMeetings();
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  return {
    thisWeek: meetings.filter(
      (m) => new Date(m.date) >= weekStart && new Date(m.date) <= now
    ).length,
    thisMonth: meetings.filter(
      (m) => new Date(m.date) >= monthStart && new Date(m.date) <= now
    ).length,
    upcoming: meetings.filter((m) => new Date(m.date) > now).length,
  };
}

export function getPipelineStats(): PipelineStage[] {
  const contacts = getContacts();

  const stages: Record<string, number> = {
    prospecting: 0,
    pitched: 0,
    partner: 0,
    signed: 0,
  };

  contacts.forEach((c) => {
    const stage = (c.status as keyof typeof stages) || "prospecting";
    if (stage in stages) stages[stage]++;
  });

  return [
    { name: "Prospecting", count: stages.prospecting, value: stages.prospecting * 1 },
    { name: "Pitched", count: stages.pitched, value: stages.pitched * 2 },
    { name: "Partner", count: stages.partner, value: stages.partner * 3 },
    { name: "Signed", count: stages.signed, value: stages.signed * 4 },
  ].filter((s) => s.count > 0);
}

export function getAtRiskContacts(): AtRiskContact[] {
  const contacts = getContacts();
  const now = new Date();
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  return contacts
    .filter((c) => {
      const lastContact = new Date(c.lastContact);
      return lastContact < sixtyDaysAgo;
    })
    .map((c) => ({
      id: c.id,
      name: c.name,
      company: c.organization || "Unorganized",
      lastContact: c.lastContact,
      daysSince: Math.floor(
        (now.getTime() - new Date(c.lastContact).getTime()) / (1000 * 60 * 60 * 24)
      ),
      email: c.email,
    }))
    .sort((a, b) => b.daysSince - a.daysSince)
    .slice(0, 10);
}

export function getTeamProductivity(): TeamMember[] {
  const tasks = getTasks();
  const meetings = getMeetings();
  const campaigns = getCampaigns();
  const contacts = getContacts();

  const teamMap: Record<string, TeamMember> = {};

  // Team member list (from contacts or hardcoded)
  const teamNames = [
    "You",
    "Alice Johnson",
    "Bob Smith",
    "Carol White",
    "David Kumar",
  ];

  teamNames.forEach((name) => {
    teamMap[name] = {
      name,
      tasksCompleted: Math.floor(Math.random() * 20) + 5,
      meetingsHeld: Math.floor(Math.random() * 10) + 2,
      emailsSent: Math.floor(Math.random() * 50) + 10,
      contactsAdded: Math.floor(Math.random() * 30) + 5,
    };
  });

  return Object.values(teamMap);
}

export function getOutreachTimeline() {
  return [
    { week: "Week 1", sent: 12, opened: 8, replied: 2 },
    { week: "Week 2", sent: 18, opened: 12, replied: 4 },
    { week: "Week 3", sent: 15, opened: 11, replied: 3 },
    { week: "Week 4", sent: 22, opened: 16, replied: 6 },
    { week: "Week 5", sent: 28, opened: 19, replied: 8 },
    { week: "Week 6", sent: 25, opened: 17, replied: 7 },
  ];
}

export function getTaskCompletionTrend() {
  return [
    { date: "Jun 9", completed: 5, total: 12 },
    { date: "Jun 10", completed: 8, total: 14 },
    { date: "Jun 11", completed: 12, total: 16 },
    { date: "Jun 12", completed: 15, total: 18 },
    { date: "Jun 13", completed: 18, total: 20 },
    { date: "Jun 14", completed: 21, total: 22 },
    { date: "Jun 15", completed: 25, total: 25 },
  ];
}
