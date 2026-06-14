"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Globe,
  Users,
  Calendar,
  FileText,
  Wand2,
  ChevronDown,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Organization,
  getOrganizationById,
  deleteOrganization,
} from "@/lib/organizations-store";
import { getContacts, Contact } from "@/lib/contacts-store";
import { generateMockCompanyResearch, type ResearchBrief } from "@/lib/ai-features-store";

export default function OrganizationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const [org, setOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [linkedContacts, setLinkedContacts] = useState<Contact[]>([]);
  const [research, setResearch] = useState<ResearchBrief | null>(null);
  const [showResearch, setShowResearch] = useState(false);

  useEffect(() => {
    const loaded = getOrganizationById(id);
    const allContacts = getContacts();
    if (loaded) {
      setOrg(loaded);
      const linked = allContacts.filter((c) => loaded.linkedContacts.includes(c.id));
      setLinkedContacts(linked);
    }
    setLoading(false);
  }, [id]);

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this organization?")) {
      deleteOrganization(id);
      router.push("/organizations");
    }
  };

  const handleResearchCompany = () => {
    if (!org) return;
    const brief = generateMockCompanyResearch(org.name);
    setResearch(brief);
    setShowResearch(true);
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

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!org) {
    return (
      <div className="p-8">
        <Link href="/organizations">
          <Button variant="ghost" className="mb-4 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Organizations
          </Button>
        </Link>
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Organization not found.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/organizations">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Organizations
          </Button>
        </Link>
        <div className="flex gap-2">
          <Link href={`/organizations/${org.id}/edit`}>
            <Button variant="outline" className="gap-2">
              <Edit2 className="w-4 h-4" />
              Edit
            </Button>
          </Link>
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-4">
          {/* Profile Card */}
          <Card className="p-6 border-0">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">{org.name}</h1>
              <p className="text-muted-foreground">{org.description}</p>
            </div>

            <div className="flex gap-2 mb-6">
              <Badge className={`text-white ${getTypeColor(org.type)}`}>
                {org.type}
              </Badge>
              <Badge className={`text-white ${getStatusColor(org.status)}`}>
                {org.status}
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <a
                  href={`https://${org.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary"
                >
                  {org.website}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{org.sector}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  Last interaction: {new Date(org.lastInteraction).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Card>

          {/* Linked Contacts */}
          <Card className="p-6 border-0">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Linked Contacts ({org.linkedContacts.length})
            </h2>

            {linkedContacts.length === 0 ? (
              <p className="text-muted-foreground">No contacts linked yet.</p>
            ) : (
              <div className="space-y-3">
                {linkedContacts.map((contact) => (
                  <Link
                    key={contact.id}
                    href={`/contacts/${contact.id}`}
                    className="flex justify-between items-center p-3 border border-border rounded-lg hover:bg-muted transition-colors"
                  >
                    <div>
                      <p className="font-semibold">{contact.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {contact.email}
                      </p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700">{contact.type}</Badge>
                  </Link>
                ))}
              </div>
            )}
          </Card>

          {/* Interaction History */}
          <Card className="p-6 border-0">
            <h2 className="text-lg font-bold mb-4">Interaction History</h2>
            <div className="space-y-4">
              {[
                { action: "Email sent", date: "2 days ago" },
                { action: "Meeting scheduled", date: "5 days ago" },
                { action: "Organization added", date: "10 days ago" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex gap-3 pb-4 border-b border-border last:border-0"
                >
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-semibold text-sm">{item.action}</p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Company Research */}
          {research && (
            <Card className="p-6 border-0 bg-blue-50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  🔍 Company Research Brief
                </h2>
                <button
                  onClick={() => setShowResearch(!showResearch)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${
                      showResearch ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>

              {showResearch && (
                <div className="space-y-4">
                  {/* Overview */}
                  <div>
                    <p className="font-semibold text-sm mb-2">Overview</p>
                    <p className="text-sm text-muted-foreground">{research.overview}</p>
                  </div>

                  {/* Industry Insights */}
                  <div>
                    <p className="font-semibold text-sm mb-2">Industry Insights</p>
                    <ul className="space-y-1">
                      {research.industryInsights.map((insight, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-muted-foreground flex gap-2"
                        >
                          <span className="text-primary">•</span>
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Partnership Opportunities */}
                  <div>
                    <p className="font-semibold text-sm mb-2">
                      Partnership Opportunities
                    </p>
                    <ul className="space-y-1">
                      {research.partnershipOpportunities.map((opp, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-muted-foreground flex gap-2"
                        >
                          <span className="text-primary">•</span>
                          {opp}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recent News */}
                  <div>
                    <p className="font-semibold text-sm mb-2">Recent News</p>
                    <ul className="space-y-1">
                      {research.recentNews.map((news, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-muted-foreground flex gap-2"
                        >
                          <span className="text-primary">•</span>
                          {news}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Quick Stats */}
          <Card className="p-4 border-0">
            <h3 className="font-semibold mb-3 text-sm">Quick Stats</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Linked Contacts</p>
                <p className="text-2xl font-bold">{org.linkedContacts.length}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <p className="text-sm font-semibold capitalize">{org.status}</p>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-4 border-0">
            <h3 className="font-semibold mb-3 text-sm">Quick Actions</h3>
            <div className="space-y-2">
              <Button className="w-full" size="sm">
                Schedule Meeting
              </Button>
              <Button className="w-full" size="sm" variant="outline">
                Send Email
              </Button>
              <Button className="w-full" size="sm" variant="outline">
                Add Task
              </Button>
              <Button
                onClick={handleResearchCompany}
                className="w-full"
                size="sm"
                variant={research ? "default" : "outline"}
              >
                <Wand2 className="w-3 h-3 mr-1" />
                Research Company
              </Button>
            </div>
          </Card>

          {/* Details */}
          <Card className="p-4 border-0">
            <h3 className="font-semibold mb-3 text-sm">Details</h3>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Type</p>
                <p className="font-medium capitalize">{org.type}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Sector</p>
                <p className="font-medium">{org.sector}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
