import DashboardLayout from "@/components/DashboardLayout";
import { Video, Mic, MicOff, MonitorUp, Users, MessageSquare, Hand } from "lucide-react";
import { Button } from "@/components/ui/button";
import AttentionMonitor from "@/components/AttentionMonitor";
import { useState } from "react";

const participants = [
  { name: "Alex Johnson", attention: 92 },
  { name: "Sarah Chen", attention: 78 },
  { name: "Mike Brown", attention: 45 },
  { name: "Emma Wilson", attention: 88 },
  { name: "David Lee", attention: 95 },
  { name: "Lisa Wang", attention: 62 },
];

const TeacherLive = () => {
  const [isMuted, setIsMuted] = useState(false);

  return (
    <DashboardLayout role="teacher">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Live Class</h1>
        <p className="text-muted-foreground">Physics — Newton's Laws of Motion</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {/* Video area */}
          <div className="relative aspect-video rounded-xl bg-foreground/5 border border-border overflow-hidden flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Video size={48} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">Live class stream</p>
            </div>
            <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-destructive px-3 py-1 text-xs font-medium text-destructive-foreground">
              <span className="h-2 w-2 rounded-full bg-destructive-foreground animate-pulse" />
              LIVE
            </div>
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <div className="flex items-center gap-2 rounded-lg bg-foreground/80 px-3 py-1.5 text-xs text-background">
                <Users size={14} /> {participants.length} students
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => setIsMuted(!isMuted)} className="gap-1.5">
                  {isMuted ? <MicOff size={14} /> : <Mic size={14} />}
                </Button>
                <Button size="sm" variant="secondary" className="gap-1.5">
                  <MonitorUp size={14} /> Share Screen
                </Button>
                <Button size="sm" variant="destructive">
                  End Class
                </Button>
              </div>
            </div>
          </div>

          {/* Chat */}
          <div className="rounded-xl border border-border bg-card shadow-card">
            <div className="flex items-center gap-2 border-b border-border px-5 py-3">
              <MessageSquare size={16} className="text-primary" />
              <h3 className="text-sm font-semibold text-card-foreground">Class Chat</h3>
            </div>
            <div className="h-32 p-4 text-sm text-muted-foreground flex items-center justify-center">
              <p>Chat messages will appear here during live class...</p>
            </div>
          </div>
        </div>

        {/* Right - Participants + Attention */}
        <div className="space-y-4">
          <AttentionMonitor />

          <div className="rounded-xl border border-border bg-card shadow-card">
            <div className="flex items-center gap-2 border-b border-border px-5 py-3">
              <Users size={16} className="text-primary" />
              <h3 className="text-sm font-semibold text-card-foreground">Student Attention</h3>
            </div>
            <div className="divide-y divide-border">
              {participants.map((p, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-2.5">
                  <span className="text-sm text-card-foreground">{p.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 rounded-full bg-muted">
                      <div
                        className={`h-1.5 rounded-full ${p.attention >= 75 ? "bg-success" : p.attention >= 50 ? "bg-warning" : "bg-destructive"}`}
                        style={{ width: `${p.attention}%` }}
                      />
                    </div>
                    <span className={`text-xs font-medium ${p.attention >= 75 ? "text-success" : p.attention >= 50 ? "text-warning" : "text-destructive"}`}>
                      {p.attention}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card shadow-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Hand size={16} className="text-warning" />
              <h3 className="text-sm font-semibold text-card-foreground">Raised Hands</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-lg bg-warning/10 px-3 py-2">
                <span className="text-sm text-card-foreground">Sarah Chen</span>
                <Button size="sm" variant="outline" className="h-7 text-xs">Acknowledge</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherLive;
