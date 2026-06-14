# PIEDS OS — Phase-Wise Development Plan

## Project Overview
**PIEDS OS** is a comprehensive CRM and operations platform for **BITS Pilani PIEDS Ignite** — a college technical event/initiative. The platform manages contacts, organizations, outreach campaigns, meetings with AI transcription, task tracking, knowledge management, analytics, and more.

**Tech Stack**: Next.js 16 + TypeScript + Tailwind CSS + shadcn/ui (Mock data until Phase 13+)

**Theme**: Dubai-inspired with red, gold, blue, and black colors. Modern fonts (Poppins + Sora). Event-focused branding.

---

## Phase 1 ✅ COMPLETE — Project Scaffold & Layout Shell

**Duration**: ~2 hours  
**Status**: ✅ Done

### Deliverables
- [x] Next.js 16 project scaffolded with TypeScript & Tailwind CSS
- [x] shadcn/ui components installed (sidebar, button, card, input, dropdown, avatar, badge, etc.)
- [x] Dubai-inspired color theme applied (red #E74C3C, gold #FFB84D, blue #00A8E8, navy #1a1a2e)
- [x] Modern fonts loaded (Poppins for headings, Sora for body)
- [x] Sidebar navigation with all 9 main sections (Dashboard, Contacts, Organizations, Outreach, Meetings, Tasks, Knowledge Base, Analytics, Settings)
- [x] Header with user avatar, notification bell, and logout menu
- [x] Dashboard page with stats cards, recent activity, and quick tasks
- [x] Mock authentication (localStorage-based login)
- [x] Client-side auth guard (LayoutClient component)
- [x] All page shells created and navigable
- [x] Login page with gradient background and "PIEDS IGNITE" branding
- [x] Dev server running at http://localhost:3000

### Key Features
- Fully responsive sidebar with active route highlighting
- Modern UI with gradient accents and smooth transitions
- No real APIs yet — all mock data
- Clean, non-AI-template aesthetic

### What's Next
→ **Phase 2: Core CRM — Contacts Module**

---

## Phase 2 ✅ COMPLETE — Core CRM: Contacts Module

**Duration**: ~4-5 hours  
**Status**: ✅ Done
**Goal**: Full contact management with Excel/CSV import

### Deliverables
- [x] **Contacts List Page** — Table with Name, Organization, Role, Email, Phone, Tags, Last Contact, Status
- [x] **Search & Filters** — Client-side filtering by type, tag, organization, status
- [x] **Bulk Actions** — Multi-select with drag-to-select, tag, delete, campaign assignment
- [x] **Contact Detail Page** — Full info, editable fields, notes, interaction timeline
- [x] **Add/Edit Forms** — Complete contact CRUD operations
- [x] **Excel/CSV Import** — SheetJS integration with auto-column detection, mapping UI, preview, deduplication
- [x] **Mock Data** — 20-30 sample contacts pre-loaded and persisted to localStorage

### Key Features
- Full CRUD operations with localStorage persistence
- Advanced Excel import with column auto-detection and manual mapping
- Drag-to-select multi-item selection pattern
- Interaction timeline and contact history tracking

---

## Phase 3 ✅ COMPLETE — Organizations Module

**Duration**: ~3 hours  
**Status**: ✅ Done

### Deliverables
- [x] Organizations list with filtering and search
- [x] Organization detail and dossier view
- [x] Full org CRUD operations
- [x] Link contacts to organizations
- [x] Auto-linking feature: fuzzy match contacts by organization name
- [x] Auto-creation: creates missing organizations during contact import
- [x] Mock data with 10-15 sample organizations

---

## Phase 4 ✅ COMPLETE — Outreach & Campaign UI

**Duration**: ~4 hours  
**Status**: ✅ Done

### Deliverables
- [x] Campaign list with status tracking (Draft/Scheduled/Sent/Completed)
- [x] Campaign creation wizard (5-step flow)
- [x] Email template editor with rich text and variable interpolation (`{{name}}`, `{{company}}`)
- [x] Template library with save, edit, duplicate
- [x] Recipient list with per-contact status (Sent/Opened/Replied/Bounced)
- [x] Campaign detail page with stats and communication timeline
- [x] Mock email statistics and delivery tracking

---

## Phase 5 ✅ COMPLETE — Meeting Management

**Duration**: ~3 hours  
**Status**: ✅ Done

### Deliverables
- [x] Meeting list with filtering (upcoming/past, by contact/org/date)
- [x] Create meeting form with participants, agenda, notes
- [x] Meeting detail page with participants, agenda, MOM editor
- [x] Recording upload placeholder
- [x] Linked tasks and pre-meeting brief
- [x] Full meeting CRUD operations with localStorage persistence

---

## Phase 6 ✅ COMPLETE (Mock Only) — AI Placeholders (Transcription & MOM)

**Duration**: ~2 hours  
**Status**: ✅ UI Done, Awaiting Real API Integration (Phase 13)

### Deliverables (UI Ready)
- [x] "Transcribe Recording" button on meeting page (mock transcript)
- [x] "Generate MOM" button with structured output (summary, decisions, action items, next steps)
- [x] MOM editing with inline editable sections
- [x] Auto-create Tasks from action items with unique ID markers
- [x] AI Assistant sidebar (UI ready)
- [x] Company Research button on org page (UI ready)

### Status
- UI flows complete with mock responses
- Ready to integrate real APIs:
  - Whisper API for transcription
  - Claude API for MOM generation and AI assistant
  - Company research data sources

---

## Phase 7 ✅ COMPLETE — Task & Deliverable Tracking

**Duration**: ~3 hours  
**Status**: ✅ Done

### Deliverables
- [x] Task list view with filtering (by assignee, deadline, status, priority)
- [x] Kanban board view (To Do / In Progress / Done)
- [x] Full task CRUD operations
- [x] Create task manually or from meeting action items
- [x] Task detail page with linked meeting/contact
- [x] Overdue highlighting
- [x] Dashboard "My Tasks" widget

### Key Features
- **MOM-Tasks Sync**: Bidirectional sync between meeting action items and tasks
  - Action items include unique ID markers `[ACTION_ITEM_ID:xxx]` in task notes
  - Meeting detail shows which action items are converted to tasks (green background)
  - Task detail displays MOM source information with extracted action item details

---

## Phase 8 ✅ COMPLETE — Knowledge Base

**Duration**: ~2 hours  
**Status**: ✅ Done

### Deliverables
- [x] Document grid layout (3 cols lg, 2 cols md, 1 col sm)
- [x] Search by name, description, tags
- [x] Filter by type and tags
- [x] Document upload UI with file picker
- [x] Link documents to contacts, organizations, meetings
- [x] Document detail page with linked entities
- [x] Drag-to-select for bulk operations
- [x] Mock data with 5 sample documents

---

## Phase 9 ✅ COMPLETE — Analytics Dashboard

**Duration**: ~3 hours  
**Status**: ✅ Done

### Deliverables
- [x] KPI cards: emails sent, open rate, reply rate, tasks completed
- [x] Line chart: Outreach performance (6 weeks)
- [x] Bar chart: Task completion trend (weekly)
- [x] Pie chart: Task status distribution
- [x] Funnel chart: Sales pipeline visualization
- [x] At-risk contacts section (60+ days no contact)
- [x] Team productivity stats with per-member metrics
- [x] Recharts integration with responsive containers
- [x] Real-time-looking mock data

---

## Phase 10 ✅ COMPLETE — Pitch Deck Generator

**Duration**: ~3 hours  
**Status**: ✅ Done

### Deliverables
- [x] Deck templates: Sponsorship (8), Partnership (10), Mentor (7), Investor (12) slides
- [x] Deck creation wizard (4-step flow)
  - Step 1: Deck name input
  - Step 2: Template selection with visual cards
  - Step 3: Company selection from CRM with search
  - Step 4: Brand color customization with color picker
- [x] Full-screen slide viewer with previous/next navigation
- [x] Slide thumbnail list for quick navigation
- [x] Status selector (Draft/Finalized/Presented)
- [x] Export as JSON (placeholder for PDF)
- [x] Deck info sidebar with metadata

---

## Phase 11 ✅ COMPLETE — Notifications & Collaboration

**Duration**: ~2 hours  
**Status**: ✅ Done

### Deliverables
- [x] Notification bell with dropdown menu
- [x] Unread badge showing count (up to 9+)
- [x] Notification list with mark-as-read and delete buttons
- [x] Activity feed on dashboard with recent team actions
- [x] Notification types: meeting reminder, task overdue, campaign reply, follow-up due
- [x] Mark as read, mark all as read, delete individual notifications
- [x] Real-time mock notification data

---

## Phase 12 ✅ COMPLETE — Admin Panel & RBAC UI

**Duration**: ~2 hours  
**Status**: ✅ Done

### Deliverables
- [x] Admin dashboard overview with 4 sections
- [x] User Management: team member list with roles, invite new users, role assignment
- [x] Audit Logs: searchable, filterable log table with pagination
  - Filter by action type and resource type
  - Search by actor and changes
  - Columns: timestamp, actor, action, resource, changes, IP address
- [x] Integrations: configuration cards for Supabase, Resend, OpenAI, Anthropic
  - Toggle to show/hide sensitive values
  - Status indicator (Configured/Not Configured)
  - Security best practices notice
- [x] App Settings: organization info, email address, timezone selector, system info
- [x] 4 user roles: Admin, Manager, Member, Viewer with permission descriptions
- [x] Mock team users: You (Admin), Alice Johnson (Manager), Bob Smith (Member), Carol White (Member)
- [x] Mock audit log entries showing all action types

---

## Phase 13+ — API Integration (Future)

Once all 12 UI phases are complete and user flows are validated:

| Phase | Integration | Action |
|-------|-------------|--------|
| 13 | Supabase Auth | Replace mock login with email/magic link auth |
| 14 | Supabase DB | Replace mock JSON state with real DB queries |
| 15 | Resend Email | Wire campaign "Send" to real email API |
| 16 | Email Tracking | Webhook handler for opens/clicks/replies |
| 17 | Whisper API | Wire "Transcribe" button to audio transcription |
| 18 | Claude/GPT-4o | Wire "Generate MOM" and AI assistant to LLMs |
| 19 | Supabase Storage | Wire file uploads to real storage |
| 20 | Cron/Vercel Functions | Wire reminders and scheduled emails |
| 21 | Browser Extension | LinkedIn/Gmail/Meet integrations |

---

## Current Status
- **✅ Phases 1-12**: All UI phases COMPLETE with mock data
- **⏳ Phase 13+**: Real API integration (Pending)

---

## Design System Summary

### Colors
- **Primary** (Red): `#E74C3C` — CTAs, highlights, important items
- **Secondary** (Gold): `#FFB84D` — accents, warnings
- **Accent** (Blue): `#00A8E8` — secondary actions, info
- **Dark** (Navy): `#1a1a2e` — background, text
- **Light** (Off-white): `#F8F7F5` — card backgrounds
- **Muted**: `#E8E7E5` — borders, disabled states

### Typography
- **Headings**: Poppins (700 weight for impact)
- **Body**: Sora (clean, modern, readable)
- **Mono**: Geist Mono (code, data)

### Components
- **Sidebar**: Dark navy with red active states
- **Cards**: White background, subtle shadows, rounded corners
- **Buttons**: Gradient red-to-orange for primary, outlined for secondary
- **Forms**: Minimal borders, clear labels
- **Charts**: Recharts with custom color palette

---

## Development Notes
- **Mock Data**: All data stored in React state/localStorage until Phase 13
- **No Real APIs**: Email, auth, AI, storage all mocked
- **Client-side Only**: No backend server setup needed for Phases 1-12
- **Responsive**: Mobile-first design for all pages
- **Accessibility**: ARIA labels, keyboard navigation, semantic HTML

---

## How to Navigate
Each phase builds on the previous one. Complete the UI for each phase before moving to the next. Once all phases are done, we integrate real APIs phase by phase without breaking existing features.

**Ready to start Phase 2? Let's build the Contacts module!**
