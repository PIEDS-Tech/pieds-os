// Generate unique ID
function generateUniqueId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assigneeId?: string; // contact ID
  assigneeName?: string;
  assigneeEmail?: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  deadline: string; // ISO date format
  linkedMeetingId?: string;
  linkedContactId?: string;
  linkedOrganizationId?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// Mock tasks data
const mockTasks: Task[] = [
  {
    id: "1",
    title: "Send Microsoft sponsorship proposal",
    description:
      "Prepare and send formal sponsorship proposal to Microsoft based on discussion",
    assigneeId: "1",
    assigneeName: "Ananya Sharma",
    assigneeEmail: "ananya@microsoft.com",
    status: "in-progress",
    priority: "high",
    deadline: "2026-06-20",
    linkedMeetingId: "1",
    linkedContactId: "1",
    notes: "Follow up from initial discussion. Include Silver tier benefits.",
    createdAt: "2026-06-10",
    updatedAt: "2026-06-12",
  },
  {
    id: "2",
    title: "Prepare Amazon partnership deck",
    description: "Create detailed partnership proposal deck for AWS partnership",
    assigneeId: "2",
    assigneeName: "Rahul Patel",
    assigneeEmail: "rahul@amazon.com",
    status: "todo",
    priority: "high",
    deadline: "2026-06-18",
    linkedMeetingId: "2",
    linkedContactId: "2",
    notes: "Include AWS services available, pricing, and terms",
    createdAt: "2026-06-12",
    updatedAt: "2026-06-12",
  },
  {
    id: "3",
    title: "Update PIEDS website with sponsors",
    description: "Add confirmed sponsors to website sponsor list",
    status: "todo",
    priority: "medium",
    deadline: "2026-06-25",
    notes: "Wait for sponsor logos and links",
    createdAt: "2026-06-10",
    updatedAt: "2026-06-10",
  },
  {
    id: "4",
    title: "Schedule investor pitch sessions",
    description: "Coordinate and schedule pitch sessions with investors",
    status: "done",
    priority: "high",
    deadline: "2026-06-15",
    linkedContactId: "3",
    notes: "Completed - all investor meetings scheduled",
    createdAt: "2026-06-08",
    updatedAt: "2026-06-15",
  },
  {
    id: "5",
    title: "Design marketing collateral",
    description: "Create posters, banners, and digital marketing materials",
    status: "in-progress",
    priority: "medium",
    deadline: "2026-06-22",
    notes: "In progress with design team",
    createdAt: "2026-06-05",
    updatedAt: "2026-06-12",
  },
];

// Storage key
const TASKS_STORAGE_KEY = "pieds_tasks";

// Get all tasks
export function getTasks(): Task[] {
  if (typeof window === "undefined") return mockTasks;
  const stored = localStorage.getItem(TASKS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : mockTasks;
}

// Save tasks to localStorage
export function saveTasks(tasks: Task[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
}

// Initialize localStorage with mock data
export function initializeTasks(): void {
  if (typeof window === "undefined") return;
  if (!localStorage.getItem(TASKS_STORAGE_KEY)) {
    saveTasks(mockTasks);
  }
}

// Add task
export function addTask(task: Omit<Task, "id">): Task {
  const newTask: Task = {
    ...task,
    id: generateUniqueId(),
  };
  const tasks = getTasks();
  tasks.push(newTask);
  saveTasks(tasks);
  return newTask;
}

// Update task
export function updateTask(id: string, updates: Partial<Task>): Task | null {
  const tasks = getTasks();
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return null;
  tasks[index] = {
    ...tasks[index],
    ...updates,
    updatedAt: new Date().toISOString().split("T")[0],
  };
  saveTasks(tasks);
  return tasks[index];
}

// Delete task
export function deleteTask(id: string): boolean {
  const tasks = getTasks();
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return false;
  tasks.splice(index, 1);
  saveTasks(tasks);
  return true;
}

// Get task by ID
export function getTaskById(id: string): Task | null {
  const tasks = getTasks();
  return tasks.find((t) => t.id === id) || null;
}

// Get tasks by status
export function getTasksByStatus(status: Task["status"]): Task[] {
  const tasks = getTasks();
  return tasks.filter((t) => t.status === status);
}

// Get tasks by assignee
export function getTasksByAssignee(assigneeId: string): Task[] {
  const tasks = getTasks();
  return tasks.filter((t) => t.assigneeId === assigneeId);
}

// Get overdue tasks
export function getOverdueTasks(): Task[] {
  const tasks = getTasks();
  const today = new Date().toISOString().split("T")[0];
  return tasks.filter((t) => t.deadline < today && t.status !== "done");
}

// Get tasks due soon (within 7 days)
export function getTasksDueSoon(): Task[] {
  const tasks = getTasks();
  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  const todayStr = today.toISOString().split("T")[0];

  return tasks.filter(
    (t) => t.deadline >= todayStr && t.deadline <= nextWeek && t.status !== "done"
  );
}

// Get tasks by linked entity
export function getTasksByMeeting(meetingId: string): Task[] {
  const tasks = getTasks();
  return tasks.filter((t) => t.linkedMeetingId === meetingId);
}

export function getTasksByContact(contactId: string): Task[] {
  const tasks = getTasks();
  return tasks.filter((t) => t.linkedContactId === contactId);
}

// Task statuses
export const TASK_STATUSES = ["todo", "in-progress", "done"] as const;

// Task priorities
export const TASK_PRIORITIES = ["low", "medium", "high"] as const;
