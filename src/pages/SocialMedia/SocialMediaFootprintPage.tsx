import React, { useState } from "react";
import { Share2, Users, Eye, Heart, MessageCircle, BarChart3, TrendingUp, Calendar } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";

const SocialMediaFootprintPage: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("30days");

  const socialMediaData = {
    platforms: [
      {
        name: "Instagram",
        followers: 12500,
        engagement: 4.2,
        posts: 45,
        reach: 89000,
        color: "bg-pink-500",
        growth: 8.5,
      },
      {
        name: "Facebook",
        followers: 8900,
        engagement: 3.1,
        posts: 32,
        reach: 67000,
        color: "bg-blue-600",
        growth: 5.2,
      },
      {
        name: "TikTok",
        followers: 15600,
        engagement: 6.8,
        posts: 28,
        reach: 125000,
        color: "bg-black",
        growth: 15.3,
      },
      {
        name: "Twitter",
        followers: 5400,
        engagement: 2.9,
        posts: 67,
        reach: 34000,
        color: "bg-blue-400",
        growth: 3.1,
      },
    ],
    topPosts: [
      {
        id: 1,
        platform: "Instagram",
        content: "Behind the scenes: Our chef preparing the signature pasta dish",
        likes: 1250,
        comments: 89,
        shares: 45,
        reach: 15600,
        date: "2025-01-14",
      },
      {
        id: 2,
        platform: "TikTok",
        content: "Quick recipe: 30-second pasta hack that will blow your mind!",
        likes: 3400,
        comments: 234,
        shares: 567,
        reach: 45000,
        date: "2025-01-13",
      },
      {
        id: 3,
        platform: "Facebook",
        content: "Customer spotlight: Amazing review from Sarah about her dining experience",
        likes: 890,
        comments: 67,
        shares: 123,
        reach: 12000,
        date: "2025-01-12",
      },
    ],
    metrics: {
      totalFollowers: 42400,
      totalReach: 315000,
      avgEngagement: 4.25,
      totalPosts: 172,
    },
  };

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

  return (
    <div className="space-y-8">
      <PageHeader
        title="Social Media Footprint"
        description="Track your presence and engagement across all social platforms"
        icon={<Share2 className="h-8 w-8 text-blue-600" />}
        actions={
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            {timeframes.map((timeframe) => (
              <option key={timeframe.value} value={timeframe.value}>
                {timeframe.label}
              </option>
            ))}
          </select>
        }
      />

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center text-gray-600">
              <Users className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Total Followers</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{formatNumber(socialMediaData.metrics.totalFollowers)}</div>
          <div className="flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            +12.5% from last period
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center text-gray-600">
              <Eye className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Total Reach</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{formatNumber(socialMediaData.metrics.totalReach)}</div>
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
          <div className="text-3xl font-bold text-gray-900 mb-1">{socialMediaData.metrics.avgEngagement}%</div>
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
          <div className="text-3xl font-bold text-gray-900 mb-1">{socialMediaData.metrics.totalPosts}</div>
          <div className="flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            +15 from last period
          </div>
        </div>
      </div>

      {/* Platform Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Platform Performance</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {socialMediaData.platforms.map((platform, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
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
          {socialMediaData.topPosts.map((post) => (
            <div key={post.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs font-medium mr-2">{post.platform}</span>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(post.date).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-gray-900 font-medium mb-3">{post.content}</p>
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
  );
};

export default SocialMediaFootprintPage;
