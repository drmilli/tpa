import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HorizontalAd } from '@/components/AdUnit';
import {
  TrendingUp, Search, Trophy, Medal, Award,
  Star, Users, ChevronRight, Loader2, Crown, Building2,
  Landmark, UserCheck, Building, MapPin
} from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface RankedPolitician {
  id: string;
  rank: number;
  totalScore: number;
  Politician: {
    id: string;
    firstName: string;
    lastName: string;
    photoUrl: string | null;
    partyAffiliation: string;
    performanceScore: number;
    State: {
      id: string;
      name: string;
    } | null;
  };
  Office: {
    id: string;
    name: string;
    type: string;
  };
}

interface State {
  id: string;
  name: string;
}

// Category definitions
const categories = [
  { id: 'all', name: 'All', icon: Users, types: [] },
  { id: 'executive', name: 'Executive', icon: Crown, types: ['PRESIDENT', 'VICE_PRESIDENT'] },
  { id: 'governors', name: 'Governors', icon: Building2, types: ['GOVERNOR', 'DEPUTY_GOVERNOR'] },
  { id: 'senators', name: 'Senators', icon: Landmark, types: ['SENATOR'] },
  { id: 'house_of_reps', name: 'House of Reps', icon: Building, types: ['HOUSE_OF_REPS'] },
  { id: 'state_assembly', name: 'State Assembly', icon: MapPin, types: ['STATE_ASSEMBLY'] },
  { id: 'ministers', name: 'Ministers', icon: UserCheck, types: ['MINISTER', 'SPECIAL_ADVISER', 'AMBASSADOR'] },
  { id: 'commissioners', name: 'Commissioners', icon: UserCheck, types: ['COMMISSIONER', 'SSG'] },
  { id: 'local_govt', name: 'LG Chairmen', icon: Building, types: ['LG_CHAIRMAN', 'COUNCILLOR'] },
  { id: 'past_leaders', name: 'Past Leaders', icon: Crown, types: ['FORMER_PRESIDENT', 'FORMER_GOVERNOR'] },
];

