"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit2, Trash2, Mail, Phone, ExternalLink, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Contact, getContactById, deleteContact } from "@/lib/contacts-store";

export default function ContactDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loaded = getContactById(id);
    setContact(loaded);
    setLoading(false);
  }, [id]);

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this contact?")) {
      deleteContact(id);
      router.push("/contacts");
    }
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

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="p-8">
        <Link href="/contacts">
          <Button variant="ghost" className="mb-4 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Contacts
          </Button>
        </Link>
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Contact not found.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/contacts">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Contacts
          </Button>
        </Link>
        <div className="flex gap-2">
          <Link href={`/contacts/${id}/edit`}>
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
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">
                  {contact.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold">{contact.name}</h1>
                <p className="text-muted-foreground">{contact.organization}</p>
              </div>
            </div>

            <div className="flex gap-2 mb-6">
              <Badge className={`text-white ${getTypeColor(contact.type)}`}>
                {contact.type}
              </Badge>
              <Badge className={`text-white ${getStatusColor(contact.status)}`}>
                {contact.status}
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <a href={`mailto:${contact.email}`} className="hover:text-primary">
                  {contact.email}
                </a>
              </div>
              {contact.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <a href={`tel:${contact.phone}`} className="hover:text-primary">
                    {contact.phone}
                  </a>
                </div>
              )}
              {contact.linkedin && (
                <div className="flex items-center gap-3">
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  <a
                    href={contact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary"
                  >
                    View LinkedIn Profile
                  </a>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  Last contact: {new Date(contact.lastContact).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Card>

          {/* Notes */}
          <Card className="p-6 border-0">
            <h2 className="text-lg font-bold mb-3">Notes</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {contact.notes || "No notes added yet."}
            </p>
          </Card>

          {/* Interaction Timeline */}
          <Card className="p-6 border-0">
            <h2 className="text-lg font-bold mb-4">Interaction Timeline</h2>
            <div className="space-y-4">
              {[
                { action: "Email sent", date: "2 days ago" },
                { action: "Meeting scheduled", date: "5 days ago" },
                { action: "Contact added", date: "10 days ago" },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 pb-4 border-b border-border last:border-0">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-semibold text-sm">{item.action}</p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Tags */}
          <Card className="p-4 border-0">
            <h3 className="font-semibold mb-3 text-sm">Tags</h3>
            {contact.tags.length === 0 ? (
              <p className="text-xs text-muted-foreground">No tags</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {contact.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </Card>

          {/* Quick Actions */}
          <Card className="p-4 border-0">
            <h3 className="font-semibold mb-3 text-sm">Quick Actions</h3>
            <div className="space-y-2">
              <Button className="w-full" size="sm">
                Send Email
              </Button>
              <Button className="w-full" size="sm" variant="outline">
                Schedule Meeting
              </Button>
              <Button className="w-full" size="sm" variant="outline">
                Add Task
              </Button>
            </div>
          </Card>

          {/* Organization */}
          <Card className="p-4 border-0">
            <h3 className="font-semibold mb-3 text-sm">Organization</h3>
            <p className="text-sm hover:text-primary cursor-pointer">
              {contact.organization}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
