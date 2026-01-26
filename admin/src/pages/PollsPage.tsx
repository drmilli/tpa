import { useState } from 'react';
import {
  Plus, Search, Edit2, Trash2, Eye, Vote, Users,
  ChevronLeft, ChevronRight, X, Calendar, BarChart2, Clock
} from 'lucide-react';

interface Poll {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'ended' | 'draft';
  votes: number;
  options: number;
  startDate: string;
  endDate: string;
}

export default function PollsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const polls: Poll[] = [
    { id: '1', title: 'Best Performing Governor 2024', description: 'Vote for the best performing governor in Nigeria', status: 'active', votes: 12500, options: 5, startDate: '2024-01-01', endDate: '2024-12-31' },
    { id: '2', title: 'Most Transparent Minister', description: 'Who is the most transparent minister?', status: 'active', votes: 8900, options: 4, startDate: '2024-02-01', endDate: '2024-06-30' },
    { id: '3', title: 'Presidential Performance Rating', description: 'Rate the president\'s performance', status: 'active', votes: 25000, options: 5, startDate: '2024-01-15', endDate: '2024-12-31' },
    { id: '4', title: 'Best Senator 2023', description: 'Vote for the best senator of 2023', status: 'ended', votes: 15600, options: 6, startDate: '2023-01-01', endDate: '2023-12-31' },
    { id: '5', title: 'Infrastructure Development Poll', description: 'Which state has the best infrastructure?', status: 'draft', votes: 0, options: 3, startDate: '2024-03-01', endDate: '2024-09-30' },
  ];

  const statuses = ['active', 'ended', 'draft'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700';
      case 'ended': return 'bg-gray-100 text-gray-700';
      case 'draft': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredPolls = polls.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !selectedStatus || p.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalVotes = polls.reduce((acc, p) => acc + p.votes, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Polls Management</h1>
          <p className="text-gray-600 mt-1">Create and manage public opinion polls</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 flex items-center space-x-2 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Create Poll</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-50 p-2 rounded-lg">
              <Vote className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{polls.length}</p>
              <p className="text-sm text-gray-500">Total Polls</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-50 p-2 rounded-lg">
              <BarChart2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{polls.filter(p => p.status === 'active').length}</p>
              <p className="text-sm text-gray-500">Active Polls</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-50 p-2 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalVotes.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Total Votes</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-50 p-2 rounded-lg">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{polls.filter(p => p.status === 'draft').length}</p>
              <p className="text-sm text-gray-500">Drafts</p>
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
              placeholder="Search polls..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
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

      {/* Polls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPolls.map((poll) => (
          <div key={poll.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition group">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(poll.status)}`}>
                  {poll.status}
                </span>
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition">
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
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{poll.title}</h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">{poll.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{poll.votes.toLocaleString()} votes</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Vote className="w-4 h-4" />
                  <span>{poll.options} options</span>
                </div>
              </div>
            </div>
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="w-3 h-3 mr-1" />
                <span>{new Date(poll.startDate).toLocaleDateString()} - {new Date(poll.endDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing <span className="font-medium">{filteredPolls.length}</span> polls
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
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Create New Poll</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Poll Title</label>
                <input type="text" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="e.g., Best Performing Governor 2024" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Describe what this poll is about..."></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input type="date" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input type="date" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Poll Options</label>
                <div className="space-y-2">
                  <input type="text" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Option 1" />
                  <input type="text" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Option 2" />
                  <input type="text" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Option 3" />
                  <button className="w-full px-4 py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-primary-400 hover:text-primary-600 transition">
                    + Add Option
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex items-center justify-end space-x-3">
              <button onClick={() => setShowAddModal(false)} className="px-6 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition">Cancel</button>
              <button className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition">Save as Draft</button>
              <button className="px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition">Publish Poll</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
