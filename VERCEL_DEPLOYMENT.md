# Vercel Deployment Guide for AI Career Coach

## 🚀 Step-by-Step Vercel Deployment

### 1. Prerequisites
- ✅ GitHub repository: https://github.com/umairahmed896/ai-career-coach.git
- ✅ Vercel account (free)
- ✅ PostgreSQL database (Supabase, Railway, or Neon)
- ✅ Clerk account (for authentication)
- ✅ Google AI API key

### 2. Install Vercel CLI (Optional)
```bash
npm install -g vercel
```

### 3. Deploy via Vercel Dashboard (Recommended)

#### Step 1: Connect GitHub to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Go to Settings → Git Integrations
4. Connect your GitHub account

#### Step 2: Import Project
1. Click "Add New Project"
2. Select "Import Git Repository"
3. Choose: `umairahmed896/ai-career-coach`
4. Click "Import"

#### Step 3: Configure Project
**Framework Preset**: Next.js

**Root Directory**: `./` (leave as default)

**Build Command**: `npm run build`

**Output Directory**: `.next`

**Install Command**: `npm install`

### 4. Environment Variables Setup

Add these environment variables in Vercel:

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

# Database (IMPORTANT: Use production database URL)
DATABASE_URL=postgresql://user:password@host:5432/database?schema=public

# Inngest (Optional)
INGEST_SIGNING_KEY=your_ingest_signing_key_here
INGEST_EVENT_KEY=your_ingest_event_key_here
```

### 5. Database Setup for Production

#### Option 1: Supabase (Recommended - Free)
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Get Database URL from Settings → Database
4. Add `DATABASE_URL` to Vercel environment variables
5. Run migrations in Supabase SQL Editor:

```sql
-- Run Prisma migrations in Supabase SQL Editor
-- Copy the SQL from: prisma/migrations/xxx_init/migration.sql
```

#### Option 2: Railway
1. Go to [railway.app](https://railway.app)
2. Create PostgreSQL database
3. Get connection string
4. Add to Vercel environment variables

#### Option 3: Neon (Serverless PostgreSQL)
1. Go to [neon.tech](https://neon.tech)
2. Create project
3. Get connection string
4. Add to Vercel environment variables

### 6. Clerk Setup for Production

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create new application or use existing
3. Go to **API Keys** section
4. Copy **Publishable Key** and **Secret Key**
5. Add to Vercel environment variables
6. Configure **Allowed Origins**:
   - Add your Vercel domain: `https://your-project.vercel.app`
   - Add custom domain if using one

### 7. Deploy

Click "Deploy" button in Vercel dashboard.

### 8. Post-Deployment Database Setup

After deployment, you need to set up the database:

#### Option A: Use Vercel Postgres (Easiest)
1. In Vercel project, go to Storage → Create Database
2. Choose PostgreSQL
3. Vercel will automatically add `DATABASE_URL`
4. Use Prisma migration in Vercel CLI:

```bash
vercel env pull .env.local
npx prisma migrate deploy
```

#### Option B: Manual Database Setup
1. SSH into your Vercel deployment or use local terminal
2. Set environment variables locally
3. Run:

```bash
npx prisma migrate deploy
```

### 9. Test Deployment

1. Visit your Vercel URL: `https://your-project.vercel.app`
2. Test authentication flow
3. Test database connectivity
4. Test AI features

---

## 🔧 404 Error Solutions

### Common 404 Errors and Fixes

#### 1. Dynamic Routes 404 Error
**Problem**: Dynamic routes like `/dashboard/[id]` return 404

**Solution**: Already fixed in `next.config.mjs`:
```javascript
trailingSlash: false,
generateStaticParams: true,
```

#### 2. API Routes 404 Error
**Problem**: API routes return 404 on Vercel

**Solution**: Ensure API routes are in `app/api/` directory:
```
app/
  api/
    route.js
```

#### 3. Static Files 404 Error
**Problem**: Images and static assets return 404

**Solution**: Fixed in `next.config.mjs` with proper image domains:
```javascript
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "randomuser.me",
    },
    {
      protocol: "https",
      hostname: "**.clerk.com",
    },
  ],
}
```

