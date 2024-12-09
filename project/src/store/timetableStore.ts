import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Template, Faculty, Course, Period, GeneratedTimetable, TimeSlot } from '../types';

const SCHOOL_PERIODS: Period[] = [
  { id: '1', startTime: '08:30', endTime: '09:20' },
  { id: '2', startTime: '09:20', endTime: '10:10' },
  { id: '3', startTime: '10:30', endTime: '11:20' },
  { id: '4', startTime: '11:20', endTime: '12:10' },
  { id: 'lunch', startTime: '12:10', endTime: '13:00', isBreak: true },
  { id: '5', startTime: '13:00', endTime: '13:50' },
  { id: '6', startTime: '13:50', endTime: '14:40' },
  { id: '7', startTime: '14:50', endTime: '15:40' },
];

const COLLEGE_PERIODS: Period[] = [
  { id: '1', startTime: '09:00', endTime: '10:00' },
  { id: '2', startTime: '10:00', endTime: '11:00' },
  { id: '3', startTime: '11:15', endTime: '12:15' },
  { id: '4', startTime: '12:15', endTime: '13:15' },
  { id: 'lunch', startTime: '13:15', endTime: '14:00', isBreak: true },
  { id: '5', startTime: '14:00', endTime: '15:00' },
  { id: '6', startTime: '15:00', endTime: '16:00' },
  { id: '7', startTime: '16:15', endTime: '17:15' },
];

const ENGINEERING_PERIODS: Period[] = [
  { id: '1', startTime: '08:30', endTime: '09:30' },
  { id: '2', startTime: '09:30', endTime: '10:30' },
  { id: '3', startTime: '10:45', endTime: '11:45' },
  { id: '4', startTime: '11:45', endTime: '12:45' },
  { id: 'lunch', startTime: '12:45', endTime: '13:30', isBreak: true },
  { id: '5', startTime: '13:30', endTime: '14:30' },
  { id: '6', startTime: '14:30', endTime: '15:30' },
  { id: '7', startTime: '15:45', endTime: '16:45' },
  { id: '8', startTime: '16:45', endTime: '17:45' },
];

const PREDEFINED_TEMPLATES = [
  {
    id: 'school-template',
    name: 'School Template',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    periods: SCHOOL_PERIODS,
  },
  {
    id: 'college-template',
    name: 'College Template',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    periods: COLLEGE_PERIODS,
  },
  {
    id: 'engineering-template',
    name: 'Engineering Template',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    periods: ENGINEERING_PERIODS,
  },
];

interface TimetableState {
  templates: Template[];
  faculty: Faculty[];
  courses: Course[];
  generatedTimetables: GeneratedTimetable[];
  addTemplate: (template: Omit<Template, 'id'>) => void;
  deleteTemplate: (id: string) => void;
  usePresetTemplate: (templateId: string) => void;
  addFaculty: (faculty: Omit<Faculty, 'id'>) => void;
  deleteFaculty: (id: string) => void;
  addCourse: (course: Omit<Course, 'id'>) => void;
  deleteCourse: (id: string) => void;
  updateFacultyFreeSlots: (facultyId: string, day: string, periodId: string) => void;
  importTemplate: (file: File) => Promise<void>;
  exportTemplate: (templateId: string) => void;
  generateTimetable: (templateId: string) => void;
  updateTimetable: (timetableId: string, updatedSlot: TimeSlot) => void;
}

