import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Building, TrendingUp, Vote, FileText, Mail, User } from 'lucide-react';
import clsx from 'clsx';

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

  return (
    <div className="w-64 bg-gray-900 text-white">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <img src="/logo.png" alt="TPA" className="h-8 w-8" />
          <span className="text-xl font-bold">TPA Admin</span>
        </div>
      </div>
      <nav className="mt-6 px-3">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;

          return (
            <Link
              key={item.name}
              to={item.href}
              className={clsx(
                'flex items-center space-x-3 px-3 py-2 mb-1 rounded-lg transition',
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
