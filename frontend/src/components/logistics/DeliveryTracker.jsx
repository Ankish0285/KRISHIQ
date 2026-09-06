import { CheckCircle2, Circle } from "lucide-react";
import { ORDER_STEPS } from "../../utils/mockData.js";
import { Card } from "../common/ui.jsx";
import { clsx } from "../common/cn.js";

export default function DeliveryTracker({ status, compact }) {
  const current = Math.max(0, ORDER_STEPS.indexOf(status));
  return (
    <Card className={compact ? "p-4" : ""}>
      <ol className="grid gap-3 md:grid-cols-6">
        {ORDER_STEPS.map((step, i) => {
          const done = i <= current && status !== "Cancelled";
          return (
            <li key={step} className="flex items-start gap-2">
              {done ? <CheckCircle2 className="h-5 w-5 text-leaf" /> : <Circle className="h-5 w-5 text-slate-300" />}
              <span className={clsx("text-xs font-medium", done ? "text-slate-800 dark:text-slate-100" : "text-slate-400")}>{step}</span>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}
