"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Edit2, ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getDeckById, updateDeckSlide, updateDeckStatus, DECK_TEMPLATES, type Deck } from "@/lib/decks-store";
import { ROUTES } from "@/lib/routes";

export default function DeckDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [deck, setDeck] = useState<Deck | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [editingSlide, setEditingSlide] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loaded = getDeckById(id);
    setDeck(loaded);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!deck) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Deck not found</h1>
      </div>
    );
  }

  const currentSlide = deck.slides[currentSlideIndex];
  const templateName = DECK_TEMPLATES[deck.template].name;

  const handleSlideContentChange = (newContent: string) => {
    updateDeckSlide(deck.id, currentSlide.id, { content: newContent });
    const updated = getDeckById(deck.id);
    setDeck(updated);
  };

  const handleExport = () => {
    // Mock export - in production, would generate PDF
    const deckData = JSON.stringify(deck, null, 2);
    const blob = new Blob([deckData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${deck.name}.json`;
    a.click();
    alert("Deck exported as JSON. In production, this would generate a PDF.");
  };

  const handleStatusChange = (newStatus: string) => {
    updateDeckStatus(deck.id, newStatus as any);
    const updated = getDeckById(deck.id);
    setDeck(updated);
  };

  const getStatusColor = (status: string) => ({
    draft: "bg-yellow-100 text-yellow-700",
    finalized: "bg-green-100 text-green-700",
    presented: "bg-blue-100 text-blue-700",
  }[status] || "bg-gray-100");

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={ROUTES.DECKS?.ROOT || "/decks"}>
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{deck.name}</h1>
            <div className="flex items-center gap-3 mt-1">
              <Badge className={getStatusColor(deck.status)}>{deck.status}</Badge>
              <span className="text-sm text-muted-foreground">{templateName}</span>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">{deck.targetCompanyName}</span>
            </div>
          </div>
        </div>
        <Button onClick={handleExport} className="gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Slide Preview */}
        <div className="lg:col-span-3">
          <Card className="p-8 border-0 min-h-96" style={{ backgroundColor: deck.brandColor + "15" }}>
            <div
              className="h-full flex flex-col justify-center items-center text-center p-8 rounded-lg"
              style={{ borderLeft: `8px solid ${deck.brandColor}` }}
            >
              <h2 className="text-3xl font-bold mb-4">{currentSlide.title}</h2>
              <div className="text-lg text-muted-foreground whitespace-pre-wrap">
                {currentSlide.content}
              </div>
            </div>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <Button
              onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
              variant="outline"
              disabled={currentSlideIndex === 0}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            <div className="text-sm text-muted-foreground">
              Slide {currentSlideIndex + 1} of {deck.slides.length}
            </div>

            <Button
              onClick={() => setCurrentSlideIndex(Math.min(deck.slides.length - 1, currentSlideIndex + 1))}
              variant="outline"
              disabled={currentSlideIndex === deck.slides.length - 1}
              className="gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Slide List */}
          <Card className="p-4 border-0">
            <h3 className="font-semibold mb-3 text-sm">Slides</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {deck.slides.map((slide: any, idx: number) => (
                <div
                  key={slide.id}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`p-2 rounded cursor-pointer transition-all text-xs ${
                    currentSlideIndex === idx
                      ? "bg-primary text-white font-semibold"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  <p className="font-semibold">{slide.title}</p>
                  <p className="text-xs opacity-75">Slide {idx + 1}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Status Selector */}
          <Card className="p-4 border-0">
            <h3 className="font-semibold mb-3 text-sm">Status</h3>
            <select
              value={deck.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className={`w-full px-3 py-2 rounded border-0 text-sm font-semibold cursor-pointer ${getStatusColor(deck.status)}`}
            >
              <option value="draft">Draft</option>
              <option value="finalized">Finalized</option>
              <option value="presented">Presented</option>
            </select>
          </Card>

          {/* Deck Info */}
          <Card className="p-4 border-0 bg-blue-50">
            <h3 className="font-semibold text-sm mb-3">Deck Info</h3>
            <div className="space-y-2 text-xs">
              <div>
                <p className="text-muted-foreground">Total Slides</p>
                <p className="font-semibold">{deck.slides.length}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Brand Color</p>
                <div className="flex items-center gap-2 mt-1">
                  <div
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: deck.brandColor }}
                  />
                  <span className="font-mono text-xs">{deck.brandColor}</span>
                </div>
              </div>
              <div>
                <p className="text-muted-foreground">Created</p>
                <p className="font-semibold">{new Date(deck.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </Card>

          {/* Features Coming Soon */}
          <Card className="p-4 border-0 bg-yellow-50">
            <h3 className="font-semibold text-sm mb-2">Coming Soon</h3>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>✓ Edit slide content</li>
              <li>✓ Add/remove slides</li>
              <li>✓ PDF export</li>
              <li>✓ Slide animations</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
