export interface TranscriptSegment {
  timestamp: string;
  speaker: string;
  text: string;
}

export interface ResearchBrief {
  companyName: string;
  overview: string;
  industryInsights: string[];
  partnershipOpportunities: string[];
  recentNews: string[];
  generatedAt: string;
}

export function generateMockTranscript(meetingTitle: string): TranscriptSegment[] {
  return [
    {
      timestamp: "00:00",
      speaker: "Meeting Host",
      text: `Welcome everyone to the ${meetingTitle} discussion. Let's start by reviewing our agenda for today.`,
    },
    {
      timestamp: "00:30",
      speaker: "Participant 1",
      text: "Thank you for organizing this. I'd like to discuss the budget allocation first. We need to ensure funds are distributed efficiently.",
    },
    {
      timestamp: "01:15",
      speaker: "Participant 2",
      text: "I agree. Additionally, we should consider the timeline for implementation. A phased approach might work better.",
    },
    {
      timestamp: "02:00",
      speaker: "Meeting Host",
      text: "Good points. Let's break this down into quarters and assign owners for each phase.",
    },
    {
      timestamp: "03:30",
      speaker: "Participant 1",
      text: "I can take ownership of the Q3 phase. We'll need support from the technical team though.",
    },
    {
      timestamp: "04:15",
      speaker: "Participant 2",
      text: "The tech team is ready. We should have the initial proposal ready by next week.",
    },
    {
      timestamp: "05:00",
      speaker: "Meeting Host",
      text: "Perfect. Let's confirm the next steps and schedule a follow-up for next week.",
    },
  ];
}

export function generateMockCompanyResearch(companyName: string): ResearchBrief {
  return {
    companyName,
    overview: `${companyName} is a leading innovator in the technology sector with a strong presence in emerging markets. Known for fostering partnerships with tech communities and supporting innovation initiatives, they align well with events focused on technological advancement and entrepreneurship.`,
    industryInsights: [
      "Strong focus on AI and machine learning applications across products",
      "Expanding presence in emerging markets, particularly in Asia and Africa",
      "Heavy investment in developer ecosystem and community engagement",
      "Moving towards sustainable and green technology initiatives",
      "Increased funding for startup acceleration programs",
    ],
    partnershipOpportunities: [
      "Co-sponsor innovation workshops and hackathons",
      "Joint mentorship programs for student entrepreneurs",
      "Technology platform integration and API partnerships",
      "Talent acquisition and campus hiring initiatives",
      "Research collaboration on emerging technologies",
    ],
    recentNews: [
      `${companyName} announces $500M investment in AI research`,
      `Partnership with leading universities on tech education`,
      `Launches new developer program with enhanced benefits`,
      `Wins award for corporate social responsibility`,
      `Expands operations to 15 new countries`,
    ],
    generatedAt: new Date().toISOString(),
  };
}

export function generateMockAIResponse(prompt: string): string {
  const responses: Record<string, string> = {
    draft_email: `Dear [Contact Name],

I hope this message finds you well. We're excited to present an exciting partnership opportunity with our upcoming tech event. Your organization's commitment to innovation aligns perfectly with our vision.

We believe this collaboration would be mutually beneficial and would love to discuss how we can work together to create an impactful experience.

Would you be available for a call next week?

Best regards,
[Your Name]`,

    create_agenda: `1. Welcome & Introductions (5 mins)
2. Event Overview & Objectives (10 mins)
3. Partnership Benefits & Opportunities (15 mins)
4. Budget & Sponsorship Tiers (10 mins)
5. Timeline & Deliverables (10 mins)
6. Q&A and Discussion (15 mins)
7. Next Steps & Action Items (5 mins)`,

    summarize_notes: `The meeting covered key strategic initiatives for Q3 with focus on three main areas: technology integration, team expansion, and market outreach. All stakeholders agreed on the proposed timeline and budget allocation. Critical action items include finalizing partnerships and completing technical documentation.`,

    research_company: `Research data will be populated based on the selected company.`,
  };

  for (const [key, value] of Object.entries(responses)) {
    if (prompt.toLowerCase().includes(key.replace(/_/g, " "))) {
      return value;
    }
  }

  return "Thank you for your message. I'm processing your request and will provide a detailed response shortly.";
}
