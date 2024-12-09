import React from 'react';
import { useTimetableStore } from '../../store/timetableStore';
import { Plus, Clock, Trash2 } from 'lucide-react';
import clsx from 'clsx';

export function Faculty() {
  const faculty = useTimetableStore((state) => state.faculty);
  const templates = useTimetableStore((state) => state.templates);
  const addFaculty = useTimetableStore((state) => state.addFaculty);
  const deleteFaculty = useTimetableStore((state) => state.deleteFaculty);
  const updateFreeSlots = useTimetableStore((state) => state.updateFacultyFreeSlots);

  const [isCreating, setIsCreating] = React.useState(false);
  const [selectedFaculty, setSelectedFaculty] = React.useState<string | null>(null);
  const [name, setName] = React.useState('');
  const [department, setDepartment] = React.useState('');
  const [maxHoursPerDay, setMaxHoursPerDay] = React.useState(4);
  const [deleteConfirm, setDeleteConfirm] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const activeTemplate = templates[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      addFaculty({ name, department, maxHoursPerDay, freeSlots: [] });
      setIsCreating(false);
      setName('');
      setDepartment('');
      setMaxHoursPerDay(4);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add faculty');
    }
  };

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      try {
        deleteFaculty(id);
        setDeleteConfirm(null);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete faculty');
      }
    } else {
      setDeleteConfirm(id);
    }
  };

  const handleSlotToggle = (facultyId: string, day: string, periodId: string) => {
    try {
      updateFreeSlots(facultyId, day, periodId);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update free slots');
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
        <h2 className="text-lg font-medium text-gray-900">Faculty Management</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Faculty
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <input
              type="text"
              required
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Max Hours Per Day</label>
            <input
              type="number"
              required
              min="1"
              max="8"
              value={maxHoursPerDay}
              onChange={(e) => setMaxHoursPerDay(parseInt(e.target.value))}
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
              Add Faculty
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-6">
        {faculty.map((f) => (
          <div key={f.id} className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{f.name}</h3>
                <p className="text-sm text-gray-500">{f.department}</p>
                <p className="text-sm text-gray-500">Max {f.maxHoursPerDay} hours per day</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedFaculty(selectedFaculty === f.id ? null : f.id)}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Set Free Slots
                </button>
                <button
                  onClick={() => handleDelete(f.id)}
                  className={clsx(
                    "inline-flex items-center px-3 py-1 border shadow-sm text-sm font-medium rounded-md",
                    deleteConfirm === f.id
                      ? "border-red-300 text-red-700 bg-red-50 hover:bg-red-100"
                      : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                  )}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {deleteConfirm === f.id ? 'Confirm Delete' : 'Delete'}
                </button>
              </div>
            </div>

            {selectedFaculty === f.id && activeTemplate && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Free Slots</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Day
                        </th>
                        {activeTemplate.periods.map((period) => (
                          <th
                            key={period.id}
                            className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                          >
                            {period.startTime}-{period.endTime}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {activeTemplate.workingDays.map((day) => (
                        <tr key={day}>
                          <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                            {day}
                          </td>
                          {activeTemplate.periods.map((period) => {
                            const isSelected = f.freeSlots.some(
                              (slot) => slot.day === day && slot.periodId === period.id
                            );
                            return (
                              <td
                                key={period.id}
                                className="px-3 py-2 whitespace-nowrap text-sm text-gray-500"
                              >
                                <button
                                  onClick={() => handleSlotToggle(f.id, day, period.id)}
                                  className={clsx(
                                    "w-6 h-6 rounded-full",
                                    isSelected
                                      ? "bg-blue-600 hover:bg-blue-700"
                                      : "bg-gray-200 hover:bg-gray-300"
                                  )}
                                >
                                  <span className="sr-only">
                                    {isSelected ? 'Remove slot' : 'Add slot'}
                                  </span>
                                </button>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}