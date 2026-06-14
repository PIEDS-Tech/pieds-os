"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Search, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Task,
  getTasks,
  deleteTask,
  TASK_STATUSES,
  TASK_PRIORITIES,
  getOverdueTasks,
  getTasksDueSoon,
} from "@/lib/tasks-store";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedPriority, setSelectedPriority] = useState<string>("");
  const [selectedAssignee, setSelectedAssignee] = useState<string>("");
  const [view, setView] = useState<"list" | "kanban">("list");
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
  const [dragStartId, setDragStartId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Load tasks
  useEffect(() => {
    const loaded = getTasks();
    setTasks(loaded);
  }, []);

  // Filter tasks
  useEffect(() => {
    let filtered = tasks;

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.assigneeName?.toLowerCase().includes(q)
      );
    }

    if (selectedStatus) {
      filtered = filtered.filter((t) => t.status === selectedStatus);
    }

    if (selectedPriority) {
      filtered = filtered.filter((t) => t.priority === selectedPriority);
    }

    if (selectedAssignee) {
      filtered = filtered.filter((t) => t.assigneeId === selectedAssignee);
    }

    setFilteredTasks(filtered);
  }, [tasks, search, selectedStatus, selectedPriority, selectedAssignee]);

  // Drag to select
  useEffect(() => {
    window.addEventListener("mouseup", () => setIsDragging(false));
    return () => window.removeEventListener("mouseup", () => setIsDragging(false));
  }, []);

  const handleRowMouseDown = (taskId: string) => {
    setDragStartId(taskId);
    setIsDragging(true);
  };

  const handleRowMouseEnter = (taskId: string) => {
    if (!isDragging || !dragStartId) return;

    const startIndex = filteredTasks.findIndex((t) => t.id === dragStartId);
    const endIndex = filteredTasks.findIndex((t) => t.id === taskId);

    if (startIndex === -1 || endIndex === -1) return;

    const minIndex = Math.min(startIndex, endIndex);
    const maxIndex = Math.max(startIndex, endIndex);

    const newSelected = new Set<string>();
    for (let i = minIndex; i <= maxIndex; i++) {
      newSelected.add(filteredTasks[i].id);
    }
    setSelectedTasks(newSelected);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      deleteTask(id);
      setTasks(getTasks());
    }
  };

  const handleSelectAll = () => {
    if (selectedTasks.size === filteredTasks.length) {
      setSelectedTasks(new Set());
    } else {
      setSelectedTasks(new Set(filteredTasks.map((t) => t.id)));
    }
  };

  const handleBulkDelete = () => {
    if (selectedTasks.size === 0) return;
    if (confirm(`Delete ${selectedTasks.size} tasks?`)) {
      selectedTasks.forEach((id) => deleteTask(id));
      setTasks(getTasks());
      setSelectedTasks(new Set());
    }
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    return {
      low: "bg-blue-100 text-blue-700",
      medium: "bg-yellow-100 text-yellow-700",
      high: "bg-red-100 text-red-700",
    }[priority];
  };

  const getStatusColor = (status: Task["status"]) => {
    return {
      "todo": "bg-gray-100 text-gray-700",
      "in-progress": "bg-blue-100 text-blue-700",
      "done": "bg-green-100 text-green-700",
    }[status];
  };

  const isOverdue = (deadline: string, status: Task["status"]) => {
    const today = new Date().toISOString().split("T")[0];
    return deadline < today && status !== "done";
  };

  const getUniqueAssignees = Array.from(
    new Set(
      tasks
        .filter((t) => t.assigneeId)
        .map((t) => JSON.stringify({ id: t.assigneeId, name: t.assigneeName }))
    )
  ).map((s) => JSON.parse(s));

  const overdueCount = getOverdueTasks().length;
  const dueSoonCount = getTasksDueSoon().length;

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground mt-1">
            {filteredTasks.length} of {tasks.length} tasks
          </p>
        </div>
        <Link href="/tasks/new">
          <Button className="bg-primary hover:bg-primary/90 gap-2">
            <Plus className="w-4 h-4" />
            New Task
          </Button>
        </Link>
      </div>

      {/* Alerts */}
      {overdueCount > 0 && (
        <Card className="p-4 border-0 bg-red-50 border-l-4 border-red-500 space-y-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="font-semibold text-red-900">
              {overdueCount} overdue task{overdueCount !== 1 ? "s" : ""}
            </p>
          </div>
        </Card>
      )}

      {dueSoonCount > 0 && (
        <Card className="p-4 border-0 bg-yellow-50 border-l-4 border-yellow-500">
          <p className="font-semibold text-yellow-900">
            📅 {dueSoonCount} task{dueSoonCount !== 1 ? "s" : ""} due within the next week
          </p>
        </Card>
      )}

      {/* Search & Filters */}
      <Card className="p-4 border-0 space-y-4">
        <div className="flex gap-2 items-center">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border-0 bg-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg text-sm bg-background"
          >
            <option value="">All Status</option>
            {TASK_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s === "todo" && "📝 "}
                {s === "in-progress" && "⚙️ "}
                {s === "done" && "✅ "}
                {s.charAt(0).toUpperCase() +
                  s.slice(1).replace("-", " ")}
              </option>
            ))}
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg text-sm bg-background"
          >
            <option value="">All Priority</option>
            {TASK_PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p === "high" && "🔴 "}
                {p === "medium" && "🟡 "}
                {p === "low" && "🟢 "}
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={selectedAssignee}
            onChange={(e) => setSelectedAssignee(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg text-sm bg-background"
          >
            <option value="">All Assignees</option>
            {getUniqueAssignees.map((a: any) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            <button
              onClick={() => setView("list")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                view === "list"
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              List
            </button>
            <button
              onClick={() => setView("kanban")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                view === "kanban"
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Kanban
            </button>
          </div>
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedTasks.size > 0 && (
        <Card className="p-4 border-0 bg-blue-50 flex items-center justify-between">
          <p className="text-sm font-semibold text-blue-700">
            {selectedTasks.size} task(s) selected
          </p>
          <Button
            size="sm"
            variant="destructive"
            onClick={handleBulkDelete}
            className="gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete Selected
          </Button>
        </Card>
      )}

      {/* List View */}
      {view === "list" && (
        <Card className="border-0 overflow-hidden">
          {filteredTasks.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">No tasks found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={
                          selectedTasks.size === filteredTasks.length &&
                          filteredTasks.length > 0
                        }
                        onChange={handleSelectAll}
                        className="rounded"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Title
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Assignee
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Deadline
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Priority
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((task) => (
                    <tr
                      key={task.id}
                      className={`border-b border-border transition-colors cursor-pointer select-none ${
                        selectedTasks.has(task.id)
                          ? "bg-blue-50"
                          : isOverdue(task.deadline, task.status)
                          ? "bg-red-50"
                          : "hover:bg-muted/50"
                      }`}
                      onMouseDown={() => handleRowMouseDown(task.id)}
                      onMouseEnter={() => handleRowMouseEnter(task.id)}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedTasks.has(task.id)}
                          onChange={(e) => {
                            const newSelected = new Set(selectedTasks);
                            if (e.target.checked) {
                              newSelected.add(task.id);
                            } else {
                              newSelected.delete(task.id);
                            }
                            setSelectedTasks(newSelected);
                          }}
                          className="rounded"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/tasks/${task.id}`}
                          className="font-semibold hover:text-primary"
                        >
                          {task.title}
                          {isOverdue(task.deadline, task.status) && (
                            <span className="ml-2 text-red-600">⚠️</span>
                          )}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {task.assigneeName || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {new Date(task.deadline).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={getStatusColor(task.status)}>
                          {task.status === "todo" && "📝 "}
                          {task.status === "in-progress" && "⚙️ "}
                          {task.status === "done" && "✅ "}
                          {task.status.replace("-", " ")}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 flex gap-2">
                        <Link href={`/tasks/${task.id}`}>
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(task.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* Kanban View */}
      {view === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TASK_STATUSES.map((status) => (
            <Card key={status} className="p-4 border-0 space-y-3">
              <h3 className="font-semibold">
                {status === "todo" && "📝 "}
                {status === "in-progress" && "⚙️ "}
                {status === "done" && "✅ "}
                {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({filteredTasks.filter((t) => t.status === status).length})
                </span>
              </h3>

              <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
                {filteredTasks
                  .filter((t) => t.status === status)
                  .map((task) => (
                    <Link key={task.id} href={`/tasks/${task.id}`}>
                      <div className="p-3 bg-muted rounded-lg hover:shadow-md transition-all cursor-pointer">
                        <p className="font-semibold text-sm line-clamp-2">
                          {task.title}
                          {isOverdue(task.deadline, task.status) && (
                            <span className="ml-2">⚠️</span>
                          )}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(task.deadline).toLocaleDateString()}
                          </span>
                        </div>
                        {task.assigneeName && (
                          <p className="text-xs text-muted-foreground mt-2">
                            👤 {task.assigneeName}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
