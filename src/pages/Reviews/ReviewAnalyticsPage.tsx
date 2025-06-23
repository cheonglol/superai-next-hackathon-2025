import React, { useEffect } from "react";
import { Download, Star, MessageCircle, ChefHat, Clock, Users, Heart, DollarSign } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchReviewsAnalytics, exportReviewsReport, setFilters } from "@/store/slices/reviewsSlice";
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
  const { data, loading, error, filters } = useAppSelector((state) => state.reviews);

  // Fetch data on component mount and when filters change
  useEffect(() => {
    dispatch(fetchReviewsAnalytics(filters));
  }, [dispatch, filters]);

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    dispatch(setFilters(newFilters));
  };

  const refetch = () => {
    dispatch(fetchReviewsAnalytics(filters));
  };

  const handleExportReport = () => {
    dispatch(exportReviewsReport(filters));
  };

  const headerActions = (
    <>
      <select
        value={filters.selectedPeriod}
        onChange={(e) => updateFilters({ selectedPeriod: e.target.value })}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-caribbean_current-500 focus:border-caribbean_current-500 transition-colors bg-white"
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
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-caribbean_current-500 focus:border-caribbean_current-500 transition-colors bg-white"
      >
        {COMPARISON_PERIODS.map((period) => (
          <option key={period.value} value={period.value}>
            {period.label}
          </option>
        ))}
      </select>
      <button
        onClick={handleExportReport}
        className="flex items-center px-4 py-2 bg-caribbean_current-600 text-white rounded-lg hover:bg-caribbean_current-700 transition-all duration-200 shadow-md hover:shadow-lg"
      >
        <Download className="w-4 h-4 mr-2" />
        Export Report
      </button>
    </>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <ErrorMessage message={error} onRetry={refetch} />
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Review Analytics"
          description="Comprehensive analysis of reviews across all platforms"
          icon={<MessageCircle className="w-8 h-8 text-gray-700" />}
          actions={headerActions}
        />

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Overall Rating"
            value={data.overallMetrics.value}
            change={data.overallMetrics.change}
            isPositive={data.overallMetrics.isPositive}
            icon={<Star className="w-5 h-5 text-yellow-700" />}
          />
          <MetricCard
            title="Total Reviews"
            value={data.totalReviews.value}
            change={data.totalReviews.change}
            isPositive={data.totalReviews.isPositive}
            icon={<MessageCircle className="w-5 h-5 text-blue-700" />}
          />
          <MetricCard
            title="Positive Menu Mentions"
            value={data.positiveMenuMentions.value}
            change={data.positiveMenuMentions.change}
            isPositive={data.positiveMenuMentions.isPositive}
            icon={<ChefHat className="w-5 h-5 text-emerald-700" />}
          />
          <MetricCard
            title="Negative Menu Mentions"
            value={data.negativeMenuMentions.value}
            change={data.negativeMenuMentions.change}
            isPositive={data.negativeMenuMentions.isPositive}
            icon={<Clock className="w-5 h-5 text-red-700" />}
          />
        </div>

        {/* Category Ratings and Platform Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <CategoryRatings categories={data.categoryRatings} />
          <PlatformDistribution platforms={data.platforms} />
        </div>

        {/* Keyword Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-orange-100 rounded-lg mr-3">
                <ChefHat className="w-5 h-5 text-orange-700" />
              </div>
              <h3 className="text-lg font-semibold text-orange-800">Food</h3>
            </div>
            <KeywordList keywords={data.keywords.food} categoryColor={CATEGORY_COLORS.food} categoryName="Food" />
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-blue-100 rounded-lg mr-3">
                <Users className="w-5 h-5 text-blue-700" />
              </div>
              <h3 className="text-lg font-semibold text-blue-800">Service</h3>
            </div>
            <KeywordList keywords={data.keywords.service} categoryColor={CATEGORY_COLORS.service} categoryName="Service" />
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-purple-100 rounded-lg mr-3">
                <Heart className="w-5 h-5 text-purple-700" />
              </div>
              <h3 className="text-lg font-semibold text-purple-800">Ambience</h3>
            </div>
            <KeywordList keywords={data.keywords.ambience} categoryColor={CATEGORY_COLORS.ambience} categoryName="Ambience" />
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-emerald-100 rounded-lg mr-3">
                <DollarSign className="w-5 h-5 text-emerald-700" />
              </div>
              <h3 className="text-lg font-semibold text-emerald-800">Value for Money</h3>
            </div>
            <KeywordList keywords={data.keywords.value} categoryColor={CATEGORY_COLORS.value} categoryName="Value for Money" />
          </div>
        </div>

        {/* AI Analysis & Trends Summary */}
        <AIAnalysis />
      </div>
    </div>
  );
};

export default ReviewAnalyticsPage;
