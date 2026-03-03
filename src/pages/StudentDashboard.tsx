import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import AttentionMonitor from "@/components/AttentionMonitor";
import Timetable from "@/components/Timetable";
import { BookOpen, FileText, BarChart3, Clock, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const resources = [
  { title: "Quadratic Equations Notes", subject: "Mathematics", type: "PDF", date: "Today" },
  { title: "Newton's Laws Lab Sheet", subject: "Physics", type: "DOC", date: "Yesterday" },
  { title: "Shakespeare Analysis Guide", subject: "English", type: "PDF", date: "Feb 6" },
  { title: "Python Basics Tutorial", subject: "Computer Science", type: "Video", date: "Feb 5" },
];

const assignments = [
  { title: "Math Problem Set #8", due: "Tomorrow", status: "pending" },
  { title: "Physics Lab Report", due: "Feb 12", status: "pending" },
  { title: "Essay Draft", due: "Feb 10", status: "submitted" },
];

const StudentDashboard = () => {
  return (
    <DashboardLayout role="student">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Hey, Student! 👋</h1>
          <p className="text-muted-foreground">Stay focused and keep learning. Your webcam is monitoring attention.</p>
        </div>
        <Link to="/student/classes">
          <Button className="gap-2 gradient-student text-secondary-foreground border-0">
            <Video size={16} /> Join Live Class
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Avg Focus Score" value="82%" change="3% better" positive icon={<BarChart3 size={20} className="text-secondary" />} gradient="gradient-student" />
        <StatCard label="Resources Available" value="47" icon={<BookOpen size={20} className="text-primary" />} />
        <StatCard label="Pending Tasks" value="3" icon={<FileText size={20} className="text-warning" />} />
        <StatCard label="Study Hours Today" value="4.2h" change="On track" positive icon={<Clock size={20} className="text-success" />} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Timetable />

          {/* Resources */}
          <div className="rounded-xl border border-border bg-card shadow-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h3 className="font-display font-semibold text-card-foreground">Latest Resources</h3>
              <Link to="/student/resources" className="text-xs font-medium text-primary hover:underline">View All</Link>
            </div>
            <div className="divide-y divide-border">
              {resources.map((res, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3 hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <BookOpen size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-card-foreground">{res.title}</p>
                      <p className="text-xs text-muted-foreground">{res.subject} · {res.date}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">{res.type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <AttentionMonitor />

          {/* Assignments */}
          <div className="rounded-xl border border-border bg-card shadow-card">
            <div className="flex items-center gap-2 border-b border-border px-5 py-4">
              <FileText size={18} className="text-warning" />
              <h3 className="font-display font-semibold text-card-foreground">Assignments</h3>
            </div>
            <div className="divide-y divide-border">
              {assignments.map((a, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium text-card-foreground">{a.title}</p>
                    <p className="text-xs text-muted-foreground">Due: {a.due}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    a.status === "submitted" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                  }`}>
                    {a.status === "submitted" ? "Submitted" : "Pending"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
