export default function StudyPlan({ plan }) {
  if (!plan?.length) return null;

  return (
    <div className="space-y-4">
      {plan.map((phase, i) => (
        <div
          key={i}
          className="relative pl-8 pb-6 last:pb-0"
        >
          {i < plan.length - 1 && (
            <div className="absolute left-[11px] top-8 bottom-0 w-0.5 bg-ink-200" />
          )}
          <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center">
            {i + 1}
          </div>

          <div className="bg-white rounded-xl border border-ink-200 p-5 shadow-sm">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h4 className="font-semibold text-ink-900">{phase.phase}</h4>
              <span className="text-xs bg-ink-100 text-ink-600 px-2.5 py-0.5 rounded-full">
                {phase.duration}
              </span>
            </div>
            <p className="text-sm text-ink-600 mb-3">{phase.focus}</p>
            <div className="flex flex-wrap gap-2">
              {phase.topics?.map((topic, j) => (
                <span
                  key={j}
                  className="text-xs bg-sage/10 text-sage-dark px-2.5 py-1 rounded-lg border border-sage/20"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
