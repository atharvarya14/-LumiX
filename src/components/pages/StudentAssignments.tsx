import DashboardLayout from "@/components/DashboardLayout";
import { FileText, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useGetAssignments } from "@/hooks/api/useAssignments";

const StudentAssignments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);

  const { data: assignments = [], isLoading } = useGetAssignments();

  const getSubmissionStatus = (assignment: any) => {
    const submission = assignment.submissions?.find((s: any) => s.student === user?._id);
    if (!submission) return "not started";
    if (submission.status === "graded") return "graded";
    return "submitted";
  };

  const handleSubmit = () => {
    toast({
      title: "Assignment submitted!",
      description: "Your submission has been recorded.",
    });
    setIsSubmitOpen(false);
  };

  return (
    <DashboardLayout role="student">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">
          Assignments
        </h1>
        <p className="text-muted-foreground">Track and submit your assignments</p>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            <FileText size={32} className="mx-auto mb-2 opacity-30" />
            <p>Loading assignments...</p>
          </div>
        ) : assignments.length > 0 ? (
          assignments.map((assignment) => {
            const status = getSubmissionStatus(assignment);
            const submission = assignment.submissions?.find(
              (s: any) => s.student === user?._id
            );

            return (
              <div
                key={assignment._id}
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-card hover:shadow-elevated transition-shadow"
              >
                <div className="rounded-lg bg-primary/10 p-2.5">
                  <FileText size={18} className="text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-card-foreground">
                    {assignment.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {assignment.subject} · Due:{" "}
                    {new Date(assignment.dueDate).toLocaleDateString()}
                  </p>
                  {submission && submission.grade !== undefined && (
                    <p className="text-xs text-success mt-1">
                      Grade: {submission.grade}/{assignment.totalMarks}
                    </p>
                  )}
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    status === "graded"
                      ? "bg-success/10 text-success"
                      : status === "submitted"
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {status}
                </span>
                {status === "not started" && (
                  <Dialog open={isSubmitOpen} onOpenChange={setIsSubmitOpen}>
                    <Button
                      size="sm"
                      className="gradient-student text-secondary-foreground border-0"
                      onClick={() => {
                        setSelectedAssignment(assignment);
                        setIsSubmitOpen(true);
                      }}
                    >
                      Submit
                    </Button>
                    {selectedAssignment?._id === assignment._id && (
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Submit Assignment</DialogTitle>
                          <DialogDescription>
                            Submit your completed assignment
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              Upload File
                            </label>
                            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                              <Upload size={32} className="mx-auto mb-2 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">
                                Click to upload or drag and drop
                              </p>
                              <Input
                                type="file"
                                className="hidden"
                                accept=".pdf,.doc,.docx,.txt"
                              />
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setIsSubmitOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button onClick={handleSubmit}>Submit Assignment</Button>
                        </DialogFooter>
                      </DialogContent>
                    )}
                  </Dialog>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 text-muted-foreground rounded-xl border border-border bg-card p-8">
            <FileText size={32} className="mx-auto mb-2 opacity-30" />
            <p>No assignments assigned yet</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentAssignments;
