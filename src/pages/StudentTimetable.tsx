import DashboardLayout from "@/components/DashboardLayout";
import Timetable from "@/components/Timetable";

const StudentTimetable = () => (
  <DashboardLayout role="student">
    <div className="mb-6">
      <h1 className="font-display text-2xl font-bold text-foreground">My Timetable</h1>
      <p className="text-muted-foreground">Your daily class schedule</p>
    </div>
    <Timetable />
  </DashboardLayout>
);

export default StudentTimetable;
