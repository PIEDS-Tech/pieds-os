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
import { addContact, CONTACT_TYPES, CONTACT_STATUSES, syncContactWithOrganization } from "@/lib/contacts-store";
import { getOrganizations, addOrganization } from "@/lib/organizations-store";

export default function NewContactPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    organization: "",
    type: "mentor" as const,
    notes: "",
    status: "active" as const,
  });

  useEffect(() => {
    setOrganizations(getOrganizations());
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert("Please fill in required fields");
      return;
    }

    setLoading(true);
    try {
      // Create organization if it doesn't exist
      if (formData.organization) {
        const existingOrg = organizations.find(
          (o) => o.name.toLowerCase() === formData.organization.toLowerCase()
        );

        if (!existingOrg) {
          // Create new organization with default values
          addOrganization({
            name: formData.organization,
            type: "corporate",
            sector: "Other",
            website: "",
            description: "",
            status: "prospect",
            linkedContacts: [],
            lastInteraction: new Date().toISOString().split("T")[0],
          });
          // Refresh organizations list for linking
          setOrganizations(getOrganizations());
        }
      }

      const newContact = addContact({
        ...formData,
        tags,
        lastContact: new Date().toISOString().split("T")[0],
      });

      // Auto-link to organization if name provided
      if (formData.organization) {
        syncContactWithOrganization(newContact.id, formData.organization);
      }

      router.push(`/contacts/${newContact.id}`);
    } catch (error) {
      alert("Error creating contact");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Link href="/contacts">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
      </div>

      {/* Form Card */}
      <Card className="p-6 border-0">
        <h1 className="text-2xl font-bold mb-6">Add New Contact</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="font-semibold">Name *</Label>
              <Input
                type="text"
                placeholder="Full name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>
            <div>
              <Label className="font-semibold">Email *</Label>
              <Input
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Phone & LinkedIn */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="font-semibold">Phone</Label>
              <Input
                type="tel"
                placeholder="+91-XXXXX-XXXXX"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            </div>
            <div>
              <Label className="font-semibold">LinkedIn Profile</Label>
              <Input
                type="text"
                placeholder="https://linkedin.com/in/username"
                value={formData.linkedin}
                onChange={(e) => handleInputChange("linkedin", e.target.value)}
              />
            </div>
          </div>

          {/* Organization */}
          <div>
            <Label className="font-semibold">Organization</Label>
            <input
              type="text"
              placeholder="Type or select organization name"
              value={formData.organization}
              onChange={(e) => handleInputChange("organization", e.target.value)}
              list="organizations-list"
              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
            />
            <datalist id="organizations-list">
              {organizations.map((org) => (
                <option key={org.id} value={org.name}>
                  {org.type}
                </option>
              ))}
            </datalist>
            <p className="text-xs text-muted-foreground mt-2">
              ✨ Select from list or type a new organization name to create
            </p>
          </div>

          {/* Type & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="font-semibold">Contact Type</Label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange("type", e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              >
                {CONTACT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label className="font-semibold">Status</Label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              >
                {CONTACT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <Label className="font-semibold">Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                type="text"
                placeholder="Add a tag and press Enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button
                type="button"
                onClick={handleAddTag}
                variant="outline"
              >
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <div
                    key={tag}
                    className="bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center gap-2 text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-primary/70"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <Label className="font-semibold">Notes</Label>
            <Textarea
              placeholder="Add any additional notes about this contact..."
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              className="min-h-24"
            />
          </div>

          {/* Submit */}
          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary/90 gap-2"
            >
              {loading ? "Creating..." : "Create Contact"}
            </Button>
            <Link href="/contacts">
              <Button
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
