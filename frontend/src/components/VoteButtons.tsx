import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import toast from 'react-hot-toast';

interface VoteButtonsProps {
  type: 'project' | 'promise' | 'controversy';
  itemId: string;
  upvotes: number;
  downvotes: number;
  onVoteChange?: () => void;
}

export default function VoteButtons({ type, itemId, upvotes: initialUpvotes, downvotes: initialDownvotes, onVoteChange }: VoteButtonsProps) {
  const [upvotes, setUpvotes] = useState(initialUpvotes || 0);
  const [downvotes, setDownvotes] = useState(initialDownvotes || 0);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);

  const isLoggedIn = !!localStorage.getItem('token');

  const voteMutation = useMutation({
    mutationFn: async (voteType: 'up' | 'down') => {
      const response = await api.post(`/politicians/vote/${type}/${itemId}`, { voteType });
      return response.data;
    },
    onSuccess: (data, voteType) => {
      const { action } = data.data;

      if (action === 'added') {
        if (voteType === 'up') {
          setUpvotes(prev => prev + 1);
        } else {
          setDownvotes(prev => prev + 1);
        }
        setUserVote(voteType);
      } else if (action === 'removed') {
        if (voteType === 'up') {
          setUpvotes(prev => prev - 1);
        } else {
          setDownvotes(prev => prev - 1);
        }
        setUserVote(null);
      } else if (action === 'changed') {
        if (voteType === 'up') {
          setUpvotes(prev => prev + 1);
          setDownvotes(prev => prev - 1);
        } else {
          setUpvotes(prev => prev - 1);
          setDownvotes(prev => prev + 1);
        }
        setUserVote(voteType);
      }

      onVoteChange?.();
    },
    onError: (error: any) => {
      if (error.response?.status === 401) {
        toast.error('Please login to vote');
      } else {
        toast.error(error.response?.data?.error || 'Failed to vote');
      }
    },
  });

  const handleVote = (voteType: 'up' | 'down') => {
    if (!isLoggedIn) {
      toast.error('Please login to vote');
      return;
    }
    voteMutation.mutate(voteType);
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => handleVote('up')}
        disabled={voteMutation.isPending}
        className={`flex items-center space-x-1 px-2 py-1 rounded-lg transition text-xs ${
          userVote === 'up'
            ? 'bg-emerald-100 text-emerald-700'
            : 'bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600'
        }`}
      >
        <ThumbsUp className="w-3 h-3" />
        <span>{upvotes}</span>
      </button>
      <button
        onClick={() => handleVote('down')}
        disabled={voteMutation.isPending}
        className={`flex items-center space-x-1 px-2 py-1 rounded-lg transition text-xs ${
          userVote === 'down'
            ? 'bg-red-100 text-red-700'
            : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
        }`}
      >
        <ThumbsDown className="w-3 h-3" />
        <span>{downvotes}</span>
      </button>
    </div>
  );
}
