import DashboardLayout from "@/components/DashboardLayout";
import Timetable from "@/components/Timetable";

const ParentTimetable = () => (
  <DashboardLayout role="parent">
    <div className="mb-6">
      <h1 className="font-display text-2xl font-bold text-foreground">Sarah's Timetable</h1>
      <p className="text-muted-foreground">Your child's daily class schedule</p>
    </div>
    <Timetable />
  </DashboardLayout>
);

export default ParentTimetable;