export default function RankingsPage() {
  const [rankings, setRankings] = useState<RankedPolitician[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedState, setSelectedState] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rankingsRes, statesRes] = await Promise.all([
        api.get('/rankings'),
        api.get('/locations/states'),
      ]);
      setRankings(rankingsRes.data.data || []);
      setStates(statesRes.data.data?.states || []);
    } catch (error: any) {
      toast.error('Failed to load rankings');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getPartyColor = (party: string) => {
    switch (party) {
      case 'APC': return 'bg-blue-100 text-blue-700';
      case 'PDP': return 'bg-red-100 text-red-700';
      case 'LP': return 'bg-green-100 text-green-700';
      case 'APGA': return 'bg-purple-100 text-purple-700';
      case 'NNPP': return 'bg-orange-100 text-orange-700';
      case 'ADC': return 'bg-teal-100 text-teal-700';
      case 'SDP': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Trophy className="w-8 h-8 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-8 h-8 text-gray-400" />;
    if (rank === 3) return <Award className="w-8 h-8 text-orange-400" />;
    return (
      <span className="w-8 h-8 flex items-center justify-center text-xl font-bold text-gray-500">
        {rank}
      </span>
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-emerald-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-500';
  };

  // Filter rankings based on category, state, and search
  const filteredRankings = rankings.filter(r => {
    const fullName = `${r.Politician.firstName} ${r.Politician.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase());

    const category = categories.find(c => c.id === selectedCategory);
    const matchesCategory = selectedCategory === 'all' ||
      (category && category.types.includes(r.Office.type));

    const matchesState = selectedState === 'all' ||
      r.Politician.State?.id === selectedState;

    return matchesSearch && matchesCategory && matchesState;
  });

  // Sort and assign local ranks within category
  const sortedRankings = [...filteredRankings]
    .sort((a, b) => b.totalScore - a.totalScore)
    .map((r, index) => ({ ...r, localRank: index + 1 }));

  const topThree = sortedRankings.slice(0, 3);

  // Get category stats
  const getCategoryCount = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (categoryId === 'all') return rankings.length;
    if (!category) return 0;
    return rankings.filter(r => category.types.includes(r.Office.type)).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading rankings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Politician Rankings
            </h1>
            <p className="text-xl text-primary-100">
              See how Nigerian politicians are ranked based on performance, public sentiment, and accountability.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Category Tabs */}
        <div className="bg-white rounded-xl border border-gray-100 p-2 mb-6 shadow-sm -mt-8 overflow-x-auto">
          <div className="flex space-x-1 min-w-max">
            {categories.map((category) => {
              const Icon = category.icon;
              const count = getCategoryCount(category.id);
              const isActive = selectedCategory === category.id;

              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg font-medium transition whitespace-nowrap ${
                    isActive
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{category.name}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20' : 'bg-gray-200'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-50 p-2 rounded-lg">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{sortedRankings.length}</p>
                <p className="text-sm text-gray-500">Politicians</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-50 p-2 rounded-lg">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {sortedRankings.length > 0
                    ? Math.max(...sortedRankings.map(r => r.totalScore)).toFixed(0)
                    : 0}%
                </p>
                <p className="text-sm text-gray-500">Highest Score</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="bg-yellow-50 p-2 rounded-lg">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {sortedRankings.length > 0
                    ? (sortedRankings.reduce((a, r) => a + r.totalScore, 0) / sortedRankings.length).toFixed(0)
                    : 0}%
                </p>
                <p className="text-sm text-gray-500">Avg. Score</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-50 p-2 rounded-lg">
                <Trophy className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900 truncate">
                  {topThree[0] ? `${topThree[0].Politician.firstName.charAt(0)}. ${topThree[0].Politician.lastName}` : '-'}
                </p>
                <p className="text-sm text-gray-500">Top Performer</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Row */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
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
            {/* State filter - show for state-level offices */}
            {(selectedCategory === 'governors' || selectedCategory === 'state_assembly' || selectedCategory === 'local_govt') && (
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All States</option>
                {states.map(state => (
                  <option key={state.id} value={state.id}>{state.name}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Top 3 Podium */}
        {topThree.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Top {categories.find(c => c.id === selectedCategory)?.name || 'Politicians'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Second Place */}
              {topThree[1] && (
                <div className="order-2 md:order-1 bg-white rounded-xl p-5 border-2 border-gray-200 shadow-md md:mt-6">
                  <div className="text-center">
                    <div className="relative inline-block mb-3">
                      {topThree[1].Politician.photoUrl ? (
                        <img
                          src={topThree[1].Politician.photoUrl}
                          alt={`${topThree[1].Politician.firstName} ${topThree[1].Politician.lastName}`}
                          className="w-16 h-16 rounded-full object-cover mx-auto border-2 border-gray-300"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto">
                          {topThree[1].Politician.firstName[0]}{topThree[1].Politician.lastName[0]}
                        </div>
                      )}
                      <Medal className="w-6 h-6 text-gray-400 absolute -bottom-1 left-1/2 -translate-x-1/2" />
                    </div>
                    <h3 className="font-bold text-gray-900">
                      {topThree[1].Politician.firstName} {topThree[1].Politician.lastName}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">{topThree[1].Office.name}</p>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${getPartyColor(topThree[1].Politician.partyAffiliation)}`}>
                      {topThree[1].Politician.partyAffiliation}
                    </span>
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className={`text-2xl font-bold ${getScoreColor(topThree[1].totalScore)}`}>
                        {topThree[1].totalScore.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* First Place */}
              {topThree[0] && (
                <div className="order-1 md:order-2 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-5 border-2 border-yellow-300 shadow-lg">
                  <div className="text-center">
                    <div className="relative inline-block mb-3">
                      {topThree[0].Politician.photoUrl ? (
                        <img
                          src={topThree[0].Politician.photoUrl}
                          alt={`${topThree[0].Politician.firstName} ${topThree[0].Politician.lastName}`}
                          className="w-20 h-20 rounded-full object-cover mx-auto border-4 border-yellow-400 shadow-md"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto shadow-lg">
                          {topThree[0].Politician.firstName[0]}{topThree[0].Politician.lastName[0]}
                        </div>
                      )}
                      <Trophy className="w-8 h-8 text-yellow-500 absolute -bottom-2 left-1/2 -translate-x-1/2" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {topThree[0].Politician.firstName} {topThree[0].Politician.lastName}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{topThree[0].Office.name}</p>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${getPartyColor(topThree[0].Politician.partyAffiliation)}`}>
                      {topThree[0].Politician.partyAffiliation}
                    </span>
                    <div className="mt-3 pt-3 border-t border-yellow-200">
                      <p className={`text-3xl font-bold ${getScoreColor(topThree[0].totalScore)}`}>
                        {topThree[0].totalScore.toFixed(1)}%
                      </p>
                      <p className="text-xs text-gray-600">{topThree[0].Politician.State?.name || 'Nigeria'}</p>
                    </div>
                    <Link
                      to={`/politicians/${topThree[0].Politician.id}`}
                      className="inline-flex items-center mt-3 text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      View Profile
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              )}

              {/* Third Place */}
              {topThree[2] && (
                <div className="order-3 bg-white rounded-xl p-5 border-2 border-orange-200 shadow-md md:mt-10">
                  <div className="text-center">
                    <div className="relative inline-block mb-3">
                      {topThree[2].Politician.photoUrl ? (
                        <img
                          src={topThree[2].Politician.photoUrl}
                          alt={`${topThree[2].Politician.firstName} ${topThree[2].Politician.lastName}`}
                          className="w-14 h-14 rounded-full object-cover mx-auto border-2 border-orange-300"
                        />
                      ) : (
                        <div className="w-14 h-14 bg-gradient-to-br from-orange-300 to-orange-400 rounded-full flex items-center justify-center text-white text-lg font-bold mx-auto">
                          {topThree[2].Politician.firstName[0]}{topThree[2].Politician.lastName[0]}
                        </div>
                      )}
                      <Award className="w-5 h-5 text-orange-400 absolute -bottom-1 left-1/2 -translate-x-1/2" />
                    </div>
                    <h3 className="font-bold text-gray-900">
                      {topThree[2].Politician.firstName} {topThree[2].Politician.lastName}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">{topThree[2].Office.name}</p>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${getPartyColor(topThree[2].Politician.partyAffiliation)}`}>
                      {topThree[2].Politician.partyAffiliation}
                    </span>
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className={`text-2xl font-bold ${getScoreColor(topThree[2].totalScore)}`}>
                        {topThree[2].totalScore.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Full Rankings Table */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              {selectedCategory === 'all' ? 'All Rankings' : `${categories.find(c => c.id === selectedCategory)?.name} Rankings`}
            </h2>
            <span className="text-sm text-gray-500">{sortedRankings.length} politicians</span>
          </div>
          {sortedRankings.length === 0 ? (
            <div className="p-12 text-center">
              <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No rankings found</h3>
              <p className="text-gray-500">Try selecting a different category or search term.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">Rank</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Politician</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Party</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Office</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">State</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Score</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sortedRankings.map((ranking: any) => (
                    <tr key={ranking.id} className={`hover:bg-gray-50 transition ${ranking.localRank <= 3 ? 'bg-yellow-50/30' : ''}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          {getRankBadge(ranking.localRank)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-3">
                          {ranking.Politician.photoUrl ? (
                            <img
                              src={ranking.Politician.photoUrl}
                              alt=""
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {ranking.Politician.firstName[0]}{ranking.Politician.lastName[0]}
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">
                              {ranking.Politician.firstName} {ranking.Politician.lastName}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getPartyColor(ranking.Politician.partyAffiliation)}`}>
                          {ranking.Politician.partyAffiliation}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{ranking.Office.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{ranking.Politician.State?.name || 'Federal'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-100 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                ranking.totalScore >= 70 ? 'bg-emerald-500' :
                                ranking.totalScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${ranking.totalScore}%` }}
                            ></div>
                          </div>
                          <span className={`font-semibold ${getScoreColor(ranking.totalScore)}`}>
                            {ranking.totalScore.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          to={`/politicians/${ranking.Politician.id}`}
                          className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Ad before info banner */}
        <HorizontalAd className="mt-8" />

        {/* Info Banner */}
        <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <div className="bg-blue-100 p-3 rounded-xl flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-blue-900 text-lg mb-2">How Rankings Work</h3>
              <p className="text-blue-800 text-sm">
                Rankings are calculated based on multiple factors including promise fulfillment,
                legislative activity, project completion, public sentiment, and media presence.
                They are updated regularly to reflect the most accurate representation of politician performance.
              </p>
              <Link to="/methodology" className="inline-flex items-center mt-3 text-blue-600 hover:text-blue-700 font-medium text-sm">
                Learn more about our methodology
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
