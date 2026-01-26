import { useState } from 'react';
import {
  Plus, Search, Filter, Edit2, Trash2, Eye,
  ChevronLeft, ChevronRight, Users, MapPin, Building, Star,
  Download, Upload, X
} from 'lucide-react';

interface Politician {
  id: string;
  name: string;
  party: string;
  office: string;
  state: string;
  score: number;
  status: 'active' | 'inactive';
}

export default function PoliticiansPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParty, setSelectedParty] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const politicians: Politician[] = [
    { id: '1', name: 'Bola Ahmed Tinubu', party: 'APC', office: 'President', state: 'Lagos', score: 72, status: 'active' },
    { id: '2', name: 'Atiku Abubakar', party: 'PDP', office: 'Former VP', state: 'Adamawa', score: 68, status: 'active' },
    { id: '3', name: 'Peter Obi', party: 'LP', office: 'Former Governor', state: 'Anambra', score: 85, status: 'active' },
    { id: '4', name: 'Babajide Sanwo-Olu', party: 'APC', office: 'Governor', state: 'Lagos', score: 76, status: 'active' },
    { id: '5', name: 'Nyesom Wike', party: 'PDP', office: 'Minister', state: 'Rivers', score: 65, status: 'active' },
    { id: '6', name: 'Rotimi Akeredolu', party: 'APC', office: 'Governor', state: 'Ondo', score: 70, status: 'inactive' },
    { id: '7', name: 'Seyi Makinde', party: 'PDP', office: 'Governor', state: 'Oyo', score: 78, status: 'active' },
    { id: '8', name: 'Godwin Obaseki', party: 'PDP', office: 'Governor', state: 'Edo', score: 74, status: 'active' },
  ];

  const parties = ['APC', 'PDP', 'LP', 'NNPP', 'APGA'];
  const states = ['Lagos', 'Adamawa', 'Anambra', 'Rivers', 'Ondo', 'Oyo', 'Edo', 'Kano'];

  const getPartyColor = (party: string) => {
    switch (party) {
      case 'APC': return 'bg-blue-100 text-blue-700';
      case 'PDP': return 'bg-red-100 text-red-700';
      case 'LP': return 'bg-green-100 text-green-700';
      case 'NNPP': return 'bg-purple-100 text-purple-700';
      case 'APGA': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredPoliticians = politicians.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesParty = !selectedParty || p.party === selectedParty;
    const matchesState = !selectedState || p.state === selectedState;
    return matchesSearch && matchesParty && matchesState;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Politicians</h1>
          <p className="text-gray-600 mt-1">Manage politician profiles and information</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 flex items-center space-x-2 transition">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="px-4 py-2 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 flex items-center space-x-2 transition">
            <Upload className="w-4 h-4" />
            <span>Import</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 flex items-center space-x-2 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Politician</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-50 p-2 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{politicians.length}</p>
              <p className="text-sm text-gray-500">Total Politicians</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-50 p-2 rounded-lg">
              <Star className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{politicians.filter(p => p.status === 'active').length}</p>
              <p className="text-sm text-gray-500">Active</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-50 p-2 rounded-lg">
              <Building className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{parties.length}</p>
              <p className="text-sm text-gray-500">Parties</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-50 p-2 rounded-lg">
              <MapPin className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{states.length}</p>
              <p className="text-sm text-gray-500">States Covered</p>
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
              placeholder="Search politicians..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-3">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedParty}
              onChange={(e) => setSelectedParty(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Parties</option>
              {parties.map(party => (
                <option key={party} value={party}>{party}</option>
              ))}
            </select>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All States</option>
              {states.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Politicians Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Politician</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Party</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Office</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">State</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPoliticians.map((politician) => (
                <tr key={politician.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {politician.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <p className="font-medium text-gray-900">{politician.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPartyColor(politician.party)}`}>
                      {politician.party}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{politician.office}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                      {politician.state}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-semibold ${getScoreColor(politician.score)}`}>{politician.score}%</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      politician.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {politician.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
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
            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredPoliticians.length}</span> of <span className="font-medium">{filteredPoliticians.length}</span> results
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

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Add New Politician</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input type="text" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Enter first name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input type="text" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Enter last name" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Political Party</label>
                  <select className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="">Select party</option>
                    {parties.map(party => <option key={party} value={party}>{party}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State of Origin</label>
                  <select className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="">Select state</option>
                    {states.map(state => <option key={state} value={state}>{state}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Office</label>
                <input type="text" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="e.g., Governor, Senator, Minister" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Biography</label>
                <textarea rows={4} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Enter politician's biography..."></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-primary-400 transition cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex items-center justify-end space-x-3">
              <button onClick={() => setShowAddModal(false)} className="px-6 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition">Cancel</button>
              <button className="px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition">Add Politician</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
