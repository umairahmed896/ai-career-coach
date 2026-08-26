# AI Career Coach - Setup Guide

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_OUT_URL=/

# Google AI
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key_here

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ai_career_coach?schema=public"

# Inngest (Optional - for background jobs)
INGEST_SIGNING_KEY=your_ingest_signing_key_here
INGEST_EVENT_KEY=your_ingest_event_key_here
```

## Database Setup

1. Install Prisma CLI:
```bash
npm install -g prisma
```

2. Generate Prisma client:
```bash
npx prisma generate
```

3. Run migrations:
```bash
npx prisma migrate dev
```

## Running the Project

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Open http://localhost:3000 in your browser

## Features

- **Landing Page**: Hero section with features, testimonials, and FAQ
- **Authentication**: Clerk-based sign in/sign up
- **Dashboard**: Industry insights and career tracking
- **Resume Builder**: Create and optimize resumes
- **Cover Letter Generator**: AI-powered cover letters
- **Interview Prep**: Practice with AI-generated questions
- **Onboarding**: Personalized career guidance setup

## Project Structure

- `app/`: Next.js app directory with pages and layouts
- `components/`: Reusable React components
- `actions/`: Server actions for data operations
- `lib/`: Utility functions and configurations
- `data/`: Static data for features, testimonials, etc.
- `prisma/`: Database schema and migrations

## Fixes Applied

1. ✅ Removed Watch Demo link from hero section
2. ✅ Fixed Next.js Turbopack root directory warning
3. ✅ Updated middleware to fix authentication redirect issues
4. ✅ Converted Header to client component to fix hydration errors
5. ✅ Added image loading optimization
6. ✅ Updated deprecated Clerk props (afterSignOutUrl → fallbackRedirectUrl)
7. ✅ Moved checkUser to layout to ensure user sync

## Notes

- The project uses Next.js 16.3.2 with Turbopack
- Authentication is handled by Clerk
- Database is PostgreSQL with Prisma ORM
- AI features use Google Generative AI
- Theme support via next-themes