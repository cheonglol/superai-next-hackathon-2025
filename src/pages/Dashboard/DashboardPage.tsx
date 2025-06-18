import { ErrorMessage } from "@/components/common/ErrorMessage";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { PageHeader } from "@/components/common/PageHeader";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useFinancialsData } from "@/hooks/useFinancialsData";
import { useReviewsData } from "@/hooks/useReviewsData";
import { useSocialMediaData } from "@/hooks/useSocialMediaData";
import { BarChart3, DollarSign, Eye, MessageSquare, PieChart, Share2, Star, TrendingUp, Users } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const DashboardPage: React.FC = () => {
  const { data: dashboardData, loading: dashboardLoading, error: dashboardError, refetch: refetchDashboard } = useDashboardData();
  const { data: reviewsData } = useReviewsData();
  const socialData = useSocialMediaData();
  const { data: financialData } = useFinancialsData();

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

  if (dashboardLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (dashboardError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ErrorMessage message={dashboardError} onRetry={refetchDashboard} />
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <PageHeader title="Dashboard Overview" description="Comprehensive business insights across all analytics" icon={<BarChart3 className="w-8 h-8 text-oxford_blue-600" />} />

        {/* Social Media Insights Summary */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-lg font-semibold text-gray-700 bg-gray-50">Social Media Insights</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Overall Rating */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-gray-600">
                  <Star className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">Overall Rating</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{reviewsData?.overallMetrics.value || dashboardData.metrics.overallRating}</div>
              <div className="flex items-center mb-2">{renderStars(reviewsData?.overallMetrics.value || dashboardData.metrics.overallRating)}</div>
              <Link to="/review" className="text-oxford_blue-600 hover:text-oxford_blue-700 text-sm font-medium">
                View Details →
              </Link>
            </div>

            {/* Total Reviews */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-gray-600">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">Total Reviews</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{formatNumber(reviewsData?.totalReviews.value || dashboardData.metrics.totalReviews)}</div>
              <div className="flex items-center text-sm text-green-600 mb-2">
                <TrendingUp className="w-4 h-4 mr-1" />+{reviewsData?.totalReviews.change || 12}% from last period
              </div>
              <Link to="/review" className="text-oxford_blue-600 hover:text-oxford_blue-700 text-sm font-medium">
                Analyze Reviews →
              </Link>
            </div>

            {/* Social Followers */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-gray-600">
                  <Users className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">Social Followers</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{formatNumber(socialData?.metrics.totalFollowers || dashboardData.metrics.socialFollowers)}</div>
              <div className="flex items-center text-sm text-green-600 mb-2">
                <TrendingUp className="w-4 h-4 mr-1" />+{socialData?.metrics.growthRate || 8.7}% growth rate
              </div>
              <Link to="/social-media-footprint" className="text-oxford_blue-600 hover:text-oxford_blue-700 text-sm font-medium">
                View Footprint →
              </Link>
            </div>

            {/* Monthly Reach */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-gray-600">
                  <Eye className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">Monthly Reach</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{formatNumber(socialData?.metrics.totalReach || dashboardData.metrics.monthlyReach)}</div>
              <div className="flex items-center text-sm text-green-600 mb-2">
                <TrendingUp className="w-4 h-4 mr-1" />
                Avg {socialData?.metrics.avgEngagement || 4.25}% engagement
              </div>
              <Link to="/trending-content" className="text-oxford_blue-600 hover:text-oxford_blue-700 text-sm font-medium">
                See Trending →
              </Link>
            </div>
          </div>
        </div>

        {/* Financials Summary */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-lg font-semibold text-gray-700 bg-gray-50">Financials</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Revenue */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-gray-600">
                  <DollarSign className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">Total Revenue</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{financialData ? formatCurrency(financialData.summary.currentMonth.totalRevenue) : "Loading..."}</div>
              <div className="flex items-center text-sm text-green-600 mb-2">
                <TrendingUp className="w-4 h-4 mr-1" />+{financialData?.summary.currentMonth.revenueGrowth || 0}% from last month
              </div>
              <Link to="/financials/page1" className="text-oxford_blue-600 hover:text-oxford_blue-700 text-sm font-medium">
                View Details →
              </Link>
            </div>

            {/* Net Profit */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-gray-600">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">Net Profit</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{financialData ? formatCurrency(financialData.summary.currentMonth.netProfit) : "Loading..."}</div>
              <div className="flex items-center text-sm text-green-600 mb-2">
                <TrendingUp className="w-4 h-4 mr-1" />
                {financialData?.summary.currentMonth.profitMargin || 0}% profit margin
              </div>
              <Link to="/financials/page1" className="text-oxford_blue-600 hover:text-oxford_blue-700 text-sm font-medium">
                Analyze Profit →
              </Link>
            </div>

            {/* Total Expenses */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-gray-600">
                  <PieChart className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">Total Expenses</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{financialData ? formatCurrency(financialData.summary.currentMonth.totalExpenses) : "Loading..."}</div>
              <div className="flex items-center text-sm text-red-600 mb-2">
                <TrendingUp className="w-4 h-4 mr-1" />+{financialData?.summary.currentMonth.expenseGrowth || 0}% from last month
              </div>
              <Link to="/financials/page2" className="text-oxford_blue-600 hover:text-oxford_blue-700 text-sm font-medium">
                View Breakdown →
              </Link>
            </div>

            {/* Cash Flow */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-gray-600">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">Cash Flow</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {financialData && financialData.cashFlow.length > 0 ? formatCurrency(financialData.cashFlow[0].netFlow) : "Loading..."}
              </div>
              <div className="flex items-center text-sm text-green-600 mb-2">
                <TrendingUp className="w-4 h-4 mr-1" />
                Current month flow
              </div>
              <Link to="/financials/page2" className="text-oxford_blue-600 hover:text-oxford_blue-700 text-sm font-medium">
                Analyze Flow →
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <BarChart3 className="w-5 h-5 text-charcoal-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="space-y-4">
            {dashboardData.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className={`p-2 rounded-lg ${activity.type === "review" ? "bg-orange-100" : activity.type === "social" ? "bg-caribbean_current-100" : "bg-purple-100"}`}>
                  {activity.type === "review" && <MessageSquare className="w-4 h-4 text-orange-600" />}
                  {activity.type === "social" && <Share2 className="w-4 h-4 text-caribbean_current-600" />}
                  {activity.type === "trending" && <TrendingUp className="w-4 h-4 text-purple-600" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{activity.platform}</span>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                  <p className="text-sm text-gray-700">{activity.content}</p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${activity.positive ? "bg-caribbean_current-100 text-caribbean_current-800" : "bg-red-100 text-red-800"}`}>
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