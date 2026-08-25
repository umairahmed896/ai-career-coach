# SensAI — AI Career Coach

An AI-powered career development platform built with Next.js 15, Clerk, Prisma/PostgreSQL and Google Gemini.
It helps a job seeker build an ATS-friendly resume, generate tailored cover letters, practice mock interviews
and track industry salary/market insights — all personalised to the user's industry and experience.

- **Hosted URL:** _to be added after deployment_
- **Source:** https://github.com/umairahmed896/ai-career-coach
- **Demo video:** _to be added_

---

## 1. Problem Definition

Job seekers in technical and non-technical industries face three recurring problems:

1. **Generic application material.** Resumes and cover letters are written once and reused for every job, so they
   fail ATS (Applicant Tracking System) keyword filters and do not reflect the target role.
2. **Unstructured interview preparation.** Candidates do not know which questions matter for their industry and
   get no measurable feedback on their weak areas.
3. **No visibility into the market.** Salary ranges, in-demand skills and growth outlook for a specific
   industry/sub-industry are scattered across many sources and go stale quickly.

**Objective.** Provide a single authenticated web application where a user onboards once with their industry,
sub-industry, experience, skills and bio, and then receives AI-generated, industry-specific resume content,
cover letters, mock interview quizzes with scoring/improvement tips, and a dashboard of live industry insights.

**Scope.**

- In scope: authentication, onboarding profile, resume builder + PDF export, cover letter generator, mock
  interview quiz with performance analytics, industry insight dashboard with weekly refresh.
- Out of scope: job board / applying to jobs, payments, recruiter-side accounts, mobile native apps.

### Functional requirements

| ID | Requirement |
| --- | --- |
| FR-1 | A visitor can sign up / sign in with email or a social provider (Clerk). |
| FR-2 | On first sign-in the user must complete onboarding (industry, sub-industry, experience, skills, bio). |
| FR-3 | On completing onboarding the system generates industry insights via Gemini and stores them. |
| FR-4 | The dashboard shows salary ranges by role, growth rate, demand level, market outlook, top skills and key trends. |
| FR-5 | The user can write a resume in markdown, generate/improve sections with AI, save it and download it as PDF. |
| FR-6 | The user can generate a cover letter from a job title, company name and job description, and view/delete past letters. |
| FR-7 | The user can take a 10-question industry-specific mock interview quiz, see the correct answers and receive an AI improvement tip. |
| FR-8 | Quiz results are persisted and shown as a score-over-time chart with average score, questions practised and latest score. |
| FR-9 | All application routes except the landing and auth pages require an authenticated session. |

### Non-functional requirements

| ID | Requirement |
| --- | --- |
| NFR-1 | Server-side rendering with Next.js App Router; interactive pages must be usable on mobile widths. |
| NFR-2 | Secrets (DB URL, Clerk keys, Gemini key) are supplied only through environment variables, never committed. |
| NFR-3 | Database access goes through Prisma with a singleton client to avoid connection exhaustion on serverless. |
| NFR-4 | AI failures must surface as a user-visible toast, not a crash. |
| NFR-5 | Industry insights are refreshed automatically once a week by a scheduled background job (Inngest). |

---

## 2. Design Specifications (Modules / Features)

### 2.1 Technology stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 15 (App Router, React 19, Server Actions, Turbopack dev) |
| Auth | Clerk (`@clerk/nextjs`, route protection in `middleware.js`) |
| Database | PostgreSQL (Neon) via Prisma ORM 6 |
| AI | Google Gemini (`@google/generative-ai`, model `gemini-1.5-flash`) |
| Background jobs | Inngest (weekly industry-insight refresh, `/api/inngest`) |
| UI | Tailwind CSS, shadcn/ui + Radix primitives, lucide-react icons, Recharts, Sonner toasts |
| Forms/validation | react-hook-form + Zod |
| Export | html2pdf.js (client-side resume PDF) |

### 2.2 Modules

