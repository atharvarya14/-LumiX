import DashboardLayout from "@/components/DashboardLayout";
import { Eye, TrendingUp, AlertTriangle, Users } from "lucide-react";
import { Link } from "react-router-dom";

const students = [
  { name: "Alex Johnson", avgFocus: 92, trend: "up", sessions: 24, status: "excellent" },
  { name: "Emma Wilson", avgFocus: 88, trend: "up", sessions: 23, status: "good" },
  { name: "David Lee", avgFocus: 85, trend: "up", sessions: 24, status: "good" },
  { name: "Sarah Chen", avgFocus: 78, trend: "down", sessions: 22, status: "fair" },
  { name: "Lisa Wang", avgFocus: 72, trend: "down", sessions: 20, status: "fair" },
  { name: "Mike Brown", avgFocus: 45, trend: "down", sessions: 18, status: "poor" },
  { name: "Tom Davis", avgFocus: 68, trend: "up", sessions: 21, status: "fair" },
  { name: "Anna Park", avgFocus: 91, trend: "up", sessions: 24, status: "excellent" },
];

const TeacherAttention = () => {
  return (
    <DashboardLayout role="teacher">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Attention Reports</h1>
        <p className="text-muted-foreground">Real-time student focus monitoring powered by AI webcam analysis</p>
      </div>

      {/* Summary cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-success/10 p-2"><Eye size={20} className="text-success" /></div>
            <div>
              <p className="text-xs text-muted-foreground">High Focus (75%+)</p>
              <p className="text-xl font-bold font-display text-card-foreground">5 students</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-warning/10 p-2"><AlertTriangle size={20} className="text-warning" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Moderate (50-74%)</p>
              <p className="text-xl font-bold font-display text-card-foreground">2 students</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-destructive/10 p-2"><Users size={20} className="text-destructive" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Low Focus (&lt;50%)</p>
              <p className="text-xl font-bold font-display text-card-foreground">1 student</p>
            </div>
          </div>
        </div>
      </div>

      {/* Students table */}
      <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Student</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Avg Focus</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Trend</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Sessions</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {students.map((s, i) => (
              <tr key={i} className="hover:bg-muted/30">
                <td className="px-5 py-3 text-sm font-medium text-card-foreground">{s.name}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-20 rounded-full bg-muted">
                      <div
                        className={`h-1.5 rounded-full ${s.avgFocus >= 75 ? "bg-success" : s.avgFocus >= 50 ? "bg-warning" : "bg-destructive"}`}
                        style={{ width: `${s.avgFocus}%` }}
                      />
                    </div>
                    <span className="text-sm text-card-foreground">{s.avgFocus}%</span>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <TrendingUp size={16} className={s.trend === "up" ? "text-success" : "text-destructive rotate-180"} />
                </td>
                <td className="px-5 py-3 text-sm text-muted-foreground">{s.sessions}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    s.status === "excellent" ? "bg-success/10 text-success" :
                    s.status === "good" ? "bg-info/10 text-info" :
                    s.status === "fair" ? "bg-warning/10 text-warning" :
                    "bg-destructive/10 text-destructive"
                  }`}>{s.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default TeacherAttention;
