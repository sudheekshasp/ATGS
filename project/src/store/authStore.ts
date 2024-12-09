import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  users: User[];
  login: (email: string, password: string) => Promise<void>;
  register: (user: Omit<User, 'id'>, password: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
}

interface StoredUser extends User {
  password: string;
}

const validatePassword = (password: string): boolean => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return (
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumbers &&
    hasSpecialChar
  );
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      users: [],
      login: async (email, password) => {
        const state = get();
        const storedUser = state.users.find((u) => u.email === email) as StoredUser | undefined;
        
        if (!storedUser) {
          throw new Error('No account found with this email');
        }
        
        if (storedUser.password !== password) {
          throw new Error('Invalid password');
        }
        
        const { password: _, ...user } = storedUser;
        set({ user });
      },
      register: async (userData, password) => {
        if (!validatePassword(password)) {
          throw new Error(
            'Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters'
          );
        }

        const state = get();
        if (state.users.some((u) => u.email === userData.email)) {
          throw new Error('An account with this email already exists');
        }

        const newUser = {
          ...userData,
          id: crypto.randomUUID(),
          password,
        };

        set((state) => ({
          users: [...state.users, newUser],
          user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, department: newUser.department },
        }));
      },
      logout: () => set({ user: null }),
      resetPassword: async (email) => {
        const state = get();
        const user = state.users.find((u) => u.email === email);
        
        if (!user) {
          throw new Error('No account found with this email');
        }

        // In a real application, this would send an email with a reset link
        // For demo purposes, we'll just generate a new random password
        const newPassword = crypto.randomUUID().slice(0, 8);
        
        set((state) => ({
          users: state.users.map((u) =>
            u.email === email ? { ...u, password: newPassword } : u
          ),
        }));

        // In a real application, send this password via email
        console.log(`New password for ${email}: ${newPassword}`);
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        users: state.users.map(user => ({
          ...user,
          password: (user as StoredUser).password,
        })),
      }),
    }
  )
);