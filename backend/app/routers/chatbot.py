from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
import os

import httpx
from dotenv import load_dotenv

router = APIRouter()

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
MODEL_NAME = "gemini-2.5-flash-lite"


def gemini_url() -> str:
    return f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL_NAME}:generateContent?key={GEMINI_API_KEY}"


SYSTEM_PROMPT = """
তুমি ZeroTransmit AI — বাংলাদেশের স্বাস্থ্য সহায়ক।

তুমি শুধুমাত্র নিচের বিষয়গুলোর উত্তর দেবে:
- HIV/AIDS প্রতিরোধ, পরীক্ষা, চিকিৎসা, ART, PrEP
- STI/STD, নিরাপদ যৌন আচরণ, কনডম
- ডেঙ্গু লক্ষণ, প্রতিরোধ, প্রাথমিক করণীয়
- বাংলাদেশে টেস্টিং সেন্টার/হাসপাতাল তথ্য
- HIV সম্পর্কিত মানসিক সহায়তা

নিয়ম:
1) সবসময় বাংলায় উত্তর দাও
2) সংক্ষিপ্ত, সহানুভূতিশীল এবং বিচারমুক্ত ভাষা ব্যবহার করো
3) ব্যক্তিগত তথ্য (নাম, ফোন, ঠিকানা) চাইবে না
4) যদি প্রশ্ন স্বাস্থ্য-সংশ্লিষ্ট না হয়, ভদ্রভাবে জানাবে যে তুমি শুধু স্বাস্থ্য প্রশ্নের উত্তর দাও
5) আত্মহত্যা/নিজেকে ক্ষতির ইঙ্গিত পেলে 16789 (কান পেতে রই) জানাবে
6) চিকিৎসকের বিকল্প হিসেবে নিজেকে উপস্থাপন করবে না
""".strip()


TOPIC_KEYWORDS = [
    "hiv", "aids", "sti", "std", "prep", "art", "condom", "test", "testing", "clinic", "hospital", "dengue",
    "safe sex", "sexual", "sex", "partner", "protection", "risk", "transmission",
    "এইচআইভি", "এইডস", "ডেঙ্গু", "কনডম", "প্রেপ", "এআরটি", "টেস্ট", "পরীক্ষা", "হাসপাতাল", "ক্লিনিক",
    "যৌন", "যৌনস্বাস্থ্য", "নিরাপদ", "সঙ্গী", "পার্টনার", "সংক্রমণ", "ঝুঁকি", "প্রতিরোধ",
]

CRISIS_KEYWORDS = [
    "মরতে চাই", "আত্মহত্যা", "বাঁচতে চাই না", "নিজেকে মেরে", "suicide", "kill myself", "want to die", "self harm",
]

FAST_KB = [
    (
        ["hiv কী", "what is hiv", "hiv কি"],
        "HIV একটি ভাইরাস যা শরীরের রোগ প্রতিরোধ ক্ষমতাকে দুর্বল করে। সঠিক সময়ে টেস্ট ও চিকিৎসা নিলে সুস্থভাবে জীবনযাপন সম্ভব।",
    ),
    (
        ["prep", "প্রেপ"],
        "PrEP হলো HIV প্রতিরোধের ওষুধ। নিয়মিত সেবনে সংক্রমণের ঝুঁকি অনেক কমে। ডাক্তারের পরামর্শ নিয়ে শুরু করুন।",
    ),
    (
        ["test", "টেস্ট", "পরীক্ষা"],
        "বাংলাদেশে সরকারি হাসপাতাল ও নির্ধারিত সেন্টারে HIV টেস্ট ফ্রি এবং গোপনীয়ভাবে করা যায়। সহায়তা: 16230",
    ),
    (
        ["dengue", "ডেঙ্গু"],
        "ডেঙ্গুর সাধারণ লক্ষণ: উচ্চ জ্বর, মাথাব্যথা, চোখের পেছনে ব্যথা, শরীর ব্যথা, বমিভাব। বিপদচিহ্ন থাকলে দ্রুত হাসপাতালে যান।",
    ),
    (
        ["condom", "কনডম"],
        "নিয়মিত ও সঠিকভাবে কনডম ব্যবহার করলে HIV এবং STI সংক্রমণের ঝুঁকি উল্লেখযোগ্যভাবে কমে।",
    ),
]

class ChatTurn(BaseModel):
    role: str  # user | model
    text: str


class ChatMessage(BaseModel):
    message: str
    history: Optional[List[ChatTurn]] = []


def is_health_related(message: str) -> bool:
    m = message.lower().strip()
    return any(k in m for k in TOPIC_KEYWORDS)


