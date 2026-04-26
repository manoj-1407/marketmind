# 🧠 MarketMind 

**The AI Co-Founder for Marketing, Strategy, and Lead Generation.**

MarketMind is a patentable, 3D-immersive enterprise platform designed to replace entire marketing departments. Built with Next.js, React Three Fiber, FastAPI, and powered by advanced Neural Network LLMs (Groq / LLaMA 3).

![MarketMind Presentation](https://github.com/user-attachments/assets/preview.png) *(Add your preview image here)*

## 🌟 Key Features

1. **3D Immersive Neural Interface:** A custom-built WebGL core using Three.js and Framer Motion that visualizes data points and engages users immediately.
2. **Viral Campaign Architect:** Generates highly emotional, psychological, and platform-specific marketing campaigns in seconds.
3. **Investor-Grade Pitch Generator:** Crafts venture-capital-ready narratives, TAM calculations, and problem-agitation flows.
4. **Predictive Lead Scoring:** Ingests firmographic data and intent signals to rank inbound leads from 0-100 with actionable follow-up protocols.
5. **Persistent Memory Bank:** All generated strategies and scored leads are securely stored in a robust SQLite/SQLAlchemy database.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js (App Router), React, Framer Motion, Three.js (React Three Fiber), Lucide Icons, Vanilla CSS Modules (Glassmorphism design system).
- **Backend:** FastAPI (Python), Uvicorn, Pydantic.
- **Database:** SQLite with SQLAlchemy ORM.
- **AI Engine:** Groq API (LLaMA-3 70B) with custom prompt engineering.

---

## 🚀 Local Development Guide

### 1. Start the Backend (FastAPI)
```powershell
# Open a terminal in the project root
.\venv\Scripts\activate
# If on Mac/Linux: source venv/bin/activate

# Install dependencies if you haven't
pip install -r requirements.txt
pip install sqlalchemy pandas

# Start the server (ensure PYTHONIOENCODING is set for Windows)
$env:PYTHONIOENCODING="utf-8"; python -m uvicorn app:app --reload --port 8000
```
*The backend will be running at `http://127.0.0.1:8000`*

### 2. Start the Frontend (Next.js)
```powershell
# Open a second terminal
cd frontend
npm install
npm run dev
```
*The 3D immersive frontend will be running at `http://localhost:3000`*

---

## ☁️ Deployment Guide

### Deploying the Backend (Render / Railway)
1. Push the repository to GitHub.
2. Create a new Web Service on [Render](https://render.com) or [Railway](https://railway.app).
3. Connect your GitHub repository.
4. Set the Build Command: `pip install -r requirements.txt && pip install sqlalchemy pandas`
5. Set the Start Command: `uvicorn app:app --host 0.0.0.0 --port $PORT`
6. Add your Environment Variables: `GROQ_API_KEY`.

### Deploying the Frontend (Vercel)
1. Go to [Vercel](https://vercel.com) and click "Add New Project".
2. Import your GitHub repository.
3. Framework Preset: **Next.js**.
4. Root Directory: `frontend` (Important!).
5. Click **Deploy**.

---

## 🔐 Licensing & Patentability
This codebase is architected with highly specific proprietary prompt-engineering logic and custom 3D web-GL implementations, positioning it well for enterprise SaaS deployment or IP filing.

**Developed by Antigravity.**
