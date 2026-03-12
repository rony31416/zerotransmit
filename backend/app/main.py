from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import risk_engine, chatbot, geomap, counseling

app = FastAPI(
    title="ZeroTransmit API",
    description="AI platform for HIV & Dengue prevention in Bangladesh",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(risk_engine.router, prefix="/api/risk-engine", tags=["Risk Engine"])
app.include_router(chatbot.router,     prefix="/api/chatbot",     tags=["Chatbot"])
app.include_router(geomap.router,      prefix="/api/geomap",      tags=["Geo Map"])
app.include_router(counseling.router,  prefix="/api/counseling",  tags=["Counseling"])

@app.get("/")
def root():
    return {"message": "ZeroTransmit API is running"}

@app.get("/health")
def health():
    return {"status": "ok"}
