import { useState } from 'react';
import {
  Plus, Search, Edit2, Trash2, Eye, FileText, Calendar,
  ChevronLeft, ChevronRight, X, Image, Tag, Clock
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  status: 'published' | 'draft' | 'scheduled';
  author: string;
  views: number;
  publishedAt: string;
}

export default function BlogsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const posts: BlogPost[] = [
    { id: '1', title: 'Understanding Nigeria\'s Electoral Process', excerpt: 'A comprehensive guide to how elections work in Nigeria...', category: 'Education', status: 'published', author: 'Admin', views: 2500, publishedAt: '2024-01-15' },
    { id: '2', title: 'Top 10 Performing Governors in 2024', excerpt: 'An analysis of gubernatorial performance across states...', category: 'Rankings', status: 'published', author: 'Admin', views: 5600, publishedAt: '2024-01-10' },
    { id: '3', title: 'The Role of Youth in Nigerian Politics', excerpt: 'How young Nigerians are shaping the political landscape...', category: 'Opinion', status: 'published', author: 'Editor', views: 1800, publishedAt: '2024-01-05' },
    { id: '4', title: 'Budget Analysis: 2024 Federal Budget', excerpt: 'Breaking down the 2024 federal budget allocations...', category: 'Analysis', status: 'draft', author: 'Admin', views: 0, publishedAt: '' },
    { id: '5', title: 'Upcoming Local Government Elections', excerpt: 'Everything you need to know about the upcoming LG elections...', category: 'News', status: 'scheduled', author: 'Editor', views: 0, publishedAt: '2024-02-01' },
  ];

  const categories = ['News', 'Analysis', 'Opinion', 'Education', 'Rankings'];
  const statuses = ['published', 'draft', 'scheduled'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-emerald-100 text-emerald-700';
      case 'draft': return 'bg-yellow-100 text-yellow-700';
      case 'scheduled': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredPosts = posts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !selectedStatus || p.status === selectedStatus;
    const matchesCategory = !selectedCategory || p.category === selectedCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalViews = posts.reduce((acc, p) => acc + p.views, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-gray-600 mt-1">Create and manage blog content</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 flex items-center space-x-2 transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Post</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-50 p-2 rounded-lg">
              <FileText className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{posts.filter(p => p.status === 'published').length}</p>
              <p className="text-sm text-gray-500">Published</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="bg-yellow-50 p-2 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{posts.filter(p => p.status === 'draft').length}</p>
              <p className="text-sm text-gray-500">Drafts</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-50 p-2 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{posts.filter(p => p.status === 'scheduled').length}</p>
              <p className="text-sm text-gray-500">Scheduled</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-50 p-2 rounded-lg">
              <Eye className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalViews.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Total Views</p>
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
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Post</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Author</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Views</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="max-w-md">
                      <p className="font-medium text-gray-900 truncate">{post.title}</p>
                      <p className="text-sm text-gray-500 truncate">{post.excerpt}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(post.status)}`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{post.author}</td>
                  <td className="px-6 py-4 text-gray-600">{post.views.toLocaleString()}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium">{filteredPosts.length}</span> posts
          </p>
          <div className="flex items-center space-x-2">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="px-4 py-2 bg-primary-50 text-primary-700 font-medium rounded-lg">{currentPage}</span>
            <button onClick={() => setCurrentPage(p => p + 1)} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Create New Post</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input type="text" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Enter post title" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
                <input type="text" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Brief summary of the post" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="">Select category</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <div className="flex items-center">
                    <Tag className="w-5 h-5 text-gray-400 mr-2" />
                    <input type="text" className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Add tags separated by commas" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea rows={8} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Write your content here..."></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-primary-400 transition cursor-pointer">
                  <Image className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex items-center justify-end space-x-3">
              <button onClick={() => setShowAddModal(false)} className="px-6 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition">Cancel</button>
              <button className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition">Save Draft</button>
              <button className="px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition">Publish</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