export const useTimetableStore = create<TimetableState>()(
  persist(
    (set, get) => ({
      templates: [...PREDEFINED_TEMPLATES],
      faculty: [],
      courses: [],
      generatedTimetables: [],

      addTemplate: (template) => {
        const newTemplate = {
          ...template,
          id: crypto.randomUUID(),
          periods: COLLEGE_PERIODS,
        };
        set((state) => ({ templates: [...state.templates, newTemplate] }));
      },

      deleteTemplate: (id) => {
        // Don't allow deletion of predefined templates
        if (['school-template', 'college-template', 'engineering-template'].includes(id)) {
          return;
        }
        
        set((state) => ({
          templates: state.templates.filter((t) => t.id !== id),
          // Remove associated timetables
          generatedTimetables: state.generatedTimetables.filter((t) => t.templateId !== id),
        }));
      },

      usePresetTemplate: (templateId) => {
        const preset = PREDEFINED_TEMPLATES.find((t) => t.id === templateId);
        if (!preset) return;
        
        const newTemplate = {
          ...preset,
          id: crypto.randomUUID(),
          name: `Custom ${preset.name}`,
        };
        set((state) => ({ templates: [...state.templates, newTemplate] }));
      },

      addFaculty: (faculty) => {
        const newFaculty = { ...faculty, id: crypto.randomUUID(), freeSlots: [] };
        set((state) => ({ faculty: [...state.faculty, newFaculty] }));
      },

      deleteFaculty: (id) => {
        set((state) => ({
          faculty: state.faculty.filter((f) => f.id !== id),
          courses: state.courses.filter((c) => c.facultyId !== id),
          generatedTimetables: state.generatedTimetables.map((timetable) => ({
            ...timetable,
            slots: timetable.slots.filter((slot) => slot.facultyId !== id),
          })),
        }));
      },

      addCourse: (course) => {
        const newCourse = { ...course, id: crypto.randomUUID() };
        set((state) => ({ courses: [...state.courses, newCourse] }));
      },

      deleteCourse: (id) => {
        set((state) => ({
          courses: state.courses.filter((c) => c.id !== id),
          generatedTimetables: state.generatedTimetables.map((timetable) => ({
            ...timetable,
            slots: timetable.slots.filter((slot) => slot.courseId !== id),
          })),
        }));
      },

      updateFacultyFreeSlots: (facultyId, day, periodId) => {
        set((state) => ({
          faculty: state.faculty.map((f) => {
            if (f.id !== facultyId) return f;
            const slotIndex = f.freeSlots.findIndex(
              (slot) => slot.day === day && slot.periodId === periodId
            );
            if (slotIndex === -1) {
              return {
                ...f,
                freeSlots: [...f.freeSlots, { day, periodId }],
              };
            }
            return {
              ...f,
              freeSlots: f.freeSlots.filter((_, i) => i !== slotIndex),
            };
          }),
        }));
      },

      importTemplate: async (file) => {
        try {
          const text = await file.text();
          const template = JSON.parse(text);
          set((state) => ({ templates: [...state.templates, { ...template, id: crypto.randomUUID() }] }));
        } catch (error) {
          console.error('Failed to import template:', error);
          throw new Error('Invalid template file');
        }
      },

      exportTemplate: (templateId) => {
        const template = get().templates.find((t) => t.id === templateId);
        if (!template) return;
        
        const blob = new Blob([JSON.stringify(template, null, 2)], {
          type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `template-${template.name.toLowerCase().replace(/\s+/g, '-')}.json`;
        a.click();
        URL.revokeObjectURL(url);
      },

      generateTimetable: (templateId) => {
        const state = get();
        const template = state.templates.find((t) => t.id === templateId);
        if (!template) return;

        const slots: TimeSlot[] = [];
        const coursesLeft = new Map(
          state.courses.map((course) => [course.id, course.hoursPerWeek])
        );

        template.workingDays.forEach((day) => {
          template.periods.forEach((period) => {
            if (period.isBreak) return;

            for (const course of state.courses) {
              const hoursLeft = coursesLeft.get(course.id) || 0;
              if (hoursLeft === 0) continue;

              const faculty = state.faculty.find((f) => f.id === course.facultyId);
              if (!faculty) continue;

              const isFacultyFree = faculty.freeSlots.some(
                (slot) => slot.day === day && slot.periodId === period.id
              );

              const facultyHoursToday = slots.filter(
                (slot) => slot.day === day && slot.facultyId === faculty.id
              ).length;

              if (isFacultyFree && facultyHoursToday < faculty.maxHoursPerDay) {
                const isSlotTaken = slots.some(
                  (slot) =>
                    slot.day === day &&
                    slot.periodId === period.id &&
                    (slot.facultyId === faculty.id || slot.courseId === course.id)
                );

                if (!isSlotTaken) {
                  slots.push({
                    day,
                    periodId: period.id,
                    courseId: course.id,
                    facultyId: faculty.id,
                  });
                  coursesLeft.set(course.id, hoursLeft - 1);
                }
              }
            }
          });
        });

        const newTimetable: GeneratedTimetable = {
          id: crypto.randomUUID(),
          templateId,
          slots,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          generatedTimetables: [...state.generatedTimetables, newTimetable],
        }));
      },

      updateTimetable: (timetableId, updatedSlot) => {
        set((state) => ({
          generatedTimetables: state.generatedTimetables.map((timetable) =>
            timetable.id === timetableId
              ? {
                  ...timetable,
                  slots: timetable.slots.map((slot) =>
                    slot.day === updatedSlot.day && slot.periodId === updatedSlot.periodId
                      ? updatedSlot
                      : slot
                  ),
                }
              : timetable
          ),
        }));
      },
    }),
    {
      name: 'timetable-storage',
    }
  )
);