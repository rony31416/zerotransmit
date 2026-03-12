from fastapi import APIRouter
from pydantic import BaseModel
from typing import Literal

router = APIRouter()

CRISIS_KEYWORDS = ["die", "suicide", "kill myself", "মরতে চাই", "আত্মহত্যা", "বাঁচতে চাই না"]
DISTRESS_KEYWORDS = ["depressed", "hopeless", "scared", "ashamed", "stigma", "ভয়", "লজ্জা", "হতাশ"]

class CounselingMessage(BaseModel):
    message: str
    user_id: str

def detect_mood(message: str) -> Literal["positive", "distressed", "crisis"]:
    msg_lower = message.lower()
    if any(k in msg_lower for k in CRISIS_KEYWORDS):   return "crisis"
    if any(k in msg_lower for k in DISTRESS_KEYWORDS): return "distressed"
    return "positive"

CBT_RESPONSES = {
    "positive": "That's great to hear. Remember: staying informed and taking your medication daily are the best ways to stay healthy.",
    "distressed": "I hear you, and your feelings are completely valid. Many people with HIV live long, healthy lives. Would you like to talk to a counselor?",
    "crisis": "⚠️ You are not alone. Please call the crisis helpline immediately: 16789 (Kaan Pete Roi). A counselor has been notified.",
}

@router.post("/message")
def send_message(msg: CounselingMessage):
    mood = detect_mood(msg.message)
    response = CBT_RESPONSES[mood]
    return {
        "mood": mood,
        "response": response,
        "escalate_to_human": mood in ["crisis", "distressed"],
        "crisis_hotline": "16789" if mood == "crisis" else None,
    }

@router.get("/adherence-tips")
def adherence_tips():
    return {
        "tips": [
            "Take your ART medication at the same time every day.",
            "Set a phone alarm as a daily reminder.",
            "Keep a 7-day pill organizer to track doses.",
            "Never skip doses — even if you feel well.",
            "If you miss a dose, take it as soon as you remember unless it's almost time for the next one.",
        ]
    }
