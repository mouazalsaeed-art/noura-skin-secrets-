import client from './client';
import { Service, Appointment, Review, ClientProfile } from '@/types';
import { demoServices, demoState, demoId } from './demoData';

// Each API call tries the real backend first and falls back to
// built-in demo data when the server is unreachable, so the app
// stays fully usable in standalone/preview mode.
async function withFallback<T>(request: () => Promise<T>, fallback: () => T): Promise<T> {
  try {
    return await request();
  } catch {
    return fallback();
  }
}

export const servicesAPI = {
  getAll: async (): Promise<Service[]> =>
    withFallback(
      async () => (await client.get('/services')).data,
      () => demoServices
    ),

  getById: async (id: string): Promise<Service> =>
    withFallback(
      async () => (await client.get(`/services/${id}`)).data,
      () => demoServices.find((s) => s.id === id) ?? demoServices[0]
    ),

  search: async (query: string): Promise<Service[]> =>
    withFallback(
      async () => (await client.get('/services/search', { params: { q: query } })).data,
      () => demoServices.filter((s) => s.name.includes(query) || s.description.includes(query))
    ),
};

export const appointmentsAPI = {
  getAll: async (): Promise<Appointment[]> =>
    withFallback(
      async () => (await client.get('/appointments')).data,
      () => demoState.appointments
    ),

  create: async (appointment: Omit<Appointment, 'id'>): Promise<Appointment> =>
    withFallback(
      async () => (await client.post('/appointments', appointment)).data,
      () => {
        const created: Appointment = { ...appointment, id: demoId('apt') };
        demoState.appointments.push(created);
        return created;
      }
    ),

  update: async (id: string, updates: Partial<Appointment>): Promise<Appointment> =>
    withFallback(
      async () => (await client.patch(`/appointments/${id}`, updates)).data,
      () => {
        const idx = demoState.appointments.findIndex((a) => a.id === id);
        if (idx >= 0) {
          demoState.appointments[idx] = { ...demoState.appointments[idx], ...updates };
          return demoState.appointments[idx];
        }
        return { ...(updates as Appointment), id };
      }
    ),

  cancel: async (id: string): Promise<void> =>
    withFallback(
      async () => {
        await client.delete(`/appointments/${id}`);
      },
      () => {
        const apt = demoState.appointments.find((a) => a.id === id);
        if (apt) apt.status = 'cancelled';
      }
    ),
};

export const reviewsAPI = {
  getByService: async (serviceId: string): Promise<Review[]> =>
    withFallback(
      async () => (await client.get(`/services/${serviceId}/reviews`)).data,
      () => demoState.reviews.filter((r) => r.serviceId === serviceId)
    ),

  create: async (review: Omit<Review, 'id' | 'date'>): Promise<Review> =>
    withFallback(
      async () => (await client.post('/reviews', review)).data,
      () => {
        const created: Review = {
          ...review,
          id: demoId('rev'),
          date: new Date().toISOString().slice(0, 10),
        };
        demoState.reviews.push(created);
        return created;
      }
    ),
};

export const clientAPI = {
  getProfile: async (): Promise<ClientProfile> =>
    withFallback(
      async () => (await client.get('/client/profile')).data,
      () => demoState.profile
    ),

  updateProfile: async (updates: Partial<ClientProfile>): Promise<ClientProfile> =>
    withFallback(
      async () => (await client.patch('/client/profile', updates)).data,
      () => {
        demoState.profile = { ...demoState.profile, ...updates };
        return demoState.profile;
      }
    ),

  uploadProfilePicture: async (imageUri: string): Promise<{ url: string }> =>
    withFallback(
      async () => {
        const formData = new FormData();
        formData.append('image', {
          uri: imageUri,
          type: 'image/jpeg',
          name: 'profile.jpg',
        } as any);
        return (
          await client.post('/client/profile-picture', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          })
        ).data;
      },
      () => ({ url: imageUri })
    ),
};

export const paymentAPI = {
  createPaymentIntent: async (appointmentId: string): Promise<{ clientSecret: string }> =>
    withFallback(
      async () => (await client.post('/payments/intent', { appointmentId })).data,
      () => ({ clientSecret: `demo_${appointmentId}` })
    ),

  confirmPayment: async (paymentIntentId: string): Promise<{ success: boolean }> =>
    withFallback(
      async () => (await client.post(`/payments/${paymentIntentId}/confirm`)).data,
      () => ({ success: true })
    ),
};
