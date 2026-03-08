/**
 * TypeScript types matching the LumiX backend API models
 * Generated from backend-design.md specification
 */

export type UserRole = "teacher" | "student" | "parent" | "admin";
export type SubmissionStatus = "submitted" | "late" | "graded" | "returned";
export type AssignmentStatus = "draft" | "published" | "closed";
export type LessonPlanStatus = "draft" | "published" | "archived";
export type MessageReadStatus = "read" | "unread";

// ==================== USER ====================
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  subject?: string; // teachers only
  department?: string; // teachers only
  grade?: string; // students only
  parentId?: string; // students only
  childIds?: string[]; // parents only
  isActive: boolean;
  lastLogin?: string; // ISO date
  profilePicture?: string;
  createdAt: string;
  updatedAt: string;
  fullName: string;
}

// ==================== CLASS ====================
export interface Class {
  _id: string;
  name: string;
  subject: string;
  grade: string;
  description?: string;
  teacher: User | string; // populated or just ID
  students: (User | string)[]; // array of students or IDs
  isActive: boolean;
  liveSession?: {
    isLive: boolean;
    startedAt?: string;
    sessionId?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// ==================== LESSON PLAN ====================
export interface LessonPlan {
  _id: string;
  title: string;
  subject: string;
  grade: string;
  description?: string;
  objectives?: string[];
  content?: string; // markdown
  resources?: string[]; // URLs
  duration?: number; // minutes
  teacher: User | string;
  class?: Class | string;
  scheduledDate?: string; // ISO date
  status: LessonPlanStatus;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

// ==================== TIMETABLE ====================
export interface TimetableEntry {
  _id: string;
  dayOfWeek: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  subject: string;
  class: Class | string;
  teacher: User | string;
  room?: string;
  notes?: string;
}

export interface Timetable {
  _id: string;
  name: string;
  academicYear: string;
  term?: string;
  isActive: boolean;
  createdBy: User | string;
  class?: Class | string;
  teacher?: User | string;
  entries: TimetableEntry[];
  createdAt: string;
  updatedAt: string;
}

// ==================== ASSIGNMENT ====================
export interface Submission {
  _id: string;
  student: User | string;
  submittedAt: string; // ISO date
  content?: string;
  attachments?: string[]; // URLs
  grade?: number;
  feedback?: string;
  gradedAt?: string;
  gradedBy?: User | string;
  status: SubmissionStatus;
}

export interface Assignment {
  _id: string;
  title: string;
  description: string;
  subject: string;
  class: Class | string;
  teacher: User | string;
  dueDate: string; // ISO date
  totalMarks?: number;
  attachments?: string[]; // URLs
  instructions?: string;
  status: AssignmentStatus;
  submissions: Submission[];
  createdAt: string;
  updatedAt: string;
}

// ==================== MESSAGE ====================
export interface Message {
  _id: string;
  sender: User | string;
  recipients: (User | string)[];
  subject?: string;
  body: string;
  attachments?: string[]; // URLs
  isAnnouncement: boolean;
  class?: Class | string;
  readBy: (User | string)[];
  parentMessage?: Message | string; // for threading
  createdAt: string;
  updatedAt: string;
}

// ==================== API RESPONSE WRAPPER ====================
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: Array<{
    type: string;
    msg: string;
    path: string;
    location: string;
  }>;
}

// ==================== AUTH RESPONSES ====================
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LoginResponse extends ApiResponse<AuthResponse> {}
export interface RegisterResponse extends ApiResponse<AuthResponse> {}
export interface RefreshTokenResponse extends ApiResponse<{
  accessToken: string;
  refreshToken: string;
}> {}
export interface MeResponse extends ApiResponse<{ user: User }> {}

// ==================== LIST RESPONSES ====================
export interface ClassListResponse extends ApiResponse<{
  classes: Class[];
  total?: number;
}> {}

export interface UserListResponse extends ApiResponse<{
  users: User[];
  total: number;
}> {}

export interface LessonPlanListResponse extends ApiResponse<{
  plans: LessonPlan[];
  total: number;
  page: number;
  limit: number;
}> {}

export interface TimetableListResponse extends ApiResponse<{
  timetables: Timetable[];
}> {}

export interface AssignmentListResponse extends ApiResponse<{
  assignments: Assignment[];
  total: number;
  page: number;
  limit: number;
}> {}

export interface MessageListResponse extends ApiResponse<{
  messages: Message[];
  total?: number;
}> {}

// ==================== DETAIL RESPONSES ====================
export interface ClassDetailResponse extends ApiResponse<{ class: Class }> {}
export interface UserDetailResponse extends ApiResponse<{ user: User }> {}
export interface LessonPlanDetailResponse extends ApiResponse<{ plan: LessonPlan }> {}
export interface TimetableDetailResponse extends ApiResponse<{ timetable: Timetable }> {}
export interface AssignmentDetailResponse extends ApiResponse<{ assignment: Assignment }> {}
export interface MessageDetailResponse extends ApiResponse<{ message: Message }> {}

// ==================== REQUEST BODIES ====================
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: UserRole;
  subject?: string;
  department?: string;
  grade?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// ==================== UTILITY ====================
export type DashboardRoute = "/teacher" | "/student" | "/parent" | "/admin";

export const getRoleDashboard = (role: UserRole): DashboardRoute => {
  switch (role) {
    case "teacher":
      return "/teacher";
    case "student":
      return "/student";
    case "parent":
      return "/parent";
    case "admin":
      return "/admin";
    default:
      return "/student";
  }
};
