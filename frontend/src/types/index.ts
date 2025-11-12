export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'faculty' | 'principal';
  department?: string;
  year?: number;
  collegeName?: string; // ✅ ADDED
  leaveBalance?: number; // ✅ MADE OPTIONAL (since we removed the limit)
}

export interface LeaveApplication {
  _id: string;
  student: string;
  studentName: string;
  studentEmail: string;
  department: string;
  year: number;
  leaveType: 'half-day' | 'full-day';
  leaveCategory: 'sick' | 'casual' | 'event' | 'personal'; // ✅ ADDED
  startDate: Date;
  endDate: Date;
  duration: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled'; // ✅ ADDED 'cancelled'
  attachments?: string[];
  reviewedBy?: string;
  reviewedAt?: Date;
  reviewComments?: string;
  auditTrail: AuditEntry[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditEntry {
  action: string;
  performedBy: string;
  performedAt: Date;
  details: string;
}

export interface Notification {
  _id: string;
  user: string;
  type: 'leave_submitted' | 'leave_approved' | 'leave_rejected' | 'reminder';
  title: string;
  message: string;
  relatedLeave?: string;
  isRead: boolean;
  createdAt: Date;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'faculty' | 'principal';
  department?: string;
  year?: number;
  collegeName: string;
  registrationKey?: string; // ✅ ADDED for Faculty/Principal registration
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface LeaveFormData {
  leaveType: 'half-day' | 'full-day';
  leaveCategory: 'sick' | 'casual' | 'event' | 'personal'; // ✅ ADDED - THIS FIXES YOUR ERROR!
  startDate: Date | null;
  endDate: Date | null;
  reason: string;
}

export interface Stats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}
