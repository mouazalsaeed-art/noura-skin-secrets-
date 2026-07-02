import { Service, Appointment, Review, ClientProfile } from '@/types';

// Built-in demo data used when the backend API is unreachable,
// so the app is fully usable in standalone/preview mode.

export const demoServices: Service[] = [
  {
    id: '1',
    name: 'تنظيف البشرة العميق',
    description: 'تنظيف عميق للبشرة مع إزالة الرؤوس السوداء وتنقية المسام',
    price: 250,
    duration: 60,
    image: '',
    category: 'العناية بالبشرة',
  },
  {
    id: '2',
    name: 'جلسة هيدرافيشل',
    description: 'ترطيب وتغذية عميقة للبشرة بتقنية الهيدرافيشل المتطورة',
    price: 450,
    duration: 75,
    image: '',
    category: 'العناية بالبشرة',
    discount: 15,
  },
  {
    id: '3',
    name: 'تقشير كيميائي',
    description: 'تقشير كيميائي لطيف لتجديد خلايا البشرة وتوحيد اللون',
    price: 350,
    duration: 45,
    image: '',
    category: 'التقشير',
  },
  {
    id: '4',
    name: 'ميزوثيرابي للوجه',
    description: 'حقن فيتامينات ومغذيات لنضارة البشرة وإشراقها',
    price: 600,
    duration: 50,
    image: '',
    category: 'النضارة',
    discount: 10,
  },
  {
    id: '5',
    name: 'إزالة الشعر بالليزر',
    description: 'جلسة ليزر لإزالة الشعر بأحدث الأجهزة وأمان تام',
    price: 300,
    duration: 40,
    image: '',
    category: 'الليزر',
  },
  {
    id: '6',
    name: 'ماسك الذهب الفاخر',
    description: 'ماسك ذهب 24 قيراط لشد البشرة وإشراق فوري',
    price: 500,
    duration: 60,
    image: '',
    category: 'العناية الفاخرة',
    discount: 20,
  },
];

export const demoReviews: Review[] = [
  {
    id: 'r1',
    serviceId: '1',
    clientId: 'c1',
    clientName: 'سارة م.',
    rating: 5,
    comment: 'تجربة رائعة! بشرتي أصبحت أنظف وأنقى من أي وقت مضى',
    date: '2026-06-15',
    verified: true,
  },
  {
    id: 'r2',
    serviceId: '2',
    clientId: 'c2',
    clientName: 'نورة ع.',
    rating: 5,
    comment: 'الهيدرافيشل غيّر بشرتي تماماً، أنصح الجميع بالتجربة',
    date: '2026-06-20',
    verified: true,
  },
  {
    id: 'r3',
    serviceId: '6',
    clientId: 'c3',
    clientName: 'ريم خ.',
    rating: 4,
    comment: 'ماسك الذهب فخم جداً والنتيجة واضحة من أول جلسة',
    date: '2026-06-25',
    verified: false,
  },
];

export const demoProfile: ClientProfile = {
  id: 'c0',
  name: 'زائر',
  email: 'guest@nouraskin.com',
  phone: '',
  skinType: 'عادية',
  appointments: [],
  totalSpent: 0,
  joinDate: new Date().toISOString().slice(0, 10),
};

// In-memory storage for appointments/reviews created in demo mode
export const demoState = {
  appointments: [] as Appointment[],
  reviews: [...demoReviews],
  profile: { ...demoProfile },
  nextId: 1,
};

export function demoId(prefix: string): string {
  return `${prefix}-${Date.now()}-${demoState.nextId++}`;
}
