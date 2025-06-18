import React from "react";
import { PieChart, Activity, FileText, TrendingUp, Calculator, Target, CheckCircle } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";

interface ProcessingScreenProps {
  selectedBranch: string | null;
  getBranchDisplayName: (branchKey: string) => string;
  processingStep: number;
}

const ProcessingScreen: React.FC<ProcessingScreenProps> = ({ selectedBranch, getBranchDisplayName, processingStep }) => {
  const processingSteps = [
    { id: 0, label: "Processing Insights", description: "Analyzing financial documents and extracting key metrics", icon: FileText },
    { id: 1, label: "Working Capital Insights", description: "Calculating working capital metrics and cash flow patterns", icon: Activity },
    { id: 2, label: "Funding Insights", description: "Evaluating debt structure and financing requirements", icon: TrendingUp },
    { id: 3, label: "Sensitivity Analysis", description: "Running scenario analysis and impact assessments", icon: Calculator },
    { id: 4, label: "Valuation Tool", description: "Computing company valuation and market metrics", icon: Target },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <PageHeader
          title="Performance Insights"
          description={`Analyzing financial data for ${selectedBranch ? getBranchDisplayName(selectedBranch) : "Unknown Company"}`}
          icon={<PieChart className="w-8 h-8 text-oxford_blue-600" />}
        />

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-white animate-spin" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Generating Advanced Insights</h2>
            <p className="text-gray-600">Please wait while we analyze your financial data and generate comprehensive insights.</p>
          </div>

          <div className="space-y-6 max-w-2xl mx-auto">
            {processingSteps.map((step, index) => {
              const isCompleted = processingStep > step.id;
              const isActive = processingStep === step.id;
              const Icon = step.icon;

              return (
                <div key={step.id} className="flex items-start">
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4 transition-all duration-500 ${
                      isCompleted ? "bg-green-500" : isActive ? "bg-blue-500 animate-pulse" : "bg-gray-200"
                    }`}
                  >
                    {isCompleted ? <CheckCircle className="w-5 h-5 text-white" /> : <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-400"}`} />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className={`font-semibold transition-colors duration-300 ${isCompleted ? "text-green-700" : isActive ? "text-blue-700" : "text-gray-500"}`}>
                      {step.label}
                      {isActive && (
                        <span className="ml-2 inline-flex items-center">
                          <div className="flex space-x-1">
                            <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
                            <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                            <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                          </div>
                        </span>
                      )}
                    </div>
                    <p className={`text-sm mt-1 transition-colors duration-300 ${isCompleted ? "text-green-600" : isActive ? "text-blue-600" : "text-gray-400"}`}>
                      {step.description}
                    </p>
                  </div>

                  {index < processingSteps.length - 1 && <div className="absolute left-9 mt-10 w-0.5 h-6 bg-gray-200"></div>}
                </div>
              );
            })}
          </div>

          <div className="mt-8 bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Progress</span>
              <span>{Math.round((processingStep / processingSteps.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(processingStep / processingSteps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-xs text-gray-500">This usually takes 30-45 seconds. Please do not refresh the page.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingScreen;
