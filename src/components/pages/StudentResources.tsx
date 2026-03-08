import DashboardLayout from "@/components/DashboardLayout";
import { BookOpen, Download, FileText, Video as VideoIcon, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetLessonPlans } from "@/hooks/api/useLessonPlans";

const getIcon = (hasResources: boolean) => {
  return <FileText size={18} className="text-primary" />;
};

const StudentResources = () => {
  const { data: lessonPlans = [], isLoading } = useGetLessonPlans({
    status: "published",
  });

  return (
    <DashboardLayout role="student">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">
          Resources
        </h1>
        <p className="text-muted-foreground">
          Study materials shared by your teachers
        </p>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            <BookOpen size={32} className="mx-auto mb-2 opacity-30" />
            <p>Loading resources...</p>
          </div>
        ) : lessonPlans.length > 0 ? (
          lessonPlans.map((lesson) => (
            <div
              key={lesson._id}
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-card hover:bg-muted/30 transition-colors"
            >
              <div className="rounded-lg bg-primary/10 p-2.5">
                {getIcon(!!lesson.resources)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-card-foreground">
                  {lesson.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {lesson.subject} · {lesson.duration ? `${lesson.duration} min` : "Duration not set"} ·{" "}
                  {lesson.scheduledDate
                    ? new Date(lesson.scheduledDate).toLocaleDateString()
                    : "Not scheduled"}
                </p>
                {lesson.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                    {lesson.description}
                  </p>
                )}
              </div>
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                Content
              </span>
              {lesson.resources && lesson.resources.length > 0 ? (
                <a
                  href={lesson.resources[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <LinkIcon size={14} /> View
                  </Button>
                </a>
              ) : (
                <Button variant="outline" size="sm" className="gap-1.5" disabled>
                  <Download size={14} /> No Resources
                </Button>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground rounded-xl border border-border bg-card p-8">
            <BookOpen size={32} className="mx-auto mb-2 opacity-30" />
            <p>No resources available yet</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentResources;
