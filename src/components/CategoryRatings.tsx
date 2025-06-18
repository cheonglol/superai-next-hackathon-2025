import React from "react";
import { TrendingUp, TrendingDown, Star, Sparkles, ChefHat, Users, Heart, DollarSign } from "lucide-react";
import type { CategoryRating } from "@/types/reviews";
import { formatTrend } from "@/utils/formatters";

interface CategoryRatingsProps {
  categories: CategoryRating[];
}

const iconMap = {
  ChefHat: ChefHat,
  Users: Users,
  Heart: Heart,
  DollarSign: DollarSign,
};

export function CategoryRatings({ categories }: CategoryRatingsProps): JSX.Element {
  const renderStars = (rating: number): JSX.Element[] => {
    return Array.from({ length: 5 }, (_, i) => <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />);
  };

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap];
    return IconComponent ? <IconComponent className="w-5 h-5" /> : <Star className="w-5 h-5" />;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center mb-6">
        <div className="p-2 bg-caribbean_current-50 rounded-lg mr-3">
          <Sparkles className="w-5 h-5 text-caribbean_current-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Category Ratings</h2>
      </div>
      <div className="space-y-4">
        {categories.map((category, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${category.color} text-white mr-3`}>{getIcon(category.icon)}</div>
              <span className="text-gray-900 font-medium">{category.name}</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                {renderStars(category.rating)}
                <span className="ml-2 text-lg font-semibold text-gray-900">{category.rating}</span>
              </div>
              <div className={`flex items-center text-sm px-2 py-1 rounded-full ${
                category.trend > 0 
                  ? "text-emerald-700 bg-emerald-50" 
                  : "text-red-700 bg-red-50"
              }`}>
                {category.trend > 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                {formatTrend(category.trend)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}