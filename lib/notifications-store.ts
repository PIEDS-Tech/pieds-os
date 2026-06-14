export interface Notification {
  id: string;
  type: "meeting" | "task" | "campaign" | "contact" | "system";
  title: string;
  message: string;
  icon: string;
  createdAt: string;
  isRead: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

export interface ActivityFeedItem {
  id: string;
  action: string;
  description: string;
  actor: string;
  timestamp: string;
  icon: string;
  type: "contact" | "meeting" | "task" | "campaign" | "organization";
}

const NOTIFICATIONS_STORAGE_KEY = "pieds_notifications";
const ACTIVITY_FEED_STORAGE_KEY = "pieds_activity_feed";

// Mock notifications
const mockNotifications: Notification[] = [
  {
    id: "n1",
    type: "meeting",
    title: "Meeting Reminder",
    message: "Partnership Discussion with Microsoft is starting in 1 hour",
    icon: "📅",
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    isRead: false,
    actionUrl: "/meetings/1",
    actionLabel: "View Meeting",
  },
  {
    id: "n2",
    type: "task",
    title: "Task Overdue",
    message: "Update budget proposal - assigned to you",
    icon: "⚠️",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    actionUrl: "/tasks/5",
    actionLabel: "View Task",
  },
  {
    id: "n3",
    type: "campaign",
    title: "Campaign Reply",
    message: "New reply to Sponsorship Outreach campaign from TechCorp",
    icon: "💬",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    actionUrl: "/outreach/1",
    actionLabel: "View Campaign",
  },
  {
    id: "n4",
    type: "contact",
    title: "Follow-up Due",
    message: "Follow up with John Smith - last contact 60 days ago",
    icon: "👤",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    actionUrl: "/contacts/1",
    actionLabel: "View Contact",
  },
];

// Mock activity feed
const mockActivityFeed: ActivityFeedItem[] = [
  {
    id: "a1",
    action: "created",
    description: "New contact: Sarah Johnson from Acme Corp",
    actor: "You",
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    icon: "👤",
    type: "contact",
  },
  {
    id: "a2",
    action: "scheduled",
    description: "Partnership Discussion with Microsoft",
    actor: "You",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    icon: "📅",
    type: "meeting",
  },
  {
    id: "a3",
    action: "created",
    description: "Task: Update budget proposal assigned to Finance Team",
    actor: "You",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    icon: "✓",
    type: "task",
  },
  {
    id: "a4",
    action: "sent",
    description: "Sponsorship Outreach campaign to 45 contacts",
    actor: "You",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    icon: "📧",
    type: "campaign",
  },
  {
    id: "a5",
    action: "created",
    description: "Organization: TechCorp International",
    actor: "You",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    icon: "🏢",
    type: "organization",
  },
];

export function getNotifications(): Notification[] {
  if (typeof window === "undefined") return mockNotifications;
  const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : mockNotifications;
}

export function saveNotifications(notifications: Notification[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
}

export function initializeNotifications(): void {
  if (typeof window === "undefined") return;
  if (!localStorage.getItem(NOTIFICATIONS_STORAGE_KEY)) {
    saveNotifications(mockNotifications);
  }
}

export function markAsRead(id: string): void {
  const notifications = getNotifications();
  const notification = notifications.find((n) => n.id === id);
  if (notification) {
    notification.isRead = true;
    saveNotifications(notifications);
  }
}

export function markAllAsRead(): void {
  const notifications = getNotifications();
  notifications.forEach((n) => (n.isRead = true));
  saveNotifications(notifications);
}

export function deleteNotification(id: string): void {
  const notifications = getNotifications();
  const filtered = notifications.filter((n) => n.id !== id);
  saveNotifications(filtered);
}

export function getUnreadCount(): number {
  return getNotifications().filter((n) => !n.isRead).length;
}

export function getActivityFeed(): ActivityFeedItem[] {
  if (typeof window === "undefined") return mockActivityFeed;
  const stored = localStorage.getItem(ACTIVITY_FEED_STORAGE_KEY);
  return stored ? JSON.parse(stored) : mockActivityFeed;
}

export function addActivityItem(item: Omit<ActivityFeedItem, "id">): void {
  if (typeof window === "undefined") return;
  const feed = getActivityFeed();
  feed.unshift({
    ...item,
    id: `a-${Date.now()}`,
  });
  if (typeof window !== "undefined") {
    localStorage.setItem(ACTIVITY_FEED_STORAGE_KEY, JSON.stringify(feed.slice(0, 50)));
  }
}
