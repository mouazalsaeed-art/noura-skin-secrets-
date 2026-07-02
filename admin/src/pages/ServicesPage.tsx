import { useEffect, useState } from 'react';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';
import client from '@/api/client';

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  discount: number;
}

export function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    duration: 0,
    category: '',
    image: '',
    discount: 0,
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const { data } = await client.get('/api/services');
      setServices(data);
    } catch (error) {
      toast.error('فشل تحميل الخدمات');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        await client.patch(`/api/services/${editingId}`, formData);
        toast.success('تم تحديث الخدمة');
      } else {
        await client.post('/api/services', formData);
        toast.success('تم إضافة الخدمة');
      }

      resetForm();
      loadServices();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'حدث خطأ');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من الحذف؟')) return;

    try {
      await client.delete(`/api/services/${id}`);
      toast.success('تم حذف الخدمة');
      loadServices();
    } catch (error) {
      toast.error('فشل الحذف');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      duration: 0,
      category: '',
      image: '',
      discount: 0,
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-dark">الخدمات</h1>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <FiPlus /> إضافة خدمة
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="اسم الخدمة"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="input-field"
                required
              />
              <input
                type="number"
                placeholder="السعر"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
                className="input-field"
                required
              />
              <input
                type="number"
                placeholder="المدة (دقائق)"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    duration: Number(e.target.value),
                  })
                }
                className="input-field"
                required
              />
              <input
                type="text"
                placeholder="التصنيف"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="input-field"
                required
              />
              <input
                type="number"
                placeholder="الخصم %"
                value={formData.discount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    discount: Number(e.target.value),
                  })
                }
                className="input-field"
              />
              <input
                type="text"
                placeholder="رابط الصورة"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                className="input-field"
              />
            </div>

            <textarea
              placeholder="الوصف"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="input-field h-24"
              required
            />

            <div className="flex gap-4">
              <button type="submit" className="btn-primary">
                {editingId ? 'تحديث' : 'إضافة'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="btn-secondary"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="text-center py-8">جاري التحميل...</div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="table-header">اسم الخدمة</th>
                <th className="table-header">التصنيف</th>
                <th className="table-header">السعر</th>
                <th className="table-header">المدة</th>
                <th className="table-header">الخصم</th>
                <th className="table-header">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service._id} className="hover:bg-gray-50">
                  <td className="table-cell font-semibold">{service.name}</td>
                  <td className="table-cell">{service.category}</td>
                  <td className="table-cell">${service.price}</td>
                  <td className="table-cell">{service.duration} دقيقة</td>
                  <td className="table-cell">
                    {service.discount > 0 && (
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm">
                        -{service.discount}%
                      </span>
                    )}
                  </td>
                  <td className="table-cell">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setFormData(service as any);
                          setEditingId(service._id);
                          setShowForm(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(service._id)}
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
