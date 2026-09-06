import { MapPin } from "lucide-react";
import { Card } from "../common/ui.jsx";

export default function RouteMap({ currentLocation = "Jaipur", destination = "Delhi" }) {
  return (
    <Card className="relative overflow-hidden p-0">
      <div className="h-64 bg-[radial-gradient(circle_at_20%_30%,#dcfce7,transparent_40%),radial-gradient(circle_at_80%_70%,#dbeafe,transparent_35%),linear-gradient(135deg,#ecfdf5,#f8fafc)] dark:bg-[linear-gradient(135deg,#0c1c14,#0f172a)]">
        <div className="absolute left-[18%] top-[32%] flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs shadow dark:bg-slate-900">
          <MapPin className="h-3 w-3 text-primary-green" /> {currentLocation}
        </div>
        <div className="absolute right-[16%] top-[58%] flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs shadow dark:bg-slate-900">
          <MapPin className="h-3 w-3 text-ai-blue" /> {destination}
        </div>
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 260">
          <path d="M80 90 C 140 40, 220 180, 320 150" fill="none" stroke="#2563EB" strokeWidth="3" strokeDasharray="8 6" />
          <circle cx="80" cy="90" r="7" fill="#166534" />
          <circle cx="320" cy="150" r="7" fill="#2563EB" />
        </svg>
      </div>
    </Card>
  );
}
