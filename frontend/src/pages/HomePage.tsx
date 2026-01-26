import { Link } from 'react-router-dom';
import {
  Search,
  TrendingUp,
  Users,
  Vote,
  BookOpen,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Flame,
  ArrowRight,
  Calendar,
  Eye,
  MessageSquare,
  Star,
  Award,
  BarChart3,
  Shield,
  Zap,
  Globe,
  ChevronRight
} from 'lucide-react';

// Mock data for sections
const trendingPoliticians = [
  {
    id: 1,
    name: 'Bola Tinubu',
    office: 'President',
    party: 'APC',
    trend: '+15%',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Bola_Tinubu_portrait.jpg/220px-Bola_Tinubu_portrait.jpg'
  },
  {
    id: 2,
    name: 'Atiku Abubakar',
    office: 'Former VP',
    party: 'PDP',
    trend: '+8%',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Atiku_Abubakar_at_Chatham_House_%2852443045507%29_%28cropped%29.jpg/220px-Atiku_Abubakar_at_Chatham_House_%2852443045507%29_%28cropped%29.jpg'
  },
  {
    id: 3,
    name: 'Peter Obi',
    office: 'Former Governor',
    party: 'LP',
    trend: '+12%',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Peter_Obi_portrait.jpg/220px-Peter_Obi_portrait.jpg'
  },
  {
    id: 4,
    name: 'Nyesom Wike',
    office: 'FCT Minister',
    party: 'PDP',
    trend: '+5%',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Nyesom_Wike_portrait.png/220px-Nyesom_Wike_portrait.png'
  },
];

const latestBlogPosts = [
  {
    id: 1,
    title: 'Understanding the 2024 Budget: What It Means for Nigerians',
    excerpt: 'A comprehensive breakdown of the national budget and its implications for ordinary citizens.',
    category: 'Economy',
    date: '2024-01-15',
    readTime: '5 min read',
    views: 2340,
  },
  {
    id: 2,
    title: 'State Governors Performance Review: Q4 2023',
    excerpt: 'Our quarterly assessment of state governors based on key performance indicators.',
    category: 'Rankings',
    date: '2024-01-12',
    readTime: '8 min read',
    views: 4520,
  },
  {
    id: 3,
    title: 'The Rise of Third-Party Politics in Nigeria',
    excerpt: 'Analyzing the growing influence of alternative political parties in Nigerian democracy.',
    category: 'Politics',
    date: '2024-01-10',
    readTime: '6 min read',
    views: 3180,
  },
];

const factChecks = [
  {
    id: 1,
    claim: '"Nigeria\'s inflation rate dropped to 15% in December 2023"',
    verdict: 'false',
    source: 'Social Media',
    politician: 'Government Official',
  },
  {
    id: 2,
    claim: '"Lagos State generated N1.2 trillion in revenue in 2023"',
    verdict: 'true',
    source: 'Press Conference',
    politician: 'Governor Sanwo-Olu',
  },
  {
    id: 3,
    claim: '"The federal government has employed 500,000 youths"',
    verdict: 'misleading',
    source: 'News Interview',
    politician: 'Minister of Labour',
  },
];

