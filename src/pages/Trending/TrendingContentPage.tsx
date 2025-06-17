import React from "react";
import { TrendingUp, Hash, Eye, Heart, MessageCircle, Share2, Clock } from "lucide-react";
import { useTrendingData } from "@/hooks/useTrendingData";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorMessage } from "@/components/common/ErrorMessage";

const TrendingContentPage: React.FC = () => {
  const { hashtags, topics, viralContent, selectedCategory, selectedTimeframe, loading, error, updateCategory, updateTimeframe, refetch } = useTrendingData();

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "food", label: "Food" },
    { value: "service", label: "Service" },
    { value: "experience", label: "Experience" },
    { value: "general", label: "General" },
  ];

  const timeframes = [
    { value: "24hours", label: "Last 24 Hours" },
    { value: "7days", label: "Last 7 Days" },
    { value: "30days", label: "Last 30 Days" },
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const filteredHashtags = selectedCategory === "all" ? hashtags : hashtags.filter((hashtag) => hashtag.category === selectedCategory);

  const headerActions = (
    <>
      <select
        value={selectedCategory}
        onChange={(e) => updateCategory(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-oxford_blue-500 focus:border-transparent"
      >
        {categories.map((category) => (
          <option key={category.value} value={category.value}>
            {category.label}
          </option>
        ))}
      </select>
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
    </>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Loading trending data...</p>
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
          title="Trending Content"
          description="Discover what's trending about your restaurant across social media"
          icon={<TrendingUp className="w-8 h-8 text-oxford_blue-600" />}
          actions={headerActions}
        />

        {/* Trending Hashtags */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center mb-6">
            <Hash className="w-5 h-5 text-oxford_blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Trending Hashtags</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredHashtags.map((hashtag) => (
              <div key={hashtag.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold text-oxford_blue-600">{hashtag.tag}</span>
                  <div className="flex items-center text-sm text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />+{hashtag.growth}%
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-2">{formatNumber(hashtag.mentions)} mentions</p>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">{hashtag.category}</span>
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-medium ${
                      hashtag.sentiment === "positive" ? "bg-green-100 text-green-800" : hashtag.sentiment === "negative" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {hashtag.sentiment}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {hashtag.platforms.map((platform, index) => (
                    <span key={index} className="text-xs text-oxford_blue-600 bg-oxford_blue-50 px-2 py-1 rounded">
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Topics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Trending Topics</h2>
          <div className="space-y-4">
            {topics.map((topic) => (
              <div key={topic.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 mr-3">{topic.topic}</h3>
                      <div
                        className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          topic.sentiment === "positive" ? "bg-green-100 text-green-800" : topic.sentiment === "negative" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {topic.sentiment}
                      </div>
                    </div>
                    <p className="text-gray-600 mb-3">{topic.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {topic.platforms.map((platform, index) => (
                        <span key={index} className="px-2 py-1 bg-oxford_blue-50 text-oxford_blue-700 rounded-md text-xs font-medium">
                          {platform}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {topic.keywords.map((keyword, index) => (
                        <span key={index} className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="flex items-center text-sm text-green-600 mb-1">
                      <TrendingUp className="w-4 h-4 mr-1" />+{topic.growth}%
                    </div>
                    <p className="text-sm text-gray-600">{topic.mentions} mentions</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Viral Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Viral Content</h2>
          <div className="space-y-6">
            {viralContent.map((content) => (
              <div key={content.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="px-2 py-1 bg-oxford_blue-100 text-oxford_blue-800 rounded-md text-xs font-medium mr-2">{content.platform}</span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium mr-2">{content.contentType}</span>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {new Date(content.date).toLocaleDateString()}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{content.content}</h3>
                  </div>
                  <div className="flex items-center text-sm text-green-600 ml-4">
                    <TrendingUp className="w-4 h-4 mr-1" />+{content.growth}%
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 text-purple-500 mr-2" />
                    <span className="text-sm text-gray-600">{formatNumber(content.views)} views</span>
                  </div>
                  <div className="flex items-center">
                    <Heart className="w-4 h-4 text-red-500 mr-2" />
                    <span className="text-sm text-gray-600">{formatNumber(content.likes)} likes</span>
                  </div>
                  <div className="flex items-center">
                    <Share2 className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-sm text-gray-600">{content.shares} shares</span>
                  </div>
                  <div className="flex items-center">
                    <MessageCircle className="w-4 h-4 text-blue-500 mr-2" />
                    <span className="text-sm text-gray-600">{content.comments} comments</span>
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

export default TrendingContentPage;
