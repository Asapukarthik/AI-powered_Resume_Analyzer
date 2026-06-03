# Backend Implementation Plan for AI-powered Resume Analyzer

This plan outlines the architecture, database schema, API routing, and AI service setup required to build the backend of the AI-powered Resume Analyzer, integrated with the existing Next.js frontend.

---

## Frontend Integration Requirements
Based on our research of the frontend codebase, the backend must support the following features:
1. **User Authentication**:
   - Register account (Name, Email, Password)
   - Sign in (Email, Password)
   - Google Authentication placeholder/session endpoint
   - Update user profile (Name, Email) & Change Password
2. **Resume Management**:
   - File uploads (PDF and DOCX formats supported, up to 5MB capacity)
   - Extract text from documents (PDF parsing using `pdf-parse`, DOCX parsing using `mammoth`)
   - LLM analysis of resume text to generate:
     - ATS Score (0 - 100)
     - Skills Match index (%)
     - Key strengths and weaknesses lists
     - Keyword analysis (categorized into matched, missing, overused)
     - Skill suggestions & Roadmap steps
     - Custom interview questions (Technical, HR, Project)
   - List uploaded resumes (date, size, name, ATS score)
   - Single resume detailed breakdown
   - Re-analyze resume using a different AI model configuration
   - Delete resume from user history
3. **Job Description Matching**:
   - Match an active resume with a target job description text
   - Generate match percentage, missing critical requirements list, and AI-suggested alignments
4. **Interview Prep**:
   - Dynamically generate new tailored interview questions based on the active resume and category (Technical, HR, Project)
5. **Analytics Preferences**:
   - Save global settings: active AI model (e.g. OpenAI GPT-4o, Claude 3.5, etc.), automatic file scanning toggle, email alerts toggle

---

## User Review Required

Please review the following decisions before we proceed with the implementation:

> [!IMPORTANT]
> **1. Database Choice**:
> We propose using **SQLite** for development and local testing since it requires zero local installation or DB servers. We will configure it through Prisma so that migrating to **PostgreSQL** for production requires only updating the `.env` database URL and database provider string in the schema. Please let us know if you prefer to use PostgreSQL directly.
>
> **2. AI LLM Model Provider**:
> The `server/package.json` contains `openai` as a dependency. We will set up an AI service that can call either the OpenAI API or Google Gemini/Vertex API (or a mock service if no API keys are provided). Let us know if you want Gemini integrated or only OpenAI.
>
> **3. Package Module Type**:
> The existing `server/package.json` specifies `"type": "commonjs"`, but `server/index.js` uses ES module `import` statements. We will modify the package.json to `"type": "module"` to resolve this conflict and run Node natively with ES Modules.

---

## Open Questions

> [!WARNING]
> - Do you already have an OpenAI API key or a Google Gemini API key that you plan to test with? If so, we can write the instructions to put it in a `.env` file.
> - For authentication, do you want full token-based JWT (with headers/cookies) or a simplified session mechanism? We propose **JWT in Authorization Headers** as it is standard and easy to hook up to Next.js.

---

## Proposed Changes

### Database Config
#### [NEW] [schema.prisma](file:///d:/PROJECTS/AI-powered_Resume_Analyzer/server/prisma/schema.prisma)
Create the database schema definition using Prisma:
- **User**: id, name, email, passwordHash, tier, createdAt, updatedAt
- **UserSettings**: userId, emailAlerts, autoAnalyze, model
- **Resume**: id, userId, name, size, date, score, skillsMatch, matchedKeywordsCount, missingKeywordsCount, summary, strengths (JSON), weaknesses (JSON), keywords (JSON), recommendedSkills (JSON), suggestedRoadmap (JSON), interviewQuestions (JSON), filePath, createdAt, updatedAt
- **JobMatch**: id, userId, resumeId, jobDescription, matchPercentage, missingSkills (JSON), matchedKeywords (JSON), suggestions (JSON), createdAt

### Server Initialization
#### [MODIFY] [package.json](file:///d:/PROJECTS/AI-powered_Resume_Analyzer/server/package.json)
- Change `"type": "commonjs"` to `"type": "module"`.
- Add prisma client dependencies if needed (e.g., `@prisma/client` and `prisma` CLI tool).
- Update the startup scripts to use `nodemon index.js`.

#### [NEW] [.env](file:///d:/PROJECTS/AI-powered_Resume_Analyzer/server/.env)
- Store database URL (`file:./dev.db`), port (`3001`), client URL (`http://localhost:3000`), JWT secret, and OpenAI/Gemini API keys.

### Middleware & Utilities
#### [NEW] [errorHandler.js](file:///d:/PROJECTS/AI-powered_Resume_Analyzer/server/middleware/errorHandler.js)
- Handle internal errors, validation gaps, and file upload errors gracefully.
#### [NEW] [auth.js](file:///d:/PROJECTS/AI-powered_Resume_Analyzer/server/middleware/auth.js)
- Token verification middleware to secure user-specific endpoints.
#### [NEW] [logger.js](file:///d:/PROJECTS/AI-powered_Resume_Analyzer/server/utils/logger.js)
- Standard console logging utility (used in `index.js`).

### Services (File processing & AI)
#### [NEW] [fileParser.js](file:///d:/PROJECTS/AI-powered_Resume_Analyzer/server/services/fileParser.js)
- Helper service to read files via `multer`, check format, and extract text using `pdf-parse` (for PDFs) and `mammoth` (for DOCX).
#### [NEW] [aiService.js](file:///d:/PROJECTS/AI-powered_Resume_Analyzer/server/services/aiService.js)
- Prompts and system instructions to interact with the LLM.
- Handles parsing unstructured resume text to extract structured data matching the `ResumeData` interface.
- Handles job description matching.
- Handles interview question generation.

### Routing & Controllers
#### [NEW] [authController.js](file:///d:/PROJECTS/AI-powered_Resume_Analyzer/server/controllers/authController.js)
- Handle registration, login, and current session resolution.
#### [NEW] [resumeController.js](file:///d:/PROJECTS/AI-powered_Resume_Analyzer/server/controllers/resumeController.js)
- Handle upload, list, retrieve, delete, and re-analyze operations.
#### [NEW] [jobController.js](file:///d:/PROJECTS/AI-powered_Resume_Analyzer/server/controllers/jobController.js)
- Handle job description matching endpoints.
#### [NEW] [userController.js](file:///d:/PROJECTS/AI-powered_Resume_Analyzer/server/controllers/userController.js)
- Handle profile edits, password adjustments, and settings save.

#### [NEW] [authRoutes.js](file:///d:/PROJECTS/AI-powered_Resume_Analyzer/server/routes/authRoutes.js)
#### [NEW] [resumeRoutes.js](file:///d:/PROJECTS/AI-powered_Resume_Analyzer/server/routes/resumeRoutes.js)
#### [NEW] [userRoutes.js](file:///d:/PROJECTS/AI-powered_Resume_Analyzer/server/routes/userRoutes.js)
Define endpoints and wire up controllers. We will mount these in `server/index.js`.

---

## Verification Plan

### Automated Tests
- Run `npm run dev` in the server and ensure it starts cleanly without import errors.
- Test endpoints (Register, Login, Upload, Match, Settings) using standard cURL or Postman-like queries to verify JSON formats.

### Manual Verification
- Verify successful upload of a test PDF/Word document file.
- Verify structural extraction outputs, verify LLM output schema parsed successfully.
- Cross-verify database entries using Prisma Studio or raw database lookups.
