import React from "react";
import { Download, Star, MessageCircle, ChefHat, Clock, Users, Heart, DollarSign } from "lucide-react";
import { useReviewsData } from "@/hooks/useReviewsData";
import { useAppDispatch } from "@/store";
import { exportReviewsReport } from "@/store/slices/reviewsSlice";
import { MetricCard } from "@/components/MetricCard";
import { CategoryRatings } from "@/components/CategoryRatings";
import { PlatformDistribution } from "@/components/PlatformDistribution";
import { KeywordList } from "@/components/KeywordList";
import { AIAnalysis } from "@/components/AIAnalysis";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { TIME_PERIODS, COMPARISON_PERIODS, CATEGORY_COLORS } from "@/config/constants";

const ReviewAnalyticsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data, loading, error, filters, updateFilters, refetch } = useReviewsData();

  const handleExportReport = () => {
    dispatch(exportReviewsReport(filters));
  };

  const headerActions = (
    <>
      <select
        value={filters.selectedPeriod}
        onChange={(e) => updateFilters({ selectedPeriod: e.target.value })}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-oxford_blue-500 focus:border-transparent"
      >
        {TIME_PERIODS.map((period) => (
          <option key={period.value} value={period.value}>
            {period.label}
          </option>
        ))}
      </select>
      <select
        value={filters.comparisonPeriod}
        onChange={(e) => updateFilters({ comparisonPeriod: e.target.value })}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-oxford_blue-500 focus:border-transparent"
      >
        {COMPARISON_PERIODS.map((period) => (
          <option key={period.value} value={period.value}>
            {period.label}
          </option>
        ))}
      </select>
      <button onClick={handleExportReport} className="flex items-center px-4 py-2 bg-oxford_blue-600 text-white rounded-lg hover:bg-oxford_blue-700 transition-colors">
        <Download className="w-4 h-4 mr-2" />
        Export Report
      </button>
    </>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics...</p>
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
        <PageHeader title="Review Analytics" description="Comprehensive analysis of reviews across all platforms" actions={headerActions} />

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Overall Rating"
            value={data.overallMetrics.value}
            change={data.overallMetrics.change}
            isPositive={data.overallMetrics.isPositive}
            icon={<Star className="w-5 h-5" />}
          />
          <MetricCard
            title="Total Reviews"
            value={data.totalReviews.value}
            change={data.totalReviews.change}
            isPositive={data.totalReviews.isPositive}
            icon={<MessageCircle className="w-5 h-5" />}
          />
          <MetricCard
            title="Positive Menu Mentions"
            value={data.positiveMenuMentions.value}
            change={data.positiveMenuMentions.change}
            isPositive={data.positiveMenuMentions.isPositive}
            icon={<ChefHat className="w-5 h-5" />}
          />
          <MetricCard
            title="Negative Menu Mentions"
            value={data.negativeMenuMentions.value}
            change={data.negativeMenuMentions.change}
            isPositive={data.negativeMenuMentions.isPositive}
            icon={<Clock className="w-5 h-5" />}
          />
        </div>

        {/* Category Ratings and Platform Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <CategoryRatings categories={data.categoryRatings} />
          <PlatformDistribution platforms={data.platforms} />
        </div>

        {/* Keyword Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <ChefHat className="w-5 h-5 text-orange-600 mr-2" />
              <h3 className="text-lg font-semibold text-orange-700">Top Keywords - Food</h3>
            </div>
            <KeywordList keywords={data.keywords.food} categoryColor={CATEGORY_COLORS.food} />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <Users className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-blue-700">Top Keywords - Service</h3>
            </div>
            <KeywordList keywords={data.keywords.service} categoryColor={CATEGORY_COLORS.service} />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <Heart className="w-5 h-5 text-purple-600 mr-2" />
              <h3 className="text-lg font-semibold text-purple-700">Top Keywords - Ambience</h3>
            </div>
            <KeywordList keywords={data.keywords.ambience} categoryColor={CATEGORY_COLORS.ambience} />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <DollarSign className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-green-700">Top Keywords - Value for Money</h3>
            </div>
            <KeywordList keywords={data.keywords.value} categoryColor={CATEGORY_COLORS.value} />
          </div>
        </div>

        {/* AI Analysis & Trends Summary */}
        <AIAnalysis />
      </div>
    </div>
  );
};

export default ReviewAnalyticsPage;
