import { useEffect, useState } from 'react';
import { FiTrash2, FiEye } from 'react-icons/fi';
import toast from 'react-hot-toast';
import client from '@/api/client';

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  totalSpent: number;
  createdAt: string;
  role: string;
}

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      // جلب بيانات تجريبية
      setUsers([
        {
          _id: '1',
          name: 'فاطمة أحمد',
          email: 'fatima@example.com',
          phone: '+966501234567',
          totalSpent: 450,
          createdAt: '2026-01-15',
          role: 'client',
        },
        {
          _id: '2',
          name: 'سارة محمد',
          email: 'sarah@example.com',
          phone: '+966501234568',
          totalSpent: 650,
          createdAt: '2026-02-20',
          role: 'client',
        },
        {
          _id: '3',
          name: 'ليلى علي',
          email: 'layla@example.com',
          phone: '+966501234569',
          totalSpent: 300,
          createdAt: '2026-03-10',
          role: 'client',
        },
      ]);
    } catch (error) {
      toast.error('فشل تحميل المستخدمين');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return;

    try {
      // في التطبيق الفعلي
      toast.success('تم حذف المستخدم');
      loadUsers();
    } catch (error) {
      toast.error('فشل الحذف');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-dark">المستخدمون</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <p className="text-gray-600 text-sm">إجمالي المستخدمين</p>
          <p className="text-3xl font-bold text-primary">{users.length}</p>
        </div>
        <div className="card">
          <p className="text-gray-600 text-sm">المستخدمون الجدد هذا الشهر</p>
          <p className="text-3xl font-bold text-green-500">8</p>
        </div>
        <div className="card">
          <p className="text-gray-600 text-sm">إجمالي الإيرادات</p>
          <p className="text-3xl font-bold text-blue-500">
            ${users.reduce((sum, u) => sum + u.totalSpent, 0)}
          </p>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-8">جاري التحميل...</div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="table-header">الاسم</th>
                <th className="table-header">البريد الإلكتروني</th>
                <th className="table-header">الهاتف</th>
                <th className="table-header">المنفق</th>
                <th className="table-header">تاريخ الانضمام</th>
                <th className="table-header">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="table-cell font-semibold">{user.name}</td>
                  <td className="table-cell text-sm">{user.email}</td>
                  <td className="table-cell text-sm">{user.phone}</td>
                  <td className="table-cell">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                      ${user.totalSpent}
                    </span>
                  </td>
                  <td className="table-cell text-sm">{user.createdAt}</td>
                  <td className="table-cell">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          toast.success(`تفاصيل: ${user.name}`)
                        }
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <FiEye />
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <FiTrash2 />
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
