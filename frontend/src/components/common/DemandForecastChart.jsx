import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function DemandForecastChart({ weeks = [], series = [], dark = false }) {
  const data = weeks.map((w, i) => ({ week: w, demand: series[i] }));
  const grid = dark ? "#1e3a2a" : "#e2e8f0";
  const tick = dark ? "#94A3B8" : "#64748B";
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id={dark ? "demandFillDark" : "demandFill"} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22C55E" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#2563EB" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={grid} />
          <XAxis dataKey="week" stroke={tick} tick={{ fill: tick, fontSize: 12 }} />
          <YAxis stroke={tick} tick={{ fill: tick, fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              background: dark ? "#0B1720" : "#fff",
              border: "1px solid #166534",
              color: dark ? "#F8FAFC" : "#0F172A",
            }}
          />
          <Area type="monotone" dataKey="demand" stroke="#22C55E" fill={dark ? "url(#demandFillDark)" : "url(#demandFill)"} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
