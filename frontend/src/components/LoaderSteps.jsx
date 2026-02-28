const stepDescriptions = [
  'Fetching PR data',
  'Analyzing code',
  'Posting review to GitHub',
];

function LoaderSteps({ activeStep }) {
  return (
    <section className="glass-panel mb-6 p-5 sm:p-6">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-slate-300">Processing</h2>
      <div className="space-y-3">
        {stepDescriptions.map((label, index) => {
          const isComplete = activeStep > index;
          const isActive = activeStep === index;

          return (
            <div
              key={label}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900/50 px-3 py-2"
            >
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                  isComplete
                    ? 'bg-emerald-400/20 text-emerald-200'
                    : isActive
                      ? 'bg-cyan-400/20 text-cyan-200'
                      : 'bg-white/10 text-slate-400'
                }`}
              >
                {isComplete ? '?' : index + 1}
              </div>
              <p className={`text-sm ${isActive ? 'text-slate-100' : 'text-slate-300'}`}>{label}</p>
              {isActive ? <div className="ml-auto h-2 w-2 animate-pulse rounded-full bg-cyan-300" /> : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default LoaderSteps;
