# ReviseReady — AI Exam Preparation

Turn your doubts, question papers, and study plans into structured revision postcards with AI.

## Features

- **Input your material** — doubts, question paper text, and study plan
- **AI-powered preparation** — generates exam-style Q&A postcards, a phased study plan, and key takeaways
- **Flip-card revision** — tap postcards to reveal answers, filter by difficulty
- **Session history** — save and revisit past preparation sessions

## Tech Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Express.js (Node.js)
- **AI:** OpenAI API (with demo fallback when no API key is set)

## Quick Start

### 1. Backend

```bash
cd exam-prep/backend
npm install
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY (optional — demo mode works without it)
npm run dev
```

Backend runs on http://localhost:3001

### 2. Frontend

```bash
cd exam-prep/frontend
npm install
npm run dev
```

Frontend runs on http://localhost:5173 (proxies API calls to backend)

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check + AI status |
| POST | `/api/prepare/generate` | Generate preparation from input |
| GET | `/api/prepare/sessions` | List saved sessions |
| GET | `/api/prepare/sessions/:id` | Get a session |
| DELETE | `/api/prepare/sessions/:id` | Delete a session |

### Generate Request Body

```json
{
  "subject": "Physics Board Exam",
  "examDate": "2026-03-15",
  "doubts": "How does photosynthesis work?\nWhat is Ohm's law?",
  "questionPaper": "Paste your question paper or syllabus here...",
  "studyPlan": "Day 1: Mechanics, Day 2: Thermodynamics..."
}
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | No | OpenAI API key for full AI generation |
| `OPENAI_MODEL` | No | Model to use (default: `gpt-4o-mini`) |
| `PORT` | No | Backend port (default: `3001`) |

Without an API key, the app runs in **demo mode** with locally generated sample postcards based on your input.
