import { useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import AttentionMonitor from "@/components/AttentionMonitor";
import Timetable from "@/components/Timetable";
import { Users, BookOpen, Eye, TrendingUp, Video, Bell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useGetClasses } from "@/hooks/api/useClasses";
import { useGetLessonPlans } from "@/hooks/api/useLessonPlans";
import { useGetAssignments } from "@/hooks/api/useAssignments";

const TeacherDashboard = () => {
  const { user } = useAuth();
  const { data: classes = [], isLoading: classesLoading } = useGetClasses();
  const { data: lessonPlans = [], isLoading: lessonsLoading } = useGetLessonPlans({
    status: "published",
  });
  const { data: assignments = [], isLoading: assignmentsLoading } =
    useGetAssignments();

  // Calculate stats from API data
  const stats = useMemo(() => {
    const totalStudents = classes.reduce((sum, cls) => sum + (cls.students?.length || 0), 0);
    const avgAttention = 78; // Placeholder - real implementation needs attention tracking
    let avgGrade = "B+"; // Placeholder

    return {
      totalStudents,
      activeClasses: classes.length,
      avgAttention,
      avgGrade,
    };
  }, [classes]);

  // Get recent lessons (last 3)
  const recentLessons = useMemo(() => {
    return lessonPlans.slice(0, 3).map((plan) => ({
      _id: plan._id,
      title: plan.title,
      subject: plan.subject,
      date: plan.scheduledDate
        ? new Date(plan.scheduledDate).toLocaleDateString()
        : "Scheduled",
      views: Math.floor(Math.random() * 50) + 10, // Placeholder
    }));
  }, [lessonPlans]);

  // Get student alerts (placeholder for real system)
  const studentAlerts = useMemo(() => {
    return [
      {
        name: "Student 1",
        issue: "Low attention (32%)",
        severity: "high" as const,
      },
      {
        name: "Student 2",
        issue: "Missed 2 classes",
        severity: "medium" as const,
      },
      {
        name: "Student 3",
        issue: "Assignment pending",
        severity: "low" as const,
      },
    ];
  }, []);

  return (
    <DashboardLayout role="teacher">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening in your classes today.
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/teacher/live">
            <Button className="gap-2 gradient-teacher text-primary-foreground border-0">
              <Video size={16} /> Start Live Class
            </Button>
          </Link>
          <Link to="/teacher/lessons">
            <Button variant="outline" className="gap-2">
              <Plus size={16} /> New Lesson
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Students"
          value={stats.totalStudents.toString()}
          change={`${classes.length} classes enrolled`}
          positive
          icon={<Users size={20} className="text-primary" />}
        />
        <StatCard
          label="Active Lessons"
          value={stats.activeClasses.toString()}
          change={`${lessonPlans.length} published`}
          positive
          icon={<BookOpen size={20} className="text-primary" />}
        />
        <StatCard
          label="Avg. Attention"
          value={`${stats.avgAttention}%`}
          change="5% from last week"
          positive
          icon={<Eye size={20} className="text-success" />}
          gradient="gradient-attention"
        />
        <StatCard
          label="Class Performance"
          value={stats.avgGrade}
          change="Improving"
          positive
          icon={<TrendingUp size={20} className="text-primary" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-6 lg:col-span-2">
          <Timetable />

          {/* Recent Lessons */}
          <div className="rounded-xl border border-border bg-card shadow-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h3 className="font-display font-semibold text-card-foreground">
                Recent Lessons
              </h3>
              <Link
                to="/teacher/lessons"
                className="text-xs font-medium text-primary hover:underline"
              >
                View All
              </Link>
            </div>
            <div className="divide-y divide-border">
              {lessonsLoading ? (
                <div className="px-5 py-8 text-center text-muted-foreground">
                  Loading lessons...
                </div>
              ) : recentLessons.length > 0 ? (
                recentLessons.map((lesson) => (
                  <div
                    key={lesson._id}
                    className="flex items-center justify-between px-5 py-3 hover:bg-muted/50"
                  >
                    <div>
                      <p className="text-sm font-medium text-card-foreground">
                        {lesson.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {lesson.subject} · {lesson.date}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {lesson.views} views
                    </span>
                  </div>
                ))
              ) : (
                <div className="px-5 py-8 text-center text-muted-foreground">
                  No lessons yet. Create one to get started!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <AttentionMonitor />

          {/* Alerts */}
          <div className="rounded-xl border border-border bg-card shadow-card">
            <div className="flex items-center gap-2 border-b border-border px-5 py-4">
              <Bell size={18} className="text-warning" />
              <h3 className="font-display font-semibold text-card-foreground">
                Student Alerts
              </h3>
            </div>
            <div className="divide-y divide-border">
              {studentAlerts.map((alert, i) => (
                <div key={i} className="px-5 py-3">
                  <p className="text-sm font-medium text-card-foreground">
                    {alert.name}
                  </p>
                  <p
                    className={`text-xs ${
                      alert.severity === "high"
                        ? "text-destructive"
                        : alert.severity === "medium"
                          ? "text-warning"
                          : "text-muted-foreground"
                    }`}
                  >
                    {alert.issue}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
