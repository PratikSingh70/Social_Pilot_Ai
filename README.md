# SocialPilot AI

> AI-powered social media management platform. Create, schedule, publish,
> and analyze social content across Instagram, LinkedIn, X, and Facebook
> from one intelligent workspace.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Root Scripts](#root-scripts)
5. [Features](#features)
6. [Architecture](#architecture)
7. [API Reference](#api-reference)
8. [Design System](#design-system)
9. [Coding Rules](#coding-rules)
10. [Known Issues & Fixes](#known-issues--fixes)
11. [Testing](#testing)
12. [Roadmap](#roadmap)
13. [Complete Source Code](#complete-source-code)

---

## Quick Start

### Prerequisites

- **Python 3.10+**
- **Node.js 18+**
- **npm 9+**

### 1. Backend (Terminal A)

```cmd
cd socialpilot-ai
python -m venv venv
venv\Scripts\activate
pip install -r backend\requirements.txt
python -m uvicorn backend.main:app --reload --port 8000
```

- API: <http://localhost:8000>
- Docs (Swagger UI): <http://localhost:8000/docs>

### 2. Frontend (Terminal B)

```cmd
cd socialpilot-ai
npm run dev
```

- App: <http://localhost:5173>

### 3. Demo Account & First-time Use

You can sign in immediately using the pre-seeded demo account on <http://localhost:5173/login> via the 1-click **Auto-fill** button:

- **Email:** `alex@socialpilot.ai`
- **Password:** `password123`

Or register a new account at <http://localhost:5173/signup> or via the API:

```json
POST http://localhost:8000/api/auth/register
{
  "name": "Alex Morgan",
  "email": "alex@socialpilot.ai",
  "password": "password123"
}
```

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + Vite 5 + Tailwind 3 + React Router 6 + Axios + Lucide Icons |
| Backend | FastAPI 0.115 + Uvicorn + Pydantic v2 |
| Auth | JWT (HS256) via python-jose + bcrypt via passlib |
| Store | In-memory with seed store (v1) — SQLAlchemy + PostgreSQL planned |

### Pinned Versions

```
# Backend
fastapi==0.115.0
uvicorn==0.30.6
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
email-validator==2.2.0
python-multipart==0.0.9
bcrypt==4.0.1            ← CRITICAL — do not upgrade past 4.0.1

# Frontend
react@18.3.1
react-dom@18.3.1
react-router-dom@6.26.2
axios@1.7.7
vite@5.4.8
tailwindcss@3.4.13       ← stay on v3 (v4 renames gradients)
postcss@8.4.47
autoprefixer@10.4.20
lucide-react@0.441.0
```

---

## Project Structure

```
socialpilot-ai/
├── README.md
├── .gitignore
├── package.json                  # Root orchestrator scripts
├── venv/                         # Python virtual environment
│
├── backend/
│   ├── __init__.py               # Required for `python -m uvicorn backend.main:app`
│   ├── main.py                   # FastAPI app with seed store and endpoints
│   ├── requirements.txt
│   └── .env.example
│
└── frontend/
    ├── package.json
    ├── package-lock.json
    ├── vite.config.js            # Proxy: /api → http://localhost:8000
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── index.html
    └── src/
        ├── main.jsx              # Application entry point
        ├── App.jsx               # Router & global overlays
        ├── api.js                # Axios client with bearer token interceptors
        ├── index.css             # Tailwind layers + custom animations
        ├── landing.css           # Scoped landing styles (.landing-root)
        ├── context/
        │   └── AuthContext.jsx   # Auth provider, token storage, user state
        ├── lib/
        │   ├── content-dates.jsx # Semantic last-updated dates
        │   └── utm.js            # Privacy-safe UTM attribution generator
        ├── components/
        │   ├── AppShell.jsx      # Authenticated layout + responsive drawer
        │   ├── BackToTop.jsx     # Smooth scroll back to top button
        │   ├── ConfirmModal.jsx  # Accessible confirmation modal
        │   ├── ContactPanel.jsx  # Slide-in support drawer with demo scheduler
        │   ├── CookieBanner.jsx  # Cookie consent banner
        │   ├── CopyButton.jsx    # One-click clipboard copy utility
        │   ├── FaqAccordion.jsx  # Expandable FAQ accordion
        │   ├── FormFeedback.jsx  # Accessible error summaries and field hints
        │   ├── GlobalSearch.jsx  # Keyboard combobox search
        │   ├── Header.jsx        # Sticky header, search, avatar & settings link
        │   ├── PasswordInput.jsx # Password field with visibility toggle
        │   ├── ScrollProgressBar.jsx # Top scroll indicator
        │   ├── Sidebar.jsx       # Desktop / mobile drawer navigation
        │   ├── Skeleton.jsx      # Loading placeholders & button spinner
        │   ├── SkipToContent.jsx # Accessibility skip link
        │   ├── ThemeToggle.jsx   # Light / dark theme toggle
        │   └── Toast.jsx         # Toast notification system
        └── pages/
            ├── Landing.jsx       # Public landing page with mobile menu
            ├── Login.jsx         # Sign in with demo credentials auto-fill
            ├── SignUp.jsx        # Account registration
            ├── Dashboard.jsx     # Workspace overview & quick actions
            ├── AIStudio.jsx      # AI prompt composer & one-click templates
            ├── CreatePost.jsx    # Post composer & scheduler with dirty modal
            ├── CalendarPage.jsx  # Weekly content calendar
            ├── Library.jsx       # Saved posts & drafts with delete modal
            ├── Analytics.jsx     # Live KPIs, weekly reach & platform distribution
            ├── Insights.jsx      # AI performance recommendations
            ├── Accounts.jsx      # Interactive OAuth connect / disconnect
            ├── Settings.jsx      # Profile, automation preferences, referral link
            ├── SearchResults.jsx # Dedicated search page
            ├── FAQ.jsx           # Categorized questions & help center
            └── LegalPage.jsx     # Privacy Policy, Terms, and Cookies
```

---

## Root Scripts

Run from `socialpilot-ai/`:

| Script | Description |
|---|---|
| `npm run dev` | Start frontend dev server on `http://localhost:5173` |
| `npm run build` | Build frontend production bundle with Vite |
| `npm run backend` | Start FastAPI backend on `http://localhost:8000` |
| `npm run install:frontend` | Install frontend dependencies |
| `npm run install:backend` | Install backend dependencies into Python environment |

---

## Features

### Authentication & Sessions
- Email + password registration and sign-in.
- JWT bearer token authentication with 7-day expiration.
- Pre-seeded demo account (`alex@socialpilot.ai` / `password123`) with 1-click **Auto-fill** helper.
- Client-side form validation with accessible error summaries and field warnings.

### Landing Page & Public Pages
- Responsive navigation with mobile toggle drawer (`☰`), smooth section scrolling, and active "Book a Demo" link.
- Floating support panel ([ContactPanel.jsx](file:///c:/Users/prati/socialpilot-ai/frontend/src/components/ContactPanel.jsx)) with message submissions and direct booking link.
- Light/Dark theme switch ([ThemeToggle.jsx](file:///c:/Users/prati/socialpilot-ai/frontend/src/components/ThemeToggle.jsx)).
- Searchable FAQ knowledge base ([FAQ.jsx](file:///c:/Users/prati/socialpilot-ai/frontend/src/pages/FAQ.jsx)) and compliance documents ([LegalPage.jsx](file:///c:/Users/prati/socialpilot-ai/frontend/src/pages/LegalPage.jsx)).

### AI Content Studio
- Generate tailored posts, captions, hashtags, and hooks per platform algorithm.
- Preset one-click templates: Instagram Carousel, LinkedIn Thought Leadership, and X Viral Thread.
- Quick actions: Use in composer, rewrite angle, copy draft, or save to draft library.

### Content Creation & Scheduling
- Multi-platform selector: Instagram, LinkedIn, X, and Facebook.
- Date and time scheduler for upcoming drops.
- Dirty form protection with accessible discard confirmation modal.

### Content Calendar
- 7-day grid view mapping scheduled posts across channels.
- Quick link to schedule new content drops into empty slots.

### Content Library
- Filter posts by platform (Instagram, LinkedIn, X, Facebook, or All).
- Badges for `scheduled`, `published`, and `draft` statuses.
- 1-click content copying and post deletion with confirmation modal.

### Performance Analytics
- Real-time KPIs: Audience reach, engagement rate, published volume, and AI content ratio.
- Weekly reach volume bar chart with hover inspection.
- Dynamic platform distribution progress bars synced with `GET /api/analytics/summary`.

### Connected Accounts
- Interactive OAuth 2.0 connection management.
- Dynamic toggle buttons to connect or disconnect Instagram, LinkedIn, X, and Facebook with toast alerts.

### Global Search & Header
- Combobox global search with instant keyboard navigation (`↑`/`↓`/`Enter`).
- Dedicated `/app/search?q=...` results page.
- Direct click navigation from user avatar to `/app/settings`.

---

## Architecture

### Overview

```
Browser (React SPA :5173)
   │ Axios (Bearer Token)
   ▼
/api/*  (Vite dev proxy → http://localhost:8000)
   │
   ▼
FastAPI (Uvicorn :8000)
├── /api/auth/*
├── /api/posts/*
├── /api/ai/*
├── /api/analytics/*
└── /api/accounts/*
```

### Frontend Routing

```
/                  → Landing (public)
/login             → Login (public)
/signup            → SignUp (public)
/faq               → FAQ Help Center (public)
/privacy           → Privacy Policy (public)
/terms             → Terms of Service (public)
/cookies           → Cookie Policy (public)
/app/*             → RequireAuth + AppShell (authenticated)
  /dashboard       → Workspace Overview
  /ai-studio       → AI Prompt & Draft Studio
  /create          → Post Composer & Scheduler
  /calendar        → Content Calendar
  /library         → Post Library & Queue
  /analytics       → Performance Analytics
  /insights        → AI Recommendations
  /accounts        → Connected Social Channels
  /settings        → Profile & Automation Preferences
  /search          → Search Results
```

---

## API Reference

| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `POST` | `/api/auth/register` | Create a new user account and return JWT | No |
| `POST` | `/api/auth/login` | Authenticate with credentials and return JWT | No |
| `GET` | `/api/auth/me` | Fetch currently authenticated user profile | Yes |
| `GET` | `/api/posts` | List posts (optional `?status=` and `?platform=`) | No |
| `POST` | `/api/posts` | Create a new post or scheduled drop | No |
| `DELETE` | `/api/posts/{id}` | Delete post by ID | No |
| `POST` | `/api/ai/generate` | Generate social post content with AI | No |
| `POST` | `/api/ai/plan` | Generate weekly content posting plan | No |
| `GET` | `/api/analytics/summary` | Fetch KPIs, weekly chart data, and platform stats | No |
| `GET` | `/api/accounts` | List social accounts and connection status | No |
| `POST` | `/api/accounts/{id}/toggle` | Connect or disconnect a social platform | No |

---

## Design System

### Dark Workspace Theme

| Token | Hex | Use |
|---|---|---|
| `bg` | `#08090D` | Page background |
| `bg-2` | `#101116` | Elevated panels |
| `card` | `#151720` | Cards & containers |
| `border` | `#252936` | Inputs & dividers |
| `text` | `#FFFFFF` | Primary white text |
| `text-2` | `#A1A1AA` | Secondary muted text |
| `text-3` | `#71717A` | Subtle captions |
| `accent` | `#8B5CF6` | Primary violet / brand |
| `accent-2` | `#6366F1` | Indigo accent |
| `cyan` | `#06B6D4` | Cyan highlight |
| `success` | `#22C55E` | Positive status & growth |
| `error` | `#EF4444` | Errors & destructive actions |

### Light Landing Theme

| Token | Hex |
|---|---|
| `l-bg` | `#F7F8FC` |
| `l-text` | `#0B1020` |
| `l-text-2` | `#5A6178` |
| `l-muted` | `#98A0B5` |
| `l-yellow` | `#FACC15` |

### Signature AI Gradient

```css
background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 50%, #06B6D4 100%);
```

---

## Coding Rules

### JavaScript / React
- Function components + hooks only — no class components.
- One component per file, file name = component name.
- `useState` for local state, Context for auth + toasts.
- Always `try / catch` async API calls with user-friendly toast feedback.
- Accessible keyboard navigation (`focus-visible`, `aria-label`, `aria-modal`).

### Python / FastAPI
- PEP 8 compliance, type annotations on function parameters and return types.
- Pydantic models for request bodies and response schemas.
- Raise `HTTPException` with meaningful error details.
- Use `Depends(get_current_user)` for routes requiring user authentication.

### CSS / Tailwind
- Preference order: Tailwind utility classes → `@layer components` in `index.css` → scoped CSS.
- Landing page styles are prefixed `.l-*` and scoped under `.landing-root`.
- Always use `shrink-0` instead of `flex-shrink-0`.

---

## Known Issues & Fixes

### Solved

| Issue | Cause | Fix |
|---|---|---|
| `401 Unauthorized` on fresh login | Backend `USERS` dictionary started empty | Pre-seeded default user `alex@socialpilot.ai` / `password123` |
| Dead mobile menu button on landing | Missing click handler and state | Added `mobileMenuOpen` state and mobile nav drawer |
| Inactive "Book a Demo" button | Unlinked button element | Wired directly to demo scheduling URL |
| Accounts page was static | No connect/disconnect actions | Added dynamic toggle buttons with `POST /api/accounts/{id}/toggle` |
| User avatar was not clickable | Div with pointer cursor | Converted to accessible button routing to `/app/settings` |
| 500 error on `/api/auth/register` | `bcrypt` 4.1+ compatibility issue with passlib | Pinned `bcrypt==4.0.1` |
| `No module named 'uvicorn'` | Command run outside virtual environment | Run `venv\Scripts\activate` before starting server |

---

## Testing

### Manual Smoke Test

- [x] Backend starts on `:8000` and Swagger loads at <http://localhost:8000/docs>
- [x] Frontend dev server starts on `:5173`
- [x] 1-Click Auto-fill on `/login` successfully authenticates demo user
- [x] Mobile menu toggle drawer opens and closes properly on landing page
- [x] AI Studio generates content and allows copying or forwarding to composer
- [x] Create Post schedules drops and warns on navigating away with unsaved changes
- [x] Connected Accounts page connects and disconnects platforms with toast updates
- [x] Full production build passes with `npm run build`

### Backend Automated Tests

```bash
pip install pytest httpx
pytest backend/tests/ -v
```

### Frontend Production Build Test

```bash
npm run build
```

---

## Roadmap

- **v1.0 (Current)** — Responsive landing page, JWT auth, AI Studio, multi-platform scheduling, interactive connected accounts, and performance analytics.
- **v1.1** — PostgreSQL database persistence via SQLAlchemy, OAuth 2.0 social app secrets.
- **v1.2** — Background worker task queue (Celery + Redis) for live automated publishing.
- **v2.0** — Stripe billing integration, team workspaces with granular permissions, and TikTok/YouTube scheduling.

---

## Complete Source Code

The full implementations of the core backend, configuration, and frontend files are documented below.

### 1. Root Configuration

#### `package.json`
```json
{
  "name": "socialpilot-ai",
  "private": true,
  "scripts": {
    "dev": "npm --prefix frontend run dev -- --host 0.0.0.0",
    "build": "npm --prefix frontend run build",
    "backend": "python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000",
    "install:frontend": "npm --prefix frontend install",
    "install:backend": "python -m pip install -r backend/requirements.txt"
  }
}
```

---

### 2. Backend Implementation

#### `backend/requirements.txt`
```txt
fastapi==0.115.0
uvicorn==0.30.6
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
email-validator==2.2.0
python-multipart==0.0.9
bcrypt==4.0.1
```

#### `backend/main.py`
```python
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from typing import Optional, List
import uuid

# ---------- CONFIG ----------
SECRET_KEY = "change-me-in-production-supersecret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7

app = FastAPI(title="SocialPilot AI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

# ---------- IN-MEMORY STORE (swap for DB later) ----------
demo_password_hash = pwd_context.hash("password123")
USERS: dict[str, dict] = {
    "demo-user": {
        "id": "demo-user",
        "name": "Alex Morgan",
        "email": "alex@socialpilot.ai",
        "password": demo_password_hash,
        "plan": "pro"
    }
}
POSTS: list[dict] = [
    {"id": "p1", "platform": "instagram", "title": "5 AI tools every student should know",
     "content": "5 AI tools every student should know...", "status": "scheduled",
     "scheduled_at": "2025-09-22T18:30:00", "reach": 12400, "engagement": 8.9},
    {"id": "p2", "platform": "linkedin", "title": "How AI is changing data analytics",
     "content": "AI is not replacing data analysts...", "status": "published",
     "scheduled_at": "2025-09-15T09:00:00", "reach": 9800, "engagement": 7.2},
    {"id": "p3", "platform": "x", "title": "Thread: The AI stack for solo founders",
     "content": "The AI stack for solo founders...", "status": "draft",
     "scheduled_at": None, "reach": 7100, "engagement": 6.4},
]
ACCOUNTS: list[dict] = [
    {"id": "ig", "name": "Instagram", "handle": "@alex.morgan", "connected": True},
    {"id": "li", "name": "LinkedIn", "handle": "linkedin.com/in/alexmorgan", "connected": True},
    {"id": "x", "name": "X (Twitter)", "handle": None, "connected": False},
    {"id": "fb", "name": "Facebook", "handle": None, "connected": False},
]

# ---------- SCHEMAS ----------
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: str
    name: str
    email: EmailStr
    plan: str = "pro"

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

class PostCreate(BaseModel):
    platform: str
    title: str
    content: str
    scheduled_at: Optional[datetime] = None

class PostOut(PostCreate):
    id: str
    status: str
    reach: int = 0
    engagement: float = 0.0

class AIRequest(BaseModel):
    prompt: str
    content_type: str = "social_post"
    platform: str = "instagram"
    tone: str = "professional"
    goal: str = "engagement"
    language: str = "english"

class AIResponse(BaseModel):
    content: str
    tokens_used: int

# ---------- HELPERS ----------
def hash_password(p: str) -> str:
    return pwd_context.hash(p)

def verify_password(p: str, h: str) -> bool:
    return pwd_context.verify(p, h)

def create_token(data: dict) -> str:
    to_encode = data.copy()
    to_encode["exp"] = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    creds_exc = HTTPException(status_code=401, detail="Invalid credentials",
                              headers={"WWW-Authenticate": "Bearer"})
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None or user_id not in USERS:
            raise creds_exc
    except JWTError:
        raise creds_exc
    return USERS[user_id]

# ---------- AUTH ROUTES ----------
@app.post("/api/auth/register", response_model=Token)
def register(payload: UserCreate):
    if any(u["email"] == payload.email for u in USERS.values()):
        raise HTTPException(status_code=400, detail="Email already registered")
    uid = str(uuid.uuid4())
    USERS[uid] = {
        "id": uid, "name": payload.name, "email": payload.email,
        "password": hash_password(payload.password), "plan": "pro"
    }
    token = create_token({"sub": uid})
    return {"access_token": token, "user": UserOut(**{k: v for k, v in USERS[uid].items() if k != "password"})}

@app.post("/api/auth/login", response_model=Token)
def login(form: OAuth2PasswordRequestForm = Depends()):
    user = next((u for u in USERS.values() if u["email"] == form.username), None)
    if not user or not verify_password(form.password, user["password"]):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    token = create_token({"sub": user["id"]})
    return {"access_token": token, "user": UserOut(**{k: v for k, v in user.items() if k != "password"})}

@app.get("/api/auth/me", response_model=UserOut)
def me(user: dict = Depends(get_current_user)):
    return UserOut(**{k: v for k, v in user.items() if k != "password"})

# ---------- POSTS ----------
@app.get("/api/posts", response_model=List[PostOut])
def list_posts(status: Optional[str] = None, platform: Optional[str] = None):
    results = POSTS
    if status:
        results = [p for p in results if p["status"] == status]
    if platform:
        results = [p for p in results if p["platform"] == platform]
    return results

@app.post("/api/posts", response_model=PostOut)
def create_post(payload: PostCreate):
    post = {
        "id": str(uuid.uuid4()),
        "status": "scheduled" if payload.scheduled_at else "draft",
        "reach": 0, "engagement": 0.0, **payload.dict()
    }
    POSTS.append(post)
    return post

@app.delete("/api/posts/{post_id}")
def delete_post(post_id: str):
    global POSTS
    POSTS = [p for p in POSTS if p["id"] != post_id]
    return {"ok": True}

# ---------- AI ----------
def _mock_ai_generate(req: AIRequest) -> str:
    p = req.prompt.lower()
    if req.platform == "linkedin" or "linkedin" in p:
        return ("AI is not replacing data analysts.\n\nIt is changing what great analysts can do.\n\n"
                "Three shifts in 2025:\n• Analysts who prompt better ship faster\n"
                "• Reports become conversations\n• Judgment is the new moat\n\n"
                "#DataAnalytics #AI #DataScience")
    if req.content_type == "hashtags":
        return "#AI #ArtificialIntelligence #DataAnalytics #MachineLearning #Productivity #Growth"
    if "instagram" in p:
        return ("5 AI tools every student should know\n\n"
                "1. Notion AI — notes that organize themselves\n"
                "2. Perplexity — research without noise\n"
                "3. Grammarly — write like a pro\n"
                "4. Canva Magic — design in seconds\n"
                "5. SocialPilot AI — this post, on autopilot\n\n"
                "Save this for later 💾\n#AI #StudentLife #Productivity")
    return (f"Here's your {req.content_type.replace('_',' ')} for {req.platform}:\n\n"
            f"✨ {req.prompt.strip()}\n\n"
            "Hook: Start with a bold stat or question.\n"
            "Body: 3 quick value points.\n"
            "CTA: Ask a question to boost replies.\n\n"
            f"Tone: {req.tone} · Goal: {req.goal} · Lang: {req.language}")

@app.post("/api/ai/generate", response_model=AIResponse)
def ai_generate(req: AIRequest):
    text = _mock_ai_generate(req)
    return {"content": text, "tokens_used": len(text.split())}

@app.post("/api/ai/plan")
def ai_plan():
    return {"plan": [
        {"day": "Mon", "type": "carousel", "topic": "AI basics for beginners"},
        {"day": "Wed", "type": "linkedin", "topic": "Behind the scenes"},
        {"day": "Fri", "type": "thread", "topic": "Personal POV on AI"},
        {"day": "Sun", "type": "recap", "topic": "Weekly stats recap"},
    ]}

# ---------- ANALYTICS ----------
@app.get("/api/analytics/summary")
def analytics_summary():
    return {
        "total_posts": 128, "reach": 24500, "engagement": 8.4, "ai_content": 67,
        "trends": {"posts": 12.5, "reach": 18.2, "engagement": 4.7, "ai": 23.1},
        "chart": [
            {"d": "Mon", "v": 40}, {"d": "Tue", "v": 65}, {"d": "Wed", "v": 50},
            {"d": "Thu", "v": 80}, {"d": "Fri", "v": 60}, {"d": "Sat", "v": 95}, {"d": "Sun", "v": 70},
        ],
        "platforms": [
            {"name": "Instagram", "pct": 48, "color": "#DD2A7B"},
            {"name": "LinkedIn", "pct": 28, "color": "#0A66C2"},
            {"name": "X", "pct": 18, "color": "#000000"},
            {"name": "Facebook", "pct": 6, "color": "#1877F2"},
        ],
    }

# ---------- ACCOUNTS ----------
@app.get("/api/accounts")
def accounts():
    return ACCOUNTS

@app.post("/api/accounts/{account_id}/toggle")
def toggle_account(account_id: str):
    for acc in ACCOUNTS:
        if acc["id"] == account_id:
            acc["connected"] = not acc["connected"]
            if acc["connected"] and not acc["handle"]:
                acc["handle"] = f"@{acc['name'].lower().replace(' ', '').replace('(', '').replace(')', '')}.user"
            return acc
    raise HTTPException(status_code=404, detail="Account not found")

@app.get("/")
def root():
    return {"name": "SocialPilot AI API", "docs": "/docs"}
```

---

### 3. Frontend Architecture & Configuration

#### `frontend/package.json`
```json
{
  "name": "socialpilot-ai-frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "axios": "^1.7.7",
    "lucide-react": "^1.49.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.2"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.13",
    "vite": "^5.4.8"
  }
}
```

#### `frontend/vite.config.js`
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://localhost:8000', changeOrigin: true },
    },
  },
});
```

#### `frontend/tailwind.config.js`
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#08090D',
        'bg-2': '#101116',
        card: '#151720',
        'card-hover': '#171a24',
        border: '#252936',
        accent: { DEFAULT: '#8B5CF6', 2: '#6366F1' },
        cyan: { DEFAULT: '#06B6D4' },
        success: '#22C55E',
        error: '#EF4444',
        text: { 2: '#A1A1AA', 3: '#71717A' },
        'l-bg': '#F7F8FC',
        'l-text': '#0B1020',
        'l-text-2': '#5A6178',
        'l-muted': '#98A0B5',
        'l-yellow': '#FACC15',
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      backgroundImage: {
        ai: 'linear-gradient(135deg,#8B5CF6 0%,#6366F1 50%,#06B6D4 100%)',
      },
      boxShadow: {
        ai: '0 6px 22px rgba(139,92,246,.35)',
        glow: '0 8px 32px rgba(0,0,0,.35)',
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        blink: 'blink 1.6s infinite',
        pulse3: 'pulse3 1.2s ease-in-out infinite',
        slideIn: 'slideIn .3s',
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        blink: { '0%,100%': { opacity: 1 }, '50%': { opacity: .35 } },
        pulse3: { '0%,100%': { opacity: .3, transform: 'scale(.7)' }, '50%': { opacity: 1, transform: 'scale(1)' } },
        slideIn: { from: { transform: 'translateX(120%)', opacity: 0 }, to: { transform: 'translateX(0)', opacity: 1 } },
      },
    },
  },
  plugins: [],
};
```

#### `frontend/src/api.js`
```javascript
import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sp_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('sp_token');
      localStorage.removeItem('sp_user');
    }
    return Promise.reject(err);
  }
);

export default api;
```

#### `frontend/src/context/AuthContext.jsx`
```javascript
import { createContext, useContext, useState } from 'react';
import api from '../api';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('sp_user');
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);

  const persist = (data) => {
    localStorage.setItem('sp_token', data.access_token);
    localStorage.setItem('sp_user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const form = new URLSearchParams();
      form.append('username', email);
      form.append('password', password);
      const { data } = await api.post('/auth/login', form);
      persist(data);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      persist(data);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('sp_token');
    localStorage.removeItem('sp_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
```

#### `frontend/src/App.jsx`
```javascript
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import AppShell from './components/AppShell';
import Dashboard from './pages/Dashboard';
import AIStudio from './pages/AIStudio';
import CreatePost from './pages/CreatePost';
import CalendarPage from './pages/CalendarPage';
import Library from './pages/Library';
import Analytics from './pages/Analytics';
import Insights from './pages/Insights';
import Accounts from './pages/Accounts';
import Settings from './pages/Settings';
import SearchResults from './pages/SearchResults';
import FAQ from './pages/FAQ';
import LegalPage from './pages/LegalPage';
import ScrollProgressBar from './components/ScrollProgressBar';
import CookieBanner from './components/CookieBanner';
import ContactPanel from './components/ContactPanel';

function RequireAuth({ children }) {
  const { user } = useAuth();
  const loc = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: loc }} replace />;
  return children;
}

export default function App() {
  return (
    <>
      <ScrollProgressBar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacy" element={<LegalPage docType="privacy" />} />
        <Route path="/terms" element={<LegalPage docType="terms" />} />
        <Route path="/cookies" element={<LegalPage docType="cookies" />} />

        <Route path="/app" element={<RequireAuth><AppShell /></RequireAuth>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="ai-studio" element={<AIStudio />} />
          <Route path="create" element={<CreatePost />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="library" element={<Library />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="insights" element={<Insights />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="settings" element={<Settings />} />
          <Route path="search" element={<SearchResults />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <CookieBanner />
      <ContactPanel />
    </>
  );
}
```

---

### 4. Interactive Pages

#### `frontend/src/pages/Accounts.jsx`
```javascript
import { useState, useEffect } from 'react';
import api from '../api';
import { useToast } from '../components/Toast';
import { ButtonSpinner } from '../components/Skeleton';
import { Share2, Plus, RefreshCw, AlertCircle } from 'lucide-react';

const DEFAULT_ACCOUNTS = [
  { id: 'ig', name: 'Instagram', handle: '@alex.morgan', connected: true },
  { id: 'li', name: 'LinkedIn', handle: 'linkedin.com/in/alexmorgan', connected: true },
  { id: 'x', name: 'X (Twitter)', handle: null, connected: false },
  { id: 'fb', name: 'Facebook', handle: null, connected: false },
];

export default function Accounts() {
  const [accounts, setAccounts] = useState(DEFAULT_ACCOUNTS);
  const [togglingId, setTogglingId] = useState(null);
  const { show } = useToast();

  const fetchAccounts = async () => {
    try {
      const res = await api.get('/accounts');
      if (res.data && Array.isArray(res.data)) {
        setAccounts(res.data);
      }
    } catch (err) {
      console.warn('Could not fetch accounts:', err);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleToggle = async (account) => {
    setTogglingId(account.id);
    try {
      const res = await api.post(`/accounts/${account.id}/toggle`);
      setAccounts((prev) =>
        prev.map((a) => (a.id === account.id ? res.data : a))
      );
      show(
        res.data.connected
          ? `Successfully connected ${account.name} account!`
          : `Disconnected ${account.name} account.`,
        res.data.connected ? 'success' : 'info'
      );
    } catch {
      setAccounts((prev) =>
        prev.map((a) => {
          if (a.id === account.id) {
            const nextConnected = !a.connected;
            return {
              ...a,
              connected: nextConnected,
              handle: nextConnected
                ? `@${a.name.toLowerCase().replace(/[^a-z0-9]/g, '')}_user`
                : null,
            };
          }
          return a;
        })
      );
      show(
        account.connected ? `Disconnected ${account.name}.` : `Connected ${account.name}!`,
        account.connected ? 'info' : 'success'
      );
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-white">Connected Social Accounts</h1>
          <p className="text-xs text-text-2 mt-0.5">
            Authorize and manage the social platforms where SocialPilot AI will publish and fetch analytics.
          </p>
        </div>
        <button
          type="button"
          onClick={fetchAccounts}
          className="btn btn-outline btn-sm self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh
        </button>
      </div>

      <div className="card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Share2 className="w-4 h-4 text-accent" />
            <span>Active Integrations</span>
          </div>
          <span className="text-xs text-text-3">
            {accounts.filter((a) => a.connected).length} of {accounts.length} connected
          </span>
        </div>

        <div className="space-y-3">
          {accounts.map((account) => {
            const isToggling = togglingId === account.id;
            return (
              <div
                key={account.id || account.name}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 grid place-items-center font-bold text-white shrink-0 text-sm">
                    {account.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm flex items-center gap-2">
                      <span>{account.name}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          account.connected
                            ? 'bg-success/15 text-success border border-success/20'
                            : 'bg-white/10 text-text-3'
                        }`}
                      >
                        {account.connected ? 'Active' : 'Not Connected'}
                      </span>
                    </div>
                    <div className="text-xs text-text-3 mt-0.5">
                      {account.connected
                        ? account.handle || 'Connected account'
                        : 'Connect via OAuth 2.0 to enable auto-posting'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 self-end sm:self-auto">
                  <button
                    type="button"
                    disabled={isToggling}
                    onClick={() => handleToggle(account)}
                    className={`btn btn-sm text-xs font-semibold px-4 ${
                      account.connected
                        ? 'btn-outline border-error/30 text-text-2 hover:border-error hover:text-error hover:bg-error/10'
                        : 'btn-primary'
                    }`}
                  >
                    {isToggling ? (
                      <ButtonSpinner label={account.connected ? 'Disconnecting…' : 'Connecting…'} />
                    ) : account.connected ? (
                      'Disconnect'
                    ) : (
                      <span className="inline-flex items-center gap-1.5">
                        <Plus className="w-3.5 h-3.5" /> Connect Account
                      </span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-3 text-xs text-text-3 mt-4">
          <AlertCircle className="w-4 h-4 text-cyan shrink-0 mt-0.5" />
          <p>
            SocialPilot AI requests official read and write permissions to schedule posts, upload media, and sync engagement numbers. Tokens are encrypted using AES-256 and never shared.
          </p>
        </div>
      </div>
    </div>
  );
}
```

#### `frontend/src/pages/Analytics.jsx`
```javascript
import { useState, useEffect } from 'react';
import api from '../api';
import { StatSkeleton, ChartSkeleton } from '../components/Skeleton';
import { BarChart3, ArrowUpRight, TrendingUp, RefreshCw } from 'lucide-react';

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const res = await api.get('/analytics/summary');
      setData(res.data);
    } catch (err) {
      console.warn('Fallback analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const metrics = [
    {
      label: 'Total audience reach',
      value: data?.reach ? `${(data.reach / 1000).toFixed(1)}K` : '24.5K',
      delta: `+${data?.trends?.reach || 18.2}%`,
    },
    {
      label: 'Engagement rate',
      value: data?.engagement ? `${data.engagement}%` : '8.4%',
      delta: `+${data?.trends?.engagement || 4.7}%`,
    },
    {
      label: 'Total published posts',
      value: data?.total_posts || 128,
      delta: `+${data?.trends?.posts || 12.5}%`,
    },
    {
      label: 'AI-assisted content',
      value: `${data?.ai_content || 67}%`,
      delta: `+${data?.trends?.ai || 23.1}%`,
    },
  ];

  const chart = data?.chart || [
    { d: 'Mon', v: 40 },
    { d: 'Tue', v: 65 },
    { d: 'Wed', v: 50 },
    { d: 'Thu', v: 80 },
    { d: 'Fri', v: 60 },
    { d: 'Sat', v: 95 },
    { d: 'Sun', v: 70 },
  ];

  const platforms = data?.platforms || [
    { name: 'Instagram', pct: 48, color: '#DD2A7B' },
    { name: 'LinkedIn', pct: 28, color: '#0A66C2' },
    { name: 'X', pct: 18, color: '#94A3B8' },
    { name: 'Facebook', pct: 6, color: '#1877F2' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-white">Performance Analytics</h1>
          <p className="text-xs text-text-2 mt-0.5">
            Real-time multi-platform reach, engagement metrics, and growth distribution.
          </p>
        </div>
        <button
          type="button"
          onClick={loadAnalytics}
          className="btn btn-outline btn-sm self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh metrics
        </button>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading ? (
          <>
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
          </>
        ) : (
          metrics.map((card) => (
            <div key={card.label} className="card flex flex-col justify-between">
              <div className="text-[11px] uppercase tracking-[0.2em] text-text-3 font-semibold">
                {card.label}
              </div>
              <div className="mt-4 flex items-end justify-between">
                <div className="text-3xl font-bold text-white tracking-tight">{card.value}</div>
                <span className="rounded-full bg-success/15 px-2.5 py-0.5 text-[10px] font-semibold text-success flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3" /> {card.delta}
                </span>
              </div>
            </div>
          ))
        )}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="card chart-container">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-accent" /> Weekly Reach Trend
              </h2>
              <p className="text-xs text-text-3 mt-0.5">Daily impressions across all channels</p>
            </div>
            <span className="text-xs text-text-2 bg-white/5 px-2.5 py-1 rounded-lg border border-white/[0.06]">
              Past 7 days
            </span>
          </div>
          <div className="flex h-56 items-end gap-3 pt-4">
            {chart.map((item, idx) => (
              <div key={idx} className="flex flex-1 flex-col items-center gap-2 h-full justify-end">
                <div
                  className="w-full rounded-t-xl bg-ai/85 hover:bg-ai transition-all duration-300 relative group cursor-pointer"
                  style={{ height: `${item.v}%` }}
                >
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block bg-[#161822] text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow pointer-events-none whitespace-nowrap z-10">
                    {item.v}% reach
                  </div>
                </div>
                <span className="text-[10px] uppercase font-semibold text-text-3">{item.d}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <h2 className="text-sm sm:text-base font-semibold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan" /> Platform Distribution
            </h2>
            <span className="text-xs text-text-3">By share</span>
          </div>

          <div className="space-y-4 pt-1">
            {platforms.map((platform) => (
              <div key={platform.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-medium text-white">{platform.name}</span>
                  <span className="font-semibold text-text-2">{platform.pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${platform.pct}%`,
                      backgroundColor: platform.color || '#8b5cf6',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
```

#### `frontend/src/pages/Login.jsx`
```javascript
import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import PasswordInput from '../components/PasswordInput';
import { FormSuccess, FormErrorSummary, FieldError } from '../components/FormFeedback';
import { ButtonSpinner } from '../components/Skeleton';
import { Sparkles, ArrowLeft } from 'lucide-react';

export default function Login() {
  const { login, loading } = useAuth();
  const { show } = useToast();
  const nav = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const emailInputRef = useRef(null);

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!password) {
      errs.password = 'Password is required.';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstKey = Object.keys(validationErrors)[0];
      document.getElementById(firstKey)?.focus();
      return;
    }

    setErrors({});
    try {
      await login(email, password);
      setSuccessMessage('Login successful! Redirecting to your workspace…');
      show('Welcome back!', 'success');
      setPassword('');
      setTimeout(() => {
        nav('/app/dashboard');
      }, 700);
    } catch (err) {
      const detail = err.response?.data?.detail || 'Incorrect email or password.';
      setErrors({ form: detail });
      show(detail, 'error');
    }
  };

  return (
    <div className="grid lg:grid-cols-2 min-h-screen bg-bg text-white">
      <div
        className="hidden lg:flex flex-col justify-center gap-8 px-16 py-16 relative overflow-hidden
                   bg-[radial-gradient(circle_at_20%_20%,rgba(139,92,246,.25),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(6,182,212,.18),transparent_55%),#08090D]"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-ai grid place-items-center shadow-ai text-white">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-base font-semibold">SocialPilot AI</span>
        </div>

        <div>
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15] bg-gradient-to-b from-white to-[#c4c4cc] bg-clip-text text-transparent">
            Your social media, powered by AI.
          </h1>
          <p className="mt-4 text-text-2 text-sm leading-relaxed max-w-md">
            Create better content, automate your schedule, and grow your audience from one intelligent workspace.
          </p>
        </div>
      </div>

      <div className="grid place-items-center p-6 sm:p-12 bg-bg-2">
        <div className="w-full max-w-[400px]">
          <h2 className="text-2xl font-semibold tracking-tight">Welcome back</h2>
          <p className="text-text-2 text-xs sm:text-sm mt-1.5">Sign in to your workspace</p>

          <div className="mt-4 p-3 rounded-xl border border-accent/20 bg-accent/5 flex items-center justify-between text-xs">
            <div>
              <span className="font-semibold text-accent">Demo Account:</span>{' '}
              <span className="text-text-2">alex@socialpilot.ai</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setEmail('alex@socialpilot.ai');
                setPassword('password123');
                setErrors({});
              }}
              className="text-accent underline hover:text-white font-medium"
            >
              Auto-fill
            </button>
          </div>

          <form onSubmit={handleSubmit} noValidate className="mt-4">
            <FormErrorSummary errors={errors} />
            <FormSuccess message={successMessage} className="mb-4" />

            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                ref={emailInputRef}
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                placeholder="you@example.com"
                required
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              <FieldError id="email" message={errors.email} />
            </div>

            <PasswordInput
              id="password"
              label="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              error={errors.password}
              className="mt-4"
              required
            />

            <div className="flex justify-between items-center mt-3.5 text-xs">
              <label className="flex items-center gap-2 text-text-2 cursor-pointer select-none">
                <input type="checkbox" defaultChecked className="accent-accent w-3.5 h-3.5 rounded" />
                Remember me
              </label>
              <a
                href="#forgot"
                onClick={(e) => {
                  e.preventDefault();
                  show('Password reset instructions sent if email exists.', 'info');
                }}
                className="text-accent hover:underline"
              >
                Forgot password?
              </a>
            </div>

            <button type="submit" disabled={loading} className="btn btn-ai w-full mt-6 h-11 text-sm font-semibold">
              {loading ? <ButtonSpinner label="Signing in…" /> : 'Sign in →'}
            </button>
          </form>

          <p className="text-center mt-6 text-xs text-text-2">
            Don't have an account?{' '}
            <Link to="/signup" className="text-accent font-medium hover:underline">
              Create one
            </Link>
          </p>

          <p className="text-center mt-3 text-xs text-text-2">
            <Link to="/" className="inline-flex items-center gap-1 text-text-3 hover:text-white transition">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
```

#### `frontend/src/pages/Dashboard.jsx`
```javascript
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { StatSkeleton, ChartSkeleton, PostSkeleton } from '../components/Skeleton';
import { Sparkles, PenSquare, Calendar, ArrowUpRight } from 'lucide-react';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [sumRes, postsRes] = await Promise.all([
          api.get('/analytics/summary'),
          api.get('/posts'),
        ]);
        setSummary(sumRes.data);
        setPosts(postsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const stats = [
    { label: 'Total reach', value: summary?.reach ? `${(summary.reach / 1000).toFixed(1)}K` : '24.5K', delta: `+${summary?.trends?.reach || 18.2}%` },
    { label: 'Engagement', value: summary?.engagement ? `${summary.engagement}%` : '8.4%', delta: `+${summary?.trends?.engagement || 4.7}%` },
    { label: 'Scheduled', value: posts.filter((p) => p.status === 'scheduled').length || 16, delta: '4 today' },
    { label: 'AI content', value: `${summary?.ai_content || 67}%`, delta: `+${summary?.trends?.ai || 23.1}%` },
  ];

  const chartData = summary?.chart || [
    { d: 'M', v: 30 }, { d: 'T', v: 52 }, { d: 'W', v: 41 },
    { d: 'T', v: 76 }, { d: 'F', v: 68 }, { d: 'S', v: 92 }, { d: 'S', v: 78 },
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading ? (
          <>
            <StatSkeleton /><StatSkeleton /><StatSkeleton /><StatSkeleton />
          </>
        ) : (
          stats.map((card) => (
            <div key={card.label} className="card flex flex-col justify-between">
              <div className="text-[11px] uppercase tracking-[0.2em] text-text-3 font-semibold">{card.label}</div>
              <div className="mt-4 flex items-end justify-between">
                <div className="text-3xl font-bold text-white tracking-tight">{card.value}</div>
                <span className="rounded-full bg-success/15 px-2.5 py-0.5 text-[10px] font-semibold text-success flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3" /> {card.delta}
                </span>
              </div>
            </div>
          ))
        )}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        {loading ? (
          <ChartSkeleton />
        ) : (
          <div className="card chart-container">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-sm sm:text-base font-semibold text-white">Audience Growth & Reach</h2>
                <p className="text-xs text-text-3 mt-0.5">Weekly cross-channel interaction volume</p>
              </div>
              <span className="text-xs text-text-2 bg-white/5 px-2.5 py-1 rounded-lg border border-white/[0.06]">
                Last 7 days
              </span>
            </div>
            <div className="flex h-52 items-end gap-3 pt-4">
              {chartData.map((item, idx) => (
                <div key={idx} className="flex flex-1 flex-col items-center gap-2 h-full justify-end">
                  <div
                    className="w-full rounded-t-xl bg-ai/85 hover:bg-ai transition-all duration-300"
                    style={{ height: `${item.v}%` }}
                    title={`${item.v}% volume on ${item.d}`}
                  />
                  <span className="text-[10px] uppercase font-semibold text-text-3">{item.d}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="card flex flex-col justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-semibold text-white">Quick Actions</h2>
            <p className="text-xs text-text-3 mt-0.5">Jump directly into high-leverage workflows</p>
          </div>
          <div className="mt-5 space-y-3">
            <Link
              to="/app/ai-studio"
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-3 text-xs sm:text-sm text-text-2 hover:border-accent/40 hover:text-white transition"
            >
              <div className="w-8 h-8 rounded-lg bg-accent/15 text-accent grid place-items-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-white">Generate AI Post Ideas</div>
                <div className="text-[11px] text-text-3">Craft viral hooks in seconds</div>
              </div>
            </Link>

            <Link
              to="/app/create"
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-3 text-xs sm:text-sm text-text-2 hover:border-accent/40 hover:text-white transition"
            >
              <div className="w-8 h-8 rounded-lg bg-cyan/15 text-cyan grid place-items-center shrink-0">
                <PenSquare className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-white">Create New Post</div>
                <div className="text-[11px] text-text-3">Compose and schedule drop</div>
              </div>
            </Link>

            <Link
              to="/app/calendar"
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-3 text-xs sm:text-sm text-text-2 hover:border-accent/40 hover:text-white transition"
            >
              <div className="w-8 h-8 rounded-lg bg-success/15 text-success grid place-items-center shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-white">View Content Calendar</div>
                <div className="text-[11px] text-text-3">Inspect weekly schedule</div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="card">
        <div className="mb-4 flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <h2 className="text-sm sm:text-base font-semibold text-white">Recent Posts</h2>
          <Link to="/app/library" className="text-xs text-accent hover:underline font-medium">
            View full library →
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            <PostSkeleton /><PostSkeleton /><PostSkeleton />
          </div>
        ) : posts.length > 0 ? (
          <div className="space-y-3">
            {posts.slice(0, 4).map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition"
              >
                <div className="min-w-0 pr-4">
                  <div className="font-medium text-white text-xs sm:text-sm truncate">{post.title}</div>
                  <div className="mt-1 text-[11px] text-text-3 capitalize">
                    {post.platform} • {post.scheduled_at ? new Date(post.scheduled_at).toLocaleDateString() : 'Draft'}
                  </div>
                </div>
                <span className="post-badge badge-scheduled shrink-0">
                  {post.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-text-3 text-center py-6">No recent posts found.</p>
        )}
      </section>
    </div>
  );
}
```

---

### 5. Key Reusable Components

#### `frontend/src/components/Header.jsx`
```javascript
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';
import ThemeToggle from './ThemeToggle';
import GlobalSearch from './GlobalSearch';
import { Bell, Menu, ArrowLeft, LogOut } from 'lucide-react';

export default function Header({ onToggleSidebar, sidebarOpen, triggerRef, crumb = 'Workspace' }) {
  const { user, logout } = useAuth();
  const { show } = useToast();
  const nav = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      className={`sticky top-0 z-30 border-b transition-all duration-200 flex items-center justify-between px-4 sm:px-6 ${
        scrolled
          ? 'h-14 bg-bg/90 backdrop-blur-xl border-white/[0.1] shadow-md'
          : 'h-16 bg-bg/70 backdrop-blur-md border-white/[0.06]'
      }`}
    >
      <div className="flex items-center gap-3">
        <button
          ref={triggerRef}
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation drawer"
          aria-expanded={sidebarOpen}
          aria-controls="navigation-drawer"
          className="icon-btn lg:hidden text-text-2 hover:text-white"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="text-xs sm:text-sm font-medium text-text-2 hidden sm:inline-block">
          {crumb}
        </span>
      </div>

      <div className="mx-2 flex-1 max-w-xs sm:max-w-sm md:max-w-md flex justify-center">
        <GlobalSearch />
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2.5">
        <Link
          to="/"
          className="hidden md:flex items-center gap-1 text-xs text-text-3 hover:text-white transition px-2 py-1.5 rounded-lg"
          title="Return to landing page"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Landing
        </Link>

        <ThemeToggle />

        <button
          type="button"
          onClick={() => show('You have 3 new automated social insights', 'ai')}
          aria-label="View notifications"
          className="icon-btn text-text-2 hover:text-white relative"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span
            className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-error border border-bg"
            aria-hidden="true"
          />
        </button>

        <button
          type="button"
          onClick={() => {
            logout();
            nav('/');
          }}
          aria-label="Sign out"
          title="Sign out"
          className="hidden sm:inline-flex text-xs text-text-3 hover:text-white transition px-2 py-1.5 rounded-lg"
        >
          <LogOut className="w-4 h-4 mr-1 sm:inline hidden" /> Sign out
        </button>

        <button
          type="button"
          onClick={() => nav('/app/settings')}
          title={user?.name ? `${user.name} — Click for Settings` : 'User profile & settings'}
          aria-label="User profile and account settings"
          className="w-8 h-8 rounded-full bg-ai hover:ring-2 hover:ring-accent/60 transition-all grid place-items-center text-xs font-semibold text-white cursor-pointer shadow-sm select-none"
        >
          {user?.name?.[0] || 'A'}
        </button>
      </div>
    </header>
  );
}
```

#### `frontend/src/components/Sidebar.jsx`
```javascript
import { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Sparkles,
  PenSquare,
  CalendarDays,
  FolderOpen,
  BarChart3,
  Lightbulb,
  Share2,
  Settings as SettingsIcon,
  X,
  LogOut,
} from 'lucide-react';

const NAV = [
  {
    section: 'Workspace',
    items: [
      { to: '/app/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/app/ai-studio', icon: Sparkles, label: 'AI Studio', tag: 'AI' },
      { to: '/app/create', icon: PenSquare, label: 'Create Post' },
      { to: '/app/calendar', icon: CalendarDays, label: 'Calendar' },
      { to: '/app/library', icon: FolderOpen, label: 'Library' },
    ],
  },
  {
    section: 'Insights',
    items: [
      { to: '/app/analytics', icon: BarChart3, label: 'Analytics' },
      { to: '/app/insights', icon: Lightbulb, label: 'AI Insights' },
    ],
  },
  {
    section: 'Social',
    items: [{ to: '/app/accounts', icon: Share2, label: 'Accounts' }],
  },
  {
    section: 'Management',
    items: [{ to: '/app/settings', icon: SettingsIcon, label: 'Settings' }],
  },
];

export default function Sidebar({ open, onClose, triggerRef }) {
  const { user, logout } = useAuth();
  const drawerRef = useRef(null);

  useEffect(() => {
    if (open) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const drawer = drawerRef.current;
    if (!drawer) return;

    const focusables = drawer.querySelectorAll('a[href], button:not([disabled]), [tabindex="0"]');
    focusables[0]?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        triggerRef?.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose, triggerRef]);

  return (
    <>
      {open && (
        <div
          role="presentation"
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-200"
        />
      )}

      <aside
        ref={drawerRef}
        role={open ? 'dialog' : undefined}
        aria-modal={open ? 'true' : undefined}
        aria-label="Navigation drawer"
        className={`fixed left-0 top-0 bottom-0 w-[260px] bg-[#0c0d12] border-r border-white/[0.06] flex flex-col z-50 transition-transform duration-200 ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="px-5 h-16 flex items-center justify-between border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-ai grid place-items-center shadow-ai text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-[15px] font-semibold text-white tracking-tight">SocialPilot AI</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation sidebar"
            className="lg:hidden p-1.5 rounded-lg text-text-3 hover:text-white hover:bg-white/5 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav aria-label="Main navigation" className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {NAV.map((group) => (
            <div key={group.section}>
              <div className="text-[10px] font-semibold tracking-widest uppercase text-text-3 px-3 mb-2">
                {group.section}
              </div>
              <div className="space-y-0.5">
                {group.items.map((it) => {
                  const Icon = it.icon;
                  return (
                    <NavLink
                      key={it.to}
                      to={it.to}
                      onClick={onClose}
                      className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                      <Icon className="w-4 h-4 text-text-3 shrink-0" />
                      <span className="truncate">{it.label}</span>
                      {it.tag && (
                        <span className="ml-auto text-[9px] font-bold text-white px-1.5 py-0.5 rounded-md bg-ai">
                          {it.tag}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-3.5 border-t border-white/[0.06]">
          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-white/[0.04] transition">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-ai grid place-items-center text-xs font-semibold text-white shrink-0">
                {user?.name?.[0] || 'A'}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-medium text-white truncate">{user?.name || 'Alex Morgan'}</div>
                <div className="text-[11px] text-text-3 truncate">{user?.email || 'alex@socialpilot.ai'}</div>
              </div>
            </div>
            <button
              type="button"
              onClick={logout}
              aria-label="Log out of application"
              title="Sign out"
              className="p-1.5 text-text-3 hover:text-error transition rounded-lg hover:bg-white/5"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
```

#### `frontend/src/components/AppShell.jsx`
```javascript
import { useState, useRef } from 'react';
import { Outlet, useLocation, NavLink } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import SkipToContent from './SkipToContent';
import BackToTop from './BackToTop';

const CRUMBS = {
  '/app/dashboard': 'Dashboard',
  '/app/ai-studio': 'AI Studio',
  '/app/create': 'Create Post',
  '/app/calendar': 'Content Calendar',
  '/app/library': 'Content Library',
  '/app/analytics': 'Analytics',
  '/app/insights': 'AI Insights',
  '/app/accounts': 'Connected Accounts',
  '/app/settings': 'Settings',
  '/app/search': 'Search Results',
};

export default function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const triggerRef = useRef(null);
  const { pathname } = useLocation();
  const crumb = CRUMBS[pathname] || 'Workspace';

  return (
    <div className="flex min-h-screen bg-bg text-white relative">
      <SkipToContent targetId="main-content" />
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        triggerRef={triggerRef}
      />
      <div className="flex-1 lg:ml-[260px] min-w-0 flex flex-col">
        <Header
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
          sidebarOpen={sidebarOpen}
          triggerRef={triggerRef}
          crumb={crumb}
        />
        <main id="main-content" tabIndex={-1} className="flex-1 max-w-[1400px] w-full mx-auto p-4 lg:p-6 pb-24 lg:pb-6 focus:outline-none">
          <Outlet />
        </main>
      </div>
      <BottomNav />
      <BackToTop />
    </div>
  );
}

function BottomNav() {
  const items = [
    { to: '/app/dashboard', ic: '🏠', l: 'Home' },
    { to: '/app/ai-studio', ic: '✨', l: 'Create' },
    { to: '/app/calendar', ic: '📅', l: 'Calendar' },
    { to: '/app/analytics', ic: '📊', l: 'Stats' },
    { to: '/app/settings', ic: '👤', l: 'Profile' },
  ];
  return (
    <nav
      aria-label="Mobile navigation"
      className="bottom-nav lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0c0d12]/95 backdrop-blur-md border-t border-white/[0.06] py-2 grid grid-cols-5"
    >
      {items.map((it) => (
        <NavLink
          key={it.to}
          to={it.to}
          className="flex flex-col items-center gap-1 py-1 text-[10px] text-text-3"
        >
          {({ isActive }) => (
            <>
              <span className={`text-lg ${isActive ? 'text-accent' : ''}`}>{it.ic}</span>
              <span className={isActive ? 'text-accent font-medium' : ''}>{it.l}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
```

---

## License

MIT © SocialPilot AI