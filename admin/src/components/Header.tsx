import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { RootState } from '@/store';
import { logout } from '@/store/slices/authSlice';
import { LogOut, User, Bell, Search, ChevronDown, Settings } from 'lucide-react';
import { useState } from 'react';

const pageNames: Record<string, string> = {
  '/': 'Dashboard',
  '/politicians': 'Politicians',
  '/offices': 'Political Offices',
  '/rankings': 'Rankings',
  '/polls': 'Polls Management',
  '/blogs': 'Blog Posts',
  '/contacts': 'Contact Messages',
  '/users': 'User Management',
};

export default function Header() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const currentPage = pageNames[location.pathname] || 'Admin Panel';

  const notifications = [
    { id: 1, message: 'New contact message received', time: '5 min ago', unread: true },
    { id: 2, message: 'User registration pending approval', time: '1 hour ago', unread: true },
    { id: 3, message: 'Poll "Best Governor" reached 10K votes', time: '2 hours ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-3 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        {/* Page Title & Breadcrumb */}
        <div>
          <h2 className="text-xl font-bold text-gray-900">{currentPage}</h2>
          <p className="text-sm text-gray-500">
            Welcome back, {user?.firstName || 'Admin'}
          </p>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="hidden md:flex items-center bg-gray-50 rounded-xl px-3 py-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none ml-2 text-sm w-40 placeholder-gray-400"
            />
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${
                        notification.unread ? 'bg-primary-50/50' : ''
                      }`}
                    >
                      <p className="text-sm text-gray-700">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                    </div>
                  ))}
                </div>
                <div className="p-3 text-center border-t border-gray-100">
                  <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-xl transition"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm">
                {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || 'A'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName || user?.email?.split('@')[0]}
                </p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 hidden md:block" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                <div className="p-4 border-b border-gray-100">
                  <p className="font-medium text-gray-900">{user?.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-primary-100 text-primary-700 rounded text-xs font-medium">
                    {user?.role}
                  </span>
                </div>
                <div className="py-2">
                  <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition">
                    <User className="w-4 h-4" />
                    <span>My Profile</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                </div>
                <div className="border-t border-gray-100 py-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
