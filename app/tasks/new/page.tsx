"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { addTask, TASK_PRIORITIES } from "@/lib/tasks-store";
import { getContacts } from "@/lib/contacts-store";

export default function NewTaskPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assigneeId: "",
    priority: "medium",
    deadline: "",
    notes: "",
  });

  useEffect(() => {
    setContacts(getContacts());
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.deadline) {
      alert("Please fill in title and deadline");
      return;
    }

    setLoading(true);
    try {
      const assignee = formData.assigneeId
        ? contacts.find((c) => c.id === formData.assigneeId)
        : null;

      const task = addTask({
        title: formData.title,
        description: formData.description,
        assigneeId: formData.assigneeId || undefined,
        assigneeName: assignee?.name,
        assigneeEmail: assignee?.email,
        status: "todo",
        priority: formData.priority as any,
        deadline: formData.deadline,
        notes: formData.notes,
        linkedTasks: [],
        linkedContactId: formData.assigneeId || undefined,
        linkedOrganizationId: undefined,
        linkedMeetingId: undefined,
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
      });

      router.push(`/tasks/${task.id}`);
    } catch (error) {
      alert("Error creating task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Link href="/tasks">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
      </div>

      {/* Form */}
      <Card className="p-6 border-0">
        <h1 className="text-2xl font-bold mb-6">Create Task</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <Label className="font-semibold">Task Title *</Label>
            <Input
              placeholder="e.g., Send sponsorship proposal"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div>
            <Label className="font-semibold">Description</Label>
            <Textarea
              placeholder="What needs to be done?"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="min-h-20"
            />
          </div>

          {/* Assignee, Priority, Deadline */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          </div>

          {/* Notes */}
          <div>
            <Label className="font-semibold">Notes</Label>
            <Textarea
              placeholder="Additional notes..."
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              className="min-h-20"
            />
          </div>

          {/* Submit */}
          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary/90"
            >
              {loading ? "Creating..." : "Create Task"}
            </Button>
            <Link href="/tasks">
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
