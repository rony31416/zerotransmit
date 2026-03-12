from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Literal

router = APIRouter()

class RiskInput(BaseModel):
    # Section 1
    age_group: Literal["15-19", "20-29", "30-39", "40-49", "50+"]
    sex: Literal["male", "female", "intersex"]
    gender_identity: Literal["cis_man", "cis_woman", "trans_woman", "trans_man", "nonbinary"]
    division: str

    # Section 2
    key_populations: List[str]

    # Section 3
    num_partners: Literal["0", "1", "2-3", "4-6", "7+"]
    sexual_contact: List[str]
    condom_consistency: Literal["always", "most", "sometimes", "rarely", "never"]
    condom_last: Literal["yes", "no"]
    sex_under_influence: Literal["never", "sometimes", "frequently"]
    transactional_sex: Literal["yes", "no"]

    # Section 4
    sti_history: Literal["no", "treated", "untreated"]
    sti_symptoms: List[str]
    hiv_test_history: Literal["never", "recent_negative", "old_negative", "positive"]
    on_prep: Literal["yes_consistent", "yes_inconsistent", "no_unaware", "no_aware"]
    blood_transfusion: Literal["no", "verified", "unverified"]
    needle_sharing: Literal["no", "sometimes", "regularly"]

    # Section 5
    voluntary_testing: Literal["regular", "occasional", "afraid", "dont_know"]
    partner_status: Literal["both_tested", "not_recent", "unknown", "no_partner"]
    hiv_awareness: Literal["high", "moderate", "low", "very_low"]


SCORE_MAP = {
    # Section 1
    "age_group": {"15-19": 5, "20-29": 8, "30-39": 5, "40-49": 3, "50+": 1},
    "sex": {"male": 0, "female": 3, "intersex": 5},
    "gender_identity": {
        "cis_man": 0,
        "cis_woman": 3,
        "trans_woman": 15,
        "trans_man": 8,
        "nonbinary": 5,
    },
    "division": {
        "Dhaka": 9,
        "Chattogram": 7,
        "Coxs_Bazar": 9,
        "Sylhet": 5,
        "Khulna": 5,
        "Barishal": 3,
        "Mymensingh": 4,
        "Rangpur": 3,
    },
    # Section 3
    "num_partners": {"0": 0, "1": 2, "2-3": 8, "4-6": 15, "7+": 20},
    "condom_consistency": {"always": 0, "most": 8, "sometimes": 15, "rarely": 20, "never": 25},
    "condom_last": {"yes": 0, "no": 10},
    "sex_under_influence": {"never": 0, "sometimes": 8, "frequently": 15},
    "transactional_sex": {"no": 0, "yes": 20},
    # Section 4
    "sti_history": {"no": 0, "treated": 10, "untreated": 20},
    "blood_transfusion": {"no": 0, "verified": 3, "unverified": 12},
    "needle_sharing": {"no": 0, "sometimes": 20, "regularly": 30},
    "on_prep": {"yes_consistent": -15, "yes_inconsistent": -5, "no_unaware": 5, "no_aware": 0},
    "hiv_test_history": {"never": 10, "recent_negative": 0, "old_negative": 8, "positive": None},
    # Section 5
    "voluntary_testing": {"regular": -5, "occasional": 0, "afraid": 8, "dont_know": 5},
    "partner_status": {"both_tested": -5, "not_recent": 5, "unknown": 10, "no_partner": 0},
    "hiv_awareness": {"high": -5, "moderate": 0, "low": 8, "very_low": 12},
}

KEY_POP_SCORES = {
    "msm": 25,
    "fsw": 20,
    "pwid": 22,
    "rohingya": 18,
    "migrant": 12,
    "client": 10,
    "prison": 8,
}

SEXUAL_CONTACT_SCORES = {
    "vaginal_receptive": 8,
    "vaginal_insertive": 5,
    "anal_receptive": 20,
    "anal_insertive": 12,
    "oral": 1,
}

STI_SYMPTOM_SCORES = {
    "sores": 15,
    "discharge": 10,
    "painful_urination": 8,
    "rash": 5,
}

MAX_RAW_SCORE = 280


