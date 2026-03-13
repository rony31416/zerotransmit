# ZeroTransmit

## Run the Project

### 1) Start Backend

```powershell
cd backend
.\venv\Scripts\python.exe -m pip install -r requirements.tx
.\venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend URLs:
- API: http://localhost:8000
- Docs: http://localhost:8000/docs

### 2) Start Frontend

Open a new terminal:

```powershell
cd frontend
npm install
npm run dev
```

Frontend URL:
- App: http://localhost:3000

### 3) Environment Files

`backend/.env`
```env
DATABASE_URL=postgresql://postgres:password@localhost/zerotransmit
SECRET_KEY=zerotransmit-super-secret-key-2025
REDIS_URL=redis://localhost:6379
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
```

`frontend/.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```
