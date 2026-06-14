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

## Phase 2 🔄 IN PROGRESS — Core CRM: Contacts Module

**Duration**: ~4-5 hours  
**Goal**: Full contact management with Excel/CSV import

### Tasks
- [ ] **Contacts List Page**
  - [ ] Table with columns: Name, Organization, Type/Role, Email, Phone, Tags, Last Contact, Status
  - [ ] Mock data: 20-30 sample contacts pre-loaded
  - [ ] Search bar (client-side filtering)
  - [ ] Filters: by type, tag, organization, status
  - [ ] Bulk actions: select multiple, tag, delete, add to campaign

- [ ] **Contact Detail Page**
  - [ ] Full contact info display
  - [ ] Editable fields
  - [ ] Notes section
  - [ ] Interaction timeline (mocked)
  - [ ] Linked organizations

- [ ] **Add/Edit Contact Form**
  - [ ] Fields: name, email, phone, LinkedIn profile, organization, type (founder/mentor/investor/sponsor/alumni/faculty/partner), tags, notes
  - [ ] Form validation
  - [ ] Submit to mock state

- [ ] **Delete Contact**
  - [ ] Confirmation dialog
  - [ ] Remove from mock state

- [ ] **Excel/CSV Import (Core Feature)**
  - [ ] File upload zone (drag-drop + click to upload)
  - [ ] Parse `.xlsx` and `.csv` files using `xlsx` library
  - [ ] Auto-detect column headers
  - [ ] Column mapping UI: show detected headers → user confirms or remaps to CRM fields
  - [ ] Preview mapped rows (first 5) before import
  - [ ] Deduplication: skip if email already exists
  - [ ] Import button → adds all contacts to mock state
  - [ ] Success message with count of imported contacts

### Technical Notes
- Use `xlsx` (SheetJS) library for file parsing
- Fuzzy matching for auto-detecting columns (e.g., "Full Name" → name, "Email Address" → email)
- Store all contacts in a React context or localStorage for now
- Implement mock CRUD operations

### Deliverable
- Fully functional contacts list with CRUD operations
- Excel import with column mapping UI
- Search and filter working
- Contact detail page showing all info
- Ready for Phase 3

---

## Phase 3 — Organizations Module

**Duration**: ~3 hours  
**Goal**: Company/organization management linked to contacts

### Tasks
- [ ] **Organizations List Page**
  - [ ] Table: Name, Type, Sector, # Contacts, Last Interaction, Status
  - [ ] Search and filters
  - [ ] 10-15 mock organizations pre-loaded

- [ ] **Organization Detail Page**
  - [ ] Full org info
  - [ ] Linked contacts list
  - [ ] Interaction history (mocked)
  - [ ] Linked meetings
  - [ ] Documents section

- [ ] **Company Dossier View**
  - [ ] All-in-one page: contacts, emails, meetings, tasks, documents
  - [ ] Scrollable sections

- [ ] **Add/Edit/Delete Organization**
  - [ ] Form with fields: name, type, sector, website, contact person, notes
  - [ ] Link existing contacts to org

### Deliverable
- Org list, detail page, dossier view
- Link contacts to organizations
- Full org CRUD

---

## Phase 4 — Outreach & Campaign UI

**Duration**: ~4 hours  
**Goal**: Email campaign creation and tracking UI (no real email sending yet)

### Tasks
- [ ] **Campaigns List Page**
  - [ ] Table: Name, Type, Status (Draft/Scheduled/Sent/Completed), Recipients, Sent, Opened, Replied
  - [ ] Mock campaign data

- [ ] **Campaign Creation Wizard**
  - [ ] Step 1: Campaign name, type (Sponsorship/Partnership/Mentor/Investor)
  - [ ] Step 2: Email template editor (rich text with `{{name}}`, `{{company}}` variables)
  - [ ] Step 3: Select contacts/segment (filter by tag, type, org)
  - [ ] Step 4: Preview personalized email per contact
  - [ ] Step 5: Schedule or send (mocked — just updates status)

- [ ] **Template Library**
  - [ ] Save, edit, duplicate email templates
  - [ ] Template preview

