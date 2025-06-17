import React from "react";
import { BarChart3, MessageSquare, Share2, TrendingUp, Star, Users, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useDashboardData } from "@/hooks/useDashboardData";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorMessage } from "@/components/common/ErrorMessage";

const DashboardPage: React.FC = () => {
  const { data, loading, error, refetch } = useDashboardData();

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
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

  if (!data) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <PageHeader title="Dashboard Overview" description="Quick insights across all your analytics" icon={<BarChart3 className="w-8 h-8 text-oxford_blue-600" />} />

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center text-gray-600">
                <Star className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Overall Rating</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{data.metrics.overallRating}</div>
            <div className="flex items-center mb-2">{renderStars(data.metrics.overallRating)}</div>
            <Link to="/review" className="text-oxford_blue-600 hover:text-oxford_blue-700 text-sm font-medium">
              View Details →
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center text-gray-600">
                <MessageSquare className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Total Reviews</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-4">{formatNumber(data.metrics.totalReviews)}</div>
            <Link to="/review" className="text-oxford_blue-600 hover:text-oxford_blue-700 text-sm font-medium">
              Analyze Reviews →
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center text-gray-600">
                <Users className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Social Followers</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-4">{formatNumber(data.metrics.socialFollowers)}</div>
            <Link to="/social-media-footprint" className="text-oxford_blue-600 hover:text-oxford_blue-700 text-sm font-medium">
              View Footprint →
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center text-gray-600">
                <Eye className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Monthly Reach</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-4">{formatNumber(data.metrics.monthlyReach)}</div>
            <Link to="/trending-content" className="text-oxford_blue-600 hover:text-oxford_blue-700 text-sm font-medium">
              See Trending →
            </Link>
          </div>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {data.quickStats.slice(1).map((stat, index) => (
            <Link key={index} to={stat.linkTo} className="group">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className={`p-3 ${index === 0 ? "bg-orange-100" : index === 1 ? "bg-blue-100" : "bg-purple-100"} rounded-lg mr-4`}>
                    {index === 0 && <MessageSquare className="w-6 h-6 text-orange-600" />}
                    {index === 1 && <Share2 className="w-6 h-6 text-blue-600" />}
                    {index === 2 && <TrendingUp className="w-6 h-6 text-purple-600" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-oxford_blue-600">{stat.title}</h3>
                    <p className="text-gray-600 text-sm">{stat.description}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Current:</span>
                    <span className="font-medium">{stat.value}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Growth:</span>
                    <span className="font-medium text-green-600">{stat.growth}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <BarChart3 className="w-5 h-5 text-oxford_blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="space-y-4">
            {data.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className={`p-2 rounded-lg ${activity.type === "review" ? "bg-orange-100" : activity.type === "social" ? "bg-blue-100" : "bg-purple-100"}`}>
                  {activity.type === "review" && <MessageSquare className="w-4 h-4 text-orange-600" />}
                  {activity.type === "social" && <Share2 className="w-4 h-4 text-blue-600" />}
                  {activity.type === "trending" && <TrendingUp className="w-4 h-4 text-purple-600" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{activity.platform}</span>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                  <p className="text-sm text-gray-700">{activity.content}</p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${activity.positive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
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
