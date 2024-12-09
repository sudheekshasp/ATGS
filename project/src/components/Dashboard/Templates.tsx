import React from 'react';
import { useTimetableStore } from '../../store/timetableStore';
import { Plus, Download, Upload, Calendar, Copy, Trash2 } from 'lucide-react';
import clsx from 'clsx';

export function Templates() {
  const templates = useTimetableStore((state) => state.templates);
  const addTemplate = useTimetableStore((state) => state.addTemplate);
  const deleteTemplate = useTimetableStore((state) => state.deleteTemplate);
  const usePresetTemplate = useTimetableStore((state) => state.usePresetTemplate);
  const importTemplate = useTimetableStore((state) => state.importTemplate);
  const exportTemplate = useTimetableStore((state) => state.exportTemplate);
  const generateTimetable = useTimetableStore((state) => state.generateTimetable);

  const [isCreating, setIsCreating] = React.useState(false);
  const [name, setName] = React.useState('');
  const [workingDays, setWorkingDays] = React.useState(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
  const [deleteConfirm, setDeleteConfirm] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (workingDays.length === 0) {
      setError('Please select at least one working day');
      return;
    }
    addTemplate({ name, workingDays, periods: [] });
    setIsCreating(false);
    setName('');
    setError(null);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await importTemplate(file);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to import template');
      }
    }
  };

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      deleteTemplate(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
    }
  };

  const presetTemplates = templates.filter(t => ['school-template', 'college-template', 'engineering-template'].includes(t.id));
  const customTemplates = templates.filter(t => !['school-template', 'college-template', 'engineering-template'].includes(t.id));

  return (
    <div className="space-y-8">
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Preset Templates</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {presetTemplates.map((template) => (
            <div key={template.id} className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
                <button
                  onClick={() => usePresetTemplate(template.id)}
                  className="p-2 text-gray-400 hover:text-gray-500"
                  title="Use Template"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  {template.workingDays.length} working days
                </p>
                <p className="text-sm text-gray-500">
                  {template.periods.filter(p => !p.isBreak).length} periods per day
                </p>
                <p className="text-sm text-gray-500">
                  Includes lunch break
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Custom Templates</h2>
          <div className="flex gap-2">
            <label className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
              <Upload className="w-4 h-4 mr-2" />
              Import
              <input type="file" className="hidden" onChange={handleImport} accept=".json" />
            </label>
            <button
              onClick={() => setIsCreating(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Template
            </button>
          </div>
        </div>

        {isCreating && (
          <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Template Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Working Days</label>
              <div className="mt-2 space-y-2">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                  <label key={day} className="inline-flex items-center mr-4">
                    <input
                      type="checkbox"
                      checked={workingDays.includes(day)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setWorkingDays([...workingDays, day]);
                        } else {
                          setWorkingDays(workingDays.filter((d) => d !== day));
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{day}</span>
                  </label>
                ))}
              </div>
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
                Create
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {customTemplates.map((template) => (
            <div key={template.id} className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => exportTemplate(template.id)}
                    className="p-2 text-gray-400 hover:text-gray-500"
                    title="Export Template"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => generateTimetable(template.id)}
                    className="p-2 text-gray-400 hover:text-gray-500"
                    title="Generate Timetable"
                  >
                    <Calendar className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(template.id)}
                    className={clsx(
                      "p-2",
                      deleteConfirm === template.id
                        ? "text-red-600 hover:text-red-700"
                        : "text-gray-400 hover:text-gray-500"
                    )}
                    title={deleteConfirm === template.id ? "Confirm Delete" : "Delete Template"}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  {template.workingDays.length} working days
                </p>
                <p className="text-sm text-gray-500">
                  {template.periods.filter(p => !p.isBreak).length} periods per day
                </p>
                {template.periods.some(p => p.isBreak) && (
                  <p className="text-sm text-gray-500">
                    Includes lunch break
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}