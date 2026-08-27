import { useState } from 'react';

export default function InputForm({ onSubmit, loading }) {
  const [form, setForm] = useState({
    subject: '',
    examDate: '',
    doubts: '',
    questionPaper: '',
    studyPlan: '',
  });

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-ink-700 mb-1.5">
            Subject / Exam Name
          </label>
          <input
            type="text"
            value={form.subject}
            onChange={update('subject')}
            placeholder="e.g. Physics Board Exam, UPSC Prelims"
            className="w-full px-4 py-3 rounded-xl border border-ink-200 bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink-700 mb-1.5">Exam Date</label>
          <input
            type="date"
            value={form.examDate}
            onChange={update('examDate')}
            className="w-full px-4 py-3 rounded-xl border border-ink-200 bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-ink-700 mb-1.5">
          Your Doubts
          <span className="text-ink-400 font-normal ml-1">— concepts you don't understand</span>
        </label>
        <textarea
          value={form.doubts}
          onChange={update('doubts')}
          rows={4}
          placeholder="List your doubts, one per line...&#10;e.g. How does photosynthesis work?&#10;What is the difference between AC and DC current?"
          className="w-full px-4 py-3 rounded-xl border border-ink-200 bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition resize-y"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-ink-700 mb-1.5">
          Question Paper / Study Material
          <span className="text-ink-400 font-normal ml-1">— paste text from your syllabus or past papers</span>
        </label>
        <textarea
          value={form.questionPaper}
          onChange={update('questionPaper')}
          rows={6}
          placeholder="Paste your question paper, syllabus topics, or study notes here..."
          className="w-full px-4 py-3 rounded-xl border border-ink-200 bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition resize-y"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-ink-700 mb-1.5">
          Your Study Plan
          <span className="text-ink-400 font-normal ml-1">— how you plan to prepare</span>
        </label>
        <textarea
          value={form.studyPlan}
          onChange={update('studyPlan')}
          rows={4}
          placeholder="Describe your study plan...&#10;e.g. Day 1: Mechanics, Day 2: Thermodynamics, Day 3: Practice papers"
          className="w-full px-4 py-3 rounded-xl border border-ink-200 bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition resize-y"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto px-8 py-3.5 bg-accent hover:bg-accent-dark disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg shadow-accent/25 transition-all hover:shadow-xl hover:shadow-accent/30 active:scale-[0.98]"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Preparing your revision...
          </span>
        ) : (
          'Generate Preparation Plan'
        )}
      </button>
    </form>
  );
}
