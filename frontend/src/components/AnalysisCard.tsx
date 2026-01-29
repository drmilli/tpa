import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import {
  TrendingUp, FileText, Briefcase, Users, AlertTriangle,
  Newspaper, Brain, ChevronDown, ChevronUp, Loader2, Info
} from 'lucide-react';

interface AnalysisCardProps {
  politicianId: string;
}

export default function AnalysisCard({ politicianId }: AnalysisCardProps) {
  const [showMethodology, setShowMethodology] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['analysis', politicianId],
    queryFn: async () => {
      const response = await api.get(`/analysis/politician/${politicianId}`);
      return response.data.data;
    },
  });

  const { data: methodology } = useQuery({
    queryKey: ['methodology'],
    queryFn: async () => {
      const response = await api.get('/analysis/methodology');
      return response.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <p className="text-gray-500 text-center">Analysis unavailable</p>
      </div>
    );
  }

  const { scoreBreakdown, aiAnalysis, newsAnalysis } = data;

  const metrics = [
    { key: 'Promise Fulfillment', icon: FileText, color: 'text-emerald-600 bg-emerald-50', weight: '30%' },
    { key: 'Legislative Activity', icon: Briefcase, color: 'text-blue-600 bg-blue-50', weight: '20%' },
    { key: 'Project Completion', icon: TrendingUp, color: 'text-purple-600 bg-purple-50', weight: '15%' },
    { key: 'Public Sentiment', icon: Users, color: 'text-yellow-600 bg-yellow-50', weight: '15%' },
    { key: 'Media Presence', icon: Newspaper, color: 'text-cyan-600 bg-cyan-50', weight: '10%' },
    { key: 'Controversy Impact', icon: AlertTriangle, color: 'text-red-600 bg-red-50', weight: '-10%' },
  ];

  return (
    <div className="space-y-6">
      {/* Score Breakdown */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-primary-600" />
              <h3 className="font-bold text-gray-900">AI-Powered Score Analysis</h3>
            </div>
            <button
              onClick={() => setShowMethodology(!showMethodology)}
              className="flex items-center text-sm text-primary-600 hover:text-primary-700"
            >
              <Info className="w-4 h-4 mr-1" />
              How it works
              {showMethodology ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
            </button>
          </div>
        </div>

        {/* Methodology Dropdown */}
        {showMethodology && methodology && (
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
            <p className="text-sm text-gray-600 mb-3">{methodology.overview}</p>
            <div className="text-xs text-gray-500">
              <p className="font-medium mb-1">Data Sources:</p>
              <ul className="list-disc list-inside">
                {methodology.dataSources?.slice(0, 4).map((source: string, i: number) => (
                  <li key={i}>{source}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {metrics.map(metric => {
              const value = scoreBreakdown?.[metric.key] || 0;
              const Icon = metric.icon;
              return (
                <div key={metric.key} className="p-4 rounded-xl bg-gray-50">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className={`p-1.5 rounded-lg ${metric.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs text-gray-500">{metric.weight}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-700 mb-1">{metric.key}</p>
                  <div className="flex items-end justify-between">
                    <span className="text-2xl font-bold text-gray-900">{value}</span>
                    <span className="text-xs text-gray-400">/100</span>
                  </div>
                  <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        metric.key === 'Controversy Impact' ? 'bg-red-500' :
                        value >= 70 ? 'bg-emerald-500' :
                        value >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* AI Insights */}
      {aiAnalysis && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-gray-900">AI Insights</h3>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {aiAnalysis.strengths?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-emerald-700 mb-2">Strengths</h4>
                <ul className="space-y-1">
                  {aiAnalysis.strengths.map((s: string, i: number) => (
                    <li key={i} className="text-sm text-gray-600 flex items-start">
                      <span className="text-emerald-500 mr-2">+</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {aiAnalysis.weaknesses?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-red-700 mb-2">Areas for Improvement</h4>
                <ul className="space-y-1">
                  {aiAnalysis.weaknesses.map((w: string, i: number) => (
                    <li key={i} className="text-sm text-gray-600 flex items-start">
                      <span className="text-red-500 mr-2">-</span>
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {aiAnalysis.publicPerception && (
              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Public Perception</h4>
                <p className="text-sm text-gray-600">{aiAnalysis.publicPerception}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* News Analysis */}
      {newsAnalysis && newsAnalysis.recentHeadlines?.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Newspaper className="w-5 h-5 text-cyan-600" />
                <h3 className="font-bold text-gray-900">Recent Media Coverage</h3>
              </div>
              <span className="text-sm text-gray-500">{newsAnalysis.totalMentions} mentions</span>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {newsAnalysis.recentHeadlines.slice(0, 3).map((headline: string, i: number) => (
                <div key={i} className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{headline}</p>
                </div>
              ))}
            </div>
            {newsAnalysis.topTopics?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {newsAnalysis.topTopics.map((topic: string, i: number) => (
                  <span key={i} className="px-2 py-1 text-xs bg-cyan-50 text-cyan-700 rounded-full">
                    {topic}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
