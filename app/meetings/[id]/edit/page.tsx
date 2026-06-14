"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getMeetingById, updateMeeting } from "@/lib/meetings-store";
import { getContacts } from "@/lib/contacts-store";

export default function EditMeetingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [contacts, setContacts] = useState<any[]>([]);
  const [selectedParticipants, setSelectedParticipants] = useState<Set<string>>(
    new Set()
  );
  const [showParticipantsList, setShowParticipantsList] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    duration: 60,
    location: "",
    meetingLink: "",
    agenda: "",
    notes: "",
    status: "scheduled" as any,
  });

  useEffect(() => {
    const meeting = getMeetingById(id);
    const loadedContacts = getContacts();

    if (meeting) {
      setFormData({
        title: meeting.title,
        description: meeting.description,
        date: meeting.date,
        time: meeting.time,
        duration: meeting.duration,
        location: meeting.location || "",
        meetingLink: meeting.meetingLink || "",
        agenda: meeting.agenda,
        notes: meeting.notes,
        status: meeting.status,
      });

      setSelectedParticipants(
        new Set(meeting.participants.map((p: any) => p.contactId))
      );
    }

    setContacts(loadedContacts);
    setLoading(false);
  }, [id]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddParticipant = (contactId: string) => {
    const newSelected = new Set(selectedParticipants);
    if (newSelected.has(contactId)) {
      newSelected.delete(contactId);
    } else {
      newSelected.add(contactId);
    }
    setSelectedParticipants(newSelected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.time) {
      alert("Please fill in all required fields");
      return;
    }

    if (selectedParticipants.size === 0) {
      alert("Please add at least one participant");
      return;
    }

    setSubmitting(true);
    try {
      const participants = contacts
        .filter((c) => selectedParticipants.has(c.id))
        .map((c) => ({
          contactId: c.id,
          contactName: c.name,
          contactEmail: c.email,
        }));

      updateMeeting(id, {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        duration: parseInt(formData.duration.toString()),
        location: formData.location,
        meetingLink: formData.meetingLink,
        participants,
        agenda: formData.agenda,
        notes: formData.notes,
        status: formData.status,
        linkedContacts: Array.from(selectedParticipants),
      });

      router.push(`/meetings/${id}`);
    } catch (error) {
      alert("Error updating meeting");
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

  const selectedContactsList = contacts.filter((c) =>
    selectedParticipants.has(c.id)
  );

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Link href={`/meetings/${id}`}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
      </div>

      {/* Form Card */}
      <Card className="p-6 border-0">
        <h1 className="text-2xl font-bold mb-6">Edit Meeting</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title & Description */}
          <div>
            <Label className="font-semibold">Meeting Title *</Label>
            <Input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              required
            />
          </div>

          <div>
            <Label className="font-semibold">Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="min-h-20"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="font-semibold">Date *</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                required
              />
            </div>

            <div>
              <Label className="font-semibold">Time *</Label>
              <Input
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange("time", e.target.value)}
                required
              />
            </div>

            <div>
              <Label className="font-semibold">Duration (minutes)</Label>
              <Input
                type="number"
                value={formData.duration}
                onChange={(e) => handleInputChange("duration", e.target.value)}
                min="15"
                step="15"
              />
            </div>
          </div>

          {/* Location & Meeting Link */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="font-semibold">Location</Label>
              <Input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
              />
            </div>

            <div>
              <Label className="font-semibold">Meeting Link (Zoom/Google Meet)</Label>
              <Input
                type="text"
                placeholder="e.g., https://meet.google.com/abc-defg-hij or meet.google.com/abc-defg-hij"
                value={formData.meetingLink}
                onChange={(e) => handleInputChange("meetingLink", e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Optional - paste your Zoom/Google Meet link here
              </p>
            </div>
          </div>

          {/* Status */}
          <div>
            <Label className="font-semibold">Status</Label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
            >
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Participants */}
          <div>
            <Label className="font-semibold">Participants *</Label>

            {selectedContactsList.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {selectedContactsList.map((contact) => (
                  <div
                    key={contact.id}
                    className="bg-primary text-white px-3 py-1 rounded-full flex items-center gap-2 text-sm"
                  >
                    {contact.name}
                    <button
                      type="button"
                      onClick={() => handleAddParticipant(contact.id)}
                      className="hover:opacity-70"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="relative">
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start text-left font-normal"
                onClick={() => setShowParticipantsList(!showParticipantsList)}
              >
                {selectedContactsList.length === 0
                  ? "Select participants..."
                  : `${selectedContactsList.length} participant(s) selected`}
              </Button>

              {showParticipantsList && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                  {contacts.map((contact) => (
                    <div
                      key={contact.id}
                      onClick={() => handleAddParticipant(contact.id)}
                      className="p-3 border-b border-border hover:bg-muted cursor-pointer flex items-center gap-2"
                    >
                      <input
                        type="checkbox"
                        checked={selectedParticipants.has(contact.id)}
                        onChange={() => {}}
                        className="rounded"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{contact.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {contact.email}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Agenda */}
          <div>
            <Label className="font-semibold">Agenda</Label>
            <Textarea
              value={formData.agenda}
              onChange={(e) => handleInputChange("agenda", e.target.value)}
              className="min-h-32"
            />
          </div>

          {/* Notes */}
          <div>
            <Label className="font-semibold">Notes & MOM</Label>
            <Textarea
              placeholder="Meeting outcome and action items..."
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              className="min-h-32"
            />
          </div>

          {/* Submit */}
          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={submitting}
              className="bg-primary hover:bg-primary/90 gap-2"
            >
              {submitting ? "Saving..." : "Save Changes"}
            </Button>
            <Link href={`/meetings/${id}`}>
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
