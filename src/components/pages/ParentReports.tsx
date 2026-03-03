import DashboardLayout from "@/components/DashboardLayout";
import { BarChart3, Eye, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const weeklyData = [
  { day: "Mon", focus: 85 },
  { day: "Tue", focus: 72 },
  { day: "Wed", focus: 90 },
  { day: "Thu", focus: 68 },
  { day: "Fri", focus: 78 },
];

const classBreakdown = [
  { subject: "Mathematics", focus: 88, duration: "45 min", lowPoints: 2 },
  { subject: "Physics", focus: 75, duration: "50 min", lowPoints: 5 },
  { subject: "English", focus: 92, duration: "40 min", lowPoints: 1 },
  { subject: "Computer Science", focus: 95, duration: "45 min", lowPoints: 0 },
  { subject: "History", focus: 65, duration: "45 min", lowPoints: 8 },
];

const ParentReports = () => (
  <DashboardLayout role="parent">
    <div className="mb-6">
      <h1 className="font-display text-2xl font-bold text-foreground">Child's Reports</h1>
      <p className="text-muted-foreground">Sarah Johnson — Comprehensive academic and focus reports</p>
    </div>

    {/* Weekly bar chart */}
    <div className="mb-6 rounded-xl border border-border bg-card p-5 shadow-card">
      <h3 className="mb-4 font-display font-semibold text-card-foreground">Weekly Focus Overview</h3>
      <div className="flex items-end gap-4 h-40">
        {weeklyData.map((d) => (
          <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
            <span className="text-xs font-medium text-muted-foreground">{d.focus}%</span>
            <div className="w-full rounded-t-md gradient-parent" style={{ height: `${d.focus}%` }} />
            <span className="text-xs text-muted-foreground">{d.day}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Per-class breakdown */}
    <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
      <div className="border-b border-border px-5 py-4">
        <h3 className="font-display font-semibold text-card-foreground">Per-Class Attention Breakdown</h3>
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Subject</th>
            <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Avg Focus</th>
            <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Duration</th>
            <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Distraction Events</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {classBreakdown.map((c, i) => (
            <tr key={i} className="hover:bg-muted/30">
              <td className="px-5 py-3 text-sm font-medium text-card-foreground">{c.subject}</td>
              <td className="px-5 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-20 rounded-full bg-muted">
                    <div className={`h-1.5 rounded-full ${c.focus >= 75 ? "bg-success" : c.focus >= 50 ? "bg-warning" : "bg-destructive"}`} style={{ width: `${c.focus}%` }} />
                  </div>
                  <span className="text-sm">{c.focus}%</span>
                </div>
              </td>
              <td className="px-5 py-3 text-sm text-muted-foreground">{c.duration}</td>
              <td className="px-5 py-3">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  c.lowPoints <= 2 ? "bg-success/10 text-success" : c.lowPoints <= 5 ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"
                }`}>{c.lowPoints} events</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </DashboardLayout>
);

export default ParentReports;
