import DashboardLayout from "@/components/DashboardLayout";
import Timetable from "@/components/Timetable";

const TeacherTimetable = () => {
  return (
    <DashboardLayout role="teacher">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Timetable</h1>
        <p className="text-muted-foreground">Your weekly class schedule</p>
      </div>
      <Timetable />
    </DashboardLayout>
  );
};

export default TeacherTimetable;
