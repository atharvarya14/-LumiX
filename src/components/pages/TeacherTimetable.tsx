import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useState, useMemo } from "react";
import { Plus, Edit2, Trash2, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGetTimetables, useAddTimetableEntry } from "@/hooks/api/useTimetables";
import { useGetClasses } from "@/hooks/api/useClasses";

interface TimetableEntry {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  subject: string;
  room?: string;
}

const TeacherTimetable = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ day: "Monday", startTime: "08:00", endTime: "08:45", subject: "", room: "" });
  const { data: timetables = [], isLoading } = useGetTimetables();
  const { data: classes = [] } = useGetClasses();

  // Get the first timetable or create merged entries
  const mainTimetable = useMemo(() => {
    if (timetables.length === 0) return null;
    return timetables[0];
  }, [timetables]);

  const entries = useMemo(() => {
    if (!mainTimetable || !mainTimetable.entries) return [];
    return mainTimetable.entries.map((e: any) => ({
      id: e._id,
      dayOfWeek: e.dayOfWeek || "Monday",
      startTime: e.startTime || "08:00",
      endTime: e.endTime || "08:45",
      subject: e.subject || "Subject",
      room: e.room || "Room",
    }));
  }, [mainTimetable]);

  const addEntryMutation = useAddTimetableEntry(mainTimetable?._id || "");

  const handleOpenDialog = () => {
    setFormData({ day: "Monday", startTime: "08:00", endTime: "08:45", subject: "", room: "" });
    setIsOpen(true);
  };

  const handleSave = async () => {
    if (!formData.subject || !formData.room) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
      });
      return;
    }

    if (!mainTimetable || !mainTimetable._id) {
      toast({
        title: "Error",
        description: "No timetable found. Please contact admin.",
      });
      return;
    }

    try {
      await addEntryMutation.mutateAsync({
        dayOfWeek: formData.day,
        startTime: formData.startTime,
        endTime: formData.endTime,
        subject: formData.subject,
        class: "",
        teacher: "",
        room: formData.room,
      });
      toast({
        title: "Success",
        description: "Schedule added successfully!",
      });
      setFormData({ day: "Monday", startTime: "08:00", endTime: "08:45", subject: "", room: "" });
      setIsOpen(false);
    } catch (error: any) {
      console.error("Timetable entry error:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to add schedule.",
      });
    }
  };

  return (
    <DashboardLayout role="teacher">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Timetable</h1>
          <p className="text-muted-foreground">Manage your weekly class schedule</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => handleOpenDialog()}
              className="gap-2 gradient-teacher text-primary-foreground border-0"
            >
              <Plus size={16} /> Add Slot
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Schedule Slot</DialogTitle>
              <DialogDescription>
                Add a new class to your timetable
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="day">Day of Week *</Label>
                <select
                  id="day"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.day}
                  onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                >
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time *</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time *</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  placeholder="e.g., Mathematics"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="room">Room/Location *</Label>
                <Input
                  id="room"
                  placeholder="e.g., Room 201"
                  value={formData.room}
                  onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={addEntryMutation.isPending}
              >
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={addEntryMutation.isPending}>
                {addEntryMutation.isPending ? "Adding..." : "Add"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Timetable Display */}
      <div className="rounded-xl border border-border bg-card shadow-card">
        <div className="border-b border-border px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar size={20} className="text-primary" />
            <h3 className="font-display font-semibold text-card-foreground">Weekly Schedule</h3>
          </div>
        </div>
        {isLoading ? (
          <div className="px-5 py-8 text-center text-muted-foreground">
            <p>Loading schedule...</p>
          </div>
        ) : entries.length > 0 ? (
          <div className="divide-y divide-border">
            {entries.map((entry, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 px-5 py-3 hover:bg-muted/50 transition-colors"
              >
                <div className="w-24 shrink-0">
                  <p className="text-xs font-medium text-muted-foreground">{entry.dayOfWeek}</p>
                  <p className="text-xs text-muted-foreground">{entry.startTime} - {entry.endTime}</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-card-foreground">{entry.subject}</p>
                </div>
                <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                  {entry.room}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-5 py-8 text-center text-muted-foreground">
            <p>No schedule entries yet. Add one to get started!</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TeacherTimetable;
