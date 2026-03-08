import DashboardLayout from "@/components/DashboardLayout";
import { BookOpen, Plus, Search, Filter, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { useGetLessonPlans, useCreateLessonPlan, useUpdateLessonPlan, useDeleteLessonPlan } from "@/hooks/api/useLessonPlans";
import apiClient from "@/services/api";

const TeacherLessons = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "published" | "archived">("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    grade: "",
    description: "",
    status: "draft",
  });

  const { data: lessonPlans = [], isLoading } = useGetLessonPlans();
  const createMutation = useCreateLessonPlan();
  
  // Handle edits via direct query client usage
  const queryClient = useQueryClient();

  const filteredLessons = useMemo(() => {
    return lessonPlans.filter((lesson) => {
      const matchesSearch = lesson.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || lesson.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [lessonPlans, searchTerm, statusFilter]);

  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.subject) {
      toast({
        title: "Validation Error",
        description: "Please fill in title and subject.",
      });
      return;
    }

    try {
      await createMutation.mutateAsync({
        title: formData.title,
        subject: formData.subject,
        grade: formData.grade || "General",
        description: formData.description,
        status: formData.status as "draft" | "published" | "archived",
      });

      toast({
        title: "Success",
        description: "Lesson plan created successfully!",
      });
      setIsCreateOpen(false);
      setFormData({ title: "", subject: "", grade: "", description: "", status: "draft" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create lesson plan.",
      });
    }
  };

  return (
    <DashboardLayout role="teacher">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Lessons
          </h1>
          <p className="text-muted-foreground">Create and manage your lesson content</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 gradient-teacher text-primary-foreground border-0">
              <Plus size={16} /> Create Lesson
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Lesson</DialogTitle>
              <DialogDescription>
                Add a new lesson plan for your students
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateLesson} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Lesson title..."
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
                    placeholder="Mathematics"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grade">Grade</Label>
                  <Input
                    id="grade"
                    placeholder="Grade 10"
                    value={formData.grade}
                    onChange={(e) =>
                      setFormData({ ...formData, grade: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Lesson description..."
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
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Creating..." : "Create Lesson"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6 flex gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Search lessons..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value: any) => setStatusFilter(value)}
        >
          <SelectTrigger className="max-w-xs">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <BookOpen size={32} className="mx-auto mb-2 opacity-30" />
            <p>Loading lessons...</p>
          </div>
        ) : filteredLessons.length > 0 ? (
          filteredLessons.map((lesson) => (
            <div
              key={lesson._id}
              className="rounded-xl border border-border bg-card p-5 shadow-card hover:shadow-elevated transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="rounded-lg bg-primary/10 p-2">
                  <BookOpen size={20} className="text-primary" />
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    lesson.status === "published"
                      ? "bg-success/10 text-success"
                      : lesson.status === "draft"
                        ? "bg-muted text-muted-foreground"
                        : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {lesson.status}
                </span>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-card-foreground line-clamp-2">
                {lesson.title}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">{lesson.subject}</p>
              <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                {lesson.description || "No description"}
              </p>
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {lesson.scheduledDate
                    ? new Date(lesson.scheduledDate).toLocaleDateString()
                    : "Not scheduled"}
                </span>
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1 text-xs"
                  onClick={async () => {
                    const newStatus = lesson.status === "published" ? "draft" : "published";
                    try {
                      await apiClient.put(`/lesson-plans/${lesson._id}`, {
                        ...lesson,
                        status: newStatus,
                      });
                      queryClient.invalidateQueries({ queryKey: ["lesson-plans"] });
                      toast({
                        title: "Success",
                        description: `Lesson updated to ${newStatus}!`,
                      });
                    } catch (error: any) {
                      toast({
                        title: "Error",
                        description: error.message || "Failed to update lesson.",
                      });
                    }
                  }}
                >
                  <Edit size={12} /> {lesson.status === "published" ? "Unpublish" : "Publish"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 text-xs text-destructive hover:text-destructive"
                  onClick={async () => {
                    if (window.confirm("Are you sure you want to delete this lesson?")) {
                      try {
                        await apiClient.delete(`/lesson-plans/${lesson._id}`);
                        queryClient.invalidateQueries({ queryKey: ["lesson-plans"] });
                        toast({
                          title: "Success",
                          description: "Lesson deleted successfully!",
                        });
                      } catch (error: any) {
                        toast({
                          title: "Error",
                          description: error.message || "Failed to delete lesson.",
                        });
                      }
                    }
                  }}
                >
                  <Trash2 size={12} />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <BookOpen size={32} className="mx-auto mb-2 opacity-30" />
            <p>
              {searchTerm || statusFilter !== "all"
                ? "No lessons found"
                : "No lessons yet. Create your first lesson!"}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TeacherLessons;
