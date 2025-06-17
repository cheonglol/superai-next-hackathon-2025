import React from "react";
import { Users, Star } from "lucide-react";
import type { PlatformData } from "@/types/reviews";
import { formatNumber } from "@/utils/formatters";

interface PlatformDistributionProps {
  platforms: PlatformData[];
}

export function PlatformDistribution({ platforms }: PlatformDistributionProps): JSX.Element {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-6">
        <Users className="w-5 h-5 text-blue-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">Platform Distribution</h2>
      </div>
      <div className="space-y-4">
        {platforms.map((platform, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full ${platform.color} mr-3`}></div>
              <span className="text-gray-900 font-medium">{platform.name}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">{formatNumber(platform.reviews)} reviews</span>
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                <span className="font-semibold">{platform.rating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
