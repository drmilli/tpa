import { useState, useEffect } from 'react';
import {
  Plus, Search, Edit2, Trash2, Eye, Vote, Users,
  ChevronLeft, ChevronRight, X, Calendar, BarChart2, Clock, Loader2, Save
} from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface PollOption {
  id: string;
  text: string;
}

interface Poll {
  id: string;
  title: string;
  description: string | null;
  question: string;
  options: PollOption[];
  category: string | null;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    Vote: number;
  };
}

interface PollFormData {
  title: string;
  description: string;
  question: string;
  options: string[];
  category: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

const initialFormData: PollFormData = {
  title: '',
  description: '',
  question: '',
  options: ['', ''],
  category: '',
  startDate: '',
  endDate: '',
  isActive: false,
};

export default function PollsPage() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPoll, setEditingPoll] = useState<Poll | null>(null);
  const [formData, setFormData] = useState<PollFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [viewingResults, setViewingResults] = useState<string | null>(null);
  const [pollResults, setPollResults] = useState<any>(null);

  const categories = ['Governors', 'Senators', 'Ministers', 'Federal', 'States', 'General'];

  const fetchPolls = async () => {
    try {
      setLoading(true);
      const response = await api.get('/polls');
      setPolls(response.data.data || []);
    } catch (error: any) {
      toast.error('Failed to fetch polls');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  const getStatus = (poll: Poll): 'active' | 'ended' | 'upcoming' | 'draft' => {
    const now = new Date();
    const start = new Date(poll.startDate);
    const end = new Date(poll.endDate);

    if (!poll.isActive) return 'draft';
    if (now < start) return 'upcoming';
    if (now > end) return 'ended';
    return 'active';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700';
      case 'ended': return 'bg-gray-100 text-gray-700';
      case 'upcoming': return 'bg-blue-100 text-blue-700';
      case 'draft': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredPolls = polls.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const status = getStatus(p);
    const matchesStatus = !selectedStatus || status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const openAddModal = () => {
    setEditingPoll(null);
    setFormData({
      ...initialFormData,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
    setShowModal(true);
  };

  const openEditModal = (poll: Poll) => {
    setEditingPoll(poll);
    setFormData({
      title: poll.title,
      description: poll.description || '',
      question: poll.question,
      options: poll.options.map(o => o.text),
      category: poll.category || '',
      startDate: poll.startDate.split('T')[0],
      endDate: poll.endDate.split('T')[0],
      isActive: poll.isActive,
    });
    setShowModal(true);
  };

  const addOption = () => {
    if (formData.options.length < 10) {
      setFormData(prev => ({
        ...prev,
        options: [...prev.options, ''],
      }));
    }
  };

  const removeOption = (index: number) => {
    if (formData.options.length > 2) {
      setFormData(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index),
      }));
    }
  };

  const updateOption = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt),
    }));
  };

  const handleSubmit = async (publish: boolean) => {
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!formData.question.trim()) {
      toast.error('Question is required');
      return;
    }
    const validOptions = formData.options.filter(o => o.trim());
    if (validOptions.length < 2) {
      toast.error('At least 2 options are required');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        title: formData.title,
        description: formData.description || null,
        question: formData.question,
        options: validOptions.map((text, index) => ({
          id: `option-${index + 1}`,
          text,
        })),
        category: formData.category || null,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        isActive: publish,
      };

      if (editingPoll) {
        await api.put(`/polls/${editingPoll.id}`, payload);
        toast.success('Poll updated successfully!');
      } else {
        await api.post('/polls', payload);
        toast.success(publish ? 'Poll published!' : 'Poll saved as draft!');
      }

      setShowModal(false);
      fetchPolls();
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Failed to save poll');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/polls/${id}`);
      toast.success('Poll deleted successfully');
      setDeleteConfirm(null);
      fetchPolls();
    } catch (error: any) {
      toast.error('Failed to delete poll');
    }
  };

  const viewResults = async (pollId: string) => {
    try {
      const response = await api.get(`/polls/${pollId}/results`);
      setPollResults(response.data.data);
      setViewingResults(pollId);
    } catch (error: any) {
      toast.error('Failed to fetch results');
    }
  };

  const getVoteCount = (poll: Poll) => {
    return poll._count?.Vote || 0;
  };

  const stats = {
    total: polls.length,
    active: polls.filter(p => getStatus(p) === 'active').length,
    drafts: polls.filter(p => getStatus(p) === 'draft').length,
    totalVotes: polls.reduce((acc, p) => acc + getVoteCount(p), 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Polls Management</h1>
          <p className="text-gray-600 mt-1">Create and manage public opinion polls</p>
        </div>
        <button
          onClick={openAddModal}
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
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
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
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
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
              <p className="text-2xl font-bold text-gray-900">{stats.totalVotes.toLocaleString()}</p>
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
              <p className="text-2xl font-bold text-gray-900">{stats.drafts}</p>
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
            <option value="active">Active</option>
            <option value="upcoming">Upcoming</option>
            <option value="ended">Ended</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Polls Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      ) : filteredPolls.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <Vote className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No polls found</h3>
          <p className="text-gray-500 mb-4">Get started by creating your first poll.</p>
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            Create Poll
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPolls.map((poll) => {
            const status = getStatus(poll);
            return (
              <div key={poll.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition group">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>
                      {status}
                    </span>
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() => viewResults(poll.id)}
                        className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition"
                        title="View results"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(poll)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Edit poll"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(poll.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete poll"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{poll.title}</h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{poll.description || poll.question}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{getVoteCount(poll).toLocaleString()} votes</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Vote className="w-4 h-4" />
                      <span>{poll.options.length} options</span>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>{new Date(poll.startDate).toLocaleDateString()} - {new Date(poll.endDate).toLocaleDateString()}</span>
                    </div>
                    {poll.category && (
                      <span className="px-2 py-0.5 bg-gray-200 rounded text-xs">{poll.category}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

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

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-900">
                {editingPoll ? 'Edit Poll' : 'Create New Poll'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Poll Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Best Performing Governor 2024"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Brief description of this poll"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Question *</label>
                <input
                  type="text"
                  value={formData.question}
                  onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="What question are you asking?"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Poll Options * (min 2)</label>
                <div className="space-y-2">
                  {formData.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="text-sm text-gray-400 w-6">{index + 1}.</span>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder={`Option ${index + 1}`}
                      />
                      {formData.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOption(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  {formData.options.length < 10 && (
                    <button
                      type="button"
                      onClick={addOption}
                      className="w-full px-4 py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-primary-400 hover:text-primary-600 transition"
                    >
                      + Add Option
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex items-center justify-end space-x-3 sticky bottom-0 bg-white">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={() => handleSubmit(false)}
                disabled={submitting}
                className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition flex items-center space-x-2 disabled:opacity-50"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Draft</span>
              </button>
              <button
                onClick={() => handleSubmit(true)}
                disabled={submitting}
                className="px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition flex items-center space-x-2 disabled:opacity-50"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Vote className="w-4 h-4" />}
                <span>{editingPoll?.isActive ? 'Update Poll' : 'Publish Poll'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Poll</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this poll? All votes will be lost. This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results Modal */}
      {viewingResults && pollResults && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Poll Results</h3>
              <button
                onClick={() => {
                  setViewingResults(null);
                  setPollResults(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="mb-4">
              <p className="text-2xl font-bold text-gray-900">{pollResults.totalVotes.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Total Votes</p>
            </div>
            <div className="space-y-4">
              {Object.entries(pollResults.results || {}).map(([option, count]: [string, any]) => {
                const percentage = pollResults.totalVotes > 0
                  ? ((count / pollResults.totalVotes) * 100).toFixed(1)
                  : 0;
                return (
                  <div key={option}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{option}</span>
                      <span className="text-sm font-semibold text-gray-900">{percentage}%</span>
                    </div>
                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-600 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{count.toLocaleString()} votes</p>
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => {
                setViewingResults(null);
                setPollResults(null);
              }}
              className="w-full mt-6 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
