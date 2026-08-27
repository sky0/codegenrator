const API_BASE = '/api';

export async function generatePreparation(input) {
  const res = await fetch(`${API_BASE}/prepare/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to generate preparation');
  }

  return res.json();
}

export async function fetchSessions() {
  const res = await fetch(`${API_BASE}/prepare/sessions`);
  if (!res.ok) throw new Error('Failed to fetch sessions');
  return res.json();
}

export async function fetchSession(id) {
  const res = await fetch(`${API_BASE}/prepare/sessions/${id}`);
  if (!res.ok) throw new Error('Session not found');
  return res.json();
}

export async function deleteSession(id) {
  const res = await fetch(`${API_BASE}/prepare/sessions/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete session');
  return res.json();
}

export async function checkHealth() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('API unavailable');
  return res.json();
}
