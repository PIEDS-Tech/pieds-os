"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { ArrowLeft, Edit2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCampaignById } from "@/lib/campaigns-store";
import { getContactById } from "@/lib/contacts-store";

export default function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loaded = getCampaignById(id);
    setCampaign(loaded);
    setLoading(false);
  }, [id]);

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

  const getStatusColor = (status: string) => {
    return {
      pending: "bg-gray-100 text-gray-700",
      sent: "bg-green-100 text-green-700",
      opened: "bg-blue-100 text-blue-700",
      replied: "bg-purple-100 text-purple-700",
      bounced: "bg-red-100 text-red-700",
    }[status] || "bg-gray-100 text-gray-700";
  };

  const getCampaignStatusColor = (status: string) => {
    return {
      draft: "bg-gray-100 text-gray-700",
      scheduled: "bg-blue-100 text-blue-700",
      sent: "bg-green-100 text-green-700",
      completed: "bg-purple-100 text-purple-700",
    }[status];
  };

  const getCampaignTypeColor = (type: string) => {
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
        <div className="flex items-center gap-4">
          <Link href="/outreach">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{campaign.name}</h1>
            <p className="text-muted-foreground mt-1">
              Created on {new Date(campaign.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/outreach/templates">
            <Button variant="outline" className="gap-2">
              📧 View Templates
            </Button>
          </Link>
          <Link href={`/outreach/${id}/edit`}>
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <Edit2 className="w-4 h-4" />
              Change Template
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaign Info */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="p-6 border-0 space-y-4">
            <div>
              <p className="text-xs text-muted-foreground font-semibold">Type</p>
              <Badge className={getCampaignTypeColor(campaign.type)}>
                {campaign.type.charAt(0).toUpperCase() + campaign.type.slice(1)}
              </Badge>
            </div>

            <div>
              <p className="text-xs text-muted-foreground font-semibold">Status</p>
              <Badge className={getCampaignStatusColor(campaign.status)}>
                {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
              </Badge>
            </div>

            <div>
              <p className="text-xs text-muted-foreground font-semibold">Template</p>
              <p className="text-sm font-medium">{campaign.templateName}</p>
            </div>

            {campaign.scheduledFor && (
              <div>
                <p className="text-xs text-muted-foreground font-semibold">
                  Scheduled For
                </p>
                <p className="text-sm font-medium">
                  {new Date(campaign.scheduledFor).toLocaleDateString()}
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Stats & Recipients */}
        <div className="lg:col-span-2 space-y-4">
          {/* Stats */}
          <Card className="p-6 border-0">
            <h2 className="text-lg font-semibold mb-4">Campaign Stats</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{campaign.stats.total}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">📧 Sent</p>
                <p className="text-2xl font-bold">{campaign.stats.sent}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">👁️ Opened</p>
                <p className="text-2xl font-bold">{campaign.stats.opened}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">💬 Replied</p>
                <p className="text-2xl font-bold">{campaign.stats.replied}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">❌ Bounced</p>
                <p className="text-2xl font-bold">{campaign.stats.bounced}</p>
              </div>
            </div>
          </Card>

          {/* Recipients */}
          <Card className="border-0 overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-semibold">
                Recipients ({campaign.recipients.length})
              </h2>
            </div>

            {campaign.recipients.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-muted-foreground">No recipients added yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Sent
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Opened
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaign.recipients.map((recipient: any) => (
                      <tr
                        key={recipient.contactId}
                        className="border-b border-border hover:bg-muted/50"
                      >
                        <td className="px-4 py-3 font-medium">
                          {recipient.contactName}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {recipient.contactEmail}
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={getStatusColor(recipient.status)}>
                            {recipient.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {recipient.sentAt
                            ? new Date(recipient.sentAt).toLocaleDateString()
                            : "-"}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {recipient.openedAt
                            ? new Date(recipient.openedAt).toLocaleDateString()
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
