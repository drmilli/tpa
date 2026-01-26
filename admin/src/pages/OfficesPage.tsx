import { useState } from 'react';
import {
  Plus, Search, Edit2, Trash2, Building, Users,
  ChevronLeft, ChevronRight, X, MapPin, Briefcase
} from 'lucide-react';

interface Office {
  id: string;
  name: string;
  level: 'Federal' | 'State' | 'Local';
  category: string;
  holders: number;
  description: string;
}

export default function OfficesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const offices: Office[] = [
    { id: '1', name: 'President', level: 'Federal', category: 'Executive', holders: 1, description: 'Head of State and Government' },
    { id: '2', name: 'Vice President', level: 'Federal', category: 'Executive', holders: 1, description: 'Deputy Head of State' },
    { id: '3', name: 'Senate President', level: 'Federal', category: 'Legislative', holders: 1, description: 'Head of the Senate' },
    { id: '4', name: 'Governor', level: 'State', category: 'Executive', holders: 36, description: 'Head of State Government' },
    { id: '5', name: 'Senator', level: 'Federal', category: 'Legislative', holders: 109, description: 'Member of the Senate' },
    { id: '6', name: 'House of Reps Member', level: 'Federal', category: 'Legislative', holders: 360, description: 'Federal House Member' },
    { id: '7', name: 'Minister', level: 'Federal', category: 'Executive', holders: 45, description: 'Federal Cabinet Member' },
    { id: '8', name: 'Local Government Chairman', level: 'Local', category: 'Executive', holders: 774, description: 'Head of LGA' },
  ];

  const levels = ['Federal', 'State', 'Local'];
  const categories = ['Executive', 'Legislative', 'Judicial'];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Federal': return 'bg-blue-100 text-blue-700';
      case 'State': return 'bg-purple-100 text-purple-700';
      case 'Local': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredOffices = offices.filter(o => {
    const matchesSearch = o.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = !selectedLevel || o.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  const totalHolders = offices.reduce((acc, o) => acc + o.holders, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Political Offices</h1>
          <p className="text-gray-600 mt-1">Manage government positions and offices</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 flex items-center space-x-2 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Office</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-50 p-2 rounded-lg">
              <Building className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{offices.length}</p>
              <p className="text-sm text-gray-500">Total Offices</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-50 p-2 rounded-lg">
              <Users className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalHolders.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Office Holders</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-50 p-2 rounded-lg">
              <Briefcase className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{offices.filter(o => o.level === 'Federal').length}</p>
              <p className="text-sm text-gray-500">Federal Offices</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-50 p-2 rounded-lg">
              <MapPin className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{offices.filter(o => o.level === 'State').length}</p>
              <p className="text-sm text-gray-500">State Offices</p>
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
              placeholder="Search offices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Levels</option>
            {levels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Offices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOffices.map((office) => (
          <div key={office.id} className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition group">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-primary-50 p-3 rounded-xl">
                <Building className="w-6 h-6 text-primary-600" />
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getLevelColor(office.level)}`}>
                {office.level}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{office.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{office.description}</p>
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>{office.holders.toLocaleString()} holder{office.holders !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition">
                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing <span className="font-medium">{filteredOffices.length}</span> offices
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

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Add New Office</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Office Name</label>
                <input type="text" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="e.g., Governor, Senator" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                  <select className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="">Select level</option>
                    {levels.map(level => <option key={level} value={level}>{level}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="">Select category</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Brief description of the office..."></textarea>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex items-center justify-end space-x-3">
              <button onClick={() => setShowAddModal(false)} className="px-6 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition">Cancel</button>
              <button className="px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition">Add Office</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
