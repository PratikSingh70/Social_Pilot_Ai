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