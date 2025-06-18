import React, { useState } from "react";
import { TrendingUp, Hash, Eye, Heart, MessageCircle, Share2, Clock } from "lucide-react";

const TrendingContentPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTimeframe, setSelectedTimeframe] = useState("24hours");

  const trendingData = {
    hashtags: [
      { tag: "#foodie", mentions: 1250, growth: 45.2, category: "food" },
      { tag: "#restaurant", mentions: 890, growth: 32.1, category: "general" },
      { tag: "#pasta", mentions: 567, growth: 78.5, category: "food" },
      { tag: "#datenight", mentions: 445, growth: 23.7, category: "experience" },
      { tag: "#delicious", mentions: 389, growth: 56.3, category: "food" },
      { tag: "#service", mentions: 234, growth: 12.8, category: "service" },
    ],
    trendingTopics: [
      {
        id: 1,
        topic: "Signature Pasta Dish",
        mentions: 234,
        sentiment: "positive",
        growth: 67.5,
        platforms: ["Instagram", "TikTok", "Facebook"],
        description: "Customers are raving about the new signature pasta dish",
      },
      {
        id: 2,
        topic: "Weekend Brunch Menu",
        mentions: 189,
        sentiment: "positive",
        growth: 45.2,
        platforms: ["Instagram", "Facebook"],
        description: "The weekend brunch menu is gaining popularity",
      },
      {
        id: 3,
        topic: "Outdoor Seating",
        mentions: 156,
        sentiment: "positive",
        growth: 34.8,
        platforms: ["Google Reviews", "TripAdvisor"],
        description: "Customers love the new outdoor seating area",
      },
      {
        id: 4,
        topic: "Wait Times",
        mentions: 98,
        sentiment: "negative",
        growth: 23.1,
        platforms: ["Google Reviews", "Facebook"],
        description: "Some concerns about wait times during peak hours",
      },
    ],
    viralContent: [
      {
        id: 1,
        platform: "TikTok",
        content: "Chef reveals secret ingredient in viral pasta recipe",
        views: 125000,
        likes: 8900,
        shares: 1200,
        comments: 567,
        growth: 234.5,
        date: "2025-01-14",
      },
      {
        id: 2,
        platform: "Instagram",
        content: "Behind-the-scenes: Morning prep in our kitchen",
        views: 45000,
        likes: 3400,
        shares: 890,
        comments: 234,
        growth: 156.7,
        date: "2025-01-13",
      },
      {
        id: 3,
        platform: "Facebook",
        content: "Customer surprise birthday celebration",
        views: 23000,
        likes: 1200,
        shares: 345,
        comments: 89,
        growth: 89.3,
        date: "2025-01-12",
      },
    ],
  };

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

  const filteredHashtags = selectedCategory === "all" ? trendingData.hashtags : trendingData.hashtags.filter((hashtag) => hashtag.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center mb-4">
              <TrendingUp className="w-8 h-8 text-oxford_blue-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Trending Content</h1>
            </div>
            <p className="text-gray-600">Discover what's trending about your restaurant across social media</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
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
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-oxford_blue-500 focus:border-transparent"
            >
              {timeframes.map((timeframe) => (
                <option key={timeframe.value} value={timeframe.value}>
                  {timeframe.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Trending Hashtags */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center mb-6">
            <Hash className="w-5 h-5 text-oxford_blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Trending Hashtags</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredHashtags.map((hashtag, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold text-oxford_blue-600">{hashtag.tag}</span>
                  <div className="flex items-center text-sm text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />+{hashtag.growth}%
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-2">{formatNumber(hashtag.mentions)} mentions</p>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">{hashtag.category}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Topics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Trending Topics</h2>
          <div className="space-y-4">
            {trendingData.trendingTopics.map((topic) => (
              <div key={topic.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 mr-3">{topic.topic}</h3>
                      <div
                        className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          topic.sentiment === "positive" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {topic.sentiment}
                      </div>
                    </div>
                    <p className="text-gray-600 mb-3">{topic.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {topic.platforms.map((platform, index) => (
                        <span key={index} className="px-2 py-1 bg-oxford_blue-50 text-oxford_blue-700 rounded-md text-xs font-medium">
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
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
            {trendingData.viralContent.map((content) => (
              <div key={content.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="px-2 py-1 bg-oxford_blue-100 text-oxford_blue-800 rounded-md text-xs font-medium mr-2">{content.platform}</span>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {new Date(content.date).toLocaleDateString()}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{content.content}</h3>
                  </div>
                  <div className="flex items-center text-sm text-green-600">
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
