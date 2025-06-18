import React from "react";
import { Sparkles, TrendingUp, TrendingDown, Clock } from "lucide-react";

export function AIAnalysis(): JSX.Element {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center mb-6">
        <div className="p-2 bg-purple-50 rounded-lg mr-3">
          <Sparkles className="w-5 h-5 text-purple-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">AI Analysis & Trends Summary</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold text-emerald-700 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Positive Trends
          </h3>
          <div className="space-y-3">
            <div className="flex items-start p-3 bg-emerald-50 rounded-lg">
              <TrendingUp className="w-4 h-4 text-emerald-600 mr-2 mt-1 flex-shrink-0" />
              <p className="text-gray-700">Food quality ratings improved by 0.4 points, with "fresh" and "delicious" mentions up 23%</p>
            </div>
            <div className="flex items-start p-3 bg-emerald-50 rounded-lg">
              <TrendingUp className="w-4 h-4 text-emerald-600 mr-2 mt-1 flex-shrink-0" />
              <p className="text-gray-700">Ambience scores consistently high across all platforms, "cozy" mentions increased 18%</p>
            </div>
            <div className="flex items-start p-3 bg-emerald-50 rounded-lg">
              <TrendingUp className="w-4 h-4 text-emerald-600 mr-2 mt-1 flex-shrink-0" />
              <p className="text-gray-700">Weekend dinner service showing improvement with faster table turnover</p>
            </div>
            <div className="flex items-start p-3 bg-emerald-50 rounded-lg">
              <TrendingUp className="w-4 h-4 text-emerald-600 mr-2 mt-1 flex-shrink-0" />
              <p className="text-gray-700">Positive menu mentions increased 8% with signature dishes receiving praise</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-red-700 mb-4 flex items-center">
            <TrendingDown className="w-5 h-5 mr-2" />
            Areas for Improvement
          </h3>
          <div className="space-y-3">
            <div className="flex items-start p-3 bg-red-50 rounded-lg">
              <TrendingDown className="w-4 h-4 text-red-600 mr-2 mt-1 flex-shrink-0" />
              <p className="text-gray-700">Service speed during peak hours (7-9 PM) receiving more "slow" mentions, up 15%</p>
            </div>
            <div className="flex items-start p-3 bg-red-50 rounded-lg">
              <TrendingDown className="w-4 h-4 text-red-600 mr-2 mt-1 flex-shrink-0" />
              <p className="text-gray-700">Value perception declining with "expensive" mentions increasing 12%</p>
            </div>
            <div className="flex items-start p-3 bg-yellow-50 rounded-lg">
              <Clock className="w-4 h-4 text-yellow-600 mr-2 mt-1 flex-shrink-0" />
              <p className="text-gray-700">Temperature complaints for certain dishes mentioned in 8% of recent reviews</p>
            </div>
            <div className="flex items-start p-3 bg-red-50 rounded-lg">
              <TrendingDown className="w-4 h-4 text-red-600 mr-2 mt-1 flex-shrink-0" />
              <p className="text-gray-700">Negative menu mentions decreased 15% but focus needed on portion sizes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}