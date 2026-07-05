import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'customer' | 'vendor' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
}

interface AuthState {
  user: User | null;
  users: User[];
  login: (email: string, pass: string) => User | null;
  register: (name: string, email: string, pass: string, role: UserRole) => User | null;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      users: [
        // Dummy default users for easier testing
        { id: 'u1', name: 'Budi (Customer)', email: 'customer@demo.com', role: 'customer', password: 'password123' },
        { id: 'u2', name: 'Clarissa (Vendor)', email: 'vendor@demo.com', role: 'vendor', password: 'password123' }
      ],
      login: (email, pass) => {
        const found = get().users.find(u => u.email === email && u.password === pass);
        if (found) {
          set({ user: found });
          return found;
        }
        return null;
      },
      register: (name, email, pass, role) => {
        const existing = get().users.find(u => u.email === email);
        if (existing) return null; // Email already taken

        const newUser: User = {
          id: `u-${Date.now()}`,
          name,
          email,
          password: pass,
          role
        };

        set((state) => ({
          users: [...state.users, newUser],
          user: newUser
        }));

        return newUser;
      },
      logout: () => set({ user: null })
    }),
    {
      name: 'persona-auth-storage',
    }
  )
);
