import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp, TrendingDown, Search, Filter, Trophy, Medal, Award,
  ArrowUp, ArrowDown, Star, Users, ChevronRight, Loader2
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

interface Office {
  id: string;
  name: string;
  type: string;
}

export default function RankingsPage() {
  const [rankings, setRankings] = useState<RankedPolitician[]>([]);
  const [offices, setOffices] = useState<Office[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOffice, setSelectedOffice] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rankingsRes, officesRes] = await Promise.all([
        api.get('/rankings'),
        api.get('/offices'),
      ]);
      setRankings(rankingsRes.data.data || []);
      setOffices(officesRes.data.data?.offices || []);
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

  const filteredRankings = rankings.filter(r => {
    const fullName = `${r.Politician.firstName} ${r.Politician.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase());
    const matchesOffice = selectedOffice === 'all' || r.Office.id === selectedOffice;
    return matchesSearch && matchesOffice;
  });

  const topThree = filteredRankings.slice(0, 3);

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
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Politician Rankings
            </h1>
            <p className="text-xl text-primary-100">
              See how Nigerian politicians are ranked based on performance, public sentiment, and accountability.
              Your votes help shape these rankings.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 -mt-12 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-50 p-2 rounded-lg">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{rankings.length}</p>
                <p className="text-sm text-gray-500">Politicians Ranked</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-50 p-2 rounded-lg">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{offices.length}</p>
                <p className="text-sm text-gray-500">Offices Tracked</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="bg-yellow-50 p-2 rounded-lg">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {rankings.length > 0 ? (rankings.reduce((a, r) => a + r.totalScore, 0) / rankings.length).toFixed(1) : 0}
                </p>
                <p className="text-sm text-gray-500">Avg. Score</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-50 p-2 rounded-lg">
                <Trophy className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {topThree[0] ? `${topThree[0].Politician.firstName.charAt(0)}. ${topThree[0].Politician.lastName}` : '-'}
                </p>
                <p className="text-sm text-gray-500">Top Performer</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-8 shadow-sm">
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
            <div className="flex items-center space-x-3">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedOffice}
                onChange={(e) => setSelectedOffice(e.target.value)}
                className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Offices</option>
                {offices.map(office => (
                  <option key={office.id} value={office.id}>{office.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Top 3 Podium */}
        {topThree.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Top Performers</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Second Place */}
              {topThree[1] && (
                <div className="order-2 md:order-1 bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg md:mt-8">
                  <div className="text-center">
                    <div className="relative inline-block mb-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto">
                        {topThree[1].Politician.firstName[0]}{topThree[1].Politician.lastName[0]}
                      </div>
                      <Medal className="w-8 h-8 text-gray-400 absolute -bottom-2 left-1/2 -translate-x-1/2" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {topThree[1].Politician.firstName} {topThree[1].Politician.lastName}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">{topThree[1].Office.name}</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getPartyColor(topThree[1].Politician.partyAffiliation)}`}>
                      {topThree[1].Politician.partyAffiliation}
                    </span>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-3xl font-bold text-gray-900">{topThree[1].totalScore.toFixed(1)}%</p>
                      <p className="text-sm text-gray-500">{topThree[1].Politician.State?.name || 'Nigeria'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* First Place */}
              {topThree[0] && (
                <div className="order-1 md:order-2 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 border-2 border-yellow-300 shadow-xl">
                  <div className="text-center">
                    <div className="relative inline-block mb-4">
                      <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto shadow-lg">
                        {topThree[0].Politician.firstName[0]}{topThree[0].Politician.lastName[0]}
                      </div>
                      <Trophy className="w-10 h-10 text-yellow-500 absolute -bottom-2 left-1/2 -translate-x-1/2" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {topThree[0].Politician.firstName} {topThree[0].Politician.lastName}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{topThree[0].Office.name}</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getPartyColor(topThree[0].Politician.partyAffiliation)}`}>
                      {topThree[0].Politician.partyAffiliation}
                    </span>
                    <div className="mt-4 pt-4 border-t border-yellow-200">
                      <p className="text-4xl font-bold text-gray-900">{topThree[0].totalScore.toFixed(1)}%</p>
                      <p className="text-sm text-gray-600">{topThree[0].Politician.State?.name || 'Nigeria'}</p>
                    </div>
                    <Link
                      to={`/politicians/${topThree[0].Politician.id}`}
                      className="inline-flex items-center mt-4 text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      View Profile
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              )}

              {/* Third Place */}
              {topThree[2] && (
                <div className="order-3 bg-white rounded-2xl p-6 border-2 border-orange-200 shadow-lg md:mt-12">
                  <div className="text-center">
                    <div className="relative inline-block mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-300 to-orange-400 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto">
                        {topThree[2].Politician.firstName[0]}{topThree[2].Politician.lastName[0]}
                      </div>
                      <Award className="w-7 h-7 text-orange-400 absolute -bottom-2 left-1/2 -translate-x-1/2" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {topThree[2].Politician.firstName} {topThree[2].Politician.lastName}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">{topThree[2].Office.name}</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getPartyColor(topThree[2].Politician.partyAffiliation)}`}>
                      {topThree[2].Politician.partyAffiliation}
                    </span>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-3xl font-bold text-gray-900">{topThree[2].totalScore.toFixed(1)}%</p>
                      <p className="text-sm text-gray-500">{topThree[2].Politician.State?.name || 'Nigeria'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Full Rankings Table */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Full Rankings</h2>
          </div>
          {filteredRankings.length === 0 ? (
            <div className="p-12 text-center">
              <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No rankings found</h3>
              <p className="text-gray-500">Check back later for updated rankings.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rank</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Politician</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Party</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Office</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Score</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRankings.map((ranking, index) => (
                    <tr key={ranking.id} className={`hover:bg-gray-50 transition ${index < 3 ? 'bg-yellow-50/30' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {getRankBadge(ranking.rank)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {ranking.Politician.firstName[0]}{ranking.Politician.lastName[0]}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {ranking.Politician.firstName} {ranking.Politician.lastName}
                            </p>
                            <p className="text-sm text-gray-500">{ranking.Politician.State?.name || 'Nigeria'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPartyColor(ranking.Politician.partyAffiliation)}`}>
                          {ranking.Politician.partyAffiliation}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{ranking.Office.name}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-100 rounded-full h-2">
                            <div
                              className="bg-primary-600 h-2 rounded-full"
                              style={{ width: `${ranking.totalScore}%` }}
                            ></div>
                          </div>
                          <span className="font-semibold text-gray-900">{ranking.totalScore.toFixed(1)}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          to={`/politicians/${ranking.Politician.id}`}
                          className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                        >
                          View Profile
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Info Banner */}
        <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-blue-900 text-lg mb-2">How Rankings Work</h3>
              <p className="text-blue-800">
                Rankings are calculated based on multiple factors including user votes, performance metrics,
                promise fulfillment rates, and public sentiment analysis. They are updated regularly to reflect
                the most accurate representation of public opinion.
              </p>
              <Link to="/about" className="inline-flex items-center mt-3 text-blue-600 hover:text-blue-700 font-medium">
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