- [ ] **Campaign Detail Page**
  - [ ] List of recipients with status (Sent/Opened/Replied/Bounced) — mocked
  - [ ] Per-contact stats
  - [ ] Campaign stats chart

- [ ] **Communication Timeline**
  - [ ] Show campaign emails in contact timeline

### Deliverable
- End-to-end campaign creation flow
- Template editor
- Recipient list with mocked statuses
- Campaign tracking page

---

## Phase 5 — Meeting Management

**Duration**: ~3 hours  
**Goal**: Meeting scheduling and management UI

### Tasks
- [ ] **Meetings List Page**
  - [ ] Upcoming and past meetings
  - [ ] Filter by contact/org/date
  - [ ] Mock meeting data

- [ ] **Create Meeting Form**
  - [ ] Title, date/time, participants (pick from contacts)
  - [ ] Agenda, notes fields
  - [ ] Link to org and contacts

- [ ] **Meeting Detail Page**
  - [ ] Participants list
  - [ ] Agenda editor
  - [ ] Notes/MOM section (editable)
  - [ ] Recording upload placeholder
  - [ ] Linked tasks
  - [ ] Pre-meeting brief: summary of past interactions

- [ ] **Meeting Actions**
  - [ ] Edit, delete
  - [ ] Mark as completed

### Deliverable
- Meeting CRUD
- Participant management
- Notes/MOM editor
- Pre-meeting brief display

---

## Phase 6 — AI Placeholders (Transcription & MOM)

**Duration**: ~2 hours  
**Goal**: Build UI for AI features with mock responses

### Tasks
- [ ] **On Meeting Page**
  - [ ] "Transcribe Recording" button → shows mock transcript in collapsible panel
  - [ ] "Generate MOM" button → displays mock structured MOM:
    - Summary paragraph
    - Key Decisions (list)
    - Action Items (table with owner, deadline, status)
    - Next Steps

- [ ] **MOM Editing**
  - [ ] Inline editable sections

- [ ] **Auto-create Tasks**
  - [ ] Button to convert action items to tasks in mock task system

- [ ] **AI Assistant Sidebar**
  - [ ] Chat-like interface
  - [ ] Mock responses for:
    - "Draft email for [contact]"
    - "Research [company]"
    - "What should I do next with [contact]?"

- [ ] **Company Research**
  - [ ] "Research Company" button on org page → mock research brief

### Deliverable
- All AI UI flows navigable with mock responses
- Ready to swap in real API calls later

---

## Phase 7 — Task & Deliverable Tracking

**Duration**: ~3 hours  
**Goal**: Full task management system

### Tasks
- [ ] **Task List View**
  - [ ] Table: Title, Assignee, Linked Entity, Deadline, Status, Priority
  - [ ] Mock task data

- [ ] **Task Kanban Board**
  - [ ] To Do / In Progress / Done columns
  - [ ] Drag-drop between columns (mocked)

- [ ] **Create Task Manually**
  - [ ] Form: title, description, assignee (from contacts or team members), deadline, priority (High/Medium/Low), linked entity

- [ ] **Task from Meeting Action Items**
  - [ ] Auto-create tasks from MOM action items

- [ ] **Task Detail Page**
  - [ ] Edit fields
  - [ ] Add notes
  - [ ] View linked meeting/contact

- [ ] **Filters & Sorting**
  - [ ] By assignee, deadline, status, priority
  - [ ] Overdue highlighting
  - [ ] My Tasks widget on dashboard

### Deliverable
- Task list + kanban board
- Full task CRUD
- Overdue highlighting
- Dashboard "My Tasks" widget

---

## Phase 8 — Knowledge Base

**Duration**: ~2 hours  
**Goal**: Document repository with search and linking

### Tasks
- [ ] **Documents List Page**
  - [ ] Table: File name, Type, Linked Entity, Uploaded by, Date
  - [ ] Search by name and tag
  - [ ] Filter by entity type

- [ ] **Upload UI**
  - [ ] File picker (no actual upload yet, stores metadata in mock state)
  - [ ] Link to contact/org/meeting during upload