| # | Module | Route(s) | Server action(s) | Description |
| --- | --- | --- | --- | --- |
| M1 | Authentication | `/sign-in`, `/sign-up` | — | Clerk-hosted forms; unauthenticated access to protected routes redirects to sign-in. |
| M2 | Onboarding / Profile | `/onboarding` | `actions/user.js` → `updateUser`, `getUserOnboardingStatus` | Captures industry, sub-industry, years of experience, skills, bio; creates the `User` row and triggers insight generation inside a transaction. |
| M3 | Industry Insights Dashboard | `/dashboard` | `actions/dashboard.js` → `getIndustryInsights`, `generateAIInsights` | Salary bar chart, growth rate, demand level, market outlook badge, top skills and key trends; regenerates data if none exists. |
| M4 | Resume Builder | `/resume` | `actions/resume.js` → `saveResume`, `getResume`, `improveWithAI` | Markdown editor + form-driven entry sections, AI "improve with AI" per entry, ATS-oriented rewriting, live preview and PDF download. |
| M5 | Cover Letter Generator | `/ai-cover-letter`, `/ai-cover-letter/new`, `/ai-cover-letter/[id]` | `actions/cover-letter.js` → `generateCoverLetter`, `getCoverLetters`, `getCoverLetter`, `deleteCoverLetter` | Generates a markdown business-letter tailored to a pasted job description; list, preview and delete previous letters. |
| M6 | Mock Interview | `/interview`, `/interview/mock` | `actions/interview.js` → `generateQuiz`, `saveQuizResult`, `getAssessments` | 10 industry-specific MCQs from Gemini, instant scoring, explanations, AI improvement tip, performance chart and history. |
| M7 | Background jobs | `/api/inngest` | `lib/inngest/function.js` | Cron (`0 0 * * 0`) that regenerates `IndustryInsight` rows for every industry weekly. |
| M8 | Shared infrastructure | — | `lib/prisma.js`, `lib/checkUser.js`, `hooks/use-fetch.js`, `components/*` | Prisma singleton, Clerk→DB user sync, fetch hook with loading/error toasts, theme provider, UI kit. |

### 2.3 Data model (Prisma)

| Model | Key fields | Relations |
| --- | --- | --- |
| `User` | `clerkUserId` (unique), `email`, `name`, `imageUrl`, `industry`, `experience`, `bio`, `skills[]` | 1–1 `Resume`, 1–N `Assessment`, 1–N `CoverLetter`, N–1 `IndustryInsight` |
| `Resume` | `content` (markdown), `atsScore`, `feedback` | 1–1 `User` |
| `CoverLetter` | `content`, `jobDescription`, `companyName`, `jobTitle`, `status` | N–1 `User` |
| `Assessment` | `quizScore`, `questions[]` (JSON), `category`, `improvementTip` | N–1 `User` |
| `IndustryInsight` | `industry` (unique), `salaryRanges[]`, `growthRate`, `demandLevel`, `topSkills[]`, `marketOutlook`, `keyTrends[]`, `recommendedSkills[]`, `nextUpdate` | 1–N `User` |

### 2.4 Security design

- Every request passes through `middleware.js`; `/dashboard`, `/resume`, `/interview`, `/ai-cover-letter` and
  `/onboarding` require a Clerk session.
- Server actions re-check `auth()` and resolve the DB user from `clerkUserId`, so a client cannot act on
  another user's records.
- All AI and database credentials live in environment variables; `.env*` is git-ignored.

---

## 3. Diagrams

### 3.1 Sitemap

```
/                               Landing page (hero, features, stats, how-it-works, testimonials, FAQ, CTA)
├── /sign-in                    Clerk sign-in
├── /sign-up                    Clerk sign-up
└── (protected)
    ├── /onboarding             Industry / experience / skills / bio form
    ├── /dashboard              Industry insights (salary chart, growth, demand, trends)
    ├── /resume                 Resume builder (form + markdown editor + PDF download)
    ├── /ai-cover-letter        Saved cover letters list
    │   ├── /new                Generate a new cover letter
    │   └── /[id]               View a single cover letter
    ├── /interview              Interview prep: stats, performance chart, quiz history
    │   └── /interview/mock     Take a 10-question mock interview
    └── /api/inngest            Background job endpoint (weekly insight refresh)
```

### 3.2 System architecture

```
┌───────────────┐      ┌──────────────────────────────────────────┐      ┌───────────────┐
│   Browser     │      │        Next.js 15 (App Router)           │      │   Clerk       │
│  React 19 UI  │◄────►│  Server Components + Server Actions      │◄────►│  Auth / users │
└───────────────┘      │  middleware.js (route protection)        │      └───────────────┘
                       └───────┬───────────────────────┬──────────┘
                               │ Prisma Client         │ @google/generative-ai
                               ▼                       ▼
                       ┌───────────────┐       ┌──────────────────┐
                       │ PostgreSQL    │       │ Google Gemini    │
                       │ (Neon)        │       │ gemini-1.5-flash │
                       └───────────────┘       └──────────────────┘
                               ▲
                               │ weekly cron (0 0 * * 0)
                       ┌───────────────┐
                       │   Inngest     │
                       └───────────────┘
```

