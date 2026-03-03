import DashboardLayout from "@/components/DashboardLayout";
import { ClipboardList, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const assignments = [
  { title: "Math Problem Set #8", subject: "Mathematics", due: "Feb 10", submitted: 28, total: 32 },
  { title: "Physics Lab Report", subject: "Physics", due: "Feb 12", submitted: 15, total: 28 },
  { title: "Essay on Hamlet", subject: "English", due: "Feb 14", submitted: 0, total: 30 },
  { title: "Binary Tree Implementation", subject: "CS", due: "Feb 9", submitted: 22, total: 25 },
];

const TeacherAssignments = () => {
  return (
    <DashboardLayout role="teacher">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Assignments</h1>
          <p className="text-muted-foreground">Create and grade assignments</p>
        </div>
        <Button className="gap-2 gradient-teacher text-primary-foreground border-0">
          <Plus size={16} /> New Assignment
        </Button>
      </div>

      <div className="space-y-4">
        {assignments.map((a, i) => (
          <div key={i} className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-card">
            <div className="rounded-lg bg-primary/10 p-3">
              <ClipboardList size={24} className="text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-card-foreground">{a.title}</h3>
              <p className="text-xs text-muted-foreground">{a.subject} · Due: {a.due}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-card-foreground">{a.submitted}/{a.total}</p>
              <p className="text-xs text-muted-foreground">submitted</p>
            </div>
            <div className="h-2 w-24 rounded-full bg-muted">
              <div className="h-2 rounded-full bg-primary" style={{ width: `${(a.submitted / a.total) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default TeacherAssignments;
