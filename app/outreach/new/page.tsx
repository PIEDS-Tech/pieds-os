"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ChevronRight, ChevronLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { addCampaign } from "@/lib/campaigns-store";
import { getTemplates, previewTemplate } from "@/lib/templates-store";
import { getContacts, CONTACT_TYPES } from "@/lib/contacts-store";

export default function NewCampaignPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [templates, setTemplates] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    type: "sponsorship" as any,
    templateId: "",
    selectedContactIds: new Set<string>(),
  });

  const [filterType, setFilterType] = useState<string>("");
  const [filterOrg, setFilterOrg] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");

  useEffect(() => {
    setTemplates(getTemplates());
    setContacts(getContacts());
  }, []);

  const selectedTemplate = templates.find((t) => t.id === formData.templateId);
  const filteredContacts = contacts.filter((c) => {
    if (filterType && c.type !== filterType) return false;
    if (filterOrg && c.organization !== filterOrg) return false;
    if (filterStatus && c.status !== filterStatus) return false;
    return true;
  });

  const uniqueOrgs = Array.from(
    new Set(contacts.map((c) => c.organization).filter(Boolean))
  );

  const handleContactSelect = (id: string) => {
    const newSelected = new Set(formData.selectedContactIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setFormData((prev) => ({ ...prev, selectedContactIds: newSelected }));
  };

  const handleSelectAll = () => {
    if (formData.selectedContactIds.size === filteredContacts.length) {
      setFormData((prev) => ({ ...prev, selectedContactIds: new Set() }));
    } else {
      setFormData((prev) => ({
        ...prev,
        selectedContactIds: new Set(filteredContacts.map((c) => c.id)),
      }));
    }
  };

  const handleSubmit = () => {
    const selectedContacts = contacts.filter((c) =>
      formData.selectedContactIds.has(c.id)
    );

    const campaign = addCampaign({
      name: formData.name,
      type: formData.type,
      templateId: formData.templateId,
      templateName: selectedTemplate?.name || "",
      status: "draft",
      recipients: selectedContacts.map((c) => ({
        contactId: c.id,
        contactName: c.name,
        contactEmail: c.email,
        status: "pending",
      })),
      createdAt: new Date().toISOString().split("T")[0],
      stats: {
        total: selectedContacts.length,
        sent: 0,
        opened: 0,
        replied: 0,
        bounced: 0,
      },
    });

    router.push(`/outreach/${campaign.id}`);
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/outreach">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Create Campaign</h1>
          <p className="text-muted-foreground mt-1">Step {step} of 5</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} className="flex-1 h-2 rounded-full bg-muted">
            {s <= step && (
              <div className="h-full bg-primary rounded-full transition-all"></div>
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Campaign Name & Type */}
      {step === 1 && (
        <Card className="p-6 border-0 space-y-6">
          <div>
            <Label className="font-semibold">Campaign Name *</Label>
            <Input
              placeholder="e.g., TechCorp Sponsorship Drive"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>

          <div>
            <Label className="font-semibold">Campaign Type *</Label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {[
                { value: "sponsorship", label: "Sponsorship" },
                { value: "partnership", label: "Partnership" },
                { value: "mentor", label: "Mentor Outreach" },
                { value: "investor", label: "Investor Pitch" },
              ].map((type) => (
                <button
                  key={type.value}
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, type: type.value }))
                  }
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.type === type.value
                      ? "border-primary bg-blue-50"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <p className="font-semibold">{type.label}</p>
                </button>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Step 2: Select Template */}
      {step === 2 && (
        <Card className="p-6 border-0 space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Select Email Template</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      templateId: template.id,
                    }))
                  }
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    formData.templateId === template.id
                      ? "border-primary bg-blue-50"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <p className="font-semibold">{template.name}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {template.subject}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {selectedTemplate && (
            <div className="space-y-2 pt-4 border-t border-border">
              <p className="text-sm font-semibold">Template Preview</p>
              <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
                <p className="font-medium">{selectedTemplate.subject}</p>
                <div
                  dangerouslySetInnerHTML={{ __html: selectedTemplate.content }}
                  className="text-xs line-clamp-3"
                />
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              💡 Variables like {"{{"} name {"}}"}, {"{{"} company {"}}"} will be
              personalized per contact when sent
            </p>
          </div>
        </Card>
      )}

      {/* Step 3: Select Contacts */}
      {step === 3 && (
        <Card className="p-6 border-0 space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">
              Select Recipients ({formData.selectedContactIds.size})
            </h2>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg text-sm bg-background"
              >
                <option value="">All Types</option>
                {CONTACT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>

              <select
                value={filterOrg}
                onChange={(e) => setFilterOrg(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg text-sm bg-background"
              >
                <option value="">All Organizations</option>
                {uniqueOrgs.map((org) => (
                  <option key={org} value={org}>
                    {org}
                  </option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg text-sm bg-background"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            {/* Select All */}
            <button
              onClick={handleSelectAll}
              className="text-sm font-semibold text-primary mb-3"
            >
              {formData.selectedContactIds.size === filteredContacts.length
                ? "Deselect All"
                : "Select All"}{" "}
              ({filteredContacts.length})
            </button>

            {/* Contacts List */}
            <div className="max-h-[400px] overflow-y-auto border border-border rounded-lg divide-y">
              {filteredContacts.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <p>No contacts match the filters</p>
                </div>
              ) : (
                filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="p-3 flex items-center gap-3 hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleContactSelect(contact.id)}
                  >
                    <input
                      type="checkbox"
                      checked={formData.selectedContactIds.has(contact.id)}
                      onChange={() => {}}
                      className="rounded"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{contact.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {contact.email} • {contact.organization}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Step 4: Preview */}
      {step === 4 && selectedTemplate && (
        <Card className="p-6 border-0 space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Preview Personalized Emails</h2>
            <p className="text-sm text-muted-foreground mb-4">
              You're sending to {formData.selectedContactIds.size} recipients
            </p>

            <div className="space-y-4">
              {Array.from(formData.selectedContactIds)
                .slice(0, 3)
                .map((contactId) => {
                  const contact = contacts.find((c) => c.id === contactId);
                  if (!contact) return null;

                  const preview = previewTemplate(selectedTemplate, {
                    name: contact.name.split(" ")[0],
                    company: contact.organization,
                    email: contact.email,
                  });

                  return (
                    <div
                      key={contactId}
                      className="border border-border rounded-lg p-4 space-y-3"
                    >
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground">
                          To: {contact.name} ({contact.email})
                        </p>
                        <p className="font-semibold">{preview.subject}</p>
                      </div>
                      <div
                        dangerouslySetInnerHTML={{ __html: preview.content }}
                        className="text-sm prose prose-sm max-w-none"
                      />
                    </div>
                  );
                })}
            </div>

            {formData.selectedContactIds.size > 3 && (
              <p className="text-sm text-muted-foreground mt-4">
                ... and {formData.selectedContactIds.size - 3} more recipients
              </p>
            )}
          </div>
        </Card>
      )}

      {/* Step 5: Confirm & Send */}
      {step === 5 && (
        <Card className="p-6 border-0 space-y-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Campaign Name</p>
              <p className="text-lg font-bold">{formData.name}</p>
            </div>

            <div>
              <p className="text-sm font-semibold text-muted-foreground">Type</p>
              <Badge>
                {formData.type.charAt(0).toUpperCase() + formData.type.slice(1)}
              </Badge>
            </div>

            <div>
              <p className="text-sm font-semibold text-muted-foreground">Template</p>
              <p className="text-lg font-bold">{selectedTemplate?.name}</p>
            </div>

            <div>
              <p className="text-sm font-semibold text-muted-foreground">Recipients</p>
              <p className="text-lg font-bold">{formData.selectedContactIds.size}</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                ℹ️ This campaign will be created as a draft. You can review, edit,
                schedule, or send it later from the campaign detail page.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex gap-2 justify-between">
        <Button
          variant="outline"
          onClick={() => setStep(Math.max(1, step - 1))}
          className="gap-2"
          disabled={step === 1}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        <div className="flex gap-2">
          <Link href="/outreach">
            <Button variant="outline">Cancel</Button>
          </Link>

          {step < 5 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={
                (step === 1 && (!formData.name || !formData.type)) ||
                (step === 2 && !formData.templateId) ||
                (step === 3 && formData.selectedContactIds.size === 0)
              }
              className="gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="bg-primary hover:bg-primary/90"
            >
              Create Campaign
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
