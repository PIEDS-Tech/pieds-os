# PIEDS OS — Project Context & Decisions

## Project Overview

**PIEDS OS** is a comprehensive CRM and operations platform for **BITS Pilani PIEDS Ignite** — a technical fest/initiative at BITS Pilani.

**Purpose**: Manage contacts, organizations, outreach campaigns, meetings (with AI transcription), task tracking, knowledge management, analytics, and pitch deck generation for event sponsorship and partnerships.

**Status**: ✅ UI Complete (All 12 phases done) | ⏳ API Integration pending

---

## Key Technical Decisions

### Stack Choice
- **Frontend**: Next.js 16 App Router (latest at project start)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Data Visualization**: Recharts for charts
- **File Parsing**: SheetJS (xlsx) for Excel/CSV import
- **Deployment**: Vercel (pieds-os.vercel.app)

**Why This Stack?**
- Next.js App Router: Modern, performant, excellent DX
- TypeScript: Type safety and better IDE support
- shadcn/ui: Beautiful, accessible components that work out of the box
- Tailwind: Utility-first CSS with customizable theme
- Recharts: Lightweight, React-native charting library

### UI-First Approach (Phase 1-12)
**Decision**: Build complete UI with mock data first, integrate real APIs later

**Why?**
- Validate UX before investing in backend infrastructure
- Easier to iterate on user flows
- Clear contract between frontend and APIs
- Faster initial feedback loop
- Risk: UI might not match final data structure (mitigated by careful store design)

### Data Storage Strategy (Current)
- **Phase 1-12**: localStorage with mock data
- **Phase 13+**: Supabase PostgreSQL with Supabase client SDK
- **Pattern**: Data stores in `lib/*-store.ts` act as both mock state and future DB layer

**Key Store Files**:
- `lib/contacts-store.ts` — Contacts with full CRUD
- `lib/organizations-store.ts` — Organizations with linking
- `lib/outreach-store.ts` — Campaigns and email templates
- `lib/meetings-store.ts` — Meetings, agenda, notes, MOM
- `lib/tasks-store.ts` — Tasks with Kanban board state
- `lib/knowledge-base-store.ts` — Documents
- `lib/decks-store.ts` — Pitch decks and templates
- `lib/notifications-store.ts` — Notifications and activity feed
- `lib/admin-store.ts` — Team users, audit logs, settings
- `lib/analytics-store.ts` — Mocked KPIs and charts

### Theme & Design

**Dubai-Inspired Color Palette** (Event/Premium look):
```
Primary Red:    #E74C3C  (CTAs, highlights, urgency)
Gold:           #FFB84D  (Accents, premium feel)
Blue:           #00A8E8  (Secondary, info, calm)
Navy:           #1a1a2e  (Backgrounds, text depth)
Off-white:      #F8F7F5  (Card backgrounds)
```

**Typography**:
- Headings: Poppins (bold, impactful)
- Body: Sora (clean, modern, readable)
- Mono: Geist Mono (code, data)

**Design Philosophy**:
- Modern, not "AI-template" aesthetic
- Event/sponsor-focused branding
- High contrast for readability
- Smooth transitions and micro-interactions
- Mobile-first responsive design

### Routing Strategy

**Decision**: Centralized routing via `lib/routes.ts`

```typescript
// Example usage:
ROUTES.CONTACTS.ROOT        // /contacts
ROUTES.CONTACTS.DETAIL(id)  // /contacts/:id
ROUTES.OUTREACH.TEMPLATES   // /outreach/templates
```

**Why?**
- Single source of truth for URLs
- Type-safe route generation
- Easier to refactor paths
- Prevents typos in navigation

---

## Architecture Patterns

### Mock Data Stores Pattern

Each feature has a store file that implements:
1. **Type Definitions** — TypeScript interfaces
2. **Mock Data** — localStorage-backed initial data
3. **CRUD Functions** — get, add, update, delete operations
4. **Storage Helpers** — localStorage persistence

```typescript
// Example pattern (from contacts-store.ts)
export interface Contact { /* ... */ }
const CONTACTS_KEY = "pieds_contacts";
const mockContacts: Contact[] = [ /* ... */ ];

export function getContacts(): Contact[] { /* ... */ }
export function addContact(contact: Contact): Contact { /* ... */ }
export function updateContact(id: string, updates: Partial<Contact>) { /* ... */ }
export function deleteContact(id: string) { /* ... */ }
```

