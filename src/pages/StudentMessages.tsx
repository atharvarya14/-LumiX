import DashboardLayout from "@/components/DashboardLayout";
import { MessageSquare, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const messages = [
  { from: "Mr. Johnson", role: "Teacher", message: "Don't forget to submit Problem Set #8 by tomorrow.", time: "2h ago" },
  { from: "System", role: "Alert", message: "Your attention score dropped below 70% in History class.", time: "4h ago" },
  { from: "Ms. Davis", role: "Teacher", message: "Great essay draft, Sarah! Minor revisions needed.", time: "1d ago" },
];

const StudentMessages = () => (
  <DashboardLayout role="student">
    <div className="mb-6">
      <h1 className="font-display text-2xl font-bold text-foreground">Messages</h1>
      <p className="text-muted-foreground">Communication from teachers and system alerts</p>
    </div>

    <div className="space-y-3 mb-6">
      {messages.map((m, i) => (
        <div key={i} className="rounded-xl border border-border bg-card p-4 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                {m.from.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-card-foreground">{m.from}</p>
                <p className="text-xs text-muted-foreground">{m.role}</p>
              </div>
            </div>
            <span className="text-xs text-muted-foreground">{m.time}</span>
          </div>
          <p className="text-sm text-muted-foreground">{m.message}</p>
        </div>
      ))}
    </div>

    <div className="flex gap-2">
      <Input placeholder="Type a message..." className="flex-1" />
      <Button className="gap-2 gradient-student text-secondary-foreground border-0">
        <Send size={16} /> Send
      </Button>
    </div>
  </DashboardLayout>
);

export default StudentMessages;
