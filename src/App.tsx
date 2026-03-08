import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute, PublicRoute } from "@/components/ProtectedRoute";
import Landing from "./components/pages/Landing";
import LoginPage from "./components/pages/LoginPage";
import RegisterPage from "./components/pages/RegisterPage";
import NotFound from "./components/pages/NotFound";
import TeacherDashboard from "./components/pages/TeacherDashboard";
import TeacherLessons from "./components/pages/TeacherLessons";
import TeacherLive from "./components/pages/TeacherLive";
import TeacherTimetable from "./components/pages/TeacherTimetable";
import TeacherStudents from "./components/pages/TeacherStudents";
import TeacherAttention from "./components/pages/TeacherAttention";
import TeacherAssignments from "./components/pages/TeacherAssignments";
import TeacherAnnouncements from "./components/pages/TeacherAnnouncements";
import TeacherMessages from "./components/pages/TeacherMessages";
import StudentDashboard from "./components/pages/StudentDashboard";
import StudentClasses from "./components/pages/StudentClasses";
import StudentResources from "./components/pages/StudentResources";
import StudentTimetable from "./components/pages/StudentTimetable";
import StudentAssignments from "./components/pages/StudentAssignments";
import StudentReports from "./components/pages/StudentReports";
import StudentMessages from "./components/pages/StudentMessages";
import ParentDashboard from "./components/pages/ParentDashboard";
import ParentReports from "./components/pages/ParentReports";
import ParentAttention from "./components/pages/ParentAttention";
import ParentGrades from "./components/pages/ParentGrades";
import ParentTimetable from "./components/pages/ParentTimetable";
import ParentMessages from "./components/pages/ParentMessages";
import ParentSettings from "./components/pages/ParentSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes - redirect to dashboard if already authenticated */}
            <Route
              path="/"
              element={
                <PublicRoute>
                  <Landing />
                </PublicRoute>
              }
            />

            {/* Login routes - redirect to dashboard if already authenticated */}
            <Route
              path="/login/teacher"
              element={
                <PublicRoute>
                  <LoginPage role="teacher" />
                </PublicRoute>
              }
            />
            <Route
              path="/login/student"
              element={
                <PublicRoute>
                  <LoginPage role="student" />
                </PublicRoute>
              }
            />
            <Route
              path="/login/parent"
              element={
                <PublicRoute>
                  <LoginPage role="parent" />
                </PublicRoute>
              }
            />

            {/* Register route */}
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              }
            />

            {/* Teacher routes - requires authentication and teacher role */}
            <Route
              path="/teacher"
              element={
                <ProtectedRoute requiredRole="teacher">
                  <TeacherDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/lessons"
              element={
                <ProtectedRoute requiredRole="teacher">
                  <TeacherLessons />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/live"
              element={
                <ProtectedRoute requiredRole="teacher">
                  <TeacherLive />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/timetable"
              element={
                <ProtectedRoute requiredRole="teacher">
                  <TeacherTimetable />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/students"
              element={
                <ProtectedRoute requiredRole="teacher">
                  <TeacherStudents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/attention"
              element={
                <ProtectedRoute requiredRole="teacher">
                  <TeacherAttention />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/assignments"
              element={
                <ProtectedRoute requiredRole="teacher">
                  <TeacherAssignments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/announcements"
              element={
                <ProtectedRoute requiredRole="teacher">
                  <TeacherAnnouncements />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/messages"
              element={
                <ProtectedRoute requiredRole="teacher">
                  <TeacherMessages />
                </ProtectedRoute>
              }
            />

            {/* Student routes - requires authentication and student role */}
            <Route
              path="/student"
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/classes"
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentClasses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/resources"
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentResources />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/timetable"
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentTimetable />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/assignments"
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentAssignments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/reports"
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentReports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/messages"
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentMessages />
                </ProtectedRoute>
              }
            />

            {/* Parent routes - requires authentication and parent role */}
            <Route
              path="/parent"
              element={
                <ProtectedRoute requiredRole="parent">
                  <ParentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/parent/reports"
              element={
                <ProtectedRoute requiredRole="parent">
                  <ParentReports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/parent/attention"
              element={
                <ProtectedRoute requiredRole="parent">
                  <ParentAttention />
                </ProtectedRoute>
              }
            />
            <Route
              path="/parent/grades"
              element={
                <ProtectedRoute requiredRole="parent">
                  <ParentGrades />
                </ProtectedRoute>
              }
            />
            <Route
              path="/parent/timetable"
              element={
                <ProtectedRoute requiredRole="parent">
                  <ParentTimetable />
                </ProtectedRoute>
              }
            />
            <Route
              path="/parent/messages"
              element={
                <ProtectedRoute requiredRole="parent">
                  <ParentMessages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/parent/settings"
              element={
                <ProtectedRoute requiredRole="parent">
                  <ParentSettings />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
