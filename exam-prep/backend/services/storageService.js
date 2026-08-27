import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(SESSIONS_FILE)) {
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify([], null, 2));
  }
}

function readSessions() {
  ensureDataDir();
  const raw = fs.readFileSync(SESSIONS_FILE, 'utf-8');
  return JSON.parse(raw);
}

function writeSessions(sessions) {
  ensureDataDir();
  fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2));
}

export function saveSession(session) {
  const sessions = readSessions();
  sessions.unshift(session);
  if (sessions.length > 50) sessions.length = 50;
  writeSessions(sessions);
  return session;
}

export function getAllSessions() {
  return readSessions();
}

export function getSessionById(id) {
  return readSessions().find((s) => s.id === id) || null;
}

export function deleteSession(id) {
  const sessions = readSessions().filter((s) => s.id !== id);
  writeSessions(sessions);
}
