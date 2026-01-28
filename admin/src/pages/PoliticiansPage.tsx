import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus, Search, Filter, Edit2, Trash2, Eye,
  ChevronLeft, ChevronRight, Users, MapPin, Building, Star,
  Download, Upload, X, Loader2
} from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface Politician {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  partyAffiliation: string;
  stateId?: string;
  biography?: string;
  performanceScore: number;
  isActive: boolean;
  State?: { id: string; name: string };
  Tenure?: { Office: { name: string } }[];
}

interface PoliticianFormData {
  firstName: string;
  lastName: string;
  middleName?: string;
  partyAffiliation: string;
  stateId?: string;
  biography?: string;
  performanceScore: number;
  isActive: boolean;
}

export default function PoliticiansPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParty, setSelectedParty] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPolitician, setEditingPolitician] = useState<Politician | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<PoliticianFormData>({
    firstName: '',
    lastName: '',
    middleName: '',
    partyAffiliation: 'APC',
    stateId: '',
    biography: '',
    performanceScore: 50,
    isActive: true,
  });

  // Fetch politicians
  const { data, isLoading } = useQuery({
    queryKey: ['politicians', currentPage, selectedParty, selectedState],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(selectedParty && { party: selectedParty }),
        ...(selectedState && { state: selectedState }),
      });
      const response = await api.get(`/politicians?${params}`);
      return response.data.data;
    },
  });

  // Fetch states for dropdown
  const { data: statesData } = useQuery({
    queryKey: ['states'],
    queryFn: async () => {
      const response = await api.get('/locations/states');
      return response.data.data;
    },
  });

  // Create politician
  const createMutation = useMutation({
    mutationFn: async (data: PoliticianFormData) => {
      return api.post('/politicians', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['politicians'] });
      toast.success('Politician created successfully');
      setShowAddModal(false);
      resetForm();
    },
    onError: () => {
      toast.error('Failed to create politician');
    },
  });

  // Update politician
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: PoliticianFormData }) => {
      return api.put(`/politicians/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['politicians'] });
      toast.success('Politician updated successfully');
      setEditingPolitician(null);
      resetForm();
    },
    onError: () => {
      toast.error('Failed to update politician');
    },
  });

  // Delete politician
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`/politicians/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['politicians'] });
      toast.success('Politician deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete politician');
    },
  });

  // All 18 INEC-registered political parties
  const parties = [
    { code: 'APC', name: 'All Progressives Congress' },
    { code: 'PDP', name: 'Peoples Democratic Party' },
    { code: 'LP', name: 'Labour Party' },
    { code: 'NNPP', name: 'New Nigeria Peoples Party' },
    { code: 'APGA', name: 'All Progressives Grand Alliance' },
    { code: 'ADC', name: 'African Democratic Congress' },
    { code: 'SDP', name: 'Social Democratic Party' },
    { code: 'YPP', name: 'Young Progressives Party' },
    { code: 'PRP', name: 'Peoples Redemption Party' },
    { code: 'AAC', name: 'African Action Congress' },
    { code: 'AA', name: 'Action Alliance' },
    { code: 'ADP', name: 'Action Democratic Party' },
    { code: 'APM', name: 'Allied Peoples Movement' },
    { code: 'APP', name: 'Action Peoples Party' },
    { code: 'A', name: 'Accord' },
    { code: 'BP', name: 'Boot Party' },
    { code: 'NRM', name: 'National Rescue Movement' },
    { code: 'ZLP', name: 'Zenith Labour Party' },
  ];

  const getPartyColor = (party: string) => {
    switch (party) {
      case 'APC': return 'bg-blue-100 text-blue-700';
      case 'PDP': return 'bg-red-100 text-red-700';
      case 'LP': return 'bg-green-100 text-green-700';
      case 'NNPP': return 'bg-orange-100 text-orange-700';
      case 'APGA': return 'bg-purple-100 text-purple-700';
      case 'ADC': return 'bg-teal-100 text-teal-700';
      case 'SDP': return 'bg-amber-100 text-amber-700';
      case 'YPP': return 'bg-cyan-100 text-cyan-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      middleName: '',
      partyAffiliation: 'APC',
      stateId: '',
      biography: '',
      performanceScore: 50,
      isActive: true,
    });
  };

  const handleEdit = (politician: Politician) => {
    setEditingPolitician(politician);
    setFormData({
      firstName: politician.firstName,
      lastName: politician.lastName,
      middleName: politician.middleName || '',
      partyAffiliation: politician.partyAffiliation,
      stateId: politician.stateId || '',
      biography: politician.biography || '',
      performanceScore: politician.performanceScore,
      isActive: politician.isActive,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPolitician) {
      updateMutation.mutate({ id: editingPolitician.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this politician?')) {
      deleteMutation.mutate(id);
    }
  };

  const filteredPoliticians = data?.politicians?.filter((p: Politician) => {
    const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  }) || [];

  const totalPages = data?.pagination?.totalPages || 1;

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
              <p className="text-2xl font-bold text-gray-900">{data?.pagination?.total || 0}</p>
              <p className="text-sm text-gray-500">Total Politicians</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="bg-green-50 p-2 rounded-lg">
              <Star className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{parties.length}</p>
              <p className="text-sm text-gray-500">Political Parties</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-50 p-2 rounded-lg">
              <MapPin className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">37</p>
              <p className="text-sm text-gray-500">States + FCT</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-50 p-2 rounded-lg">
              <Building className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">9</p>
              <p className="text-sm text-gray-500">Office Types</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search politicians..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex items-center space-x-3">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={selectedParty}
              onChange={(e) => setSelectedParty(e.target.value)}
            >
              <option value="">All Parties</option>
              {parties.map(party => (
                <option key={party.code} value={party.code}>{party.code}</option>
              ))}
            </select>
            <select
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
            >
              <option value="">All States</option>
              {statesData?.map((state: { id: string; name: string }) => (
                <option key={state.id} value={state.name}>{state.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Politicians Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Politician</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Party</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Office</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">State</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Score</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Status</th>
                    <th className="text-right py-4 px-6 text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredPoliticians.map((politician: Politician) => (
                    <tr key={politician.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {politician.firstName[0]}{politician.lastName[0]}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{politician.firstName} {politician.lastName}</p>
                            {politician.middleName && (
                              <p className="text-sm text-gray-500">{politician.middleName}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPartyColor(politician.partyAffiliation)}`}>
                          {politician.partyAffiliation}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {politician.Tenure?.[0]?.Office?.name || 'N/A'}
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {politician.State?.name || 'N/A'}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`font-semibold ${getScoreColor(politician.performanceScore)}`}>
                          {politician.performanceScore.toFixed(1)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          politician.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {politician.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end space-x-2">
                          <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(politician)}
                            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(politician.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
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
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                Showing page {currentPage} of {totalPages}
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingPolitician) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">
                {editingPolitician ? 'Edit Politician' : 'Add New Politician'}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingPolitician(null);
                  resetForm();
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                <input
                  type="text"
                  value={formData.middleName}
                  onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Party Affiliation *</label>
                  <select
                    value={formData.partyAffiliation}
                    onChange={(e) => setFormData({ ...formData, partyAffiliation: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  >
                    {parties.map(party => (
                      <option key={party.code} value={party.code}>{party.code} - {party.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <select
                    value={formData.stateId}
                    onChange={(e) => setFormData({ ...formData, stateId: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select State</option>
                    {statesData?.map((state: { id: string; name: string }) => (
                      <option key={state.id} value={state.id}>{state.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Biography</label>
                <textarea
                  value={formData.biography}
                  onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Performance Score</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.performanceScore}
                    onChange={(e) => setFormData({ ...formData, performanceScore: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Active</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingPolitician(null);
                    resetForm();
                  }}
                  className="px-6 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  <span>{editingPolitician ? 'Update' : 'Create'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
