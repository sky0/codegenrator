export default function SessionHistory({ sessions, onSelect, onDelete, active }) {
  if (!sessions.length) return null;

  return (
    <div className="mt-8">
      <h3 className="text-sm font-semibold text-ink-500 uppercase tracking-wider mb-3">
        Recent Sessions
      </h3>
      <div className="space-y-2">
        {sessions.map((s) => (
          <div
            key={s.id}
            className={`flex items-center justify-between p-3 rounded-xl border transition cursor-pointer group ${
              active === s.id
                ? 'bg-accent/5 border-accent/30'
                : 'bg-white border-ink-200 hover:border-ink-300'
            }`}
            onClick={() => onSelect(s.id)}
          >
            <div className="min-w-0">
              <p className="font-medium text-ink-900 truncate text-sm">{s.title}</p>
              <p className="text-xs text-ink-400">
                {s.postcardCount} postcards · {new Date(s.createdAt).toLocaleDateString()}
                {s.demo && ' · demo'}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(s.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-1.5 text-ink-400 hover:text-accent transition"
              title="Delete session"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
