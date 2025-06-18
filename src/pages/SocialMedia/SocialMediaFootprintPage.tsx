import React from "react";
import { Share2, Users, Eye, Heart, BarChart3, TrendingUp } from "lucide-react";

const SocialMediaFootprintPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center mb-4">
              <Share2 className="w-8 h-8 text-slate-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Social Media Footprint</h1>
            </div>
            <p className="text-gray-600">Track your presence and engagement across all social platforms</p>
          </div>
          <div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent">
              <option value="30days">Last 30 Days</option>
              <option value="7days">Last 7 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="1year">Last Year</option>
            </select>
          </div>
        </div>

        {/* Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center text-gray-600">
                <Users className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Total Followers</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">42.4K</div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              +12.5% from last period
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center text-gray-600">
                <Eye className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Total Reach</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">315.0K</div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              +8.3% from last period
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center text-gray-600">
                <Heart className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Avg Engagement</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">4.25%</div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              +0.7% from last period
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center text-gray-600">
                <BarChart3 className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Total Posts</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">172</div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              +18 from last period
            </div>
          </div>
        </div>

        {/* Business Generated Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center mb-6">
            <BarChart3 className="w-5 h-5 text-slate-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Business Generated Content</h2>
            <span className="ml-3 text-sm text-gray-500">Your restaurant's official posts and content</span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Instagram */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-pink-500 mr-3"></div>
                  <h3 className="text-lg font-semibold text-gray-900">Instagram</h3>
                </div>
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +5.9%
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Followers</p>
                  <p className="text-2xl font-bold text-gray-900">12,500</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Engagement</p>
                  <p className="text-2xl font-bold text-gray-900">4.2%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Posts</p>
                  <p className="text-2xl font-bold text-gray-900">45</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Reach</p>
                  <p className="text-2xl font-bold text-gray-900">89.0K</p>
                </div>
              </div>
            </div>

            {/* Facebook */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-blue-600 mr-3"></div>
                  <h3 className="text-lg font-semibold text-gray-900">Facebook</h3>
                </div>
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +8.5%
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Followers</p>
                  <p className="text-2xl font-bold text-gray-900">8,900</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Engagement</p>
                  <p className="text-2xl font-bold text-gray-900">3.1%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Posts</p>
                  <p className="text-2xl font-bold text-gray-900">32</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Reach</p>
                  <p className="text-2xl font-bold text-gray-900">67.0K</p>
                </div>
              </div>
            </div>

            {/* TikTok */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-black mr-3"></div>
                  <h3 className="text-lg font-semibold text-gray-900">TikTok</h3>
                </div>
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +15.6%
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Followers</p>
                  <p className="text-2xl font-bold text-gray-900">15,600</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Engagement</p>
                  <p className="text-2xl font-bold text-gray-900">6.8%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Posts</p>
                  <p className="text-2xl font-bold text-gray-900">28</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Reach</p>
                  <p className="text-2xl font-bold text-gray-900">125.0K</p>
                </div>
              </div>
            </div>

            {/* Twitter */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-blue-400 mr-3"></div>
                  <h3 className="text-lg font-semibold text-gray-900">Twitter</h3>
                </div>
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +5.9%
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Followers</p>
                  <p className="text-2xl font-bold text-gray-900">5,400</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Engagement</p>
                  <p className="text-2xl font-bold text-gray-900">2.9%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Posts</p>
                  <p className="text-2xl font-bold text-gray-900">67</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Reach</p>
                  <p className="text-2xl font-bold text-gray-900">34.0K</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaFootprintPage;