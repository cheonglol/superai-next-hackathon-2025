import React from "react";
import { PieChart, TrendingUp, BarChart3, DollarSign } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";

const FinancialsPage2: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Financial Analytics - Page 2"
          description="Advanced financial reporting and trend analysis"
          icon={<PieChart className="w-8 h-8 text-oxford_blue-600" />}
        />

        {/* Placeholder Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Cash Flow Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Cash Flow Analysis</h2>
            </div>
            <div className="text-center py-12">
              <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 mb-2">Cash flow trends will be displayed here</p>
              <p className="text-sm text-gray-500">Coming soon...</p>
            </div>
          </div>

          {/* Budget vs Actual Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <BarChart3 className="w-5 h-5 text-purple-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Budget vs Actual</h2>
            </div>
            <div className="text-center py-12">
              <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 mb-2">Budget comparison will be displayed here</p>
              <p className="text-sm text-gray-500">Coming soon...</p>
            </div>
          </div>
        </div>

        {/* Financial Forecasting */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center mb-6">
            <DollarSign className="w-5 h-5 text-green-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Financial Forecasting</h2>
          </div>
          <div className="text-center py-16">
            <div className="p-6 bg-gray-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <PieChart className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Financial Forecasting Dashboard</h3>
            <p className="text-gray-600 mb-4">Advanced forecasting models and predictive analytics will be available here</p>
            <p className="text-sm text-gray-500">Feature in development...</p>
          </div>
        </div>

        {/* Performance Indicators */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <BarChart3 className="w-5 h-5 text-oxford_blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Key Performance Indicators</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "ROI", description: "Return on Investment", icon: TrendingUp },
              { label: "EBITDA", description: "Earnings Before Interest, Taxes, Depreciation, and Amortization", icon: DollarSign },
              { label: "Gross Margin", description: "Gross Profit Margin", icon: PieChart },
            ].map((kpi, index) => {
              const Icon = kpi.icon;
              return (
                <div key={index} className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className="p-4 bg-gray-200 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">{kpi.label}</h3>
                  <p className="text-sm text-gray-600 mb-3">{kpi.description}</p>
                  <p className="text-sm text-gray-500">Data coming soon...</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialsPage2;