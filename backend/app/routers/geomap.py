from fastapi import APIRouter
import random

router = APIRouter()

# Simulated 1000 anonymized cases for pilot
DISTRICTS = [
    {"name": "Dhaka",      "lat": 23.8103, "lng": 90.4125, "risk_weight": 9},
    {"name": "Chittagong", "lat": 22.3569, "lng": 91.7832, "risk_weight": 7},
    {"name": "Cox's Bazar","lat": 21.4272, "lng": 92.0058, "risk_weight": 9},
    {"name": "Sylhet",     "lat": 24.8949, "lng": 91.8687, "risk_weight": 5},
    {"name": "Rajshahi",   "lat": 24.3745, "lng": 88.6042, "risk_weight": 4},
    {"name": "Khulna",     "lat": 22.8456, "lng": 89.5403, "risk_weight": 5},
    {"name": "Mymensingh", "lat": 24.7471, "lng": 90.4203, "risk_weight": 4},
    {"name": "Barisal",    "lat": 22.7010, "lng": 90.3535, "risk_weight": 3},
]

def generate_simulated_cases(n=1000):
    cases = []
    for _ in range(n):
        district = random.choices(DISTRICTS, weights=[d["risk_weight"] for d in DISTRICTS])[0]
        cases.append({
            "lat": district["lat"] + random.uniform(-0.3, 0.3),
            "lng": district["lng"] + random.uniform(-0.3, 0.3),
            "district": district["name"],
            "age_group": random.choice(["15-24", "25-34", "35-44", "45+"]),
            "risk_group": random.choice(["MSM", "PWID", "FSW", "Migrant", "Rohingya", "General"]),
            "year": random.choice([2022, 2023, 2024, 2025]),
        })
    return cases

@router.get("/cases")
def get_cases():
    cases = generate_simulated_cases(1000)
    return {"total": len(cases), "cases": cases}

@router.get("/hotspots")
def get_hotspots():
    return {
        "hotspots": [
            {"district": "Dhaka",       "risk_score": 92, "predicted_new_cases": 45, "lat": 23.8103, "lng": 90.4125},
            {"district": "Cox's Bazar", "risk_score": 89, "predicted_new_cases": 38, "lat": 21.4272, "lng": 92.0058},
            {"district": "Chittagong",  "risk_score": 74, "predicted_new_cases": 29, "lat": 22.3569, "lng": 91.7832},
            {"district": "Sylhet",      "risk_score": 61, "predicted_new_cases": 18, "lat": 24.8949, "lng": 91.8687},
            {"district": "Khulna",      "risk_score": 55, "predicted_new_cases": 14, "lat": 22.8456, "lng": 89.5403},
        ]
    }

@router.get("/forecast")
def get_forecast():
    return {
        "weeks": ["Week 1", "Week 2", "Week 3", "Week 4"],
        "predicted_cases": [48, 52, 61, 67],
        "high_risk_districts": ["Dhaka", "Cox's Bazar", "Chittagong"]
    }
