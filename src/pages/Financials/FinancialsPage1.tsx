import React from "react";
import { DollarSign, TrendingUp, BarChart3, PieChart } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";

const FinancialsPage1: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Financial Analytics - Page 1"
          description="Comprehensive financial insights and performance metrics"
          icon={<DollarSign className="w-8 h-8 text-oxford_blue-600" />}
        />

        {/* Placeholder Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Overview Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Revenue Overview</h2>
            </div>
            <div className="text-center py-12">
              <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 mb-2">Revenue analytics will be displayed here</p>
              <p className="text-sm text-gray-500">Coming soon...</p>
            </div>
          </div>

          {/* Expense Breakdown Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <PieChart className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Expense Breakdown</h2>
            </div>
            <div className="text-center py-12">
              <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <PieChart className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 mb-2">Expense analysis will be displayed here</p>
              <p className="text-sm text-gray-500">Coming soon...</p>
            </div>
          </div>
        </div>

        {/* Key Metrics Placeholder */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <DollarSign className="w-5 h-5 text-oxford_blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Key Financial Metrics</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Total Revenue", value: "Coming Soon", icon: TrendingUp, color: "text-green-600" },
              { label: "Total Expenses", value: "Coming Soon", icon: BarChart3, color: "text-red-600" },
              { label: "Net Profit", value: "Coming Soon", icon: DollarSign, color: "text-blue-600" },
              { label: "Profit Margin", value: "Coming Soon", icon: PieChart, color: "text-purple-600" },
            ].map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className={`p-3 rounded-full w-12 h-12 mx-auto mb-3 bg-gray-200 flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 text-gray-400`} />
                  </div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{metric.label}</p>
                  <p className="text-lg font-bold text-gray-400">{metric.value}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialsPage1;