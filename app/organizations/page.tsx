"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Search, Filter } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Organization,
  getOrganizations,
  deleteOrganization,
  ORGANIZATION_TYPES,
  ORGANIZATION_STATUSES,
  getAllSectors,
} from "@/lib/organizations-store";
import { getContacts } from "@/lib/contacts-store";

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [filteredOrgs, setFilteredOrgs] = useState<Organization[]>([]);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedSector, setSelectedSector] = useState<string>("");
  const [selectedOrgs, setSelectedOrgs] = useState<Set<string>>(new Set());
  const [allSectors, setAllSectors] = useState<string[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [dragStartId, setDragStartId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Load data
  useEffect(() => {
    const loaded = getOrganizations();
    const loadedContacts = getContacts();
    setOrganizations(loaded);
    setContacts(loadedContacts);
    setAllSectors(getAllSectors());
  }, []);

  // Handle mouse up globally to end drag selection
  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, []);

  // Filter organizations
  useEffect(() => {
    let filtered = organizations;

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.name.toLowerCase().includes(q) ||
          o.sector.toLowerCase().includes(q) ||
          o.website.toLowerCase().includes(q)
      );
    }

    if (selectedType) {
      filtered = filtered.filter((o) => o.type === selectedType);
    }

    if (selectedStatus) {
      filtered = filtered.filter((o) => o.status === selectedStatus);
    }

    if (selectedSector) {
      filtered = filtered.filter((o) => o.sector === selectedSector);
    }

    setFilteredOrgs(filtered);
  }, [organizations, search, selectedType, selectedStatus, selectedSector]);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this organization?")) {
      deleteOrganization(id);
      setOrganizations(getOrganizations());
    }
  };

  const handleSelectAll = () => {
    if (selectedOrgs.size === filteredOrgs.length) {
      setSelectedOrgs(new Set());
    } else {
      setSelectedOrgs(new Set(filteredOrgs.map((o) => o.id)));
    }
  };

  const handleBulkDelete = () => {
    if (selectedOrgs.size === 0) return;
    if (confirm(`Delete ${selectedOrgs.size} organizations?`)) {
      selectedOrgs.forEach((id) => deleteOrganization(id));
      setOrganizations(getOrganizations());
      setSelectedOrgs(new Set());
    }
  };

  const handleRowMouseDown = (orgId: string) => {
    setDragStartId(orgId);
    setIsDragging(true);
  };

  const handleRowMouseEnter = (orgId: string) => {
    if (!isDragging || !dragStartId) return;

    const startIndex = filteredOrgs.findIndex((o) => o.id === dragStartId);
    const endIndex = filteredOrgs.findIndex((o) => o.id === orgId);

    if (startIndex === -1 || endIndex === -1) return;

    const minIndex = Math.min(startIndex, endIndex);
    const maxIndex = Math.max(startIndex, endIndex);

    const newSelected = new Set<string>();
    for (let i = minIndex; i <= maxIndex; i++) {
      newSelected.add(filteredOrgs[i].id);
    }
    setSelectedOrgs(newSelected);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getTypeColor = (type: Organization["type"]) => {
    return {
      corporate: "bg-blue-100 text-blue-700",
      startup: "bg-green-100 text-green-700",
      university: "bg-purple-100 text-purple-700",
      ngo: "bg-orange-100 text-orange-700",
      government: "bg-red-100 text-red-700",
      other: "bg-gray-100 text-gray-700",
    }[type];
  };

  const getStatusColor = (status: Organization["status"]) => {
    return {
      active: "bg-green-100 text-green-700",
      inactive: "bg-gray-100 text-gray-700",
      prospect: "bg-yellow-100 text-yellow-700",
    }[status];
  };

  const getContactNames = (contactIds: string[]) => {
    return contactIds
      .slice(0, 2)
      .map((id) => contacts.find((c) => c.id === id)?.name)
      .filter(Boolean)
      .join(", ");
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Organizations</h1>
          <p className="text-muted-foreground mt-1">
            {filteredOrgs.length} of {organizations.length} organizations
          </p>
        </div>
        <Link href="/organizations/new">
          <Button className="bg-primary hover:bg-primary/90 gap-2">
            <Plus className="w-4 h-4" />
            New Organization
          </Button>
        </Link>
      </div>

      {/* Search & Filters */}
      <Card className="p-4 border-0 space-y-4">
        <div className="flex gap-2 items-center">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, sector, or website..."
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
            {ORGANIZATION_TYPES.map((t) => (
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
            {ORGANIZATION_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg text-sm bg-background"
          >
            <option value="">All Sectors</option>
            {allSectors.map((sector) => (
              <option key={sector} value={sector}>
                {sector}
              </option>
            ))}
          </select>

          <div className="text-sm text-muted-foreground">
            {filteredOrgs.length} result{filteredOrgs.length !== 1 ? "s" : ""}
          </div>
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedOrgs.size > 0 && (
        <Card className="p-4 border-0 bg-blue-50 flex items-center justify-between">
          <p className="text-sm font-semibold text-blue-700">
            {selectedOrgs.size} organization(s) selected
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
      {selectedOrgs.size === 0 && filteredOrgs.length > 0 && (
        <p className="text-xs text-muted-foreground px-4">
          💡 Tip: Click and drag across rows to select multiple organizations quickly
        </p>
      )}

      {/* Organizations Table */}
      <Card className="border-0 overflow-hidden">
        {filteredOrgs.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-muted-foreground">No organizations found.</p>
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
                        selectedOrgs.size === filteredOrgs.length &&
                        filteredOrgs.length > 0
                      }
                      onChange={handleSelectAll}
                      className="rounded"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Sector</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Contacts</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Last Contact</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrgs.map((org) => (
                  <tr
                    key={org.id}
                    className={`border-b border-border transition-colors cursor-pointer select-none ${
                      selectedOrgs.has(org.id)
                        ? "bg-blue-50"
                        : "hover:bg-muted/50"
                    }`}
                    onMouseDown={() => handleRowMouseDown(org.id)}
                    onMouseEnter={() => handleRowMouseEnter(org.id)}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedOrgs.has(org.id)}
                        onChange={(e) => {
                          const newSelected = new Set(selectedOrgs);
                          if (e.target.checked) {
                            newSelected.add(org.id);
                          } else {
                            newSelected.delete(org.id);
                          }
                          setSelectedOrgs(newSelected);
                        }}
                        className="rounded"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/organizations/${org.id}`}
                        className="font-semibold hover:text-primary"
                      >
                        {org.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={getTypeColor(org.type)}>
                        {org.type}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm">{org.sector}</td>
                    <td className="px-4 py-3">
                      <Badge className={getStatusColor(org.status)}>
                        {org.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {org.linkedContacts.length === 0
                        ? "None"
                        : `${org.linkedContacts.length} contact${
                            org.linkedContacts.length !== 1 ? "s" : ""
                          }`}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {new Date(org.lastInteraction).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <Link href={`/organizations/${org.id}`}>
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
                        onClick={() => handleDelete(org.id)}
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
