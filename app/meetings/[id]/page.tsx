"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { ArrowLeft, Edit2, Users, MapPin, Clock, Link as LinkIcon, ChevronDown, ChevronUp, Wand2, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getMeetingById, updateMeeting } from "@/lib/meetings-store";
import { getMOMByMeetingId, saveMOM, generateMockMOM, type MeetingMOM } from "@/lib/mom-store";
import { generateMockTranscript } from "@/lib/ai-features-store";
import { addTask, getTasks, type Task } from "@/lib/tasks-store";

export default function MeetingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [meeting, setMeeting] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showTranscript, setShowTranscript] = useState(false);
  const [transcript, setTranscript] = useState<any[]>([]);
  const [mom, setMom] = useState<MeetingMOM | null>(null);
  const [showMOMModal, setShowMOMModal] = useState(false);
  const [selectedActionItems, setSelectedActionItems] = useState<Set<string>>(new Set());
  const [linkedTasks, setLinkedTasks] = useState<Task[]>([]);

  useEffect(() => {
    const loaded = getMeetingById(id);
    setMeeting(loaded);
    const existingMom = getMOMByMeetingId(id);
    setMom(existingMom);

    // Load linked tasks
    const allTasks = getTasks();
    const linked = allTasks.filter((t) => t.linkedMeetingId === id);
    setLinkedTasks(linked);

    setLoading(false);
  }, [id]);

  const handleTranscribe = () => {
    setTranscript(generateMockTranscript(meeting.title));
    setShowTranscript(true);
  };

  const handleGenerateMOM = () => {
    const newMom = generateMockMOM(id, meeting.title);
    setMom(newMom);
    saveMOM(newMom);
    setShowMOMModal(true);
  };

  const toggleActionItem = (itemId: string) => {
    const newSelected = new Set(selectedActionItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedActionItems(newSelected);
  };

  const createTasksFromActionItems = () => {
    if (!mom || selectedActionItems.size === 0) return;

    const createdCount = selectedActionItems.size;

    mom.actionItems.forEach((item) => {
      if (selectedActionItems.has(item.id)) {
        addTask({
          title: item.description,
          description: `Created from meeting action item in "${meeting.title}"`,
          assigneeId: "",
          assigneeName: item.owner,
          assigneeEmail: "",
          status: "todo",
          priority: "high",
          deadline: item.deadline,
          linkedMeetingId: id,
          notes: `[ACTION_ITEM_ID:${item.id}]\n[MOM_ID:${mom.id}]\nOriginal owner: ${item.owner}\nOriginal status: ${item.status}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    });

    // Reload linked tasks to show newly created ones
    const allTasks = getTasks();
    const linked = allTasks.filter((t) => t.linkedMeetingId === id);
    setLinkedTasks(linked);

    setSelectedActionItems(new Set());
    setShowMOMModal(false);
    alert(`${createdCount} task(s) created and synced with MOM!`);
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Meeting not found</h1>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    return {
      scheduled: "bg-blue-100 text-blue-700",
      completed: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
    }[status] || "bg-gray-100 text-gray-700";
  };

  const formatDateTime = (date: string, time: string) => {
    const dateObj = new Date(`${date}T${time}`);
    return dateObj.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/meetings">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{meeting.title}</h1>
            <p className="text-muted-foreground mt-1">{meeting.description}</p>
          </div>
        </div>
        <Link href={`/meetings/${id}/edit`}>
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <Edit2 className="w-4 h-4" />
            Edit
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Meeting Info */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="p-6 border-0 space-y-4">
            <div>
              <p className="text-xs text-muted-foreground font-semibold">Status</p>
              <Badge className={getStatusColor(meeting.status)}>
                {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
              </Badge>
            </div>

            <div>
              <p className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Date & Time
              </p>
              <p className="text-sm font-medium mt-1">
                {formatDateTime(meeting.date, meeting.time)}
              </p>
              <p className="text-xs text-muted-foreground">Duration: {meeting.duration} minutes</p>
            </div>

            {meeting.location && (
              <div>
                <p className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  Location
                </p>
                <p className="text-sm font-medium mt-1">{meeting.location}</p>
              </div>
            )}

            {meeting.meetingLink && (
              <div>
                <p className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
                  <LinkIcon className="w-3 h-3" />
                  Meeting Link
                </p>
                <a
                  href={meeting.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline mt-1"
                >
                  Join Meeting
                </a>
              </div>
            )}

            {/* AI Actions */}
            <div className="pt-4 border-t border-border space-y-2">
              <Button
                onClick={handleTranscribe}
                variant="outline"
                className="w-full gap-2 justify-start"
              >
                <Wand2 className="w-4 h-4" />
                Transcribe Recording
              </Button>
              <Button
                onClick={handleGenerateMOM}
                className="w-full gap-2 justify-start bg-primary hover:bg-primary/90"
              >
                <Wand2 className="w-4 h-4" />
                Generate MOM
              </Button>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Participants */}
          <Card className="p-6 border-0">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Participants ({meeting.participants.length})
            </h2>
            {meeting.participants.length === 0 ? (
              <p className="text-muted-foreground">No participants added</p>
            ) : (
              <div className="space-y-3">
                {meeting.participants.map((participant: any) => (
                  <div
                    key={participant.contactId}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div>
                      <p className="font-semibold">{participant.contactName}</p>
                      <p className="text-sm text-muted-foreground">
                        {participant.contactEmail}
                      </p>
                    </div>
                    {participant.role && (
                      <Badge variant="outline">{participant.role}</Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Agenda */}
          <Card className="p-6 border-0">
            <h2 className="text-lg font-semibold mb-4">📋 Agenda</h2>
            <div className="prose prose-sm max-w-none whitespace-pre-wrap text-sm">
              {meeting.agenda || "No agenda set"}
            </div>
          </Card>

          {/* Transcript */}
          {transcript.length > 0 && (
            <Card className="p-6 border-0">
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className="w-full flex items-center justify-between"
              >
                <h2 className="text-lg font-semibold">🎤 Meeting Transcript</h2>
                {showTranscript ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
              {showTranscript && (
                <div className="mt-4 space-y-3 max-h-96 overflow-y-auto">
                  {transcript.map((segment, idx) => (
                    <div key={idx} className="p-3 bg-muted rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-sm">{segment.speaker}</p>
                        <p className="text-xs text-muted-foreground">{segment.timestamp}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{segment.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          {/* MOM Content */}
          {mom && (
            <>
              <Card className="p-6 border-0 bg-blue-50">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-lg font-semibold">📋 Meeting Minutes (MOM)</h2>
                  <Badge className="bg-green-100 text-green-700">Generated</Badge>
                </div>

                <div className="space-y-4">
                  {/* Summary */}
                  <div>
                    <p className="text-sm font-semibold mb-2">Summary</p>
                    <p className="text-sm text-muted-foreground">{mom.summary}</p>
                  </div>

                  {/* Key Decisions */}
                  <div>
                    <p className="text-sm font-semibold mb-2">Key Decisions</p>
                    <ul className="space-y-1">
                      {mom.keyDecisions.map((decision, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                          <span className="text-primary">•</span>
                          {decision}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Next Steps */}
                  <div>
                    <p className="text-sm font-semibold mb-2">Next Steps</p>
                    <ul className="space-y-1">
                      {mom.nextSteps.map((step, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                          <span className="text-primary">•</span>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>

              {/* Action Items & Task Creation */}
              <Card className="p-6 border-0">
                <h2 className="text-lg font-semibold mb-4">⚡ Action Items → Tasks Sync</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Select action items to create or link as tasks. Green items already have tasks created.
                </p>

                <div className="space-y-3">
                  {mom.actionItems.map((item) => {
                    // Match tasks by action item ID marker in notes
                    const linkedTask = linkedTasks.find((t) =>
                      t.notes?.includes(`[ACTION_ITEM_ID:${item.id}]`)
                    );
                    const isConverted = !!linkedTask;

                    return (
                      <div key={item.id}>
                        <div
                          className={`p-4 border rounded-lg transition-all ${
                            isConverted
                              ? "bg-green-50 border-green-300 cursor-not-allowed opacity-75"
                              : selectedActionItems.has(item.id)
                              ? "bg-blue-50 border-primary cursor-pointer"
                              : "border-border bg-muted/30 hover:bg-muted/50 cursor-pointer"
                          }`}
                          onClick={() => !isConverted && toggleActionItem(item.id)}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              checked={selectedActionItems.has(item.id)}
                              onChange={() => !isConverted && toggleActionItem(item.id)}
                              disabled={isConverted}
                              className="mt-1 rounded"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-semibold text-sm">{item.description}</p>
                                {isConverted && (
                                  <Badge className="bg-green-100 text-green-700 text-xs">
                                    ✓ Task Created
                                  </Badge>
                                )}
                              </div>
                              <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                                <span>👤 {item.owner}</span>
                                <span>📅 {new Date(item.deadline).toLocaleDateString()}</span>
                                <span
                                  className={
                                    item.status === "completed"
                                      ? "text-green-600 font-semibold"
                                      : "text-yellow-600 font-semibold"
                                  }
                                >
                                  {item.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Show linked task details if converted */}
                        {linkedTask && (
                          <div className="mt-2 ml-7 p-3 bg-green-100 border border-green-300 rounded-lg">
                            <Link href={`/tasks/${linkedTask.id}`}>
                              <p className="text-xs font-semibold text-green-700 hover:underline">
                                📌 Linked Task: {linkedTask.title}
                              </p>
                            </Link>
                            <div className="flex gap-3 mt-1 text-xs text-green-600">
                              <span>Status: {linkedTask.status}</span>
                              <span>Assignee: {linkedTask.assigneeName}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {selectedActionItems.size > 0 && (
                  <Button
                    onClick={createTasksFromActionItems}
                    className="w-full mt-4 gap-2 bg-primary hover:bg-primary/90"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Create {selectedActionItems.size} Task(s) from Selected Items
                  </Button>
                )}
              </Card>
            </>
          )}

          {/* Linked Tasks */}
          {linkedTasks.length > 0 && (
            <Card className="p-6 border-0 bg-green-50">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                ✅ Linked Deliverables ({linkedTasks.length})
              </h2>
              <div className="space-y-3">
                {linkedTasks.map((task) => (
                  <Link key={task.id} href={`/tasks/${task.id}`}>
                    <div className="p-4 bg-white border border-green-200 rounded-lg hover:shadow-md transition-all">
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-semibold text-sm">{task.title}</p>
                        <Badge
                          className={
                            task.status === "done"
                              ? "bg-green-100 text-green-700"
                              : task.status === "in-progress"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                          }
                        >
                          {task.status}
                        </Badge>
                      </div>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>👤 {task.assigneeName || "Unassigned"}</span>
                        <span>📅 {new Date(task.deadline).toLocaleDateString()}</span>
                        <span
                          className={
                            task.priority === "high"
                              ? "text-red-600 font-semibold"
                              : task.priority === "medium"
                              ? "text-yellow-600 font-semibold"
                              : "text-green-600 font-semibold"
                          }
                        >
                          {task.priority} priority
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>
          )}

          {/* Notes */}
          <Card className="p-6 border-0">
            <h2 className="text-lg font-semibold mb-4">📝 Notes</h2>
            <div className="prose prose-sm max-w-none whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg">
              {meeting.notes || "No notes recorded yet"}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
