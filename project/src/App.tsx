import React from 'react';
import { AuthTabs } from './components/Auth/AuthTabs';
import { Dashboard } from './components/Dashboard/Dashboard';
import { useAuthStore } from './store/authStore';

function App() {
  const user = useAuthStore((state) => state.user);

  return user ? <Dashboard /> : <AuthTabs />;
}

export default App;