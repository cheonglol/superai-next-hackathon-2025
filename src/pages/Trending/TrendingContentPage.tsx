import React, { useState } from "react";
import { TrendingUp, Hash, Eye, Heart, MessageCircle, Share2, Clock, Filter, Users, Star, ExternalLink, Lightbulb, Target, Zap } from "lucide-react";
import { useTrendingData } from "@/hooks/useTrendingData";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorMessage } from "@/components/common/ErrorMessage";

const TrendingContentPage: React.FC = () => {
  const { hashtags, topics, viralContent, selectedCategory, selectedTimeframe, loading, error, updateCategory, updateTimeframe, refetch } = useTrendingData();
  const [activeTab, setActiveTab] = useState<"trending" | "strategies" | "insights">("trending");

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

  // Mock data for trending posts
  const trendingPosts = [
    {
      id: "1",
      platform: "TikTok",
      content: "Chef reveals secret ingredient in viral pasta recipe",
      imageUrl: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400",
      author: "@foodie_chef",
      authorAvatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100",
      authorFollowers: 125000,
      likes: 8900,
      comments: 567,
      shares: 1200,
      views: 125000,
      engagement: 8.2,
      viralScore: 94,
      postUrl: "#",
      createdAt: "2025-01-14",
      hashtags: ["#pasta", "#recipe", "#chef", "#viral"],
      contentType: "organic" as const,
      category: "food",
      businessInsights: {
        keyTakeaways: ["Secret ingredient creates curiosity", "Behind-the-scenes content performs well"],
        applicableStrategies: ["Share cooking secrets", "Create mystery around recipes"],
        estimatedCost: "$0-50",
        difficulty: "Easy" as const,
        roi: "High" as const,
      },
    },
    {
      id: "2",
      platform: "Instagram",
      content: "Behind-the-scenes: Morning prep in our kitchen",
      imageUrl: "https://images.pexels.com/photos/2696064/pexels-photo-2696064.jpeg?auto=compress&cs=tinysrgb&w=400",
      author: "@restaurant_daily",
      authorAvatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100",
      authorFollowers: 45000,
      likes: 3400,
      comments: 234,
      shares: 890,
      views: 45000,
      engagement: 10.1,
      viralScore: 87,
      postUrl: "#",
      createdAt: "2025-01-13",
      hashtags: ["#behindthescenes", "#prep", "#kitchen"],
      contentType: "organic" as const,
      category: "experience",
      businessInsights: {
        keyTakeaways: ["Transparency builds trust", "Process content is engaging"],
        applicableStrategies: ["Show daily operations", "Highlight team work"],
        estimatedCost: "$0-25",
        difficulty: "Easy" as const,
        roi: "Medium" as const,
      },
    },
  ];

  // Mock data for content strategies
  const contentStrategies = [
    {
      id: "1",
      title: "Recipe Reveal Series",
      description: "Share signature dish recipes with step-by-step videos",
      category: "Content Creation",
      difficulty: "Medium" as const,
      expectedRoi: "High" as const,
      platforms: ["TikTok", "Instagram", "YouTube"],
      keyMetrics: ["Views", "Saves", "Shares", "Comments"],
      successExamples: [
        { restaurant: "Pasta Palace", result: "300% increase in followers", metric: "3M views" },
        { restaurant: "Chef's Table", result: "50% boost in reservations", metric: "500K saves" },
      ],
      actionSteps: [
        "Identify 3-5 signature dishes",
        "Create filming schedule",
        "Develop consistent format",
        "Post weekly on optimal days",
      ],
      requiredResources: ["Camera/phone", "Basic editing software", "2-3 hours/week"],
    },
    {
      id: "2",
      title: "Customer Story Highlights",
      description: "Feature customer experiences and celebrations",
      category: "User Generated Content",
      difficulty: "Easy" as const,
      expectedRoi: "Medium" as const,
      platforms: ["Instagram", "Facebook", "TikTok"],
      keyMetrics: ["Engagement Rate", "Mentions", "Hashtag Usage"],
      successExamples: [
        { restaurant: "Celebration Bistro", result: "40% increase in bookings", metric: "2M reach" },
      ],
      actionSteps: [
        "Ask permission to feature customers",
        "Create branded hashtag",
        "Develop story templates",
        "Post 2-3 times per week",
      ],
      requiredResources: ["Social media manager", "1-2 hours/week", "Customer consent forms"],
    },
  ];

  // Mock data for market insights
  const marketInsights = [
    {
      id: "1",
      title: "Short-Form Video Dominance",
      description: "Restaurants using short-form video content see 3x higher engagement rates",
      impact: "High" as const,
      urgency: "High" as const,
      category: "Trend" as const,
      dataPoints: [
        { metric: "Engagement Rate", value: "8.2%", change: "+156%" },
        { metric: "Reach", value: "2.3M", change: "+89%" },
        { metric: "Conversion", value: "12%", change: "+45%" },
      ],
      recommendations: [
        "Invest in short-form video content",
        "Focus on TikTok and Instagram Reels",
        "Create behind-the-scenes content",
      ],
      relatedPosts: ["1", "2"],
    },
    {
      id: "2",
      title: "Authenticity Over Production Value",
      description: "Raw, authentic content outperforms highly produced videos by 40%",
      impact: "Medium" as const,
      urgency: "Medium" as const,
      category: "Opportunity" as const,
      dataPoints: [
        { metric: "Authenticity Score", value: "9.1/10", change: "+23%" },
        { metric: "Trust Rating", value: "87%", change: "+15%" },
      ],
      recommendations: [
        "Use natural lighting and minimal editing",
        "Show real staff and genuine reactions",
        "Share honest behind-the-scenes moments",
      ],
      relatedPosts: ["2"],
    },
  ];

  const filteredHashtags = selectedCategory === "all" ? hashtags : hashtags.filter((hashtag) => hashtag.category === selectedCategory);

  const headerActions = (
    <>
      <select
        value={selectedCategory}
        onChange={(e) => updateCategory(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-caribbean_current-500 focus:border-caribbean_current-500 transition-colors"
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
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-caribbean_current-500 focus:border-caribbean_current-500 transition-colors"
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
          icon={<TrendingUp className="w-8 h-8 text-gray-700" />}
          actions={headerActions}
        />

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab("trending")}
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === "trending"
                ? "text-caribbean_current-600 border-caribbean_current-600"
                : "text-gray-600 hover:text-gray-900 border-transparent"
            }`}
          >
            <Hash className="w-4 h-4 inline mr-2" />
            Trending Posts
          </button>
          <button
            onClick={() => setActiveTab("strategies")}
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === "strategies"
                ? "text-caribbean_current-600 border-caribbean_current-600"
                : "text-gray-600 hover:text-gray-900 border-transparent"
            }`}
          >
            <Target className="w-4 h-4 inline mr-2" />
            Content Strategies
          </button>
          <button
            onClick={() => setActiveTab("insights")}
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === "insights"
                ? "text-caribbean_current-600 border-caribbean_current-600"
                : "text-gray-600 hover:text-gray-900 border-transparent"
            }`}
          >
            <Lightbulb className="w-4 h-4 inline mr-2" />
            Market Insights
          </button>
        </div>

        {/* Trending Posts Tab */}
        {activeTab === "trending" && (
          <>
            {/* Trending Hashtags */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-caribbean_current-50 rounded-lg mr-3">
                  <Hash className="w-5 h-5 text-caribbean_current-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Trending Hashtags</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredHashtags.map((hashtag) => (
                  <div key={hashtag.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-bold text-caribbean_current-600">{hashtag.tag}</span>
                      <div className="flex items-center text-sm text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
                        <TrendingUp className="w-4 h-4 mr-1" />+{hashtag.growth}%
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{formatNumber(hashtag.mentions)} mentions</p>
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">{hashtag.category}</span>
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-medium ${
                          hashtag.sentiment === "positive" 
                            ? "bg-emerald-100 text-emerald-800" 
                            : hashtag.sentiment === "negative" 
                              ? "bg-red-100 text-red-800" 
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {hashtag.sentiment}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {hashtag.platforms.map((platform, index) => (
                        <span key={index} className="text-xs text-caribbean_current-600 bg-caribbean_current-50 px-2 py-1 rounded">
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Viral Content Analysis */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-purple-50 rounded-lg mr-3">
                  <Zap className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Viral Content Analysis</h2>
              </div>
              <div className="space-y-6">
                {trendingPosts.map((post) => (
                  <div key={post.id} className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
                    <div className="flex gap-6">
                      {/* Content Preview */}
                      <div className="flex-shrink-0">
                        <img 
                          src={post.imageUrl} 
                          alt="Content preview" 
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                      </div>
                      
                      {/* Content Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center mb-2">
                              <span className="px-2 py-1 bg-caribbean_current-100 text-caribbean_current-800 rounded-md text-xs font-medium mr-2">
                                {post.platform}
                              </span>
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium mr-2">
                                {post.contentType}
                              </span>
                              <div className="flex items-center text-sm text-gray-500">
                                <Clock className="w-4 h-4 mr-1" />
                                {new Date(post.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.content}</h3>
                            <div className="flex items-center mb-3">
                              <img 
                                src={post.authorAvatar} 
                                alt={post.author} 
                                className="w-6 h-6 rounded-full mr-2"
                              />
                              <span className="text-sm text-gray-600 mr-3">{post.author}</span>
                              <span className="text-sm text-gray-500">{formatNumber(post.authorFollowers)} followers</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center text-sm text-purple-600 bg-purple-50 px-2 py-1 rounded-full mb-2">
                              <Star className="w-4 h-4 mr-1" />
                              Viral Score: {post.viralScore}
                            </div>
                            <a href={post.postUrl} className="text-caribbean_current-600 hover:text-caribbean_current-700 text-sm font-medium">
                              <ExternalLink className="w-4 h-4 inline mr-1" />
                              View Post
                            </a>
                          </div>
                        </div>

                        {/* Metrics */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                          <div className="flex items-center">
                            <Eye className="w-4 h-4 text-purple-500 mr-2" />
                            <span className="text-sm text-gray-600">{formatNumber(post.views)} views</span>
                          </div>
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
                            <TrendingUp className="w-4 h-4 text-caribbean_current-500 mr-2" />
                            <span className="text-sm text-gray-600">{post.engagement}% engagement</span>
                          </div>
                        </div>

                        {/* Hashtags */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          {post.hashtags.map((hashtag, index) => (
                            <span key={index} className="text-xs text-caribbean_current-600 bg-caribbean_current-50 px-2 py-1 rounded">
                              {hashtag}
                            </span>
                          ))}
                        </div>

                        {/* Business Insights */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">Business Insights</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-gray-600 mb-1">Key Takeaways:</p>
                              <ul className="text-xs text-gray-700 space-y-1">
                                {post.businessInsights.keyTakeaways.map((takeaway, index) => (
                                  <li key={index}>• {takeaway}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 mb-1">Applicable Strategies:</p>
                              <ul className="text-xs text-gray-700 space-y-1">
                                {post.businessInsights.applicableStrategies.map((strategy, index) => (
                                  <li key={index}>• {strategy}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                            <div className="flex items-center space-x-4">
                              <span className="text-xs text-gray-600">
                                Cost: <span className="font-medium">{post.businessInsights.estimatedCost}</span>
                              </span>
                              <span className="text-xs text-gray-600">
                                Difficulty: <span className="font-medium">{post.businessInsights.difficulty}</span>
                              </span>
                              <span className="text-xs text-gray-600">
                                ROI: <span className="font-medium">{post.businessInsights.roi}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Content Strategies Tab */}
        {activeTab === "strategies" && (
          <div className="space-y-6">
            {contentStrategies.map((strategy) => (
              <div key={strategy.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 mr-3">{strategy.title}</h3>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                        {strategy.category}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{strategy.description}</p>
                  </div>
                  <div className="text-right ml-6">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                        strategy.difficulty === "Easy" 
                          ? "bg-emerald-100 text-emerald-800"
                          : strategy.difficulty === "Medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}>
                        {strategy.difficulty}
                      </span>
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                        strategy.expectedRoi === "High"
                          ? "bg-emerald-100 text-emerald-800"
                          : strategy.expectedRoi === "Medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}>
                        {strategy.expectedRoi} ROI
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Platforms</h4>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {strategy.platforms.map((platform, index) => (
                        <span key={index} className="text-xs text-caribbean_current-600 bg-caribbean_current-50 px-2 py-1 rounded">
                          {platform}
                        </span>
                      ))}
                    </div>

                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Metrics</h4>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {strategy.keyMetrics.map((metric, index) => (
                        <span key={index} className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {metric}
                        </span>
                      ))}
                    </div>

                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Success Examples</h4>
                    <div className="space-y-2">
                      {strategy.successExamples.map((example, index) => (
                        <div key={index} className="bg-emerald-50 rounded-lg p-3">
                          <p className="text-sm font-medium text-emerald-800">{example.restaurant}</p>
                          <p className="text-xs text-emerald-700">{example.result}</p>
                          <p className="text-xs text-emerald-600">{example.metric}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Action Steps</h4>
                    <ol className="text-sm text-gray-700 space-y-1 mb-4">
                      {strategy.actionSteps.map((step, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-caribbean_current-600 font-medium mr-2">{index + 1}.</span>
                          {step}
                        </li>
                      ))}
                    </ol>

                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Required Resources</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {strategy.requiredResources.map((resource, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-gray-400 mr-2">•</span>
                          {resource}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Market Insights Tab */}
        {activeTab === "insights" && (
          <div className="space-y-6">
            {marketInsights.map((insight) => (
              <div key={insight.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 mr-3">{insight.title}</h3>
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                        insight.category === "Trend"
                          ? "bg-purple-100 text-purple-800"
                          : insight.category === "Opportunity"
                            ? "bg-emerald-100 text-emerald-800"
                            : insight.category === "Threat"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                      }`}>
                        {insight.category}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{insight.description}</p>
                  </div>
                  <div className="text-right ml-6">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                        insight.impact === "High"
                          ? "bg-red-100 text-red-800"
                          : insight.impact === "Medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                      }`}>
                        {insight.impact} Impact
                      </span>
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                        insight.urgency === "High"
                          ? "bg-red-100 text-red-800"
                          : insight.urgency === "Medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                      }`}>
                        {insight.urgency} Urgency
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Key Data Points</h4>
                    <div className="space-y-3">
                      {insight.dataPoints.map((dataPoint, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-700">{dataPoint.metric}</span>
                          <div className="text-right">
                            <span className="text-lg font-bold text-gray-900">{dataPoint.value}</span>
                            <div className="flex items-center text-sm text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              {dataPoint.change}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Recommendations</h4>
                    <ul className="text-sm text-gray-700 space-y-2">
                      {insight.recommendations.map((recommendation, index) => (
                        <li key={index} className="flex items-start p-2 bg-caribbean_current-50 rounded-lg">
                          <span className="text-caribbean_current-600 mr-2">•</span>
                          {recommendation}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendingContentPage;