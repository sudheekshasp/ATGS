import React from 'react';

export function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900">Settings</h2>
        <p className="mt-1 text-sm text-gray-500">
          Configure your timetable generation preferences.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-sm font-medium text-gray-900">Department Information</h3>
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Department Name</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}