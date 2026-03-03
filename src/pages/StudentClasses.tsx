import DashboardLayout from "@/components/DashboardLayout";
import { Video, BookOpen } from "lucide-react";
import AttentionMonitor from "@/components/AttentionMonitor";

const StudentClasses = () => {
  return (
    <DashboardLayout role="student">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">My Classes</h1>
        <p className="text-muted-foreground">Join live sessions and review past classes</p>
      </div>

      {/* Live class */}
      <div className="mb-6 rounded-xl border-2 border-success bg-success/5 p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="h-2.5 w-2.5 rounded-full bg-success animate-pulse" />
          <span className="text-sm font-semibold text-success">Live Now</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-card-foreground">Physics — Newton's Laws</h3>
            <p className="text-sm text-muted-foreground">Dr. Smith · Room Lab 3</p>
          </div>
          <div className="flex items-center gap-4">
            <AttentionMonitor compact />
            <button className="rounded-lg gradient-student px-4 py-2 text-sm font-medium text-secondary-foreground">
              Join Class
            </button>
          </div>
        </div>
      </div>

      {/* Past classes */}
      <h3 className="mb-3 font-display font-semibold text-foreground">Recent Classes</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { title: "Quadratic Equations", teacher: "Mr. Johnson", date: "Feb 7", duration: "45 min", focus: 85 },
          { title: "Shakespeare Sonnets", teacher: "Ms. Davis", date: "Feb 7", duration: "40 min", focus: 91 },
          { title: "Binary Trees", teacher: "Mr. Lee", date: "Feb 6", duration: "50 min", focus: 78 },
          { title: "WWII Eastern Front", teacher: "Mrs. Wilson", date: "Feb 6", duration: "45 min", focus: 62 },
        ].map((c, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-4 shadow-card hover:shadow-elevated transition-shadow cursor-pointer">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-secondary/10 p-2">
                <BookOpen size={18} className="text-secondary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-card-foreground">{c.title}</p>
                <p className="text-xs text-muted-foreground">{c.teacher} · {c.date} · {c.duration}</p>
              </div>
              <span className={`text-xs font-bold ${c.focus >= 75 ? "text-success" : c.focus >= 50 ? "text-warning" : "text-destructive"}`}>
                {c.focus}% focus
              </span>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default StudentClasses;
