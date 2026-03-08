import DashboardLayout from "@/components/DashboardLayout";
import { ClipboardList, Plus, Eye, Edit, Trash2 } from "lucide-react";
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
import { useGetAssignments, useCreateAssignment } from "@/hooks/api/useAssignments";
import { useGetClasses } from "@/hooks/api/useClasses";

const TeacherAssignments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    classId: "",
    dueDate: "",
    totalMarks: "100",
  });

  const { data: assignments = [], isLoading } = useGetAssignments();
  const { data: classes = [] } = useGetClasses();
  const createMutation = useCreateAssignment();

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.dueDate || !formData.classId || !formData.subject) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
      });
      return;
    }

    try {
      await createMutation.mutateAsync({
        title: formData.title,
        description: formData.description,
        subject: formData.subject,
        class: formData.classId,
        dueDate: formData.dueDate,
        totalMarks: parseInt(formData.totalMarks) || 100,
      });

      toast({
        title: "Success",
        description: "Assignment created successfully!",
      });
      setIsCreateOpen(false);
      setFormData({ title: "", description: "", subject: "", classId: "", dueDate: "", totalMarks: "100" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create assignment.",
      });
    }
  };

  return (
    <DashboardLayout role="teacher">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Assignments
          </h1>
          <p className="text-muted-foreground">Create and grade assignments</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 gradient-teacher text-primary-foreground border-0">
              <Plus size={16} /> New Assignment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Assignment</DialogTitle>
              <DialogDescription>
                Create a new assignment for your students
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateAssignment} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="class">Class *</Label>
                <Select
                  value={formData.classId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, classId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={classes.length === 0 ? "No classes available" : "Select a class"} />
                  </SelectTrigger>
                  <SelectContent>
                    {classes && classes.length > 0 ? (
                      classes.map((cls: any) => (
                        <SelectItem key={cls._id} value={cls._id}>
                          {cls.name}
                        </SelectItem>
                      ))
                    ) : null}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Assignment Title *</Label>
                <Input
                  id="title"
                  placeholder="Assignment title..."
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    placeholder="e.g., Mathematics"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date *</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) =>
                      setFormData({ ...formData, dueDate: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalMarks">Total Marks</Label>
                <Input
                  id="totalMarks"
                  type="number"
                  placeholder="100"
                  value={formData.totalMarks}
                  onChange={(e) =>
                    setFormData({ ...formData, totalMarks: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Assignment description and instructions..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                  disabled={createMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending
                    ? "Creating..."
                    : "Create Assignment"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            <ClipboardList size={32} className="mx-auto mb-2 opacity-30" />
            <p>Loading assignments...</p>
          </div>
        ) : assignments.length > 0 ? (
          assignments.map((assignment) => {
            const totalSubmissions = assignment.submissions?.length || 0;
            const submissionPercentage =
              assignment.submissions?.length > 0
                ? Math.round(
                    (totalSubmissions / (assignment.class ? 30 : 1)) * 100
                  )
                : 0;

            return (
              <div
                key={assignment._id}
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-card hover:shadow-elevated transition-shadow"
              >
                <div className="rounded-lg bg-primary/10 p-3">
                  <ClipboardList size={24} className="text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-card-foreground">
                    {assignment.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {assignment.subject} · Due:{" "}
                    {assignment.dueDate
                      ? new Date(assignment.dueDate).toLocaleDateString()
                      : "Not set"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-card-foreground">
                    {totalSubmissions}/{assignment.submissions?.length || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">submitted</p>
                </div>
                <div className="h-2 w-24 rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{
                      width: `${submissionPercentage}%`,
                    }}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 text-xs"
                  >
                    <Eye size={12} /> View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 text-xs"
                  >
                    <Edit size={12} /> Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 text-xs text-destructive hover:text-destructive"
                  >
                    <Trash2 size={12} />
                  </Button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 text-muted-foreground rounded-xl border border-border bg-card p-8">
            <ClipboardList size={32} className="mx-auto mb-2 opacity-30" />
            <p>No assignments yet. Create your first assignment!</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TeacherAssignments;
