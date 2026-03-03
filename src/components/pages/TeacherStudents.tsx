import DashboardLayout from "@/components/DashboardLayout";
import { Users, Search, Mail, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const students = [
  { name: "Alex Johnson", email: "alex@school.edu", grade: "A", focus: 92, attendance: "98%" },
  { name: "Sarah Chen", email: "sarah@school.edu", grade: "B+", focus: 78, attendance: "92%" },
  { name: "Mike Brown", email: "mike@school.edu", grade: "C+", focus: 45, attendance: "85%" },
  { name: "Emma Wilson", email: "emma@school.edu", grade: "A-", focus: 88, attendance: "96%" },
  { name: "David Lee", email: "david@school.edu", grade: "A", focus: 95, attendance: "100%" },
  { name: "Lisa Wang", email: "lisa@school.edu", grade: "B", focus: 72, attendance: "90%" },
];

const TeacherStudents = () => {
  return (
    <DashboardLayout role="teacher">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Students</h1>
          <p className="text-muted-foreground">Manage and monitor your students</p>
        </div>
      </div>

      <div className="mb-6 relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search students..." className="pl-9 max-w-sm" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {students.map((s, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-display font-bold text-primary">
                {s.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-card-foreground">{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="rounded-lg bg-muted p-2 text-center">
                <p className="text-xs text-muted-foreground">Grade</p>
                <p className="text-sm font-bold text-card-foreground">{s.grade}</p>
              </div>
              <div className="rounded-lg bg-muted p-2 text-center">
                <p className="text-xs text-muted-foreground">Focus</p>
                <p className={`text-sm font-bold ${s.focus >= 75 ? "text-success" : s.focus >= 50 ? "text-warning" : "text-destructive"}`}>{s.focus}%</p>
              </div>
              <div className="rounded-lg bg-muted p-2 text-center">
                <p className="text-xs text-muted-foreground">Attend.</p>
                <p className="text-sm font-bold text-card-foreground">{s.attendance}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 gap-1 text-xs"><Eye size={12} /> View</Button>
              <Button variant="outline" size="sm" className="flex-1 gap-1 text-xs"><Mail size={12} /> Contact</Button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default TeacherStudents;
