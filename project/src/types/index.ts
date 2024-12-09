export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'faculty';
  department?: string;
}

export interface Template {
  id: string;
  name: string;
  workingDays: string[];
  periods: Period[];
}

export interface Period {
  id: string;
  startTime: string;
  endTime: string;
  isBreak?: boolean;
}

export interface Faculty {
  id: string;
  name: string;
  department: string;
  maxHoursPerDay: number;
  freeSlots: FreeSlot[];
}

export interface FreeSlot {
  day: string;
  periodId: string;
}

export interface Course {
  id: string;
  name: string;
  facultyId: string;
  hoursPerWeek: number;
}

export interface TimeSlot {
  day: string;
  periodId: string;
  courseId: string;
  facultyId: string;
}

export interface GeneratedTimetable {
  id: string;
  templateId: string;
  slots: TimeSlot[];
  createdAt: string;
}