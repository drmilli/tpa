import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import {
  Calendar, User, Eye, Share2, Facebook, Twitter,
  ChevronLeft, Tag, BookOpen, ThumbsUp, ThumbsDown, MessageSquare,
  Send, Reply, MoreHorizontal, Copy, Linkedin, Mail, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Comment {
  id: string;
  author: {
    name: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  likes: number;
  dislikes: number;
  replies?: Comment[];
}

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
}

export default function BlogPostPage() {
  const { slug } = useParams();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['blog', slug],
    queryFn: async () => {
      const response = await api.get(`/blogs/${slug}`);
      return response.data.data;
    },
    enabled: !!slug,
  });

  // State management
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);

  const getAuthorName = (author: BlogPost['author']) => {
    if (!author) return 'Editorial Team';
    return `${author.firstName || ''} ${author.lastName || ''}`.trim() || 'Editorial Team';
  };

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

  // Like/Dislike handlers
  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setLikeCount(prev => prev - 1);
    } else {
      setLiked(true);
      setLikeCount(prev => prev + 1);
      if (disliked) {
        setDisliked(false);
        setDislikeCount(prev => prev - 1);
      }
    }
  };

  const handleDislike = () => {
    if (disliked) {
      setDisliked(false);
      setDislikeCount(prev => prev - 1);
    } else {
      setDisliked(true);
      setDislikeCount(prev => prev + 1);
      if (liked) {
        setLiked(false);
        setLikeCount(prev => prev - 1);
      }
    }
  };

  // Share handlers
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = post?.title || '';

  const handleShare = (platform: string) => {
    let url = '';

    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'email':
        url = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`Check out this article: ${shareUrl}`)}`;
        window.location.href = url;
        return;
      case 'copy':
        navigator.clipboard.writeText(shareUrl);
        toast.success('Link copied to clipboard!');
        setShowShareMenu(false);
        return;
    }

    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
    setShowShareMenu(false);
  };

  // Comment handlers
  const handleAddComment = () => {
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      author: { name: 'Anonymous User' },
      content: commentText,
      createdAt: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
    };

    setComments(prev => [newComment, ...prev]);
    setCommentText('');
    toast.success('Comment posted successfully!');
  };

  const handleAddReply = (commentId: string) => {
    if (!replyText.trim()) return;

    const newReply: Comment = {
      id: `${commentId}-${Date.now()}`,
      author: { name: 'Anonymous User' },
      content: replyText,
      createdAt: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
    };

    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), newReply]
        };
      }
      return comment;
    }));

    setReplyText('');
    setReplyingTo(null);
    toast.success('Reply posted successfully!');
  };

  const handleCommentLike = (commentId: string, isReply = false, parentId?: string) => {
    setComments(prev => prev.map(comment => {
      if (isReply && parentId && comment.id === parentId) {
        return {
          ...comment,
          replies: comment.replies?.map(reply =>
            reply.id === commentId ? { ...reply, likes: reply.likes + 1 } : reply
          )
        };
      }
      if (comment.id === commentId) {
        return { ...comment, likes: comment.likes + 1 };
      }
      return comment;
    }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const CommentComponent = ({ comment, isReply = false, parentId }: { comment: Comment; isReply?: boolean; parentId?: string }) => (
    <div className={`${isReply ? 'ml-12 mt-4' : ''}`}>
      <div className="flex items-start space-x-3">
        <div className={`${isReply ? 'w-8 h-8' : 'w-10 h-10'} bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 text-sm`}>
          {comment.author.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </div>
        <div className="flex-1">
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-900 text-sm">{comment.author.name}</span>
                <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
              </div>
              <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
            <p className="text-gray-700 text-sm">{comment.content}</p>
          </div>

          {/* Comment Actions */}
          <div className="flex items-center space-x-4 mt-2 px-2">
            <button
              onClick={() => handleCommentLike(comment.id, isReply, parentId)}
              className="flex items-center space-x-1 text-gray-500 hover:text-primary-600 transition text-sm"
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{comment.likes}</span>
            </button>
            {!isReply && (
              <button
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                className="flex items-center space-x-1 text-gray-500 hover:text-primary-600 transition text-sm"
              >
                <Reply className="w-4 h-4" />
                <span>Reply</span>
              </button>
            )}
          </div>

          {/* Reply Input */}
          {replyingTo === comment.id && (
            <div className="mt-3 flex items-start space-x-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-xs font-semibold flex-shrink-0">
                AU
              </div>
              <div className="flex-1 flex items-center space-x-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddReply(comment.id)}
                />
                <button
                  onClick={() => handleAddReply(comment.id)}
                  disabled={!replyText.trim()}
                  className="p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-2">
              {comment.replies.map(reply => (
                <CommentComponent key={reply.id} comment={reply} isReply parentId={comment.id} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Article Not Found</h2>
          <p className="text-gray-600 mb-6">The article you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/blogs"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero/Header */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-12">
        <div className="container mx-auto px-4">
          <Link
            to="/blogs"
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
              <span className="text-primary-200">{post.readTime || 5} min read</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
            <p className="text-lg text-primary-100 mb-6">{post.excerpt}</p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-primary-200">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                <span>{getAuthorName(post.author)}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                <span>{(post.views || 0).toLocaleString()} views</span>
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
            <div className="bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl h-64 md:h-96 flex items-center justify-center mb-8 -mt-16 shadow-xl overflow-hidden">
              {post.featuredImage ? (
                <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
              ) : (
                <BookOpen className="w-24 h-24 text-white/30" />
              )}
            </div>

            {/* Article Content */}
            <article className="bg-white rounded-2xl border border-gray-100 p-6 md:p-10 shadow-sm">
              <div
                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-li:text-gray-600 prose-strong:text-gray-900"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <div className="flex items-center flex-wrap gap-2">
                    <Tag className="w-4 h-4 text-gray-400" />
                    {post.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-primary-100 hover:text-primary-700 cursor-pointer transition"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Engagement */}
              <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleLike}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full transition ${
                      liked
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    <ThumbsUp className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                    <span className="font-medium">{likeCount}</span>
                  </button>
                  <button
                    onClick={handleDislike}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full transition ${
                      disliked
                        ? 'bg-red-100 text-red-700'
                        : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    <ThumbsDown className={`w-5 h-5 ${disliked ? 'fill-current' : ''}`} />
                    <span className="font-medium">{dislikeCount}</span>
                  </button>
                  <div className="flex items-center space-x-2 text-gray-500 px-4 py-2">
                    <MessageSquare className="w-5 h-5" />
                    <span className="font-medium">{comments.length} comments</span>
                  </div>
                </div>

                {/* Share Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-full transition"
                  >
                    <Share2 className="w-5 h-5" />
                    <span className="font-medium hidden sm:inline">Share</span>
                  </button>

                  {showShareMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowShareMenu(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20">
                        <button
                          onClick={() => handleShare('facebook')}
                          className="w-full px-4 py-2.5 flex items-center space-x-3 hover:bg-gray-50 transition"
                        >
                          <Facebook className="w-5 h-5 text-blue-600" />
                          <span className="text-gray-700">Share on Facebook</span>
                        </button>
                        <button
                          onClick={() => handleShare('twitter')}
                          className="w-full px-4 py-2.5 flex items-center space-x-3 hover:bg-gray-50 transition"
                        >
                          <Twitter className="w-5 h-5 text-sky-500" />
                          <span className="text-gray-700">Share on Twitter</span>
                        </button>
                        <button
                          onClick={() => handleShare('linkedin')}
                          className="w-full px-4 py-2.5 flex items-center space-x-3 hover:bg-gray-50 transition"
                        >
                          <Linkedin className="w-5 h-5 text-blue-700" />
                          <span className="text-gray-700">Share on LinkedIn</span>
                        </button>
                        <button
                          onClick={() => handleShare('email')}
                          className="w-full px-4 py-2.5 flex items-center space-x-3 hover:bg-gray-50 transition"
                        >
                          <Mail className="w-5 h-5 text-gray-600" />
                          <span className="text-gray-700">Share via Email</span>
                        </button>
                        <div className="border-t border-gray-100 my-1" />
                        <button
                          onClick={() => handleShare('copy')}
                          className="w-full px-4 py-2.5 flex items-center space-x-3 hover:bg-gray-50 transition"
                        >
                          <Copy className="w-5 h-5 text-gray-600" />
                          <span className="text-gray-700">Copy Link</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </article>

            {/* Author Box */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-6 shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                  {getAuthorName(post.author).split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{getAuthorName(post.author)}</h3>
                  <p className="text-gray-600 text-sm mt-1">Contributing writer at The Peoples Affairs.</p>
                  <Link to="/about" className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2 inline-block">
                    View all articles
                  </Link>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-6 shadow-sm">
              <h3 className="font-bold text-gray-900 text-lg mb-6 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-primary-600" />
                Comments ({comments.length})
              </h3>

              {/* Add Comment */}
              <div className="flex items-start space-x-3 mb-8">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-semibold flex-shrink-0">
                  AU
                </div>
                <div className="flex-1">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Share your thoughts..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={handleAddComment}
                      disabled={!commentText.trim()}
                      className="px-5 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center space-x-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Post Comment</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-6">
                {comments.map(comment => (
                  <CommentComponent key={comment.id} comment={comment} />
                ))}
              </div>

              {comments.length === 0 && (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No comments yet. Be the first to share your thoughts!</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* CTA */}
            <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl p-5 text-white sticky top-4">
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

            {/* Back to Blog */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <Link
                to="/blogs"
                className="flex items-center text-primary-600 hover:text-primary-700 font-medium"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Browse All Articles
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
