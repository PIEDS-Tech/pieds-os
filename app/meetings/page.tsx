"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Search, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Meeting,
  getMeetings,
  deleteMeeting,
  getUpcomingMeetings,
  getPastMeetings,
  MEETING_STATUSES,
} from "@/lib/meetings-store";

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [filteredMeetings, setFilteredMeetings] = useState<Meeting[]>([]);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("scheduled");
  const [selectedMeetings, setSelectedMeetings] = useState<Set<string>>(
    new Set()
  );
  const [dragStartId, setDragStartId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Load meetings
  useEffect(() => {
    const loaded = getMeetings();
    setMeetings(loaded);
  }, []);

  // Filter meetings
  useEffect(() => {
    let filtered = meetings;

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          m.participants.some((p) =>
            p.contactName.toLowerCase().includes(q)
          )
      );
    }

    if (selectedStatus) {
      filtered = filtered.filter((m) => m.status === selectedStatus);
    }

    // Sort by date
    filtered.sort((a, b) => {
      const aDate = new Date(`${a.date}T${a.time}`);
      const bDate = new Date(`${b.date}T${b.time}`);
      return bDate.getTime() - aDate.getTime();
    });

    setFilteredMeetings(filtered);
  }, [meetings, search, selectedStatus]);

  // Drag to select
  useEffect(() => {
    window.addEventListener("mouseup", () => setIsDragging(false));
    return () =>
      window.removeEventListener("mouseup", () => setIsDragging(false));
  }, []);

  const handleRowMouseDown = (meetingId: string) => {
    setDragStartId(meetingId);
    setIsDragging(true);
  };

  const handleRowMouseEnter = (meetingId: string) => {
    if (!isDragging || !dragStartId) return;

    const startIndex = filteredMeetings.findIndex((m) => m.id === dragStartId);
    const endIndex = filteredMeetings.findIndex((m) => m.id === meetingId);

    if (startIndex === -1 || endIndex === -1) return;

    const minIndex = Math.min(startIndex, endIndex);
    const maxIndex = Math.max(startIndex, endIndex);

    const newSelected = new Set<string>();
    for (let i = minIndex; i <= maxIndex; i++) {
      newSelected.add(filteredMeetings[i].id);
    }
    setSelectedMeetings(newSelected);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this meeting?")) {
      deleteMeeting(id);
      setMeetings(getMeetings());
    }
  };

  const handleSelectAll = () => {
    if (selectedMeetings.size === filteredMeetings.length) {
      setSelectedMeetings(new Set());
    } else {
      setSelectedMeetings(new Set(filteredMeetings.map((m) => m.id)));
    }
  };

  const handleBulkDelete = () => {
    if (selectedMeetings.size === 0) return;
    if (confirm(`Delete ${selectedMeetings.size} meetings?`)) {
      selectedMeetings.forEach((id) => deleteMeeting(id));
      setMeetings(getMeetings());
      setSelectedMeetings(new Set());
    }
  };

  const getStatusColor = (status: Meeting["status"]) => {
    return {
      scheduled: "bg-blue-100 text-blue-700",
      completed: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
    }[status];
  };

  const formatDateTime = (date: string, time: string) => {
    const dateObj = new Date(`${date}T${time}`);
    return dateObj.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Meetings</h1>
          <p className="text-muted-foreground mt-1">
            {filteredMeetings.length} of {meetings.length} meetings
          </p>
        </div>
        <Link href="/meetings/new">
          <Button className="bg-primary hover:bg-primary/90 gap-2">
            <Plus className="w-4 h-4" />
            Schedule Meeting
          </Button>
        </Link>
      </div>

      {/* Search & Filters */}
      <Card className="p-4 border-0 space-y-4">
        <div className="flex gap-2 items-center">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search meetings, participants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border-0 bg-transparent"
          />
        </div>

        <div className="flex gap-2">
          {MEETING_STATUSES.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStatus === status
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {status === "scheduled" && "📅 "}
              {status === "completed" && "✅ "}
              {status === "cancelled" && "❌ "}
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedMeetings.size > 0 && (
        <Card className="p-4 border-0 bg-blue-50 flex items-center justify-between">
          <p className="text-sm font-semibold text-blue-700">
            {selectedMeetings.size} meeting(s) selected
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

      {/* Drag-to-select hint */}
      {selectedMeetings.size === 0 && filteredMeetings.length > 0 && (
        <p className="text-xs text-muted-foreground px-4">
          💡 Tip: Click and drag across rows to select multiple meetings
        </p>
      )}

      {/* Meetings Table */}
      <Card className="border-0 overflow-hidden">
        {filteredMeetings.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-muted-foreground">No meetings found.</p>
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
                        selectedMeetings.size === filteredMeetings.length &&
                        filteredMeetings.length > 0
                      }
                      onChange={handleSelectAll}
                      className="rounded"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Date & Time
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Participants
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
                {filteredMeetings.map((meeting) => (
                  <tr
                    key={meeting.id}
                    className={`border-b border-border transition-colors cursor-pointer select-none ${
                      selectedMeetings.has(meeting.id)
                        ? "bg-blue-50"
                        : "hover:bg-muted/50"
                    }`}
                    onMouseDown={() => handleRowMouseDown(meeting.id)}
                    onMouseEnter={() => handleRowMouseEnter(meeting.id)}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedMeetings.has(meeting.id)}
                        onChange={(e) => {
                          const newSelected = new Set(selectedMeetings);
                          if (e.target.checked) {
                            newSelected.add(meeting.id);
                          } else {
                            newSelected.delete(meeting.id);
                          }
                          setSelectedMeetings(newSelected);
                        }}
                        className="rounded"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/meetings/${meeting.id}`}
                        className="font-semibold hover:text-primary"
                      >
                        {meeting.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {formatDateTime(meeting.date, meeting.time)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="space-y-1">
                        {meeting.participants.slice(0, 2).map((p) => (
                          <div key={p.contactId} className="text-muted-foreground">
                            {p.contactName}
                          </div>
                        ))}
                        {meeting.participants.length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{meeting.participants.length - 2} more
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={getStatusColor(meeting.status)}>
                        {meeting.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <Link href={`/meetings/${meeting.id}`}>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(meeting.id)}
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
    </div>
  );
}
