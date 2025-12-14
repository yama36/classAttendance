export type AttendanceStatus = 'present' | 'absent' | 'late' | 'leaveEarly';

export interface AttendanceRecord {
  date: string;
  status: AttendanceStatus;
}

export interface Student {
  id: string;
  number: number;
  name: string;
  lastName?: string; // 姓
  firstName?: string; // 名
  records: AttendanceRecord[];
}

export interface ClassData {
  id: string;
  name: string;
  students: Student[];
}

export type ViewMode = 'teacher' | 'student';
