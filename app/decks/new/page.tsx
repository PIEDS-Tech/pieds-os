"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ChevronRight, ChevronLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getOrganizations } from "@/lib/organizations-store";
import { createDeck, DECK_TEMPLATES, type DeckTemplate } from "@/lib/decks-store";
import { ROUTES } from "@/lib/routes";

export default function NewDeckPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Step 1: Deck Name
  const [deckName, setDeckName] = useState("");

  // Step 2: Template Selection
  const [selectedTemplate, setSelectedTemplate] = useState<DeckTemplate | null>(null);

  // Step 3: Company Selection
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const [companies, setCompanies] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Step 4: Brand Customization
  const [brandColor, setBrandColor] = useState("#E74C3C");

  // Fetch companies when step 3 is reached
  const handleStepChange = (newStep: number) => {
    if (newStep === 3 && companies.length === 0) {
      const orgs = getOrganizations();
      setCompanies(orgs);
    }
    setStep(newStep);
  };

  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateDeck = () => {
    if (!deckName || !selectedTemplate || !selectedCompanyId || !brandColor) {
      alert("Please fill in all fields");
      return;
    }

    const company = companies.find((c) => c.id === selectedCompanyId);
    const deck = createDeck(deckName, selectedTemplate, selectedCompanyId, company.name, brandColor);
    router.push(`/decks/${deck.id}`);
  };

  const canProceed = () => {
    if (step === 1) return deckName.trim().length > 0;
    if (step === 2) return selectedTemplate !== null;
    if (step === 3) return selectedCompanyId !== "";
    return true;
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={ROUTES.DECKS?.ROOT || "/decks"}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Create New Deck</h1>
          <p className="text-muted-foreground mt-1">Step {step} of 4</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`h-2 flex-1 rounded-full ${
              s <= step ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>

      {/* Steps */}
      <div className="max-w-2xl">
        {/* Step 1: Deck Name */}
        {step === 1 && (
          <Card className="p-8 border-0">
            <h2 className="text-2xl font-semibold mb-2">What's your deck about?</h2>
            <p className="text-muted-foreground mb-6">Give your deck a descriptive name</p>

            <div>
              <label className="text-sm font-semibold block mb-2">Deck Name</label>
              <Input
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
                placeholder="e.g., Microsoft Sponsorship 2026"
                className="text-lg"
                autoFocus
              />
              <p className="text-xs text-muted-foreground mt-2">
                This will be the title of your presentation
              </p>
            </div>
          </Card>
        )}

        {/* Step 2: Template Selection */}
        {step === 2 && (
          <Card className="p-8 border-0">
            <h2 className="text-2xl font-semibold mb-2">Choose a template</h2>
            <p className="text-muted-foreground mb-6">Select the type of pitch deck</p>

            <div className="grid grid-cols-2 gap-4">
              {(["sponsorship", "partnership", "mentor", "investor"] as DeckTemplate[]).map(
                (template) => (
                  <div
                    key={template}
                    onClick={() => setSelectedTemplate(template)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedTemplate === template
                        ? "border-primary bg-blue-50"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <p className="text-2xl mb-2">
                      {template === "sponsorship" && "🤝"}
                      {template === "partnership" && "🔗"}
                      {template === "mentor" && "👨‍🏫"}
                      {template === "investor" && "💰"}
                    </p>
                    <h3 className="font-semibold">{DECK_TEMPLATES[template].name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {DECK_TEMPLATES[template].description}
                    </p>
                    <Badge className="mt-3 bg-primary/20 text-primary">
                      {DECK_TEMPLATES[template].slideCount} slides
                    </Badge>
                  </div>
                )
              )}
            </div>
          </Card>
        )}

        {/* Step 3: Company Selection */}
        {step === 3 && (
          <Card className="p-8 border-0">
            <h2 className="text-2xl font-semibold mb-2">Select target company</h2>
            <p className="text-muted-foreground mb-6">Who is this deck for?</p>

            <Input
              placeholder="Search companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-4"
            />

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredCompanies.length > 0 ? (
                filteredCompanies.map((company) => (
                  <div
                    key={company.id}
                    onClick={() => setSelectedCompanyId(company.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedCompanyId === company.id
                        ? "border-primary bg-blue-50"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <h3 className="font-semibold">{company.name}</h3>
                    <div className="flex gap-2 mt-2 text-xs text-muted-foreground">
                      <span>Type: {company.type}</span>
                      <span>•</span>
                      <span>Sector: {company.sector}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">No companies found</p>
              )}
            </div>
          </Card>
        )}

        {/* Step 4: Brand Customization */}
        {step === 4 && (
          <Card className="p-8 border-0">
            <h2 className="text-2xl font-semibold mb-2">Customize branding</h2>
            <p className="text-muted-foreground mb-6">Choose your brand colors</p>

            <div className="space-y-6">
              {/* Brand Color */}
              <div>
                <label className="text-sm font-semibold block mb-3">Brand Color</label>
                <div className="flex gap-4 items-center">
                  <input
                    type="color"
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    className="w-16 h-16 rounded-lg cursor-pointer border-0"
                  />
                  <div>
                    <p className="text-sm font-semibold">{brandColor}</p>
                    <p className="text-xs text-muted-foreground">Click to change</p>
                  </div>
                </div>
                <div
                  className="mt-4 p-8 rounded-lg text-white font-semibold text-center"
                  style={{ backgroundColor: brandColor }}
                >
                  Preview
                </div>
              </div>

              {/* Logo Upload Placeholder */}
              <div>
                <label className="text-sm font-semibold block mb-3">Logo (Coming Soon)</label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <p className="text-muted-foreground mb-3">Logo upload coming in a future update</p>
                  <Button disabled variant="outline">
                    Upload Logo
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-8">
          <Button
            onClick={() => setStep(Math.max(1, step - 1))}
            variant="outline"
            disabled={step === 1}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>

          {step < 4 ? (
            <Button
              onClick={() => handleStepChange(step + 1)}
              disabled={!canProceed()}
              className="flex-1 gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleCreateDeck}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Create Deck
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
