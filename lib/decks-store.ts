export type DeckTemplate = "sponsorship" | "partnership" | "mentor" | "investor";
export type DeckStatus = "draft" | "finalized" | "presented";

export interface DeckSlide {
  id: string;
  title: string;
  content: string;
  layout: "title" | "content" | "two-column" | "image";
}

export interface Deck {
  id: string;
  name: string;
  template: DeckTemplate;
  targetCompanyId: string;
  targetCompanyName: string;
  status: DeckStatus;
  slides: DeckSlide[];
  brandColor: string;
  brandLogo?: string;
  createdAt: string;
  updatedAt: string;
}

// Template definitions
export const DECK_TEMPLATES: Record<DeckTemplate, { name: string; description: string; slideCount: number }> = {
  sponsorship: {
    name: "Sponsorship Proposal",
    description: "Perfect for pitching sponsorship opportunities for PIEDS Ignite",
    slideCount: 8,
  },
  partnership: {
    name: "Partnership Opportunity",
    description: "Propose strategic partnerships and collaborations",
    slideCount: 10,
  },
  mentor: {
    name: "Mentorship Program",
    description: "Present mentorship and advisory opportunities",
    slideCount: 7,
  },
  investor: {
    name: "Investment Pitch",
    description: "Pitch for investor funding and support",
    slideCount: 12,
  },
};

// Mock slide templates
const SLIDE_TEMPLATES: Record<DeckTemplate, DeckSlide[]> = {
  sponsorship: [
    {
      id: "s1",
      title: "Title Slide",
      content: "PIEDS Ignite 2026\nSponsorship Opportunity",
      layout: "title",
    },
    {
      id: "s2",
      title: "About PIEDS",
      content: "Annual tech fest for BITS Pilani students. 5000+ attendees, 50+ companies, cutting-edge tech talks.",
      layout: "content",
    },
    {
      id: "s3",
      title: "Event Highlights",
      content: "• 3-day event with 50+ tech talks\n• 30+ company booths\n• Hackathon with $10K prize pool\n• Networking sessions",
      layout: "content",
    },
    {
      id: "s4",
      title: "Sponsor Benefits",
      content: "• Brand visibility to 5000+ students\n• Talent acquisition opportunities\n• Product demos & workshops\n• Custom branding",
      layout: "content",
    },
    {
      id: "s5",
      title: "Sponsorship Tiers",
      content: "Platinum: $50K | Gold: $25K | Silver: $10K | Bronze: $5K",
      layout: "content",
    },
    {
      id: "s6",
      title: "Previous Sponsors",
      content: "Microsoft • Google • Amazon • Meta • Adobe • Cisco",
      layout: "content",
    },
    {
      id: "s7",
      title: "Key Metrics",
      content: "• 5000+ attendees from 20+ colleges\n• 500+ industry professionals\n• 2M+ social media reach\n• 95% attendee satisfaction",
      layout: "content",
    },
    {
      id: "s8",
      title: "Contact & Next Steps",
      content: "PIEDS Sponsorship Team\nsponsorship@pieds.bits\nLet's build something amazing together!",
      layout: "title",
    },
  ],
  partnership: [
    {
      id: "s1",
      title: "Partnership Opportunity",
      content: "PIEDS Ignite Strategic Partnership",
      layout: "title",
    },
    {
      id: "s2",
      title: "About PIEDS Ignite",
      content: "India's largest student-run tech festival. Founded 2016. 5000+ attendees annually.",
      layout: "content",
    },
    {
      id: "s3",
      title: "Partnership Vision",
      content: "Build lasting relationships with industry leaders to foster innovation and learning.",
      layout: "content",
    },
    {
      id: "s4",
      title: "What We Offer",
      content: "• Co-branded events and workshops\n• Joint technical sessions\n• Product showcases\n• Talent pipeline access",
      layout: "content",
    },
    {
      id: "s5",
      title: "Partnership Models",
      content: "• Title Partnership\n• Category Partnership\n• Exclusive Technical Partner\n• Innovation Lab Partner",
      layout: "content",
    },
    {
      id: "s6",
      title: "Success Stories",
      content: "Previous partnerships led to 100+ internship offers and 50+ job placements.",
      layout: "content",
    },
    {
      id: "s7",
      title: "Your Brand Benefits",
      content: "• Visibility to 5000+ tech talent\n• Premium event positioning\n• Custom activations\n• Long-term association",
      layout: "content",
    },
    {
      id: "s8",
      title: "Market Impact",
      content: "2M+ social reach | 95% brand recall | 10000+ website visits",
      layout: "content",
    },
    {
      id: "s9",
      title: "Let's Collaborate",
      content: "Unique opportunities for mutual growth and innovation.",
      layout: "content",
    },
    {
      id: "s10",
      title: "Contact Us",
      content: "partnership@pieds.bits\nLooking forward to partnering with you!",
      layout: "title",
    },
  ],
  mentor: [
    {
      id: "s1",
      title: "Mentorship Opportunity",
      content: "Be a Mentor at PIEDS Ignite 2026",
      layout: "title",
    },
    {
      id: "s2",
      title: "Why Mentor?",
      content: "• Shape the next generation of tech leaders\n• Share your expertise\n• Build your personal brand\n• Network with peers",
      layout: "content",
    },
    {
      id: "s3",
      title: "Mentorship Program",
      content: "1-on-1 guidance | Technical workshops | Career mentoring | Skill development",
      layout: "content",
    },
    {
      id: "s4",
      title: "Who We Mentor",
      content: "1000+ students from 20+ colleges seeking guidance in tech careers and entrepreneurship.",
      layout: "content",
    },
    {
      id: "s5",
      title: "Your Impact",
      content: "• Guide 5-10 mentees\n• Share industry insights\n• Help shape careers\n• Build meaningful relationships",
      layout: "content",
    },
    {
      id: "s6",
      title: "Program Details",
      content: "3-month engagement | 2-3 hours/month | Flexible schedule | Full support provided",
      layout: "content",
    },
    {
      id: "s7",
      title: "Join Our Mentor Network",
      content: "mentor@pieds.bits | Apply today!",
      layout: "title",
    },
  ],
  investor: [
    {
      id: "s1",
      title: "PIEDS Ignite Investment Pitch",
      content: "Building India's Premier Tech Fest",
      layout: "title",
    },
    {
      id: "s2",
      title: "The Problem",
      content: "Gap between education and industry needs. Students lack exposure to cutting-edge tech and industry professionals.",
      layout: "content",
    },
    {
      id: "s3",
      title: "Our Solution",
      content: "PIEDS Ignite: Connecting students with industry leaders through tech talks, workshops, and mentoring.",
      layout: "content",
    },
    {
      id: "s4",
      title: "Market Opportunity",
      content: "50M+ college students in India. Growing tech talent shortage. $2B+ ed-tech market.",
      layout: "content",
    },
    {
      id: "s5",
      title: "Traction & Growth",
      content: "2016-2026: 50K+ attendees | 200+ companies partnered | $5M+ in partnerships | 95% NPS",
      layout: "content",
    },
    {
      id: "s6",
      title: "Business Model",
      content: "Sponsorships | Partnerships | Workshops | Premium content | Job board",
      layout: "content",
    },
    {
      id: "s7",
      title: "Revenue Projections",
      content: "Year 1: $500K | Year 2: $1.5M | Year 3: $3M",
      layout: "content",
    },
    {
      id: "s8",
      title: "Use of Funds",
      content: "Tech infrastructure: 40% | Marketing: 30% | Team: 20% | Operations: 10%",
      layout: "content",
    },
    {
      id: "s9",
      title: "Team",
      content: "Experienced founders with 15+ years in edtech and event management.",
      layout: "content",
    },
    {
      id: "s10",
      title: "Why Invest",
      content: "Growing market | Proven track record | Experienced team | Clear path to profitability",
      layout: "content",
    },
    {
      id: "s11",
      title: "Investment Ask",
      content: "$500K Series A for expansion and team growth",
      layout: "content",
    },
    {
      id: "s12",
      title: "Let's Change Education",
      content: "invest@pieds.bits\nJoin us in transforming tech education in India!",
      layout: "title",
    },
  ],
};

