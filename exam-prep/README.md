# ReviseReady — AI Exam Preparation

ReviseReady is a full-stack web app that helps students prepare for exams. Paste your **doubts**, **question paper**, and **study plan**, and the app uses AI to generate:

- Flip-card **revision postcards** (question on front, answer on back)
- A phased **study plan** with topics and time estimates
- **Key takeaways** and exam-day advice

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Setup](#setup)
- [How to Run](#how-to-run)
- [How to Use](#how-to-use)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Production Build](#production-build)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Make sure you have the following installed before you begin:

| Tool | Minimum Version | Check with |
|------|-----------------|------------|
| **Node.js** | 18.x or later | `node --version` |
| **npm** | 9.x or later | `npm --version` |

An **OpenAI API key** is optional. Without it, the app runs in **demo mode** and generates sample postcards locally based on your input.

---

## Project Structure

```
exam-prep/
├── backend/                  # Express.js API server
│   ├── routes/
│   │   └── prepare.js        # API routes for generation & sessions
│   ├── services/
│   │   ├── aiService.js      # OpenAI integration + demo fallback
│   │   └── storageService.js # JSON file session storage
│   ├── data/                 # Saved sessions (auto-created at runtime)
│   ├── server.js             # Entry point
│   ├── package.json
│   └── .env.example          # Environment variable template
│
├── frontend/                 # React single-page app
│   ├── src/
│   │   ├── components/       # UI components (Postcard, InputForm, etc.)
│   │   ├── App.jsx           # Main app layout
│   │   └── api.js            # API client
│   ├── index.html
│   ├── vite.config.js        # Dev server + API proxy
│   └── package.json
│
└── README.md                 # This file
```

---

## Setup

### Step 1 — Clone the repository

```bash
git clone https://github.com/sky0/codegenrator.git
cd codegenrator/exam-prep
```

### Step 2 — Install backend dependencies

```bash
cd backend
npm install
```

### Step 3 — Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and set your values:

```env
PORT=3001
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENAI_MODEL=gpt-4o-mini
```

> **Note:** Leave `OPENAI_API_KEY` as the placeholder value (or remove it) to run in demo mode.

### Step 4 — Install frontend dependencies

```bash
cd ../frontend
npm install
```

---

## How to Run

You need **two terminal windows** — one for the backend and one for the frontend.

### Terminal 1 — Start the backend

```bash
cd exam-prep/backend
npm run dev
```

You should see:

```
Exam Prep API running on http://localhost:3001
```

Verify it is working:

```bash
curl http://localhost:3001/api/health
# Expected: {"status":"ok","aiEnabled":true}  (or false in demo mode)
```

### Terminal 2 — Start the frontend

```bash
cd exam-prep/frontend
npm run dev
```

You should see:

```
  VITE v5.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
```

### Open the app

Go to **http://localhost:5173** in your browser.

The frontend dev server automatically proxies all `/api/*` requests to the backend at `http://localhost:3001`.

---

## How to Use

1. **Fill in the form** on the homepage:
   - **Subject / Exam Name** — e.g. "Physics Board Exam"
   - **Exam Date** — optional, helps the AI tailor advice
   - **Your Doubts** — list concepts you don't understand (one per line)
   - **Question Paper / Study Material** — paste syllabus text, past paper questions, or notes
   - **Your Study Plan** — describe how you plan to prepare (e.g. "Day 1: Mechanics, Day 2: Thermodynamics")

2. **Click "Generate Preparation Plan"** — the AI analyzes your input and creates a revision guide (usually takes 5–15 seconds with an API key).

3. **Review the results** across three tabs:
   - **Revision Postcards** — flip cards to test yourself; filter by easy / medium / hard
   - **Study Plan** — phased plan with topics, duration, and focus areas
   - **Key Takeaways** — summary points and exam-day advice

4. **Revisit past sessions** — saved automatically in the sidebar under "Recent Sessions".

---

## Environment Variables

All backend configuration lives in `exam-prep/backend/.env`:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `3001` | Port the backend API listens on |
| `OPENAI_API_KEY` | No | — | Your OpenAI API key. Without it, demo mode is used |
| `OPENAI_MODEL` | No | `gpt-4o-mini` | OpenAI model for generation |

### Demo Mode vs AI Mode

| | Demo Mode | AI Mode |
|---|-----------|---------|
| **API key needed** | No | Yes (`OPENAI_API_KEY`) |
| **Postcard quality** | Generic templates based on your keywords | Fully tailored Q&A from your material |
| **Study plan** | 3 generic phases | Custom phases based on your plan |
| **Badge in UI** | "Demo Mode" (amber) | "AI Enabled" (green) |

---

## API Reference

Base URL: `http://localhost:3001`

### `GET /api/health`

Health check and AI status.

```bash
curl http://localhost:3001/api/health
```

Response:

```json
{
  "status": "ok",
  "aiEnabled": true
}
```

---

### `POST /api/prepare/generate`

Generate a preparation plan from student input.

```bash
curl -X POST http://localhost:3001/api/prepare/generate \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Physics Board Exam",
    "examDate": "2026-03-15",
    "doubts": "What is Newtons third law?\nHow does momentum conservation work?",
    "questionPaper": "Chapter 1: Laws of Motion. Topics: force, acceleration, momentum.",
    "studyPlan": "Day 1: Review Newton laws, Day 2: Practice numerical problems"
  }'
```

At least one of `doubts`, `questionPaper`, or `studyPlan` is required.

Response includes `id`, `createdAt`, `input`, and `preparation` (with `title`, `summary`, `studyPlan`, `postcards`, `keyTakeaways`, `practiceAdvice`).

---

### `GET /api/prepare/sessions`

List all saved preparation sessions (newest first, max 50).

```bash
curl http://localhost:3001/api/prepare/sessions
```

---

### `GET /api/prepare/sessions/:id`

Get a single session by ID.

```bash
curl http://localhost:3001/api/prepare/sessions/<session-id>
```

---

### `DELETE /api/prepare/sessions/:id`

Delete a session.

```bash
curl -X DELETE http://localhost:3001/api/prepare/sessions/<session-id>
```

---

## Production Build

### Build the frontend

```bash
cd exam-prep/frontend
npm run build
```

Output is written to `exam-prep/frontend/dist/`.

### Serve the frontend (preview)

```bash
npm run preview
```

### Run the backend in production

```bash
cd exam-prep/backend
npm start
```

For a full production deployment, serve the `dist/` folder with any static file server (Nginx, Caddy, etc.) and run the backend as a Node process (PM2, systemd, Docker, etc.). Point the static server's `/api` path to the backend, or set a reverse proxy.

---

## Troubleshooting

### Backend won't start — `EADDRINUSE`

Port 3001 is already in use. Either stop the other process or change the port in `.env`:

```env
PORT=3002
```

If you change the backend port, also update the proxy in `frontend/vite.config.js`:

```js
proxy: {
  '/api': {
    target: 'http://localhost:3002',
    changeOrigin: true,
  },
},
```

### Frontend shows "Failed to generate preparation"

- Make sure the **backend is running** on port 3001.
- Check the backend terminal for error messages.
- Verify with: `curl http://localhost:3001/api/health`

### AI generation returns demo content even with an API key

- Confirm `.env` exists in `exam-prep/backend/` (not the project root).
- Make sure the key does not still say `your_openai_api_key_here`.
- Restart the backend after editing `.env`.
- Check `aiEnabled` in the health endpoint response.

### `npm install` fails

- Ensure Node.js 18+ is installed: `node --version`
- Try clearing the cache: `npm cache clean --force` then re-run `npm install`

### Sessions not persisting

Sessions are stored in `exam-prep/backend/data/sessions.json`. This file is created automatically on first use. Make sure the backend process has write permissions to that directory.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 5, Tailwind CSS 3 |
| Backend | Express.js 4, Node.js (ES modules) |
| AI | OpenAI Chat Completions API |
| Storage | JSON file (`backend/data/sessions.json`) |

---

## License

This project is part of the [codegenrator](https://github.com/sky0/codegenrator) repository.