**Future Migration**: Replace localStorage with Supabase client SDK while keeping the same function signatures.

### Component Organization

```
components/
├── ui/                    # shadcn/ui components
│   ├── card.tsx
│   ├── button.tsx
│   ├── input.tsx
│   └── ...
├── header.tsx             # Header with user menu
├── app-sidebar.tsx        # Navigation sidebar
├── notifications-dropdown.tsx
└── [feature-specific]/    # Feature components
```

**Pattern**: Keep components small, use composition, store logic in hooks and page components.

### Page Organization

```
app/
├── (auth)/login/          # Auth pages (outside main layout)
├── page.tsx               # Dashboard home
├── [section]/             # Feature sections
│   ├── page.tsx          # List/overview page
│   ├── new/page.tsx      # Create page
│   ├── [id]/page.tsx     # Detail page
│   └── [id]/edit/page.tsx # Edit page
```

**Pattern**: 
- List pages show overview and filtering
- Detail pages show full context
- New/edit pages use forms
- Use Promise-based dynamic params with `use()` hook

---

## Key Features & Implementations

### Excel/CSV Import (Phase 2)
**How it works**:
1. User uploads `.xlsx` or `.csv` file
2. SheetJS parses file and detects headers
3. Fuzzy matching auto-maps columns (e.g., "Full Name" → "name")
4. User can manually override mappings
5. Preview first 5 rows
6. On import, adds all contacts and de-duplicates by email

**Key Learning**: Fuzzy matching using simple string matching (contains, startsWith) works well for 80% of cases.

### Contact-Organization Auto-linking (Phase 3)
**Implementation**:
- When importing contacts, check if organization field has a name
- Fuzzy match against existing organizations
- If found, link contact to organization
- If not found, create new organization automatically
- Support manual override in UI

**Key Decision**: Auto-create organizations during import (user feedback validation)

### MOM-Tasks Bidirectional Sync (Phase 7)
**Implementation**:
1. MOM action items get unique ID markers: `[ACTION_ITEM_ID:unique-id]` in task notes
2. Meeting detail page shows which action items have been converted to tasks
3. Task detail page displays MOM source info (extracted from notes via regex)
4. Links are maintained even if task notes are edited (as long as ID marker persists)

**Pattern**: Store relationships in content via markers rather than separate database field (works well with localStorage).

### Drag-to-Select (Phase 2, 8)
**Implementation**:
- Track mouse down, mouse move, mouse up events
- Calculate bounding box of selected items
- Use intersection detection to determine selected items
- Support Shift+Click for range selection

### Fuzzy Matching (Contacts to Orgs)
**Simple algorithm**:
```typescript
const normalized1 = str1.toLowerCase().trim();
const normalized2 = str2.toLowerCase().trim();
// Check if one contains the other (after removing common words)
// Return confidence score 0-1
```

**Why simple?**: Avoids heavy dependencies, works for 80% of realistic cases.

---

## Deployment & Environment

### Vercel Deployment
**Project**: https://pieds-os.vercel.app

**Configuration**:
- Framework: Next.js 16
- Build command: `npm run build`
- Install command: `npm install`
- Output directory: `.next`

**Deployment Process**:
```bash
git push origin main          # Push to GitHub
vercel deploy --prod         # Deploy to production
```

**Build Output**:
- 27 static pages (prerendered)
- 6 dynamic routes (server-rendered on demand)
- Build time: ~30-40 seconds
- Deployment time: ~2 minutes

