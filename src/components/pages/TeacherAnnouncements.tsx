import DashboardLayout from "@/components/DashboardLayout";
import { Bell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useSendMessage } from "@/hooks/api/useMessages";
import { useGetClasses } from "@/hooks/api/useClasses";

const TeacherAnnouncements = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    priority: "medium",
  });

  const sendMutation = useSendMessage();
  const { data: classes = [] } = useGetClasses();

  const [announcements, setAnnouncements] = useState([
    { title: "Mid-term exam schedule released", content: "Please check the timetable section for updated exam dates.", date: "Feb 8, 2026", priority: "high" },
    { title: "Science fair registration open", content: "Register your projects by Feb 15. Maximum 3 members per team.", date: "Feb 7, 2026", priority: "medium" },
    { title: "Library hours extended", content: "The library will be open until 8 PM during exam season.", date: "Feb 6, 2026", priority: "low" },
    { title: "Parent-teacher meeting", content: "Scheduled for Feb 20. Parents can book slots through the portal.", date: "Feb 5, 2026", priority: "high" },
  ]);

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
      });
      return;
    }

    try {
      // Get all class IDs to broadcast announcement to all students
      const classIds = classes.map((cls) => cls._id);

      await sendMutation.mutateAsync({
        recipients: classIds,
        subject: formData.title,
        body: formData.content,
        isAnnouncement: true,
        classId: classIds[0],
      });

      // Add to local state for immediate display
      const newAnnouncement = {
        title: formData.title,
        content: formData.content,
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        priority: formData.priority,
      };
      setAnnouncements([newAnnouncement, ...announcements]);

      toast({
        title: "Success",
        description: "Announcement posted successfully!",
      });
      setIsCreateOpen(false);
      setFormData({ title: "", content: "", priority: "medium" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to post announcement.",
      });
    }
  };

  return (
    <DashboardLayout role="teacher">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Announcements</h1>
          <p className="text-muted-foreground">Post updates for students and parents</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 gradient-teacher text-primary-foreground border-0">
              <Plus size={16} /> New Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Post New Announcement</DialogTitle>
              <DialogDescription>
                Send an announcement to all students and parents
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateAnnouncement} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Announcement title..."
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) =>
                    setFormData({ ...formData, priority: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  placeholder="Write your announcement here..."
                  rows={6}
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  required
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                  disabled={sendMutation.isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={sendMutation.isPending}>
                  {sendMutation.isPending ? "Posting..." : "Post Announcement"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {announcements.map((a, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 rounded-lg p-2 ${
                  a.priority === "high" ? "bg-destructive/10" : a.priority === "medium" ? "bg-warning/10" : "bg-muted"
                }`}>
                  <Bell size={18} className={
                    a.priority === "high" ? "text-destructive" : a.priority === "medium" ? "text-warning" : "text-muted-foreground"
                  } />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-card-foreground">{a.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{a.content}</p>
                </div>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">{a.date}</span>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default TeacherAnnouncements;
