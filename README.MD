<![CDATA[# 🤖 AI-Powered Resume Analyzer

An intelligent, full-stack ATS (Applicant Tracking System) resume analyzer that leverages **Google Gemini 2.5 Flash** to give job seekers deep, actionable insights into how their resume stacks up against a target job description.

Upload your resume, paste a job description, and get instant feedback — from ATS scoring and keyword analysis to skill-gap roadmaps and AI-generated interview questions.

---

## ✨ Features

| Category | What You Get |
|---|---|
| **ATS Score Analysis** | Overall score, keyword match %, experience & project scores, formatting evaluation |
| **Keyword Intelligence** | Matched, missing, and overused keywords with importance levels |
| **Skill Gap Analysis** | Current skills vs. missing skills, with recommended skills to learn |
| **Learning Roadmap** | Step-by-step career roadmap with timelines and skill targets |
| **Interview Prep** | 20+ technical, 10+ HR, and 10+ project-based practice questions with answers |
| **Resume Optimization** | AI-rewritten summary and improved bullet points |
| **Recruiter Perspective** | Hire recommendation and risk-factor analysis from a recruiter's point of view |
| **Resume History** | Track all past analyses with scores and trends over time |
| **Cloud Storage** | Resumes are uploaded to Cloudinary for persistent storage |
| **Auth System** | Email/password registration + Google OAuth 2.0 sign-in |

---

## 🏗️ Architecture

```
┌──────────────────────────┐         ┌──────────────────────────┐
│        Client            │  HTTP   │         Server           │
│   Next.js 16 (React 19)  │◄──────►│   Express 5 (Node.js)    │
│   Tailwind CSS 4         │  REST   │   Prisma ORM             │
│   Framer Motion          │         │   Google Gemini AI        │
│   shadcn/ui + Radix UI   │         │   Cloudinary Storage      │
└──────────────────────────┘         └───────────┬──────────────┘
                                                 │
                                     ┌───────────▼──────────────┐
                                     │      PostgreSQL          │
                                     │   (Users, Resumes,       │
                                     │    Job Matches)          │
                                     └──────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend (`/client`)

- **Framework:** [Next.js 16](https://nextjs.org/) with React 19 & TypeScript
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/) + [React Icons](https://react-icons.github.io/react-icons/)
- **HTTP Client:** [Axios](https://axios-http.com/)
- **File Upload:** [react-dropzone](https://react-dropzone.js.org/)
- **Notifications:** [react-hot-toast](https://react-hot-toast.com/)
- **Auth:** [@react-oauth/google](https://www.npmjs.com/package/@react-oauth/google) (Google OAuth 2.0)
- **Visual Effects:** [tsparticles](https://particles.js.org/)
- **Fonts:** Outfit (sans) + Roboto Mono (mono) via `next/font/google`

### Backend (`/server`)

- **Runtime:** Node.js with ES Modules
- **Framework:** [Express 5](https://expressjs.com/)
- **AI Engine:** [Google Gemini 2.5 Flash](https://ai.google.dev/) via `@google/genai`
- **ORM:** [Prisma 5](https://www.prisma.io/) with PostgreSQL
- **Auth:** JWT (`jsonwebtoken`) + bcrypt password hashing + Google OAuth
- **File Parsing:** `pdf-parse` (PDF) + `mammoth` (DOCX/DOC)
- **File Uploads:** `multer` (memory storage, 10 MB limit)
- **Cloud Storage:** [Cloudinary](https://cloudinary.com/)
- **Validation:** [Zod 4](https://zod.dev/)

### Database

- **PostgreSQL** with three core models:
  - `User` — accounts, tiers, settings
  - `Resume` — uploaded resumes with full AI analysis results
  - `JobMatch` — job description match analysis with keyword & skill data

---

## 📂 Project Structure

```
AI-powered_Resume_Analyzer/
├── client/                          # Next.js frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx             # Landing page
│   │   │   ├── layout.tsx           # Root layout (fonts, providers)
│   │   │   ├── globals.css          # Global styles & Tailwind config
│   │   │   ├── login/               # Login page
│   │   │   ├── register/            # Registration page
│   │   │   └── dashboard/           # Dashboard page
│   │   ├── components/
│   │   │   ├── dashboard/
│   │   │   │   ├── OverviewView.tsx      # Dashboard overview & scores
│   │   │   │   ├── ATSAnalysisView.tsx   # Detailed ATS breakdown
│   │   │   │   ├── SkillsGapView.tsx     # Skill gap analysis
│   │   │   │   ├── InterviewView.tsx     # Interview Q&A practice
│   │   │   │   ├── JobMatcherView.tsx    # Job description matcher
│   │   │   │   ├── UploadView.tsx        # Resume upload interface
│   │   │   │   ├── ResumeHistoryView.tsx # Past resume analyses
│   │   │   │   └── SettingsView.tsx      # User settings
│   │   │   ├── layout/              # Shared layout components
│   │   │   ├── upload/              # Upload-related components
│   │   │   └── ui/                  # shadcn/ui primitives
│   │   ├── hooks/                   # Custom React hooks & stores
│   │   ├── services/                # API service layer (Axios)
│   │   ├── store/                   # State management
│   │   ├── lib/                     # Utility functions
│   │   └── types/                   # TypeScript type definitions
│   ├── public/                      # Static assets
│   ├── package.json
│   └── tailwind.config.js
│
├── server/                          # Express backend
│   ├── index.js                     # App entry point
│   ├── controllers/
│   │   ├── authController.js        # Register, login, Google OAuth
│   │   ├── resumeController.js      # Upload, analyze, CRUD resumes
│   │   └── userController.js        # User profile management
│   ├── routes/
│   │   ├── authRoutes.js            # POST /api/auth/*
│   │   ├── resumeRoutes.js          # POST/GET/DELETE /api/resumes/*
│   │   └── userRoutes.js            # GET /api/users/*
│   ├── services/
│   │   ├── aiService.js             # Gemini AI resume analysis
│   │   └── fileParser.js            # PDF & DOCX text extraction
│   ├── middleware/                   # Auth & error handling middleware
│   ├── validators/                  # Zod schemas for AI response validation
│   ├── utils/                       # Cloudinary upload helpers
│   ├── prisma/
│   │   └── schema.prisma            # Database schema
│   └── package.json
│
└── README.MD
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **PostgreSQL** running locally or a hosted instance
- **Google Gemini API Key** — [Get one here](https://aistudio.google.com/apikey)
- **Google OAuth Client ID** — [Create in Google Cloud Console](https://console.cloud.google.com/apis/credentials)
- **Cloudinary Account** — [Sign up free](https://cloudinary.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/AI-powered_Resume_Analyzer.git
cd AI-powered_Resume_Analyzer
```

### 2. Set Up the Server

```bash
cd server
npm install
```

Create a `.env` file in `/server`:

```env
PORT=3001
CLIENT_URL=http://localhost:3000
DATABASE_URL="postgresql://<user>:<password>@localhost:5432/ai-resume-analyzer"
JWT_SECRET="your_jwt_secret_key"
GEMINI_API_KEY="your_gemini_api_key"
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
```

Initialize the database:

```bash
npx prisma generate
npx prisma db push
```

Start the server:

```bash
npm run dev
```

The API will be available at `http://localhost:3001`.

### 3. Set Up the Client

```bash
cd client
npm install
```

Create a `.env.local` file in `/client`:

```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your_google_oauth_client_id"
```

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login with email & password |
| `POST` | `/api/auth/google` | Sign in with Google OAuth |
| `GET`  | `/api/auth/me` | Get current authenticated user |

### Resumes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/resumes/analyze` | Upload resume + job description for AI analysis |
| `GET`  | `/api/resumes/` | Get all resumes for authenticated user |
| `DELETE` | `/api/resumes/:id` | Delete a specific resume |

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/health` | API health check |

> **Note:** All `/api/resumes` endpoints require a valid JWT token in the `Authorization: Bearer <token>` header.

---

## 🔑 Environment Variables Reference

### Server (`/server/.env`)

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: `3001`) |
| `CLIENT_URL` | Frontend URL for CORS (default: `http://localhost:3000`) |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `GEMINI_API_KEY` | Google Gemini API key |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

### Client (`/client/.env.local`)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth 2.0 Client ID |

---

## 🔄 How It Works

1. **Upload** — User uploads a resume (PDF or DOCX, up to 10 MB) along with a target job description.
2. **Parse** — The server extracts raw text from the file using `pdf-parse` or `mammoth`.
3. **Analyze** — The extracted text and job description are sent to **Google Gemini 2.5 Flash** with a structured prompt requesting ATS scoring, keyword analysis, skill gaps, interview questions, and more.
4. **Validate** — The AI response is parsed as JSON and validated against a **Zod schema** to ensure data integrity.
5. **Store** — The resume file is uploaded to **Cloudinary**, and the full analysis is persisted in **PostgreSQL** via Prisma.
6. **Display** — The client renders the results across multiple dashboard views: Overview, ATS Analysis, Skills Gap, Interview Prep, and more.

---

## 📄 License

This project is open-source and available under the [ISC License](https://opensource.org/licenses/ISC).
]]>
