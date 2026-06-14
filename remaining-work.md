# PIEDS OS — Remaining Work & Requirements

## Summary

✅ **Complete**: 12 UI phases with full mock data  
⏳ **Pending**: Real API integration (Phases 13-19)

**Estimated Effort**: 
- Phase 13 (AI): 2-3 weeks
- Phases 14-19 (APIs): 4-6 weeks total
- **Total**: ~8-9 weeks for full production-ready system

---

## Phase 13 — Real AI Features

### Status: 🔲 NOT STARTED

### Requirements

#### A. Whisper API (Audio Transcription)

**What's Needed**:
- Implement audio file upload on meeting page
- Send audio to OpenAI Whisper API
- Display transcript in meeting page
- Cache transcript in Supabase for reuse

**Implementation Details**:
```typescript
// POST /api/meetings/:id/transcribe
// Body: { audioUrl: string, audioFile?: File }
// Response: { transcript: string, confidence: number }
```

**Key Decisions**:
- Use Whisper API v1 (OpenAI)
- Support audio formats: MP3, WAV, M4A, WebM (max 25MB)
- Store transcript in `meetings` table, `transcript` column

**Cost**: ~$0.006 per minute of audio

**Dependencies**:
- OpenAI API key
- Supabase storage for audio files (Phase 17)

---

#### B. Claude API (MOM Generation & AI Assistant)

**What's Needed**:
1. **MOM Generation**:
   - Input: Meeting transcript + participant list + agenda
   - Output: Structured MOM (summary, decisions, action items, next steps)
   - Store MOM in database

2. **AI Assistant Chat**:
   - Chat interface on sidebar
   - Functions it can perform:
     - Draft email for contact
     - Research company background
     - Suggest next actions for contact
     - Analyze meeting for action items
   - Maintain conversation history (in memory during session)

**Implementation Details**:
```typescript
// MOM Generation
// POST /api/meetings/:id/generate-mom
// Body: { transcript: string, participants: string[], agenda: string }
// Response: { mom: MOMStructure, actionItems: ActionItem[] }

// AI Assistant
// POST /api/ai/chat
// Body: { message: string, context?: object }
// Response: { response: string, actions?: Action[] }
```

**Prompt Engineering**:
- Use Claude 3.5 Sonnet (latest, balanced cost/performance)
- System prompt: "You are an AI assistant for a tech event CRM..."
- Context: Available contacts, organizations, meetings from user's account
- Response format: Structured JSON for actions, plain text for chat

**Key Decisions**:
- Use Anthropic API (Claude) over OpenAI (lower latency for India, better context handling)
- Single-turn responses for now (conversation history can be added later)
- Rate limit: 1 request per 2 seconds per user

**Cost**: ~$0.001-0.003 per request (Claude 3.5 Sonnet)

**Dependencies**:
- Anthropic API key
- Supabase to store MOM and conversation history
- Real meeting data (Phase 14)

---

#### C. Company Research

**What's Needed**:
- Button on organization detail page
- Fetch company data from external API
- Display research brief (funding, team, industry, etc.)

**Options**:
1. **Apollo.io API** — $0.10-0.25 per company lookup
   - Pros: Rich data, easy to integrate
   - Cons: Paid credits

2. **Google Search API** — Free tier available
   - Pros: Free, comprehensive
   - Cons: Limited results

3. **Crunchbase API** — $1000+/month
   - Pros: Very comprehensive
   - Cons: Expensive

**Recommendation**: Use Apollo.io with credit system

**Implementation**:
```typescript
// GET /api/research/:organizationId
// Response: { 
//   company_name, founding_year, industry, 
//   funding, employees, website, linkedin_url 
// }
```

**Cost**: $0.10-0.25 per lookup (prepaid credits)

**Dependencies**:
- Apollo.io API key and prepaid credits
- Organization data (Phase 14)

---

### Acceptance Criteria
- [ ] "Transcribe Recording" button works end-to-end with Whisper API
- [ ] "Generate MOM" button creates structured output with action items
- [ ] Action items can be auto-converted to tasks
- [ ] AI Assistant chat responds to user messages
- [ ] Company research fetches and displays real data
- [ ] All responses cached to avoid duplicate API calls
- [ ] Error handling for failed API calls

---

## Phase 14 — Authentication & Database

### Status: 🔲 NOT STARTED

### Requirements

#### A. Supabase Setup

**What's Needed**:
1. Create Supabase project (PostgreSQL database)
2. Create tables for all entities
3. Set up row-level security (RLS)
4. Enable authentication

**Tables to Create**:
```sql
-- Users & Auth
users (extends Supabase auth.users)
  ├── id (uuid, primary key, FK to auth.users.id)
  ├── email (text, unique)
  ├── full_name (text)
  ├── role (enum: admin, manager, member, viewer)
  ├── organization_id (uuid, FK)
  ├── created_at (timestamp)
  ├── updated_at (timestamp)

-- Contacts
contacts
  ├── id (uuid, primary key)
  ├── name (text, not null)
  ├── email (text, unique)
  ├── phone (text)
  ├── linkedin_url (text)
  ├── organization_id (uuid, FK)
  ├── type (enum: founder, mentor, investor, sponsor, alumni, faculty, partner)
  ├── tags (text[])
  ├── notes (text)
  ├── status (enum: active, inactive, blocked)
  ├── last_contact_date (date)
  ├── created_by (uuid, FK)
  ├── created_at (timestamp)
  ├── updated_at (timestamp)

-- Organizations
organizations
  ├── id (uuid, primary key)
  ├── name (text, not null, unique)
  ├── type (enum: startup, corporation, nonprofit, etc.)
  ├── sector (text)
  ├── website (text)
  ├── contact_person (text)
  ├── notes (text)
  ├── status (enum: active, inactive)
  ├── created_by (uuid, FK)
  ├── created_at (timestamp)
  ├── updated_at (timestamp)

-- Campaigns
campaigns
  ├── id (uuid, primary key)
  ├── name (text, not null)
  ├── type (enum: sponsorship, partnership, mentor, investor)
  ├── email_template_id (uuid, FK)
  ├── status (enum: draft, scheduled, sent, completed)
  ├── created_by (uuid, FK)
  ├── created_at (timestamp)
  ├── updated_at (timestamp)

-- Campaign Recipients
campaign_recipients
  ├── id (uuid, primary key)
  ├── campaign_id (uuid, FK)
  ├── contact_id (uuid, FK)
  ├── status (enum: sent, opened, replied, bounced)
  ├── opened_at (timestamp)
  ├── replied_at (timestamp)
  ├── created_at (timestamp)

-- Email Templates
email_templates
  ├── id (uuid, primary key)
  ├── name (text, not null)
  ├── subject (text)
  ├── content (text) -- HTML with {{variables}}
  ├── variables (text[]) -- Extracted from content
  ├── created_by (uuid, FK)
  ├── created_at (timestamp)
  ├── updated_at (timestamp)

-- Meetings
meetings
  ├── id (uuid, primary key)
  ├── title (text, not null)
  ├── date (timestamp, not null)
  ├── organization_id (uuid, FK)
  ├── participants (uuid[]) -- Contact IDs
  ├── agenda (text)
  ├── notes (text)
  ├── transcript (text) -- From Whisper
  ├── mom (jsonb) -- Structured MOM object
  ├── recording_url (text)
  ├── created_by (uuid, FK)
  ├── created_at (timestamp)
  ├── updated_at (timestamp)

-- Tasks
tasks
  ├── id (uuid, primary key)
  ├── title (text, not null)
  ├── description (text)
  ├── status (enum: todo, in-progress, done)
  ├── priority (enum: low, medium, high)
  ├── deadline (date)
  ├── assignee_id (uuid, FK to users)
  ├── linked_meeting_id (uuid, FK)
  ├── linked_contact_id (uuid, FK)
  ├── linked_organization_id (uuid, FK)
  ├── notes (text)
  ├── created_by (uuid, FK)
  ├── created_at (timestamp)
  ├── updated_at (timestamp)

-- Documents
documents
  ├── id (uuid, primary key)
  ├── name (text, not null)
  ├── type (enum: pdf, doc, spreadsheet, presentation, other)
  ├── file_url (text)
  ├── file_size (integer)
  ├── linked_contact_id (uuid, FK)
  ├── linked_organization_id (uuid, FK)
  ├── linked_meeting_id (uuid, FK)
  ├── tags (text[])
  ├── uploaded_by (uuid, FK)
  ├── created_at (timestamp)

-- Pitch Decks
pitch_decks
  ├── id (uuid, primary key)
  ├── name (text, not null)
  ├── template (enum: sponsorship, partnership, mentor, investor)
  ├── target_company_id (uuid, FK)
  ├── status (enum: draft, finalized, presented)
  ├── brand_color (text)
  ├── slides (jsonb[]) -- Array of slide objects
  ├── created_by (uuid, FK)
  ├── created_at (timestamp)
  ├── updated_at (timestamp)

-- Audit Logs
audit_logs
  ├── id (uuid, primary key)
  ├── user_id (uuid, FK)
  ├── action (text)
  ├── resource_type (text)
  ├── resource_id (uuid)
  ├── changes (jsonb) -- What changed
  ├── ip_address (inet)
  ├── created_at (timestamp)

-- Notifications
notifications
  ├── id (uuid, primary key)
  ├── user_id (uuid, FK)
  ├── type (enum: meeting_reminder, task_overdue, campaign_reply, etc.)
  ├── title (text)
  ├── message (text)
  ├── is_read (boolean)
  ├── action_url (text)
  ├── created_at (timestamp)

-- Settings
app_settings
  ├── id (uuid, primary key)
  ├── organization_id (uuid, FK)
  ├── organization_name (text)
  ├── email_from (text)
  ├── timezone (text)
  ├── logo_url (text)
  ├── updated_at (timestamp)
```

