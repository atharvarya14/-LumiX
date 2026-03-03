import DashboardLayout from "@/components/DashboardLayout";
import { BookOpen, Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const lessons = [
  { id: 1, title: "Introduction to Quadratic Equations", subject: "Mathematics", date: "Feb 8, 2026", students: 32, status: "published" },
  { id: 2, title: "Newton's Third Law - Action & Reaction", subject: "Physics", date: "Feb 7, 2026", students: 28, status: "published" },
  { id: 3, title: "Shakespeare's Hamlet - Act III Analysis", subject: "English", date: "Feb 6, 2026", students: 30, status: "published" },
  { id: 4, title: "Data Structures: Binary Trees", subject: "Computer Science", date: "Feb 5, 2026", students: 25, status: "draft" },
  { id: 5, title: "World War II - Eastern Front", subject: "History", date: "Feb 4, 2026", students: 0, status: "draft" },
  { id: 6, title: "Watercolor Techniques", subject: "Art", date: "Feb 3, 2026", students: 22, status: "published" },
];

const TeacherLessons = () => {
  return (
    <DashboardLayout role="teacher">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Lessons</h1>
          <p className="text-muted-foreground">Create and manage your lesson content</p>
        </div>
        <Button className="gap-2 gradient-teacher text-primary-foreground border-0">
          <Plus size={16} /> Create Lesson
        </Button>
      </div>

      <div className="mb-6 flex gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search lessons..." className="pl-9" />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter size={16} /> Filter
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {lessons.map((lesson) => (
          <div key={lesson.id} className="rounded-xl border border-border bg-card p-5 shadow-card hover:shadow-elevated transition-shadow cursor-pointer">
            <div className="flex items-start justify-between">
              <div className="rounded-lg bg-primary/10 p-2">
                <BookOpen size={20} className="text-primary" />
              </div>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                lesson.status === "published" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
              }`}>
                {lesson.status}
              </span>
            </div>
            <h3 className="mt-3 text-sm font-semibold text-card-foreground">{lesson.title}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{lesson.subject}</p>
            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <span>{lesson.date}</span>
              {lesson.students > 0 && <span>{lesson.students} students</span>}
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default TeacherLessons;
