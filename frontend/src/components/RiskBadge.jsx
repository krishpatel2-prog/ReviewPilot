const styles = {
  low: 'border-emerald-300/30 bg-emerald-400/15 text-emerald-200',
  medium: 'border-amber-300/30 bg-amber-400/15 text-amber-200',
  high: 'border-rose-300/30 bg-rose-400/15 text-rose-200',
};

function RiskBadge({ risk = 'medium' }) {
  const normalizedRisk = String(risk).toLowerCase();
  const className = styles[normalizedRisk] ?? styles.medium;

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${className}`}>
      {normalizedRisk}
    </span>
  );
}

export default RiskBadge;
