import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { HorizontalAd, SquareAd } from '@/components/AdUnit';
import {
  Calendar, User, Eye, Share2, Facebook, Twitter,
  ChevronLeft, Tag, BookOpen, ThumbsUp, ThumbsDown, MessageSquare,
  Send, Reply, MoreHorizontal, Copy, Linkedin, Mail, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Comment {
  id: string;
  User?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  content: string;
  createdAt: string;
  likes: number;
  dislikes: number;
  Replies?: Comment[];
}

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author?: {
    firstName: string;
    lastName: string;
  };
  publishedAt: string;
  createdAt?: string;
  readTime?: number;
  views: number;
  featuredImage?: string;
  coverImage?: string;
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

  // Fetch comments
  const { data: commentsData, refetch: refetchComments } = useQuery({
    queryKey: ['blogComments', post?.id],
    queryFn: async () => {
      if (!post?.id) return [];
      const response = await api.get(`/blogs/${post.id}/comments`);
      return response.data.data;
    },
    enabled: !!post?.id,
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
  const [readingProgress, setReadingProgress] = useState(0);

  const comments = commentsData || [];

  // Reading progress tracker
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
      setReadingProgress(Math.min(100, Math.max(0, scrollPercent)));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
  const handleAddComment = async () => {
    if (!commentText.trim() || !post?.id) return;

    try {
      await api.post(`/blogs/${post.id}/comments`, {
        content: commentText,
      });

      setCommentText('');
      refetchComments();
      toast.success('Comment posted successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Failed to post comment');
    }
  };

  const handleAddReply = async (commentId: string) => {
    if (!replyText.trim() || !post?.id) return;

    try {
      await api.post(`/blogs/${post.id}/comments`, {
        content: replyText,
        parentId: commentId,
      });

      setReplyText('');
      setReplyingTo(null);
      refetchComments();
      toast.success('Reply posted successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Failed to post reply');
    }
  };

  const handleCommentLike = async (commentId: string) => {
    try {
      await api.patch(`/comments/${commentId}`, {
        action: 'like',
      });
      refetchComments();
    } catch (error: any) {
      toast.error('Failed to like comment');
    }
  };

  const handleCommentDislike = async (commentId: string) => {
    try {
      await api.patch(`/comments/${commentId}`, {
        action: 'dislike',
      });
      refetchComments();
    } catch (error: any) {
      toast.error('Failed to dislike comment');
    }
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

  const getCommentAuthorName = (comment: Comment) => {
    if (comment.User) {
      return `${comment.User.firstName || ''} ${comment.User.lastName || ''}`.trim() || 'User';
    }
    return 'Anonymous';
  };

  const getCommentAuthorInitials = (comment: Comment) => {
    const name = getCommentAuthorName(comment);
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  const CommentComponent = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <div className={`${isReply ? 'ml-12 mt-4' : ''}`}>
      <div className="flex items-start space-x-3">
        <div className={`${isReply ? 'w-8 h-8' : 'w-10 h-10'} bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 text-sm`}>
          {getCommentAuthorInitials(comment)}
        </div>
        <div className="flex-1">
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-900 text-sm">{getCommentAuthorName(comment)}</span>
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
              onClick={() => handleCommentLike(comment.id)}
              className="flex items-center space-x-1 text-gray-500 hover:text-primary-600 transition text-sm"
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{comment.likes}</span>
            </button>
            <button
              onClick={() => handleCommentDislike(comment.id)}
              className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition text-sm"
            >
              <ThumbsDown className="w-4 h-4" />
              <span>{comment.dislikes}</span>
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
          {comment.Replies && comment.Replies.length > 0 && (
            <div className="mt-2">
              {comment.Replies.map(reply => (
                <CommentComponent key={reply.id} comment={reply} isReply />
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
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
        <div
          className="h-full bg-gradient-to-r from-primary-500 to-emerald-500 transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Hero/Header */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-12 mt-1">
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
                <span>{new Date(post.publishedAt || post.createdAt || new Date()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
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
              {(post.coverImage || post.featuredImage) ? (
                <img src={post.coverImage || post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
              ) : (
                <BookOpen className="w-24 h-24 text-white/30" />
              )}
            </div>

            {/* Article Content */}
            <article className="bg-white rounded-2xl border border-gray-100 p-6 md:p-10 shadow-sm">
              {/* Article Introduction */}
              {post.excerpt && (
                <div className="mb-8 pb-6 border-b-2 border-gray-100">
                  <p className="text-xl text-gray-600 leading-relaxed italic">
                    {post.excerpt}
                  </p>
                </div>
              )}

              <div
                className="prose prose-lg max-w-none
                  first-letter:text-7xl first-letter:font-bold first-letter:text-primary-600 first-letter:float-left first-letter:mr-3 first-letter:leading-[0.85]
                  prose-headings:font-bold prose-headings:text-gray-900 prose-headings:tracking-tight
                  prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-8 prose-h1:pb-3 prose-h1:border-b-2 prose-h1:border-primary-200
                  prose-h2:text-3xl prose-h2:mb-5 prose-h2:mt-12 prose-h2:text-primary-700 prose-h2:relative prose-h2:pl-4 prose-h2:before:content-[''] prose-h2:before:absolute prose-h2:before:left-0 prose-h2:before:top-0 prose-h2:before:bottom-0 prose-h2:before:w-1 prose-h2:before:bg-primary-500
                  prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-8 prose-h3:text-gray-800
                  prose-h4:text-xl prose-h4:mb-3 prose-h4:mt-6 prose-h4:text-gray-700
                  prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-lg
                  prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline hover:prose-a:text-primary-700 prose-a:font-medium prose-a:transition-colors
                  prose-strong:text-gray-900 prose-strong:font-semibold prose-strong:bg-yellow-50 prose-strong:px-1
                  prose-em:text-gray-700 prose-em:italic
                  prose-code:bg-gray-100 prose-code:text-primary-600 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none prose-code:border prose-code:border-gray-200
                  prose-pre:bg-gradient-to-br prose-pre:from-gray-900 prose-pre:to-gray-800 prose-pre:text-gray-100 prose-pre:rounded-xl prose-pre:p-5 prose-pre:overflow-x-auto prose-pre:shadow-xl prose-pre:border prose-pre:border-gray-700
                  prose-blockquote:border-l-4 prose-blockquote:border-primary-500 prose-blockquote:bg-gradient-to-r prose-blockquote:from-primary-50 prose-blockquote:to-transparent prose-blockquote:pl-6 prose-blockquote:pr-6 prose-blockquote:py-5 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:my-8 prose-blockquote:shadow-sm
                  prose-blockquote:text-gray-700 prose-blockquote:font-normal prose-blockquote:text-xl
                  prose-ul:list-none prose-ul:pl-0 prose-ul:my-6 prose-ul:space-y-3
                  prose-ul>li:pl-6 prose-ul>li:relative prose-ul>li:before:content-['→'] prose-ul>li:before:absolute prose-ul>li:before:left-0 prose-ul>li:before:text-primary-600 prose-ul>li:before:font-bold
                  prose-ol:list-none prose-ol:pl-0 prose-ol:my-6 prose-ol:space-y-3 prose-ol:counter-reset-[item]
                  prose-ol>li:pl-8 prose-ol>li:relative prose-ol>li:counter-increment-[item] prose-ol>li:before:content-[counter(item)] prose-ol>li:before:absolute prose-ol>li:before:left-0 prose-ol>li:before:top-0 prose-ol>li:before:w-6 prose-ol>li:before:h-6 prose-ol>li:before:bg-primary-600 prose-ol>li:before:text-white prose-ol>li:before:rounded-full prose-ol>li:before:flex prose-ol>li:before:items-center prose-ol>li:before:justify-center prose-ol>li:before:text-sm prose-ol>li:before:font-semibold
                  prose-li:text-gray-700 prose-li:leading-relaxed prose-li:text-lg
                  prose-img:rounded-2xl prose-img:shadow-2xl prose-img:my-10 prose-img:w-full prose-img:border-4 prose-img:border-gray-100
                  prose-hr:border-t-2 prose-hr:border-gray-200 prose-hr:my-12
                  prose-table:border-collapse prose-table:w-full prose-table:my-8 prose-table:shadow-md prose-table:rounded-xl prose-table:overflow-hidden
                  prose-thead:bg-gradient-to-r prose-thead:from-gray-50 prose-thead:to-gray-100 prose-thead:border-b-2 prose-thead:border-gray-300
                  prose-th:px-6 prose-th:py-4 prose-th:text-left prose-th:font-semibold prose-th:text-gray-900 prose-th:text-sm prose-th:uppercase prose-th:tracking-wider
                  prose-td:px-6 prose-td:py-4 prose-td:border-b prose-td:border-gray-200 prose-td:text-gray-700
                  prose-tr:transition-colors prose-tr:hover:bg-gray-50"
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

            {/* Ad after article */}
            <HorizontalAd className="mt-6" />

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
                {comments.map((comment: Comment) => (
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

            {/* Ad in sidebar */}
            <SquareAd className="rounded-xl overflow-hidden" />

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
