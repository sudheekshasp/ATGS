import React from 'react';
import { Clock } from 'lucide-react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

export function AuthTabs() {
  const [activeTab, setActiveTab] = React.useState<'login' | 'register'>('login');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Clock className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">Timetable Generator</h1>
        </div>

        <div className="flex mb-6">
          <button
            className={`flex-1 py-2 text-center transition-colors ${
              activeTab === 'login'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('login')}
          >
            Sign In
          </button>
          <button
            className={`flex-1 py-2 text-center transition-colors ${
              activeTab === 'register'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('register')}
          >
            Sign Up
          </button>
        </div>

        {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
}