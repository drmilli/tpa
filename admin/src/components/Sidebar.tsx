import { Link, useLocation } from 'react-router-dom';
import {
  Home, Users, Building, TrendingUp, Vote, FileText, Mail, User,
  ChevronLeft, ChevronRight, Shield
} from 'lucide-react';
import clsx from 'clsx';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Politicians', href: '/politicians', icon: Users },
  { name: 'Offices', href: '/offices', icon: Building },
  { name: 'Rankings', href: '/rankings', icon: TrendingUp },
  { name: 'Polls', href: '/polls', icon: Vote },
  { name: 'Blogs', href: '/blogs', icon: FileText },
  { name: 'Contacts', href: '/contacts', icon: Mail },
  { name: 'Users', href: '/users', icon: User },
];

export default function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={clsx(
      'bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col transition-all duration-300',
      collapsed ? 'w-20' : 'w-64'
    )}>
      {/* Logo */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-primary-400 to-primary-600 p-2 rounded-xl">
              <Shield className="w-6 h-6 text-white" />
            </div>
            {!collapsed && (
              <div>
                <span className="text-lg font-bold">TPA Admin</span>
                <p className="text-xs text-gray-400">Management Portal</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-4 px-3 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;

          return (
            <Link
              key={item.name}
              to={item.href}
              title={collapsed ? item.name : undefined}
              className={clsx(
                'flex items-center px-3 py-2.5 rounded-xl transition-all duration-200',
                collapsed ? 'justify-center' : 'space-x-3',
                isActive
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                  : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
              )}
            >
              <Icon className={clsx('w-5 h-5', isActive && 'text-white')} />
              {!collapsed && <span className="font-medium">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <div className="flex items-center space-x-2">
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">Collapse</span>
            </div>
          )}
        </button>
      </div>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-700">
          <div className="bg-gray-700/50 rounded-xl p-3">
            <p className="text-xs text-gray-400">The People's Affairs</p>
            <p className="text-xs text-gray-500 mt-1">v1.0.0</p>
          </div>
        </div>
      )}
    </div>
  );
}
