"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Copy, Upload, X, Save } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  EmailTemplate,
  getTemplates,
  deleteTemplate,
  duplicateTemplate,
  updateTemplate,
  importTemplateFromFile,
} from "@/lib/templates-store";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editingData, setEditingData] = useState<any>({});
  const [creatingData, setCreatingData] = useState({
    name: "",
    subject: "",
    content: "",
  });
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importTemplateName, setImportTemplateName] = useState("");
  const [isImporting, setIsImporting] = useState(false);

  // Load templates
  useEffect(() => {
    const loaded = getTemplates();
    setTemplates(loaded);
  }, []);

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this template?")) {
      deleteTemplate(id);
      setTemplates(getTemplates());
      if (selectedTemplateId === id) {
        setSelectedTemplateId(null);
      }
    }
  };

  const handleDuplicate = (id: string) => {
    const template = templates.find((t) => t.id === id);
    if (template) {
      const newName = `${template.name} (Copy)`;
      duplicateTemplate(id, newName);
      setTemplates(getTemplates());
    }
  };

  const handleEdit = () => {
    if (selectedTemplate) {
      setEditingData({
        name: selectedTemplate.name,
        subject: selectedTemplate.subject,
        content: selectedTemplate.content,
      });
      setIsEditing(true);
    }
  };

  const handleSaveEdit = () => {
    if (!selectedTemplateId) return;
    updateTemplate(selectedTemplateId, editingData);
    setTemplates(getTemplates());
    setIsEditing(false);
  };

  const handleImportFile = async () => {
    if (!importFile) {
      alert("Please select a file");
      return;
    }

    const templateName = importTemplateName || importFile.name.split(".")[0];
    setIsImporting(true);
    try {
      const newTemplate = await importTemplateFromFile(importFile, templateName);
      if (newTemplate) {
        setTemplates(getTemplates());
        setSelectedTemplateId(newTemplate.id);
        setShowImportDialog(false);
        setImportFile(null);
        setImportTemplateName("");
      } else {
        alert("Error importing file");
      }
    } catch (error) {
      alert("Error importing file");
    } finally {
      setIsImporting(false);
    }
  };

  const handleCreateTemplate = () => {
    if (!creatingData.name || !creatingData.subject || !creatingData.content) {
      alert("Please fill in all fields");
      return;
    }

    const { addTemplate } = require("@/lib/templates-store");
    const newTemplate = addTemplate({
      name: creatingData.name,
      subject: creatingData.subject,
      content: creatingData.content,
    });

    setTemplates(getTemplates());
    setSelectedTemplateId(newTemplate.id);
    setIsCreating(false);
    setCreatingData({ name: "", subject: "", content: "" });
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/outreach">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Email Templates</h1>
            <p className="text-muted-foreground mt-1">
              Create, edit, and manage email campaign templates
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setShowImportDialog(true)}
          >
            <Upload className="w-4 h-4" />
            Import File
          </Button>
          <Button
            className="gap-2 bg-primary hover:bg-primary/90"
            onClick={() => setIsCreating(true)}
          >
            <Plus className="w-4 h-4" />
            New Template
          </Button>
        </div>
      </div>

      {/* Import Dialog */}
      {showImportDialog && (
        <Card className="p-6 border-0 bg-blue-50 border-l-4 border-blue-500 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Import Template from File</h3>
            <button
              onClick={() => {
                setShowImportDialog(false);
                setImportFile(null);
              }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="font-semibold text-sm">Template Name</Label>
              <Input
                placeholder="Give your template a name"
                value={importTemplateName}
                onChange={(e) => setImportTemplateName(e.target.value)}
              />
            </div>

            <div>
              <Label className="font-semibold text-sm">Upload File</Label>
              <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept=".txt,.doc,.docx"
                  onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="file-input"
                />
                <label htmlFor="file-input" className="cursor-pointer">
                  <p className="font-semibold text-sm text-blue-900">
                    {importFile ? importFile.name : "Click to upload or drag file"}
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    Supports .txt, .doc, .docx files
                  </p>
                </label>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleImportFile}
                disabled={!importFile || !importTemplateName || isImporting}
                className="gap-2"
              >
                <Upload className="w-4 h-4" />
                {isImporting ? "Importing..." : "Import"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowImportDialog(false);
                  setImportFile(null);
                  setImportTemplateName("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Templates List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Templates ({templates.length})</h2>
          <Card className="border-0 space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
            {templates.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                <p>No templates yet</p>
              </div>
            ) : (
              templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => {
                    setSelectedTemplateId(template.id);
                    setIsEditing(false);
                  }}
                  className={`p-4 rounded-lg cursor-pointer transition-colors border ${
                    selectedTemplateId === template.id
                      ? "bg-blue-50 border-primary"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <h3 className="font-semibold text-sm">{template.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {template.subject}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Updated: {new Date(template.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </Card>
        </div>

        {/* Template Editor/Viewer */}
        <div className="lg:col-span-2">
          {isCreating ? (
            <Card className="border-0 space-y-6 p-6">
              {/* Create Form */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Create New Template</h2>
                  <button
                    onClick={() => {
                      setIsCreating(false);
                      setCreatingData({ name: "", subject: "", content: "" });
                    }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Name */}
                <div>
                  <Label className="font-semibold text-sm">Template Name *</Label>
                  <Input
                    placeholder="e.g., Sponsorship Proposal"
                    value={creatingData.name}
                    onChange={(e) =>
                      setCreatingData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                </div>

                {/* Subject */}
                <div>
                  <Label className="font-semibold text-sm">Subject Line *</Label>
                  <Input
                    value={creatingData.subject}
                    onChange={(e) =>
                      setCreatingData((prev) => ({
                        ...prev,
                        subject: e.target.value,
                      }))
                    }
                    placeholder="e.g., Sponsorship Opportunity - {{company}}"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Use {"{{name}}"}, {"{{email}}"}, {"{{company}}"} for personalization
                  </p>
                </div>

                {/* Content */}
                <div>
                  <Label className="font-semibold text-sm">Email Content (HTML) *</Label>
                  <Textarea
                    value={creatingData.content}
                    onChange={(e) =>
                      setCreatingData((prev) => ({
                        ...prev,
                        content: e.target.value,
                      }))
                    }
                    placeholder={`<p>Dear {{name}},</p>\n<p>We are reaching out to {{company}} with an exciting opportunity...</p>\n<p>Best regards,<br/>PIEDS Team</p>`}
                    className="min-h-64 font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter HTML content. Variables like {"{{name}}"}, {"{{company}}"}, {"{{email}}"} will be replaced automatically
                  </p>
                </div>

                {/* Create/Cancel */}
                <div className="flex gap-2 pt-4 border-t border-border">
                  <Button
                    onClick={handleCreateTemplate}
                    className="gap-2 bg-primary hover:bg-primary/90"
                  >
                    <Plus className="w-4 h-4" />
                    Create Template
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCreating(false);
                      setCreatingData({ name: "", subject: "", content: "" });
                    }}
                  >
                    Cancel
                  </Button>
                </div>

                {/* Variable Help */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                  <p className="text-sm font-semibold text-blue-900">
                    Available Variables
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline">{"{{name}}"}</Badge>
                    <Badge variant="outline">{"{{email}}"}</Badge>
                    <Badge variant="outline">{"{{company}}"}</Badge>
                  </div>
                  <p className="text-xs text-blue-700">
                    Use these in subject and content to personalize emails for each recipient
                  </p>
                </div>
              </div>
            </Card>
          ) : selectedTemplate ? (
            <Card className="border-0 space-y-6 p-6">
              {isEditing ? (
                <>
                  {/* Inline Editor */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">Edit Template</h2>
                      <button onClick={() => setIsEditing(false)}>
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Name */}
                    <div>
                      <Label className="font-semibold text-sm">Template Name</Label>
                      <Input
                        value={editingData.name}
                        onChange={(e) =>
                          setEditingData((prev: any) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                      />
                    </div>

                    {/* Subject */}
                    <div>
                      <Label className="font-semibold text-sm">Subject Line</Label>
                      <Input
                        value={editingData.subject}
                        onChange={(e) =>
                          setEditingData((prev: any) => ({
                            ...prev,
                            subject: e.target.value,
                          }))
                        }
                        placeholder="e.g., Sponsorship Opportunity - {{company}}"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Use {"{{name}}"}, {"{{email}}"}, {"{{company}}"} for personalization
                      </p>
                    </div>

                    {/* Content */}
                    <div>
                      <Label className="font-semibold text-sm">Email Content (HTML)</Label>
                      <Textarea
                        value={editingData.content}
                        onChange={(e) =>
                          setEditingData((prev: any) => ({
                            ...prev,
                            content: e.target.value,
                          }))
                        }
                        className="min-h-64 font-mono text-sm"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Enter HTML content. Variables like {"{{name}}"}, {"{{company}}"}, {"{{email}}"} will be replaced automatically
                      </p>
                    </div>

                    {/* Save/Cancel */}
                    <div className="flex gap-2 pt-4 border-t border-border">
                      <Button
                        onClick={handleSaveEdit}
                        className="gap-2 bg-primary hover:bg-primary/90"
                      >
                        <Save className="w-4 h-4" />
                        Save Changes
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Template Info */}
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-2xl font-bold">{selectedTemplate.name}</h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Created: {new Date(selectedTemplate.createdAt).toLocaleDateString()} •
                        Updated: {new Date(selectedTemplate.updatedAt).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        variant="outline"
                        className="gap-2"
                        onClick={handleEdit}
                      >
                        Edit Template
                      </Button>
                      <Button
                        variant="outline"
                        className="gap-2"
                        onClick={() => handleDuplicate(selectedTemplate.id)}
                      >
                        <Copy className="w-4 h-4" />
                        Duplicate
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(selectedTemplate.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-2 pt-4 border-t border-border">
                    <label className="text-sm font-semibold">Subject Line</label>
                    <div className="p-3 bg-muted rounded-lg border border-border text-sm">
                      {selectedTemplate.subject}
                    </div>
                  </div>

                  {/* Content Preview */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Email Content Preview</label>
                    <div className="p-4 bg-muted rounded-lg border border-border text-sm prose prose-sm max-w-none">
                      <div
                        dangerouslySetInnerHTML={{ __html: selectedTemplate.content }}
                      />
                    </div>
                  </div>

                  {/* Variables Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                    <p className="text-sm font-semibold text-blue-900">
                      Available Variables
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline">{"{{name}}"}</Badge>
                      <Badge variant="outline">{"{{email}}"}</Badge>
                      <Badge variant="outline">{"{{company}}"}</Badge>
                    </div>
                    <p className="text-xs text-blue-700">
                      These variables will be replaced with actual contact information when
                      sending
                    </p>
                  </div>
                </>
              )}
            </Card>
          ) : (
            <Card className="border-0 p-12 text-center">
              <p className="text-muted-foreground">Select a template to view and edit</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
