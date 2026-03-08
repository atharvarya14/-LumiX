import DashboardLayout from "@/components/DashboardLayout";
import { MessageSquare, Bell } from "lucide-react";
import { useGetInbox } from "@/hooks/api/useMessages";
import { useMemo } from "react";

const TeacherMessages = () => {
  const { data: inboxMessages = [], isLoading } = useGetInbox();

  // Separate announcements from regular messages
  const { announcements, regularMessages } = useMemo(() => {
    return {
      announcements: inboxMessages.filter((m: any) => m.isAnnouncement),
      regularMessages: inboxMessages.filter((m: any) => !m.isAnnouncement),
    };
  }, [inboxMessages]);

  const displayMessages = [...announcements, ...regularMessages];

  return (
    <DashboardLayout role="teacher">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Messages</h1>
        <p className="text-muted-foreground">Communication from students, parents, and announcements</p>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          <MessageSquare size={32} className="mx-auto mb-2 opacity-30" />
          <p>Loading messages...</p>
        </div>
      ) : displayMessages.length > 0 ? (
        <div className="space-y-3 mb-6">
          {displayMessages.map((m: any, i: number) => (
            <div
              key={i}
              className={`rounded-xl border p-4 shadow-card ${
                m.isAnnouncement
                  ? "border-warning/30 bg-warning/5"
                  : "border-border bg-card"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      m.isAnnouncement
                        ? "bg-warning/10 text-warning"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {m.isAnnouncement ? (
                      <Bell size={16} />
                    ) : (
                      m.sender?.firstName?.charAt(0) || "?"
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-card-foreground">
                      {m.isAnnouncement ? "Announcement" : m.sender?.firstName || "Unknown"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {m.sender?.role || ""}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(m.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="font-medium text-sm text-card-foreground mb-1">
                {m.subject}
              </p>
              <p className="text-sm text-muted-foreground">{m.body}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground rounded-xl border border-border bg-card p-8">
          <MessageSquare size={32} className="mx-auto mb-2 opacity-30" />
          <p>No messages yet</p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default TeacherMessages;
