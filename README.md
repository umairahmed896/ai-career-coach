# AI Career Coach

A modern, AI-powered career guidance platform that helps professionals advance their careers through intelligent resume building, interview preparation, cover letter generation, and industry insights.

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.1.4-black)
![React](https://img.shields.io/badge/React-19.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🚀 Features

### Core Functionality
- **🤖 AI-Powered Career Guidance** - Get personalized career advice and insights powered by advanced AI technology
- **📝 Smart Resume Creation** - Generate ATS-optimized resumes with AI assistance
- **💼 Interview Preparation** - Practice with role-specific questions and get instant feedback to improve your performance
- **📊 Industry Insights** - Stay ahead with real-time industry trends, salary data, and market analysis
- **✉️ Cover Letter Generator** - AI-powered cover letters customized for specific companies and roles
- **🎯 Personalized Onboarding** - Setup your career profile with industry-specific guidance

### Platform Capabilities
- **50+ Industries Covered** - Comprehensive industry data across 15 major sectors
- **1000+ Interview Questions** - Extensive question bank for various roles
- **95% Success Rate** - Proven track record of helping users advance their careers
- **24/7 AI Support** - Round-the-clock assistance with AI-powered features
- **Dark/Light Theme** - Customizable theme support for comfortable usage
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.1.4 (App Router)
- **UI Library**: React 19.0.0
- **Styling**: Tailwind CSS 3.4.1
- **Components**: Radix UI (Accordion, Dialog, Dropdown, etc.)
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts
- **Markdown**: React Markdown, MD Editor
- **PDF**: html2pdf.js
- **Theme**: next-themes

### Backend & Database
- **Database**: PostgreSQL
- **ORM**: Prisma 6.2.1
- **Authentication**: Clerk 6.9.10
- **AI Integration**: Google Generative AI 0.21.0
- **Background Jobs**: Inngest 3.29.3

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint 9
- **Build Tool**: Turbopack (Next.js)
- **Version Control**: Git

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **PostgreSQL** database
- **Clerk account** (for authentication)
- **Google AI API key**

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd ai-career-coach
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

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

### 4. Database Setup

Install Prisma CLI globally:
```bash
npm install -g prisma
```

Generate Prisma client:
```bash
npx prisma generate
```

Run database migrations:
```bash
npx prisma migrate dev
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

```
ai-career-coach/
├── app/                      # Next.js app directory
│   ├── (auth)/              # Authentication routes
│   ├── (main)/              # Main application routes
│   │   ├── dashboard/       # Dashboard page
│   │   ├── resume/          # Resume builder
│   │   ├── interview/       # Interview prep
│   │   ├── ai-cover-letter/ # Cover letter generator
│   │   └── onboarding/      # User onboarding
│   ├── api/                 # API routes
│   ├── lib/                 # Library utilities
│   ├── layout.js            # Root layout
│   ├── page.js              # Landing page
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── ui/                  # UI component library
│   ├── header.jsx           # Navigation header
│   ├── hero.jsx             # Hero section
│   └── theme-provider.jsx   # Theme context
├── actions/                 # Server actions
├── hooks/                   # Custom React hooks
├── lib/                     # Utility functions
├── data/                    # Static data
│   ├── industries.js        # Industry classifications
│   ├── features.js          # Feature definitions
│   ├── testimonial.js       # User testimonials
│   ├── faqs.js              # FAQ content
│   └── howItWorks.js        # Process steps
├── prisma/                  # Database schema
│   └── schema.prisma        # Prisma schema
├── public/                  # Static assets
├── middleware.js            # Auth middleware
├── next.config.mjs          # Next.js configuration
├── tailwind.config.mjs      # Tailwind configuration
├── package.json             # Dependencies and scripts
└── README.md                # This file
```

## 🗄️ Database Schema

### Core Models

**User**
- Basic info: id, clerkUserId, email, name, imageUrl
- Profile: bio, experience, skills[]
- Relations: assessments, resume, coverLetters
- Industry association with insights

**Assessment**
- Quiz scores and answers
- Category-based (Technical, Behavioral)
- AI-generated improvement tips
- User performance tracking

**Resume**
- One-to-one with User
- Markdown content storage
- ATS scoring and feedback
- Timestamp tracking

**CoverLetter**
- One-to-many with User
- Job-specific customization
- Company and job title tracking
- Draft/completed status

**IndustryInsight**
- Industry-specific data
- Salary ranges by role
- Growth rates and demand levels
- Market trends and outlook
- Recommended skills

## 🌐 Industry Coverage

The platform covers **15 major industries** with **180+ sub-industries**:

1. **Technology** - Software Dev, AI/ML, Cybersecurity, Cloud Computing
2. **Financial Services** - Banking, FinTech, Investment Banking
3. **Healthcare & Life Sciences** - Biotech, Telemedicine, Genomics
4. **Manufacturing & Industrial** - Automotive, Aerospace, 3D Printing
5. **Retail & E-commerce** - E-commerce, Fashion, D2C
6. **Media & Entertainment** - Gaming, Streaming, Digital Marketing
7. **Education & Training** - EdTech, Online Learning, Corporate Training
8. **Energy & Utilities** - Renewable Energy, Clean Tech, Smart Grid
9. **Professional Services** - Consulting, Legal, HR
10. **Telecommunications** - 5G, IoT, Network Infrastructure
11. **Transportation & Logistics** - EV, Autonomous Vehicles, Supply Chain
12. **Agriculture & Food** - AgTech, Vertical Farming, Food Processing
13. **Construction & Real Estate** - Smart Buildings, Sustainable Construction
14. **Hospitality & Tourism** - Travel Tech, Event Planning
15. **Non-Profit & Social Services** - Charitable Organizations, Advocacy

## 🎨 Design & UI/UX

### Design System
- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS with custom components
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Theme**: Dark mode by default with light mode support
- **Font**: Inter (Google Fonts)

### Key Design Features
- Responsive grid layouts
- Mobile-first design approach
- Smooth animations and transitions
- High contrast dark theme
- Interactive hover states
- Gradient backgrounds and accent colors

## 🔒 Security & Authentication

### Authentication Flow
- Clerk middleware for route protection
- Protected routes: /dashboard, /resume, /interview, /ai-cover-letter, /onboarding
- Automatic redirect to sign-in for unauthenticated users
- User sync on each page load
- Session management with Clerk

### Security Features
- Environment variable protection
- API key management
- Secure database connections
- Input validation with Zod
- SQL injection prevention via Prisma

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack

# Production
npm run build        # Build for production
npm start            # Start production server

# Quality
npm run lint         # Run ESLint

# Database
npx prisma generate  # Generate Prisma client
npx prisma migrate dev  # Run database migrations
npx prisma studio    # Open Prisma Studio (database GUI)
```

## 🛠️ Development Features

### Recent Fixes & Improvements
1. ✅ Removed Watch Demo link from hero section
2. ✅ Fixed Next.js Turbopack root directory warning
3. ✅ Updated middleware to fix authentication redirect issues
4. ✅ Converted Header to client component to fix hydration errors
5. ✅ Added image loading optimization
6. ✅ Updated deprecated Clerk props (afterSignOutUrl → fallbackRedirectUrl)
7. ✅ Moved checkUser to layout to ensure user sync

## 🚀 Deployment

### Production Requirements
- PostgreSQL database (hosted or local)
- Clerk application configuration
- Google AI API access
- Environment variables setup
- Build process execution

### Recommended Hosting
- **Vercel** (optimized for Next.js)
- **Railway** (database hosting)
- **Supabase** (PostgreSQL alternative)
- Any Node.js hosting platform

### Deployment Steps

1. Build the application:
```bash
npm run build
```

2. Set environment variables in your hosting platform

3. Deploy the application

4. Run database migrations on production:
```bash
npx prisma migrate deploy
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**UMAIR AHMED**

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Authentication powered by [Clerk](https://clerk.com/)
- AI features using [Google Generative AI](https://ai.google.dev/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

## 📞 Support

For support, please open an issue in the repository or contact the development team.

---

**Made with ❤️ by UMAIR AHMED**
