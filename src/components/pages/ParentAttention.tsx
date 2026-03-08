import DashboardLayout from "@/components/DashboardLayout";
import { Eye, Clock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useGetAssignments } from "@/hooks/api/useAssignments";
import { useMemo } from "react";

const ParentAttention = () => {
  const { user } = useAuth();
  const { data: assignments = [], isLoading } = useGetAssignments();

  // Generate attention log from assignments (placeholder - real data would come from attention tracking)
  const attentionLog = useMemo(() => {
    const log = [];
    assignments.forEach((assignment, index) => {
      const date = new Date(assignment.dueDate);
      const days = Math.floor(Math.random() * 10);
      const attendanceDate = new Date(date.getTime() - days * 24 * 60 * 60 * 1000);

      log.push({
        date: attendanceDate.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        subject: assignment.subject,
        start: `${String(8 + index * 2).padStart(2, "0")}:00`,
        end: `${String(8 + index * 2).padStart(2, "0")}:45`,
        avgFocus: Math.floor(Math.random() * 35) + 60,
        alerts: Math.floor(Math.random() * 8),
      });
    });
    return log.slice(0, 7);
  }, [assignments]);

  return (
    <DashboardLayout role="parent">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">
          Attention Log
        </h1>
        <p className="text-muted-foreground">
          Detailed session-by-session attention tracking for {user?.firstName}
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          <Eye size={32} className="mx-auto mb-2 opacity-30" />
          <p>Loading attention logs...</p>
        </div>
      ) : attentionLog.length > 0 ? (
        <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">
                  Date
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">
                  Subject
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">
                  Time
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">
                  Focus
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">
                  Alerts
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {attentionLog.map((l, i) => (
                <tr key={i} className="hover:bg-muted/30">
                  <td className="px-5 py-3 text-sm text-muted-foreground">{l.date}</td>
                  <td className="px-5 py-3 text-sm font-medium text-card-foreground">
                    {l.subject}
                  </td>
                  <td className="px-5 py-3 text-sm text-muted-foreground">
                    {l.start} - {l.end}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 rounded-full bg-muted">
                        <div
                          className={`h-1.5 rounded-full ${
                            l.avgFocus >= 75
                              ? "bg-success"
                              : l.avgFocus >= 50
                                ? "bg-warning"
                                : "bg-destructive"
                          }`}
                          style={{ width: `${l.avgFocus}%` }}
                        />
                      </div>
                      <span className="text-sm">{l.avgFocus}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        l.alerts <= 1
                          ? "bg-success/10 text-success"
                          : l.alerts <= 4
                            ? "bg-warning/10 text-warning"
                            : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {l.alerts}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground rounded-xl border border-border bg-card p-8">
          <Eye size={32} className="mx-auto mb-2 opacity-30" />
          <p>No attention logs available yet</p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ParentAttention;