#### 4. Client-Side Navigation 404 Error
**Problem**: Navigation between pages causes 404

**Solution**: Added `vercel.json` with proper rewrites:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/"
    }
  ]
}
```

#### 5. Build-Specific 404 Errors
**Problem**: Pages work locally but 404 on Vercel

**Solution**: 
- Ensure `next.config.mjs` is properly configured
- Check that all pages are in `app/` directory
- Verify `page.js` or `page.jsx` exists in each route folder

---

## 🛠️ Vercel-Specific Configurations

### vercel.json (Already Created)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["iad1"],
  "installCommand": "npm install",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/"
    }
  ]
}
```

### .vercelignore (Already Created)
Optimizes deployment by excluding unnecessary files.

---

## 📊 Monitoring and Debugging

### Check Build Logs
1. Go to Vercel Dashboard
2. Select your project
3. Click "Deployments"
4. Click on latest deployment
5. View "Build Logs"

### Check Function Logs
1. Go to Vercel Dashboard
2. Select your project
3. Click "Functions"
4. View real-time logs

### Environment Variables Check
1. Go to Vercel Dashboard
2. Select your project
3. Click "Settings"
4. Click "Environment Variables"
5. Verify all variables are set

---

## 🔄 Custom Domain Setup (Optional)

### Add Custom Domain
1. Go to Vercel Dashboard
2. Select your project
3. Click "Settings"
4. Click "Domains"
5. Add your custom domain

### DNS Configuration
1. Choose your domain provider
2. Add CNAME record pointing to `cname.vercel-dns.com`
3. Wait for DNS propagation (usually 5-10 minutes)

---

## 🚨 Troubleshooting Common Issues

### Issue: Build Fails
**Solution**:
- Check build logs for specific errors
- Ensure all dependencies are in `package.json`
- Verify environment variables are set correctly

### Issue: Database Connection Failed
**Solution**:
- Verify `DATABASE_URL` is correct
- Check database is accessible from Vercel
- Ensure SSL is enabled for database connection

### Issue: Authentication Not Working
**Solution**:
- Verify Clerk keys are correct
- Check allowed origins in Clerk dashboard
- Ensure middleware is properly configured

### Issue: Images Not Loading
**Solution**:
- Check image domains in `next.config.mjs`
- Verify image URLs are accessible
- Check Next.js image optimization configuration

---

## 📝 Deployment Checklist

- [ ] GitHub repository connected to Vercel
- [ ] Environment variables configured
- [ ] Database set up and connected
- [ ] Clerk authentication configured
- [ ] Google AI API key added
- [ ] Build command: `npm run build`
- [ ] Output directory: `.next`
- [ ] Install command: `npm install`
- [ ] vercel.json configured
- [ ] .vercelignore created
- [ ] next.config.mjs optimized for Vercel
- [ ] Database migrations run
- [ ] Custom domain configured (optional)
- [ ] Testing completed

---

## 🎯 Quick Deploy Commands

### Using Vercel CLI
```bash
# Login to Vercel
vercel login

# Deploy project
vercel

# Deploy to production
vercel --prod

# Set environment variables
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
vercel env add CLERK_SECRET_KEY
vercel env add GOOGLE_GENERATIVE_AI_API_KEY
vercel env add DATABASE_URL
```

### Pull Environment Variables Locally
```bash
vercel env pull .env.local
```

---

## 🆘 Getting Help

If you encounter issues:

1. **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
2. **Next.js Deployment**: [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
3. **Clerk Documentation**: [clerk.com/docs](https://clerk.com/docs)
4. **Prisma Deployment**: [prisma.io/docs/guides/deployment](https://www.prisma.io/docs/guides/deployment)

---

## ✅ Success Indicators

Your deployment is successful when:
- ✅ Build completes without errors
- ✅ Application loads at Vercel URL
- ✅ Authentication works correctly
- ✅ Database operations function properly
- ✅ AI features respond correctly
- ✅ No 404 errors on navigation
- ✅ Images and static assets load properly

---

**Deployment Status**: Configuration files created and ready for Vercel deployment!
