import { useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import AttentionMonitor from "@/components/AttentionMonitor";
import Timetable from "@/components/Timetable";
import { BookOpen, FileText, BarChart3, Clock, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useGetClasses } from "@/hooks/api/useClasses";
import { useGetLessonPlans } from "@/hooks/api/useLessonPlans";
import { useGetAssignments } from "@/hooks/api/useAssignments";

const StudentDashboard = () => {
  const { user } = useAuth();
  const { data: classes = [], isLoading: classesLoading } = useGetClasses();
  const { data: lessonPlans = [], isLoading: lessonsLoading } = useGetLessonPlans({
    status: "published",
  });
  const { data: assignments = [], isLoading: assignmentsLoading } =
    useGetAssignments();

  // Get resources (published lesson plans)
  const resources = useMemo(() => {
    return lessonPlans.slice(0, 4).map((plan) => ({
      _id: plan._id,
      title: plan.title,
      subject: plan.subject,
      type: plan.resources ? "PDF" : "Note",
      date: plan.scheduledDate
        ? new Date(plan.scheduledDate).toLocaleDateString()
        : "Recently",
    }));
  }, [lessonPlans]);

  // Get pending assignments
  const pendingAssignments = useMemo(() => {
    return assignments.slice(0, 3).map((assign) => ({
      _id: assign._id,
      title: assign.title,
      due: new Date(assign.dueDate).toLocaleDateString(),
      status: assign.submissions?.some((s) => s.student === user?._id)
        ? "submitted"
        : "pending",
    }));
  }, [assignments, user?._id]);

  return (
    <DashboardLayout role="student">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Hey, {user?.firstName}! 👋
          </h1>
          <p className="text-muted-foreground">
            Stay focused and keep learning. Your webcam is monitoring attention.
          </p>
        </div>
        <Link to="/student/classes">
          <Button className="gap-2 gradient-student text-secondary-foreground border-0">
            <Video size={16} /> Join Live Class
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Avg Focus Score"
          value="82%"
          change="3% better"
          positive
          icon={<BarChart3 size={20} className="text-secondary" />}
          gradient="gradient-student"
        />
        <StatCard
          label="Resources Available"
          value={lessonPlans.length.toString()}
          icon={<BookOpen size={20} className="text-primary" />}
        />
        <StatCard
          label="Pending Tasks"
          value={assignments.filter((a) => !a.submissions?.some((s) => s.student === user?._id)).length.toString()}
          icon={<FileText size={20} className="text-warning" />}
        />
        <StatCard
          label="Study Hours Today"
          value="4.2h"
          change="On track"
          positive
          icon={<Clock size={20} className="text-success" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Timetable />

          {/* Resources */}
          <div className="rounded-xl border border-border bg-card shadow-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h3 className="font-display font-semibold text-card-foreground">
                Latest Resources
              </h3>
              <Link
                to="/student/resources"
                className="text-xs font-medium text-primary hover:underline"
              >
                View All
              </Link>
            </div>
            <div className="divide-y divide-border">
              {lessonsLoading ? (
                <div className="px-5 py-8 text-center text-muted-foreground">
                  Loading resources...
                </div>
              ) : resources.length > 0 ? (
                resources.map((res) => (
                  <div
                    key={res._id}
                    className="flex items-center justify-between px-5 py-3 hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <BookOpen size={16} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-card-foreground">
                          {res.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {res.subject} · {res.date}
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                      {res.type}
                    </span>
                  </div>
                ))
              ) : (
                <div className="px-5 py-8 text-center text-muted-foreground">
                  No resources available yet.
                </div>
              )}
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
              <h3 className="font-display font-semibold text-card-foreground">
                Assignments
              </h3>
            </div>
            <div className="divide-y divide-border">
              {assignmentsLoading ? (
                <div className="px-5 py-8 text-center text-muted-foreground">
                  Loading assignments...
                </div>
              ) : pendingAssignments.length > 0 ? (
                pendingAssignments.map((a) => (
                  <div
                    key={a._id}
                    className="flex items-center justify-between px-5 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-card-foreground">
                        {a.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Due: {a.due}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        a.status === "submitted"
                          ? "bg-success/10 text-success"
                          : "bg-warning/10 text-warning"
                      }`}
                    >
                      {a.status === "submitted" ? "Submitted" : "Pending"}
                    </span>
                  </div>
                ))
              ) : (
                <div className="px-5 py-8 text-center text-muted-foreground">
                  No assignments yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
