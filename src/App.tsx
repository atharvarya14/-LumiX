import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import TeacherDashboard from "./pages/TeacherDashboard";
import TeacherLessons from "./pages/TeacherLessons";
import TeacherLive from "./pages/TeacherLive";
import TeacherTimetable from "./pages/TeacherTimetable";
import TeacherStudents from "./pages/TeacherStudents";
import TeacherAttention from "./pages/TeacherAttention";
import TeacherAssignments from "./pages/TeacherAssignments";
import TeacherAnnouncements from "./pages/TeacherAnnouncements";
import StudentDashboard from "./pages/StudentDashboard";
import StudentClasses from "./pages/StudentClasses";
import StudentResources from "./pages/StudentResources";
import StudentTimetable from "./pages/StudentTimetable";
import StudentAssignments from "./pages/StudentAssignments";
import StudentReports from "./pages/StudentReports";
import StudentMessages from "./pages/StudentMessages";
import ParentDashboard from "./pages/ParentDashboard";
import ParentReports from "./pages/ParentReports";
import ParentAttention from "./pages/ParentAttention";
import ParentGrades from "./pages/ParentGrades";
import ParentTimetable from "./pages/ParentTimetable";
import ParentMessages from "./pages/ParentMessages";
import ParentSettings from "./pages/ParentSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />

          {/* Login routes */}
          <Route path="/login/teacher" element={<LoginPage role="teacher" />} />
          <Route path="/login/student" element={<LoginPage role="student" />} />
          <Route path="/login/parent" element={<LoginPage role="parent" />} />

          {/* Teacher routes */}
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/teacher/lessons" element={<TeacherLessons />} />
          <Route path="/teacher/live" element={<TeacherLive />} />
          <Route path="/teacher/timetable" element={<TeacherTimetable />} />
          <Route path="/teacher/students" element={<TeacherStudents />} />
          <Route path="/teacher/attention" element={<TeacherAttention />} />
          <Route path="/teacher/assignments" element={<TeacherAssignments />} />
          <Route path="/teacher/announcements" element={<TeacherAnnouncements />} />

          {/* Student routes */}
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/classes" element={<StudentClasses />} />
          <Route path="/student/resources" element={<StudentResources />} />
          <Route path="/student/timetable" element={<StudentTimetable />} />
          <Route path="/student/assignments" element={<StudentAssignments />} />
          <Route path="/student/reports" element={<StudentReports />} />
          <Route path="/student/messages" element={<StudentMessages />} />

          {/* Parent routes */}
          <Route path="/parent" element={<ParentDashboard />} />
          <Route path="/parent/reports" element={<ParentReports />} />
          <Route path="/parent/attention" element={<ParentAttention />} />
          <Route path="/parent/grades" element={<ParentGrades />} />
          <Route path="/parent/timetable" element={<ParentTimetable />} />
          <Route path="/parent/messages" element={<ParentMessages />} />
          <Route path="/parent/settings" element={<ParentSettings />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
