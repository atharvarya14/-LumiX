import DashboardLayout from "@/components/DashboardLayout";
import { Bell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const announcements = [
  { title: "Mid-term exam schedule released", content: "Please check the timetable section for updated exam dates.", date: "Feb 8, 2026", priority: "high" },
  { title: "Science fair registration open", content: "Register your projects by Feb 15. Maximum 3 members per team.", date: "Feb 7, 2026", priority: "medium" },
  { title: "Library hours extended", content: "The library will be open until 8 PM during exam season.", date: "Feb 6, 2026", priority: "low" },
  { title: "Parent-teacher meeting", content: "Scheduled for Feb 20. Parents can book slots through the portal.", date: "Feb 5, 2026", priority: "high" },
];

const TeacherAnnouncements = () => {
  return (
    <DashboardLayout role="teacher">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Announcements</h1>
          <p className="text-muted-foreground">Post updates for students and parents</p>
        </div>
        <Button className="gap-2 gradient-teacher text-primary-foreground border-0">
          <Plus size={16} /> New Announcement
        </Button>
      </div>

      <div className="space-y-4">
        {announcements.map((a, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 rounded-lg p-2 ${
                  a.priority === "high" ? "bg-destructive/10" : a.priority === "medium" ? "bg-warning/10" : "bg-muted"
                }`}>
                  <Bell size={18} className={
                    a.priority === "high" ? "text-destructive" : a.priority === "medium" ? "text-warning" : "text-muted-foreground"
                  } />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-card-foreground">{a.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{a.content}</p>
                </div>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">{a.date}</span>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default TeacherAnnouncements;
