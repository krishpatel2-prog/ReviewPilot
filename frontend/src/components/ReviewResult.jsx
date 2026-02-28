import RiskBadge from './RiskBadge';

function SectionIcon({ type }) {
  const iconClass = 'h-5 w-5 text-cyan-200';

  if (type === 'summary') {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 5h16M4 12h10M4 19h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === 'risk') {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="m12 3 8 4.5v9L12 21 4 16.5v-9L12 3Z" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    );
  }

  if (type === 'issues') {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
        <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function ResultCard({ title, iconType, children }) {
  return (
    <article className="glass-panel p-5 sm:p-6">
      <header className="mb-4 flex items-center gap-2">
        <SectionIcon type={iconType} />
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-300">{title}</h3>
      </header>
      {children}
    </article>
  );
}

function SkeletonBar({ widthClass = 'w-full' }) {
  return <div className={`h-4 ${widthClass} animate-pulse rounded-md bg-white/10`} />;
}

function ReviewResult({ result, isLoading, repo, prNumber, onReset }) {
  if (isLoading) {
    return (
      <section className="animate-fade-up space-y-4">
        <div className="glass-panel space-y-3 p-6">
          <SkeletonBar widthClass="w-32" />
          <SkeletonBar />
          <SkeletonBar widthClass="w-4/5" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="glass-panel space-y-3 p-6">
            <SkeletonBar widthClass="w-24" />
            <SkeletonBar widthClass="w-20" />
          </div>
          <div className="glass-panel space-y-3 p-6">
            <SkeletonBar widthClass="w-24" />
            <SkeletonBar />
            <SkeletonBar widthClass="w-3/4" />
          </div>
        </div>
      </section>
    );
  }

  if (!result) return null;

  const prUrl = `https://github.com/${repo}/pull/${prNumber}`;
  const issues = Array.isArray(result.issues) ? result.issues : [];
  const suggestions = Array.isArray(result.suggestions) ? result.suggestions : [];

  return (
    <section className="animate-fade-up space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <ResultCard title="Summary" iconType="summary">
          <p className="text-sm leading-7 text-slate-100">{result.summary}</p>
        </ResultCard>

        <ResultCard title="Risk Level" iconType="risk">
          <div className="space-y-3">
            <RiskBadge risk={result.risk} />
            {result.risk_reason ? <p className="text-sm text-slate-300">{result.risk_reason}</p> : null}
          </div>
        </ResultCard>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ResultCard title="Issues" iconType="issues">
          {issues.length > 0 ? (
            <ul className="space-y-2 text-sm text-slate-200">
              {issues.map((issue, index) => (
                <li key={`${issue}-${index}`} className="rounded-lg border border-white/10 bg-slate-900/50 px-3 py-2">
                  {issue}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-300">No major issues found.</p>
          )}
        </ResultCard>

        <ResultCard title="Suggestions" iconType="suggestions">
          {suggestions.length > 0 ? (
            <ul className="space-y-2 text-sm text-slate-200">
              {suggestions.map((suggestion, index) => (
                <li
                  key={`${suggestion}-${index}`}
                  className="rounded-lg border border-white/10 bg-slate-900/50 px-3 py-2"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-300">No suggestions provided.</p>
          )}
        </ResultCard>
      </div>

      <footer className="glass-panel flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <a
          href={prUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/15"
        >
          View PR on GitHub
        </a>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center justify-center rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-white/20 hover:text-white"
        >
          Run another review
        </button>
      </footer>
    </section>
  );
}

export default ReviewResult;
