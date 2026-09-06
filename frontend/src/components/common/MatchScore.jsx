export default function MatchScore({ score = 0, size = 72 }) {
  const r = 28;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 72 72" className="h-full w-full -rotate-90">
        <circle cx="36" cy="36" r={r} stroke="#e2e8f0" strokeWidth="8" fill="none" />
        <circle
          cx="36"
          cy="36"
          r={r}
          stroke="#2563EB"
          strokeWidth="8"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-sm font-extrabold">{score}%</p>
        <p className="text-[9px] uppercase tracking-wide text-slate-400">AI Match</p>
      </div>
    </div>
  );
}
