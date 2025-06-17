import React from "react";
import { Share2, Users, Eye, Heart, MessageCircle, BarChart3, TrendingUp, Calendar } from "lucide-react";
import { useSocialMediaData } from "@/hooks/useSocialMediaData";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorMessage } from "@/components/common/ErrorMessage";

const SocialMediaFootprintPage: React.FC = () => {
  const { platforms, topPosts, metrics, selectedTimeframe, loading, error, updateTimeframe, refetch } = useSocialMediaData();

  const timeframes = [
    { value: "7days", label: "Last 7 Days" },
    { value: "30days", label: "Last 30 Days" },
    { value: "90days", label: "Last 90 Days" },
    { value: "1year", label: "Last Year" },
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const headerActions = (
    <select
      value={selectedTimeframe}
      onChange={(e) => updateTimeframe(e.target.value)}
      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-oxford_blue-500 focus:border-transparent"
    >
      {timeframes.map((timeframe) => (
        <option key={timeframe.value} value={timeframe.value}>
          {timeframe.label}
        </option>
      ))}
    </select>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Loading social media data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ErrorMessage message={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Social Media Footprint"
          description="Track your presence and engagement across all social platforms"
          icon={<Share2 className="w-8 h-8 text-oxford_blue-600" />}
          actions={headerActions}
        />

        {/* Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center text-gray-600">
                <Users className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Total Followers</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{formatNumber(metrics.totalFollowers)}</div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />+{metrics.growthRate}% from last period
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center text-gray-600">
                <Eye className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Total Reach</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{formatNumber(metrics.totalReach)}</div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              +8.3% from last period
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center text-gray-600">
                <Heart className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Avg Engagement</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{metrics.avgEngagement}%</div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              +0.7% from last period
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center text-gray-600">
                <BarChart3 className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Total Posts</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{metrics.totalPosts}</div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              +15 from last period
            </div>
          </div>
        </div>

        {/* Platform Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Platform Performance</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {platforms.map((platform) => (
              <div key={platform.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full ${platform.color} mr-3`}></div>
                    <h3 className="text-lg font-semibold text-gray-900">{platform.name}</h3>
                  </div>
                  <div className="flex items-center text-sm text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />+{platform.growth}%
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Followers</p>
                    <p className="text-xl font-bold text-gray-900">{formatNumber(platform.followers)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Engagement</p>
                    <p className="text-xl font-bold text-gray-900">{platform.engagement}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Posts</p>
                    <p className="text-xl font-bold text-gray-900">{platform.posts}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Reach</p>
                    <p className="text-xl font-bold text-gray-900">{formatNumber(platform.reach)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Posts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Performing Posts</h2>
          <div className="space-y-4">
            {topPosts.map((post) => (
              <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="px-2 py-1 bg-oxford_blue-100 text-oxford_blue-800 rounded-md text-xs font-medium mr-2">{post.platform}</span>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(post.date).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="text-gray-900 font-medium mb-3">{post.content}</p>
                    {post.hashtags && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {post.hashtags.map((hashtag, index) => (
                          <span key={index} className="text-xs text-oxford_blue-600 bg-oxford_blue-50 px-2 py-1 rounded">
                            {hashtag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center">
                    <Heart className="w-4 h-4 text-red-500 mr-2" />
                    <span className="text-sm text-gray-600">{formatNumber(post.likes)} likes</span>
                  </div>
                  <div className="flex items-center">
                    <MessageCircle className="w-4 h-4 text-blue-500 mr-2" />
                    <span className="text-sm text-gray-600">{post.comments} comments</span>
                  </div>
                  <div className="flex items-center">
                    <Share2 className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-sm text-gray-600">{post.shares} shares</span>
                  </div>
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 text-purple-500 mr-2" />
                    <span className="text-sm text-gray-600">{formatNumber(post.reach)} reach</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaFootprintPage;
