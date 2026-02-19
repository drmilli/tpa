import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { HorizontalAd } from '@/components/AdUnit';
import {
  Search, Filter, CheckCircle, XCircle, AlertCircle, HelpCircle,
  Calendar, ChevronRight, Share2, ExternalLink,
  Shield, Eye, Sparkles, Send, Loader2, RotateCcw, Copy, Check
} from 'lucide-react';

interface FactCheck {
  id: string;
  claim: string;
  claimant: string;
  claimantRole: string;
  claimantImage?: string;
  date: string;
  verdict: 'true' | 'mostly-true' | 'half-true' | 'mostly-false' | 'false' | 'unverifiable';
  category: string;
  summary: string;
  sources: number;
  views: number;
  shares: number;
}

interface AIFactCheckResult {
  verdict: 'true' | 'mostly-true' | 'half-true' | 'mostly-false' | 'false' | 'unverifiable';
  confidence: number;
  summary: string;
  keyPoints: string[];
  sources: string[];
  disclaimer: string;
}

export default function FactCheckPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVerdict, setSelectedVerdict] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // AI Fact Checker State
  const [aiInput, setAiInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<AIFactCheckResult | null>(null);
  const [copied, setCopied] = useState(false);

  // Mock data
  const factChecks: FactCheck[] = [
    {
      id: '1',
      claim: 'Nigeria\'s GDP grew by 15% in the last quarter',
      claimant: 'Bola Tinubu',
      claimantRole: 'President of Nigeria',
      date: '2024-01-20',
      verdict: 'mostly-false',
      category: 'Economy',
      summary: 'Official NBS data shows GDP growth was 2.54% in Q3 2023, not 15% as claimed.',
      sources: 5,
      views: 12500,
      shares: 890,
    },
    {
      id: '2',
      claim: 'Lagos State has built 500 new schools in the past year',
      claimant: 'Babajide Sanwo-Olu',
      claimantRole: 'Governor of Lagos State',
      date: '2024-01-18',
      verdict: 'half-true',
      category: 'Education',
      summary: 'Records show 127 new schools were built, with 373 renovations. The claim conflates new construction with renovations.',
      sources: 4,
      views: 8900,
      shares: 456,
    },
    {
      id: '3',
      claim: 'Inflation rate has dropped to single digits',
      claimant: 'Wale Edun',
      claimantRole: 'Minister of Finance',
      date: '2024-01-15',
      verdict: 'false',
      category: 'Economy',
      summary: 'CBN data confirms inflation remains at 28.92% as of December 2023, far from single digits.',
      sources: 6,
      views: 25000,
      shares: 2100,
    },
    {
      id: '4',
      claim: 'Kano State achieved 95% primary school enrollment',
      claimant: 'Abba Kabir Yusuf',
      claimantRole: 'Governor of Kano State',
      date: '2024-01-12',
      verdict: 'mostly-true',
      category: 'Education',
      summary: 'UBEC records show enrollment at 91.3%, close to the claimed figure.',
      sources: 3,
      views: 5600,
      shares: 234,
    },
    {
      id: '5',
      claim: 'Nigeria now generates 10,000MW of electricity',
      claimant: 'Adebayo Adelabu',
      claimantRole: 'Minister of Power',
      date: '2024-01-10',
      verdict: 'false',
      category: 'Infrastructure',
      summary: 'Grid data shows peak generation of 5,528MW, with average around 4,000MW.',
      sources: 4,
      views: 18700,
      shares: 1560,
    },
    {
      id: '6',
      claim: 'Crime rate in Abuja reduced by 40%',
      claimant: 'Nyesom Wike',
      claimantRole: 'FCT Minister',
      date: '2024-01-08',
      verdict: 'unverifiable',
      category: 'Security',
      summary: 'No comprehensive crime statistics are publicly available to verify this claim.',
      sources: 2,
      views: 9200,
      shares: 678,
    },
    {
      id: '7',
      claim: 'Over 2 million jobs created through youth empowerment programs',
      claimant: 'Federal Government',
      claimantRole: 'Official Statement',
      date: '2024-01-05',
      verdict: 'half-true',
      category: 'Employment',
      summary: 'Records show 1.2 million enrollments, but job creation figures are unverified.',
      sources: 5,
      views: 14300,
      shares: 890,
    },
    {
      id: '8',
      claim: 'Rivers State has the lowest poverty rate in Nigeria',
      claimant: 'Siminalayi Fubara',
      claimantRole: 'Governor of Rivers State',
      date: '2024-01-02',
      verdict: 'true',
      category: 'Economy',
      summary: 'NBS Multidimensional Poverty Index confirms Rivers State at 23.9%, the lowest nationally.',
      sources: 3,
      views: 7800,
      shares: 445,
    },
  ];

  const categories = ['Economy', 'Education', 'Infrastructure', 'Security', 'Health', 'Employment'];
  const verdicts = [
    { value: 'true', label: 'True', color: 'bg-emerald-100 text-emerald-700' },
    { value: 'mostly-true', label: 'Mostly True', color: 'bg-green-100 text-green-700' },
    { value: 'half-true', label: 'Half True', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'mostly-false', label: 'Mostly False', color: 'bg-orange-100 text-orange-700' },
    { value: 'false', label: 'False', color: 'bg-red-100 text-red-700' },
    { value: 'unverifiable', label: 'Unverifiable', color: 'bg-gray-100 text-gray-700' },
  ];

  const getVerdictConfig = (verdict: string) => {
    switch (verdict) {
      case 'true':
        return { icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100', label: 'True' };
      case 'mostly-true':
        return { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', label: 'Mostly True' };
      case 'half-true':
        return { icon: AlertCircle, color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Half True' };
      case 'mostly-false':
        return { icon: XCircle, color: 'text-orange-600', bg: 'bg-orange-100', label: 'Mostly False' };
      case 'false':
        return { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', label: 'False' };
      case 'unverifiable':
        return { icon: HelpCircle, color: 'text-gray-600', bg: 'bg-gray-100', label: 'Unverifiable' };
      default:
        return { icon: HelpCircle, color: 'text-gray-600', bg: 'bg-gray-100', label: 'Unknown' };
    }
  };

  // Filter fact checks
  const filteredFactChecks = factChecks.filter((fc) => {
    const matchesSearch = fc.claim.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fc.claimant.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVerdict = !selectedVerdict || fc.verdict === selectedVerdict;
    const matchesCategory = !selectedCategory || fc.category === selectedCategory;
    return matchesSearch && matchesVerdict && matchesCategory;
  });

  // Stats
  const stats = {
    total: factChecks.length,
    true: factChecks.filter(fc => fc.verdict === 'true' || fc.verdict === 'mostly-true').length,
    false: factChecks.filter(fc => fc.verdict === 'false' || fc.verdict === 'mostly-false').length,
    mixed: factChecks.filter(fc => fc.verdict === 'half-true' || fc.verdict === 'unverifiable').length,
  };

  // AI Fact Check Handler
  const handleAIFactCheck = async () => {
    if (!aiInput.trim()) return;

    setIsAnalyzing(true);
    setAiResult(null);

    try {
      const response = await api.post('/factcheck/analyze', { claim: aiInput });
      const data = response.data.data;

      setAiResult({
        verdict: data.verdict,
        confidence: data.confidence,
        summary: data.summary,
        keyPoints: data.keyPoints,
        sources: data.sources,
        disclaimer: data.disclaimer,
      });
    } catch (error: any) {
      console.error('Fact check error:', error);
      toast.error(error.response?.data?.error || 'Failed to analyze claim. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAIChecker = () => {
    setAiInput('');
    setAiResult(null);
  };

  const copyResult = () => {
    if (!aiResult) return;
    const text = `Claim: ${aiInput}\n\nVerdict: ${aiResult.verdict.toUpperCase()}\nConfidence: ${aiResult.confidence}%\n\nSummary: ${aiResult.summary}\n\nKey Points:\n${aiResult.keyPoints.map(p => `- ${p}`).join('\n')}\n\nSources: ${aiResult.sources.join(', ')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-10 h-10" />
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                Independent Verification
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Fact Check
            </h1>
            <p className="text-xl text-primary-100">
              Holding politicians accountable with verified facts. We analyze claims made by
              public officials and rate them based on evidence and official data sources.
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
                <Shield className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-500">Claims Checked</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-50 p-2 rounded-lg">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.true}</p>
                <p className="text-sm text-gray-500">True/Mostly True</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="bg-red-50 p-2 rounded-lg">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.false}</p>
                <p className="text-sm text-gray-500">False/Mostly False</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="bg-yellow-50 p-2 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.mixed}</p>
                <p className="text-sm text-gray-500">Mixed/Unverified</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Fact Checker */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 md:p-8 mb-8 shadow-xl">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">AI Fact Checker</h2>
              <p className="text-sm text-slate-400">Instantly analyze any political claim</p>
            </div>
          </div>

          {/* Input Section */}
          <div className="relative mb-4">
            <textarea
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              placeholder="Enter a political claim or statement to fact-check... e.g., 'Nigeria's inflation rate dropped to 15% in 2024'"
              className="w-full h-32 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              disabled={isAnalyzing}
            />
            <div className="absolute bottom-3 right-3 flex items-center space-x-2">
              <span className="text-xs text-slate-500">{aiInput.length}/500</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <button
              onClick={handleAIFactCheck}
              disabled={!aiInput.trim() || isAnalyzing}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Analyze Claim</span>
                </>
              )}
            </button>
            {(aiInput || aiResult) && (
              <button
                onClick={resetAIChecker}
                className="flex items-center space-x-2 px-4 py-3 bg-slate-700 text-slate-300 rounded-xl hover:bg-slate-600 transition"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Loading Animation */}
          {isAnalyzing && (
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full border-4 border-slate-700 border-t-purple-500 animate-spin"></div>
                  <Sparkles className="w-5 h-5 text-purple-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <div>
                  <p className="text-white font-medium">Analyzing claim...</p>
                  <p className="text-sm text-slate-400">Cross-referencing with official data sources</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center space-x-2 text-sm text-slate-400">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span>Scanning government databases...</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-400">
                  <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse delay-75"></div>
                  <span>Verifying statistical data...</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-400">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-150"></div>
                  <span>Checking historical records...</span>
                </div>
              </div>
            </div>
          )}

          {/* AI Result */}
          {aiResult && !isAnalyzing && (
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
              {/* Verdict Header */}
              <div className={`p-4 ${getVerdictConfig(aiResult.verdict).bg}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {(() => {
                      const config = getVerdictConfig(aiResult.verdict);
                      const Icon = config.icon;
                      return (
                        <>
                          <Icon className={`w-8 h-8 ${config.color}`} />
                          <div>
                            <p className={`text-lg font-bold ${config.color}`}>
                              {config.label}
                            </p>
                            <p className="text-sm text-gray-600">
                              Confidence: {aiResult.confidence}%
                            </p>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                  <button
                    onClick={copyResult}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-white/80 rounded-lg text-gray-700 hover:bg-white transition text-sm"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-green-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Result Content */}
              <div className="p-6 space-y-5">
                {/* Claim Analyzed */}
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Claim Analyzed</p>
                  <p className="text-white font-medium">"{aiInput}"</p>
                </div>

                {/* Summary */}
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Summary</p>
                  <p className="text-slate-300">{aiResult.summary}</p>
                </div>

                {/* Key Points */}
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">Key Points</p>
                  <ul className="space-y-2">
                    {aiResult.keyPoints.map((point, index) => (
                      <li key={index} className="flex items-start space-x-2 text-slate-300">
                        <span className="w-5 h-5 bg-slate-700 rounded-full flex items-center justify-center text-xs text-slate-400 mt-0.5 flex-shrink-0">
                          {index + 1}
                        </span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Sources */}
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">Sources Referenced</p>
                  <div className="flex flex-wrap gap-2">
                    {aiResult.sources.map((source, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-slate-700 text-slate-300 text-sm rounded-full"
                      >
                        {source}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="pt-4 border-t border-slate-700">
                  <p className="text-xs text-slate-500 flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{aiResult.disclaimer}</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Examples */}
          {!aiInput && !aiResult && (
            <div>
              <p className="text-sm text-slate-400 mb-3">Try these examples:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Nigeria's economy grew by 10% last year",
                  "Lagos has the lowest unemployment rate",
                  "Fuel subsidy removal saved N2 trillion"
                ].map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setAiInput(example)}
                    className="px-3 py-1.5 bg-slate-800 text-slate-400 text-sm rounded-lg hover:bg-slate-700 hover:text-white transition border border-slate-700"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search claims or politicians..."
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
                  value={selectedVerdict}
                  onChange={(e) => setSelectedVerdict(e.target.value)}
                >
                  <option value="">All Verdicts</option>
                  {verdicts.map(v => (
                    <option key={v.value} value={v.value}>{v.label}</option>
                  ))}
                </select>
              </div>
              <select
                className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Verdict Legend */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-8 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Verdict Scale</h3>
          <div className="flex flex-wrap gap-2">
            {verdicts.map((v) => {
              const config = getVerdictConfig(v.value);
              const Icon = config.icon;
              return (
                <div
                  key={v.value}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full ${config.bg}`}
                >
                  <Icon className={`w-4 h-4 ${config.color}`} />
                  <span className={`text-sm font-medium ${config.color}`}>{v.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fact Check List */}
        <div className="space-y-4">
          {filteredFactChecks.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
              <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No fact checks found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            filteredFactChecks.map((factCheck) => {
              const verdictConfig = getVerdictConfig(factCheck.verdict);
              const VerdictIcon = verdictConfig.icon;

              return (
                <Link
                  key={factCheck.id}
                  to={`/fact-check/${factCheck.id}`}
                  className="block bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition group"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                      {/* Verdict Badge */}
                      <div className={`flex-shrink-0 w-24 h-24 rounded-xl ${verdictConfig.bg} flex flex-col items-center justify-center`}>
                        <VerdictIcon className={`w-10 h-10 ${verdictConfig.color}`} />
                        <span className={`text-xs font-bold mt-1 ${verdictConfig.color}`}>
                          {verdictConfig.label.toUpperCase()}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Category & Date */}
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="px-2 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded">
                            {factCheck.category}
                          </span>
                          <span className="text-sm text-gray-400 flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(factCheck.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>

                        {/* Claim */}
                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition">
                          "{factCheck.claim}"
                        </h3>

                        {/* Claimant */}
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {factCheck.claimant.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{factCheck.claimant}</p>
                            <p className="text-xs text-gray-500">{factCheck.claimantRole}</p>
                          </div>
                        </div>

                        {/* Summary */}
                        <p className="text-gray-600 text-sm mb-4">{factCheck.summary}</p>

                        {/* Stats */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span className="flex items-center">
                              <ExternalLink className="w-4 h-4 mr-1" />
                              {factCheck.sources} sources
                            </span>
                            <span className="flex items-center">
                              <Eye className="w-4 h-4 mr-1" />
                              {factCheck.views.toLocaleString()}
                            </span>
                            <span className="flex items-center">
                              <Share2 className="w-4 h-4 mr-1" />
                              {factCheck.shares}
                            </span>
                          </div>
                          <div className="flex items-center text-primary-600 text-sm font-medium">
                            Read Full Analysis
                            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>

        {/* Ad before CTA */}
        <HorizontalAd className="mt-8" />

        {/* Submit a Claim CTA */}
        <div className="mt-12 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-3">Have a Claim to Verify?</h3>
              <p className="text-primary-100 mb-4">
                Submit a statement made by a public official for our team to fact-check.
                We investigate claims using official data sources and expert analysis.
              </p>
              <ul className="space-y-2 text-sm text-primary-100">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Independent and non-partisan verification
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Multiple official sources referenced
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Transparent methodology
                </li>
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary-700 rounded-xl hover:bg-gray-100 transition font-semibold"
              >
                Submit a Claim
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-white/30 text-white rounded-xl hover:bg-white/10 transition font-semibold"
              >
                Our Methodology
              </Link>
            </div>
          </div>
        </div>

        {/* How We Rate Section */}
        <div className="mt-12 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">How We Rate Claims</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-primary-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">1. Research</h4>
              <p className="text-sm text-gray-600">
                We identify the claim and gather context about when, where, and why it was made.
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ExternalLink className="w-6 h-6 text-primary-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">2. Verify</h4>
              <p className="text-sm text-gray-600">
                We consult official data sources, experts, and government records to verify the claim.
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-primary-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">3. Rate</h4>
              <p className="text-sm text-gray-600">
                Based on evidence, we assign a verdict using our transparent rating scale.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
