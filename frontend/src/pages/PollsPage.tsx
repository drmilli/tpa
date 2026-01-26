import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Vote, Users, Calendar, Clock, CheckCircle, BarChart2,
  ChevronRight, Search, Filter, TrendingUp
} from 'lucide-react';

interface Poll {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'active' | 'ended' | 'upcoming';
  totalVotes: number;
  options: PollOption[];
  startDate: string;
  endDate: string;
  hasVoted?: boolean;
}

interface PollOption {
  id: string;
  text: string;
  votes: number;
  percentage: number;
}

export default function PollsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Mock data - will be replaced with API data
  const polls: Poll[] = [
    {
      id: '1',
      title: 'Best Performing Governor 2024',
      description: 'Vote for the governor who has delivered the most impactful projects and policies in 2024.',
      category: 'Governors',
      status: 'active',
      totalVotes: 12500,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      hasVoted: false,
      options: [
        { id: '1', text: 'Seyi Makinde (Oyo)', votes: 4500, percentage: 36 },
        { id: '2', text: 'Babajide Sanwo-Olu (Lagos)', votes: 3800, percentage: 30.4 },
        { id: '3', text: 'Godwin Obaseki (Edo)', votes: 2200, percentage: 17.6 },
        { id: '4', text: 'Peter Mbah (Enugu)', votes: 2000, percentage: 16 },
      ],
    },
    {
      id: '2',
      title: 'Most Transparent Minister',
      description: 'Which minister has shown the most transparency in their operations and decision-making?',
      category: 'Ministers',
      status: 'active',
      totalVotes: 8900,
      startDate: '2024-02-01',
      endDate: '2024-06-30',
      hasVoted: true,
      options: [
        { id: '1', text: 'Wale Edun', votes: 3200, percentage: 36 },
        { id: '2', text: 'Nyesom Wike', votes: 2800, percentage: 31.5 },
        { id: '3', text: 'Festus Keyamo', votes: 1500, percentage: 16.8 },
        { id: '4', text: 'Dele Alake', votes: 1400, percentage: 15.7 },
      ],
    },
    {
      id: '3',
      title: 'Presidential Performance Rating',
      description: 'How would you rate the overall performance of the current administration?',
      category: 'Federal',
      status: 'active',
      totalVotes: 25000,
      startDate: '2024-01-15',
      endDate: '2024-12-31',
      hasVoted: false,
      options: [
        { id: '1', text: 'Excellent', votes: 5000, percentage: 20 },
        { id: '2', text: 'Good', votes: 7500, percentage: 30 },
        { id: '3', text: 'Average', votes: 6250, percentage: 25 },
        { id: '4', text: 'Poor', votes: 3750, percentage: 15 },
        { id: '5', text: 'Very Poor', votes: 2500, percentage: 10 },
      ],
    },
    {
      id: '4',
      title: 'Best Senator 2023',
      description: 'Vote for the best performing senator of 2023.',
      category: 'Senators',
      status: 'ended',
      totalVotes: 15600,
      startDate: '2023-01-01',
      endDate: '2023-12-31',
      hasVoted: true,
      options: [
        { id: '1', text: 'Opeyemi Bamidele', votes: 5200, percentage: 33.3 },
        { id: '2', text: 'Adams Oshiomhole', votes: 4800, percentage: 30.8 },
        { id: '3', text: 'Ned Nwoko', votes: 3200, percentage: 20.5 },
        { id: '4', text: 'Dino Melaye', votes: 2400, percentage: 15.4 },
      ],
    },
    {
      id: '5',
      title: 'Infrastructure Development Poll',
      description: 'Which state has made the most progress in infrastructure development?',
      category: 'States',
      status: 'upcoming',
      totalVotes: 0,
      startDate: '2024-03-01',
      endDate: '2024-09-30',
      hasVoted: false,
      options: [
        { id: '1', text: 'Lagos', votes: 0, percentage: 0 },
        { id: '2', text: 'Rivers', votes: 0, percentage: 0 },
        { id: '3', text: 'Oyo', votes: 0, percentage: 0 },
      ],
    },
  ];

  const categories = ['all', 'Governors', 'Ministers', 'Senators', 'Federal', 'States'];
  const statuses = ['all', 'active', 'ended', 'upcoming'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700';
      case 'ended': return 'bg-gray-100 text-gray-700';
      case 'upcoming': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <BarChart2 className="w-4 h-4" />;
      case 'ended': return <CheckCircle className="w-4 h-4" />;
      case 'upcoming': return <Clock className="w-4 h-4" />;
      default: return <Vote className="w-4 h-4" />;
    }
  };

  const filteredPolls = polls.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const activePolls = polls.filter(p => p.status === 'active');
  const totalVotes = polls.reduce((acc, p) => acc + p.totalVotes, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Opinion Polls
            </h1>
            <p className="text-xl text-purple-100">
              Make your voice heard! Participate in polls to help shape public opinion
              and hold our leaders accountable.
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
                <Vote className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{polls.length}</p>
                <p className="text-sm text-gray-500">Total Polls</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-50 p-2 rounded-lg">
                <BarChart2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{activePolls.length}</p>
                <p className="text-sm text-gray-500">Active Polls</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
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
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="bg-yellow-50 p-2 rounded-lg">
                <TrendingUp className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {polls.filter(p => p.hasVoted).length}
                </p>
                <p className="text-sm text-gray-500">Polls Participated</p>
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
                placeholder="Search polls..."
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
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Featured Active Poll */}
        {activePolls[0] && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Featured Poll</h2>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(activePolls[0].status)}`}>
                    {getStatusIcon(activePolls[0].status)}
                    <span className="ml-1">{activePolls[0].status}</span>
                  </span>
                  <span className="ml-2 text-sm text-gray-500">{activePolls[0].category}</span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-purple-700">{activePolls[0].totalVotes.toLocaleString()}</p>
                  <p className="text-sm text-purple-600">total votes</p>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{activePolls[0].title}</h3>
              <p className="text-gray-600 mb-6">{activePolls[0].description}</p>

              <div className="space-y-3 mb-6">
                {activePolls[0].options.slice(0, 3).map((option) => (
                  <div key={option.id} className="relative">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{option.text}</span>
                      <span className="text-sm font-semibold text-purple-700">{option.percentage}%</span>
                    </div>
                    <div className="w-full h-3 bg-white rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-500"
                        style={{ width: `${option.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>Ends {new Date(activePolls[0].endDate).toLocaleDateString()}</span>
                </div>
                <Link
                  to={`/polls/${activePolls[0].id}`}
                  className="inline-flex items-center px-6 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition font-medium"
                >
                  {activePolls[0].hasVoted ? 'View Results' : 'Vote Now'}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Polls Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">All Polls</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPolls.map((poll) => (
              <div key={poll.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition group">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(poll.status)}`}>
                      {getStatusIcon(poll.status)}
                      <span className="ml-1">{poll.status}</span>
                    </span>
                    {poll.hasVoted && (
                      <span className="flex items-center text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Voted
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition">
                    {poll.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{poll.description}</p>

                  {poll.status !== 'upcoming' && (
                    <div className="space-y-2 mb-4">
                      {poll.options.slice(0, 2).map((option) => (
                        <div key={option.id}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-600 truncate max-w-[70%]">{option.text}</span>
                            <span className="text-xs font-medium text-gray-700">{option.percentage}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary-500 rounded-full"
                              style={{ width: `${option.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                      {poll.options.length > 2 && (
                        <p className="text-xs text-gray-400">+{poll.options.length - 2} more options</p>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{poll.totalVotes.toLocaleString()} votes</span>
                    </div>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">{poll.category}</span>
                  </div>
                </div>

                <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>
                        {poll.status === 'upcoming'
                          ? `Starts ${new Date(poll.startDate).toLocaleDateString()}`
                          : poll.status === 'ended'
                          ? `Ended ${new Date(poll.endDate).toLocaleDateString()}`
                          : `Ends ${new Date(poll.endDate).toLocaleDateString()}`
                        }
                      </span>
                    </div>
                    <Link
                      to={`/polls/${poll.id}`}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium inline-flex items-center"
                    >
                      {poll.status === 'upcoming' ? 'View Details' : poll.hasVoted ? 'See Results' : 'Vote'}
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-3">Your Opinion Matters</h3>
          <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
            By participating in polls, you help create a data-driven picture of public sentiment
            that can influence policy decisions and hold our leaders accountable.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center px-6 py-3 bg-white text-purple-700 rounded-xl hover:bg-gray-100 transition font-semibold"
          >
            Create an Account to Vote
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
