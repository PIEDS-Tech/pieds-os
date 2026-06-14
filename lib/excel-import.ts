import * as XLSX from "xlsx";
import { Contact } from "./contacts-store";

// Common column name mappings for auto-detection
const COLUMN_MAPPINGS: Record<string, string[]> = {
  name: ["name", "full name", "fullname", "contact name", "contact", "person", "employee", "user"],
  email: ["email", "email address", "email_address", "e-mail", "contact email"],
  phone: ["phone", "phone number", "phone_number", "mobile", "mobile number", "tel", "telephone"],
  linkedin: ["linkedin", "linkedin url", "linkedin_url", "linkedin profile", "linkedin link"],
  organization: ["organization", "org", "company", "company name", "organization name", "business"],
  type: ["type", "contact type", "role", "position", "designation"],
  tags: ["tags", "tag", "category", "categories", "label", "labels"],
  notes: ["notes", "note", "description", "memo", "comment", "comments"],
  lastContact: ["last contact", "lastcontact", "last_contact", "last contacted", "last contacted date"],
  status: ["status", "contact status", "state"],
};

export interface ImportPreview {
  headers: string[];
  columnMappings: Record<string, string>; // { "name": "Full Name", ... }
  preview: Record<string, unknown>[]; // First 5 rows for display
  allData: Record<string, unknown>[]; // All rows for import
}

export interface ImportResult {
  success: boolean;
  imported: number;
  skipped: number;
  errors: string[];
}

/**
 * Fuzzy match a column header to a CRM field
 */
function fuzzyMatchColumn(header: string, crmField: string): boolean {
  const normalized = header.toLowerCase().trim();
  const mappings = COLUMN_MAPPINGS[crmField] || [];
  return mappings.some((m) => normalized.includes(m) || m.includes(normalized.split(/\s+/)[0]));
}

/**
 * Auto-detect column mappings
 */
function autoDetectMappings(headers: string[]): Record<string, string> {
  const mappings: Record<string, string> = {};
  const crmFields = Object.keys(COLUMN_MAPPINGS);
  const usedHeaders = new Set<string>();

  // For each CRM field, try to find a matching header
  for (const field of crmFields) {
    for (const header of headers) {
      if (usedHeaders.has(header)) continue;
      if (fuzzyMatchColumn(header, field)) {
        mappings[field] = header;
        usedHeaders.add(header);
        break;
      }
    }
  }

  return mappings;
}

/**
 * Parse Excel/CSV file and return preview
 */
export async function parseFile(file: File): Promise<ImportPreview | null> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert to JSON with first row as headers
    const data = XLSX.utils.sheet_to_json(sheet);
    if (data.length === 0) {
      return null;
    }

    const headers = Object.keys(data[0] as Record<string, unknown>);
    const mappings = autoDetectMappings(headers);
    const preview = data.slice(0, 5);

    return {
      headers,
      columnMappings: mappings,
      preview: preview as Record<string, unknown>[],
      allData: data as Record<string, unknown>[],
    };
  } catch (error) {
    console.error("Error parsing file:", error);
    return null;
  }
}

/**
 * Process imported data and create Contact objects
 */
export function processImportedData(
  data: Record<string, unknown>[],
  mappings: Record<string, string>
): (Omit<Contact, "id"> | null)[] {
  return data.map((row) => {
    try {
      const contact: Partial<Contact> = {
        name: (row[mappings.name] as string) || "",
        email: (row[mappings.email] as string) || "",
        phone: (row[mappings.phone] as string) || "",
        linkedin: (row[mappings.linkedin] as string) || "",
        organization: (row[mappings.organization] as string) || "",
        type: ((row[mappings.type] as string) || "mentor").toLowerCase() as Contact["type"],
        tags: ((row[mappings.tags] as string) || "").split(",").map((t) => t.trim()).filter(Boolean),
        notes: (row[mappings.notes] as string) || "",
        lastContact: new Date().toISOString().split("T")[0],
        status: "pending" as const,
      };

      // Validate required fields
      if (!contact.name || !contact.email) {
        return null;
      }

      return contact as Omit<Contact, "id">;
    } catch {
      return null;
    }
  });
}

/**
 * Normalize email for deduplication
 */
function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

/**
 * Validate emails
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Check for duplicates in import data
 */
export function findDuplicatesInData(
  data: (Omit<Contact, "id"> | null)[]
): { duplicates: number; valid: (Omit<Contact, "id">)[] } {
  const emailSet = new Set<string>();
  const valid: (Omit<Contact, "id">)[] = [];
  let duplicates = 0;

  data.forEach((contact) => {
    if (!contact) return;
    const normalizedEmail = normalizeEmail(contact.email);

    if (!isValidEmail(contact.email)) {
      duplicates++;
      return;
    }

    if (emailSet.has(normalizedEmail)) {
      duplicates++;
    } else {
      emailSet.add(normalizedEmail);
      valid.push(contact);
    }
  });

  return { duplicates, valid };
}
