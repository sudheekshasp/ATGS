import React from 'react';
import { useTimetableStore } from '../../store/timetableStore';
import { Plus, Trash2 } from 'lucide-react';
import clsx from 'clsx';

export function Courses() {
  const courses = useTimetableStore((state) => state.courses);
  const faculty = useTimetableStore((state) => state.faculty);
  const addCourse = useTimetableStore((state) => state.addCourse);
  const deleteCourse = useTimetableStore((state) => state.deleteCourse);

  const [isCreating, setIsCreating] = React.useState(false);
  const [name, setName] = React.useState('');
  const [facultyId, setFacultyId] = React.useState('');
  const [hoursPerWeek, setHoursPerWeek] = React.useState(3);
  const [deleteConfirm, setDeleteConfirm] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      addCourse({ name, facultyId, hoursPerWeek });
      setIsCreating(false);
      setName('');
      setFacultyId('');
      setHoursPerWeek(3);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add course');
    }
  };

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      try {
        deleteCourse(id);
        setDeleteConfirm(null);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete course');
      }
    } else {
      setDeleteConfirm(id);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Course Management</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Course
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Course Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Faculty</label>
            <select
              required
              value={facultyId}
              onChange={(e) => setFacultyId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select Faculty</option>
              {faculty.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} - {f.department}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Hours Per Week</label>
            <input
              type="number"
              required
              min="1"
              max="8"
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(parseInt(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setError(null);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              Add Course
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => {
          const assignedFaculty = faculty.find((f) => f.id === course.facultyId);
          return (
            <div key={course.id} className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{course.name}</h3>
                  <p className="text-sm text-gray-500">
                    Faculty: {assignedFaculty?.name || 'Not assigned'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Hours per Week: {course.hoursPerWeek}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(course.id)}
                  className={clsx(
                    "inline-flex items-center px-3 py-1 border shadow-sm text-sm font-medium rounded-md",
                    deleteConfirm === course.id
                      ? "border-red-300 text-red-700 bg-red-50 hover:bg-red-100"
                      : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                  )}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {deleteConfirm === course.id ? 'Confirm Delete' : 'Delete'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}