const stats = [
  { label: 'Politicians Tracked', value: '2,500+', icon: Users },
  { label: 'Promises Monitored', value: '15,000+', icon: CheckCircle },
  { label: 'Fact Checks', value: '8,500+', icon: Shield },
  { label: 'Active Users', value: '100K+', icon: Globe },
];

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 text-white py-24 lg:py-32 overflow-hidden">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute top-1/2 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2"></div>
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-white rounded-full translate-y-1/2"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in-down">
              Know Your Leaders,
              <span className="block text-primary-200">Shape Your Future</span>
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl mb-10 text-primary-100 animate-fade-in opacity-0" style={{ animationDelay: '0.2s' }}>
              Nigeria's most comprehensive platform for transparent political data,
              fact-checking, and civic engagement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up opacity-0" style={{ animationDelay: '0.4s' }}>
              <Link
                to="/politicians"
                className="group px-8 py-4 bg-white text-primary-700 rounded-xl font-semibold hover:bg-primary-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                Browse Politicians
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/rankings"
                className="px-8 py-4 bg-transparent text-white rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 border-2 border-white/50 hover:border-white flex items-center justify-center gap-2"
              >
                View Rankings
                <BarChart3 className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white relative -mt-10 z-20">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="text-center animate-fade-in-up opacity-0"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-primary-100 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-7 h-7 text-primary-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Politicians Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-3 rounded-xl">
                <Flame className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Trending Politicians</h2>
                <p className="text-gray-600">Most searched leaders this week</p>
              </div>
            </div>
            <Link
              to="/politicians"
              className="hidden sm:flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingPoliticians.map((politician, index) => (
              <Link
                key={politician.id}
                to={`/politicians/${politician.id}`}
                className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in-up opacity-0"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0 ring-2 ring-primary-100 group-hover:ring-primary-300 transition-all">
                    {politician.image ? (
                      <img
                        src={politician.image}
                        alt={politician.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <span className={`text-white text-xl font-bold ${politician.image ? 'hidden' : ''}`}>
                      {politician.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                      {politician.name}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">{politician.office}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    politician.party === 'APC' ? 'bg-blue-100 text-blue-700' :
                    politician.party === 'PDP' ? 'bg-red-100 text-red-700' :
                    politician.party === 'LP' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {politician.party}
                  </span>
                  <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                    <TrendingUp className="w-4 h-4" />
                    {politician.trend}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <Link
            to="/politicians"
            className="sm:hidden flex items-center justify-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors mt-6"
          >
            View All Politicians <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Fact Checker Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Fact Checker</h2>
                <p className="text-gray-600">Verifying political claims</p>
              </div>
            </div>
            <Link
              to="/fact-check"
              className="hidden sm:flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              All Fact Checks <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {factChecks.map((check, index) => (
              <div
                key={check.id}
                className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:border-primary-200 transition-all duration-300 animate-fade-in-up opacity-0"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-3 mb-4">
                  {check.verdict === 'true' && (
                    <div className="bg-green-100 p-2 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                  )}
                  {check.verdict === 'false' && (
                    <div className="bg-red-100 p-2 rounded-lg">
                      <XCircle className="w-5 h-5 text-red-600" />
                    </div>
                  )}
                  {check.verdict === 'misleading' && (
                    <div className="bg-yellow-100 p-2 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    </div>
                  )}
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                    check.verdict === 'true' ? 'bg-green-100 text-green-700' :
                    check.verdict === 'false' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {check.verdict}
                  </span>
                </div>
                <p className="text-gray-900 font-medium mb-3 line-clamp-2">{check.claim}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{check.politician}</span>
                  <span>{check.source}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/fact-check"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              <Shield className="w-5 h-5" />
              Submit a Claim to Verify
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Platform Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to stay informed about Nigerian politics
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Search, title: 'Search & Filter', desc: 'Find politicians by name, state, office, or party affiliation', color: 'primary' },
              { icon: TrendingUp, title: 'Performance Tracking', desc: 'Data-driven rankings based on verified metrics and achievements', color: 'blue' },
              { icon: Users, title: 'Detailed Profiles', desc: 'Comprehensive records of promises, bills, projects, and more', color: 'purple' },
              { icon: Vote, title: 'Opinion Polls', desc: 'Participate in polls and see regional sentiment analysis', color: 'orange' },
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="group text-center p-6 rounded-2xl bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in-up opacity-0"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`bg-${feature.color === 'primary' ? 'primary' : feature.color}-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-8 h-8 text-${feature.color === 'primary' ? 'primary' : feature.color}-600`} />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-3 rounded-xl">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Latest from Our Blog</h2>
                <p className="text-gray-600">Insights, analysis, and political commentary</p>
              </div>
            </div>
            <Link
              to="/blogs"
              className="hidden sm:flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              All Articles <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {latestBlogPosts.map((post, index) => (
              <article
                key={post.id}
                className="group bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 animate-fade-in-up opacity-0"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="h-48 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-white/50" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                    <span className="text-gray-500 text-xs flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.date).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {post.views.toLocaleString()}
                    </span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <Link
            to="/blogs"
            className="sm:hidden flex items-center justify-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors mt-6"
          >
            View All Articles <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Promise Tracker Highlight */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left opacity-0">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-6 h-6 text-primary-200" />
                <span className="text-primary-200 font-medium">Promise Tracker</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Hold Leaders Accountable
              </h2>
              <p className="text-primary-100 text-lg mb-8">
                Track campaign promises, monitor their progress, and see which politicians
                deliver on their commitments. Our AI-powered system automatically updates
                promise statuses based on verified news and government reports.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/10 backdrop-blur rounded-xl p-4 flex-1 min-w-[140px]">
                  <p className="text-3xl font-bold">68%</p>
                  <p className="text-primary-200 text-sm">Average Fulfillment</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-xl p-4 flex-1 min-w-[140px]">
                  <p className="text-3xl font-bold">15K+</p>
                  <p className="text-primary-200 text-sm">Promises Tracked</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-xl p-4 flex-1 min-w-[140px]">
                  <p className="text-3xl font-bold">Daily</p>
                  <p className="text-primary-200 text-sm">Updates</p>
                </div>
              </div>
            </div>
            <div className="animate-slide-in-right opacity-0" style={{ animationDelay: '0.2s' }}>
              <div className="bg-white rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <Award className="w-8 h-8 text-primary-600" />
                  <h3 className="font-bold text-gray-900 text-lg">Top Promise Keepers</h3>
                </div>
                {[
                  { name: 'Governor A', state: 'Lagos', rate: 78 },
                  { name: 'Governor B', state: 'Rivers', rate: 72 },
                  { name: 'Governor C', state: 'Kaduna', rate: 68 },
                ].map((governor, index) => (
                  <div key={index} className="flex items-center gap-4 py-3 border-b last:border-0">
                    <span className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-sm">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{governor.name}</p>
                      <p className="text-sm text-gray-500">{governor.state} State</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary-600">{governor.rate}%</p>
                      <p className="text-xs text-gray-500">fulfilled</p>
                    </div>
                  </div>
                ))}
                <Link
                  to="/rankings"
                  className="mt-4 w-full py-3 bg-primary-50 text-primary-700 rounded-xl font-medium hover:bg-primary-100 transition-colors flex items-center justify-center gap-2"
                >
                  View Full Rankings <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter & CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg animate-scale-in opacity-0">
              <div className="bg-primary-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="w-8 h-8 text-primary-600" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Stay Informed, Stay Empowered
              </h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Get weekly updates on political developments, new rankings, fact-checks,
                and exclusive analysis delivered to your inbox.
              </p>
              <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
              <p className="text-xs text-gray-500 mt-4">
                By subscribing, you agree to receive emails from The Peoples Affairs.
                Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Join Over 100,000 Informed Nigerians
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Make better decisions at the ballot box. Explore comprehensive political data,
            verified facts, and community-driven insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-4 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              Create Free Account
            </Link>
            <Link
              to="/about"
              className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
