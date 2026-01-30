import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import {
  FileText, Search, Calendar, Clock, User, Eye,
  ChevronRight, Tag, TrendingUp, BookOpen, Loader2
} from 'lucide-react';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: {
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  readTime?: number;
  views: number;
  featuredImage?: string;
  tags: string[];
  status: string;
}

export default function BlogsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { data, isLoading, error } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const response = await api.get('/blogs');
      return response.data.data;
    },
  });

  const posts: BlogPost[] = data?.posts || [];
  const categories = ['all', 'News', 'Analysis', 'Opinion', 'Education', 'Rankings', 'Accountability'];

  const filteredPosts = posts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = posts[0];
  const popularPosts = [...posts].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'News': return 'bg-blue-100 text-blue-700';
      case 'Analysis': return 'bg-purple-100 text-purple-700';
      case 'Opinion': return 'bg-orange-100 text-orange-700';
      case 'Education': return 'bg-emerald-100 text-emerald-700';
      case 'Rankings': return 'bg-yellow-100 text-yellow-700';
      case 'Accountability': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getAuthorName = (author: BlogPost['author']) => {
    if (!author) return 'Editorial Team';
    return `${author.firstName || ''} ${author.lastName || ''}`.trim() || 'Editorial Team';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              The TPA Blog
            </h1>
            <p className="text-xl text-emerald-100">
              Stay informed with in-depth analysis, news, and insights about Nigerian politics
              and governance.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 -mt-12 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-50 p-2 rounded-lg">
                <FileText className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
                <p className="text-sm text-gray-500">Articles</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-50 p-2 rounded-lg">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{posts.reduce((a, p) => a + (p.views || 0), 0).toLocaleString()}</p>
                <p className="text-sm text-gray-500">Total Views</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-50 p-2 rounded-lg">
                <Tag className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{categories.length - 1}</p>
                <p className="text-sm text-gray-500">Categories</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="bg-orange-50 p-2 rounded-lg">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{posts.filter(p => new Date(p.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}</p>
                <p className="text-sm text-gray-500">This Week</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition ${
                    selectedCategory === cat
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat === 'all' ? 'All' : cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error || posts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No articles yet</h3>
            <p className="text-gray-500">Check back soon for the latest political insights and analysis.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Featured Post */}
              {featuredPost && selectedCategory === 'all' && !searchQuery && (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition">
                  <div className="h-64 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                    {featuredPost.featuredImage ? (
                      <img src={featuredPost.featuredImage} alt={featuredPost.title} className="w-full h-full object-cover" />
                    ) : (
                      <BookOpen className="w-20 h-20 text-white/50" />
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(featuredPost.category)}`}>
                        {featuredPost.category}
                      </span>
                      <span className="text-sm text-gray-500">Featured</span>
                    </div>
                    <Link to={`/blogs/${featuredPost.slug}`}>
                      <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-primary-600 transition">
                        {featuredPost.title}
                      </h2>
                    </Link>
                    <p className="text-gray-600 mb-4">{featuredPost.excerpt}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          <span>{getAuthorName(featuredPost.author)}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{formatDate(featuredPost.createdAt)}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{featuredPost.readTime || 5} min read</span>
                        </div>
                      </div>
                      <Link
                        to={`/blogs/${featuredPost.slug}`}
                        className="text-primary-600 hover:text-primary-700 font-medium text-sm inline-flex items-center"
                      >
                        Read More
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Posts List */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {searchQuery ? 'Search Results' : selectedCategory === 'all' ? 'Latest Articles' : selectedCategory}
                </h2>
                <div className="space-y-4">
                  {filteredPosts.map((post) => (
                    <div key={post.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition group">
                      <div className="flex gap-5">
                        <div className="hidden sm:flex w-32 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex-shrink-0 items-center justify-center overflow-hidden">
                          {post.featuredImage ? (
                            <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
                          ) : (
                            <FileText className="w-8 h-8 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(post.category)}`}>
                              {post.category}
                            </span>
                            <span className="text-xs text-gray-400">
                              {formatDate(post.createdAt)}
                            </span>
                          </div>
                          <Link to={`/blogs/${post.slug}`}>
                            <h3 className="font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition line-clamp-2">
                              {post.title}
                            </h3>
                          </Link>
                          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{post.excerpt}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3 text-xs text-gray-400">
                              <span className="flex items-center">
                                <User className="w-3 h-3 mr-1" />
                                {getAuthorName(post.author)}
                              </span>
                              <span className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {post.readTime || 5} min
                              </span>
                              <span className="flex items-center">
                                <Eye className="w-3 h-3 mr-1" />
                                {(post.views || 0).toLocaleString()}
                              </span>
                            </div>
                            <Link
                              to={`/blogs/${post.slug}`}
                              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                            >
                              Read
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredPosts.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
                    <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Popular Posts */}
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-primary-600" />
                  Popular Articles
                </h3>
                <div className="space-y-4">
                  {popularPosts.map((post, index) => (
                    <Link key={post.id} to={`/blogs/${post.slug}`} className="flex items-start gap-3 group">
                      <span className="text-2xl font-bold text-gray-200 group-hover:text-primary-400 transition">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition line-clamp-2">
                          {post.title}
                        </h4>
                        <p className="text-xs text-gray-400 mt-1">
                          {(post.views || 0).toLocaleString()} views
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="font-bold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.filter(c => c !== 'all').map(category => {
                    const count = posts.filter(p => p.category === category).length;
                    return (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 transition text-left"
                      >
                        <span className="text-gray-700">{category}</span>
                        <span className="text-sm text-gray-400">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tags */}
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="font-bold text-gray-900 mb-4">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(posts.flatMap(p => p.tags || []))).slice(0, 10).map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-primary-100 hover:text-primary-700 cursor-pointer transition"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl p-5 text-white">
                <h3 className="font-bold mb-2">Subscribe to Newsletter</h3>
                <p className="text-sm text-primary-100 mb-4">
                  Get the latest political analysis and news delivered to your inbox.
                </p>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 mb-3"
                />
                <button className="w-full px-4 py-2 bg-white text-primary-700 rounded-lg font-medium hover:bg-gray-100 transition">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
