# PIEDS OS Routing Guide

## Overview

This document describes the routing structure and best practices for PIEDS OS.

## Route Organization

All routes are centralized in `lib/routes.ts` and organized by feature module:

### Core Routes
- `/` - Dashboard
- `/login` - Login page
- `/settings` - Settings page

### Feature Modules

#### Contacts (`/contacts`)
- `GET /contacts` - List all contacts
- `GET /contacts/new` - Create new contact form
- `GET /contacts/[id]` - Contact detail page
- `GET /contacts/[id]/edit` - Edit contact form

#### Organizations (`/organizations`)
- `GET /organizations` - List all organizations
- `GET /organizations/new` - Create new organization form
- `GET /organizations/[id]` - Organization detail page (with research feature)
- `GET /organizations/[id]/edit` - Edit organization form

#### Outreach & Campaigns (`/outreach`)
- `GET /outreach` - List all campaigns
- `GET /outreach/new` - Create new campaign wizard
- `GET /outreach/[id]` - Campaign detail page
- `GET /outreach/[id]/edit` - Edit campaign
- `GET /outreach/templates` - List all email templates
- `GET /outreach/templates/new` - Create new template
- `GET /outreach/templates/[id]/edit` - Edit template

#### Meetings (`/meetings`)
- `GET /meetings` - List all meetings
- `GET /meetings/new` - Schedule new meeting form
- `GET /meetings/[id]` - Meeting detail page (with MOM generation)
- `GET /meetings/[id]/edit` - Edit meeting

#### Tasks (`/tasks`)
- `GET /tasks` - List all tasks (list + kanban views)
- `GET /tasks/new` - Create new task form
- `GET /tasks/[id]` - Task detail page (shows linked meeting)
- `GET /tasks/[id]/edit` - Edit task

#### Knowledge Base (`/knowledge-base`)
- `GET /knowledge-base` - Document grid with search/filters

#### Analytics (`/analytics`)
- `GET /analytics` - Analytics dashboard with charts

## Using Routes in Components

### Import the Routes constant:
```typescript
import { ROUTES } from "@/lib/routes";
```

### Use type-safe route functions:
```typescript
// Navigation
<Link href={ROUTES.CONTACTS.ROOT}>View All Contacts</Link>

// Creating detail links
<Link href={ROUTES.CONTACTS.DETAIL(contact.id)}>View Contact</Link>

// Editing
<Link href={ROUTES.CONTACTS.EDIT(contact.id)}>Edit Contact</Link>
```

### Benefits:
- ✅ Type-safe route generation
- ✅ Centralized route definitions
- ✅ Easy refactoring (change once, updates everywhere)
- ✅ No hardcoded string paths

## Dynamic Routes (Next.js 16)

All dynamic routes use the Promise-based `params` pattern:

```typescript
export default function DetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params); // Must unwrap with React.use()
  // ... rest of component
}
```

This ensures:
- ✅ Proper async handling
- ✅ Type safety
- ✅ No "params is a Promise" warnings

## Error Handling

### Global Error Boundary
- Location: `app/error.tsx`
- Catches unhandled errors across the app
- Shows error details with retry and home buttons

### Global 404 (Not Found)
- Location: `app/not-found.tsx`
- Catches invalid routes

### Section-Specific 404 Pages
When a resource is not found, users see a helpful page with navigation options:

- `app/contacts/not-found.tsx` - Contact not found
- `app/organizations/not-found.tsx` - Organization not found
- `app/meetings/not-found.tsx` - Meeting not found
- `app/tasks/not-found.tsx` - Task not found
- `app/outreach/not-found.tsx` - Campaign not found

**Implementation**: Components should call `notFound()` when a resource isn't found:

```typescript
import { notFound } from "next/navigation";

export default function DetailPage({ params }: Props) {
  const item = getItemById(id);
  
  if (!item) {
    notFound(); // Triggers section-specific not-found.tsx
  }
  
  // ... render item
}
```

## Route Structure

```
app/
├── page.tsx                     # Dashboard
├── layout.tsx                   # Root layout
├── error.tsx                    # Global error boundary
├── not-found.tsx                # Global 404
├── login/
│   └── page.tsx
├── contacts/
│   ├── page.tsx                 # List
│   ├── not-found.tsx            # Contact not found
│   ├── new/
│   │   └── page.tsx
│   └── [id]/
│       ├── page.tsx             # Detail
│       └── edit/
│           └── page.tsx
├── organizations/
│   ├── page.tsx
│   ├── not-found.tsx
│   ├── new/
│   │   └── page.tsx
│   └── [id]/
│       ├── page.tsx
│       └── edit/
│           └── page.tsx
├── outreach/
│   ├── page.tsx
│   ├── not-found.tsx
│   ├── new/
│   │   └── page.tsx
│   ├── [id]/
│   │   ├── page.tsx
│   │   └── edit/
│   │       └── page.tsx
│   └── templates/
│       ├── page.tsx
│       ├── new/
│       │   └── page.tsx
│       └── [id]/
│           └── edit/
│               └── page.tsx
├── meetings/
│   ├── page.tsx
│   ├── not-found.tsx
│   ├── new/
│   │   └── page.tsx
│   └── [id]/
│       ├── page.tsx
│       └── edit/
│           └── page.tsx
├── tasks/
│   ├── page.tsx
│   ├── not-found.tsx
│   ├── new/
│   │   └── page.tsx
│   └── [id]/
│       ├── page.tsx
│       └── edit/
│           └── page.tsx
├── knowledge-base/
│   └── page.tsx
├── analytics/
│   └── page.tsx
└── settings/
    └── page.tsx
```

## Best Practices

1. **Always use ROUTES constant** for navigation
2. **Call notFound()** when a resource doesn't exist
3. **Unwrap params with React.use()** in all dynamic routes
4. **Keep routes organized by feature** (don't create cross-feature routes)
5. **Use type-safe route functions** for dynamic segments
6. **Provide helpful error pages** with navigation options

## Common Patterns

### Redirecting after action
```typescript
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/routes";

function MyComponent() {
  const handleDelete = () => {
    deleteItem(id);
    redirect(ROUTES.ITEMS.ROOT);
  };
}
```

### Dynamic navigation
```typescript
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/routes";

function MyComponent() {
  const router = useRouter();
  
  const handleSave = () => {
    saveItem();
    router.push(ROUTES.ITEMS.DETAIL(itemId));
  };
}
```

### Conditional rendering based on route
```typescript
import { usePathname } from "next/navigation";
import { ROUTES } from "@/lib/routes";

function MyComponent() {
  const pathname = usePathname();
  const isDetail = pathname.startsWith(ROUTES.ITEMS.ROOT);
  
  // ... use isDetail for conditional rendering
}
```
