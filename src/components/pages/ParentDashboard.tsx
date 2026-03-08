import { useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import Timetable from "@/components/Timetable";
import { Eye, GraduationCap, BarChart3, Clock, TrendingUp, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useGetClasses } from "@/hooks/api/useClasses";
import { useGetAssignments } from "@/hooks/api/useAssignments";

const ParentDashboard = () => {
  const { user } = useAuth();
  const { data: classes = [], isLoading: classesLoading } = useGetClasses();
  const { data: assignments = [], isLoading: assignmentsLoading } =
    useGetAssignments();

  // Mock weekly focus data (placeholder - would come from real attention tracking)
  const weeklyFocus = [
    { day: "Mon", score: 85 },
    { day: "Tue", score: 72 },
    { day: "Wed", score: 90 },
    { day: "Thu", score: 68 },
    { day: "Fri", score: 78 },
  ];

  // Calculate subject performance from assignments and grades
  const subjects = useMemo(() => {
    const subjectMap = new Map<string, { name: string; grades: number[]; count: number; attention: number }>();

    assignments.forEach((assign) => {
      assign.submissions?.forEach((submission) => {
        if (submission.grade !== undefined) {
          const subject = assign.subject;
          if (!subjectMap.has(subject)) {
            subjectMap.set(subject, {
              name: subject,
              grades: [],
              count: 0,
              attention: Math.floor(Math.random() * 35) + 60, // Placeholder
            });
          }
          const entry = subjectMap.get(subject)!;
          entry.grades.push(submission.grade);
          entry.count++;
        }
      });
    });

    return Array.from(subjectMap.values()).map((s) => {
      const avgGrade =
        s.grades.length > 0
          ? (
              s.grades.reduce((a, b) => a + b, 0) / s.grades.length / (assignments[0]?.totalMarks || 100) *
              100
            ).toFixed(1)
          : "N/A";

      return {
        name: s.name,
        grade: getLetterGrade(parseFloat(avgGrade as string)),
        attention: s.attention,
        trend: Math.random() > 0.5 ? "up" : "down",
      };
    });
  }, [assignments]);

  const getLetterGrade = (percentage: number): string => {
    if (percentage >= 90) return "A+";
    if (percentage >= 85) return "A";
    if (percentage >= 80) return "A-";
    if (percentage >= 75) return "B+";
    if (percentage >= 70) return "B";
    if (percentage >= 65) return "B-";
    if (percentage >= 60) return "C";
    if (percentage >= 55) return "C-";
    return "F";
  };

  const avgFocus = Math.round(
    weeklyFocus.reduce((a, b) => a + b.score, 0) / weeklyFocus.length
  );

  return (
    <DashboardLayout role="parent">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">
          Your Child's Progress
        </h1>
        <p className="text-muted-foreground">
          {user?.firstName} — Grade {user?.grade || "Unknown"}
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Overall Focus"
          value={`${avgFocus}%`}
          change="4% from last week"
          positive
          icon={<Eye size={20} className="text-parent" />}
          gradient="gradient-parent"
        />
        <StatCard
          label="GPA"
          value="3.7"
          change="0.2 improvement"
          positive
          icon={<GraduationCap size={20} className="text-primary" />}
        />
        <StatCard
          label="Attendance"
          value="96%"
          icon={<Clock size={20} className="text-success" />}
        />
        <StatCard
          label="Classes"
          value={classes.length.toString()}
          change={`${assignments.length} assignments`}
          icon={<TrendingUp size={20} className="text-secondary" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Weekly Focus Chart */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display font-semibold text-card-foreground">
                Weekly Focus Report
              </h3>
              <Link
                to="/parent/attention"
                className="text-xs font-medium text-primary hover:underline"
              >
                Detailed Report
              </Link>
            </div>
            <div className="flex items-end gap-3 h-40">
              {weeklyFocus.map((d) => (
                <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-xs font-medium text-muted-foreground">
                    {d.score}%
                  </span>
                  <div
                    className="w-full rounded-t-md gradient-parent"
                    style={{ height: `${d.score}%` }}
                  />
                  <span className="text-xs text-muted-foreground">{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Subjects */}
          <div className="rounded-xl border border-border bg-card shadow-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h3 className="font-display font-semibold text-card-foreground">
                Subject Performance
              </h3>
              <Link
                to="/parent/grades"
                className="text-xs font-medium text-primary hover:underline"
              >
                All Grades
              </Link>
            </div>
            <div className="divide-y divide-border">
              {subjects.length > 0 ? (
                subjects.map((s, i) => (
                  <div key={i} className="flex items-center gap-4 px-5 py-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-card-foreground">
                        {s.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                        {s.grade}
                      </span>
                      <div className="flex items-center gap-1 w-20">
                        <div className="h-1.5 flex-1 rounded-full bg-muted">
                          <div
                            className={`h-1.5 rounded-full ${
                              s.attention >= 80
                                ? "bg-success"
                                : s.attention >= 60
                                  ? "bg-warning"
                                  : "bg-destructive"
                            }`}
                            style={{ width: `${s.attention}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {s.attention}%
                        </span>
                      </div>
                      {s.trend === "up" ? (
                        <TrendingUp size={14} className="text-success" />
                      ) : (
                        <TrendingUp size={14} className="text-destructive rotate-180" />
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-5 py-8 text-center text-muted-foreground">
                  No grades available yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <Timetable />

          {/* Concerns */}
          <div className="rounded-xl border border-border bg-card shadow-card">
            <div className="flex items-center gap-2 border-b border-border px-5 py-4">
              <AlertTriangle size={18} className="text-warning" />
              <h3 className="font-display font-semibold text-card-foreground">
                Attention Needed
              </h3>
            </div>
            <div className="space-y-3 p-5">
              {subjects.some((s) => s.attention < 70) ? (
                <div className="rounded-lg bg-destructive/10 p-3">
                  <p className="text-sm font-medium text-destructive">
                    Low focus detected in some subjects
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    See detailed attention report for more info
                  </p>
                </div>
              ) : (
                <div className="rounded-lg bg-success/10 p-3">
                  <p className="text-sm font-medium text-success">
                    Great overall focus!
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    All subjects above 75% attention
                  </p>
                </div>
              )}

              {assignments.some(
                (a) =>
                  new Date(a.dueDate) < new Date() &&
                  !a.submissions?.some((s) => s.status === "graded")
              ) && (
                <div className="rounded-lg bg-warning/10 p-3">
                  <p className="text-sm font-medium text-warning">
                    Pending assignments
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Check assignments page for details
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ParentDashboard;
