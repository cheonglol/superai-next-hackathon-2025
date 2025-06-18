import React from "react";
import { TrendingUp } from "lucide-react";

const TrendingContentPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="p-3 bg-caribbean_current-100 rounded-lg mr-3">
                <TrendingUp className="w-8 h-8 text-caribbean_current-700" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Trending Content</h1>
            </div>
            <p className="text-gray-600">Discover what's trending about your restaurant across social media</p>
          </div>
        </div>

        {/* Empty State */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12">
          <div className="text-center">
            <div className="p-6 bg-gray-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <TrendingUp className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Trending Content</h3>
            <p className="text-gray-600 mb-4">Content will be added here soon</p>
            <p className="text-sm text-gray-500">This page is currently being developed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingContentPage;