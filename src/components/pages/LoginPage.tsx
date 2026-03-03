import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, BookOpen, Users, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

type Role = "teacher" | "student" | "parent";

const roleConfig: Record<Role, { label: string; icon: React.ReactNode; gradient: string; dashboard: string; description: string }> = {
  teacher: {
    label: "Teacher",
    icon: <GraduationCap size={32} />,
    gradient: "gradient-teacher",
    dashboard: "/teacher",
    description: "Access your classroom dashboard, lessons, and student reports",
  },
  student: {
    label: "Student",
    icon: <BookOpen size={32} />,
    gradient: "gradient-student",
    dashboard: "/student",
    description: "Access your classes, resources, and learning materials",
  },
  parent: {
    label: "Parent",
    icon: <Users size={32} />,
    gradient: "gradient-parent",
    dashboard: "/parent",
    description: "Monitor your child's progress, grades, and attention reports",
  },
};

const LoginPage = ({ role }: { role: Role }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const config = roleConfig[role];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast({ title: "Missing fields", description: "Please enter both email and password.", variant: "destructive" });
      return;
    }

    setIsLoading(true);

    // Demo login — accept any credentials
    setTimeout(() => {
      setIsLoading(false);
      toast({ title: "Welcome back!", description: `Logged in as ${config.label}` });
      navigate(config.dashboard);
    }, 800);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      {/* Background accents */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-secondary/5 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="mb-6 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>

        <Card className="border-border shadow-elevated">
          <CardHeader className="text-center pb-2">
            <div className={`${config.gradient} mx-auto mb-3 inline-flex rounded-xl p-3 text-primary-foreground`}>
              {config.icon}
            </div>
            <CardTitle className="font-display text-2xl">{config.label} Login</CardTitle>
            <CardDescription className="text-sm">{config.description}</CardDescription>
          </CardHeader>

          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <button type="button" className="text-xs text-primary hover:underline">
                  Forgot password?
                </button>
              </div>
            </CardContent>

            <CardFooter className="flex-col gap-3">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in…" : "Sign In"}
              </Button>
              <p className="text-xs text-muted-foreground">
                Demo mode — enter any email & password to continue
              </p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;
