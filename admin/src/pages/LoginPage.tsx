import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import client from '@/api/client';
import { useAdminStore } from '@/store/adminStore';

export function LoginPage() {
  const [email, setEmail] = useState('admin@nouraskin.com');
  const [password, setPassword] = useState('ChangeMe123!');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, setToken } = useAdminStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await client.post('/api/auth/login', {
        email,
        password,
      });

      setToken(data.token);
      setUser(data.user);
      toast.success('تم تسجيل الدخول بنجاح');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'فشل تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-dark flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-dark">نورا سكين</h1>
          <p className="text-gray-600 mt-2">لوحة تحكم المسؤول</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-dark mb-2">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <FiMail className="absolute right-3 top-3 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pr-10"
                placeholder="admin@nouraskin.com"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-dark mb-2">
              كلمة المرور
            </label>
            <div className="relative">
              <FiLock className="absolute right-3 top-3 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pr-10"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary font-semibold disabled:opacity-50"
          >
            {loading ? 'جاري الدخول...' : 'دخول'}
          </button>
        </form>

        {/* Test Credentials */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
          <p className="font-semibold mb-2">بيانات الاختبار:</p>
          <p>البريد: admin@nouraskin.com</p>
          <p>كلمة المرور: ChangeMe123!</p>
        </div>
      </div>
    </div>
  );
}
