import { useState, useEffect, useCallback } from 'react';
import InputForm from './components/InputForm';
import PreparationView from './components/PreparationView';
import SessionHistory from './components/SessionHistory';
import { generatePreparation, fetchSessions, fetchSession, deleteSession, checkHealth } from './api';

export default function App() {
  const [view, setView] = useState('input');
  const [session, setSession] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [aiEnabled, setAiEnabled] = useState(null);

  const loadSessions = useCallback(async () => {
    try {
      const data = await fetchSessions();
      setSessions(data);
    } catch {
      /* API may not be running yet */
    }
  }, []);

  useEffect(() => {
    loadSessions();
    checkHealth()
      .then((h) => setAiEnabled(h.aiEnabled))
      .catch(() => setAiEnabled(false));
  }, [loadSessions]);

  const handleSubmit = async (form) => {
    setLoading(true);
    setError(null);
    try {
      const result = await generatePreparation(form);
      setSession(result);
      setView('results');
      loadSessions();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSession = async (id) => {
    try {
      const data = await fetchSession(id);
      setSession(data);
      setView('results');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteSession = async (id) => {
    try {
      await deleteSession(id);
      if (session?.id === id) {
        setSession(null);
        setView('input');
      }
      loadSessions();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-ink-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => { setView('input'); setSession(null); }}
            className="flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="text-left">
              <h1 className="font-display text-xl text-ink-900 leading-tight">ReviseReady</h1>
              <p className="text-xs text-ink-400">AI Exam Preparation</p>
            </div>
          </button>

          {aiEnabled !== null && (
            <span className={`text-xs px-3 py-1 rounded-full border ${
              aiEnabled
                ? 'bg-sage/10 text-sage-dark border-sage/30'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              {aiEnabled ? 'AI Enabled' : 'Demo Mode'}
            </span>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 ml-4">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {view === 'input' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-2">
              <div className="mb-8">
                <h2 className="font-display text-3xl sm:text-4xl text-ink-900 mb-3">
                  Prepare smarter, not harder
                </h2>
                <p className="text-ink-600 text-lg">
                  Paste your doubts, question paper, and study plan. We'll turn them into
                  flip-card revision postcards with answers and a structured study plan.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-ink-200 shadow-sm p-6 sm:p-8">
                <InputForm onSubmit={handleSubmit} loading={loading} />
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-sage/10 to-sage/5 rounded-2xl border border-sage/20 p-6 sticky top-24">
                <h3 className="font-display text-lg text-ink-900 mb-4">How it works</h3>
                <ol className="space-y-4 text-sm text-ink-600">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center">1</span>
                    <span>Add your doubts, paste question paper text, and describe your study plan</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center">2</span>
                    <span>AI analyzes your material and creates exam-style Q&amp;A postcards</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center">3</span>
                    <span>Flip cards to test yourself, follow the study plan, and revise key takeaways</span>
                  </li>
                </ol>

                <SessionHistory
                  sessions={sessions}
                  onSelect={handleSelectSession}
                  onDelete={handleDeleteSession}
                  active={session?.id}
                />
              </div>
            </div>
          </div>
        ) : (
          <PreparationView
            session={session}
            onBack={() => { setView('input'); setSession(null); }}
          />
        )}
      </main>

      <footer className="border-t border-ink-200 mt-16 py-6 text-center text-xs text-ink-400">
        ReviseReady — Turn your study material into revision postcards
      </footer>
    </div>
  );
}
