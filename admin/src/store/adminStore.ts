import { create } from 'zustand';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AdminState {
  user: AdminUser | null;
  token: string | null;
  isLoggedIn: boolean;
  setUser: (user: AdminUser) => void;
  setToken: (token: string) => void;
  logout: () => void;
  loadFromLocalStorage: () => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  user: null,
  token: null,
  isLoggedIn: false,

  setUser: (user) => {
    set({ user, isLoggedIn: true });
  },

  setToken: (token) => {
    set({ token });
    localStorage.setItem('adminToken', token);
  },

  logout: () => {
    set({ user: null, token: null, isLoggedIn: false });
    localStorage.removeItem('adminToken');
  },

  loadFromLocalStorage: () => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      set({ token, isLoggedIn: true });
    }
  },
}));
