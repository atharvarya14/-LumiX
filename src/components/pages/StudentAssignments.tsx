import DashboardLayout from "@/components/DashboardLayout";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const assignments = [
  { title: "Math Problem Set #8", subject: "Mathematics", due: "Feb 10", status: "pending" },
  { title: "Physics Lab Report", subject: "Physics", due: "Feb 12", status: "pending" },
  { title: "Hamlet Essay Draft", subject: "English", due: "Feb 14", status: "not started" },
  { title: "Binary Tree Code", subject: "CS", due: "Feb 9", status: "submitted" },
  { title: "History Presentation", subject: "History", due: "Feb 11", status: "submitted" },
];

const StudentAssignments = () => (
  <DashboardLayout role="student">
    <div className="mb-6">
      <h1 className="font-display text-2xl font-bold text-foreground">Assignments</h1>
      <p className="text-muted-foreground">Track and submit your assignments</p>
    </div>
    <div className="space-y-3">
      {assignments.map((a, i) => (
        <div key={i} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-card">
          <div className="rounded-lg bg-primary/10 p-2.5">
            <FileText size={18} className="text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-card-foreground">{a.title}</p>
            <p className="text-xs text-muted-foreground">{a.subject} · Due: {a.due}</p>
          </div>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
            a.status === "submitted" ? "bg-success/10 text-success" :
            a.status === "pending" ? "bg-warning/10 text-warning" :
            "bg-muted text-muted-foreground"
          }`}>{a.status}</span>
          {a.status !== "submitted" && (
            <Button size="sm" className="gradient-student text-secondary-foreground border-0">Submit</Button>
          )}
        </div>
      ))}
    </div>
  </DashboardLayout>
);

export default StudentAssignments;
