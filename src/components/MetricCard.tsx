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
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-200 hover:border-gray-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center text-gray-600">
          <div className="p-3 bg-gray-100 rounded-lg mr-3">
            {icon}
          </div>
          <span className="text-sm font-medium">{title}</span>
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
        <div className={`flex items-center text-sm font-medium px-3 py-1 rounded-full ${
          isPositive 
            ? "text-emerald-800 bg-emerald-100" 
            : "text-red-800 bg-red-100"
        }`}>
          {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
          {formatPercentage(change)}
        </div>
      </div>
    </div>
  );
}