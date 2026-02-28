function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-30" cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-90" fill="currentColor" d="M12 3a9 9 0 0 1 9 9h-3a6 6 0 0 0-6-6V3Z" />
    </svg>
  );
}

function ReviewForm({ repo, prNumber, onRepoChange, onPrNumberChange, onSubmit, isLoading }) {
  return (
    <section className="glass-panel mb-6 p-5 sm:p-6">
      <form className="space-y-5" onSubmit={onSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-200">GitHub Repository</span>
            <input
              type="text"
              value={repo}
              onChange={(event) => onRepoChange(event.target.value)}
              placeholder="owner/repo"
              className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/20"
              required
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-200">Pull Request Number</span>
            <input
              type="number"
              min="1"
              value={prNumber}
              onChange={(event) => onPrNumberChange(event.target.value)}
              placeholder="42"
              className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/20"
              required
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:from-cyan-300 hover:to-indigo-300 disabled:cursor-not-allowed disabled:opacity-75"
        >
          {isLoading ? (
            <>
              <Spinner />
              Analyzing PR...
            </>
          ) : (
            'Run AI Review'
          )}
        </button>
      </form>
    </section>
  );
}

export default ReviewForm;
