import { motion } from "framer-motion";
import { Camera, Wifi, WifiOff } from "lucide-react";
import { useState, useEffect } from "react";

interface AttentionMonitorProps {
  compact?: boolean;
}

const AttentionMonitor = ({ compact = false }: AttentionMonitorProps) => {
  const [attention, setAttention] = useState(87);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setAttention((prev) => {
        const delta = Math.random() * 10 - 4;
        return Math.min(100, Math.max(30, prev + delta));
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const getColor = () => {
    if (attention >= 75) return "text-success";
    if (attention >= 50) return "text-warning";
    return "text-destructive";
  };

  const getBgColor = () => {
    if (attention >= 75) return "bg-success/10";
    if (attention >= 50) return "bg-warning/10";
    return "bg-destructive/10";
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="relative">
          <Camera size={16} className={getColor()} />
          {isActive && (
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-success animate-pulse" />
          )}
        </div>
        <span className={`text-sm font-semibold ${getColor()}`}>{Math.round(attention)}%</span>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-card-foreground">Attention Monitor</h3>
        <button
          onClick={() => setIsActive(!isActive)}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
            isActive ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
          }`}
        >
          {isActive ? <Wifi size={12} /> : <WifiOff size={12} />}
          {isActive ? "Live" : "Paused"}
        </button>
      </div>

      <div className="flex items-center gap-6">
        {/* Webcam preview mock */}
        <div className="relative h-28 w-40 overflow-hidden rounded-lg bg-foreground/5">
          <div className="absolute inset-0 flex items-center justify-center">
            <Camera size={32} className="text-muted-foreground/40" />
          </div>
          {isActive && (
            <div className="absolute left-2 top-2 flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
              <span className="text-[10px] font-medium text-destructive">REC</span>
            </div>
          )}
        </div>

        {/* Score */}
        <div className="flex-1">
          <div className="relative mx-auto h-24 w-24">
            <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
              <motion.circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke={
                  attention >= 75
                    ? "hsl(var(--success))"
                    : attention >= 50
                    ? "hsl(var(--warning))"
                    : "hsl(var(--destructive))"
                }
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(attention / 100) * 264} 264`}
                initial={false}
                animate={{ strokeDasharray: `${(attention / 100) * 264} 264` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-2xl font-bold font-display ${getColor()}`}>{Math.round(attention)}%</span>
              <span className="text-[10px] text-muted-foreground">Focus</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {[
          { label: "Avg Today", value: "82%" },
          { label: "Peak", value: "96%" },
          { label: "Low", value: "45%" },
        ].map((stat) => (
          <div key={stat.label} className={`rounded-lg ${getBgColor()} px-3 py-2 text-center`}>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className={`font-semibold font-display ${getColor()}`}>{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttentionMonitor;
