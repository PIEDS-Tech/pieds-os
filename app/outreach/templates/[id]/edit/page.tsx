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
import { getTemplateById, updateTemplate } from "@/lib/templates-store";

export default function EditTemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    content: "",
  });

  useEffect(() => {
    const template = getTemplateById(id);
    if (template) {
      setFormData({
        name: template.name,
        subject: template.subject,
        content: template.content,
      });
    }
    setLoading(false);
  }, [id]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.subject || !formData.content) {
      alert("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      updateTemplate(id, {
        name: formData.name,
        subject: formData.subject,
        content: formData.content,
      });
      router.push("/outreach/templates");
    } catch (error) {
      alert("Error updating template");
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
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Link href="/outreach/templates">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
      </div>

      {/* Form Card */}
      <Card className="p-6 border-0">
        <h1 className="text-2xl font-bold mb-6">Edit Email Template</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <Label className="font-semibold">Template Name *</Label>
            <Input
              type="text"
              placeholder="e.g., Sponsorship Proposal"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
            />
          </div>

          {/* Subject */}
          <div>
            <Label className="font-semibold">Subject Line *</Label>
            <Input
              type="text"
              placeholder='e.g., Sponsorship Opportunity - {{company}}'
              value={formData.subject}
              onChange={(e) => handleInputChange("subject", e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground mt-2">
              💡 Use variables like {"{{name}}"}, {"{{company}}"}, {"{{email}}"} to personalize
            </p>
          </div>

          {/* Content */}
          <div>
            <Label className="font-semibold">Email Content (HTML) *</Label>
            <Textarea
              placeholder={`<p>Dear {{name}},</p>\n<p>We are reaching out to {{company}} with an exciting opportunity...</p>\n<p>Best regards,<br/>PIEDS Team</p>`}
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              className="min-h-64 font-mono text-sm"
              required
            />
            <p className="text-xs text-muted-foreground mt-2">
              💡 Enter HTML content. Variables like {"{{name}}"}, {"{{company}}"}, {"{{email}}"} will be replaced automatically
            </p>
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
            <Link href="/outreach/templates">
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
