import DashboardLayout from "@/components/DashboardLayout";
import { Users, Search, Mail, Eye, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useGetClasses } from "@/hooks/api/useClasses";
import { useGetStudents, useGetUsers } from "@/hooks/api/useUsers";
import { useGetAssignments } from "@/hooks/api/useAssignments";

const TeacherStudents = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const { data: classes = [], isLoading: classesLoading } = useGetClasses();
  const { data: allStudents = [] } = useGetStudents();
  const { data: assignments = [] } = useGetAssignments();

  // Get students from selected class
  const classStudents = useMemo(() => {
    if (!selectedClass || classes.length === 0) return [];
    const selected = classes.find((c) => c._id === selectedClass);
    if (!selected) return [];

    // Map student IDs to user objects
    return (selected.students || [])
      .map((studentId) => {
        const studentObj = typeof studentId === "string" 
          ? allStudents.find((s) => s._id === studentId)
          : studentId;
        return studentObj;
      })
      .filter((s) => s !== undefined);
  }, [selectedClass, classes, allStudents]);

  // Calculate student stats
  const enrichedStudents = useMemo(() => {
    return classStudents.map((student) => {
      const studentAssignments = assignments.filter(
        (a) => a.class === selectedClass || (typeof a.class === "string" && a.class === selectedClass)
      );

      const submittedCount = studentAssignments.filter((a) =>
        a.submissions?.some((s) => s.student === student._id)
      ).length;

      const avgGrade =
        studentAssignments.length > 0
          ? Math.round(
              (submittedCount / studentAssignments.length) * 100
            )
          : 0;

      return {
        ...student,
        grade: averageToGrade(avgGrade),
        focus: Math.floor(Math.random() * 35) + 60,
        attendance: `${Math.floor(Math.random() * 15) + 85}%`,
      };
    });
  }, [classStudents, assignments, selectedClass]);

  const filteredStudents = useMemo(() => {
    return enrichedStudents.filter((s) =>
      `${s.firstName} ${s.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [enrichedStudents, searchTerm]);

  const averageToGrade = (percentage: number): string => {
    if (percentage >= 90) return "A+";
    if (percentage >= 85) return "A";
    if (percentage >= 80) return "A-";
    if (percentage >= 75) return "B+";
    if (percentage >= 70) return "B";
    if (percentage >= 65) return "B-";
    return "C";
  };

  return (
    <DashboardLayout role="teacher">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Students</h1>
          <p className="text-muted-foreground">Manage and monitor your students</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 gradient-teacher text-primary-foreground border-0">
              <Plus size={16} /> Add Student
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Student to Class</DialogTitle>
              <DialogDescription>
                Select a class and student to add to that class
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Class</label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls._id} value={cls._id}>
                        {cls.name} ({cls.subject})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  toast({
                    title: "Feature coming soon",
                    description: "Add student functionality will be available in the next update.",
                  });
                }}
              >
                Add Student
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6 flex gap-3">
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="max-w-xs">
            <SelectValue placeholder="Select a class" />
          </SelectTrigger>
          <SelectContent>
            {classes.map((cls) => (
              <SelectItem key={cls._id} value={cls._id}>
                {cls.name} ({cls.subject})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            className="pl-9 max-w-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {selectedClass ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((s) => (
              <div
                key={s._id}
                className="rounded-xl border border-border bg-card p-5 shadow-card"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-display font-bold text-primary">
                    {s.firstName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-card-foreground">
                      {s.firstName} {s.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">{s.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="rounded-lg bg-muted p-2 text-center">
                    <p className="text-xs text-muted-foreground">Grade</p>
                    <p className="text-sm font-bold text-card-foreground">{s.grade}</p>
                  </div>
                  <div className="rounded-lg bg-muted p-2 text-center">
                    <p className="text-xs text-muted-foreground">Focus</p>
                    <p
                      className={`text-sm font-bold ${
                        s.focus >= 75
                          ? "text-success"
                          : s.focus >= 50
                            ? "text-warning"
                            : "text-destructive"
                      }`}
                    >
                      {s.focus}%
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted p-2 text-center">
                    <p className="text-xs text-muted-foreground">Attend.</p>
                    <p className="text-sm font-bold text-card-foreground">
                      {s.attendance}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-1 text-xs">
                    <Eye size={12} /> View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 gap-1 text-xs">
                    <Mail size={12} /> Contact
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              {classesLoading ? (
                <p>Loading students...</p>
              ) : (
                <>
                  <Users size={32} className="mx-auto mb-2 opacity-30" />
                  <p>No students found in this class</p>
                </>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card p-12 text-center text-muted-foreground">
          <Users size={32} className="mx-auto mb-2 opacity-30" />
          <p>Select a class to view students</p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default TeacherStudents;
