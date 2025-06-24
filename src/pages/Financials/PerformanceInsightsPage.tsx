import React, { useState, useEffect, useCallback } from "react";
import { PieChart, TrendingUp, DollarSign, Calculator, Target, Activity, AlertTriangle, Building2, FileText, ArrowRight, CheckCircle, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchFinancialData } from "@/store/slices/financialsSlice";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { apiService } from "@/services/apiService";
import ProfitabilityInsights from "@/components/ProfitabilityInsights";
import WorkingCapitalInsights from "@/components/WorkingCapitalInsights";
import FundingInsights from "@/components/FundingInsights";
import SensitivityAnalysis from "@/components/SensitivityAnalysis";
import ValuationTool from "@/components/ValuationTool";
import ProcessingScreen from "@/components/ProcessingScreen";

const PerformanceInsightsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error, filters } = useAppSelector((state) => state.financials);
  const [activeSegment, setActiveSegment] = useState("profitability");
  const [ebitdaMultiplier, setEbitdaMultiplier] = useState(8);

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchFinancialData(filters));
  }, [dispatch, filters]);

  const refetch = () => {
    dispatch(fetchFinancialData(filters));
  };

  // Branch selection state
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [branchDocuments, setBranchDocuments] = useState<{ [key: string]: Array<{ tags?: string[]; name?: string; [key: string]: unknown }> }>({});

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);

  // API Data state for all 5 tabs
  const [insightsData, setInsightsData] = useState<{
    profitability: Record<string, unknown> | null;
    workingCapital: Record<string, unknown> | null;
    funding: Record<string, unknown> | null;
    sensitivity: Record<string, unknown> | null;
    valuation: Record<string, unknown> | null;
  }>({
    profitability: null,
    workingCapital: null,
    funding: null,
    sensitivity: null,
    valuation: null,
  });

  const [dataLoading, setDataLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [dataError, setDataError] = useState<string | null>(null);

  // Helper function to safely parse API responses
  const parseApiResponse = (response: unknown, type: string) => {
    try {
      let textResponse = "";

      // Extract the text response from the API structure
      if (response && typeof response === "object" && response !== null) {
        const responseObj = response as Record<string, any>;
        if (
          responseObj.data &&
          typeof responseObj.data === "object" &&
          responseObj.data !== null &&
          "response" in responseObj.data &&
          typeof responseObj.data.response === "string"
        ) {
          textResponse = responseObj.data.response;
        } else if (responseObj.response && typeof responseObj.response === "string") {
          textResponse = responseObj.response;
        } else {
          console.warn(`[${type}] No response field found in API response`);
          return null;
        }
      } else if (typeof response === "string") {
        textResponse = response;
      } else {
        console.warn(`[${type}] Invalid response type:`, typeof response);
        return null;
      }

      // Extract JSON from the text response
      const jsonStartIndex = textResponse.indexOf("{");
      const jsonEndIndex = textResponse.lastIndexOf("}");

      if (jsonStartIndex !== -1 && jsonEndIndex !== -1 && jsonEndIndex > jsonStartIndex) {
        const jsonString = textResponse.substring(jsonStartIndex, jsonEndIndex + 1);

        try {
          const parsed = JSON.parse(jsonString);
          console.log(`✅ [${type}] Successfully parsed API response`);
          return parsed;
        } catch {
          // Try to fix common JSON issues
          const cleanedJson = jsonString
            .replace(/,(\s*[}\]])/g, "$1") // Remove trailing commas
            .replace(/([{,]\s*)(\w+):/g, '$1"$2":') // Add quotes to unquoted keys
            .replace(/:\s*'([^']*)'/g, ': "$1"'); // Replace single quotes with double quotes

          try {
            const parsed = JSON.parse(cleanedJson);
            console.log(`✅ [${type}] Successfully parsed cleaned API response`);
            return parsed;
          } catch {
            console.error(`❌ [${type}] Failed to parse JSON response`);
            return null;
          }
        }
      } else {
        console.warn(`[${type}] No JSON found in text response`);
        return null;
      }
    } catch (error) {
      console.error(`❌ [${type}] Error parsing response:`, error);
      return null;
    }
  };

  const segments = [
    { id: "profitability", label: "Profitability Insights", icon: DollarSign },
    { id: "workingCapital", label: "Working Capital Insights", icon: Activity },
    { id: "funding", label: "Funding Insights", icon: TrendingUp },
    { id: "sensitivity", label: "Sensitivity Analysis", icon: Calculator },
    { id: "valuation", label: "Valuation Tool", icon: Target },
  ];

  // const processingSteps = [
  //   { id: 0, label: "Processing Insights", description: "Analyzing financial documents and extracting key metrics", icon: FileText },
  //   { id: 1, label: "Working Capital Insights", description: "Calculating working capital metrics and cash flow patterns", icon: Activity },
  //   { id: 2, label: "Funding Insights", description: "Evaluating debt structure and financing requirements", icon: TrendingUp },
  //   { id: 3, label: "Sensitivity Analysis", description: "Running scenario analysis and impact assessments", icon: Calculator },
  //   { id: 4, label: "Valuation Tool", description: "Computing company valuation and market metrics", icon: Target },
  // ];

  // Helper function to load individual insight with retry
  const loadIndividualInsight = async (insightType: string, loadFunction: () => Promise<unknown>, retries = 2): Promise<unknown> => {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        console.log(`Loading ${insightType} insights... (attempt ${attempt + 1})`);
        const response = await loadFunction();
        console.log(`✅ ${insightType} insights loaded successfully`);
        return response;
      } catch (error) {
        console.warn(`⚠️ ${insightType} insights failed on attempt ${attempt + 1}:`, error);

        if (attempt === retries) {
          console.error(`❌ ${insightType} insights failed after ${retries + 1} attempts`);
          return null; // Return null instead of throwing to allow other insights to load
        }

        // Wait before retry
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }
    // This line should never be reached, but TypeScript requires it
    return null;
  };

  // Load all insights data from API
  const loadInsightsData = async (branchKey: string) => {
    try {
      setDataLoading(true);
      setDataError(null);

      // Get document names and branch tags for the selected branch
      const documentNames = await apiService.getDocumentNamesForBranch(branchKey);
      const branchTags = apiService.getBranchTags(branchKey);

      console.log("Loading insights for branch:", branchKey);
      console.log("Document names:", documentNames);
      console.log("Branch tags:", branchTags);

      if (documentNames.length === 0) {
        throw new Error("No documents found for this branch. Please upload financial documents first.");
      }

      // Call API endpoints sequentially with retry logic and update processing steps
      setProcessingStep(1); // Step 1: Processing Insights
      const profitabilityResponse = await loadIndividualInsight("profitability", () => apiService.getProfitabilityInsights(documentNames, branchTags));

      setProcessingStep(2); // Step 2: Working Capital Insights
      const workingCapitalResponse = await loadIndividualInsight("working capital", () => apiService.getWorkingCapitalInsights(documentNames, branchTags));

      setProcessingStep(3); // Step 3: Funding Insights
      const fundingResponse = await loadIndividualInsight("funding", () => apiService.getFundingInsights(documentNames, branchTags));

      setProcessingStep(4); // Step 4: Sensitivity Analysis
      const sensitivityResponse = await loadIndividualInsight("sensitivity analysis", () => apiService.getSensitivityAnalysis(documentNames, branchTags));

      setProcessingStep(5); // Step 5: Valuation Tool
      const valuationResponse = await loadIndividualInsight("valuation", () => apiService.getValuationTool(documentNames, branchTags));

      // Parse responses (they should return JSON strings)
      const parsedData = {
        profitability: parseApiResponse(profitabilityResponse, "profitability"),
        workingCapital: parseApiResponse(workingCapitalResponse, "workingCapital"),
        funding: parseApiResponse(fundingResponse, "funding"),
        sensitivity: parseApiResponse(sensitivityResponse, "sensitivity"),
        valuation: parseApiResponse(valuationResponse, "valuation"),
      };

      console.log(
        "📊 Financial insights loaded successfully:",
        Object.keys(parsedData).filter((key) => parsedData[key as keyof typeof parsedData] !== null)
      );
      setInsightsData(parsedData);

      // Check if any insights failed to load (for logging purposes)
      const failedInsights = Object.entries(parsedData)
        .filter(([, value]) => value === null)
        .map(([key]) => key);

      if (failedInsights.length > 0) {
        const successCount = 5 - failedInsights.length;
        console.warn(`${successCount}/5 insights loaded successfully. Failed insights: ${failedInsights.join(", ")}`);
      }
    } catch (error) {
      console.error("Error loading insights data:", error);
      setDataError(error instanceof Error ? error.message : "Failed to load insights data. Please try again.");
    } finally {
      setDataLoading(false);
    }
  };

  // Handle branch selection and start processing
  const handleBranchSelection = async (branchKey: string) => {
    setSelectedBranch(branchKey);
    setIsProcessing(true);
    setProcessingStep(0);

    // Start API loading - processing steps will be updated as APIs complete
    loadInsightsData(branchKey);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  // Fetch documents and group by branch
  const fetchDocuments = useCallback(async () => {
    try {
      setDocumentsLoading(true);
      const response = await apiService.getFinancialDocuments();

      if (response && response.success && response.data && response.data.documents) {
        groupDocumentsByBranch(response.data.documents);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setDocumentsLoading(false);
    }
  }, []);

  const groupDocumentsByBranch = (docs: Array<{ tags?: string[]; name?: string; [key: string]: unknown }>) => {
    const grouped: { [key: string]: Array<{ tags?: string[]; name?: string; [key: string]: unknown }> } = {};

    docs.forEach((doc) => {
      // Find company/branch identifier from tags
      // Look for tags that could be company identifiers (exclude common tags)
      const excludeTags = ["financial", "income-statement", "balance-sheet", "profit_loss", "balance_sheet", "2024", "2023", "2022", "2021"];
      const companyTag = doc.tags?.find(
        (tag: string) =>
          !excludeTags.includes(tag) &&
          !tag.match(/^\d{4}$/) && // exclude year tags
          tag.length > 1
      );

      const branchKey = companyTag || "unknown";

      if (!grouped[branchKey]) {
        grouped[branchKey] = [];
      }
      grouped[branchKey].push(doc);
    });

    // Sort the grouped object by keys (company names) in ascending order
    const sortedGrouped: { [key: string]: Array<{ tags?: string[]; name?: string; [key: string]: unknown }> } = {};
    Object.keys(grouped)
      .sort((a, b) => {
        // Put 'unknown' at the end
        if (a === "unknown") return 1;
        if (b === "unknown") return -1;
        return a.localeCompare(b);
      })
      .forEach((key) => {
        sortedGrouped[key] = grouped[key];
      });

    setBranchDocuments(sortedGrouped);
  };

  // Map branch keys to display names
  const getBranchDisplayName = (branchKey: string) => {
    if (branchKey === "unknown") return "Unknown Company";

    // Convert branch key to readable format
    // restaurant-a -> Restaurant A, company-name -> Company Name, etc.
    return branchKey
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // Auto-finish processing when data loading completes
  useEffect(() => {
    if (!dataLoading && isProcessing && selectedBranch) {
      // End processing immediately when data loading completes
      setIsProcessing(false);
    }
  }, [dataLoading, isProcessing, selectedBranch]);

  // Branch Selection UI
  const renderBranchSelection = () => (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          title="Performance Insights"
          description="Select a branch to view advanced financial analysis and strategic insights"
          icon={<PieChart className="w-8 h-8 text-oxford_blue-600" />}
        />

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <Building2 className="w-12 h-12 text-oxford_blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Select Branch for Analysis</h2>
            <p className="text-gray-600">Choose which branch you'd like to analyze. The system will use the uploaded financial documents for that branch.</p>
          </div>

          {documentsLoading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" className="mr-3" />
              <span className="text-gray-600">Loading branch data...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(branchDocuments).map(([branchKey, docs]) => {
                const profitLossDocs = docs.filter((doc) => doc.tags?.includes("income-statement"));
                const balanceSheetDocs = docs.filter((doc) => doc.tags?.includes("balance-sheet"));
                const hasCompleteData = profitLossDocs.length > 0 && balanceSheetDocs.length > 0;

                return (
                  <div
                    key={branchKey}
                    className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${
                      hasCompleteData ? "border-oxford_blue-200 hover:border-oxford_blue-400 hover:bg-oxford_blue-50" : "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
                    }`}
                    onClick={() => hasCompleteData && handleBranchSelection(branchKey)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <Building2 className={`w-8 h-8 mr-3 ${hasCompleteData ? "text-oxford_blue-600" : "text-gray-400"}`} />
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{getBranchDisplayName(branchKey)}</h3>
                          <p className="text-sm text-gray-600">{docs.length} documents uploaded</p>
                        </div>
                      </div>
                      {hasCompleteData ? <ArrowRight className="w-5 h-5 text-oxford_blue-600" /> : <AlertTriangle className="w-5 h-5 text-amber-500" />}
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Profit & Loss Statements</span>
                        <div className="flex items-center">
                          {profitLossDocs.length > 0 ? (
                            <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                          ) : (
                            <div className="w-4 h-4 border-2 border-gray-300 rounded-full mr-1" />
                          )}
                          <span className="text-sm font-medium">{profitLossDocs.length}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Balance Sheets</span>
                        <div className="flex items-center">
                          {balanceSheetDocs.length > 0 ? (
                            <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                          ) : (
                            <div className="w-4 h-4 border-2 border-gray-300 rounded-full mr-1" />
                          )}
                          <span className="text-sm font-medium">{balanceSheetDocs.length}</span>
                        </div>
                      </div>

                      {docs.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-gray-200">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Recent Documents:</h4>
                          <div className="space-y-1">
                            {docs.slice(0, 2).map((doc, index) => (
                              <div key={index} className="flex items-center text-xs text-gray-600">
                                <FileText className="w-3 h-3 mr-2" />
                                <span className="truncate">{doc.name}</span>
                              </div>
                            ))}
                            {docs.length > 2 && <div className="text-xs text-gray-500">+{docs.length - 2} more documents</div>}
                          </div>
                        </div>
                      )}
                    </div>

                    {!hasCompleteData && (
                      <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                        <div className="flex items-start">
                          <AlertTriangle className="w-4 h-4 text-amber-600 mr-2 mt-0.5" />
                          <div>
                            <p className="text-xs text-amber-800 font-medium">Incomplete Data</p>
                            <p className="text-xs text-amber-700">Both P&L statements and balance sheets are required for performance analysis.</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {Object.keys(branchDocuments).length === 0 && !documentsLoading && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Financial Data Found</h3>
              <p className="text-gray-600 mb-4">Please upload financial documents for your branches in the Data Input section first.</p>
              <button
                onClick={() => (window.location.href = "/financials/data-input")}
                className="px-6 py-2 bg-oxford_blue-600 text-white rounded-lg hover:bg-oxford_blue-700 transition-colors"
              >
                Go to Data Input
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderSegmentContent = () => {
    // Show loading or error state if data is not ready
    if (dataLoading) {
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Loading {activeSegment} insights...</p>
        </div>
      );
    }

    // Use API data - all data should come from the restaurant documents via API
    const useApiData = insightsData[activeSegment as keyof typeof insightsData];

    // Check if this specific insight failed to load
    if (useApiData === null) {
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{segments.find((s) => s.id === activeSegment)?.label} Failed to Load</h3>
          <p className="text-gray-600 mb-4">This insight couldn't be generated from your financial documents. This might be due to missing data or processing errors.</p>
          <button
            onClick={() => selectedBranch && loadInsightsData(selectedBranch)}
            className="px-6 py-2 bg-oxford_blue-600 text-white rounded-lg hover:bg-oxford_blue-700 transition-colors"
          >
            Retry Loading
          </button>
        </div>
      );
    }

    switch (activeSegment) {
      case "profitability":
        return <ProfitabilityInsights mockFinancialData={undefined} apiData={useApiData} formatPercentage={formatPercentage} />;
      case "workingCapital":
        return <WorkingCapitalInsights mockFinancialData={undefined} apiData={useApiData} formatCurrency={formatCurrency} />;
      case "funding":
        return <FundingInsights mockFinancialData={undefined} apiData={useApiData} formatCurrency={formatCurrency} formatPercentage={formatPercentage} />;
      case "sensitivity":
        return <SensitivityAnalysis mockFinancialData={undefined} formatCurrency={formatCurrency} />;
      case "valuation":
        return (
          <ValuationTool
            mockFinancialData={undefined}
            apiData={useApiData}
            ebitdaMultiplier={ebitdaMultiplier}
            setEbitdaMultiplier={setEbitdaMultiplier}
            formatCurrency={formatCurrency}
          />
        );
      default:
        return <ProfitabilityInsights mockFinancialData={undefined} apiData={useApiData} formatPercentage={formatPercentage} />;
    }
  };

  // Show different screens based on state
  if (!selectedBranch) {
    return renderBranchSelection();
  }

  if (isProcessing) {
    return <ProcessingScreen selectedBranch={selectedBranch} getBranchDisplayName={getBranchDisplayName} processingStep={processingStep} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Loading performance insights...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ErrorMessage message={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <PageHeader
            title="Performance Insights"
            description={`Advanced financial analysis for ${selectedBranch ? getBranchDisplayName(selectedBranch) : "Unknown Company"}`}
            icon={<PieChart className="w-8 h-8 text-oxford_blue-600" />}
          />
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (selectedBranch) {
                  // Reset data and start processing again
                  setInsightsData({
                    profitability: null,
                    workingCapital: null,
                    funding: null,
                    sensitivity: null,
                    valuation: null,
                  });
                  setDataError(null);
                  setIsProcessing(true);
                  setProcessingStep(0);
                  loadInsightsData(selectedBranch);
                }
              }}
              disabled={isProcessing}
              className="flex items-center px-6 py-3 text-sm font-semibold bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isProcessing ? "animate-spin" : ""}`} />
              Recompute Insights
            </button>
            <button
              onClick={() => {
                setSelectedBranch(null);
                setIsProcessing(false);
                setProcessingStep(0);
                setInsightsData({
                  profitability: null,
                  workingCapital: null,
                  funding: null,
                  sensitivity: null,
                  valuation: null,
                });
                setDataError(null);
              }}
              className="flex items-center px-6 py-3 text-sm font-semibold bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Building2 className="w-4 h-4 mr-2" />
              Change Branch
            </button>
          </div>
        </div>

        {/* Segment Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-wrap gap-2">
            {segments.map((segment) => {
              const Icon = segment.icon;
              return (
                <button
                  key={segment.id}
                  onClick={() => setActiveSegment(segment.id)}
                  className={`flex items-center px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    activeSegment === segment.id ? "bg-oxford_blue-600 text-white shadow-lg" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Icon className={`w-4 h-4 mr-2 ${activeSegment === segment.id ? "text-white" : "text-gray-600"}`} />
                  {segment.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Segment Content */}
        <div className="transition-all duration-300">{renderSegmentContent()}</div>

        {/* Summary Footer */}
        <div className="mt-8 bg-oxford_blue-50 rounded-xl p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-oxford_blue-900 mb-2">Performance Insights Summary</h3>
            <p className="text-sm text-oxford_blue-700">Advanced financial analysis providing actionable insights for strategic decision-making and business optimization.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceInsightsPage;
