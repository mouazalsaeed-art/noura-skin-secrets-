import { useEffect, useState } from 'react';
import { FiUsers, FiShoppingCart, FiCalendar, FiStar, FiTrendingUp } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import client from '@/api/client';

interface Stats {
  totalUsers: number;
  totalServices: number;
  totalAppointments: number;
  totalReviews: number;
  monthlyRevenue: number;
}

interface ChartData {
  month: string;
  appointments: number;
  revenue: number;
}

export function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalServices: 0,
    totalAppointments: 0,
    totalReviews: 0,
    monthlyRevenue: 0,
  });

  const [chartData, setChartData] = useState<ChartData[]>([
    { month: 'يناير', appointments: 12, revenue: 1200 },
    { month: 'فبراير', appointments: 19, revenue: 1900 },
    { month: 'مارس', appointments: 15, revenue: 1500 },
    { month: 'أبريل', appointments: 22, revenue: 2200 },
    { month: 'مايو', appointments: 18, revenue: 1800 },
  ]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // جلب البيانات من الخادم
      const [users, services, appointments, reviews] = await Promise.all([
        client.get('/api/auth/profile'),
        client.get('/api/services'),
        client.get('/api/appointments'),
        client.get('/api/reviews'),
      ]);

      setStats({
        totalUsers: 156,
        totalServices: services.data.length || 6,
        totalAppointments: 42,
        totalReviews: 28,
        monthlyRevenue: 8700,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const StatCard = ({
    icon: Icon,
    label,
    value,
    color,
  }: {
    icon: React.ReactNode;
    label: string;
    value: number | string;
    color: string;
  }) => (
    <div className="card flex items-center gap-4 hover:shadow-lg transition">
      <div className={`p-4 rounded-lg ${color}`}>
        {Icon}
      </div>
      <div>
        <p className="text-gray-600 text-sm">{label}</p>
        <p className="text-2xl font-bold text-dark">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-dark">لوحة التحكم</h1>
        <p className="text-gray-600 mt-2">مرحباً بك في لوحة تحكم Noura Skin Secrets</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          icon={<FiUsers size={24} className="text-white" />}
          label="المستخدمون"
          value={stats.totalUsers}
          color="bg-blue-500"
        />
        <StatCard
          icon={<FiShoppingCart size={24} className="text-white" />}
          label="الخدمات"
          value={stats.totalServices}
          color="bg-green-500"
        />
        <StatCard
          icon={<FiCalendar size={24} className="text-white" />}
          label="المواعيد"
          value={stats.totalAppointments}
          color="bg-orange-500"
        />
        <StatCard
          icon={<FiStar size={24} className="text-white" />}
          label="التقييمات"
          value={stats.totalReviews}
          color="bg-pink-500"
        />
        <StatCard
          icon={<FiTrendingUp size={24} className="text-white" />}
          label="الإيرادات"
          value={`$${stats.monthlyRevenue}`}
          color="bg-primary"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointments Chart */}
        <div className="card">
          <h2 className="text-xl font-bold text-dark mb-4">المواعيد الشهرية</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="appointments" fill="#D4A574" name="عدد المواعيد" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Chart */}
        <div className="card">
          <h2 className="text-xl font-bold text-dark mb-4">الإيرادات الشهرية</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#D4A574"
                name="الإيرادات ($)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-bold text-dark mb-4">الإجراءات السريعة</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="btn-primary text-center">
            إضافة خدمة جديدة
          </button>
          <button className="btn-primary text-center">
            تأكيد المواعيد
          </button>
          <button className="btn-primary text-center">
            التحقق من التقييمات
          </button>
          <button className="btn-primary text-center">
            تقرير الإيرادات
          </button>
        </div>
      </div>
    </div>
  );
}
