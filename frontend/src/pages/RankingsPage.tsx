import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp, TrendingDown, Search, Filter, Trophy, Medal, Award,
  ArrowUp, ArrowDown, Star, Users, ChevronRight
} from 'lucide-react';

interface RankedPolitician {
  id: string;
  rank: number;
  previousRank: number;
  name: string;
  party: string;
  office: string;
  state: string;
  score: number;
  votes: number;
  trend: 'up' | 'down' | 'same';
  image?: string;
}

export default function RankingsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('overall');

  // Mock data - will be replaced with API data
  const rankings: RankedPolitician[] = [
    { id: '1', rank: 1, previousRank: 2, name: 'Peter Obi', party: 'LP', office: 'Former Governor', state: 'Anambra', score: 85, votes: 125000, trend: 'up' },
    { id: '2', rank: 2, previousRank: 1, name: 'Seyi Makinde', party: 'PDP', office: 'Governor', state: 'Oyo', score: 82, votes: 98000, trend: 'down' },
    { id: '3', rank: 3, previousRank: 3, name: 'Babajide Sanwo-Olu', party: 'APC', office: 'Governor', state: 'Lagos', score: 78, votes: 87000, trend: 'same' },
    { id: '4', rank: 4, previousRank: 6, name: 'Godwin Obaseki', party: 'PDP', office: 'Governor', state: 'Edo', score: 76, votes: 76000, trend: 'up' },
    { id: '5', rank: 5, previousRank: 4, name: 'Bola Tinubu', party: 'APC', office: 'President', state: 'Federal', score: 74, votes: 145000, trend: 'down' },
    { id: '6', rank: 6, previousRank: 5, name: 'Nyesom Wike', party: 'PDP', office: 'Minister', state: 'FCT', score: 72, votes: 65000, trend: 'down' },
    { id: '7', rank: 7, previousRank: 8, name: 'Atiku Abubakar', party: 'PDP', office: 'Former VP', state: 'Adamawa', score: 70, votes: 89000, trend: 'up' },
    { id: '8', rank: 8, previousRank: 7, name: 'Rotimi Akeredolu', party: 'APC', office: 'Governor', state: 'Ondo', score: 68, votes: 54000, trend: 'down' },
    { id: '9', rank: 9, previousRank: 10, name: 'Nasir El-Rufai', party: 'APC', office: 'Former Governor', state: 'Kaduna', score: 66, votes: 48000, trend: 'up' },
    { id: '10', rank: 10, previousRank: 9, name: 'Abdullahi Ganduje', party: 'APC', office: 'Former Governor', state: 'Kano', score: 64, votes: 42000, trend: 'down' },
  ];

  const categories = [
    { value: 'overall', label: 'Overall Rankings' },
    { value: 'governors', label: 'Governors' },
    { value: 'senators', label: 'Senators' },
    { value: 'ministers', label: 'Ministers' },
    { value: 'house-reps', label: 'House of Reps' },
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
    if (rank === 1) return <Trophy className="w-8 h-8 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-8 h-8 text-gray-400" />;
    if (rank === 3) return <Award className="w-8 h-8 text-orange-400" />;
    return (
      <span className="w-8 h-8 flex items-center justify-center text-xl font-bold text-gray-500">
        {rank}
      </span>
    );
  };

  const getTrendIcon = (trend: string, change: number) => {
    if (trend === 'up') return (
      <div className="flex items-center text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
        <ArrowUp className="w-4 h-4" />
        <span className="text-xs font-medium ml-1">{change}</span>
      </div>
    );
    if (trend === 'down') return (
      <div className="flex items-center text-red-500 bg-red-50 px-2 py-1 rounded-full">
        <ArrowDown className="w-4 h-4" />
        <span className="text-xs font-medium ml-1">{change}</span>
      </div>
    );
    return <span className="text-gray-400 text-sm bg-gray-100 px-3 py-1 rounded-full">-</span>;
  };

  const filteredRankings = rankings.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const topThree = filteredRankings.slice(0, 3);

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
                <p className="text-2xl font-bold text-gray-900">{rankings.filter(r => r.trend === 'up').length}</p>
                <p className="text-sm text-gray-500">Moving Up</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
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
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="bg-yellow-50 p-2 rounded-lg">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{rankings.reduce((a, r) => a + r.votes, 0).toLocaleString()}</p>
                <p className="text-sm text-gray-500">Total Votes</p>
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

        {/* Top 3 Podium */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Top Performers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Second Place */}
            {topThree[1] && (
              <div className="order-2 md:order-1 bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg md:mt-8">
                <div className="text-center">
                  <div className="relative inline-block mb-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto">
                      {topThree[1].name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <Medal className="w-8 h-8 text-gray-400 absolute -bottom-2 left-1/2 -translate-x-1/2" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{topThree[1].name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{topThree[1].office}</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getPartyColor(topThree[1].party)}`}>
                    {topThree[1].party}
                  </span>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-3xl font-bold text-gray-900">{topThree[1].score}%</p>
                    <p className="text-sm text-gray-500">{topThree[1].votes.toLocaleString()} votes</p>
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
                      {topThree[0].name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <Trophy className="w-10 h-10 text-yellow-500 absolute -bottom-2 left-1/2 -translate-x-1/2" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{topThree[0].name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{topThree[0].office}</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getPartyColor(topThree[0].party)}`}>
                    {topThree[0].party}
                  </span>
                  <div className="mt-4 pt-4 border-t border-yellow-200">
                    <p className="text-4xl font-bold text-gray-900">{topThree[0].score}%</p>
                    <p className="text-sm text-gray-600">{topThree[0].votes.toLocaleString()} votes</p>
                  </div>
                  <Link
                    to={`/politicians/${topThree[0].id}`}
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
                      {topThree[2].name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <Award className="w-7 h-7 text-orange-400 absolute -bottom-2 left-1/2 -translate-x-1/2" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{topThree[2].name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{topThree[2].office}</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getPartyColor(topThree[2].party)}`}>
                    {topThree[2].party}
                  </span>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-3xl font-bold text-gray-900">{topThree[2].score}%</p>
                    <p className="text-sm text-gray-500">{topThree[2].votes.toLocaleString()} votes</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Full Rankings Table */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Full Rankings</h2>
          </div>
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
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRankings.map((politician) => (
                  <tr key={politician.id} className={`hover:bg-gray-50 transition ${politician.rank <= 3 ? 'bg-yellow-50/30' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {getRankBadge(politician.rank)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {politician.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{politician.name}</p>
                          <p className="text-sm text-gray-500">{politician.state}</p>
                        </div>
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
                        <div className="w-20 bg-gray-100 rounded-full h-2">
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
                    <td className="px-6 py-4">
                      <Link
                        to={`/politicians/${politician.id}`}
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
                promise fulfillment rates, and public sentiment analysis. They are updated daily to reflect
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
