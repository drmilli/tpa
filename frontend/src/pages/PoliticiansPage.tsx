import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '@/lib/api';
import SEO from '@/components/SEO';
import { HorizontalAd } from '@/components/AdUnit';
import {
  Search, Users, MapPin, Building, TrendingUp, ChevronRight,
  Filter, Grid, List, Loader2
} from 'lucide-react';

export default function PoliticiansPage() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    state: '',
    party: '',
    positionType: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data, isLoading } = useQuery({
    queryKey: ['politicians', filters],
    queryFn: async () => {
      const params = new URLSearchParams(filters as any);
      const response = await api.get(`/politicians?${params}`);
      return response.data.data;
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
  // All 36 Nigerian states + FCT
  const states = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
    'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT Abuja', 'Gombe',
    'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
    'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto',
    'Taraba', 'Yobe', 'Zamfara'
  ];

  const getPartyColor = (party: string) => {
    switch (party) {
      case 'APC': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'PDP': return 'bg-red-100 text-red-700 border-red-200';
      case 'LP': return 'bg-green-100 text-green-700 border-green-200';
      case 'APGA': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'NNPP': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'ADC': return 'bg-teal-100 text-teal-700 border-teal-200';
      case 'SDP': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'YPP': return 'bg-cyan-100 text-cyan-700 border-cyan-200';
      case 'PRP': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'AAC': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'AA': return 'bg-lime-100 text-lime-700 border-lime-200';
      case 'ADP': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'ZLP': return 'bg-sky-100 text-sky-700 border-sky-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-500';
  };

  // Filter politicians by search query
  const filteredPoliticians = data?.politicians?.filter((p: any) => {
    const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Nigerian Politicians"
        description="Explore profiles of Nigerian politicians, track their performance, and hold your representatives accountable. Find detailed information about governors, senators, and legislators."
        keywords="Nigerian politicians, governors, senators, house of representatives, state assembly, INEC, political profiles Nigeria"
        url="https://thepeoplesaffairs.com/politicians"
      />
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Nigerian Politicians
            </h1>
            <p className="text-xl text-primary-100">
              Explore profiles, track performance, and hold your representatives accountable.
              Find detailed information about politicians at every level of government.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 -mt-12 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-50 p-2 rounded-lg">
                <Users className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{data?.pagination?.total || 0}</p>
                <p className="text-sm text-gray-500">Politicians</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-50 p-2 rounded-lg">
                <Building className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">5</p>
                <p className="text-sm text-gray-500">Parties</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-50 p-2 rounded-lg">
                <MapPin className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">36</p>
                <p className="text-sm text-gray-500">States + FCT</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="bg-yellow-50 p-2 rounded-lg">
                <TrendingUp className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">72%</p>
                <p className="text-sm text-gray-500">Avg. Score</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search politicians by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={filters.state}
                  onChange={(e) => setFilters({ ...filters, state: e.target.value })}
                >
                  <option value="">All States</option>
                  {states.map(state => (
                    <option key={state} value={state.toLowerCase()}>{state}</option>
                  ))}
                </select>
              </div>
              <select
                className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={filters.party}
                onChange={(e) => setFilters({ ...filters, party: e.target.value })}
              >
                <option value="">All Parties</option>
                {parties.map(party => (
                  <option key={party.code} value={party.code}>{party.code} - {party.name}</option>
                ))}
              </select>
              <select
                className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={filters.positionType}
                onChange={(e) => setFilters({ ...filters, positionType: e.target.value })}
              >
                <option value="">All Positions</option>
                <option value="elected">Elected Officials</option>
                <option value="appointed">Appointed Officials</option>
              </select>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary-600 animate-spin mb-4" />
            <p className="text-gray-500">Loading politicians...</p>
          </div>
        ) : filteredPoliticians?.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No politicians found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPoliticians?.map((politician: any) => (
              <Link
                key={politician.id}
                to={`/politicians/${politician.id}`}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition group"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {politician.firstName?.[0]}{politician.lastName?.[0]}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPartyColor(politician.partyAffiliation)}`}>
                      {politician.partyAffiliation}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-primary-600 transition">
                    {politician.firstName} {politician.lastName}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">{politician.Tenure?.[0]?.Office?.name || 'Politician'}</p>
                  <div className="flex items-center text-sm text-gray-400 mb-4">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{politician.State?.name || 'Nigeria'}</span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-400">Performance Score</p>
                      <p className={`text-lg font-bold ${getScoreColor(politician.performanceScore)}`}>
                        {politician.performanceScore?.toFixed(1) || 0}/100
                      </p>
                    </div>
                    <div className="flex items-center text-primary-600 text-sm font-medium">
                      View Profile
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="divide-y divide-gray-100">
              {filteredPoliticians?.map((politician: any) => (
                <Link
                  key={politician.id}
                  to={`/politicians/${politician.id}`}
                  className="flex items-center p-4 hover:bg-gray-50 transition group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold mr-4 flex-shrink-0">
                    {politician.firstName?.[0]}{politician.lastName?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition">
                      {politician.firstName} {politician.lastName}
                    </h3>
                    <div className="flex items-center space-x-3 text-sm text-gray-500">
                      <span>{politician.Tenure?.[0]?.Office?.name || 'Politician'}</span>
                      <span>•</span>
                      <span className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {politician.State?.name || 'Nigeria'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPartyColor(politician.partyAffiliation)}`}>
                      {politician.partyAffiliation}
                    </span>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Score</p>
                      <p className={`font-bold ${getScoreColor(politician.performanceScore)}`}>
                        {politician.performanceScore?.toFixed(1) || 0}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Pagination */}
        {data?.pagination?.total > filters.limit && (
          <div className="flex items-center justify-center mt-8 space-x-2">
            <button
              onClick={() => setFilters({ ...filters, page: Math.max(1, filters.page - 1) })}
              disabled={filters.page === 1}
              className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-4 py-2 bg-primary-50 text-primary-700 rounded-lg font-medium">
              Page {filters.page}
            </span>
            <button
              onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
              disabled={filters.page * filters.limit >= data?.pagination?.total}
              className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}

        {/* Ad after list */}
        <HorizontalAd className="mt-8" />

        {/* Info CTA */}
        <div className="mt-12 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-3">Know Your Representatives</h3>
          <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
            Track campaign promises, view performance metrics, and participate in polls
            to hold your elected officials accountable.
          </p>
          <Link
            to="/rankings"
            className="inline-flex items-center px-6 py-3 bg-white text-primary-700 rounded-xl hover:bg-gray-100 transition font-semibold"
          >
            View Rankings
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
