"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { ArrowLeft, Edit2, AlertCircle, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getTaskById, updateTask } from "@/lib/tasks-store";
import { getMeetingById } from "@/lib/meetings-store";

export default function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [linkedMeeting, setLinkedMeeting] = useState<any>(null);

  useEffect(() => {
    const loaded = getTaskById(id);
    setTask(loaded);

    // Load linked meeting if task has linkedMeetingId
    if (loaded?.linkedMeetingId) {
      const meeting = getMeetingById(loaded.linkedMeetingId);
      setLinkedMeeting(meeting);
    }

    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Task not found</h1>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    return {
      low: "bg-blue-100 text-blue-700",
      medium: "bg-yellow-100 text-yellow-700",
      high: "bg-red-100 text-red-700",
    }[priority] || "bg-gray-100 text-gray-700";
  };

  const getStatusColor = (status: string) => {
    return {
      "todo": "bg-gray-100 text-gray-700",
      "in-progress": "bg-blue-100 text-blue-700",
      "done": "bg-green-100 text-green-700",
    }[status] || "bg-gray-100 text-gray-700";
  };

  const isOverdue =
    task.deadline < new Date().toISOString().split("T")[0] &&
    task.status !== "done";

  const handleStatusChange = (newStatus: string) => {
    updateTask(id, { status: newStatus });
    setTask({ ...task, status: newStatus });
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/tasks">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{task.title}</h1>
            {isOverdue && (
              <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                This task is overdue
              </p>
            )}
          </div>
        </div>
        <Link href={`/tasks/${id}/edit`}>
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <Edit2 className="w-4 h-4" />
            Edit
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Info Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="p-6 border-0 space-y-4">
            {/* Status */}
            <div>
              <p className="text-xs text-muted-foreground font-semibold mb-2">
                Status
              </p>
              <div className="flex gap-2 flex-wrap">
                {["todo", "in-progress", "done"].map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(s)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                      task.status === s
                        ? getStatusColor(s)
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {s === "todo" && "📝 "}
                    {s === "in-progress" && "⚙️ "}
                    {s === "done" && "✅ "}
                    {s.replace("-", " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div>
              <p className="text-xs text-muted-foreground font-semibold">
                Priority
              </p>
              <Badge className={getPriorityColor(task.priority)}>
                {task.priority === "high" && "🔴 "}
                {task.priority === "medium" && "🟡 "}
                {task.priority === "low" && "🟢 "}
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </Badge>
            </div>

            {/* Deadline */}
            <div>
              <p className="text-xs text-muted-foreground font-semibold">
                Deadline
              </p>
              <p className="text-sm font-medium mt-1">
                {new Date(task.deadline).toLocaleDateString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>

            {/* Assignee */}
            {task.assigneeName && (
              <div>
                <p className="text-xs text-muted-foreground font-semibold">
                  Assignee
                </p>
                <div className="mt-2 p-3 bg-muted rounded-lg">
                  <p className="font-semibold text-sm">{task.assigneeName}</p>
                  <p className="text-xs text-muted-foreground">
                    {task.assigneeEmail}
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Description */}
          {task.description && (
            <Card className="p-6 border-0">
              <h2 className="text-lg font-semibold mb-3">Description</h2>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {task.description}
              </p>
            </Card>
          )}

          {/* Notes */}
          <Card className="p-6 border-0">
            <h2 className="text-lg font-semibold mb-3">Notes</h2>
            <div className="prose prose-sm max-w-none whitespace-pre-wrap text-sm">
              {task.notes || (
                <p className="text-muted-foreground italic">No notes added</p>
              )}
            </div>
          </Card>

          {/* MOM Source Information */}
          {task.notes && task.notes.includes("[ACTION_ITEM_ID:") && (
            <Card className="p-6 border-0 bg-purple-50">
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                📋 Synced from MOM Action Item
              </h2>

              {/* Extract action item info from notes */}
              {(() => {
                const actionItemMatch = task.notes.match(/\[ACTION_ITEM_ID:([^\]]+)\]/);
                const momIdMatch = task.notes.match(/\[MOM_ID:([^\]]+)\]/);
                const ownerMatch = task.notes.match(/Original owner: ([^\n]+)/);
                const statusMatch = task.notes.match(/Original status: ([^\n]+)/);

                return (
                  <div className="space-y-3">
                    <div className="p-3 bg-white border border-purple-200 rounded-lg">
                      <p className="text-sm font-semibold text-purple-700 mb-2">
                        Action Item Details
                      </p>
                      {actionItemMatch && (
                        <div className="text-xs space-y-1 text-muted-foreground">
                          <p>
                            <span className="font-semibold">ID:</span> {actionItemMatch[1]}
                          </p>
                          {ownerMatch && (
                            <p>
                              <span className="font-semibold">Original Owner:</span>{" "}
                              {ownerMatch[1]}
                            </p>
                          )}
                          {statusMatch && (
                            <p>
                              <span className="font-semibold">Original Status:</span>{" "}
                              {statusMatch[1]}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </Card>
          )}

          {/* Linked Meeting */}
          {linkedMeeting && (
            <Card className="p-6 border-0 bg-blue-50">
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Created from Meeting
              </h2>
              <Link href={`/meetings/${linkedMeeting.id}`}>
                <div className="p-4 bg-white border border-blue-200 rounded-lg hover:shadow-md transition-all">
                  <p className="font-semibold mb-2">{linkedMeeting.title}</p>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>📅 {new Date(linkedMeeting.date).toLocaleDateString()}</p>
                    {linkedMeeting.description && (
                      <p className="line-clamp-2">{linkedMeeting.description}</p>
                    )}
                    <p className="text-xs pt-2 font-semibold text-blue-600">
                      ← Click to view MOM and sync status
                    </p>
                  </div>
                </div>
              </Link>
            </Card>
          )}

          {/* Metadata */}
          <Card className="p-6 border-0">
            <h2 className="text-lg font-semibold mb-3">Details</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span>
                  {new Date(task.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated</span>
                <span>
                  {new Date(task.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