### 3.3 User flow chart

```
        ┌──────────┐
        │  Visitor │
        └────┬─────┘
             │ opens /
             ▼
     ┌────────────────┐   no    ┌───────────┐
     │ Signed in?     ├────────►│ /sign-in  │
     └───────┬────────┘         └─────┬─────┘
             │ yes                    │ authenticated
             ▼                        ▼
     ┌──────────────────┐  no   ┌──────────────┐
     │ Onboarding done? ├──────►│ /onboarding  │──► generate industry insights (Gemini)
     └───────┬──────────┘       └──────────────┘
             │ yes
             ▼
     ┌────────────────────────────────────────────────────────────┐
     │                        /dashboard                          │
     └───┬──────────────┬──────────────────────┬──────────────────┘
         │              │                      │
         ▼              ▼                      ▼
   ┌───────────┐  ┌──────────────────┐  ┌──────────────────┐
   │ /resume   │  │ /ai-cover-letter │  │ /interview       │
   │ edit+AI   │  │ new → Gemini     │  │ /mock → 10 MCQs  │
   │ save      │  │ save + list      │  │ score + tip      │
   │ PDF       │  │ view / delete    │  │ history chart    │
   └───────────┘  └──────────────────┘  └──────────────────┘
```

### 3.4 Mock interview sequence

```
User            /interview/mock         Server Action           Gemini            PostgreSQL
 │  start quiz        │                      │                     │                  │
 ├───────────────────►│  generateQuiz()      │                     │                  │
 │                    ├─────────────────────►│  prompt(industry,   │                  │
 │                    │                      │  skills) ──────────►│                  │
 │                    │                      │◄──── 10 MCQs JSON ──┤                  │
 │◄─── questions ─────┤                      │                     │                  │
 │  answer 10 Qs      │                      │                     │                  │
 ├───────────────────►│  saveQuizResult()    │                     │                  │
 │                    ├─────────────────────►│ improvement tip ───►│                  │
 │                    │                      │◄────────────────────┤                  │
 │                    │                      │  create Assessment ───────────────────►│
 │◄─ score + tip ─────┤◄─────────────────────┤                     │                  │
```

---

## 4. Source Code Structure

```
ai-career-coach/
├── actions/                 Server actions (business logic)
│   ├── dashboard.js         Industry insight generation & retrieval
│   ├── cover-letter.js      Cover letter CRUD + AI generation
│   ├── interview.js         Quiz generation, scoring, history
│   ├── resume.js            Resume save/get, AI improvement
│   └── user.js              Onboarding update, onboarding status
├── app/
│   ├── (auth)/              Sign-in / sign-up route group
│   ├── (main)/              Protected app: dashboard, resume, ai-cover-letter, interview, onboarding
│   ├── api/inngest/         Inngest HTTP endpoint
│   ├── lib/schema.js        Zod validation schemas
│   ├── lib/helper.js        Resume markdown helpers
│   ├── layout.js            Root layout (ClerkProvider, theme, header, footer)
│   └── page.js              Landing page
├── components/              Shared UI (header, hero, theme provider, shadcn/ui kit)
├── data/                    Static content: industries, features, FAQs, testimonials, how-it-works
├── hooks/use-fetch.js       Client hook wrapping server actions with loading/error state
├── lib/
│   ├── prisma.js            Prisma client singleton
│   ├── checkUser.js         Sync Clerk user into the database
│   └── inngest/             Inngest client + weekly insight cron function
├── prisma/
│   ├── schema.prisma        Data model
│   └── migrations/          SQL migrations
├── middleware.js            Clerk route protection
└── next.config.mjs          Next.js configuration
```

---

## 5. Test Data

### 5.1 Test login

| Field | Value |
| --- | --- |
| URL | Hosted URL above, or `http://localhost:3000` |
| Email | Create any account via **Sign Up** (Clerk test mode accepts any valid email) |
| Password | Chosen at sign-up |
| Email OTP | Clerk test mode accepts the code `424242` |

> The project uses Clerk in **test mode**, so no real email inbox is needed: sign up with any address and confirm
> with the verification code `424242`.

### 5.2 Sample onboarding data

| Field | Value |
| --- | --- |
| Industry | Technology |
| Sub-industry | Software Development |
| Years of experience | 3 |
| Skills | JavaScript, React, Next.js, Node.js, PostgreSQL |
| Professional bio | Full-stack developer with 3 years of experience building web applications with React and Node.js. |

