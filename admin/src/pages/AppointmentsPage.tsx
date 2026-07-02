import { useEffect, useState } from 'react';
import { FiCheck, FiX, FiEye } from 'react-icons/fi';
import toast from 'react-hot-toast';
import client from '@/api/client';

interface Appointment {
  _id: string;
  serviceName: string;
  date: string;
  time: string;
  status: string;
  price: number;
  notes?: string;
  userId?: { name: string };
}

export function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const { data } = await client.get('/api/appointments');
      setAppointments(data);
    } catch (error) {
      toast.error('فشل تحميل المواعيد');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (id: string) => {
    try {
      await client.patch(`/api/appointments/${id}/confirm`);
      toast.success('تم تأكيد الموعد');
      loadAppointments();
    } catch (error) {
      toast.error('فشل التأكيد');
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await client.patch(`/api/appointments/${id}/complete`);
      toast.success('تم إكمال الموعد');
      loadAppointments();
    } catch (error) {
      toast.error('فشل الإكمال');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      pending: 'قيد الانتظار',
      confirmed: 'مؤكد',
      completed: 'مكتمل',
      cancelled: 'ملغى',
    };
    return labels[status] || status;
  };

  const filteredAppointments = appointments.filter((apt) => {
    if (filter === 'all') return true;
    return apt.status === filter;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-dark">المواعيد</h1>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg transition ${
                filter === status
                  ? 'bg-primary text-white'
                  : 'bg-white border border-gray-300'
              }`}
            >
              {status === 'all'
                ? 'الكل'
                : status === 'pending'
                ? 'قيد الانتظار'
                : status === 'confirmed'
                ? 'مؤكدة'
                : status === 'completed'
                ? 'مكتملة'
                : 'ملغاة'}
            </button>
          )
        )}
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-8">جاري التحميل...</div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="table-header">الخدمة</th>
                <th className="table-header">التاريخ والوقت</th>
                <th className="table-header">الحالة</th>
                <th className="table-header">السعر</th>
                <th className="table-header">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((apt) => (
                <tr key={apt._id} className="hover:bg-gray-50">
                  <td className="table-cell font-semibold">{apt.serviceName}</td>
                  <td className="table-cell">
                    {apt.date} - {apt.time}
                  </td>
                  <td className="table-cell">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                        apt.status
                      )}`}
                    >
                      {getStatusLabel(apt.status)}
                    </span>
                  </td>
                  <td className="table-cell">${apt.price}</td>
                  <td className="table-cell">
                    <div className="flex gap-2">
                      {apt.status === 'pending' && (
                        <button
                          onClick={() => handleConfirm(apt._id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded"
                          title="تأكيد"
                        >
                          <FiCheck />
                        </button>
                      )}
                      {apt.status === 'confirmed' && (
                        <button
                          onClick={() => handleComplete(apt._id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          title="إكمال"
                        >
                          <FiCheck />
                        </button>
                      )}
                      <button
                        onClick={() =>
                          toast.success(apt.notes || 'لا توجد ملاحظات')
                        }
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded"
                        title="عرض الملاحظات"
                      >
                        <FiEye />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
