import DashboardLayout from "@/components/DashboardLayout";
import { BarChart3, Eye } from "lucide-react";

const reports = [
  { subject: "Mathematics", focus: 85, grade: "A-", sessions: 12 },
  { subject: "Physics", focus: 78, grade: "B+", sessions: 10 },
  { subject: "English", focus: 92, grade: "A", sessions: 11 },
  { subject: "Computer Science", focus: 95, grade: "A+", sessions: 12 },
  { subject: "History", focus: 65, grade: "B", sessions: 9 },
  { subject: "Art", focus: 88, grade: "A-", sessions: 8 },
];

const StudentReports = () => (
  <DashboardLayout role="student">
    <div className="mb-6">
      <h1 className="font-display text-2xl font-bold text-foreground">My Reports</h1>
      <p className="text-muted-foreground">Your attention and performance analytics</p>
    </div>

    <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Subject</th>
            <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Focus Score</th>
            <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Grade</th>
            <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Sessions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {reports.map((r, i) => (
            <tr key={i} className="hover:bg-muted/30">
              <td className="px-5 py-3 text-sm font-medium text-card-foreground">{r.subject}</td>
              <td className="px-5 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-20 rounded-full bg-muted">
                    <div className={`h-1.5 rounded-full ${r.focus >= 75 ? "bg-success" : r.focus >= 50 ? "bg-warning" : "bg-destructive"}`} style={{ width: `${r.focus}%` }} />
                  </div>
                  <span className="text-sm">{r.focus}%</span>
                </div>
              </td>
              <td className="px-5 py-3">
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">{r.grade}</span>
              </td>
              <td className="px-5 py-3 text-sm text-muted-foreground">{r.sessions}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </DashboardLayout>
);

export default StudentReports;
