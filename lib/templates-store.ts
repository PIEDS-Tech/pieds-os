// Generate unique ID
function generateUniqueId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string; // HTML content with {{name}}, {{company}}, {{email}} variables
  createdAt: string;
  updatedAt: string;
}

// Mock email templates
const mockTemplates: EmailTemplate[] = [
  {
    id: "1",
    name: "Sponsorship Proposal",
    subject: "Sponsorship Opportunity - BITS Pilani PIEDS",
    content: `<p>Dear {{name}},</p>
<p>We hope this email finds you well. We are reaching out to {{company}} with an exciting sponsorship opportunity for the BITS Pilani PIEDS technical festival.</p>
<p>Our event attracts over 5000+ participants and would be a great platform for {{company}} to showcase your brand and connect with talented engineers.</p>
<p>We would love to discuss various sponsorship packages that could align with your marketing goals.</p>
<p>Would you be available for a quick call next week?</p>
<p>Best regards,<br/>PIEDS Team</p>`,
    createdAt: "2026-05-01",
    updatedAt: "2026-05-01",
  },
  {
    id: "2",
    name: "Investor Pitch",
    subject: "Investment Opportunity - BITS Pilani PIEDS Innovation Hub",
    content: `<p>Hi {{name}},</p>
<p>We are excited to present an investment opportunity in the PIEDS Innovation Hub at {{company}}.</p>
<p>Our platform connects student entrepreneurs with mentors, investors, and industry leaders. Last year, we facilitated 50+ startup launches with an average funding of $2M.</p>
<p>We believe {{company}} would be an ideal investor given your focus on emerging tech startups.</p>
<p>Can we schedule a meeting to discuss the investment opportunity?</p>
<p>Looking forward to hearing from you.<br/>Regards,<br/>PIEDS Team</p>`,
    createdAt: "2026-05-05",
    updatedAt: "2026-05-05",
  },
  {
    id: "3",
    name: "Partnership Request",
    subject: "Partnership Proposal - BITS Pilani PIEDS",
    content: `<p>Hello {{name}},</p>
<p>We hope you are doing well. {{company}} has been a remarkable partner in the tech ecosystem, and we believe there's a great opportunity for collaboration.</p>
<p>We would like to explore a partnership that could benefit both our communities and create value for our respective stakeholders.</p>
<p>Could you spare some time next week for a discussion?</p>
<p>Best,<br/>PIEDS Team</p>`,
    createdAt: "2026-05-10",
    updatedAt: "2026-05-10",
  },
];

// Storage key
const TEMPLATES_STORAGE_KEY = "pieds_templates";

// Get all templates
export function getTemplates(): EmailTemplate[] {
  if (typeof window === "undefined") return mockTemplates;
  const stored = localStorage.getItem(TEMPLATES_STORAGE_KEY);
  return stored ? JSON.parse(stored) : mockTemplates;
}

// Save templates to localStorage
export function saveTemplates(templates: EmailTemplate[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates));
}

// Initialize localStorage with mock data
export function initializeTemplates(): void {
  if (typeof window === "undefined") return;
  if (!localStorage.getItem(TEMPLATES_STORAGE_KEY)) {
    saveTemplates(mockTemplates);
  }
}

// Add template
export function addTemplate(template: Omit<EmailTemplate, "id" | "createdAt" | "updatedAt">): EmailTemplate {
  const newTemplate: EmailTemplate = {
    ...template,
    id: generateUniqueId(),
    createdAt: new Date().toISOString().split("T")[0],
    updatedAt: new Date().toISOString().split("T")[0],
  };
  const templates = getTemplates();
  templates.push(newTemplate);
  saveTemplates(templates);
  return newTemplate;
}

// Update template
export function updateTemplate(id: string, updates: Partial<EmailTemplate>): EmailTemplate | null {
  const templates = getTemplates();
  const index = templates.findIndex((t) => t.id === id);
  if (index === -1) return null;
  templates[index] = {
    ...templates[index],
    ...updates,
    updatedAt: new Date().toISOString().split("T")[0],
  };
  saveTemplates(templates);
  return templates[index];
}

// Delete template
export function deleteTemplate(id: string): boolean {
  const templates = getTemplates();
  const index = templates.findIndex((t) => t.id === id);
  if (index === -1) return false;
  templates.splice(index, 1);
  saveTemplates(templates);
  return true;
}

// Get template by ID
export function getTemplateById(id: string): EmailTemplate | null {
  const templates = getTemplates();
  return templates.find((t) => t.id === id) || null;
}

// Duplicate template
export function duplicateTemplate(id: string, newName: string): EmailTemplate | null {
  const template = getTemplateById(id);
  if (!template) return null;

  return addTemplate({
    name: newName,
    subject: template.subject,
    content: template.content,
  });
}

// Preview template with variables replaced
export function previewTemplate(template: EmailTemplate, variables: Record<string, string>): { subject: string; content: string } {
  let subject = template.subject;
  let content = template.content;

  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, "g");
    subject = subject.replace(regex, value);
    content = content.replace(regex, value);
  });

  return { subject, content };
}

// Import template from file
export async function importTemplateFromFile(file: File, templateName: string): Promise<EmailTemplate | null> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;

        // For text files, wrap in <p> tags
        let htmlContent = content;
        if (file.type === "text/plain" || file.name.endsWith(".txt")) {
          // Convert plain text to HTML with paragraph breaks
          htmlContent = content
            .split("\n\n")
            .map((para) => `<p>${para.replace(/\n/g, "<br/>")}</p>`)
            .join("");
        }

        const newTemplate = addTemplate({
          name: templateName || file.name,
          subject: `Subject for ${templateName || file.name}`,
          content: htmlContent,
        });

        resolve(newTemplate);
      } catch (error) {
        console.error("Error importing file:", error);
        resolve(null);
      }
    };

    reader.onerror = () => {
      console.error("Error reading file");
      resolve(null);
    };

    reader.readAsText(file);
  });
}
