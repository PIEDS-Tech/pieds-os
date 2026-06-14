"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Campaign,
  getCampaigns,
  deleteCampaign,
  CAMPAIGN_TYPES,
  CAMPAIGN_STATUSES,
} from "@/lib/campaigns-store";

export default function OutreachPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedCampaigns, setSelectedCampaigns] = useState<Set<string>>(new Set());
  const [dragStartId, setDragStartId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Load campaigns
  useEffect(() => {
    const loaded = getCampaigns();
    setCampaigns(loaded);
  }, []);

  // Filter campaigns
  useEffect(() => {
    let filtered = campaigns;

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.templateName.toLowerCase().includes(q)
      );
    }

    if (selectedType) {
      filtered = filtered.filter((c) => c.type === selectedType);
    }

    if (selectedStatus) {
      filtered = filtered.filter((c) => c.status === selectedStatus);
    }

    setFilteredCampaigns(filtered);
  }, [campaigns, search, selectedType, selectedStatus]);

  // Drag to select
  useEffect(() => {
    window.addEventListener("mouseup", () => setIsDragging(false));
    return () => window.removeEventListener("mouseup", () => setIsDragging(false));
  }, []);

  const handleRowMouseDown = (campaignId: string) => {
    setDragStartId(campaignId);
    setIsDragging(true);
  };

  const handleRowMouseEnter = (campaignId: string) => {
    if (!isDragging || !dragStartId) return;

    const startIndex = filteredCampaigns.findIndex((c) => c.id === dragStartId);
    const endIndex = filteredCampaigns.findIndex((c) => c.id === campaignId);

    if (startIndex === -1 || endIndex === -1) return;

    const minIndex = Math.min(startIndex, endIndex);
    const maxIndex = Math.max(startIndex, endIndex);

    const newSelected = new Set<string>();
    for (let i = minIndex; i <= maxIndex; i++) {
      newSelected.add(filteredCampaigns[i].id);
    }
    setSelectedCampaigns(newSelected);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this campaign?")) {
      deleteCampaign(id);
      setCampaigns(getCampaigns());
    }
  };

  const handleSelectAll = () => {
    if (selectedCampaigns.size === filteredCampaigns.length) {
      setSelectedCampaigns(new Set());
    } else {
      setSelectedCampaigns(new Set(filteredCampaigns.map((c) => c.id)));
    }
  };

  const handleBulkDelete = () => {
    if (selectedCampaigns.size === 0) return;
    if (confirm(`Delete ${selectedCampaigns.size} campaigns?`)) {
      selectedCampaigns.forEach((id) => deleteCampaign(id));
      setCampaigns(getCampaigns());
      setSelectedCampaigns(new Set());
    }
  };

  const getStatusColor = (status: Campaign["status"]) => {
    return {
      draft: "bg-gray-100 text-gray-700",
      scheduled: "bg-blue-100 text-blue-700",
      sent: "bg-green-100 text-green-700",
      completed: "bg-purple-100 text-purple-700",
    }[status];
  };

  const getTypeColor = (type: Campaign["type"]) => {
    return {
      sponsorship: "bg-orange-100 text-orange-700",
      partnership: "bg-indigo-100 text-indigo-700",
      mentor: "bg-teal-100 text-teal-700",
      investor: "bg-pink-100 text-pink-700",
    }[type];
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Outreach Campaigns</h1>
          <p className="text-muted-foreground mt-1">
            {filteredCampaigns.length} of {campaigns.length} campaigns
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/outreach/templates">
            <Button variant="outline" className="gap-2">
              📧 Email Templates
            </Button>
          </Link>
          <Link href="/outreach/new">
            <Button className="bg-primary hover:bg-primary/90 gap-2">
              <Plus className="w-4 h-4" />
              New Campaign
            </Button>
          </Link>
        </div>
      </div>

      {/* Search & Filters */}
      <Card className="p-4 border-0 space-y-4">
        <div className="flex gap-2 items-center">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by campaign name or template..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border-0 bg-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg text-sm bg-background"
          >
            <option value="">All Types</option>
            {CAMPAIGN_TYPES.map((t) => (
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
            {CAMPAIGN_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>

          <div className="text-sm text-muted-foreground">
            {filteredCampaigns.length} result{filteredCampaigns.length !== 1 ? "s" : ""}
          </div>
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedCampaigns.size > 0 && (
        <Card className="p-4 border-0 bg-blue-50 flex items-center justify-between">
          <p className="text-sm font-semibold text-blue-700">
            {selectedCampaigns.size} campaign(s) selected
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
      {selectedCampaigns.size === 0 && filteredCampaigns.length > 0 && (
        <p className="text-xs text-muted-foreground px-4">
          💡 Tip: Click and drag across rows to select multiple campaigns quickly
        </p>
      )}

      {/* Campaigns Table */}
      <Card className="border-0 overflow-hidden">
        {filteredCampaigns.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-muted-foreground">No campaigns found.</p>
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
                        selectedCampaigns.size === filteredCampaigns.length &&
                        filteredCampaigns.length > 0
                      }
                      onChange={handleSelectAll}
                      className="rounded"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Template</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Stats</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Created</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCampaigns.map((campaign) => (
                  <tr
                    key={campaign.id}
                    className={`border-b border-border transition-colors cursor-pointer select-none ${
                      selectedCampaigns.has(campaign.id)
                        ? "bg-blue-50"
                        : "hover:bg-muted/50"
                    }`}
                    onMouseDown={() => handleRowMouseDown(campaign.id)}
                    onMouseEnter={() => handleRowMouseEnter(campaign.id)}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedCampaigns.has(campaign.id)}
                        onChange={(e) => {
                          const newSelected = new Set(selectedCampaigns);
                          if (e.target.checked) {
                            newSelected.add(campaign.id);
                          } else {
                            newSelected.delete(campaign.id);
                          }
                          setSelectedCampaigns(newSelected);
                        }}
                        className="rounded"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/outreach/${campaign.id}`}
                        className="font-semibold hover:text-primary"
                      >
                        {campaign.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={getTypeColor(campaign.type)}>
                        {campaign.type}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {campaign.templateName}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        <span>📧 {campaign.stats.sent}</span>
                        <span>👁️ {campaign.stats.opened}</span>
                        <span>💬 {campaign.stats.replied}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {new Date(campaign.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <Link href={`/outreach/${campaign.id}`}>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(campaign.id)}
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
