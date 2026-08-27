import { useState } from 'react';
import PostcardGrid from './PostcardGrid';
import StudyPlan from './StudyPlan';

export default function PreparationView({ session, onBack }) {
  const { preparation } = session;
  const [activeTab, setActiveTab] = useState('postcards');
  const [filter, setFilter] = useState('all');

  return (
    <div className="animate-in">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-sm text-ink-500 hover:text-ink-800 transition"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to input
      </button>

      <header className="mb-8">
        <h2 className="font-display text-3xl sm:text-4xl text-ink-900 mb-2">
          {preparation.title}
        </h2>
        <p className="text-ink-600 text-lg max-w-3xl">{preparation.summary}</p>

        {preparation.demo && (
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Demo mode — add OPENAI_API_KEY to backend for full AI-powered preparation
          </div>
        )}
      </header>

      <div className="flex gap-1 mb-8 bg-ink-100 p-1 rounded-xl w-fit flex-wrap">
        {[
          { id: 'postcards', label: 'Revision Postcards', count: preparation.postcards?.length },
          { id: 'plan', label: 'Study Plan', count: preparation.studyPlan?.length },
          { id: 'takeaways', label: 'Key Takeaways' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === tab.id
                ? 'bg-white text-ink-900 shadow-sm'
                : 'text-ink-500 hover:text-ink-700'
            }`}
          >
            {tab.label}
            {tab.count != null && (
              <span className="ml-1.5 text-xs opacity-60">({tab.count})</span>
            )}
          </button>
        ))}
      </div>

      {activeTab === 'postcards' && (
        <>
          <div className="flex flex-wrap gap-2 mb-6">
            {['all', 'easy', 'medium', 'hard'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition ${
                  filter === f
                    ? 'bg-ink-900 text-white'
                    : 'bg-white border border-ink-200 text-ink-600 hover:border-ink-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <PostcardGrid postcards={preparation.postcards || []} filter={filter} />
        </>
      )}

      {activeTab === 'plan' && <StudyPlan plan={preparation.studyPlan} />}

      {activeTab === 'takeaways' && (
        <div className="space-y-6 max-w-2xl">
          <div className="bg-white rounded-xl border border-ink-200 p-6">
            <h3 className="font-semibold text-ink-900 mb-4">Key Takeaways</h3>
            <ul className="space-y-3">
              {preparation.keyTakeaways?.map((item, i) => (
                <li key={i} className="flex gap-3 text-ink-700">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-sage/15 text-sage-dark text-xs font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {preparation.practiceAdvice && (
            <div className="bg-gradient-to-br from-accent/5 to-accent/10 rounded-xl border border-accent/20 p-6">
              <h3 className="font-semibold text-accent-dark mb-2">Before the Exam</h3>
              <p className="text-ink-700 leading-relaxed">{preparation.practiceAdvice}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
