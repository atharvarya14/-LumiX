import DashboardLayout from "@/components/DashboardLayout";
import { BookOpen, Download, FileText, Video as VideoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const resources = [
  { title: "Quadratic Equations - Full Notes", subject: "Mathematics", type: "PDF", size: "2.4 MB", date: "Feb 8" },
  { title: "Newton's Laws Lab Instructions", subject: "Physics", type: "DOC", size: "1.1 MB", date: "Feb 7" },
  { title: "Hamlet Act III Video Lecture", subject: "English", type: "Video", size: "245 MB", date: "Feb 6" },
  { title: "Binary Trees Cheat Sheet", subject: "CS", type: "PDF", size: "890 KB", date: "Feb 5" },
  { title: "WWII Timeline Infographic", subject: "History", type: "Image", size: "3.2 MB", date: "Feb 4" },
  { title: "Watercolor Workshop Recording", subject: "Art", type: "Video", size: "512 MB", date: "Feb 3" },
];

const getIcon = (type: string) => {
  if (type === "Video") return <VideoIcon size={18} className="text-secondary" />;
  return <FileText size={18} className="text-primary" />;
};

const StudentResources = () => {
  return (
    <DashboardLayout role="student">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Resources</h1>
        <p className="text-muted-foreground">Study materials shared by your teachers</p>
      </div>

      <div className="space-y-3">
        {resources.map((r, i) => (
          <div key={i} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-card hover:bg-muted/30 transition-colors">
            <div className="rounded-lg bg-primary/10 p-2.5">{getIcon(r.type)}</div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-card-foreground">{r.title}</p>
              <p className="text-xs text-muted-foreground">{r.subject} · {r.size} · {r.date}</p>
            </div>
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">{r.type}</span>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download size={14} /> Download
            </Button>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default StudentResources;
