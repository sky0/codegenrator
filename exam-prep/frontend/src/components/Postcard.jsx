import { useState } from 'react';

const difficultyColors = {
  easy: 'bg-sage/15 text-sage-dark border-sage/30',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  hard: 'bg-accent/10 text-accent-dark border-accent/30',
};

export default function Postcard({ card, index }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="postcard-flip cursor-pointer group"
      onClick={() => setFlipped(!flipped)}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div
        className={`postcard-inner relative w-full min-h-[280px] ${flipped ? 'flipped' : ''}`}
      >
        {/* Front — Question */}
        <div className="postcard-front absolute inset-0 rounded-2xl bg-white border border-ink-200 shadow-postcard group-hover:shadow-postcard-hover transition-shadow p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-400">
              {card.category}
            </span>
            <span
              className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${difficultyColors[card.difficulty] || difficultyColors.medium}`}
            >
              {card.difficulty}
            </span>
          </div>

          <div className="flex-1 flex items-center">
            <p className="font-display text-lg sm:text-xl text-ink-900 leading-snug">
              {card.question}
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-ink-100 flex items-center justify-between">
            <span className="text-xs text-ink-400">Card #{card.id}</span>
            <span className="text-xs text-accent font-medium flex items-center gap-1">
              Tap to reveal answer
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </span>
          </div>
        </div>

        {/* Back — Answer */}
        <div className="postcard-back absolute inset-0 rounded-2xl bg-gradient-to-br from-sage/5 to-sage/10 border border-sage/20 shadow-postcard p-6 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-sage-dark">
              Answer
            </span>
            <span className="text-xs text-ink-400">Tap to flip back</span>
          </div>

          <div className="flex-1 overflow-y-auto">
            <p className="text-ink-800 leading-relaxed text-sm sm:text-base">{card.answer}</p>
          </div>

          {card.tip && (
            <div className="mt-4 p-3 bg-white/70 rounded-xl border border-sage/15">
              <p className="text-xs font-semibold text-sage-dark mb-1">Quick Tip</p>
              <p className="text-sm text-ink-700">{card.tip}</p>
            </div>
          )}

          {card.relatedDoubt && (
            <div className="mt-2 text-xs text-ink-400 italic">
              Addresses: {card.relatedDoubt}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
