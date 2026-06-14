"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getTaskById, updateTask, TASK_PRIORITIES } from "@/lib/tasks-store";
import { getContacts } from "@/lib/contacts-store";

export default function EditTaskPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [contacts, setContacts] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assigneeId: "",
    priority: "medium",
    deadline: "",
    status: "todo",
    notes: "",
  });

  useEffect(() => {
    const task = getTaskById(id);
    const loadedContacts = getContacts();

    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        assigneeId: task.assigneeId || "",
        priority: task.priority,
        deadline: task.deadline,
        status: task.status,
        notes: task.notes,
      });
    }

    setContacts(loadedContacts);
    setLoading(false);
  }, [id]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.deadline) {
      alert("Please fill in title and deadline");
      return;
    }

    setSubmitting(true);
    try {
      const assignee = formData.assigneeId
        ? contacts.find((c) => c.id === formData.assigneeId)
        : null;

      updateTask(id, {
        title: formData.title,
        description: formData.description,
        assigneeId: formData.assigneeId || undefined,
        assigneeName: assignee?.name,
        assigneeEmail: assignee?.email,
        status: formData.status as any,
        priority: formData.priority as any,
        deadline: formData.deadline,
        notes: formData.notes,
      });

      router.push(`/tasks/${id}`);
    } catch (error) {
      alert("Error updating task");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Link href={`/tasks/${id}`}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
      </div>

      {/* Form */}
      <Card className="p-6 border-0">
        <h1 className="text-2xl font-bold mb-6">Edit Task</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <Label className="font-semibold">Task Title *</Label>
            <Input
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div>
            <Label className="font-semibold">Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="min-h-20"
            />
          </div>

          {/* Assignee, Priority, Deadline, Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="font-semibold">Assignee</Label>
              <select
                value={formData.assigneeId}
                onChange={(e) => handleInputChange("assigneeId", e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              >
                <option value="">Unassigned</option>
                {contacts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label className="font-semibold">Priority</Label>
              <select
                value={formData.priority}
                onChange={(e) => handleInputChange("priority", e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              >
                {TASK_PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p === "high" && "🔴 "}
                    {p === "medium" && "🟡 "}
                    {p === "low" && "🟢 "}
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label className="font-semibold">Deadline *</Label>
              <Input
                type="date"
                value={formData.deadline}
                onChange={(e) => handleInputChange("deadline", e.target.value)}
                required
              />
            </div>

            <div>
              <Label className="font-semibold">Status</Label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              >
                <option value="todo">📝 To Do</option>
                <option value="in-progress">⚙️ In Progress</option>
                <option value="done">✅ Done</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label className="font-semibold">Notes</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              className="min-h-20"
            />
          </div>

          {/* Submit */}
          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={submitting}
              className="bg-primary hover:bg-primary/90"
            >
              {submitting ? "Saving..." : "Save Changes"}
            </Button>
            <Link href={`/tasks/${id}`}>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
