import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, BookOpen, Users, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const roles = [
  {
    id: "teacher" as const,
    label: "Teacher",
    description: "Manage classes, post lessons, monitor student attention in real-time",
    icon: <GraduationCap size={36} />,
    path: "/login/teacher",
    gradient: "gradient-teacher",
    features: ["Post Lessons", "Live Classes", "Attention Reports", "Timetable"],
  },
  {
    id: "student" as const,
    label: "Student",
    description: "Access resources, attend live classes, and track your learning progress",
    icon: <BookOpen size={36} />,
    path: "/login/student",
    gradient: "gradient-student",
    features: ["View Resources", "Live Classes", "Submit Work", "Track Focus"],
  },
  {
    id: "parent" as const,
    label: "Parent",
    description: "Monitor your child's attendance, focus reports, and academic performance",
    icon: <Users size={36} />,
    path: "/login/parent",
    gradient: "gradient-parent",
    features: ["Focus Reports", "Grade Tracking", "Attendance", "Messages"],
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <header className="gradient-hero relative overflow-hidden px-6 py-16 text-center lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 mx-auto max-w-3xl"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-sm text-primary-foreground/80">
            <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
            AI-Powered Classroom Monitoring
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight text-primary-foreground md:text-5xl lg:text-6xl">
            LumiX
          </h1>
          <p className="mt-4 text-lg text-primary-foreground/70 md:text-xl">
            The intelligent classroom platform with real-time attention monitoring.
            Empowering teachers, engaging students, informing parents.
          </p>
        </motion.div>

        {/* Background decoration */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
      </header>

      {/* Role selection */}
      <main className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-10 text-center">
          <h2 className="font-display text-2xl font-bold text-foreground">Choose Your Portal</h2>
          <p className="mt-2 text-muted-foreground">Select your role to access the platform</p>
        </div>

        <motion.div variants={container} initial="hidden" animate="show" className="grid gap-6 md:grid-cols-3">
          {roles.map((role) => (
            <motion.div key={role.id} variants={item}>
              <Link to={role.path} className="group block">
                <div className="rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-elevated hover:-translate-y-1">
                  <div className={`${role.gradient} inline-flex rounded-xl p-3 text-primary-foreground`}>
                    {role.icon}
                  </div>
                  <h3 className="mt-4 font-display text-xl font-bold text-card-foreground">{role.label}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{role.description}</p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {role.features.map((f) => (
                      <span key={f} className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                        {f}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 flex items-center text-sm font-medium text-primary group-hover:gap-2 transition-all">
                    Enter Portal <ChevronRight size={16} className="ml-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8 text-center text-sm text-muted-foreground">
        <p>© 2026 LumiX — AI-Powered Classroom Monitoring Platform</p>
      </footer>
    </div>
  );
};

export default Landing;