def calculate_risk(data: RiskInput) -> int:
    score = 0

    for field, mapping in SCORE_MAP.items():
        val = getattr(data, field, None)
        if val in mapping and mapping[val] is not None:
            score += mapping[val]

    for kp in data.key_populations:
        score += KEY_POP_SCORES.get(kp, 0)
    for sc in data.sexual_contact:
        score += SEXUAL_CONTACT_SCORES.get(sc, 0)
    for sym in data.sti_symptoms:
        score += STI_SYMPTOM_SCORES.get(sym, 0)

    normalized = min(round((score / MAX_RAW_SCORE) * 100), 100)
    return max(normalized, 0)


def get_recommendations(score: int, data: RiskInput) -> List[str]:
    recs: List[str] = []

    if score >= 70:
        recs.append("🚨 অবিলম্বে সরকারি হাসপাতাল বা অনুমোদিত সেন্টারে HIV টেস্ট করুন")
        recs.append("💊 PrEP সম্পর্কে ডাক্তারের সঙ্গে জরুরি পরামর্শ করুন")
    elif score >= 45:
        recs.append("🔬 আগামী ২ সপ্তাহের মধ্যে HIV টেস্ট করার সময় নির্ধারণ করুন")
        recs.append("📋 ঝুঁকি চলমান থাকলে PrEP শুরু করার বিষয়ে ভাবুন")

    if data.condom_consistency in ["rarely", "never"]:
        recs.append("🛡️ নিয়মিত ও সঠিকভাবে কনডম ব্যবহার করুন — ঝুঁকি অনেক কমে")
    if data.needle_sharing in ["sometimes", "regularly"]:
        recs.append("💉 কখনও সুচ/সিরিঞ্জ শেয়ার করবেন না — দ্রুত হার্ম রিডাকশন সেন্টারে যোগাযোগ করুন")
    if data.on_prep == "no_unaware":
        recs.append("📚 PrEP সম্পর্কে জানুন — নিয়মিত নিলে HIV প্রতিরোধে অত্যন্ত কার্যকর")
    if data.sti_history == "untreated" or len(data.sti_symptoms) > 0:
        recs.append("🏥 STI লক্ষণ থাকলে দ্রুত চিকিৎসা নিন — STI থাকলে HIV ঝুঁকি বাড়ে")
    if data.voluntary_testing in ["afraid", "dont_know"]:
        recs.append("🤝 বাংলাদেশে HIV টেস্টিং ফ্রি, গোপনীয় ও নিরাপদ")
        recs.append("📞 AIDS হেল্পলাইন: 16230")

    if not recs:
        recs.append("✅ নিরাপদ আচরণ বজায় রাখুন এবং নিয়মিত সচেতনতা বজায় রাখুন")

    return recs

@router.post("/predict")
def predict_risk(data: RiskInput):
    if data.hiv_test_history == "positive":
        return {
            "risk_score": None,
            "risk_level": "Confirmed HIV+",
            "message": "আপনি নিকটস্থ ART সেন্টারে দ্রুত যোগাযোগ করুন। বাংলাদেশে ফ্রি চিকিৎসা পাওয়া যায়।",
            "art_helpline": "16230",
            "recommendations": [
                "ডাক্তারের পরামর্শ অনুযায়ী যত দ্রুত সম্ভব ART শুরু করুন",
                "সরকারি হাসপাতালে ART বিনামূল্যে পাওয়া যায়",
                "নিয়মিত চিকিৎসা নিলে ভাইরাল সাপ্রেশন সম্ভব",
            ],
            "urgent": True,
            "standard": "WHO/UNAIDS/CDC/BD-NASP aligned",
            "disclaimer": "এটি স্ক্রিনিং টুল, চূড়ান্ত রোগ নির্ণয়ের জন্য ডাক্তারের পরামর্শ নিন।",
        }

    score = calculate_risk(data)
    level = (
        "Very High" if score >= 75
        else "High" if score >= 50
        else "Medium" if score >= 25
        else "Low"
    )

    return {
        "risk_score": score,
        "risk_level": level,
        "recommendations": get_recommendations(score, data),
        "recommend_prep": score >= 70,
        "recommend_testing": score >= 45,
        "urgent": score >= 75,
        "standard": "WHO/UNAIDS/CDC/BD-NASP aligned",
        "disclaimer": "এটি স্ক্রিনিং টুল, চূড়ান্ত রোগ নির্ণয়ের জন্য ডাক্তারের পরামর্শ নিন।",
    }