- [ ] **Document Detail**
  - [ ] Preview placeholder
  - [ ] Linked entities display
  - [ ] Download button (mocked)

- [ ] **Company Dossier Integration**
  - [ ] Documents section showing org's files

### Deliverable
- Document upload and search
- Linking to CRM entities
- File metadata tracking

---

## Phase 9 — Analytics Dashboard

**Duration**: ~3 hours  
**Goal**: Real-time-looking analytics with charts

### Tasks
- [ ] **Dashboard Widgets**
  - [ ] Outreach stats: emails sent, open rate, reply rate (bar/line chart with recharts)
  - [ ] Meetings this week/month (number card)
  - [ ] Tasks: completed vs overdue (progress bar)
  - [ ] Active campaigns count
  - [ ] Relationship health: % contacts contacted in last 30 days

- [ ] **Pipeline View**
  - [ ] Funnel chart: Prospecting → Pitched → Partner → Signed
  - [ ] Count of contacts in each stage

- [ ] **At-risk Relationships**
  - [ ] Table: contacts with 60+ days no interaction
  - [ ] Suggest next action links

- [ ] **Team Productivity**
  - [ ] Per-user stats (mocked)

### Deliverable
- Full analytics dashboard
- Multiple chart types
- Relationship health metrics
- Pipeline funnel view

---

## Phase 10 — Pitch Deck Generator UI

**Duration**: ~3 hours  
**Goal**: Deck generation wizard with brand personalization

### Tasks
- [ ] **Deck Templates List**
  - [ ] 4 templates: Sponsorship, Partnership, Mentor, Investor
  - [ ] Template preview cards

- [ ] **Deck Creation Wizard**
  - [ ] Step 1: Select template
  - [ ] Step 2: Select target company (from CRM)
  - [ ] Step 3: AI fills preview slots with mocked company-specific text
  - [ ] Step 4: Brand input (hex color picker + logo upload placeholder)
  - [ ] Step 5: Slide-by-slide preview

- [ ] **Export**
  - [ ] Download as PDF button (mocked — placeholder file)

### Deliverable
- Complete deck generation wizard
- Template and company selection
- Brand color/logo inputs
- Preview and export flows

---

## Phase 11 — Notifications & Collaboration

**Duration**: ~2 hours  
**Goal**: In-app notifications and activity feed

### Tasks
- [ ] **Notification Bell**
  - [ ] Dropdown with notification list
  - [ ] Types: meeting reminder, task overdue, campaign reply, follow-up due
  - [ ] Mock notifications pre-loaded
  - [ ] Mark as read, clear all actions

- [ ] **Activity Feed**
  - [ ] On dashboard: recent team actions
  - [ ] "Added contact", "Sent campaign", "Created meeting", etc. (mocked)

- [ ] **Real-time Indicators (UI Only)**
  - [ ] Unread badge on notification bell

### Deliverable
- Working notification UI
- Activity feed
- Mock notification data

---

## Phase 12 — Admin Panel & RBAC UI

**Duration**: ~2 hours  
**Goal**: Admin settings and user management interface

### Tasks
- [ ] **Admin Panel (Route-guarded)**
  - [ ] User list with roles
  - [ ] Invite user button (mocked form)
  - [ ] Assign role dropdown (Admin/Manager/Member/Viewer)

- [ ] **Audit Log**
  - [ ] Table: User, Action, Entity, Timestamp (mocked entries)

- [ ] **Integration Settings Page**
  - [ ] Placeholder fields for: Supabase API key, Resend API key, OpenAI key, Anthropic key
  - [ ] Status indicators (not connected)

- [ ] **Template Management**
  - [ ] View all email templates
  - [ ] Edit, delete, create new (admin only)

- [ ] **General Settings**
  - [ ] Org name, logo upload, timezone
  - [ ] Save button (mocked)

### Deliverable
- Full admin UI
- User management interface
- Audit log viewer
- Integration settings ready for real keys

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
- **✅ Phase 1**: Completed
- **🔄 Phase 2**: In progress (Contacts module + Excel import)
- **⏳ Phases 3-12**: Queued
- **📅 Phases 13+**: Post-launch

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
