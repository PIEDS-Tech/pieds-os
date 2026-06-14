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
import {
  Organization,
  getOrganizationById,
  updateOrganization,
  ORGANIZATION_TYPES,
  ORGANIZATION_STATUSES,
} from "@/lib/organizations-store";

export default function EditOrganizationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    type: Organization["type"];
    sector: string;
    website: string;
    description: string;
    status: Organization["status"];
  }>({
    name: "",
    type: "corporate",
    sector: "",
    website: "",
    description: "",
    status: "prospect",
  });

  useEffect(() => {
    const org = getOrganizationById(id);
    if (org) {
      setFormData({
        name: org.name,
        type: org.type,
        sector: org.sector,
        website: org.website,
        description: org.description,
        status: org.status,
      });
    }
    setLoading(false);
  }, [id]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.sector) {
      alert("Please fill in required fields");
      return;
    }

    setSubmitting(true);
    try {
      updateOrganization(id, formData);
      router.push(`/organizations/${id}`);
    } catch (error) {
      alert("Error updating organization");
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
        <Link href={`/organizations/${id}`}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
      </div>

      {/* Form Card */}
      <Card className="p-6 border-0">
        <h1 className="text-2xl font-bold mb-6">Edit Organization</h1>

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
              disabled={submitting}
              className="bg-primary hover:bg-primary/90 gap-2"
            >
              {submitting ? "Saving..." : "Save Changes"}
            </Button>
            <Link href={`/organizations/${id}`}>
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
