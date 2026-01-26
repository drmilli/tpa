import { useState } from 'react';
import {
  TrendingUp, TrendingDown, Search, Filter, RefreshCw,
  ArrowUp, ArrowDown, Trophy, Medal, Award, Star
} from 'lucide-react';

interface RankedPolitician {
  id: string;
  rank: number;
  previousRank: number;
  name: string;
  party: string;
  office: string;
  score: number;
  votes: number;
  trend: 'up' | 'down' | 'same';
}

export default function RankingsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('overall');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const rankings: RankedPolitician[] = [
    { id: '1', rank: 1, previousRank: 2, name: 'Peter Obi', party: 'LP', office: 'Former Governor', score: 85, votes: 125000, trend: 'up' },
    { id: '2', rank: 2, previousRank: 1, name: 'Seyi Makinde', party: 'PDP', office: 'Governor', score: 82, votes: 98000, trend: 'down' },
    { id: '3', rank: 3, previousRank: 3, name: 'Babajide Sanwo-Olu', party: 'APC', office: 'Governor', score: 78, votes: 87000, trend: 'same' },
    { id: '4', rank: 4, previousRank: 6, name: 'Godwin Obaseki', party: 'PDP', office: 'Governor', score: 76, votes: 76000, trend: 'up' },
    { id: '5', rank: 5, previousRank: 4, name: 'Bola Tinubu', party: 'APC', office: 'President', score: 74, votes: 145000, trend: 'down' },
    { id: '6', rank: 6, previousRank: 5, name: 'Nyesom Wike', party: 'PDP', office: 'Minister', score: 72, votes: 65000, trend: 'down' },
    { id: '7', rank: 7, previousRank: 8, name: 'Atiku Abubakar', party: 'PDP', office: 'Former VP', score: 70, votes: 89000, trend: 'up' },
    { id: '8', rank: 8, previousRank: 7, name: 'Rotimi Akeredolu', party: 'APC', office: 'Governor', score: 68, votes: 54000, trend: 'down' },
  ];

  const categories = [
    { value: 'overall', label: 'Overall Rankings' },
    { value: 'governors', label: 'Governors' },
    { value: 'senators', label: 'Senators' },
    { value: 'ministers', label: 'Ministers' },
    { value: 'performance', label: 'Performance Score' },
  ];

  const getPartyColor = (party: string) => {
    switch (party) {
      case 'APC': return 'bg-blue-100 text-blue-700';
      case 'PDP': return 'bg-red-100 text-red-700';
      case 'LP': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Award className="w-6 h-6 text-orange-400" />;
    return <span className="w-6 h-6 flex items-center justify-center text-gray-500 font-bold">{rank}</span>;
  };

  const getTrendIcon = (trend: string, change: number) => {
    if (trend === 'up') return (
      <div className="flex items-center text-emerald-600">
        <ArrowUp className="w-4 h-4" />
        <span className="text-xs font-medium">{change}</span>
      </div>
    );
    if (trend === 'down') return (
      <div className="flex items-center text-red-500">
        <ArrowDown className="w-4 h-4" />
        <span className="text-xs font-medium">{change}</span>
      </div>
    );
    return <span className="text-gray-400 text-xs">-</span>;
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  const filteredRankings = rankings.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rankings Management</h1>
          <p className="text-gray-600 mt-1">View and manage politician performance rankings</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 flex items-center space-x-2 transition disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Refreshing...' : 'Refresh Rankings'}</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Top Performer</p>
              <p className="text-xl font-bold mt-1">{rankings[0]?.name}</p>
              <p className="text-sm text-yellow-100">{rankings[0]?.score}% score</p>
            </div>
            <Trophy className="w-10 h-10 text-yellow-200" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-50 p-2 rounded-lg">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{rankings.filter(r => r.trend === 'up').length}</p>
              <p className="text-sm text-gray-500">Moving Up</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="bg-red-50 p-2 rounded-lg">
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{rankings.filter(r => r.trend === 'down').length}</p>
              <p className="text-sm text-gray-500">Moving Down</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-50 p-2 rounded-lg">
              <Star className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{rankings.reduce((a, r) => a + r.votes, 0).toLocaleString()}</p>
              <p className="text-sm text-gray-500">Total Votes</p>
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
              placeholder="Search rankings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex items-center space-x-3">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Rankings Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Politician</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Party</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Office</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Votes</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRankings.map((politician) => (
                <tr key={politician.id} className={`hover:bg-gray-50 transition ${politician.rank <= 3 ? 'bg-yellow-50/30' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {getRankBadge(politician.rank)}
                    </div>
                  </td>
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
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: `${politician.score}%` }}
                        ></div>
                      </div>
                      <span className="font-semibold text-gray-900">{politician.score}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{politician.votes.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    {getTrendIcon(politician.trend, Math.abs(politician.previousRank - politician.rank))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start space-x-3">
        <div className="bg-blue-100 p-2 rounded-lg">
          <TrendingUp className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-medium text-blue-900">Rankings are updated daily</h3>
          <p className="text-sm text-blue-700 mt-1">
            Rankings are calculated based on user votes, performance metrics, and public sentiment analysis.
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