### 5.3 Sample cover letter input

| Field | Value |
| --- | --- |
| Company name | TechNova Solutions |
| Job title | Frontend Developer |
| Job description | We are looking for a Frontend Developer with 2+ years of experience in React and Next.js to build responsive, accessible web interfaces. Experience with TypeScript, REST APIs and Tailwind CSS is required. |

### 5.4 Sample resume input

| Section | Value |
| --- | --- |
| Contact | umair@example.com · +92 300 0000000 · linkedin.com/in/umair · github.com/umairahmed896 |
| Summary | Full-stack developer specialising in React, Next.js and Node.js. |
| Skills | JavaScript, React, Next.js, Node.js, Prisma, PostgreSQL, Tailwind CSS |
| Experience | Frontend Developer — TechNova Solutions — 2023-01 to present — Built and shipped 12+ React features; improved page load time by 40%. |
| Education | BS Computer Science — Aptech — 2019-08 to 2023-06 |
| Project | AI Career Coach — Next.js + Gemini platform for resume, cover letter and interview preparation. |

### 5.5 Test scenarios

| # | Scenario | Steps | Expected result |
| --- | --- | --- | --- |
| T1 | Sign up | Sign Up → enter email/password → verify with `424242` | Redirected to `/onboarding` |
| T2 | Onboarding | Fill the data from 5.2 → Complete Profile | Redirected to `/dashboard`, insights generated |
| T3 | Dashboard | Open `/dashboard` | Salary chart, growth rate, demand level, market outlook and trends visible |
| T4 | Cover letter | `/ai-cover-letter/new` → data from 5.3 → Generate | Markdown cover letter created and listed |
| T5 | Resume | `/resume` → data from 5.4 → Save → Download PDF | Resume saved and PDF downloaded |
| T6 | Mock interview | `/interview/mock` → answer 10 questions → Finish | Score shown with explanations and an improvement tip |
| T7 | Interview history | `/interview` | Average score, questions practised, latest score and chart updated |
| T8 | Route protection | Open `/dashboard` while signed out | Redirected to `/sign-in` |

---

## 6. Installation Steps

### 6.1 Prerequisites

- Node.js 18.18+ (Node 20 recommended) and npm
- A PostgreSQL database (a free [Neon](https://neon.tech) project works)
- A [Clerk](https://clerk.com) application (publishable + secret keys)
- A [Google Gemini](https://aistudio.google.com/app/apikey) API key

### 6.2 Steps

```bash
# 1. Clone
git clone https://github.com/umairahmed896/ai-career-coach.git
cd ai-career-coach

# 2. Install dependencies (also runs `prisma generate`)
npm install

# 3. Create the environment file
cp .env.example .env
#    then fill in the values (see 6.3)

# 4. Create the database tables
npx prisma migrate deploy      # existing database
# or, for a fresh local database:
# npx prisma migrate dev

# 5. Start the development server
npm run dev
#    open http://localhost:3000
```

Production build:

```bash
npm run build
npm run start
```

### 6.3 Environment variables

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string (Neon pooled URL) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key (`pk_test_...`) |
| `CLERK_SECRET_KEY` | Clerk secret key (`sk_test_...`) |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/sign-up` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | `/onboarding` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | `/onboarding` |
| `GEMINI_API_KEY` | Google Gemini API key |

### 6.4 Deployment (Vercel)

1. Import the GitHub repository into Vercel.
2. Add every variable from 6.3 as a Project Environment Variable (Production + Preview).
3. Deploy — the build runs `prisma generate` via the `postinstall` script.
4. In the Clerk dashboard add the Vercel domain to the allowed origins.

---

## 7. Assumptions

- Clerk runs in **test mode**; sign-up verification uses the fixed OTP `424242` and no real emails are sent.
- The Gemini free tier is used, so AI generation is rate-limited; a failed generation shows an error toast and
  can simply be retried.
- Industry insights are AI-generated estimates for demonstration purposes, not audited market data.
- Salary figures are reported in USD and annualised.
- A user has exactly one resume; cover letters and assessments are unlimited.
- The application is single-tenant per user: there are no recruiter, admin or team roles.
- Weekly insight refresh requires Inngest to be connected in production; without it, insights are generated
  on demand at onboarding.
- The database is a hosted PostgreSQL instance (Neon) reachable from the deployment environment.

---

## 8. Demo Video

A walkthrough recording covering sign-up, onboarding, dashboard insights, resume builder, cover letter
generation and the mock interview flow: _link to be added_.

---

## Author

Made by **Umair Ahmed**.
