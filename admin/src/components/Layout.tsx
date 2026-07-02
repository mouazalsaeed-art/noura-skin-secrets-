import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiLogOut, FiHome, FiShoppingCart, FiCalendar, FiStar, FiUsers } from 'react-icons/fi';
import { useAdminStore } from '@/store/adminStore';

export function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAdminStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', label: 'لوحة التحكم', icon: FiHome },
    { path: '/services', label: 'الخدمات', icon: FiShoppingCart },
    { path: '/appointments', label: 'المواعيد', icon: FiCalendar },
    { path: '/reviews', label: 'التقييمات', icon: FiStar },
    { path: '/users', label: 'المستخدمون', icon: FiUsers },
  ];

  return (
    <div className="flex h-screen bg-secondary">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-dark text-white transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-700">
          <h1 className={`font-bold ${sidebarOpen ? 'text-xl' : 'text-lg'}`}>
            {sidebarOpen ? 'نورا سكين' : 'NS'}
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition ${
                isActive(path)
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Icon size={20} />
              {sidebarOpen && <span>{label}</span>}
            </Link>
          ))}
        </nav>

        {/* User Info */}
        <div className="border-t border-gray-700 p-4">
          {sidebarOpen && (
            <div className="mb-4 text-sm">
              <p className="text-gray-400">مسؤول</p>
              <p className="font-semibold truncate">{user?.name}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition text-sm"
          >
            <FiLogOut size={18} />
            {sidebarOpen && 'تسجيل الخروج'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
          <div className="text-right">
            <p className="text-sm text-gray-600">مرحباً</p>
            <p className="font-semibold">{user?.name}</p>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
