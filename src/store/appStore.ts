import { create } from 'zustand';
import { Service, Appointment, ClientProfile, Review, PaymentMethod } from '@/types';
import { demoProfile } from '@/api/demoData';

interface AppState {
  // User
  currentUser: ClientProfile | null;
  isLoggedIn: boolean;
  setCurrentUser: (user: ClientProfile) => void;
  logout: () => void;

  // Services
  services: Service[];
  setServices: (services: Service[]) => void;
  getServiceById: (id: string) => Service | undefined;

  // Appointments
  appointments: Appointment[];
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => void;
  cancelAppointment: (id: string) => void;
  setAppointments: (appointments: Appointment[]) => void;

  // Reviews
  reviews: Review[];
  addReview: (review: Review) => void;
  setReviews: (reviews: Review[]) => void;

  // Payment
  paymentMethods: PaymentMethod[];
  addPaymentMethod: (method: PaymentMethod) => void;
  removePaymentMethod: (id: string) => void;

  // UI
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // User — starts as a guest session so all tabs are usable right away
  currentUser: demoProfile,
  isLoggedIn: true,
  setCurrentUser: (user) => set({ currentUser: user, isLoggedIn: true }),
  logout: () => set({ currentUser: null, isLoggedIn: false }),

  // Services
  services: [],
  setServices: (services) => set({ services }),
  getServiceById: (id) => get().services.find(s => s.id === id),

  // Appointments
  appointments: [],
  addAppointment: (appointment) =>
    set((state) => ({ appointments: [...state.appointments, appointment] })),
  updateAppointment: (id, updates) =>
    set((state) => ({
      appointments: state.appointments.map((apt) =>
        apt.id === id ? { ...apt, ...updates } : apt
      ),
    })),
  cancelAppointment: (id) =>
    set((state) => ({
      appointments: state.appointments.map((apt) =>
        apt.id === id ? { ...apt, status: 'cancelled' } : apt
      ),
    })),
  setAppointments: (appointments) => set({ appointments }),

  // Reviews
  reviews: [],
  addReview: (review) =>
    set((state) => ({ reviews: [...state.reviews, review] })),
  setReviews: (reviews) => set({ reviews }),

  // Payment
  paymentMethods: [],
  addPaymentMethod: (method) =>
    set((state) => ({ paymentMethods: [...state.paymentMethods, method] })),
  removePaymentMethod: (id) =>
    set((state) => ({
      paymentMethods: state.paymentMethods.filter((m) => m.id !== id),
    })),

  // UI
  loading: false,
  setLoading: (loading) => set({ loading }),
  error: null,
  setError: (error) => set({ error }),
}));
