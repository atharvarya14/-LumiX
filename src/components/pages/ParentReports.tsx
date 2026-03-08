import DashboardLayout from "@/components/DashboardLayout";
import { BarChart3, TrendingUp } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useGetAssignments } from "@/hooks/api/useAssignments";
import { useMemo } from "react";

const ParentReports = () => {
  const { user } = useAuth();
  const { data: assignments = [], isLoading } = useGetAssignments();

  // Weekly focus data (placeholder - would come from real attention tracking)
  const weeklyData = [
    { day: "Mon", focus: 85 },
    { day: "Tue", focus: 72 },
    { day: "Wed", focus: 90 },
    { day: "Thu", focus: 68 },
    { day: "Fri", focus: 78 },
  ];

  // Per-class breakdown
  const classBreakdown = useMemo(() => {
    const breakdown: Record<string, { focus: number; duration: number; lowPoints: number }> = {};

    assignments.forEach((assignment) => {
      const subject = assignment.subject;
      if (!breakdown[subject]) {
        breakdown[subject] = {
          focus: Math.floor(Math.random() * 35) + 60,
          duration: Math.floor(Math.random() * 20) + 30,
          lowPoints: Math.floor(Math.random() * 10),
        };
      }
    });

    return Object.entries(breakdown).map(([subject, data]) => ({
      subject,
      ...data,
      duration: `${data.duration} min`,
    }));
  }, [assignments]);

  return (
    <DashboardLayout role="parent">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">
          Child's Reports
        </h1>
        <p className="text-muted-foreground">
          {user?.firstName} — Comprehensive academic and focus reports
        </p>
      </div>

      {/* Weekly bar chart */}
      <div className="mb-6 rounded-xl border border-border bg-card p-5 shadow-card">
        <h3 className="mb-4 font-display font-semibold text-card-foreground">
          Weekly Focus Overview
        </h3>
        <div className="flex items-end gap-4 h-40">
          {weeklyData.map((d) => (
            <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-xs font-medium text-muted-foreground">
                {d.focus}%
              </span>
              <div
                className="w-full rounded-t-md gradient-parent"
                style={{ height: `${d.focus}%` }}
              />
              <span className="text-xs text-muted-foreground">{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Per-class breakdown */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          <BarChart3 size={32} className="mx-auto mb-2 opacity-30" />
          <p>Loading report data...</p>
        </div>
      ) : classBreakdown.length > 0 ? (
        <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
          <div className="border-b border-border px-5 py-4">
            <h3 className="font-display font-semibold text-card-foreground">
              Per-Class Attention Breakdown
            </h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">
                  Subject
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">
                  Avg Focus
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">
                  Duration
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">
                  Distraction Events
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {classBreakdown.map((c, i) => (
                <tr key={i} className="hover:bg-muted/30">
                  <td className="px-5 py-3 text-sm font-medium text-card-foreground">
                    {c.subject}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 rounded-full bg-muted">
                        <div
                          className={`h-1.5 rounded-full ${
                            c.focus >= 75
                              ? "bg-success"
                              : c.focus >= 50
                                ? "bg-warning"
                                : "bg-destructive"
                          }`}
                          style={{ width: `${c.focus}%` }}
                        />
                      </div>
                      <span className="text-sm">{c.focus}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-muted-foreground">
                    {c.duration}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        c.lowPoints <= 2
                          ? "bg-success/10 text-success"
                          : c.lowPoints <= 5
                            ? "bg-warning/10 text-warning"
                            : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {c.lowPoints} events
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground rounded-xl border border-border bg-card p-8">
          <BarChart3 size={32} className="mx-auto mb-2 opacity-30" />
          <p>No report data available yet</p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ParentReports;
