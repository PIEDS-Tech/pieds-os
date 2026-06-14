"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { addMeeting } from "@/lib/meetings-store";
import { getContacts } from "@/lib/contacts-store";

export default function NewMeetingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
  });

  useEffect(() => {
    setContacts(getContacts());
  }, []);

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

    setLoading(true);
    try {
      const participants = contacts
        .filter((c) => selectedParticipants.has(c.id))
        .map((c) => ({
          contactId: c.id,
          contactName: c.name,
          contactEmail: c.email,
        }));

      const meeting = addMeeting({
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        duration: parseInt(formData.duration.toString()),
        location: formData.location,
        meetingLink: formData.meetingLink,
        participants,
        agenda: formData.agenda,
        notes: "",
        linkedTasks: [],
        linkedContacts: Array.from(selectedParticipants),
        linkedOrganizations: [],
        status: "scheduled",
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
      });

      router.push(`/meetings/${meeting.id}`);
    } catch (error) {
      alert("Error creating meeting");
    } finally {
      setLoading(false);
    }
  };

  const selectedContactsList = contacts.filter((c) =>
    selectedParticipants.has(c.id)
  );

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Link href="/meetings">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
      </div>

      {/* Form Card */}
      <Card className="p-6 border-0">
        <h1 className="text-2xl font-bold mb-6">Schedule Meeting</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title & Description */}
          <div>
            <Label className="font-semibold">Meeting Title *</Label>
            <Input
              type="text"
              placeholder="e.g., Microsoft Sponsorship Discussion"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              required
            />
          </div>

          <div>
            <Label className="font-semibold">Description</Label>
            <Textarea
              placeholder="What is this meeting about?"
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
                placeholder="e.g., Microsoft Office, Bangalore"
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

          {/* Participants */}
          <div>
            <Label className="font-semibold">Participants *</Label>
            <p className="text-xs text-muted-foreground mb-2">
              Select contacts to invite to this meeting
            </p>

            {/* Selected Participants Display */}
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

            {/* Participants Selector */}
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
              placeholder="1. Introduction\n2. Main topics\n3. Q&A\n4. Next steps"
              value={formData.agenda}
              onChange={(e) => handleInputChange("agenda", e.target.value)}
              className="min-h-32"
            />
          </div>

          {/* Submit */}
          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary/90 gap-2"
            >
              {loading ? "Creating..." : "Schedule Meeting"}
            </Button>
            <Link href="/meetings">
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
