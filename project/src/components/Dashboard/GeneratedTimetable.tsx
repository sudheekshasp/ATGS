import React from 'react';
import { useTimetableStore } from '../../store/timetableStore';
import { Edit2, Save, X, Download } from 'lucide-react';
import type { TimeSlot } from '../../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Props {
  timetableId: string;
}

export function GeneratedTimetable({ timetableId }: Props) {
  const timetable = useTimetableStore((state) => 
    state.generatedTimetables.find((t) => t.id === timetableId)
  );
  const template = useTimetableStore((state) => 
    state.templates.find((t) => t.id === timetable?.templateId)
  );
  const courses = useTimetableStore((state) => state.courses);
  const faculty = useTimetableStore((state) => state.faculty);
  const updateTimetable = useTimetableStore((state) => state.updateTimetable);

  const [editingSlot, setEditingSlot] = React.useState<TimeSlot | null>(null);
  const [selectedCourseId, setSelectedCourseId] = React.useState<string>('');

  if (!timetable || !template) return null;

  const handleEdit = (slot: TimeSlot) => {
    setEditingSlot(slot);
    setSelectedCourseId(slot.courseId);
  };

  const handleSave = () => {
    if (!editingSlot || !selectedCourseId) return;

    const course = courses.find((c) => c.id === selectedCourseId);
    if (!course) return;

    const updatedSlot: TimeSlot = {
      ...editingSlot,
      courseId: selectedCourseId,
      facultyId: course.facultyId,
    };

    updateTimetable(timetableId, updatedSlot);
    setEditingSlot(null);
    setSelectedCourseId('');
  };

  const downloadTimetable = () => {
    const pdf = new jsPDF();
    
    // Add title
    pdf.setFontSize(16);
    pdf.text(`Timetable - ${template.name}`, 14, 15);
    pdf.setFontSize(10);
    pdf.text(`Generated on: ${new Date(timetable.createdAt).toLocaleDateString()}`, 14, 22);

    // Prepare table data
    const headers = [
      'Day/Time',
      ...template.periods.map(p => `${p.startTime}-${p.endTime}`),
    ];

    const data = template.workingDays.map(day => {
      const row = [day];
      template.periods.forEach(period => {
        const slot = timetable.slots.find(
          s => s.day === day && s.periodId === period.id
        );
        if (slot) {
          const course = courses.find(c => c.id === slot.courseId);
          const facultyMember = faculty.find(f => f.id === slot.facultyId);
          row.push(`${course?.name}\n${facultyMember?.name}`);
        } else {
          row.push('-');
        }
      });
      return row;
    });

    // Generate table
    autoTable(pdf, {
      head: [headers],
      body: data,
      startY: 30,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [66, 139, 202] },
      columnStyles: { 0: { fontStyle: 'bold' } },
      theme: 'grid',
    });

    // Save PDF
    pdf.save(`timetable-${template.name.toLowerCase().replace(/\s+/g, '-')}.pdf`);
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            Generated Timetable - {template.name}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Created on {new Date(timetable.createdAt).toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={downloadTimetable}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Day/Time
              </th>
              {template.periods.map((period) => (
                <th
                  key={period.id}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {period.startTime}-{period.endTime}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {template.workingDays.map((day) => (
              <tr key={day}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {day}
                </td>
                {template.periods.map((period) => {
                  const slot = timetable.slots.find(
                    (s) => s.day === day && s.periodId === period.id
                  );
                  const course = courses.find((c) => c.id === slot?.courseId);
                  const facultyMember = faculty.find((f) => f.id === slot?.facultyId);
                  const isEditing = editingSlot && 
                    editingSlot.day === day && 
                    editingSlot.periodId === period.id;

                  return (
                    <td
                      key={period.id}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {slot ? (
                        <div className="flex items-center justify-between gap-2">
                          {isEditing ? (
                            <div className="flex items-center gap-2">
                              <select
                                value={selectedCourseId}
                                onChange={(e) => setSelectedCourseId(e.target.value)}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                              >
                                <option value="">Select Course</option>
                                {courses.map((c) => (
                                  <option key={c.id} value={c.id}>
                                    {c.name}
                                  </option>
                                ))}
                              </select>
                              <button
                                onClick={handleSave}
                                className="p-1 text-green-600 hover:text-green-700"
                              >
                                <Save className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setEditingSlot(null)}
                                className="p-1 text-red-600 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <>
                              <div>
                                <div className="font-medium">{course?.name}</div>
                                <div className="text-xs text-gray-400">
                                  {facultyMember?.name}
                                </div>
                              </div>
                              <button
                                onClick={() => handleEdit(slot)}
                                className="p-1 text-gray-400 hover:text-gray-600"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      ) : (
                        '-'
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}