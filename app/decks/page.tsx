"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Eye, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getDecks, deleteDeck, DECK_TEMPLATES, type Deck } from "@/lib/decks-store";
import { ROUTES } from "@/lib/routes";

export default function DecksPage() {
  const [decks, setDecks] = useState<Deck[]>([]);

  useEffect(() => {
    const loaded = getDecks();
    setDecks(loaded);
  }, []);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this deck?")) {
      deleteDeck(id);
      setDecks(getDecks());
    }
  };

  const getStatusColor = (status: string) => ({
    draft: "bg-yellow-100 text-yellow-700",
    finalized: "bg-green-100 text-green-700",
    presented: "bg-blue-100 text-blue-700",
  }[status] || "bg-gray-100");

  const getTemplateIcon = (template: string) => ({
    sponsorship: "🤝",
    partnership: "🔗",
    mentor: "👨‍🏫",
    investor: "💰",
  }[template] || "📊");

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pitch Decks</h1>
          <p className="text-muted-foreground mt-1">Create and manage presentation decks</p>
        </div>
        <Link href="/decks/new">
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4" />
            New Deck
          </Button>
        </Link>
      </div>

      {/* Empty State */}
      {decks.length === 0 ? (
        <Card className="p-12 border-0 text-center">
          <p className="text-4xl mb-4">📊</p>
          <h2 className="text-xl font-semibold mb-2">No decks yet</h2>
          <p className="text-muted-foreground mb-6">Create your first pitch deck to get started</p>
          <Link href="/decks/new">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Create First Deck
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {decks.map((deck) => (
            <Card key={deck.id} className="p-6 border-0 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{getTemplateIcon(deck.template)}</span>
                  <div>
                    <h3 className="font-semibold">{deck.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {DECK_TEMPLATES[deck.template].name}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {/* Company */}
                <div>
                  <p className="text-xs text-muted-foreground">Target Company</p>
                  <p className="text-sm font-semibold">{deck.targetCompanyName}</p>
                </div>

                {/* Status & Slides */}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <Badge className={getStatusColor(deck.status)}>
                    {deck.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{deck.slides.length} slides</span>
                </div>

                {/* Updated Date */}
                <p className="text-xs text-muted-foreground">
                  Updated {new Date(deck.updatedAt).toLocaleDateString()}
                </p>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Link href={`/decks/${deck.id}`} className="flex-1">
                    <Button size="sm" variant="outline" className="w-full gap-2 justify-center">
                      <Eye className="w-3 h-3" />
                      Preview
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(deck.id)}
                    className="gap-2"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
