import { Link, useParams } from 'react-router-dom';
import {
  Calendar, Clock, User, Eye, Share2, Facebook, Twitter,
  ChevronLeft, Tag, BookOpen, ThumbsUp, MessageSquare
} from 'lucide-react';

export default function BlogPostPage() {
  const { id } = useParams();

  // Mock data - will be replaced with API data
  const post = {
    id: id || '1',
    title: 'Understanding Nigeria\'s Electoral Process: A Complete Guide',
    excerpt: 'A comprehensive guide to how elections work in Nigeria, from voter registration to the final vote count.',
    content: `
      <p>Nigeria's electoral process is a cornerstone of its democracy, enabling citizens to choose their leaders at various levels of government. This guide provides a comprehensive overview of how elections work in Africa's most populous nation.</p>

      <h2>The Electoral Body: INEC</h2>
      <p>The Independent National Electoral Commission (INEC) is the body responsible for organizing and conducting elections in Nigeria. Established by the 1999 Constitution, INEC is charged with the responsibility of organizing elections into the offices of the President, Vice President, Governor, Deputy Governor, Senate, House of Representatives, and State House of Assembly.</p>

      <h2>Voter Registration</h2>
      <p>To participate in elections, Nigerian citizens must register as voters. The process involves:</p>
      <ul>
        <li>Being a Nigerian citizen aged 18 years or above</li>
        <li>Visiting a designated INEC registration center</li>
        <li>Providing biometric data (fingerprints and photograph)</li>
        <li>Collecting a Permanent Voter Card (PVC)</li>
      </ul>

      <h2>Types of Elections</h2>
      <p>Nigeria conducts several types of elections:</p>
      <ul>
        <li><strong>Presidential Elections:</strong> Held every four years to elect the President and Vice President</li>
        <li><strong>Gubernatorial Elections:</strong> For electing State Governors and Deputy Governors</li>
        <li><strong>National Assembly Elections:</strong> For Senate and House of Representatives</li>
        <li><strong>State Assembly Elections:</strong> For State Houses of Assembly</li>
        <li><strong>Local Government Elections:</strong> For Local Government Chairmen and Councilors</li>
      </ul>

      <h2>The Voting Process</h2>
      <p>On election day, the process typically follows these steps:</p>
      <ol>
        <li>Voter arrives at the polling unit with their PVC</li>
        <li>Accreditation using the Bimodal Voter Accreditation System (BVAS)</li>
        <li>Collection of ballot paper</li>
        <li>Marking the ballot paper in a private voting cubicle</li>
        <li>Depositing the marked ballot in the ballot box</li>
        <li>Fingerprinting with indelible ink to prevent multiple voting</li>
      </ol>

      <h2>Counting and Results</h2>
      <p>Vote counting begins immediately after the close of polls at each polling unit. Results are announced publicly and uploaded to the INEC Result Viewing Portal (IReV) in real-time for transparency.</p>

      <h2>Your Vote Matters</h2>
      <p>Every vote counts in shaping Nigeria's future. Active participation in the electoral process is crucial for a vibrant democracy. As citizens, it's our responsibility to not only vote but to also hold our elected officials accountable.</p>
    `,
    category: 'Education',
    author: {
      name: 'Editorial Team',
      bio: 'The TPA Editorial Team is dedicated to providing accurate and insightful political content.',
    },
    publishedAt: '2024-01-15',
    readTime: 8,
    views: 2500,
    likes: 342,
    comments: 28,
    tags: ['Elections', 'Democracy', 'Civic Education', 'INEC', 'Voting'],
  };

  const relatedPosts = [
    {
      id: '2',
      title: 'Top 10 Performing Governors in 2024',
      category: 'Rankings',
      publishedAt: '2024-01-10',
      readTime: 12,
    },
    {
      id: '3',
      title: 'The Role of Youth in Nigerian Politics',
      category: 'Opinion',
      publishedAt: '2024-01-05',
      readTime: 6,
    },
    {
      id: '6',
      title: 'Local Government Elections: Everything You Need to Know',
      category: 'News',
      publishedAt: '2023-12-20',
      readTime: 7,
    },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'News': return 'bg-blue-100 text-blue-700';
      case 'Analysis': return 'bg-purple-100 text-purple-700';
      case 'Opinion': return 'bg-orange-100 text-orange-700';
      case 'Education': return 'bg-emerald-100 text-emerald-700';
      case 'Rankings': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero/Header */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-12">
        <div className="container mx-auto px-4">
          <Link
            to="/blog"
            className="inline-flex items-center text-primary-100 hover:text-white mb-6 transition"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Blog
          </Link>

          <div className="max-w-3xl">
            <div className="flex items-center space-x-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(post.category)}`}>
                {post.category}
              </span>
              <span className="text-primary-200">{post.readTime} min read</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
            <p className="text-lg text-primary-100 mb-6">{post.excerpt}</p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-primary-200">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                <span>{post.author.name}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                <span>{post.views.toLocaleString()} views</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Featured Image */}
            <div className="bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl h-64 md:h-96 flex items-center justify-center mb-8 -mt-16 shadow-xl">
              <BookOpen className="w-24 h-24 text-white/30" />
            </div>

            {/* Article Content */}
            <article className="bg-white rounded-2xl border border-gray-100 p-6 md:p-10 shadow-sm">
              <div
                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-li:text-gray-600 prose-strong:text-gray-900"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex items-center flex-wrap gap-2">
                  <Tag className="w-4 h-4 text-gray-400" />
                  {post.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-primary-100 hover:text-primary-700 cursor-pointer transition"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Engagement */}
              <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <button className="flex items-center space-x-2 text-gray-500 hover:text-primary-600 transition">
                    <ThumbsUp className="w-5 h-5" />
                    <span>{post.likes}</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-500 hover:text-primary-600 transition">
                    <MessageSquare className="w-5 h-5" />
                    <span>{post.comments} comments</span>
                  </button>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-500">Share:</span>
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                    <Facebook className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-sky-500 hover:bg-sky-50 rounded-lg transition">
                    <Twitter className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </article>

            {/* Author Box */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-6 shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                  {post.author.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{post.author.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{post.author.bio}</p>
                  <Link to="/about" className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2 inline-block">
                    View all articles
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Table of Contents */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 sticky top-4">
              <h3 className="font-bold text-gray-900 mb-4">In This Article</h3>
              <nav className="space-y-2">
                <a href="#" className="block text-sm text-gray-600 hover:text-primary-600 transition py-1">
                  The Electoral Body: INEC
                </a>
                <a href="#" className="block text-sm text-gray-600 hover:text-primary-600 transition py-1">
                  Voter Registration
                </a>
                <a href="#" className="block text-sm text-gray-600 hover:text-primary-600 transition py-1">
                  Types of Elections
                </a>
                <a href="#" className="block text-sm text-gray-600 hover:text-primary-600 transition py-1">
                  The Voting Process
                </a>
                <a href="#" className="block text-sm text-gray-600 hover:text-primary-600 transition py-1">
                  Counting and Results
                </a>
                <a href="#" className="block text-sm text-gray-600 hover:text-primary-600 transition py-1">
                  Your Vote Matters
                </a>
              </nav>
            </div>

            {/* Related Posts */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-bold text-gray-900 mb-4">Related Articles</h3>
              <div className="space-y-4">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    to={`/blog/${relatedPost.id}`}
                    className="block group"
                  >
                    <span className={`text-xs px-2 py-0.5 rounded ${getCategoryColor(relatedPost.category)}`}>
                      {relatedPost.category}
                    </span>
                    <h4 className="text-sm font-medium text-gray-900 mt-2 group-hover:text-primary-600 transition line-clamp-2">
                      {relatedPost.title}
                    </h4>
                    <div className="flex items-center text-xs text-gray-400 mt-1">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{relatedPost.readTime} min read</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl p-5 text-white">
              <h3 className="font-bold mb-2">Stay Informed</h3>
              <p className="text-sm text-primary-100 mb-4">
                Get the latest political updates delivered to your inbox.
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
      </div>
    </div>
  );
}
