"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Search, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Document,
  getDocuments,
  deleteDocument,
  searchDocuments,
  getAllDocumentTags,
  DOCUMENT_TYPES,
} from "@/lib/documents-store";

export default function KnowledgeBasePage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocs, setFilteredDocs] = useState<Document[]>([]);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [allTags, setAllTags] = useState<string[]>([]);
  const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loaded = getDocuments();
    setDocuments(loaded);
    setAllTags(getAllDocumentTags());
  }, []);

  useEffect(() => {
    let filtered = documents;

    if (search) {
      filtered = searchDocuments(search);
    }

    if (selectedType) {
      filtered = filtered.filter((d) => d.type === selectedType);
    }

    if (selectedTag) {
      filtered = filtered.filter((d) => d.tags.includes(selectedTag));
    }

    setFilteredDocs(filtered);
  }, [documents, search, selectedType, selectedTag]);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure?")) {
      deleteDocument(id);
      setDocuments(getDocuments());
    }
  };

  const handleBulkDelete = () => {
    if (selectedDocs.size === 0 || !confirm(`Delete ${selectedDocs.size} documents?`)) return;
    selectedDocs.forEach((id) => deleteDocument(id));
    setDocuments(getDocuments());
    setSelectedDocs(new Set());
  };

  const getTypeIcon = (type: Document["type"]) => {
    const icons = { pdf: "📄", document: "📝", spreadsheet: "📊", presentation: "🎯", image: "🖼️", other: "📦" };
    return icons[type];
  };

  const getTypeColor = (type: Document["type"]) => {
    const colors = {
      pdf: "bg-red-100 text-red-700",
      document: "bg-blue-100 text-blue-700",
      spreadsheet: "bg-green-100 text-green-700",
      presentation: "bg-purple-100 text-purple-700",
      image: "bg-pink-100 text-pink-700",
      other: "bg-gray-100 text-gray-700",
    };
    return colors[type];
  };

  const formatSize = (kb: number) => (kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`);

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Knowledge Base</h1>
          <p className="text-muted-foreground mt-1">{filteredDocs.length} of {documents.length} documents</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 gap-2">
          <Plus className="w-4 h-4" />
          Upload Document
        </Button>
      </div>

      {/* Search & Filters */}
      <Card className="p-4 border-0 space-y-4">
        <div className="flex gap-2 items-center">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border-0 bg-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg text-sm bg-background"
          >
            <option value="">All Types</option>
            {DOCUMENT_TYPES.map((t) => (
              <option key={t} value={t}>{getTypeIcon(t)} {t.charAt(0).toUpperCase() + t.slice(1)}</option>
            ))}
          </select>

          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg text-sm bg-background"
          >
            <option value="">All Tags</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedDocs.size > 0 && (
        <Card className="p-4 border-0 bg-blue-50 flex items-center justify-between">
          <p className="text-sm font-semibold text-blue-700">{selectedDocs.size} document(s) selected</p>
          <Button size="sm" variant="destructive" onClick={handleBulkDelete} className="gap-2">
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </Card>
      )}

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.length === 0 ? (
          <div className="col-span-full p-12 text-center">
            <p className="text-muted-foreground">No documents found.</p>
          </div>
        ) : (
          filteredDocs.map((doc) => (
            <Card
              key={doc.id}
              className={`p-4 border-0 transition-all hover:shadow-lg ${
                selectedDocs.has(doc.id) ? "bg-blue-50 ring-2 ring-primary" : ""
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 flex items-center gap-2">
                    <span className="text-2xl">{getTypeIcon(doc.type)}</span>
                    <div>
                      <h3 className="font-semibold line-clamp-2 text-sm">{doc.name}</h3>
                      <p className="text-xs text-muted-foreground">{formatSize(doc.size)}</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedDocs.has(doc.id)}
                    onChange={(e) => {
                      const newSelected = new Set(selectedDocs);
                      if (e.target.checked) newSelected.add(doc.id);
                      else newSelected.delete(doc.id);
                      setSelectedDocs(newSelected);
                    }}
                    className="rounded"
                  />
                </div>

                <Badge className={getTypeColor(doc.type)}>{doc.type}</Badge>

                {doc.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">{doc.description}</p>
                )}

                {doc.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {doc.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="text-xs text-muted-foreground pt-2 border-t border-border">
                  <p>📤 {doc.uploadedBy} · {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1 gap-1" disabled>
                    <Download className="w-3 h-3" />
                    View
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(doc.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