const DECKS_STORAGE_KEY = "pieds_decks";

export function getDecks(): Deck[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(DECKS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveDeck(deck: Deck): void {
  if (typeof window === "undefined") return;
  const decks = getDecks();
  const index = decks.findIndex((d) => d.id === deck.id);
  if (index >= 0) {
    decks[index] = deck;
  } else {
    decks.push(deck);
  }
  localStorage.setItem(DECKS_STORAGE_KEY, JSON.stringify(decks));
}

export function getDeckById(id: string): Deck | null {
  const decks = getDecks();
  return decks.find((d) => d.id === id) || null;
}

export function createDeck(
  name: string,
  template: DeckTemplate,
  companyId: string,
  companyName: string,
  brandColor: string
): Deck {
  const deck: Deck = {
    id: `deck-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    template,
    targetCompanyId: companyId,
    targetCompanyName: companyName,
    status: "draft",
    slides: SLIDE_TEMPLATES[template],
    brandColor,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  saveDeck(deck);
  return deck;
}

export function updateDeckSlide(deckId: string, slideId: string, updates: Partial<DeckSlide>): void {
  const deck = getDeckById(deckId);
  if (deck) {
    const slide = deck.slides.find((s) => s.id === slideId);
    if (slide) {
      Object.assign(slide, updates);
      deck.updatedAt = new Date().toISOString();
      saveDeck(deck);
    }
  }
}

export function updateDeckStatus(deckId: string, status: DeckStatus): void {
  const deck = getDeckById(deckId);
  if (deck) {
    deck.status = status;
    deck.updatedAt = new Date().toISOString();
    saveDeck(deck);
  }
}

export function deleteDeck(id: string): void {
  if (typeof window === "undefined") return;
  const decks = getDecks();
  const filtered = decks.filter((d) => d.id !== id);
  localStorage.setItem(DECKS_STORAGE_KEY, JSON.stringify(filtered));
}
