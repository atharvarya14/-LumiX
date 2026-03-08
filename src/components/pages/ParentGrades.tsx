import DashboardLayout from "@/components/DashboardLayout";
import { GraduationCap, TrendingUp } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useGetAssignments } from "@/hooks/api/useAssignments";
import { useMemo } from "react";

const ParentGrades = () => {
  const { user } = useAuth();
  const { data: assignments = [], isLoading } = useGetAssignments();

  // Get child's grades from assignments
  const subjectGrades = useMemo(() => {
    const gradesBySubject: Record<string, { grades: number[]; count: number }> = {};

    assignments.forEach((assignment) => {
      assignment.submissions?.forEach((submission) => {
        const subject = assignment.subject;
        if (!gradesBySubject[subject]) {
          gradesBySubject[subject] = { grades: [], count: 0 };
        }
        if (submission.grade !== undefined) {
          gradesBySubject[subject].grades.push(submission.grade);
          gradesBySubject[subject].count++;
        }
      });
    });

    return Object.entries(gradesBySubject).map(([subject, data]) => {
      const avgGrade =
        data.grades.length > 0
          ? Math.round(data.grades.reduce((a, b) => a + b, 0) / data.grades.length)
          : 0;

      const gradePercentage = (avgGrade / (assignments[0]?.totalMarks || 100)) * 100;

      return {
        subject,
        grade: getLetterGrade(gradePercentage),
        percentage: gradePercentage.toFixed(1),
        count: data.count,
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
    return "F";
  };

  return (
    <DashboardLayout role="parent">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Grades</h1>
        <p className="text-muted-foreground">
          {user?.firstName}'s academic performance across all subjects
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          <GraduationCap size={32} className="mx-auto mb-2 opacity-30" />
          <p>Loading grades...</p>
        </div>
      ) : subjectGrades.length > 0 ? (
        <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">
                  Subject
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">
                  Grade
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">
                  Percentage
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">
                  Submissions
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {subjectGrades.map((g, i) => (
                <tr key={i} className="hover:bg-muted/30">
                  <td className="px-5 py-3 text-sm font-medium text-card-foreground">
                    {g.subject}
                  </td>
                  <td className="px-5 py-3">
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                      {g.grade}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-card-foreground">
                    {g.percentage}%
                  </td>
                  <td className="px-5 py-3 text-sm text-muted-foreground">
                    {g.count}
                  </td>
                  <td className="px-5 py-3">
                    <TrendingUp
                      size={16}
                      className={
                        g.trend === "up"
                          ? "text-success"
                          : "text-destructive rotate-180"
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground rounded-xl border border-border bg-card p-8">
          <GraduationCap size={32} className="mx-auto mb-2 opacity-30" />
          <p>No grades available yet</p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ParentGrades;
