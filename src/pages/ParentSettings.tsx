import DashboardLayout from "@/components/DashboardLayout";
import { Settings, Bell, Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const ParentSettings = () => (
  <DashboardLayout role="parent">
    <div className="mb-6">
      <h1 className="font-display text-2xl font-bold text-foreground">Settings</h1>
      <p className="text-muted-foreground">Manage your notification and account preferences</p>
    </div>

    <div className="space-y-6 max-w-2xl">
      <div className="rounded-xl border border-border bg-card p-5 shadow-card">
        <div className="flex items-center gap-3 mb-4">
          <Bell size={20} className="text-primary" />
          <h3 className="font-display font-semibold text-card-foreground">Notifications</h3>
        </div>
        <div className="space-y-4">
          {[
            { label: "Low attention alerts", desc: "Get notified when focus drops below 50%" },
            { label: "Daily summary email", desc: "Receive daily focus and grade reports" },
            { label: "Assignment reminders", desc: "Notifications for upcoming deadlines" },
            { label: "Teacher messages", desc: "Instant alerts for new messages" },
          ].map((s, i) => (
            <div key={i} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-card-foreground">{s.label}</p>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
              </div>
              <Switch defaultChecked />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-card">
        <div className="flex items-center gap-3 mb-4">
          <User size={20} className="text-primary" />
          <h3 className="font-display font-semibold text-card-foreground">Account</h3>
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground">Email</p>
            <p className="text-sm text-card-foreground">parent@school.edu</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Child</p>
            <p className="text-sm text-card-foreground">Sarah Johnson — Grade 10, Section A</p>
          </div>
        </div>
        <Button variant="outline" className="mt-4">Update Profile</Button>
      </div>
    </div>
  </DashboardLayout>
);

export default ParentSettings;
