from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Event(BaseModel):
    title: Optional[str] = None
    start_time: datetime
    end_time: datetime
    description: str

class CustomEventType(BaseModel):
    name: str
    color: str
