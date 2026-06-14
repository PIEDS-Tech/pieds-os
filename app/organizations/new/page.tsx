"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { addOrganization, ORGANIZATION_TYPES, ORGANIZATION_STATUSES } from "@/lib/organizations-store";

export default function NewOrganizationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "corporate" as const,
    sector: "",
    website: "",
    description: "",
    status: "prospect" as const,
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.sector) {
      alert("Please fill in required fields");
      return;
    }

    setLoading(true);
    try {
      const newOrg = addOrganization({
        ...formData,
        linkedContacts: [],
        lastInteraction: new Date().toISOString().split("T")[0],
      });
      router.push(`/organizations/${newOrg.id}`);
    } catch (error) {
      alert("Error creating organization");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Link href="/organizations">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
      </div>

      {/* Form Card */}
      <Card className="p-6 border-0">
        <h1 className="text-2xl font-bold mb-6">Add New Organization</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name & Sector */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="font-semibold">Name *</Label>
              <Input
                type="text"
                placeholder="Organization name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>
            <div>
              <Label className="font-semibold">Sector *</Label>
              <Input
                type="text"
                placeholder="e.g., Technology, Finance"
                value={formData.sector}
                onChange={(e) => handleInputChange("sector", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Website */}
          <div>
            <Label className="font-semibold">Website</Label>
            <Input
              type="text"
              placeholder="company.com"
              value={formData.website}
              onChange={(e) => handleInputChange("website", e.target.value)}
            />
          </div>

          {/* Type & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="font-semibold">Type</Label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange("type", e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              >
                {ORGANIZATION_TYPES.map((t) => (
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
                {ORGANIZATION_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <Label className="font-semibold">Description</Label>
            <Textarea
              placeholder="Organization description..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
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
              {loading ? "Creating..." : "Create Organization"}
            </Button>
            <Link href="/organizations">
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