def is_crisis_message(message: str) -> bool:
    m = message.lower()
    return any(k in m for k in CRISIS_KEYWORDS)


def quick_local_answer(message: str) -> Optional[str]:
    m = message.lower().strip()
    for keys, ans in FAST_KB:
        if any(k in m for k in keys):
            return ans
    return None


async def call_gemini(message: str, history: List[ChatTurn]) -> str:
    if not GEMINI_API_KEY:
        return "দুঃখিত, চ্যাটবট API key কনফিগার করা নেই। অনুগ্রহ করে সাপোর্ট টিমকে জানান।"

    if not is_health_related(message):
        return "আমি শুধুমাত্র স্বাস্থ্য সংক্রান্ত বিষয়ে সাহায্য করতে পারি। আপনার কি HIV, ডেঙ্গু বা STI বিষয়ে প্রশ্ন আছে?"

    fast = quick_local_answer(message)
    if fast:
        return fast

    contents = [
        {
            "role": "user",
            "parts": [{"text": SYSTEM_PROMPT + "\n\nতুমি কি বুঝেছ?"}],
        },
        {
            "role": "model",
            "parts": [{"text": "হ্যাঁ, আমি শুধুমাত্র স্বাস্থ্য-সম্পর্কিত প্রশ্নের উত্তর দেবো এবং সব উত্তর বাংলায় দেবো।"}],
        },
    ]

    for turn in history[-10:]:
        role = "model" if turn.role == "model" else "user"
        contents.append({"role": role, "parts": [{"text": turn.text}]})

    contents.append({"role": "user", "parts": [{"text": message}]})

    payload = {
        "contents": contents,
        "generationConfig": {
            "temperature": 0.4,
            "topP": 0.9,
            "maxOutputTokens": 700,
        },
    }

    try:
        timeout = httpx.Timeout(8.0, connect=3.0)
        async with httpx.AsyncClient(timeout=timeout) as client:
            response = await client.post(gemini_url(), json=payload)
            data = response.json()

        if response.status_code == 200:
            return data["candidates"][0]["content"]["parts"][0]["text"]
        return "দুঃখিত, এই মুহূর্তে সার্ভারে সমস্যা হচ্ছে। একটু পরে আবার চেষ্টা করুন।"
    except httpx.TimeoutException:
        return "দুঃখিত, উত্তর পেতে বেশি সময় লাগছে। সংক্ষেপে বলছি: দ্রুত HIV টেস্ট করুন এবং প্রয়োজনে 16230 নম্বরে কল করুন।"
    except Exception:
        return "দুঃখিত, নেটওয়ার্ক সমস্যার কারণে উত্তর দিতে পারছি না। একটু পরে আবার চেষ্টা করুন।"

@router.post("/chat")
async def chat(msg: ChatMessage):
    crisis = is_crisis_message(msg.message)
    answer = await call_gemini(msg.message, msg.history or [])

    if crisis:
        answer += "\n\n⚠️ আপনি যদি সংকটে থাকেন, অনুগ্রহ করে এখনই ১৬৭৮৯ (কান পেতে রই) নম্বরে কল করুন।"

    return {
        "answer": answer,
        "is_crisis": crisis,
        "crisis_hotline": "16789" if crisis else None,
        "model": MODEL_NAME,
    }

@router.get("/clinics")
def get_clinics():
    return {
        "clinics": [
            {"name": "ICDDR,B Dhaka", "lat": 23.7567, "lng": 90.3800, "district": "Dhaka", "phone": "10655"},
            {"name": "Dhaka Medical College Hospital", "lat": 23.7261, "lng": 90.3966, "district": "Dhaka", "phone": "02-55165088"},
            {"name": "National AIDS/STD Programme", "lat": 23.7370, "lng": 90.3890, "district": "Dhaka", "phone": "02-9331550"},
            {"name": "Chattogram General Hospital", "lat": 22.3569, "lng": 91.7832, "district": "Chattogram", "phone": "031-619999"},
            {"name": "Cox's Bazar District Hospital", "lat": 21.4272, "lng": 92.0058, "district": "Cox's Bazar", "phone": "0341-62166"},
            {"name": "Sylhet MAG Osmani Hospital", "lat": 24.8949, "lng": 91.8687, "district": "Sylhet", "phone": "0821-716476"},
            {"name": "Khulna Medical College Hospital", "lat": 22.8456, "lng": 89.5403, "district": "Khulna", "phone": "041-760825"},
            {"name": "Rajshahi Medical College Hospital", "lat": 24.3745, "lng": 88.6042, "district": "Rajshahi", "phone": "0721-772150"},
        ]
    }
