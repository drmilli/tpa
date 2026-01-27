import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Vote, Users, Calendar, Clock, CheckCircle, BarChart2,
  ChevronRight, Search, Filter, TrendingUp, Loader2
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
}

interface PollResults {
  totalVotes: number;
  results: Record<string, number>;
}

export default function PollsPage() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [pollResults, setPollResults] = useState<Record<string, PollResults>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [votingPoll, setVotingPoll] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [votedPolls, setVotedPolls] = useState<string[]>([]);
  const [submittingVote, setSubmittingVote] = useState(false);

  const categories = ['all', 'Governors', 'Ministers', 'Senators', 'Federal', 'States', 'General'];
  const statuses = ['all', 'active', 'ended', 'upcoming'];

  useEffect(() => {
    fetchPolls();
    const voted = localStorage.getItem('votedPolls');
    if (voted) {
      setVotedPolls(JSON.parse(voted));
    }
  }, []);

  const fetchPolls = async () => {
    try {
      setLoading(true);
      const response = await api.get('/polls');
      const pollsData = response.data.data || [];
      setPolls(pollsData);

      const resultsPromises = pollsData.map(async (poll: Poll) => {
        try {
          const res = await api.get(`/polls/${poll.id}/results`);
          return { id: poll.id, results: res.data.data };
        } catch {
          return { id: poll.id, results: { totalVotes: 0, results: {} } };
        }
      });

      const resultsArray = await Promise.all(resultsPromises);
      const resultsMap: Record<string, PollResults> = {};
      resultsArray.forEach(({ id, results }) => {
        resultsMap[id] = results;
      });
      setPollResults(resultsMap);
    } catch (error: any) {
      toast.error('Failed to load polls');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatus = (poll: Poll): 'active' | 'ended' | 'upcoming' => {
    const now = new Date();
    const start = new Date(poll.startDate);
    const end = new Date(poll.endDate);

    if (!poll.isActive) return 'upcoming';
    if (now < start) return 'upcoming';
    if (now > end) return 'ended';
    return 'active';
  };

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

  const handleVote = async (pollId: string) => {
    if (!selectedOption) {
      toast.error('Please select an option');
      return;
    }

    try {
      setSubmittingVote(true);
      await api.post(`/polls/${pollId}/vote`, { option: selectedOption });

      const newVotedPolls = [...votedPolls, pollId];
      setVotedPolls(newVotedPolls);
      localStorage.setItem('votedPolls', JSON.stringify(newVotedPolls));

      const res = await api.get(`/polls/${pollId}/results`);
      setPollResults(prev => ({
        ...prev,
        [pollId]: res.data.data,
      }));

      toast.success('Vote submitted successfully!');
      setVotingPoll(null);
      setSelectedOption(null);
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Failed to submit vote');
    } finally {
      setSubmittingVote(false);
    }
  };

  const filteredPolls = polls.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const status = getStatus(p);
    const matchesStatus = selectedStatus === 'all' || status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const activePolls = polls.filter(p => getStatus(p) === 'active');
  const totalVotes = Object.values(pollResults).reduce((acc, r) => acc + r.totalVotes, 0);

  const getOptionPercentage = (pollId: string, optionText: string): number => {
    const results = pollResults[pollId];
    if (!results || results.totalVotes === 0) return 0;
    const votes = results.results[optionText] || 0;
    return (votes / results.totalVotes) * 100;
  };

  const hasVoted = (pollId: string) => votedPolls.includes(pollId);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading polls...</p>
        </div>
      </div>
    );
  }

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
                <p className="text-2xl font-bold text-gray-900">{votedPolls.length}</p>
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
                  <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor('active')}`}>
                    {getStatusIcon('active')}
                    <span className="ml-1">active</span>
                  </span>
                  {activePolls[0].category && (
                    <span className="ml-2 text-sm text-gray-500">{activePolls[0].category}</span>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-purple-700">
                    {(pollResults[activePolls[0].id]?.totalVotes || 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-purple-600">total votes</p>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{activePolls[0].title}</h3>
              <p className="text-gray-600 mb-6">{activePolls[0].description || activePolls[0].question}</p>

              <div className="space-y-3 mb-6">
                {activePolls[0].options.slice(0, 3).map((option) => {
                  const percentage = getOptionPercentage(activePolls[0].id, option.text);
                  return (
                    <div key={option.id} className="relative">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{option.text}</span>
                        <span className="text-sm font-semibold text-purple-700">{percentage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full h-3 bg-white rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>Ends {new Date(activePolls[0].endDate).toLocaleDateString()}</span>
                </div>
                <button
                  onClick={() => setVotingPoll(activePolls[0].id)}
                  disabled={hasVoted(activePolls[0].id)}
                  className="inline-flex items-center px-6 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {hasVoted(activePolls[0].id) ? 'Already Voted' : 'Vote Now'}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Polls Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">All Polls</h2>
          {filteredPolls.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
              <Vote className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No polls found</h3>
              <p className="text-gray-500">Check back later for new polls.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPolls.map((poll) => {
                const status = getStatus(poll);
                const results = pollResults[poll.id] || { totalVotes: 0, results: {} };
                const voted = hasVoted(poll.id);

                return (
                  <div key={poll.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition group">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>
                          {getStatusIcon(status)}
                          <span className="ml-1">{status}</span>
                        </span>
                        {voted && (
                          <span className="flex items-center text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Voted
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition">
                        {poll.title}
                      </h3>
                      <p className="text-sm text-gray-500 mb-4 line-clamp-2">{poll.description || poll.question}</p>

                      {status !== 'upcoming' && (
                        <div className="space-y-2 mb-4">
                          {poll.options.slice(0, 2).map((option) => {
                            const percentage = getOptionPercentage(poll.id, option.text);
                            return (
                              <div key={option.id}>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs text-gray-600 truncate max-w-[70%]">{option.text}</span>
                                  <span className="text-xs font-medium text-gray-700">{percentage.toFixed(1)}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-primary-500 rounded-full"
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })}
                          {poll.options.length > 2 && (
                            <p className="text-xs text-gray-400">+{poll.options.length - 2} more options</p>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          <span>{results.totalVotes.toLocaleString()} votes</span>
                        </div>
                        {poll.category && (
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">{poll.category}</span>
                        )}
                      </div>
                    </div>

                    <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span>
                            {status === 'upcoming'
                              ? `Starts ${new Date(poll.startDate).toLocaleDateString()}`
                              : status === 'ended'
                              ? `Ended ${new Date(poll.endDate).toLocaleDateString()}`
                              : `Ends ${new Date(poll.endDate).toLocaleDateString()}`
                            }
                          </span>
                        </div>
                        <button
                          onClick={() => setVotingPoll(poll.id)}
                          disabled={status !== 'active' || voted}
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {status === 'upcoming' ? 'Coming Soon' : voted ? 'View Results' : 'Vote'}
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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

      {/* Voting Modal */}
      {votingPoll && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            {(() => {
              const poll = polls.find(p => p.id === votingPoll);
              if (!poll) return null;
              const voted = hasVoted(poll.id);
              const results = pollResults[poll.id] || { totalVotes: 0, results: {} };

              return (
                <>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{poll.title}</h3>
                  <p className="text-gray-600 mb-6">{poll.question}</p>

                  {voted ? (
                    <div className="space-y-4 mb-6">
                      {poll.options.map((option) => {
                        const percentage = getOptionPercentage(poll.id, option.text);
                        const votes = results.results[option.text] || 0;
                        return (
                          <div key={option.id}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gray-700">{option.text}</span>
                              <span className="text-sm font-semibold text-gray-900">{percentage.toFixed(1)}%</span>
                            </div>
                            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary-600 rounded-full transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{votes.toLocaleString()} votes</p>
                          </div>
                        );
                      })}
                      <p className="text-center text-sm text-gray-500 pt-4 border-t">
                        Total votes: {results.totalVotes.toLocaleString()}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 mb-6">
                      {poll.options.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => setSelectedOption(option.text)}
                          className={`w-full p-4 text-left border-2 rounded-xl transition ${
                            selectedOption === option.text
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center">
                            <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                              selectedOption === option.text
                                ? 'border-primary-500 bg-primary-500'
                                : 'border-gray-300'
                            }`}>
                              {selectedOption === option.text && (
                                <div className="w-2 h-2 bg-white rounded-full" />
                              )}
                            </div>
                            <span className="font-medium text-gray-900">{option.text}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => {
                        setVotingPoll(null);
                        setSelectedOption(null);
                      }}
                      className="px-6 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition"
                    >
                      {voted ? 'Close' : 'Cancel'}
                    </button>
                    {!voted && (
                      <button
                        onClick={() => handleVote(poll.id)}
                        disabled={!selectedOption || submittingVote}
                        className="px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        {submittingVote ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <>
                            <Vote className="w-4 h-4" />
                            <span>Submit Vote</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
