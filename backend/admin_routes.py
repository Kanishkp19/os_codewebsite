from fastapi import APIRouter, HTTPException, File, UploadFile, Form, Depends
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from motor.motor_asyncio import AsyncIOMotorClient
import os
import uuid
import shutil
from pathlib import Path
from datetime import datetime
import secrets

# Router for admin routes
admin_router = APIRouter()

# MongoDB connection
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGODB_URL)
db = client.oscode_platform

# Get the correct paths
current_dir = Path(__file__).parent
project_root = current_dir.parent
uploads_dir = project_root / "uploads"

# Admin credentials (in production, use environment variables)
ADMIN_CREDENTIALS = {
    "admin": os.getenv("ADMIN_PASSWORD", "oscode2024"),
    "president": os.getenv("PRESIDENT_PASSWORD", "oscode2024"),
    "vice_president": os.getenv("VP_PASSWORD", "oscode2024")
}

# Active sessions storage (in production, use Redis)
active_sessions: Dict[str, Dict] = {}

# Admin models
class AdminLogin(BaseModel):
    username: str
    password: str

class AdminSession(BaseModel):
    session_id: str
    username: str
    expires_at: datetime

# Authentication functions
def verify_credentials(username: str, password: str) -> bool:
    return ADMIN_CREDENTIALS.get(username) == password

def create_session(username: str) -> str:
    session_id = secrets.token_urlsafe(32)
    expires_at = datetime.now().timestamp() + 3600  # 1 hour
    active_sessions[session_id] = {
        "username": username,
        "expires_at": expires_at
    }
    return session_id

def verify_session(session_id: str) -> Optional[str]:
    session = active_sessions.get(session_id)
    if not session:
        return None
    
    if datetime.now().timestamp() > session["expires_at"]:
        del active_sessions[session_id]
        return None
    
    return session["username"]

# Admin authentication
@admin_router.post("/login")
async def admin_login(credentials: AdminLogin):
    if not verify_credentials(credentials.username, credentials.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    session_id = create_session(credentials.username)
    return {
        "session_id": session_id,
        "username": credentials.username,
        "message": "Login successful"
    }

@admin_router.post("/logout")
async def admin_logout(session_id: str):
    if session_id in active_sessions:
        del active_sessions[session_id]
    return {"message": "Logout successful"}

@admin_router.get("/verify")
async def verify_session_endpoint(session_id: str):
    username = verify_session(session_id)
    if not username:
        raise HTTPException(status_code=401, detail="Invalid or expired session")
    return {"username": username, "valid": True}

# Dashboard stats
@admin_router.get("/dashboard-stats")
async def get_dashboard_stats(session_id: str):
    username = verify_session(session_id)
    if not username:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    try:
        # Get comprehensive statistics
        total_events = await db.events.count_documents({})
        active_events = await db.events.count_documents({"is_active": True})
        total_jobs = await db.jobs.count_documents({})
        total_mentors = await db.mentors.count_documents({})
        total_team_members = await db.team_members.count_documents({})
        total_contacts = await db.contacts.count_documents({})
        
        # Recent activity
        recent_contacts = await db.contacts.find().sort("created_at", -1).limit(5).to_list(5)
        recent_events = await db.events.find().sort("created_at", -1).limit(3).to_list(3)
        
        return {
            "stats": {
                "total_events": total_events,
                "active_events": active_events,
                "total_jobs": total_jobs,
                "total_mentors": total_mentors,
                "total_team_members": total_team_members,
                "total_contacts": total_contacts
            },
            "recent_contacts": recent_contacts,
            "recent_events": recent_events
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Image upload - FIXED PATHS
@admin_router.post("/upload-image")
async def upload_image(file: UploadFile = File(...), session_id: str = Form(...)):
    username = verify_session(session_id)
    if not username:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    # Validate file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Create unique filename
    file_extension = file.filename.split(".")[-1]
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = uploads_dir / unique_filename
    
    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    return {"image_url": f"/uploads/{unique_filename}"}

# Team Members Management
@admin_router.get("/team-members")
async def get_all_team_members(session_id: str):
    username = verify_session(session_id)
    if not username:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    members = await db.team_members.find().to_list(1000)
    return members

@admin_router.post("/team-members")
async def create_team_member(member_data: dict, session_id: str):
    username = verify_session(session_id)
    if not username:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    member_data["id"] = str(uuid.uuid4())
    member_data["created_at"] = datetime.now()
    
    result = await db.team_members.insert_one(member_data)
    return {"message": "Team member created", "id": member_data["id"]}

@admin_router.put("/team-members/{member_id}")
async def update_team_member(member_id: str, member_data: dict, session_id: str):
    username = verify_session(session_id)
    if not username:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    result = await db.team_members.update_one(
        {"id": member_id},
        {"$set": member_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Team member not found")
    
    return {"message": "Team member updated"}

@admin_router.delete("/team-members/{member_id}")
async def delete_team_member(member_id: str, session_id: str):
    username = verify_session(session_id)
    if not username:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    result = await db.team_members.delete_one({"id": member_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Team member not found")
    
    return {"message": "Team member deleted"}

# Events Management
@admin_router.get("/events")
async def get_all_events(session_id: str):
    username = verify_session(session_id)
    if not username:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    events = await db.events.find().to_list(1000)
    return events

@admin_router.post("/events")
async def create_event(event_data: dict, session_id: str):
    username = verify_session(session_id)
    if not username:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    event_data["id"] = str(uuid.uuid4())
    event_data["created_at"] = datetime.now()
    
    result = await db.events.insert_one(event_data)
    return {"message": "Event created", "id": event_data["id"]}

@admin_router.put("/events/{event_id}")
async def update_event(event_id: str, event_data: dict, session_id: str):
    username = verify_session(session_id)
    if not username:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    result = await db.events.update_one(
        {"id": event_id},
        {"$set": event_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    
    return {"message": "Event updated"}

@admin_router.delete("/events/{event_id}")
async def delete_event(event_id: str, session_id: str):
    username = verify_session(session_id)
    if not username:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    result = await db.events.delete_one({"id": event_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    
    return {"message": "Event deleted"}

# Jobs Management
@admin_router.get("/jobs")
async def get_all_jobs(session_id: str):
    username = verify_session(session_id)
    if not username:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    jobs = await db.jobs.find().to_list(1000)
    return jobs

@admin_router.post("/jobs")
async def create_job(job_data: dict, session_id: str):
    username = verify_session(session_id)
    if not username:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    job_data["id"] = str(uuid.uuid4())
    job_data["created_at"] = datetime.now()
    
    result = await db.jobs.insert_one(job_data)
    return {"message": "Job created", "id": job_data["id"]}

# Contact Forms Management
@admin_router.get("/contact-forms")
async def get_contact_forms(session_id: str):
    username = verify_session(session_id)
    if not username:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    contacts = await db.contacts.find().sort("created_at", -1).to_list(1000)
    return contacts

@admin_router.delete("/contact-forms/{contact_id}")
async def delete_contact_form(contact_id: str, session_id: str):
    username = verify_session(session_id)
    if not username:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    from bson import ObjectId
    result = await db.contacts.delete_one({"_id": ObjectId(contact_id)})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Contact form not found")
    
    return {"message": "Contact form deleted"}