**Cost**: Free tier included (up to 500MB storage)

#### B. Supabase Authentication

**What's Needed**:
1. Enable email/password and magic link auth
2. Create auth flow: login/signup pages
3. Replace localStorage mock auth
4. Session management

**Implementation**:
```typescript
// POST /api/auth/login
// Body: { email: string, password: string }
// Response: { access_token, user }

// POST /api/auth/signup
// Body: { email, password, fullName }

// POST /api/auth/logout
// POST /api/auth/refresh

// GET /api/auth/session (check current session)
```

**Key Decisions**:
- Use email/password for now (magic link can be added later)
- Separate signup for new team members (invite required)
- Admin creates users in admin panel
- Session stored in httpOnly cookie (Supabase default)

#### C. Replace localStorage with Supabase

**Process**:
1. Keep store file function signatures the same
2. Replace localStorage with Supabase queries
3. Add error handling and loading states
4. Update hook logic to handle async operations

**Example Migration**:
```typescript
// Before (localStorage)
export function getContacts(): Contact[] {
  const stored = localStorage.getItem(CONTACTS_KEY);
  return stored ? JSON.parse(stored) : mockContacts;
}

// After (Supabase)
export async function getContacts(): Promise<Contact[]> {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}
```

---

### Acceptance Criteria
- [ ] Supabase project created with all tables
- [ ] Row-level security policies configured
- [ ] Email/password authentication working
- [ ] User signup/login/logout flows complete
- [ ] All CRUD operations work with Supabase
- [ ] Session management working
- [ ] Error handling for all database operations

---

## Phase 15 — Email Integration (Resend)

### Status: 🔲 NOT STARTED

### Requirements

#### A. Resend API Setup

**What's Needed**:
1. Get Resend API key
2. Verify sender email domain (or use Resend subdomain)
3. Create email sending service
4. Handle bounces and failures

**API Endpoint**:
```typescript
// POST /api/campaigns/:id/send
// Body: { recipients: string[] }
// Response: { sent: number, failed: number, errors: [] }

// Implementation (on backend):
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

const result = await resend.emails.send({
  from: 'noreply@pieds.bits', // Must be verified
  to: contact.email,
  subject: template.subject,
  html: renderTemplate(template.content, contact),
});
```

**Cost**: Free up to 100 emails/day; $20/month for unlimited

**Key Decisions**:
- Send one email per recipient (personalization)
- Queue emails in database to retry failed sends
- Log all sends for analytics and compliance
- Rate limit: 1 email per second per domain

#### B. Email Rendering

**What's Needed**:
- Render HTML email from template with variables
- Support rich text (bold, italic, links, images)
- Preview before sending

**Implementation**:
```typescript
function renderTemplate(template: string, context: object): string {
  let html = template;
  Object.entries(context).forEach(([key, value]) => {
    html = html.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
  });
  return html;
}
```

---

## Phase 16 — Email Tracking & Webhooks

### Status: 🔲 NOT STARTED

### Requirements

#### A. Webhook Handler

**What's Needed**:
1. Endpoint to receive Resend webhooks
2. Update email status (sent, delivered, bounced, complained)
3. Log events for analytics

```typescript
// POST /api/webhooks/resend
// Webhook events: email_sent, email_delivered, email_bounced, email_complained

export async function POST(req: Request) {
  const event = await req.json();
  
  // Update campaign_recipients table
  await supabase
    .from('campaign_recipients')
    .update({ status: event.status, updated_at: new Date() })
    .eq('email_id', event.email_id);
    
  return Response.json({ ok: true });
}
```

**Cost**: Included with Resend API

#### B. Analytics Updates

**What's Needed**:
- Real-time email stats (sent, delivered, opened, replied)
- Update analytics dashboard with real numbers
- Track conversation metrics

