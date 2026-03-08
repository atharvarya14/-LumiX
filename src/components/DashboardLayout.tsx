import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  Users,
  BarChart3,
  Video,
  FileText,
  Bell,
  LogOut,
  Settings,
  Eye,
  ClipboardList,
  MessageSquare,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

type Role = "teacher" | "student" | "parent";

interface NavItem {
  label: string;
  path: string;
  icon: ReactNode;
}

const navItems: Record<Role, NavItem[]> = {
  teacher: [
    { label: "Dashboard", path: "/teacher", icon: <LayoutDashboard size={20} /> },
    { label: "Lessons", path: "/teacher/lessons", icon: <BookOpen size={20} /> },
    { label: "Live Class", path: "/teacher/live", icon: <Video size={20} /> },
    { label: "Timetable", path: "/teacher/timetable", icon: <Calendar size={20} /> },
    { label: "Students", path: "/teacher/students", icon: <Users size={20} /> },
    { label: "Attention Reports", path: "/teacher/attention", icon: <Eye size={20} /> },
    { label: "Assignments", path: "/teacher/assignments", icon: <ClipboardList size={20} /> },
    { label: "Messages", path: "/teacher/messages", icon: <MessageSquare size={20} /> },
    { label: "Announcements", path: "/teacher/announcements", icon: <Bell size={20} /> },
  ],
  student: [
    { label: "Dashboard", path: "/student", icon: <LayoutDashboard size={20} /> },
    { label: "My Classes", path: "/student/classes", icon: <Video size={20} /> },
    { label: "Resources", path: "/student/resources", icon: <BookOpen size={20} /> },
    { label: "Timetable", path: "/student/timetable", icon: <Calendar size={20} /> },
    { label: "Assignments", path: "/student/assignments", icon: <FileText size={20} /> },
    { label: "My Reports", path: "/student/reports", icon: <BarChart3 size={20} /> },
    { label: "Messages", path: "/student/messages", icon: <MessageSquare size={20} /> },
  ],
  parent: [
    { label: "Dashboard", path: "/parent", icon: <LayoutDashboard size={20} /> },
    { label: "Child Report", path: "/parent/reports", icon: <BarChart3 size={20} /> },
    { label: "Attention Log", path: "/parent/attention", icon: <Eye size={20} /> },
    { label: "Grades", path: "/parent/grades", icon: <GraduationCap size={20} /> },
    { label: "Timetable", path: "/parent/timetable", icon: <Calendar size={20} /> },
    { label: "Messages", path: "/parent/messages", icon: <MessageSquare size={20} /> },
    { label: "Settings", path: "/parent/settings", icon: <Settings size={20} /> },
  ],
};

const roleLabels: Record<Role, string> = {
  teacher: "Teacher Portal",
  student: "Student Portal",
  parent: "Parent Portal",
};

const roleGradients: Record<Role, string> = {
  teacher: "gradient-teacher",
  student: "gradient-student",
  parent: "gradient-parent",
};

interface DashboardLayoutProps {
  role: Role;
  children: ReactNode;
}

const DashboardLayout = ({ role, children }: DashboardLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
      navigate("/");
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-border bg-card">
        <div className={`${roleGradients[role]} px-6 py-5`}>
          <Link to="/" className="flex items-center gap-2">
            <GraduationCap className="text-primary-foreground" size={28} />
            <span className="font-display text-lg font-bold text-primary-foreground">LumiX</span>
          </Link>
          <p className="mt-1 text-sm text-primary-foreground/70">{roleLabels[role]}</p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems[role].map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-3">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 flex-1">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6 lg:p-8"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default DashboardLayout;
