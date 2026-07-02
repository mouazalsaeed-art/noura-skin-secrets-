import { useEffect, useState } from 'react';
import { FiCheck, FiTrash2, FiStar } from 'react-icons/fi';
import toast from 'react-hot-toast';
import client from '@/api/client';

interface Review {
  _id: string;
  serviceName?: string;
  clientName: string;
  rating: number;
  comment: string;
  verified: boolean;
  createdAt: string;
}

export function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('unverified');

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      // في الواقع، يجب جلب جميع التقييمات
      const { data } = await client.get('/api/reviews');
      setReviews(data.reviews || []);
    } catch (error) {
      // عند الفشل، استخدم بيانات تجريبية
      setReviews([
        {
          _id: '1',
          clientName: 'فاطمة أحمد',
          rating: 5,
          comment: 'خدمة ممتازة جداً',
          verified: false,
          createdAt: new Date().toISOString(),
        },
        {
          _id: '2',
          clientName: 'سارة محمد',
          rating: 4,
          comment: 'جيد جداً',
          verified: true,
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id: string) => {
    try {
      await client.patch(`/api/reviews/${id}/verify`);
      toast.success('تم التحقق من التقييم');
      loadReviews();
    } catch (error) {
      toast.error('فشل التحقق');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من الحذف؟')) return;

    try {
      await client.delete(`/api/reviews/${id}`);
      toast.success('تم حذف التقييم');
      loadReviews();
    } catch (error) {
      toast.error('فشل الحذف');
    }
  };

  const filteredReviews = reviews.filter((review) => {
    if (filter === 'unverified') return !review.verified;
    if (filter === 'verified') return review.verified;
    return true;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-dark">التقييمات</h1>

      {/* Filter */}
      <div className="flex gap-2">
        {['all', 'unverified', 'verified'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg transition ${
              filter === f
                ? 'bg-primary text-white'
                : 'bg-white border border-gray-300'
            }`}
          >
            {f === 'all'
              ? 'الكل'
              : f === 'unverified'
              ? 'غير مُتحقق'
              : 'مُتحقق'}
          </button>
        ))}
      </div>

      {/* Reviews */}
      {loading ? (
        <div className="text-center py-8">جاري التحميل...</div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div key={review._id} className="card">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-dark">
                    {review.clientName}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          size={16}
                          fill={i < review.rating ? 'currentColor' : 'none'}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {review.rating}/5
                    </span>
                  </div>
                </div>
                {!review.verified && (
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                    قيد الانتظار
                  </span>
                )}
              </div>

              <p className="text-gray-700 mb-4">{review.comment}</p>

              <div className="flex gap-2">
                {!review.verified && (
                  <button
                    onClick={() => handleVerify(review._id)}
                    className="btn-primary flex items-center gap-2 text-sm"
                  >
                    <FiCheck /> التحقق
                  </button>
                )}
                <button
                  onClick={() => handleDelete(review._id)}
                  className="btn-danger flex items-center gap-2 text-sm"
                >
                  <FiTrash2 /> حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
