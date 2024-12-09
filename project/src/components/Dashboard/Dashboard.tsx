import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { useTimetableStore } from '../../store/timetableStore';
import { Templates } from './Templates';
import { Faculty } from './Faculty';
import { Settings } from './Settings';
import { Courses } from './Courses';
import { GeneratedTimetable } from './GeneratedTimetable';
import { LogOut } from 'lucide-react';

export function Dashboard() {
  const [activeTab, setActiveTab] = React.useState<'templates' | 'faculty' | 'courses' | 'settings'>('templates');
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const generatedTimetables = useTimetableStore((state) => state.generatedTimetables);
  const latestTimetable = generatedTimetables[generatedTimetables.length - 1];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Timetable Generator</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.name}</span>
            <button
              onClick={logout}
              className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="border-b border-gray-200">
          <div className="flex space-x-8">
            {['templates', 'faculty', 'courses', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as typeof activeTab)}
                className={`py-2 px-1 border-b-2 text-sm font-medium ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'templates' && (
          <div className="space-y-8">
            <Templates />
            {latestTimetable && <GeneratedTimetable timetableId={latestTimetable.id} />}
          </div>
        )}
        {activeTab === 'faculty' && <Faculty />}
        {activeTab === 'courses' && <Courses />}
        {activeTab === 'settings' && <Settings />}
      </main>
    </div>
  );
}