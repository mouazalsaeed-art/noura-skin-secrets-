export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  category: string;
  discount?: number;
}

export interface Offer {
  id: string;
  name: string;
  description: string;
  discount: number;
  services: string[];
  expiryDate: string;
  image: string;
}

export interface Appointment {
  id: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  notes?: string;
  price: number;
}

export interface ClientProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  skinType?: string;
  allergies?: string;
  appointments: Appointment[];
  totalSpent: number;
  joinDate: string;
  image?: string;
}

export interface Review {
  id: string;
  serviceId: string;
  clientId: string;
  clientName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'apple_pay' | 'google_pay';
  last4?: string;
  cardBrand?: string;
}
