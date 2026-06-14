"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Upload, Trash2, Search, Filter, Tag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExcelImport } from "@/components/excel-import";
import {
  Contact,
  getContacts,
  deleteContact,
  CONTACT_TYPES,
  CONTACT_STATUSES,
  getAllTags,
  getAllOrganizations,
} from "@/lib/contacts-store";

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [selectedOrg, setSelectedOrg] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set());
  const [showImport, setShowImport] = useState(false);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [allOrgs, setAllOrgs] = useState<string[]>([]);
  const [dragStartId, setDragStartId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Load contacts
  useEffect(() => {
    const loaded = getContacts();
    setContacts(loaded);
    setAllTags(getAllTags());
    setAllOrgs(getAllOrganizations());
  }, []);

  // Handle mouse up globally to end drag selection
  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, []);

  // Filter contacts
  useEffect(() => {
    let filtered = contacts;

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.organization.toLowerCase().includes(q)
      );
    }

    if (selectedType) {
      filtered = filtered.filter((c) => c.type === selectedType);
    }

    if (selectedTag) {
      filtered = filtered.filter((c) => c.tags.includes(selectedTag));
    }

    if (selectedOrg) {
      filtered = filtered.filter((c) => c.organization === selectedOrg);
    }

    if (selectedStatus) {
      filtered = filtered.filter((c) => c.status === selectedStatus);
    }

    setFilteredContacts(filtered);
  }, [contacts, search, selectedType, selectedTag, selectedOrg, selectedStatus]);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this contact?")) {
      deleteContact(id);
      setContacts(getContacts());
    }
  };

  const handleSelectAll = () => {
    if (selectedContacts.size === filteredContacts.length) {
      setSelectedContacts(new Set());
    } else {
      setSelectedContacts(new Set(filteredContacts.map((c) => c.id)));
    }
  };

  const handleBulkDelete = () => {
    if (selectedContacts.size === 0) return;
    if (confirm(`Delete ${selectedContacts.size} contacts?`)) {
      selectedContacts.forEach((id) => deleteContact(id));
      setContacts(getContacts());
      setSelectedContacts(new Set());
    }
  };

  const handleImportComplete = () => {
    setShowImport(false);
    setContacts(getContacts());
    setAllTags(getAllTags());
    setAllOrgs(getAllOrganizations());
  };

  const handleRowMouseDown = (contactId: string) => {
    setDragStartId(contactId);
    setIsDragging(true);
  };

  const handleRowMouseEnter = (contactId: string) => {
    if (!isDragging || !dragStartId) return;

    const startIndex = filteredContacts.findIndex((c) => c.id === dragStartId);
    const endIndex = filteredContacts.findIndex((c) => c.id === contactId);

    if (startIndex === -1 || endIndex === -1) return;

    const minIndex = Math.min(startIndex, endIndex);
    const maxIndex = Math.max(startIndex, endIndex);

    const newSelected = new Set<string>();
    for (let i = minIndex; i <= maxIndex; i++) {
      newSelected.add(filteredContacts[i].id);
    }
    setSelectedContacts(newSelected);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getStatusColor = (status: Contact["status"]) => {
    return {
      active: "bg-green-100 text-green-700",
      inactive: "bg-gray-100 text-gray-700",
      pending: "bg-yellow-100 text-yellow-700",
    }[status];
  };

  const getTypeColor = (type: Contact["type"]) => {
    return {
      founder: "bg-blue-100 text-blue-700",
      mentor: "bg-purple-100 text-purple-700",
      investor: "bg-pink-100 text-pink-700",
      sponsor: "bg-orange-100 text-orange-700",
      alumni: "bg-green-100 text-green-700",
      faculty: "bg-indigo-100 text-indigo-700",
      partner: "bg-red-100 text-red-700",
    }[type];
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contacts</h1>
          <p className="text-muted-foreground mt-1">
            {filteredContacts.length} of {contacts.length} contacts
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowImport(!showImport)}
            variant="outline"
            className="gap-2"
          >
            <Upload className="w-4 h-4" />
            Import
          </Button>
          <Link href="/contacts/new">
            <Button className="bg-primary hover:bg-primary/90 gap-2">
              <Plus className="w-4 h-4" />
              New Contact
            </Button>
          </Link>
        </div>
      </div>

      {/* Import Section */}
      {showImport && <ExcelImport onImportComplete={handleImportComplete} />}

      {/* Search & Filters */}
      <Card className="p-4 border-0 space-y-4">
        <div className="flex gap-2 items-center">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or organization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border-0 bg-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
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
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg text-sm bg-background"
          >
            <option value="">All Status</option>
            {CONTACT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={selectedOrg}
            onChange={(e) => setSelectedOrg(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg text-sm bg-background"
          >
            <option value="">All Organizations</option>
            {allOrgs.map((org) => (
              <option key={org} value={org}>
                {org}
              </option>
            ))}
          </select>

          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg text-sm bg-background"
          >
            <option value="">All Tags</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedContacts.size > 0 && (
        <Card className="p-4 border-0 bg-blue-50 flex items-center justify-between">
          <p className="text-sm font-semibold text-blue-700">
            {selectedContacts.size} contact(s) selected
          </p>
          <Button
            size="sm"
            variant="destructive"
            onClick={handleBulkDelete}
            className="gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete Selected
          </Button>
        </Card>
      )}

      {/* Drag-to-select hint */}
      {selectedContacts.size === 0 && filteredContacts.length > 0 && (
        <p className="text-xs text-muted-foreground px-4">
          💡 Tip: Click and drag across rows to select multiple contacts quickly
        </p>
      )}

      {/* Contacts Table */}
      <Card className="border-0 overflow-hidden">
        {filteredContacts.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-muted-foreground">No contacts found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={
                        selectedContacts.size === filteredContacts.length &&
                        filteredContacts.length > 0
                      }
                      onChange={handleSelectAll}
                      className="rounded"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Organization</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Last Contact</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map((contact) => (
                  <tr
                    key={contact.id}
                    className={`border-b border-border transition-colors cursor-pointer select-none ${
                      selectedContacts.has(contact.id)
                        ? "bg-blue-50"
                        : "hover:bg-muted/50"
                    }`}
                    onMouseDown={() => handleRowMouseDown(contact.id)}
                    onMouseEnter={() => handleRowMouseEnter(contact.id)}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedContacts.has(contact.id)}
                        onChange={(e) => {
                          const newSelected = new Set(selectedContacts);
                          if (e.target.checked) {
                            newSelected.add(contact.id);
                          } else {
                            newSelected.delete(contact.id);
                          }
                          setSelectedContacts(newSelected);
                        }}
                        className="rounded"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/contacts/${contact.id}`}
                        className="font-semibold hover:text-primary"
                      >
                        {contact.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {contact.email}
                    </td>
                    <td className="px-4 py-3 text-sm">{contact.organization}</td>
                    <td className="px-4 py-3">
                      <Badge className={getTypeColor(contact.type)}>
                        {contact.type}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={getStatusColor(contact.status)}>
                        {contact.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {new Date(contact.lastContact).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <Link href={`/contacts/${contact.id}`}>
                        <Button
                          size="sm"
                          variant="outline"
                        >
                          View
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(contact.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
