"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { getCampaignById, updateCampaign } from "@/lib/campaigns-store";
import { getTemplates } from "@/lib/templates-store";

export default function EditCampaignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const [campaign, setCampaign] = useState<any>(null);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    templateId: "",
  });

  useEffect(() => {
    const loaded = getCampaignById(id);
    const loadedTemplates = getTemplates();
    setCampaign(loaded);
    setTemplates(loadedTemplates);
    if (loaded) {
      setFormData({
        name: loaded.name,
        templateId: loaded.templateId,
      });
    }
    setLoading(false);
  }, [id]);

  const selectedTemplate = templates.find((t) => t.id === formData.templateId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.templateId) {
      alert("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const newTemplate = templates.find((t) => t.id === formData.templateId);
      updateCampaign(id, {
        name: formData.name,
        templateId: formData.templateId,
        templateName: newTemplate?.name || "",
      });
      router.push(`/outreach/${id}`);
    } catch (error) {
      alert("Error updating campaign");
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

  if (!campaign) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Campaign not found</h1>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Link href={`/outreach/${id}`}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
      </div>

      {/* Form Card */}
      <Card className="p-6 border-0">
        <h1 className="text-2xl font-bold mb-6">Edit Campaign</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campaign Name */}
          <div>
            <Label className="font-semibold">Campaign Name *</Label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
          </div>

          {/* Template Selection */}
          <div>
            <Label className="font-semibold">Email Template *</Label>
            <p className="text-xs text-muted-foreground mb-3">
              Change the email template for this campaign
            </p>
            <div className="space-y-3">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      templateId: template.id,
                    }))
                  }
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.templateId === template.id
                      ? "border-primary bg-blue-50"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold">{template.name}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {template.subject}
                      </p>
                    </div>
                    {formData.templateId === template.id && (
                      <Badge>Selected</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Template Preview */}
          {selectedTemplate && (
            <div className="space-y-3 pt-4 border-t border-border">
              <p className="text-sm font-semibold">Template Preview</p>
              <div className="bg-muted p-4 rounded-lg space-y-3">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">
                    Subject
                  </p>
                  <p className="font-medium">{selectedTemplate.subject}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">
                    Content Preview
                  </p>
                  <div
                    dangerouslySetInnerHTML={{ __html: selectedTemplate.content }}
                    className="text-sm prose prose-sm max-w-none line-clamp-5"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={submitting}
              className="bg-primary hover:bg-primary/90 gap-2"
            >
              {submitting ? "Saving..." : "Save Changes"}
            </Button>
            <Link href={`/outreach/${id}`}>
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
