import DashboardLayout from "@/components/DashboardLayout";
import { MessageSquare, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const messages = [
  { from: "Mr. Johnson", role: "Math Teacher", message: "Sarah is doing well in mathematics. Keep encouraging her!", time: "3h ago" },
  { from: "Mrs. Wilson", role: "History Teacher", message: "Sarah's attention in History has been low. Please discuss this at home.", time: "1d ago" },
  { from: "System", role: "Alert", message: "Sarah's weekly focus report is ready. Average: 79%.", time: "2d ago" },
];

const ParentMessages = () => (
  <DashboardLayout role="parent">
    <div className="mb-6">
      <h1 className="font-display text-2xl font-bold text-foreground">Messages</h1>
      <p className="text-muted-foreground">Communication with teachers and school</p>
    </div>

    <div className="space-y-3 mb-6">
      {messages.map((m, i) => (
        <div key={i} className="rounded-xl border border-border bg-card p-4 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-parent/10 flex items-center justify-center text-xs font-bold text-parent">
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
      <Input placeholder="Message a teacher..." className="flex-1" />
      <Button className="gap-2 gradient-parent text-parent-foreground border-0">
        <Send size={16} /> Send
      </Button>
    </div>
  </DashboardLayout>
);

export default ParentMessages;
