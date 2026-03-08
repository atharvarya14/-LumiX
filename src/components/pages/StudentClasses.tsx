import DashboardLayout from "@/components/DashboardLayout";
import { Video, BookOpen, Users } from "lucide-react";
import AttentionMonitor from "@/components/AttentionMonitor";
import { useAuth } from "@/context/AuthContext";
import { useGetClasses } from "@/hooks/api/useClasses";
import { useMemo } from "react";

const StudentClasses = () => {
  const { user } = useAuth();
  const { data: allClasses = [], isLoading } = useGetClasses();

  // Get classes where current student is enrolled
  const enrolledClasses = useMemo(() => {
    return allClasses.filter((cls) => {
      const studentIds = (cls.students || []).map((s) =>
        typeof s === "string" ? s : s._id
      );
      return studentIds.includes(user?._id || "");
    });
  }, [allClasses, user?._id]);

  return (
    <DashboardLayout role="student">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">
          My Classes
        </h1>
        <p className="text-muted-foreground">
          Join live sessions and review past classes
        </p>
      </div>

      {/* Live class placeholder */}
      {enrolledClasses.length > 0 && enrolledClasses[0]?.liveSession?.isLive && (
        <div className="mb-6 rounded-xl border-2 border-success bg-success/5 p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-2.5 w-2.5 rounded-full bg-success animate-pulse" />
            <span className="text-sm font-semibold text-success">Live Now</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-bold text-card-foreground">
                {enrolledClasses[0]?.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {typeof enrolledClasses[0]?.teacher === "string"
                  ? "Teacher"
                  : enrolledClasses[0]?.teacher?.firstName}{" "}
                · {enrolledClasses[0]?.subject}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <AttentionMonitor compact />
              <button className="rounded-lg gradient-student px-4 py-2 text-sm font-medium text-secondary-foreground">
                Join Class
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enrolled classes */}
      <h3 className="mb-3 font-display font-semibold text-foreground">
        Enrolled Classes
      </h3>
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          <BookOpen size={32} className="mx-auto mb-2 opacity-30" />
          <p>Loading classes...</p>
        </div>
      ) : enrolledClasses.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {enrolledClasses.map((cls) => (
            <div
              key={cls._id}
              className="rounded-xl border border-border bg-card p-4 shadow-card hover:shadow-elevated transition-shadow cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-secondary/10 p-2">
                  <BookOpen size={18} className="text-secondary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-card-foreground">
                    {cls.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {typeof cls.teacher === "string"
                      ? "Teacher"
                      : cls.teacher?.firstName}{" "}
                    · {cls.subject}
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <Users size={12} />
                    {cls.students?.length || 0} students
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground rounded-xl border border-border bg-card p-8">
          <BookOpen size={32} className="mx-auto mb-2 opacity-30" />
          <p>No classes enrolled yet</p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default StudentClasses;