---

## Phase 17 — File Storage (Supabase Storage)

### Status: 🔲 NOT STARTED

### Requirements

#### A. Supabase Storage Buckets

**What's Needed**:
```typescript
// Create buckets:
- documents (public, for shared docs)
- recordings (private, for meeting recordings)
- logos (public, for organization logos)
- avatars (public, for user profiles)
```

**Implementation**:
```typescript
// Upload document
const { data, error } = await supabase.storage
  .from('documents')
  .upload(`${documentId}/${file.name}`, file);

// Get download URL
const { data: { publicUrl } } = supabase.storage
  .from('documents')
  .getPublicUrl(`${documentId}/${file.name}`);
```

**Cost**: Free up to 1GB; $5/month per 100GB

#### B. File Upload UI

**What's Needed**:
- Replace placeholder with real upload
- Show progress bar
- Support drag-and-drop
- File type validation

---

## Phase 18 — Scheduled Jobs & Automation (Vercel Cron)

### Status: 🔲 NOT STARTED

### Requirements

#### A. Cron Jobs

**What's Needed**:
```typescript
// app/api/cron/reminders.ts
// Runs daily at 9 AM IST (8:30 PM UTC previous day)

export async function GET(req: Request) {
  // 1. Find meetings scheduled for today
  // 2. Find overdue tasks
  // 3. Create notifications for users
  // 4. Send reminder emails (if enabled)
}
```

**Jobs to Implement**:
1. **Meeting Reminders** (8 hours before)
2. **Overdue Task Alerts** (daily at 9 AM)
3. **Follow-up Reminders** (contacts not contacted in 30+ days)
4. **Daily Report** (email digest of activities)
5. **Cleanup** (archive old data, delete soft-deletes after 90 days)

**Cost**: Free (included with Vercel)

---

## Phase 19 — Enhancements & Polish

### Status: 🔲 NOT STARTED

### Requirements

#### A. Performance Optimization
- [ ] Database query optimization
- [ ] API response caching
- [ ] Image optimization
- [ ] Code splitting refinement
- [ ] Database indexes on frequently searched fields

#### B. Error Handling & Resilience
- [ ] Graceful degradation when APIs fail
- [ ] Retry logic for failed operations
- [ ] Error boundary improvements
- [ ] User-friendly error messages

#### C. Mobile Optimization
- [ ] Test on real mobile devices
- [ ] Improve touch interactions
- [ ] Mobile-specific layouts where needed
- [ ] Performance optimization for mobile networks

#### D. Accessibility
- [ ] WCAG 2.1 AA compliance
- [ ] Keyboard navigation
- [ ] Screen reader testing
- [ ] Color contrast verification

#### E. Security Hardening
- [ ] Input validation and sanitization
- [ ] CSRF protection
- [ ] Rate limiting
- [ ] API key rotation
- [ ] Secrets management

---

## Required API Keys & Credentials

### Must-Have (Phase 13+)

| Service | API Key | Cost | Status | Priority |
|---------|---------|------|--------|----------|
| **Anthropic (Claude)** | `ANTHROPIC_API_KEY` | ~$0.001-0.003/req | ❌ Not Set | 🔴 CRITICAL |
| **OpenAI (Whisper)** | `OPENAI_API_KEY` | ~$0.006/min | ❌ Not Set | 🔴 CRITICAL |
| **Resend (Email)** | `RESEND_API_KEY` | Free-$20/mo | ❌ Not Set | 🔴 CRITICAL |
| **Supabase (DB)** | `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Free-paid | ❌ Not Set | 🔴 CRITICAL |

### Nice-to-Have (Phase 13+)

| Service | API Key | Cost | Status | Priority |
|---------|---------|------|--------|----------|
| **Apollo.io (Company Research)** | `APOLLO_API_KEY` | $0.10-0.25/lookup | ❌ Not Set | 🟡 MEDIUM |
| **Vercel Cron Secret** | `VERCEL_CRON_SECRET` | Free | ❌ Not Set | 🟡 MEDIUM |

### How to Get Them

#### 1. Anthropic API Key
```
1. Go to https://console.anthropic.com
2. Sign up / log in with your account
3. Create API key
4. Add prepaid credits ($5-20 recommended)
5. Copy key to .env.local: ANTHROPIC_API_KEY=sk_...
```

#### 2. OpenAI API Key
```
1. Go to https://platform.openai.com
2. Sign up / log in
3. Create API key
4. Add prepaid credits (same as Anthropic)
5. Copy key to .env.local: OPENAI_API_KEY=sk_...
```

#### 3. Resend API Key
```
1. Go to https://resend.com
2. Sign up (email verification required)
3. Verify sender domain (or use resend.dev subdomain for testing)
4. Create API key
5. Copy key to .env.local: RESEND_API_KEY=re_...
```

#### 4. Supabase Project
```
1. Go to https://supabase.com
2. Create new project
3. Wait for setup (5-10 minutes)
4. Copy project URL and anon key:
   - NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   - NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
