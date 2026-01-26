import { Link } from 'react-router-dom';
import {
  Users, Building, TrendingUp, Vote, FileText, Mail,
  ArrowUpRight, ArrowDownRight, Calendar, Clock,
  ChevronRight, Plus, Eye, BarChart3
} from 'lucide-react';

export default function DashboardPage() {
  const stats = {
    politicians: { total: 1234, change: 12 },
    offices: { total: 45, change: 3 },
    polls: { total: 12, change: -2 },
    rankings: { total: 890, change: 45 },
    contacts: { total: 156, new: 23 },
    users: { total: 5432, change: 234 },
  };

  const statCards = [
    {
      name: 'Total Politicians',
      value: stats.politicians.total,
      change: stats.politicians.change,
      icon: Users,
      lightColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      href: '/politicians'
    },
    {
      name: 'Political Offices',
      value: stats.offices.total,
      change: stats.offices.change,
      icon: Building,
      lightColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      href: '/offices'
    },
    {
      name: 'Active Polls',
      value: stats.polls.total,
      change: stats.polls.change,
      icon: Vote,
      lightColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      href: '/polls'
    },
    {
      name: 'Rankings Updated',
      value: stats.rankings.total,
      change: stats.rankings.change,
      icon: TrendingUp,
      lightColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      href: '/rankings'
    },
  ];

  const recentActivities = [
    { action: 'New politician added', name: 'Hon. Chukwuma Obi', time: '2 hours ago', type: 'politician' },
    { action: 'Poll created', name: 'Best Governor 2024', time: '4 hours ago', type: 'poll' },
    { action: 'Blog published', name: 'Understanding Electoral Process', time: '6 hours ago', type: 'blog' },
    { action: 'Contact inquiry', name: 'Media Partnership Request', time: '8 hours ago', type: 'contact' },
    { action: 'User registered', name: 'john.doe@email.com', time: '12 hours ago', type: 'user' },
  ];

  const quickActions = [
    { label: 'Add Politician', icon: Users, href: '/politicians', color: 'bg-blue-600 hover:bg-blue-700' },
    { label: 'Create Poll', icon: Vote, href: '/polls', color: 'bg-purple-600 hover:bg-purple-700' },
    { label: 'Write Blog', icon: FileText, href: '/blogs', color: 'bg-emerald-600 hover:bg-emerald-700' },
    { label: 'View Contacts', icon: Mail, href: '/contacts', color: 'bg-orange-600 hover:bg-orange-700' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const isPositive = stat.change >= 0;
          return (
            <Link
              key={stat.name}
              to={stat.href}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition group"
            >
              <div className="flex items-start justify-between">
                <div className={`${stat.lightColor} p-3 rounded-xl`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
                <div className={`flex items-center space-x-1 text-sm ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                  {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  <span>{Math.abs(stat.change)}%</span>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
                <p className="text-gray-600 text-sm mt-1 flex items-center justify-between">
                  {stat.name}
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition" />
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              to={action.href}
              className={`${action.color} text-white px-4 py-3 rounded-xl flex items-center justify-center space-x-2 transition`}
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-4 p-3 hover:bg-gray-50 rounded-lg transition">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  activity.type === 'politician' ? 'bg-blue-100 text-blue-600' :
                  activity.type === 'poll' ? 'bg-purple-100 text-purple-600' :
                  activity.type === 'blog' ? 'bg-emerald-100 text-emerald-600' :
                  activity.type === 'contact' ? 'bg-orange-100 text-orange-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {activity.type === 'politician' && <Users className="w-5 h-5" />}
                  {activity.type === 'poll' && <Vote className="w-5 h-5" />}
                  {activity.type === 'blog' && <FileText className="w-5 h-5" />}
                  {activity.type === 'contact' && <Mail className="w-5 h-5" />}
                  {activity.type === 'user' && <Users className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-500 truncate">{activity.name}</p>
                </div>
                <div className="flex items-center text-xs text-gray-400">
                  <Clock className="w-3 h-3 mr-1" />
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">System Overview</h2>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-6">
            {/* Users stat */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Total Users</span>
                <span className="text-sm font-bold text-gray-900">{stats.users.total.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-primary-600 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">+{stats.users.change} new this month</p>
            </div>

            {/* Contacts stat */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Contact Inquiries</span>
                <span className="text-sm font-bold text-gray-900">{stats.contacts.total}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{stats.contacts.new} new unread</p>
            </div>

            {/* Content Published */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Content Published</span>
                <span className="text-sm font-bold text-gray-900">248</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Blog posts & articles</p>
            </div>

            {/* Server Status */}
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">System Status</span>
                </div>
                <span className="text-sm text-emerald-600 font-medium">All Systems Operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">New Contacts</p>
              <p className="text-3xl font-bold mt-1">{stats.contacts.new}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <Mail className="w-6 h-6" />
            </div>
          </div>
          <Link to="/contacts" className="mt-4 flex items-center text-sm text-blue-100 hover:text-white">
            <Eye className="w-4 h-4 mr-1" />
            View all contacts
          </Link>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Active Polls</p>
              <p className="text-3xl font-bold mt-1">{stats.polls.total}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <Vote className="w-6 h-6" />
            </div>
          </div>
          <Link to="/polls" className="mt-4 flex items-center text-sm text-purple-100 hover:text-white">
            <Eye className="w-4 h-4 mr-1" />
            Manage polls
          </Link>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm">Blog Posts</p>
              <p className="text-3xl font-bold mt-1">48</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <FileText className="w-6 h-6" />
            </div>
          </div>
          <Link to="/blogs" className="mt-4 flex items-center text-sm text-emerald-100 hover:text-white">
            <Eye className="w-4 h-4 mr-1" />
            View all posts
          </Link>
        </div>
      </div>
    </div>
  );
}
