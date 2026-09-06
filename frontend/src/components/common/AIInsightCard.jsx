import { Brain } from "lucide-react";
import { Card, Badge } from "./ui.jsx";

export default function AIInsightCard({ title, text, crop, current, forecast, action }) {
  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-950/40 dark:to-blue-950/30">
      <Badge tone="blue" className="mb-3">
        <Brain className="mr-1 h-3 w-3" /> AI Powered
      </Badge>
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{text}</p>
      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        <div className="rounded-xl bg-white/80 p-3 dark:bg-slate-900/60">
          <p className="text-xs text-slate-500">Crop</p>
          <p className="font-bold">{crop}</p>
        </div>
        <div className="rounded-xl bg-white/80 p-3 dark:bg-slate-900/60">
          <p className="text-xs text-slate-500">Current</p>
          <p className="font-bold">{current}</p>
        </div>
        <div className="rounded-xl bg-white/80 p-3 dark:bg-slate-900/60">
          <p className="text-xs text-slate-500">Forecast</p>
          <p className="font-bold text-ai-blue">{forecast}</p>
        </div>
      </div>
      {action && <p className="mt-4 text-sm font-medium text-primary-green">{action}</p>}
    </Card>
  );
}
