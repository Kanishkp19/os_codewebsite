from fastapi import FastAPI, HTTPException, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorClient
import os
import uuid
from datetime import datetime
import shutil
from pathlib import Path

# Get port from environment (for Render)
PORT = int(os.environ.get("PORT", 8000))
# Initialize FastAPI app
app = FastAPI(title="OSCode Platform API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGODB_URL)
db = client.oscode_platform

# Get the correct paths
current_dir = Path(__file__).parent
project_root = current_dir.parent
frontend_build_dir = project_root / "frontend" / "build"
uploads_dir = project_root / "uploads"

# Create uploads directory
uploads_dir.mkdir(exist_ok=True)

# Serve uploaded files
app.mount("/uploads", StaticFiles(directory=str(uploads_dir)), name="uploads")

# Pydantic models
class ContactForm(BaseModel):
    name: str
    email: str
    subject: str
    message: str
    form_type: str = "general"
    created_at: datetime = Field(default_factory=datetime.now)

class Event(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    date: str
    time: str
    venue: str
    event_type: str = "workshop"
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.now)

class Job(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    company: str
    location: str
    job_type: str
    description: str
    requirements: List[str]
    apply_url: str
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.now)

class Mentor(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    expertise: str
    company: str
    bio: str
    linkedin_url: Optional[str] = None
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.now)

class TeamMember(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    role: str
    year: str
    department: str
    bio: str
    image_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    email: Optional[str] = None
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.now)

# API Routes
@app.post("/api/contact")
async def submit_contact_form(contact: ContactForm):
    try:
        result = await db.contacts.insert_one(contact.dict())
        return {"message": "Contact form submitted successfully", "id": str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/events", response_model=List[Event])
async def get_events():
    try:
        events = await db.events.find({"is_active": True}).to_list(1000)
        return [Event(**event) for event in events]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/jobs", response_model=List[Job])
async def get_jobs():
    try:
        jobs = await db.jobs.find({"is_active": True}).to_list(1000)
        return [Job(**job) for job in jobs]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/mentors", response_model=List[Mentor])
async def get_mentors():
    try:
        mentors = await db.mentors.find({"is_active": True}).to_list(1000)
        return [Mentor(**mentor) for mentor in mentors]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/team-members", response_model=List[TeamMember])
async def get_team_members():
    try:
        members = await db.team_members.find({"is_active": True}).to_list(1000)
        return [TeamMember(**member) for member in members]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/stats")
async def get_stats():
    try:
        # Get counts from database
        events_count = await db.events.count_documents({"is_active": True})
        jobs_count = await db.jobs.count_documents({"is_active": True})
        mentors_count = await db.mentors.count_documents({"is_active": True})
        team_members_count = await db.team_members.count_documents({"is_active": True})
        
        return {
            "total_events": events_count,
            "active_jobs": jobs_count,
            "mentors_available": mentors_count,
            "total_members": team_members_count if team_members_count > 0 else 50
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Include admin routes
from admin_routes import admin_router
app.include_router(admin_router, prefix="/api/admin")

# Serve React app - FIXED PATHS
@app.get("/")
async def serve_frontend():
    index_path = frontend_build_dir / "index.html"
    if index_path.exists():
        return FileResponse(str(index_path))
    else:
        raise HTTPException(status_code=404, detail="Frontend build not found. Run 'npm run build' in the frontend directory.")

@app.get("/{full_path:path}")
async def serve_frontend_routes(full_path: str):
    # Try to serve the requested file
    file_path = frontend_build_dir / full_path
    if file_path.exists() and file_path.is_file():
        return FileResponse(str(file_path))
    
    # Fall back to index.html for SPA routing
    index_path = frontend_build_dir / "index.html"
    if index_path.exists():
        return FileResponse(str(index_path))
    else:
        raise HTTPException(status_code=404, detail="Frontend build not found. Run 'npm run build' in the frontend directory.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=PORT)