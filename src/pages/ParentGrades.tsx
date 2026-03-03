import DashboardLayout from "@/components/DashboardLayout";
import { GraduationCap, TrendingUp } from "lucide-react";

const grades = [
  { subject: "Mathematics", midterm: "A-", assignments: "A", quizzes: "B+", final: "A-", trend: "up" },
  { subject: "Physics", midterm: "B+", assignments: "B", quizzes: "B+", final: "B+", trend: "down" },
  { subject: "English", midterm: "A", assignments: "A+", quizzes: "A", final: "A", trend: "up" },
  { subject: "Computer Science", midterm: "A+", assignments: "A+", quizzes: "A+", final: "A+", trend: "up" },
  { subject: "History", midterm: "B", assignments: "B-", quizzes: "C+", final: "B", trend: "down" },
  { subject: "Art", midterm: "A-", assignments: "A", quizzes: "A-", final: "A-", trend: "up" },
];

const ParentGrades = () => (
  <DashboardLayout role="parent">
    <div className="mb-6">
      <h1 className="font-display text-2xl font-bold text-foreground">Grades</h1>
      <p className="text-muted-foreground">Sarah's academic performance across all subjects</p>
    </div>

    <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Subject</th>
            <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Midterm</th>
            <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Assignments</th>
            <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Quizzes</th>
            <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Overall</th>
            <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Trend</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {grades.map((g, i) => (
            <tr key={i} className="hover:bg-muted/30">
              <td className="px-5 py-3 text-sm font-medium text-card-foreground">{g.subject}</td>
              <td className="px-5 py-3"><span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">{g.midterm}</span></td>
              <td className="px-5 py-3"><span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">{g.assignments}</span></td>
              <td className="px-5 py-3"><span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">{g.quizzes}</span></td>
              <td className="px-5 py-3"><span className="rounded-full bg-secondary/10 px-2.5 py-0.5 text-xs font-bold text-secondary">{g.final}</span></td>
              <td className="px-5 py-3">
                <TrendingUp size={16} className={g.trend === "up" ? "text-success" : "text-destructive rotate-180"} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </DashboardLayout>
);

export default ParentGrades;
