import client from './client';
import { Service, Appointment, Review, ClientProfile } from '@/types';

export const servicesAPI = {
  getAll: async (): Promise<Service[]> => {
    const { data } = await client.get('/services');
    return data;
  },

  getById: async (id: string): Promise<Service> => {
    const { data } = await client.get(`/services/${id}`);
    return data;
  },

  search: async (query: string): Promise<Service[]> => {
    const { data } = await client.get('/services/search', { params: { q: query } });
    return data;
  },
};

export const appointmentsAPI = {
  getAll: async (): Promise<Appointment[]> => {
    const { data } = await client.get('/appointments');
    return data;
  },

  create: async (appointment: Omit<Appointment, 'id'>): Promise<Appointment> => {
    const { data } = await client.post('/appointments', appointment);
    return data;
  },

  update: async (id: string, updates: Partial<Appointment>): Promise<Appointment> => {
    const { data } = await client.patch(`/appointments/${id}`, updates);
    return data;
  },

  cancel: async (id: string): Promise<void> => {
    await client.delete(`/appointments/${id}`);
  },
};

export const reviewsAPI = {
  getByService: async (serviceId: string): Promise<Review[]> => {
    const { data } = await client.get(`/services/${serviceId}/reviews`);
    return data;
  },

  create: async (review: Omit<Review, 'id' | 'date'>): Promise<Review> => {
    const { data } = await client.post('/reviews', review);
    return data;
  },
};

export const clientAPI = {
  getProfile: async (): Promise<ClientProfile> => {
    const { data } = await client.get('/client/profile');
    return data;
  },

  updateProfile: async (updates: Partial<ClientProfile>): Promise<ClientProfile> => {
    const { data } = await client.patch('/client/profile', updates);
    return data;
  },

  uploadProfilePicture: async (imageUri: string): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'profile.jpg',
    } as any);

    const { data } = await client.post('/client/profile-picture', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
};

export const paymentAPI = {
  createPaymentIntent: async (appointmentId: string): Promise<{ clientSecret: string }> => {
    const { data } = await client.post('/payments/intent', { appointmentId });
    return data;
  },

  confirmPayment: async (paymentIntentId: string): Promise<{ success: boolean }> => {
    const { data } = await client.post(`/payments/${paymentIntentId}/confirm`);
    return data;
  },
};
