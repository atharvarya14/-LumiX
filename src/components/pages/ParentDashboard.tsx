import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import Timetable from "@/components/Timetable";
import { Eye, GraduationCap, BarChart3, Clock, TrendingUp, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

const weeklyFocus = [
  { day: "Mon", score: 85 },
  { day: "Tue", score: 72 },
  { day: "Wed", score: 90 },
  { day: "Thu", score: 68 },
  { day: "Fri", score: 78 },
];

const subjects = [
  { name: "Mathematics", grade: "A-", attention: 88, trend: "up" },
  { name: "Physics", grade: "B+", attention: 75, trend: "down" },
  { name: "English", grade: "A", attention: 92, trend: "up" },
  { name: "Computer Science", grade: "A+", attention: 95, trend: "up" },
  { name: "History", grade: "B", attention: 65, trend: "down" },
];

const ParentDashboard = () => {
  return (
    <DashboardLayout role="parent">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Your Child's Progress</h1>
        <p className="text-muted-foreground">Sarah Johnson — Grade 10 · Section A</p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Overall Focus" value="79%" change="4% from last week" positive icon={<Eye size={20} className="text-parent" />} gradient="gradient-parent" />
        <StatCard label="GPA" value="3.7" change="0.2 improvement" positive icon={<GraduationCap size={20} className="text-primary" />} />
        <StatCard label="Attendance" value="96%" icon={<Clock size={20} className="text-success" />} />
        <StatCard label="Rank" value="#8" change="of 42 students" icon={<TrendingUp size={20} className="text-secondary" />} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Weekly Focus Chart */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display font-semibold text-card-foreground">Weekly Focus Report</h3>
              <Link to="/parent/attention" className="text-xs font-medium text-primary hover:underline">Detailed Report</Link>
            </div>
            <div className="flex items-end gap-3 h-40">
              {weeklyFocus.map((d) => (
                <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-xs font-medium text-muted-foreground">{d.score}%</span>
                  <div className="w-full rounded-t-md gradient-parent" style={{ height: `${d.score}%` }} />
                  <span className="text-xs text-muted-foreground">{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Subjects */}
          <div className="rounded-xl border border-border bg-card shadow-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h3 className="font-display font-semibold text-card-foreground">Subject Performance</h3>
              <Link to="/parent/grades" className="text-xs font-medium text-primary hover:underline">All Grades</Link>
            </div>
            <div className="divide-y divide-border">
              {subjects.map((s, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-card-foreground">{s.name}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">{s.grade}</span>
                    <div className="flex items-center gap-1 w-20">
                      <div className="h-1.5 flex-1 rounded-full bg-muted">
                        <div
                          className={`h-1.5 rounded-full ${s.attention >= 80 ? "bg-success" : s.attention >= 60 ? "bg-warning" : "bg-destructive"}`}
                          style={{ width: `${s.attention}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{s.attention}%</span>
                    </div>
                    {s.trend === "up" ? (
                      <TrendingUp size={14} className="text-success" />
                    ) : (
                      <TrendingUp size={14} className="text-destructive rotate-180" />
                    )}
                  </div>
                </div>
              ))}
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
              <h3 className="font-display font-semibold text-card-foreground">Attention Needed</h3>
            </div>
            <div className="space-y-3 p-5">
              <div className="rounded-lg bg-destructive/10 p-3">
                <p className="text-sm font-medium text-destructive">Low focus in History (65%)</p>
                <p className="text-xs text-muted-foreground mt-1">Average dropped by 12% this week</p>
              </div>
              <div className="rounded-lg bg-warning/10 p-3">
                <p className="text-sm font-medium text-warning">Physics attention declining</p>
                <p className="text-xs text-muted-foreground mt-1">Down from 82% to 75% over 2 weeks</p>
              </div>
              <div className="rounded-lg bg-success/10 p-3">
                <p className="text-sm font-medium text-success">Great focus in Computer Science!</p>
                <p className="text-xs text-muted-foreground mt-1">Consistently above 90% all month</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ParentDashboard;
