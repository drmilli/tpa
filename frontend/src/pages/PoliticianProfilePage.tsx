import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import AnalysisCard from '@/components/AnalysisCard';
import VoteButtons from '@/components/VoteButtons';
import { SquareAd } from '@/components/AdUnit';
import toast from 'react-hot-toast';
import {
  MapPin, Building, Calendar, TrendingUp, CheckCircle, Clock,
  XCircle, FileText, Briefcase, Award, ChevronLeft, Share2,
  ThumbsUp, ThumbsDown, Users, Loader2, Plus, AlertTriangle, Send,
  ExternalLink
} from 'lucide-react';

export default function PoliticianProfilePage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [submitType, setSubmitType] = useState<'project' | 'achievement' | 'controversy'>('project');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [wikiUrl, setWikiUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sourceUrl: '',
    date: '',
    location: '',
    budget: '',
    severity: 'MEDIUM',
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['politician', id],
    queryFn: async () => {
      const response = await api.get(`/politicians/${id}/profile`);
      return response.data.data;
    },
  });

  // Fetch Wikipedia data for bio and photo
  const { data: wikiData } = useQuery({
    queryKey: ['politician-wiki', id],
    queryFn: async () => {
      const response = await api.get(`/politicians/${id}/wikipedia`);
      return response.data.data;
    },
    enabled: !!data?.politician,
  });

  useEffect(() => {
    if (wikiData) {
      if (wikiData.photoUrl) setPhotoUrl(wikiData.photoUrl);
      if (wikiData.wikiUrl) setWikiUrl(wikiData.wikiUrl);
    }
  }, [wikiData]);

  // Check if user is logged in
  const isLoggedIn = !!localStorage.getItem('token');

  const submitMutation = useMutation({
    mutationFn: async (submitData: any) => {
      const response = await api.post(`/politicians/${id}/submit`, submitData);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Submission received! It will be reviewed by our team.');
      setShowSubmitForm(false);
      setFormData({
        title: '',
        description: '',
        sourceUrl: '',
        date: '',
        location: '',
        budget: '',
        severity: 'MEDIUM',
      });
      queryClient.invalidateQueries({ queryKey: ['politician', id] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to submit. Please try again.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }
    submitMutation.mutate({
      type: submitType,
      ...formData,
    });
  };

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
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPromiseStatusColor = (status: string) => {
    switch (status) {
      case 'FULFILLED': return 'bg-emerald-100 text-emerald-700';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700';
      case 'NOT_STARTED': return 'bg-gray-100 text-gray-700';
      case 'BROKEN': return 'bg-red-100 text-red-700';
      default: return 'bg-yellow-100 text-yellow-700';
    }
  };

  const getPromiseStatusIcon = (status: string) => {
    switch (status) {
      case 'FULFILLED': return <CheckCircle className="w-4 h-4" />;
      case 'IN_PROGRESS': return <Clock className="w-4 h-4" />;
      case 'BROKEN': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-500';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading politician profile...</p>
        </div>
      </div>
    );
  }

  if (error || !data?.politician) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Politician Not Found</h2>
          <p className="text-gray-500 mb-6">The politician you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/politicians"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Politicians
          </Link>
        </div>
      </div>
    );
  }

  const { politician, promises = [], bills = [], projects = [], rankings = [] } = data;

  const promiseStats = {
    total: promises.length,
    fulfilled: promises.filter((p: any) => p.status === 'FULFILLED').length,
    inProgress: promises.filter((p: any) => p.status === 'IN_PROGRESS').length,
    broken: promises.filter((p: any) => p.status === 'BROKEN').length,
  };

  const fulfillmentRate = promiseStats.total > 0
    ? Math.round((promiseStats.fulfilled / promiseStats.total) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 py-6">
          <Link
            to="/politicians"
            className="inline-flex items-center text-primary-100 hover:text-white mb-6 transition"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Politicians
          </Link>

          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {(politician.photoUrl || photoUrl) ? (
              <img
                src={politician.photoUrl || photoUrl}
                alt={`${politician.firstName} ${politician.lastName}`}
                className="w-32 h-32 rounded-2xl object-cover border-4 border-white/20 flex-shrink-0"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={`w-32 h-32 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl flex items-center justify-center text-4xl font-bold border-4 border-white/20 flex-shrink-0 ${(politician.photoUrl || photoUrl) ? 'hidden' : ''}`}>
              {politician.firstName?.[0]}{politician.lastName?.[0]}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <h1 className="text-3xl md:text-4xl font-bold">
                  {politician.firstName} {politician.lastName}
                </h1>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getPartyColor(politician.partyAffiliation)}`}>
                  {politician.partyAffiliation}
                </span>
              </div>
              <p className="text-xl text-primary-100 mb-4">
                {politician.Tenure?.[0]?.Office?.name || 'Politician'}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-primary-200">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{politician.State?.name || 'Nigeria'}</span>
                </div>
                <div className="flex items-center">
                  <Building className="w-4 h-4 mr-2" />
                  <span>{politician.LocalGovernment?.name || 'Federal'}</span>
                </div>
                {politician.dateOfBirth && (
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Born {new Date(politician.dateOfBirth).getFullYear()}</span>
                  </div>
                )}
              </div>
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="container mx-auto px-4 -mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-50 p-2 rounded-lg">
                <TrendingUp className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className={`text-2xl font-bold ${getScoreColor(politician.performanceScore)}`}>
                  {politician.performanceScore?.toFixed(1) || 0}
                </p>
                <p className="text-sm text-gray-500">Performance Score</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-50 p-2 rounded-lg">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{fulfillmentRate}%</p>
                <p className="text-sm text-gray-500">Promise Fulfillment</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-50 p-2 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{bills.length}</p>
                <p className="text-sm text-gray-500">Bills Sponsored</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="bg-yellow-50 p-2 rounded-lg">
                <Briefcase className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
                <p className="text-sm text-gray-500">Projects</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Promises Section */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Campaign Promises</h2>
                    <p className="text-sm text-gray-500">{promiseStats.total} total promises</p>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="flex items-center text-emerald-600">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      {promiseStats.fulfilled}
                    </span>
                    <span className="flex items-center text-blue-600">
                      <Clock className="w-4 h-4 mr-1" />
                      {promiseStats.inProgress}
                    </span>
                    <span className="flex items-center text-red-500">
                      <XCircle className="w-4 h-4 mr-1" />
                      {promiseStats.broken}
                    </span>
                  </div>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {promises.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No promises recorded yet.</p>
                  </div>
                ) : (
                  promises.slice(0, 5).map((promise: any) => (
                    <div key={promise.id} className="p-4 hover:bg-gray-50 transition">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{promise.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{promise.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3 text-xs text-gray-400">
                              <span>{promise.category}</span>
                              {promise.targetDate && (
                                <span>Target: {new Date(promise.targetDate).toLocaleDateString()}</span>
                              )}
                            </div>
                            <VoteButtons
                              type="promise"
                              itemId={promise.id}
                              upvotes={promise.upvotes || 0}
                              downvotes={promise.downvotes || 0}
                            />
                          </div>
                        </div>
                        <span className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold ml-3 ${getPromiseStatusColor(promise.status)}`}>
                          {getPromiseStatusIcon(promise.status)}
                          <span>{promise.status.replace('_', ' ')}</span>
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {promises.length > 5 && (
                <div className="p-4 border-t border-gray-100 text-center">
                  <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                    View all {promises.length} promises
                  </button>
                </div>
              )}
            </div>

            {/* Bills Section */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">Bills Sponsored</h2>
                <p className="text-sm text-gray-500">{bills.length} bills</p>
              </div>
              <div className="divide-y divide-gray-100">
                {bills.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No bills recorded yet.</p>
                  </div>
                ) : (
                  bills.slice(0, 5).map((bill: any) => (
                    <div key={bill.id} className="p-4 hover:bg-gray-50 transition">
                      <h3 className="font-semibold text-gray-900 mb-1">{bill.title}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{bill.description}</p>
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          bill.status === 'PASSED' ? 'bg-emerald-100 text-emerald-700' :
                          bill.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {bill.status}
                        </span>
                        <span className="text-xs text-gray-400">
                          Proposed {new Date(bill.dateProposed).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Projects Section */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">Projects</h2>
                <p className="text-sm text-gray-500">{projects.length} projects</p>
              </div>
              <div className="divide-y divide-gray-100">
                {projects.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No projects recorded yet.</p>
                  </div>
                ) : (
                  projects.slice(0, 5).map((project: any) => (
                    <div key={project.id} className="p-4 hover:bg-gray-50 transition">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{project.title}</h3>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{project.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3 text-xs text-gray-400">
                              {project.location && <span>{project.location}</span>}
                              {project.budget && (
                                <span>₦{project.budget.toLocaleString()}</span>
                              )}
                            </div>
                            <VoteButtons
                              type="project"
                              itemId={project.id}
                              upvotes={project.upvotes || 0}
                              downvotes={project.downvotes || 0}
                            />
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ml-3 ${
                          project.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                          project.status === 'ONGOING' ? 'bg-blue-100 text-blue-700' :
                          project.status === 'PENDING_VERIFICATION' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {project.status?.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {projects.length > 5 && (
                <div className="p-4 border-t border-gray-100 text-center">
                  <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                    View all {projects.length} projects
                  </button>
                </div>
              )}
            </div>

            {/* AI Analysis Section */}
            <AnalysisCard politicianId={id!} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-bold text-gray-900 mb-4">Rate This Politician</h3>
              <div className="flex items-center justify-center space-x-4 mb-4">
                <button className="flex flex-col items-center p-3 rounded-xl hover:bg-emerald-50 transition group">
                  <ThumbsUp className="w-8 h-8 text-gray-400 group-hover:text-emerald-600 transition" />
                  <span className="text-xs text-gray-500 mt-1">Approve</span>
                </button>
                <button className="flex flex-col items-center p-3 rounded-xl hover:bg-red-50 transition group">
                  <ThumbsDown className="w-8 h-8 text-gray-400 group-hover:text-red-500 transition" />
                  <span className="text-xs text-gray-500 mt-1">Disapprove</span>
                </button>
              </div>

              {isLoggedIn ? (
                <div className="space-y-3">
                  <button
                    onClick={() => setShowSubmitForm(!showSubmitForm)}
                    className="flex items-center justify-center w-full px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-medium"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Submit Information
                  </button>

                  {showSubmitForm && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                      <h4 className="font-semibold text-gray-900 mb-3">Submit Record</h4>

                      {/* Type Selection */}
                      <div className="flex gap-2 mb-4">
                        <button
                          type="button"
                          onClick={() => setSubmitType('project')}
                          className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition ${
                            submitType === 'project'
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <Briefcase className="w-3 h-3 inline mr-1" />
                          Project
                        </button>
                        <button
                          type="button"
                          onClick={() => setSubmitType('achievement')}
                          className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition ${
                            submitType === 'achievement'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-white text-gray-600 border border-gray-200 hover:border-emerald-300'
                          }`}
                        >
                          <Award className="w-3 h-3 inline mr-1" />
                          Achievement
                        </button>
                        <button
                          type="button"
                          onClick={() => setSubmitType('controversy')}
                          className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition ${
                            submitType === 'controversy'
                              ? 'bg-red-600 text-white'
                              : 'bg-white text-gray-600 border border-gray-200 hover:border-red-300'
                          }`}
                        >
                          <AlertTriangle className="w-3 h-3 inline mr-1" />
                          Issue
                        </button>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-3">
                        <input
                          type="text"
                          placeholder="Title *"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        />
                        <textarea
                          placeholder="Description *"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          rows={3}
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                          required
                        />
                        <input
                          type="url"
                          placeholder="Source URL (optional)"
                          value={formData.sourceUrl}
                          onChange={(e) => setFormData({ ...formData, sourceUrl: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        <input
                          type="date"
                          placeholder="Date"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />

                        {submitType === 'project' && (
                          <>
                            <input
                              type="text"
                              placeholder="Location"
                              value={formData.location}
                              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                            <input
                              type="number"
                              placeholder="Budget (NGN)"
                              value={formData.budget}
                              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                          </>
                        )}

                        {submitType === 'controversy' && (
                          <select
                            value={formData.severity}
                            onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          >
                            <option value="LOW">Low Severity</option>
                            <option value="MEDIUM">Medium Severity</option>
                            <option value="HIGH">High Severity</option>
                          </select>
                        )}

                        <button
                          type="submit"
                          disabled={submitMutation.isPending}
                          className="w-full flex items-center justify-center px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium disabled:opacity-50"
                        >
                          {submitMutation.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <Send className="w-4 h-4 mr-2" />
                              Submit for Review
                            </>
                          )}
                        </button>
                      </form>

                      <p className="text-xs text-gray-500 mt-3">
                        Submissions are reviewed by our team before being published.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="block w-full text-center px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-medium"
                >
                  Login to Contribute
                </Link>
              )}
            </div>

            {/* Ad in sidebar */}
            <SquareAd className="rounded-xl overflow-hidden" />

            {/* Ranking Position */}
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200 p-5">
              <div className="flex items-center space-x-3 mb-3">
                <Award className="w-8 h-8 text-yellow-600" />
                <div>
                  <p className="text-sm text-yellow-700">Current Ranking</p>
                  <p className="text-2xl font-bold text-yellow-800">
                    #{rankings[0]?.rank || 'N/A'}
                  </p>
                </div>
              </div>
              <Link
                to="/rankings"
                className="text-yellow-700 hover:text-yellow-800 text-sm font-medium"
              >
                View full rankings
              </Link>
            </div>

            {/* Bio */}
            {(politician.biography || wikiData?.biography) && (
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900">Biography</h3>
                  {wikiUrl && (
                    <a
                      href={wikiUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary-600 hover:text-primary-700 flex items-center"
                    >
                      Wikipedia <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  )}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                  {politician.biography || wikiData?.biography}
                </p>
              </div>
            )}

            {/* Related Politicians */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-bold text-gray-900 mb-4">Similar Politicians</h3>
              <p className="text-sm text-gray-500">
                Explore other politicians from {politician.State?.name || 'this region'}.
              </p>
              <Link
                to={`/politicians?state=${politician.State?.name?.toLowerCase()}`}
                className="inline-block mt-3 text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View more from this state
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
