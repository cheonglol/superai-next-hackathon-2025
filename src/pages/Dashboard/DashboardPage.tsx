import { ErrorMessage } from "@/components/common/ErrorMessage";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { PageHeader } from "@/components/common/PageHeader";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchDashboardData } from "@/store/slices/dashboardSlice";
import { fetchFinancialData } from "@/store/slices/financialsSlice";
import { fetchReviewsAnalytics } from "@/store/slices/reviewsSlice";
import { fetchSocialMediaData } from "@/store/slices/socialMediaSlice";
import { BarChart3, DollarSign, Eye, MessageSquare, PieChart, Share2, Star, TrendingUp, Users, AlertTriangle, CheckCircle, Target, Zap } from "lucide-react";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();

  // Redux selectors
  const { data: dashboardData, loading: dashboardLoading, error: dashboardError } = useAppSelector((state) => state.dashboard);
  const { data: reviewsData } = useAppSelector((state) => state.reviews);
  const socialData = useAppSelector((state) => state.socialMedia);
  const { data: financialData } = useAppSelector((state) => state.financials); // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchDashboardData());
    dispatch(fetchReviewsAnalytics({ selectedPeriod: "12months", comparisonPeriod: "previous12months" }));
    dispatch(fetchSocialMediaData("30days"));
    dispatch(fetchFinancialData({ period: "currentMonth" }));
  }, [dispatch]);

  // Refetch functions
  const refetchDashboard = () => {
    dispatch(fetchDashboardData());
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />);
  };

  // Key insights from each section
  const getKeyInsights = () => {
    return {
      socialMedia: {
        wins: [
          { text: "Food quality ratings improved by 0.4 points", impact: "high", type: "positive" },
          { text: "TikTok engagement up 15.8% with viral pasta content", impact: "high", type: "positive" },
          { text: "Weekend dinner service showing improvement", impact: "medium", type: "positive" },
        ],
        losses: [
          { text: "Service speed complaints up 15% during peak hours", impact: "high", type: "negative" },
          { text: "Value perception declining with 'expensive' mentions +12%", impact: "medium", type: "negative" },
        ],
      },
      financials: {
        wins: [
          { text: "Revenue growth of 12.5% month-over-month", impact: "high", type: "positive" },
          { text: "Strong gross margin at 65% vs industry 60-70%", impact: "medium", type: "positive" },
          { text: "6+ months cash runway available", impact: "medium", type: "positive" },
        ],
        losses: [
          { text: "Operating efficiency at 25% - needs improvement", impact: "high", type: "negative" },
          { text: "Debt-to-equity ratio at 1.2 (above ideal 0.3-0.6)", impact: "medium", type: "negative" },
        ],
      },
      nextSteps: {
        quickWins: [
          { text: "Negotiate rent reduction: $2,500/month savings", impact: "high", type: "opportunity", timeframe: "1-2 weeks" },
          { text: "Implement 1% price increase: $5,000/month profit boost", impact: "high", type: "opportunity", timeframe: "1 week" },
          { text: "Accelerate collections: $5,000 one-time improvement", impact: "medium", type: "opportunity", timeframe: "2 weeks" },
        ],
        priorities: [
          { text: "Cash flow: 6 months runway (Healthy)", status: "green", type: "status" },
          { text: "Profitability: Strong margins (Healthy)", status: "green", type: "status" },
          { text: "Debt management: Above ideal ratios (Caution)", status: "amber", type: "status" },
        ],
      },
    };
  };

  const insights = getKeyInsights();

  if (dashboardLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (dashboardError) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <ErrorMessage message={dashboardError} onRetry={refetchDashboard} />
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <PageHeader title="Dashboard Overview" description="Comprehensive business insights across all analytics" icon={<BarChart3 className="w-8 h-8 text-gray-700" />} />

        {/* Executive Summary - Key Wins & Losses */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <div className="px-6 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full">
              <span className="text-lg font-semibold text-gray-800">📊 Executive Summary</span>
            </div>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Key Wins */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-green-100 rounded-lg mr-3">
                  <CheckCircle className="w-5 h-5 text-green-700" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">🎉 Key Wins</h2>
              </div>
              <div className="space-y-3">
                {[...insights.socialMedia.wins, ...insights.financials.wins].slice(0, 4).map((win, index) => (
                  <div key={index} className="flex items-start p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className={`w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 ${win.impact === "high" ? "bg-green-600" : "bg-green-400"}`}></div>
                    <div className="flex-1">
                      <p className="text-sm text-green-800 font-medium">{win.text}</p>
                      <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${win.impact === "high" ? "bg-green-200 text-green-800" : "bg-green-100 text-green-700"}`}>
                        {win.impact} impact
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Areas for Attention */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-orange-100 rounded-lg mr-3">
                  <AlertTriangle className="w-5 h-5 text-orange-700" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">⚠️ Areas for Attention</h2>
              </div>
              <div className="space-y-3">
                {[...insights.socialMedia.losses, ...insights.financials.losses].map((loss, index) => (
                  <div key={index} className="flex items-start p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div className={`w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 ${loss.impact === "high" ? "bg-orange-600" : "bg-orange-400"}`}></div>
                    <div className="flex-1">
                      <p className="text-sm text-orange-800 font-medium">{loss.text}</p>
                      <span
                        className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${loss.impact === "high" ? "bg-orange-200 text-orange-800" : "bg-orange-100 text-orange-700"}`}
                      >
                        {loss.impact} impact
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Action Items */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg mr-3">
                  <Zap className="w-5 h-5 text-blue-700" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">⚡ Quick Wins Available</h2>
              </div>
              <Link to="/financials/next-steps" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All Actions →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {insights.nextSteps.quickWins.map((item, index) => (
                <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-800">{item.text}</p>
                      <div className="flex items-center mt-2 space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${item.impact === "high" ? "bg-blue-200 text-blue-800" : "bg-blue-100 text-blue-700"}`}>
                          {item.impact} impact
                        </span>
                        <span className="text-xs text-blue-600">{item.timeframe}</span>
                      </div>
                    </div>
                    <Target className="w-4 h-4 text-blue-600 flex-shrink-0 ml-2" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Business Health Status */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mt-6">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-purple-100 rounded-lg mr-3">
                <BarChart3 className="w-5 h-5 text-purple-700" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">🏥 Business Health Status</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {insights.nextSteps.priorities.map((priority, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${
                    priority.status === "green" ? "bg-green-50 border-green-200" : priority.status === "amber" ? "bg-yellow-50 border-yellow-200" : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-medium ${priority.status === "green" ? "text-green-800" : priority.status === "amber" ? "text-yellow-800" : "text-red-800"}`}>
                      {priority.text}
                    </p>
                    <div className={`w-3 h-3 rounded-full ${priority.status === "green" ? "bg-green-500" : priority.status === "amber" ? "bg-yellow-500" : "bg-red-500"}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Social Media Insights Summary */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <div className="px-6 py-2 bg-caribbean_current-100 rounded-full">
              <span className="text-lg font-semibold text-caribbean_current-800">Social Media Insights</span>
            </div>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Overall Rating */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-gray-600">
                  <div className="p-3 bg-yellow-100 rounded-lg mr-3">
                    <Star className="w-5 h-5 text-yellow-700" />
                  </div>
                  <span className="text-sm font-medium">Overall Rating</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{reviewsData?.overallMetrics.value || dashboardData.metrics.overallRating}</div>
              <div className="flex items-center mb-3">{renderStars(reviewsData?.overallMetrics.value || dashboardData.metrics.overallRating)}</div>
              <Link to="/review" className="inline-flex items-center text-caribbean_current-700 hover:text-caribbean_current-800 text-sm font-medium transition-colors">
                View Details →
              </Link>
            </div>

            {/* Total Reviews */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-gray-600">
                  <div className="p-3 bg-blue-100 rounded-lg mr-3">
                    <MessageSquare className="w-5 h-5 text-blue-700" />
                  </div>
                  <span className="text-sm font-medium">Total Reviews</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{formatNumber(reviewsData?.totalReviews.value || dashboardData.metrics.totalReviews)}</div>
              <div className="flex items-center text-sm text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full mb-3 w-fit">
                <TrendingUp className="w-4 h-4 mr-1" />+{reviewsData?.totalReviews.change || 12}%
              </div>
              <Link to="/review" className="inline-flex items-center text-caribbean_current-700 hover:text-caribbean_current-800 text-sm font-medium transition-colors">
                Analyze Reviews →
              </Link>
            </div>

            {/* Social Followers */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-gray-600">
                  <div className="p-3 bg-purple-100 rounded-lg mr-3">
                    <Users className="w-5 h-5 text-purple-700" />
                  </div>
                  <span className="text-sm font-medium">Social Followers</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{formatNumber(socialData?.metrics.totalFollowers || dashboardData.metrics.socialFollowers)}</div>
              <div className="flex items-center text-sm text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full mb-3 w-fit">
                <TrendingUp className="w-4 h-4 mr-1" />+{socialData?.metrics.growthRate || 8.7}%
              </div>
              <Link
                to="/social-media-footprint"
                className="inline-flex items-center text-caribbean_current-700 hover:text-caribbean_current-800 text-sm font-medium transition-colors"
              >
                View Footprint →
              </Link>
            </div>

            {/* Monthly Reach */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-gray-600">
                  <div className="p-3 bg-indigo-100 rounded-lg mr-3">
                    <Eye className="w-5 h-5 text-indigo-700" />
                  </div>
                  <span className="text-sm font-medium">Monthly Reach</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{formatNumber(socialData?.metrics.totalReach || dashboardData.metrics.monthlyReach)}</div>
              <div className="flex items-center text-sm text-gray-600 mb-3">Avg {socialData?.metrics.avgEngagement || 4.25}% engagement</div>
              <Link to="/trending-content" className="inline-flex items-center text-caribbean_current-700 hover:text-caribbean_current-800 text-sm font-medium transition-colors">
                See Trending →
              </Link>
            </div>
          </div>
        </div>

        {/* Financials Summary */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <div className="px-6 py-2 bg-prussian_blue-100 rounded-full">
              <span className="text-lg font-semibold text-prussian_blue-800">Financials</span>
            </div>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Revenue */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-gray-600">
                  <div className="p-3 bg-green-100 rounded-lg mr-3">
                    <DollarSign className="w-5 h-5 text-green-700" />
                  </div>
                  <span className="text-sm font-medium">Total Revenue</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{financialData ? formatCurrency(financialData.summary.currentMonth.totalRevenue) : "Loading..."}</div>
              <div className="flex items-center text-sm text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full mb-3 w-fit">
                <TrendingUp className="w-4 h-4 mr-1" />+{financialData?.summary.currentMonth.revenueGrowth || 0}%
              </div>
              <Link to="/financials/data-input" className="inline-flex items-center text-prussian_blue-700 hover:text-prussian_blue-800 text-sm font-medium transition-colors">
                View Details →
              </Link>
            </div>

            {/* Net Profit */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-gray-600">
                  <div className="p-3 bg-emerald-100 rounded-lg mr-3">
                    <TrendingUp className="w-5 h-5 text-emerald-700" />
                  </div>
                  <span className="text-sm font-medium">Net Profit</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{financialData ? formatCurrency(financialData.summary.currentMonth.netProfit) : "Loading..."}</div>
              <div className="flex items-center text-sm text-gray-600 mb-3">{financialData?.summary.currentMonth.profitMargin || 0}% profit margin</div>
              <Link to="/financials/data-input" className="inline-flex items-center text-prussian_blue-700 hover:text-prussian_blue-800 text-sm font-medium transition-colors">
                Analyze Profit →
              </Link>
            </div>

            {/* Total Expenses */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-gray-600">
                  <div className="p-3 bg-orange-100 rounded-lg mr-3">
                    <PieChart className="w-5 h-5 text-orange-700" />
                  </div>
                  <span className="text-sm font-medium">Total Expenses</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{financialData ? formatCurrency(financialData.summary.currentMonth.totalExpenses) : "Loading..."}</div>
              <div className="flex items-center text-sm text-red-800 bg-red-100 px-3 py-1 rounded-full mb-3 w-fit">
                <TrendingUp className="w-4 h-4 mr-1" />+{financialData?.summary.currentMonth.expenseGrowth || 0}%
              </div>
              <Link
                to="/financials/performance-insights"
                className="inline-flex items-center text-prussian_blue-700 hover:text-prussian_blue-800 text-sm font-medium transition-colors"
              >
                View Breakdown →
              </Link>
            </div>

            {/* Cash Flow */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-gray-600">
                  <div className="p-3 bg-blue-100 rounded-lg mr-3">
                    <BarChart3 className="w-5 h-5 text-blue-700" />
                  </div>
                  <span className="text-sm font-medium">Cash Flow</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {financialData && financialData.cashFlow.length > 0 ? formatCurrency(financialData.cashFlow[0].netFlow) : "Loading..."}
              </div>
              <div className="flex items-center text-sm text-gray-600 mb-3">Current month flow</div>
              <Link
                to="/financials/performance-insights"
                className="inline-flex items-center text-prussian_blue-700 hover:text-prussian_blue-800 text-sm font-medium transition-colors"
              >
                Analyze Flow →
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-gray-100 rounded-lg mr-3">
              <BarChart3 className="w-5 h-5 text-gray-700" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="space-y-4">
            {dashboardData.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className={`p-3 rounded-lg ${activity.type === "review" ? "bg-orange-100" : activity.type === "social" ? "bg-caribbean_current-100" : "bg-purple-100"}`}>
                  {activity.type === "review" && <MessageSquare className="w-4 h-4 text-orange-700" />}
                  {activity.type === "social" && <Share2 className="w-4 h-4 text-caribbean_current-700" />}
                  {activity.type === "trending" && <TrendingUp className="w-4 h-4 text-purple-700" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{activity.platform}</span>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                  <p className="text-sm text-gray-700">{activity.content}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${activity.positive ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
                  {activity.positive ? "Positive" : "Needs Attention"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