### Environment Variables (Future)
Will be needed for Phase 13+:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
VERCEL_CRON_SECRET=
```

---

## Code Conventions

### File Naming
- Components: PascalCase (`Header.tsx`, `ContactCard.tsx`)
- Pages: kebab-case in URLs, index named `page.tsx`
- Utilities: camelCase (`routes.ts`, `contacts-store.ts`)
- Types: suffix with `.ts` or inline in component

### Component Patterns
- **Page components**: Contain most logic, use `"use client"` for client-side features
- **UI components**: Pure, stateless, reusable (shadcn/ui)
- **Hooks**: Custom hooks for shared logic

### TypeScript
- Strict mode enabled
- No `any` types (use `unknown` or specific types)
- Export types explicitly: `export type Contact = { ... }`
- Use union types for status/enum-like fields

### Imports
- Absolute imports: `@/components/...`, `@/lib/...`
- No circular dependencies
- Import types with `import type`

---

## User Personas

### Primary User: Rishu Raj Gupta (Admin)
- **Role**: Founder/Admin of PIEDS Ignite
- **Needs**: Track sponsorships, manage team, organize events
- **Usage**: Daily, creates contacts, sends campaigns, tracks meetings
- **Technical Level**: Tech-savvy, comfortable with tools

### Secondary Users: Team Members
- **Roles**: Managers, coordinators, volunteers
- **Needs**: See assigned tasks, track contacts, attend meetings
- **Usage**: Regular, read-heavy with some write operations
- **Technical Level**: Varies

---

## Known Limitations & Future Work

### Current Limitations
1. **No real authentication**: Mock login via localStorage
2. **No database persistence**: All data lost on browser clear
3. **No email sending**: Campaigns show "sent" but no real emails
4. **No file storage**: Document upload is metadata only
5. **No AI features**: Transcription and MOM generation show mock data
6. **No real-time updates**: No websocket or polling
7. **Limited mobile optimization**: Desktop-first design
8. **No offline support**: Requires internet connection

### Intentional Deferred Features
- Real AI integration (Phase 13)
- API integration (Phase 14+)
- Mobile app
- Browser extensions
- Third-party integrations

---

## Testing Strategy

### Current Approach
- **Manual testing only** during development
- Test in browser at `http://localhost:3000`
- Verify all CRUD operations work
- Check responsive design on different screen sizes

### Future Testing (Phase 15+)
- Unit tests for store functions
- Integration tests for API calls
- E2E tests for critical user flows
- Performance testing

---

## Performance Considerations

### Current Optimizations
- Next.js 16 with Turbopack (fast build)
- CSS-in-JS (Tailwind) — no extra HTTP requests
- Code splitting by route
- shadcn/ui components are tree-shakeable
- Recharts lazy-loaded for analytics page

### Future Optimizations (Phase 15+)
- Image optimization for document previews
- API response caching
- Debounce search/filter operations
- Virtual scrolling for large lists
- Database query optimization

---

## Security Considerations

### Current State (Development)
- No authentication: assume trusted user
- No sensitive data: all mock
- No API keys stored: placeholder fields only

### Future (Phase 14+)
- Real authentication via Supabase
- API key management (encrypt at rest)
- Row-level security (RLS) in Supabase
- Rate limiting on API calls
- Input validation and sanitization
- CSRF protection

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 0.1.0 | Jun 15, 2026 | Initial launch: Phases 1-12 complete, deployed to Vercel |
| 0.0.1 | Jun 15, 2026 | Project scaffolding and phase planning |

---

## How to Continue This Project

### For the Next Developer
1. Read `PHASES.md` to understand what's built
2. Read `remaining-work.md` for what's left
3. Start with Phase 13 (Real AI Features)
4. Use store files as contracts for API integration
5. Keep the UI-first approach when adding new features

### Quick Start
```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Deploy to Vercel
vercel deploy --prod
```

### File Structure Map
- **UI Pages**: `app/*/page.tsx`
- **Components**: `components/`
- **Data Stores**: `lib/*-store.ts`
- **Routing**: `lib/routes.ts`
- **Styles**: Tailwind (in page components)
- **Config**: `next.config.ts`, `tailwind.config.ts`, `tsconfig.json`

### Key Files to Review
1. `lib/routes.ts` — Routing logic
2. `lib/contacts-store.ts` — Pattern for data stores
3. `app/page.tsx` — Dashboard and entry point
4. `components/header.tsx` — Header and user menu
5. `app/contacts/page.tsx` — Complex list view example

---

## Contact & Support

**Project Lead**: Rishu Raj Gupta (Admin)  
**Email**: rishu@pieds.bits  
**GitHub**: https://github.com/PIEDS-Tech/pieds-os  
**Live Site**: https://pieds-os.vercel.app

**For Developers**: See `CLAUDE.md` and `AGENTS.md` for development guidance.
