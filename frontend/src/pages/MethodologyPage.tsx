import { Link } from 'react-router-dom';
import {
  BarChart3, CheckCircle, FileText, Briefcase, Users, AlertTriangle,
  Newspaper, Brain, Database, Shield, Scale, TrendingUp, ArrowLeft
} from 'lucide-react';

export default function MethodologyPage() {
  const scoringFactors = [
    {
      name: 'Promise Fulfillment',
      weight: '30%',
      icon: CheckCircle,
      color: 'bg-emerald-100 text-emerald-600',
      description: 'Tracks campaign promises and their fulfillment status.',
      calculation: 'Fulfilled (100%) + In Progress (50%) + Pending (30%) + Broken (0%) / Total Promises',
      details: [
        'Campaign promises are recorded from official campaign materials',
        'Status updates are verified through government records and news sources',
        'Independent verification from civil society organizations',
      ]
    },
    {
      name: 'Legislative Activity',
      weight: '20%',
      icon: FileText,
      color: 'bg-blue-100 text-blue-600',
      description: 'Measures legislative contributions including bills sponsored and their passage rate.',
      calculation: 'Quantity Score (up to 50 points) + Pass Rate Score (up to 50 points)',
      details: [
        'Bills sponsored and co-sponsored',
        'Passage rate through legislative chambers',
        'Impact and relevance of legislation',
      ]
    },
    {
      name: 'Project Completion',
      weight: '15%',
      icon: Briefcase,
      color: 'bg-purple-100 text-purple-600',
      description: 'Evaluates infrastructure and development projects initiated and completed.',
      calculation: 'Completed (100%) + Ongoing (60%) + Abandoned (0%) / Total Projects',
      details: [
        'Infrastructure projects verified on-site',
        'Budget allocation vs actual spending',
        'Community impact assessment',
      ]
    },
    {
      name: 'Public Sentiment',
      weight: '15%',
      icon: Users,
      color: 'bg-yellow-100 text-yellow-600',
      description: 'AI-analyzed public opinion from social media and news sources.',
      calculation: 'Sentiment analysis score (-1 to +1) converted to 0-100 scale',
      details: [
        'Social media sentiment analysis',
        'Public approval polls',
        'Community feedback and reviews',
      ]
    },
    {
      name: 'Media Presence',
      weight: '10%',
      icon: Newspaper,
      color: 'bg-cyan-100 text-cyan-600',
      description: 'Media coverage frequency and tone analysis.',
      calculation: 'Mention frequency score + Sentiment bonus',
      details: [
        'Coverage in major Nigerian news outlets',
        'Tone and context of media mentions',
        'Public engagement and accessibility',
      ]
    },
    {
      name: 'Controversy Impact',
      weight: '-10%',
      icon: AlertTriangle,
      color: 'bg-red-100 text-red-600',
      description: 'Negative impact from verified controversies and scandals.',
      calculation: 'Sum of severity scores (High: 30, Medium: 15, Low: 5)',
      details: [
        'Verified corruption allegations',
        'Legal issues and court cases',
        'Ethical violations and misconduct',
      ]
    },
  ];

  const dataSources = [
    { name: 'Official Government Records', description: 'Federal and state government publications, gazettes, and official statements' },
    { name: 'INEC Data', description: 'Independent National Electoral Commission records and election data' },
    { name: 'National Bureau of Statistics', description: 'Economic and demographic data for context and verification' },
    { name: 'News Media Analysis', description: 'Coverage from major Nigerian news outlets including Punch, Vanguard, ThisDay, Guardian' },
    { name: 'Social Media Monitoring', description: 'Public sentiment analysis from Twitter, Facebook, and other platforms' },
    { name: 'Civil Society Reports', description: 'Reports from NGOs, transparency organizations, and research institutions' },
    { name: 'Academic Research', description: 'Peer-reviewed studies and academic publications on governance' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <Link
            to="/"
            className="inline-flex items-center text-primary-100 hover:text-white mb-6 transition"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <Scale className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">Our Methodology</h1>
          </div>
          <p className="text-xl text-primary-100 max-w-3xl">
            Transparent, data-driven, and objective. Learn how we evaluate and rank Nigerian politicians
            based on their actual performance, not promises.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Overview */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-12 shadow-sm -mt-8">
          <div className="flex items-center space-x-3 mb-4">
            <Brain className="w-8 h-8 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-900">AI-Powered Analysis</h2>
          </div>
          <p className="text-gray-600 leading-relaxed mb-6">
            Our scoring system uses a weighted combination of multiple factors to provide an objective
            assessment of politician performance. We combine official government data, public records,
            media analysis, and AI-powered sentiment analysis to create comprehensive performance scores.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-primary-50 rounded-xl p-4">
              <BarChart3 className="w-6 h-6 text-primary-600 mb-2" />
              <h3 className="font-semibold text-gray-900">Data-Driven</h3>
              <p className="text-sm text-gray-600">Based on verifiable data from official sources</p>
            </div>
            <div className="bg-primary-50 rounded-xl p-4">
              <Shield className="w-6 h-6 text-primary-600 mb-2" />
              <h3 className="font-semibold text-gray-900">Non-Partisan</h3>
              <p className="text-sm text-gray-600">No political bias - same standards for all</p>
            </div>
            <div className="bg-primary-50 rounded-xl p-4">
              <TrendingUp className="w-6 h-6 text-primary-600 mb-2" />
              <h3 className="font-semibold text-gray-900">Regularly Updated</h3>
              <p className="text-sm text-gray-600">Scores updated every 6 hours automatically</p>
            </div>
          </div>
        </div>

        {/* Scoring Factors */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Scoring Factors</h2>
        <div className="space-y-6 mb-12">
          {scoringFactors.map((factor) => (
            <div key={factor.name} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl ${factor.color}`}>
                      <factor.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{factor.name}</h3>
                      <p className="text-sm text-gray-600">{factor.description}</p>
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-full font-bold text-lg ${
                    factor.weight.startsWith('-') ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {factor.weight}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm font-mono text-gray-700">
                    <span className="font-semibold">Calculation:</span> {factor.calculation}
                  </p>
                </div>
                <ul className="space-y-2">
                  {factor.details.map((detail, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Data Sources */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Data Sources</h2>
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-12">
          <div className="flex items-center space-x-3 mb-6">
            <Database className="w-6 h-6 text-primary-600" />
            <p className="text-gray-600">
              We aggregate data from multiple trusted sources to ensure accuracy and completeness.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {dataSources.map((source, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition">
                <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">{source.name}</h4>
                  <p className="text-sm text-gray-600">{source.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Update Frequency */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white mb-12">
          <h2 className="text-2xl font-bold mb-4">Update Frequency</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Performance Scores</h3>
              <p className="text-primary-100">
                Updated every 6 hours automatically based on new data from our sources.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Rankings</h3>
              <p className="text-primary-100">
                Recalculated every 12 hours to reflect the latest score changes.
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-yellow-800 mb-2">Important Disclaimer</h3>
              <p className="text-yellow-700 text-sm">
                Our scores are based on available data and AI analysis. They should be considered as
                one of many factors when evaluating politicians. We encourage users to verify information
                from multiple sources and form their own opinions. Our methodology is transparent, but
                no scoring system can capture every nuance of political performance.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Have Questions About Our Methodology?</h3>
          <p className="text-gray-600 mb-6">
            We're committed to transparency. If you have questions or suggestions, we'd love to hear from you.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-semibold"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