5. Create PostgreSQL tables (see Phase 14)
```

#### 5. Apollo.io API Key (Optional)
```
1. Go to https://www.apollo.io
2. Sign up
3. Create API key
4. Buy prepaid credits ($20+ recommended)
5. Copy key to .env.local: APOLLO_API_KEY=...
```

---

## Environment Variables Checklist

### Development (.env.local)
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# AI APIs
ANTHROPIC_API_KEY=
OPENAI_API_KEY=

# Email
RESEND_API_KEY=

# Optional
APOLLO_API_KEY=
VERCEL_CRON_SECRET=
```

### Production (Vercel)
Same as above, set in Vercel project settings → Environment Variables

---

## Implementation Timeline

### Week 1-2: Phase 13 (AI)
- [ ] Whisper API integration (meeting transcription)
- [ ] Claude API (MOM generation)
- [ ] AI Assistant chat
- [ ] Company research API

### Week 3: Phase 14 (Auth & DB)
- [ ] Supabase project setup
- [ ] Database schema creation
- [ ] Auth flow implementation
- [ ] Replace localStorage with Supabase

### Week 4: Phase 15-16 (Email)
- [ ] Resend integration
- [ ] Campaign email sending
- [ ] Webhook handler
- [ ] Real-time email stats

### Week 5: Phase 17 (File Storage)
- [ ] Supabase Storage setup
- [ ] Document upload
- [ ] Recording upload
- [ ] Real file management

### Week 6: Phase 18 (Automation)
- [ ] Cron jobs setup
- [ ] Reminders and alerts
- [ ] Scheduled reports
- [ ] Data cleanup jobs

### Week 7-8: Phase 19 (Polish)
- [ ] Performance optimization
- [ ] Error handling improvements
- [ ] Mobile optimization
- [ ] Security hardening
- [ ] Final testing and QA

---

## Success Criteria

### Phase 13 Complete ✅
- [ ] All AI features work with real APIs
- [ ] Transcripts are generated and stored
- [ ] MOMs are generated with action items
- [ ] AI Assistant responds correctly
- [ ] No errors in production logs

### Phase 14 Complete ✅
- [ ] Real users can sign up and login
- [ ] All data persists in Supabase
- [ ] No mock data in production
- [ ] RLS policies are working
- [ ] Performance is acceptable (<2s load time)

### Phase 15-16 Complete ✅
- [ ] Campaigns send real emails
- [ ] Email stats are tracked
- [ ] Webhooks process events
- [ ] Analytics dashboard shows real data

### Phase 17 Complete ✅
- [ ] Documents can be uploaded and downloaded
- [ ] Recordings are stored securely
- [ ] File previews work

### Phase 18 Complete ✅
- [ ] Cron jobs execute on schedule
- [ ] Notifications are sent automatically
- [ ] Reports are generated

### Phase 19 Complete ✅
- [ ] Page load time < 2s
- [ ] Mobile site is usable
- [ ] No console errors
- [ ] All accessibility standards met

---

## Notes for Next Developer

1. **Start with API Keys**: Get all 5 critical API keys before starting Phase 13
2. **Database Design**: Review and finalize schema before creating tables
3. **Testing**: Test each phase end-to-end before moving to the next
4. **Backups**: Always have database backups before major changes
5. **Monitoring**: Set up error tracking (Sentry) early
6. **Secrets**: Never commit API keys — use `.env.local` and Vercel secrets
7. **Documentation**: Update this file as you complete phases

---

## Quick Reference: Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run lint         # Run linter
npm run type-check   # Type checking

# Git
git status           # Check status
git add .            # Stage changes
git commit -m "msg"  # Commit
git push origin main # Push to GitHub

# Deployment
vercel deploy --prod # Deploy to Vercel
vercel env pull      # Pull environment variables

# Database (Supabase)
# Use Supabase Studio UI for now
# Run SQL in SQL Editor: https://supabase.com/dashboard/project/[project-id]/sql
```

---

## Questions & Support

For implementation questions, refer to:
- `project-context.md` — Project architecture and patterns
- `PHASES.md` — What's already built
- `CLAUDE.md` — Development guidelines
- GitHub Issues — Track progress and bugs
