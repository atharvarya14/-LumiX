import DashboardLayout from "@/components/DashboardLayout";
import { Eye, Clock } from "lucide-react";

const attentionLog = [
  { date: "Feb 8", subject: "Mathematics", start: "08:00", end: "08:45", avgFocus: 88, alerts: 1 },
  { date: "Feb 8", subject: "Physics", start: "09:00", end: "09:45", avgFocus: 72, alerts: 4 },
  { date: "Feb 7", subject: "English", start: "10:00", end: "10:45", avgFocus: 94, alerts: 0 },
  { date: "Feb 7", subject: "CS", start: "11:00", end: "11:45", avgFocus: 96, alerts: 0 },
  { date: "Feb 7", subject: "History", start: "13:00", end: "13:45", avgFocus: 58, alerts: 7 },
  { date: "Feb 6", subject: "Mathematics", start: "08:00", end: "08:45", avgFocus: 82, alerts: 2 },
  { date: "Feb 6", subject: "Art", start: "14:00", end: "14:45", avgFocus: 90, alerts: 1 },
];

const ParentAttention = () => (
  <DashboardLayout role="parent">
    <div className="mb-6">
      <h1 className="font-display text-2xl font-bold text-foreground">Attention Log</h1>
      <p className="text-muted-foreground">Detailed session-by-session webcam attention tracking for Sarah</p>
    </div>

    <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Date</th>
            <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Subject</th>
            <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Time</th>
            <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Focus</th>
            <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Alerts</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {attentionLog.map((l, i) => (
            <tr key={i} className="hover:bg-muted/30">
              <td className="px-5 py-3 text-sm text-muted-foreground">{l.date}</td>
              <td className="px-5 py-3 text-sm font-medium text-card-foreground">{l.subject}</td>
              <td className="px-5 py-3 text-sm text-muted-foreground">{l.start} - {l.end}</td>
              <td className="px-5 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-16 rounded-full bg-muted">
                    <div className={`h-1.5 rounded-full ${l.avgFocus >= 75 ? "bg-success" : l.avgFocus >= 50 ? "bg-warning" : "bg-destructive"}`} style={{ width: `${l.avgFocus}%` }} />
                  </div>
                  <span className="text-sm">{l.avgFocus}%</span>
                </div>
              </td>
              <td className="px-5 py-3">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  l.alerts <= 1 ? "bg-success/10 text-success" : l.alerts <= 4 ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"
                }`}>{l.alerts}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </DashboardLayout>
);

export default ParentAttention;
