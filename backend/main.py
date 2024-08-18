from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from models import Event
from database import db
from bson import ObjectId

app = FastAPI()

# CORS Middleware
orig_origins = [
    "http://localhost:5173",  # Adjusted to the port where your frontend is running
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=orig_origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)

class EventCreate(BaseModel):
    title: str
    description: str
    start_time: str
    end_time: str

@app.post("/events/")
async def create_event(event: EventCreate):
    event_data = event.dict()
    event_id = db["events"].insert_one(event_data).inserted_id
    return {"id": str(event_id)}

@app.get("/events/")
async def get_events():
    events = list(db["events"].find())
    for event in events:
        event["_id"] = str(event["_id"])
    return events

@app.put("/events/{event_id}")
async def update_event(event_id: str, event: EventCreate):
    updated_event = db["events"].find_one_and_update(
        {"_id": ObjectId(event_id)}, 
        {"$set": event.dict()}
    )
    if updated_event:
        return {"message": "Event updated successfully"}
    raise HTTPException(status_code=404, detail="Event not found")

@app.delete("/events/{event_id}")
async def delete_event(event_id: str):
    result = db["events"].delete_one({"_id": ObjectId(event_id)})
    if result.deleted_count:
        return {"message": "Event deleted successfully"}
    raise HTTPException(status_code=404, detail="Event not found")
