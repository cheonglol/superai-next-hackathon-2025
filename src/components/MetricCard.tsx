import React from "react";
import { TrendingUp, TrendingDown, Star } from "lucide-react";
import { formatNumber, formatPercentage } from "@/utils/formatters";

interface MetricCardProps {
  title: string;
  value: number | string;
  change: number;
  isPositive: boolean;
  icon: React.ReactNode;
  unit?: string;
}

export function MetricCard({ title, value, change, isPositive, icon, unit = "" }: MetricCardProps): JSX.Element {
  const renderStars = (rating: number): JSX.Element[] => {
    return Array.from({ length: 5 }, (_, i) => <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center text-gray-600">
          {icon}
          <span className="ml-2 text-sm font-medium">{title}</span>
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {typeof value === "number" ? formatNumber(value) : value}
            {unit}
          </div>
          {title === "Overall Rating" && <div className="flex items-center mb-2">{renderStars(value as number)}</div>}
        </div>
        <div className={`flex items-center text-sm font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>
          {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
          {formatPercentage(change)} from last period
        </div>
      </div>
    </div>
  );
}
