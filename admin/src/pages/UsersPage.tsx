import { useState } from 'react';
import {
  Search, Edit2, Trash2, Users, Shield, UserCheck,
  ChevronLeft, ChevronRight, Mail, Calendar, Ban, Crown
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'MODERATOR' | 'ADMIN' | 'SUPER_ADMIN';
  status: 'active' | 'suspended' | 'pending';
  joinedAt: string;
  lastActive: string;
}

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const users: User[] = [
    { id: '1', name: 'John Adeyemi', email: 'john@example.com', role: 'USER', status: 'active', joinedAt: '2024-01-15', lastActive: '2024-01-20' },
    { id: '2', name: 'Sarah Okafor', email: 'sarah@example.com', role: 'MODERATOR', status: 'active', joinedAt: '2024-01-10', lastActive: '2024-01-19' },
    { id: '3', name: 'Super Admin', email: 'admin@thepeoplesaffairs.com', role: 'SUPER_ADMIN', status: 'active', joinedAt: '2023-06-01', lastActive: '2024-01-20' },
    { id: '4', name: 'Michael Nwosu', email: 'michael@example.com', role: 'USER', status: 'active', joinedAt: '2024-01-05', lastActive: '2024-01-18' },
    { id: '5', name: 'Amina Ibrahim', email: 'amina@example.com', role: 'USER', status: 'suspended', joinedAt: '2023-12-20', lastActive: '2024-01-10' },
    { id: '6', name: 'David Okonkwo', email: 'david@example.com', role: 'ADMIN', status: 'active', joinedAt: '2024-01-19', lastActive: '2024-01-19' },
    { id: '7', name: 'Fatima Musa', email: 'fatima@example.com', role: 'MODERATOR', status: 'active', joinedAt: '2023-11-15', lastActive: '2024-01-20' },
  ];

  const roles = ['USER', 'MODERATOR', 'ADMIN', 'SUPER_ADMIN'];
  const statuses = ['active', 'suspended', 'pending'];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border border-amber-300';
      case 'ADMIN': return 'bg-purple-100 text-purple-700';
      case 'MODERATOR': return 'bg-blue-100 text-blue-700';
      case 'USER': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700';
      case 'suspended': return 'bg-red-100 text-red-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = !selectedRole || u.role === selectedRole;
    const matchesStatus = !selectedStatus || u.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-1">Manage user accounts and permissions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-50 p-2 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              <p className="text-sm text-gray-500">Total Users</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-50 p-2 rounded-lg">
              <UserCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.status === 'active').length}</p>
              <p className="text-sm text-gray-500">Active Users</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-50 p-2 rounded-lg">
              <Shield className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.role === 'SUPER_ADMIN' || u.role === 'ADMIN' || u.role === 'MODERATOR').length}</p>
              <p className="text-sm text-gray-500">Admins & Mods</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="bg-yellow-50 p-2 rounded-lg">
              <Calendar className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.status === 'pending').length}</p>
              <p className="text-sm text-gray-500">Pending</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Roles</option>
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Active</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <Mail className="w-3 h-3 mr-1" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(user.joinedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(user.lastActive).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit user">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {user.status === 'active' ? (
                        <button className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition" title="Suspend user">
                          <Ban className="w-4 h-4" />
                        </button>
                      ) : (
                        <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition" title="Activate user">
                          <UserCheck className="w-4 h-4" />
                        </button>
                      )}
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete user">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium">{filteredUsers.length}</span> users
          </p>
          <div className="flex items-center space-x-2">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="px-4 py-2 bg-primary-50 text-primary-700 font-medium rounded-lg">{currentPage}</span>
            <button onClick={() => setCurrentPage(p => p + 1)} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Role Info */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Role Permissions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs font-semibold">USER</span>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>View politicians & rankings</li>
              <li>Participate in polls</li>
              <li>Comment on content</li>
            </ul>
          </div>
          <div className="p-4 bg-blue-50 rounded-xl">
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-2 py-1 bg-blue-200 text-blue-700 rounded text-xs font-semibold">MODERATOR</span>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>All USER permissions</li>
              <li>Manage content & comments</li>
              <li>Create blog posts & polls</li>
            </ul>
          </div>
          <div className="p-4 bg-purple-50 rounded-xl">
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-2 py-1 bg-purple-200 text-purple-700 rounded text-xs font-semibold">ADMIN</span>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>All MODERATOR permissions</li>
              <li>Manage users & roles</li>
              <li>System configuration</li>
            </ul>
          </div>
          <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200">
            <div className="flex items-center space-x-2 mb-2">
              <Crown className="w-4 h-4 text-amber-600" />
              <span className="px-2 py-1 bg-gradient-to-r from-amber-200 to-orange-200 text-amber-800 rounded text-xs font-semibold">SUPER_ADMIN</span>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>All ADMIN permissions</li>
              <li>Manage other admins</li>
              <li>Database access</li>
              <li>System-wide settings</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
