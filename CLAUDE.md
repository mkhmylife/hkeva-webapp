# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development server (runs on port 3001)
yarn dev
# or
npm run dev

# Production build
yarn build
# or
npm run build

# Run production server
yarn start
# or
npm start

# Lint code
yarn lint
# or
npm run lint
```

## Architecture Overview

This is a **Next.js 16** educational platform webapp serving the Hong Kong market with full internationalization support (Traditional Chinese and English).

### Technology Stack
- **Framework**: Next.js 16 with App Router
- **Runtime**: Node.js 22 (Alpine in Docker)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **i18n**: next-intl (zh-HK default, en-HK supported)
- **Authentication**: Custom JWT-based session management using `jose`
- **Forms**: React Hook Form
- **Calendar**: react-calendar
- **UI Components**: Headless UI, Lucide React icons

### Project Structure

```
src/
├── app/[locale]/          # All routes are locale-prefixed
│   ├── auth/              # Authentication pages (login, register, forgot-password)
│   ├── class/             # Course management (courses, renew)
│   ├── enrollment/        # Student enrollment management
│   ├── news/              # News/announcements
│   ├── notification/      # User notifications
│   ├── profile/           # User profile (settings, payments, timetable)
│   ├── settings/          # App settings
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # 50+ reusable React components
│   ├── Auth/              # Authentication-specific components
│   ├── header.tsx         # Main navigation header
│   ├── footer.tsx         # Footer with locale switcher
│   ├── course-card.tsx    # Course display cards
│   └── [various forms, cards, modals]
├── libs/                  # Server actions and utilities
│   ├── fetcher.ts         # API wrapper with automatic auth injection
│   ├── course.ts          # Course-related server actions
│   ├── auth.ts            # Authentication utilities
│   ├── session.ts         # Session management (JWT encryption/decryption)
│   └── user.ts            # User-related server actions
├── types/                 # TypeScript type definitions
├── i18n/                  # Internationalization config
│   ├── routing.ts         # Locale configuration
│   └── request.ts         # Request locale handling
└── locales/               # Translation files
    ├── zh-HK.json         # Traditional Chinese (primary)
    └── en-US.json         # English
```

## Key Architectural Patterns

### 1. Locale-Based Routing
All routes are prefixed with a locale segment: `/zh-HK/` or `/en-HK/`. The default locale is `zh-HK` (Traditional Chinese for Hong Kong).

**Middleware Logic** (`src/middleware.ts`):
- Strips locale from pathname to determine the actual route
- Redirects to `/zh-HK/` if no locale detected
- Protects authenticated routes (requires valid session)
- Redirects unauthenticated users to login
- Redirects authenticated users away from public auth pages

**Protected routes**: `/`, `/enrollment`, `/profile`, `/notification`, `/settings`
**Public routes**: `/auth/login`, `/auth/register`, `/auth/forgot-password`

### 2. Server Actions & Data Fetching
All server-side code uses Next.js Server Actions (`'use server'` directive):

**API Communication Pattern** (`src/libs/fetcher.ts`):
```typescript
// Automatically injects auth token from session
const fetcher = async (method: string, path: string, body?: any) => {
  const auth = await verifyAuth();
  fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Authorization': `Bearer ${auth?.accessToken}`,
      // ... other headers
    }
  })
}
```

**Server Action Libraries**:
- `src/libs/course.ts` - Course and enrollment operations
- `src/libs/user.ts` - User profile operations
- `src/libs/auth.ts` - Authentication operations
- All use TypeScript DTOs from `src/types/`

### 3. Authentication & Session Management
- **JWT-based**: Uses `jose` library for token handling
- **Cookie-based**: Encrypted session cookies store access tokens
- **Session verification**: `verifyAuth()` in `libs/auth.ts` decrypts and validates tokens
- **Redirects**: Automatic login/logout redirects via middleware
- **401 handling**: API calls that return 401 trigger redirect to `/auth/login`

### 4. Internationalization (i18n)
- **Library**: next-intl
- **Locales**: `zh-HK` (default), `en-HK`
- **Translation files**: `src/locales/{locale}.json`
- **Usage**: `const t = await getTranslations()` in server components
- **Routing**: All URLs include locale prefix (e.g., `/zh-HK/class/courses`)

### 5. TypeScript Type Safety
- **DTOs**: Strong typing for API responses in `src/types/`
- **Common types**: `CourseDto`, `EnrollmentDto`, `UserDto`, `InvoiceDto`
- **Component props**: Fully typed with interfaces

## Deployment

### Docker Configuration
- **Multi-stage build**: deps → builder → runner
- **Timezone**: Asia/Hong_Kong
- **Node version**: 22-alpine
- **Output mode**: `standalone` (configured in `next.config.ts`)
- **Port**: 3000 (production), 3001 (development)
- **User**: Runs as non-root `nextjs` user

### Build Args
```
SESSION_SECRET          # Required for session encryption
NEXT_PUBLIC_API_URL     # Backend API URL
NEXT_PUBLIC_CDN_URL     # CDN for static assets (default: DigitalOcean Spaces)
```

### Environment Variables
Required in `.env.local` or build args:
- `API_URL` or `NEXT_PUBLIC_API_URL` - Backend API endpoint
- `SESSION_SECRET` - Secret for JWT session encryption

## Important Notes

### When Adding New Features
1. **Routes**: Add to `src/app/[locale]/` directory
2. **Translations**: Add keys to both `src/locales/zh-HK.json` and `src/locales/en-US.json`
3. **Server Actions**: Place in `src/libs/` with `'use server'` directive
4. **Types**: Define DTOs in `src/types/` before implementing
5. **Authentication**: Check `middleware.ts` to determine if route needs protection

### When Modifying Authentication
- Session logic is in `src/libs/session.ts`
- Auth verification is in `src/libs/auth.ts`
- Middleware handles all route protection logic
- JWT operations use `jose` library

### When Working with APIs
- Use `fetcher()` from `src/libs/fetcher.ts` for all API calls
- It automatically injects the auth token
- 401 responses trigger automatic login redirect
- All fetcher calls must be in Server Actions or Server Components

### Parallel Data Fetching
When multiple independent API calls are needed, use `Promise.all()` for performance:
```typescript
const [enrollments, todayEnrollments, toDos] = await Promise.all([
  getEnrollments(),
  getEnrollments(selectedDate.toISOString()),
  getToDos()
]);
```

### Styling Conventions
- Uses Tailwind CSS v4
- No CSS modules - utility classes only
- Responsive design: `sm:`, `lg:`, `xl:` breakpoints
- Brand colors: `brand-neutral-*`, `brand-primary-*` (defined in Tailwind config)

## Common Patterns

### Server Component with Data Fetching
```typescript
export default async function Page() {
  const data = await getSomeData(); // Server action
  return <div>{/* JSX */}</div>;
}
```

### Client Component with Interactivity
```typescript
'use client';

import { useState } from 'react';

export default function InteractiveComponent() {
  const [state, setState] = useState(null);
  // Event handlers, interactivity
}
```

### Protected Route Setup
Add route path to `protectedRoutes` array in `src/middleware.ts` if authentication is required.