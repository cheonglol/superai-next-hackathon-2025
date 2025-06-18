import { AlertTriangle, BarChart3, CheckCircle, ExternalLink, Eye, Globe, Heart, Lightbulb, MapPin, MessageCircle, Play, Share2, Target, TrendingUp } from "lucide-react";
import React, { useState } from "react";
import { contentStrategies, globalTrendingPosts, localTrendingPosts, marketInsights, paidPartnershipPosts } from "../data/trendingData";
import { TrendingPost } from "@/types/trending";

export const TrendingContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"global" | "local">("global");

  // Combine all posts and add paid tags
  const getAllPosts = () => {
    const global = globalTrendingPosts.map((post) => ({ ...post, isPaid: false }));
    const local = localTrendingPosts.map((post) => ({ ...post, isPaid: false }));
    const paid = paidPartnershipPosts.map((post) => ({ ...post, isPaid: true }));

    if (activeTab === "global") {
      return [...global, ...paid.filter((p) => p.platform === "Instagram" || p.platform === "TikTok")];
    } else {
      return [...local, ...paid.filter((p) => p.platform === "Facebook")];
    }
  };

  const currentPosts = getAllPosts();

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-caribbean_current-100 text-caribbean_current-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-cadet_gray-100 text-cadet_gray-800";
    }
  };

  const getRoiColor = (roi: string) => {
    switch (roi) {
      case "High":
        return "bg-caribbean_current-100 text-caribbean_current-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-cadet_gray-100 text-cadet_gray-800";
      default:
        return "bg-cadet_gray-100 text-cadet_gray-800";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High":
        return "text-red-600";
      case "Medium":
        return "text-yellow-600";
      case "Low":
        return "text-caribbean_current-600";
      default:
        return "text-cadet_gray-600";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Trend":
        return <TrendingUp className="h-4 w-4" />;
      case "Opportunity":
        return <Target className="h-4 w-4" />;
      case "Threat":
        return <AlertTriangle className="h-4 w-4" />;
      case "Innovation":
        return <Lightbulb className="h-4 w-4" />;
      default:
        return <BarChart3 className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="h-6 w-6 text-caribbean_current-600" />
                <h1 className="text-2xl font-bold text-charcoal-600">Trending Content Intelligence</h1>
              </div>
              <p className="text-cadet_gray-600">Discover viral content strategies and market insights to grow your restaurant business</p>
            </div>
          </div>
          {/* Market Insights Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {marketInsights.slice(0, 3).map((insight) => (
              <div key={insight.id} className="bg-white rounded-lg border border-cadet_gray-300 p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg ${getImpactColor(insight.impact)} bg-opacity-10`}>{getCategoryIcon(insight.category)}</div>
                  <div>
                    <h3 className="font-semibold text-charcoal-600">{insight.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-xs px-2 py-1 rounded ${insight.category === "Trend" ? "bg-prussian_blue-100 text-prussian_blue-800" : insight.category === "Opportunity" ? "bg-caribbean_current-100 text-caribbean_current-800" : "bg-orange-100 text-orange-800"}`}
                      >
                        {insight.category}
                      </span>
                      <span className={`text-xs font-medium ${getImpactColor(insight.impact)}`}>{insight.impact} Impact</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-cadet_gray-600 mb-4">{insight.description}</p>
                <div className="space-y-2">
                  {insight.dataPoints.slice(0, 2).map((point, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-cadet_gray-600">{point.metric}</span>
                      <span className="font-semibold text-charcoal-600">{point.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {/* Trending Posts Section */}
          <div className="bg-white rounded-lg border border-cadet_gray-300 shadow-lg">
            <div className="p-6 border-b border-cadet_gray-300">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-charcoal-600">Viral Content Analysis</h2>
              </div>

              {/* Tab Navigation */}
              <div className="flex gap-1 bg-cadet_gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab("global")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "global" ? "bg-caribbean_current-600 text-white" : "text-cadet_gray-600 hover:text-charcoal-600"
                  }`}
                >
                  <Globe className="h-4 w-4" />
                  Global Trends
                </button>
                <button
                  onClick={() => setActiveTab("local")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "local" ? "bg-caribbean_current-600 text-white" : "text-cadet_gray-600 hover:text-charcoal-600"
                  }`}
                >
                  <MapPin className="h-4 w-4" />
                  Local Viral
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {currentPosts.map((post) => (
                <div key={post.id} className="border border-cadet_gray-300 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="flex gap-6">
                    {/* Post Preview */}
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <img src={post.imageUrl} alt="Post preview" className="w-32 h-32 rounded-lg object-cover" />
                        {post.videoUrl && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
                            <Play className="h-8 w-8 text-white" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2 bg-caribbean_current-600 text-white text-xs px-2 py-1 rounded">{post.viralScore}</div>
                      </div>
                    </div>
                    {/* Post Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <img src={post.authorAvatar} alt={post.author} className="w-8 h-8 rounded-full" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-charcoal-600">{post.author}</span>
                            <span className="text-sm text-cadet_gray-600">{formatNumber(post.authorFollowers)} followers</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`px-2 py-1 text-xs rounded ${
                                post.platform === "TikTok"
                                  ? "bg-charcoal-100 text-charcoal-800"
                                  : post.platform === "Instagram"
                                    ? "bg-pink-100 text-pink-800"
                                    : post.platform === "YouTube"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-prussian_blue-100 text-prussian_blue-800"
                              }`}
                            >
                              {post.platform}
                            </span>
                            <span
                              className={`px-2 py-1 text-xs rounded ${
                                post.contentType === "organic"
                                  ? "bg-caribbean_current-100 text-caribbean_current-800"
                                  : post.contentType === "paid"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-purple-100 text-purple-800"
                              }`}
                            >
                              {post.contentType}
                            </span>
                            {(post as TrendingPost).isPaid && <span className="px-2 py-1 text-xs rounded bg-orange-100 text-orange-800 font-medium">Paid</span>}
                            <span className="px-2 py-1 text-xs rounded bg-cadet_gray-100 text-cadet_gray-800">{post.category}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-charcoal-600 mb-4 line-clamp-2">{post.content}</p>
                      {/* Engagement Metrics */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4 text-purple-500" />
                          <span className="text-sm text-cadet_gray-600">{formatNumber(post.views)} views</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4 text-red-500" />
                          <span className="text-sm text-cadet_gray-600">{formatNumber(post.likes)} likes</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MessageCircle className="h-4 w-4 text-prussian_blue-600" />
                          <span className="text-sm text-cadet_gray-600">{formatNumber(post.comments)} comments</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Share2 className="h-4 w-4 text-caribbean_current-600" />
                          <span className="text-sm text-cadet_gray-600">{formatNumber(post.shares)} shares</span>
                        </div>
                      </div>
                      {/* Business Insights */}
                      <div className="bg-cadet_gray-100 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Lightbulb className="h-4 w-4 text-caribbean_current-600" />
                          <span className="font-medium text-charcoal-600">Business Insights</span>
                          <div className="flex gap-2 ml-auto">
                            <span className={`px-2 py-1 text-xs rounded ${getDifficultyColor(post.businessInsights.difficulty)}`}>{post.businessInsights.difficulty}</span>
                            <span className={`px-2 py-1 text-xs rounded ${getRoiColor(post.businessInsights.roi)}`}>{post.businessInsights.roi} ROI</span>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-charcoal-600 mb-2">Key Takeaways</h4>
                            <ul className="text-sm text-cadet_gray-600 space-y-1">
                              {post.businessInsights.keyTakeaways.map((takeaway, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <CheckCircle className="h-3 w-3 text-caribbean_current-600 mt-0.5 flex-shrink-0" />
                                  {takeaway}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-charcoal-600 mb-2">Applicable Strategies</h4>
                            <ul className="text-sm text-cadet_gray-600 space-y-1">
                              {post.businessInsights.applicableStrategies.slice(0, 3).map((strategy, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <Target className="h-3 w-3 text-caribbean_current-600 mt-0.5 flex-shrink-0" />
                                  {strategy}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-cadet_gray-300">
                          <div className="flex items-center gap-4 text-sm text-cadet_gray-600">
                            <span>Engagement: {post.engagement}%</span>
                          </div>
                          <button
                            onClick={() => window.open(post.postUrl, "_blank")}
                            className="relative px-4 py-2 bg-caribbean_current-600 text-white rounded-lg text-sm hover:bg-caribbean_current-700 transition-all duration-300 shadow-lg hover:shadow-caribbean_current-600/20 hover:shadow-2xl"
                            style={{
                              boxShadow: "0 4px 20px rgba(11, 99, 88, 0.15), 0 0 0 1px rgba(11, 99, 88, 0.1)",
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <ExternalLink className="h-3 w-3" />
                              View Original
                            </div>
                            <div
                              className="absolute inset-0 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300"
                              style={{
                                background: "linear-gradient(135deg, rgba(11, 99, 88, 0.1) 0%, rgba(40, 231, 209, 0.1) 100%)",
                                boxShadow: "0 0 30px rgba(40, 231, 209, 0.3)",
                              }}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Content Strategies */}
          <div className="bg-white rounded-lg border border-cadet_gray-300 shadow-lg">
            <div className="p-6 border-b border-cadet_gray-300">
              <div className="flex items-center gap-3">
                <Target className="h-5 w-5 text-caribbean_current-600" />
                <h2 className="text-xl font-semibold text-charcoal-600">Recommended Content Strategies</h2>
              </div>
              <p className="text-sm text-cadet_gray-600 mt-1">Actionable strategies based on trending content analysis</p>
            </div>

            <div className="p-6 space-y-6">
              {contentStrategies.map((strategy) => (
                <div key={strategy.id} className="border border-cadet_gray-300 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-charcoal-600 mb-2">{strategy.title}</h3>
                      <p className="text-cadet_gray-600 mb-3">{strategy.description}</p>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded ${getDifficultyColor(strategy.difficulty)}`}>{strategy.difficulty}</span>
                        <span className={`px-2 py-1 text-xs rounded ${getRoiColor(strategy.expectedRoi)}`}>{strategy.expectedRoi} ROI</span>
                        <span className="px-2 py-1 text-xs rounded bg-cadet_gray-100 text-cadet_gray-800">{strategy.category}</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-charcoal-600 mb-3">Success Examples</h4>
                      <div className="space-y-3">
                        {strategy.successExamples.map((example, index) => (
                          <div key={index} className="bg-cadet_gray-100 rounded-lg p-3">
                            <div className="font-medium text-charcoal-600 text-sm">{example.restaurant}</div>
                            <div className="text-caribbean_current-600 text-sm">{example.result}</div>
                            <div className="text-xs text-cadet_gray-600">{example.metric}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-charcoal-600 mb-3">Action Steps</h4>
                      <ol className="space-y-2">
                        {strategy.actionSteps.map((step, index) => (
                          <li key={index} className="flex items-start gap-3 text-sm text-cadet_gray-600">
                            <span className="flex items-center justify-center w-5 h-5 bg-caribbean_current-600 text-white rounded-full text-xs font-medium flex-shrink-0">
                              {index + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-cadet_gray-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-cadet_gray-600">Platforms: {strategy.platforms.join(", ")}</div>
                        <div className="text-sm text-cadet_gray-600">Key Metrics: {strategy.keyMetrics.join(", ")}</div>
                      </div>
                      <button
                        className="relative px-4 py-2 bg-caribbean_current-600 text-white rounded-lg text-sm hover:bg-caribbean_current-700 transition-all duration-300 shadow-lg hover:shadow-caribbean_current-600/20 hover:shadow-2xl"
                        style={{
                          boxShadow: "0 4px 20px rgba(11, 99, 88, 0.15), 0 0 0 1px rgba(11, 99, 88, 0.1)",
                        }}
                      >
                        Start Strategy
                        <div
                          className="absolute inset-0 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300"
                          style={{
                            background: "linear-gradient(135deg, rgba(11, 99, 88, 0.1) 0%, rgba(40, 231, 209, 0.1) 100%)",
                            boxShadow: "0 0 30px rgba(40, 231, 209, 0.3)",
                          }}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Detailed Market Insights */}
          <div className="bg-white rounded-lg border border-cadet_gray-300 shadow-lg">
            <div className="p-6 border-b border-cadet_gray-300">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-5 w-5 text-caribbean_current-600" />
                <h2 className="text-xl font-semibold text-charcoal-600">Market Intelligence</h2>
              </div>
              <p className="text-sm text-cadet_gray-600 mt-1">Deep insights and trends shaping the F&B social media landscape</p>
            </div>

            <div className="p-6 space-y-6">
              {marketInsights.map((insight) => (
                <div key={insight.id} className="border border-cadet_gray-300 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getImpactColor(insight.impact)} bg-opacity-10`}>{getCategoryIcon(insight.category)}</div>
                      <div>
                        <h3 className="text-lg font-semibold text-charcoal-600">{insight.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              insight.category === "Trend"
                                ? "bg-prussian_blue-100 text-prussian_blue-800"
                                : insight.category === "Opportunity"
                                  ? "bg-caribbean_current-100 text-caribbean_current-800"
                                  : insight.category === "Threat"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-orange-100 text-orange-800"
                            }`}
                          >
                            {insight.category}
                          </span>
                          <span className={`text-xs font-medium ${getImpactColor(insight.impact)}`}>{insight.impact} Impact</span>
                          <span
                            className={`text-xs font-medium ${
                              insight.urgency === "High" ? "text-red-600" : insight.urgency === "Medium" ? "text-yellow-600" : "text-caribbean_current-600"
                            }`}
                          >
                            {insight.urgency} Urgency
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-cadet_gray-600 mb-4">{insight.description}</p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-charcoal-600 mb-3">Key Data Points</h4>
                      <div className="space-y-3">
                        {insight.dataPoints.map((point, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-cadet_gray-100 rounded-lg">
                            <span className="text-sm text-cadet_gray-600">{point.metric}</span>
                            <div className="text-right">
                              <div className="font-semibold text-charcoal-600">{point.value}</div>
                              <div className="text-xs text-cadet_gray-600">{point.change}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-charcoal-600 mb-3">Recommendations</h4>
                      <ul className="space-y-2">
                        {insight.recommendations.map((recommendation, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-cadet_gray-600">
                            <CheckCircle className="h-4 w-4 text-caribbean_current-600 mt-0.5 flex-shrink-0" />
                            {recommendation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
