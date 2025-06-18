import React from "react";
import { Share2 } from "lucide-react";

const SocialMediaFootprintPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="p-3 bg-caribbean_current-100 rounded-lg mr-3">
                <Share2 className="w-8 h-8 text-caribbean_current-700" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Social Media Footprint</h1>
            </div>
            <p className="text-gray-600">Track your presence and engagement across all social platforms</p>
          </div>
        </div>

        {/* Empty State */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12">
          <div className="text-center">
            <div className="p-6 bg-gray-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Share2 className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Social Media Footprint</h3>
            <p className="text-gray-600 mb-4">Content will be added here soon</p>
            <p className="text-sm text-gray-500">This page is currently being developed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaFootprintPage;