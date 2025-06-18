import React, { useState, useRef, useEffect } from "react";
import { DollarSign, Plus, Building2, Upload, FileText, Eye, EyeOff, Settings, CheckCircle, AlertCircle, RefreshCw, Search, X } from "lucide-react";
import { useFinancialsData } from "@/hooks/useFinancialsData";
import { useAppDispatch, useAppSelector } from "@/store";
import { setSelectedBranch, setPeriodType, setNumberOfPeriods, saveBranchData, saveConsolidatedData, addBranch, uploadFinancialDocument } from "@/store/slices/financialsSlice";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { apiService } from "@/services/apiService";

const DataInputPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data, loading, error, refetch } = useFinancialsData();
  const { selectedBranchId, saving, uploading } = useAppSelector((state) => state.financials);

  const [showAddBranch, setShowAddBranch] = useState(false);
  const [newBranchName, setNewBranchName] = useState("");
  const [showDataTables, setShowDataTables] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    profitLoss: true,
    balanceSheet: false,
  });
  const [uploadStatus, setUploadStatus] = useState<{
    profitLoss: "idle" | "uploading" | "success" | "error";
    balanceSheet: "idle" | "uploading" | "success" | "error";
  }>({
    profitLoss: "idle",
    balanceSheet: "idle",
  });
  const [documents, setDocuments] = useState<any[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);

  const profitLossFileRef = useRef<HTMLInputElement>(null);
  const balanceSheetFileRef = useRef<HTMLInputElement>(null);

  const inputData = data?.inputData;
  const activeBranches = inputData?.branches.filter((b) => b.isActive) || [];

  // Filter documents by type for display
  // Map API tag formats to our expected formats
  const profitLossDocs = documents.filter((doc) => doc.tags?.includes("income-statement") || doc.tags?.includes("profit_loss"));
  const balanceSheetDocs = documents.filter((doc) => doc.tags?.includes("balance-sheet") || doc.tags?.includes("balance_sheet"));

  // Calculate consolidated data as sum of all enabled branches
  const getConsolidatedData = () => {
    if (!inputData || activeBranches.length === 0) return [];

    if (activeBranches.length === 1) {
      // If only one branch, mirror its data exactly
      const singleBranchData = inputData.branchData.find((b) => b.branchId === activeBranches[0].id);
      return singleBranchData?.periods || [];
    }

    // Sum data from all enabled branches
    const consolidatedPeriods = [];
    const maxPeriods = Math.max(...inputData.branchData.map((b) => b.periods.length));

    for (let i = 0; i < maxPeriods; i++) {
      const consolidatedPeriod = {
        periodId: `period-${i}`,
        periodLabel: `Period ${i + 1}`,
        date: "",

        // Sum all financial metrics
        revenue: 0,
        grossMargin: 0,
        netProfitAfterTax: 0,
        depreciationAmortisation: 0,
        interestPaid: 0,
        tax: 0,
        dividends: 0,
        totalAssets: 0,
        cash: 0,
        accountsReceivable: 0,
        inventory: 0,
        totalCurrentAssets: 0,
        fixedAssets: 0,
        currentLiabilities: 0,
        nonCurrentLiabilities: 0,
        accountsPayable: 0,
        bankLoansCurrent: 0,
        bankLoansNonCurrent: 0,
      };

      // Sum values from all enabled branches
      activeBranches.forEach((branch) => {
        const branchData = inputData.branchData.find((b) => b.branchId === branch.id);
        if (branchData && branchData.periods[i]) {
          const period = branchData.periods[i];
          consolidatedPeriod.revenue += period.revenue || 0;
          consolidatedPeriod.grossMargin += period.grossMargin || 0;
          consolidatedPeriod.netProfitAfterTax += period.netProfitAfterTax || 0;
          consolidatedPeriod.depreciationAmortisation += period.depreciationAmortisation || 0;
          consolidatedPeriod.interestPaid += period.interestPaid || 0;
          consolidatedPeriod.tax += period.tax || 0;
          consolidatedPeriod.dividends += period.dividends || 0;
          consolidatedPeriod.totalAssets += period.totalAssets || 0;
          consolidatedPeriod.cash += period.cash || 0;
          consolidatedPeriod.accountsReceivable += period.accountsReceivable || 0;
          consolidatedPeriod.inventory += period.inventory || 0;
          consolidatedPeriod.totalCurrentAssets += period.totalCurrentAssets || 0;
          consolidatedPeriod.fixedAssets += period.fixedAssets || 0;
          consolidatedPeriod.currentLiabilities += period.currentLiabilities || 0;
          consolidatedPeriod.nonCurrentLiabilities += period.nonCurrentLiabilities || 0;
          consolidatedPeriod.accountsPayable += period.accountsPayable || 0;
          consolidatedPeriod.bankLoansCurrent += period.bankLoansCurrent || 0;
          consolidatedPeriod.bankLoansNonCurrent += period.bankLoansNonCurrent || 0;
        }
      });

      consolidatedPeriods.push(consolidatedPeriod);
    }

    return consolidatedPeriods;
  };

  const currentData = selectedBranchId === "consolidated" ? getConsolidatedData() : inputData?.branchData.find((b) => b.branchId === selectedBranchId)?.periods || [];

  const periodTypes = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
    { value: "yearly", label: "Yearly" },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  const handleFileUpload = async (type: "profitLoss" | "balanceSheet", file: File) => {
    if (!file) return;

    setUploadStatus((prev) => ({ ...prev, [type]: "uploading" }));

    try {
      // Dispatch the upload action which will set the global uploading state
      dispatch(
        uploadFinancialDocument({
          branchId: selectedBranchId,
          documentType: type,
          file,
        })
      );

      // Upload to the actual API endpoint
      const documentType = type === "profitLoss" ? "profit_loss" : "balance_sheet";
      const response = await apiService.uploadFinancialDocument(file, documentType, selectedBranchId);

      console.log("Upload successful:", response);
      setUploadStatus((prev) => ({ ...prev, [type]: "success" }));

      // Show success message or update UI as needed
      if (response.success) {
        console.log(`${documentType} uploaded successfully:`, response.message);
      }
    } catch (error) {
      console.error(`Error uploading ${type} document:`, error);
      setUploadStatus((prev) => ({ ...prev, [type]: "error" }));
    }
  };

  const handleSave = () => {
    if (selectedBranchId === "consolidated") {
      dispatch(saveConsolidatedData(currentData));
    } else {
      dispatch(saveBranchData({ branchId: selectedBranchId, periodData: currentData }));
    }
  };

  const handleAddBranch = () => {
    if (newBranchName.trim()) {
      dispatch(
        addBranch({
          name: newBranchName.trim(),
          location: "",
          isActive: true,
        })
      );
      setNewBranchName("");
      setShowAddBranch(false);
    }
  };

  const fetchDocuments = async () => {
    try {
      setDocumentsLoading(true);
      console.log("🔍 Fetching documents from API...");

      const response = await apiService.getFinancialDocuments();
      console.log("📄 API Response:", response);

      if (response && response.success && response.data && response.data.documents) {
        console.log("✅ Documents found:", response.data.documents.length);
        setDocuments(response.data.documents);
      } else if (response && response.data && Array.isArray(response.data)) {
        // Handle case where documents are directly in data array
        console.log("✅ Documents found (direct array):", response.data.length);
        setDocuments(response.data);
      } else {
        console.log("⚠️ No documents found in response or unexpected format");
        console.log("Response structure:", JSON.stringify(response, null, 2));
        setDocuments([]);
      }
    } catch (error) {
      console.error("❌ Error fetching documents:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
      }
      setDocuments([]);
    } finally {
      setDocumentsLoading(false);
    }
  };

  // Fetch documents when consolidated view is selected
  useEffect(() => {
    if (selectedBranchId === "consolidated") {
      fetchDocuments();
    }
  }, [selectedBranchId]);

  // Handle keyboard events for modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && showAddBranch) {
        setShowAddBranch(false);
      }
    };

    if (showAddBranch) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // Prevent background scroll
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [showAddBranch]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };
  const getUploadStatusIcon = (status: string) => {
    switch (status) {
      case "uploading":
        return <LoadingSpinner size="sm" />;
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return uploading ? <LoadingSpinner size="sm" /> : <Upload className="w-4 h-4" />;
    }
  };
  const getUploadStatusText = (status: string) => {
    switch (status) {
      case "uploading":
        return "Processing...";
      case "success":
        return "Data extracted successfully";
      case "error":
        return "Upload failed";
      default:
        return uploading ? "Processing..." : "Upload Document";
    }
  };

  const renderDataDisplay = (label: string, value: number) => (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-gray-700">{label}</label>
      <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50">{formatCurrency(value)}</div>
    </div>
  );

  const renderPeriodHeaders = () => (
    <thead>
      <tr className="border-b border-gray-200">
        <th className="text-left py-3 px-4 font-medium text-gray-900">Item</th>
        {currentData.slice(0, inputData?.numberOfPeriods || 4).map((period) => (
          <th key={period.periodId} className="text-center py-3 px-4 font-medium text-gray-900 min-w-[150px]">
            <div className="space-y-2">
              <div>{period.periodLabel}</div>
              <div className="text-xs text-gray-500">
                <span className="block mb-1">Period Ending Date:</span>
                <span className="text-center">{period.date || "Not specified"}</span>
              </div>
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Loading financial data...</p>
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

  if (!inputData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Financial Data Input"
          description="Upload and manage financial documents across all branches"
          icon={<DollarSign className="w-8 h-8 text-oxford_blue-600" />}
        />
        {/* Branch Selection */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Building2 className="w-5 h-5 text-oxford_blue-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Select Branch/View</h2>
            </div>
            <button
              onClick={() => setShowAddBranch(!showAddBranch)}
              className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Branch
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => dispatch(setSelectedBranch("consolidated"))}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedBranchId === "consolidated" ? "bg-oxford_blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              📊 Consolidated View {activeBranches.length > 1 ? `(${activeBranches.length} branches)` : ""}
            </button>

            {activeBranches.map((branch) => (
              <button
                key={branch.id}
                onClick={() => dispatch(setSelectedBranch(branch.id))}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedBranchId === branch.id ? "bg-oxford_blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                🏢 {branch.name}
              </button>
            ))}
          </div>

          {/* Documents content directly under tabs */}
          {selectedBranchId === "consolidated" && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-600">
                  View all uploaded financial documents across all branches. Documents are processed using Mastra.ai and analyzed with SambaNova + Mistral.
                </p>
                <button
                  onClick={fetchDocuments}
                  disabled={documentsLoading}
                  className="flex items-center px-3 py-2 text-sm bg-oxford_blue-600 text-white rounded-lg hover:bg-oxford_blue-700 transition-colors disabled:opacity-50"
                >
                  {documentsLoading ? <LoadingSpinner size="sm" className="mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                  Refresh
                </button>
              </div>

              {documentsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <LoadingSpinner size="md" className="mr-2" />
                  <span className="text-gray-600">Loading documents...</span>
                </div>
              ) : documents.length > 0 ? (
                <div className="space-y-6">
                  {/* Profit & Loss Documents */}
                  {profitLossDocs.length > 0 && (
                    <div>
                      <div className="flex items-center mb-4">
                        <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">Profit & Loss Statements</h3>
                        <span className="ml-2 text-sm text-gray-500">({profitLossDocs.length} documents)</span>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        {profitLossDocs.map((doc, index) => (
                          <div key={doc.id || index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center mb-2">
                                  <FileText className="w-4 h-4 text-green-600 mr-2" />
                                  <h4 className="font-medium text-gray-900">{doc.name}</h4>
                                  <span className="ml-2 text-sm text-gray-500">({doc.size})</span>
                                </div>

                                {doc.tags && doc.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mb-2">
                                    {doc.tags.map((tag: string, tagIndex: number) => (
                                      <span key={tagIndex} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}

                                {doc.contentPreview && <p className="text-sm text-gray-600 mb-2">{doc.contentPreview}</p>}

                                <p className="text-xs text-gray-500">
                                  Uploaded: {new Date(doc.createdAt).toLocaleDateString()} at {new Date(doc.createdAt).toLocaleTimeString()}
                                </p>
                              </div>

                              <div className="flex items-center ml-4">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* P&L Summary */}
                      <div className="mt-4 p-3 bg-green-50 rounded-lg">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-green-700 font-medium">Total P&L Documents:</span>
                            <span className="text-green-900 ml-1">{profitLossDocs.length}</span>
                          </div>
                          <div>
                            <span className="text-green-700 font-medium">Branches Covered:</span>
                            <span className="text-green-900 ml-1">
                              {new Set(profitLossDocs.flatMap((doc) => doc.tags?.filter((tag: string) => ["1", "2", "restaurant-a", "restaurant-b"].includes(tag)) || [])).size}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Balance Sheet Documents */}
                  {balanceSheetDocs.length > 0 && (
                    <div>
                      <div className="flex items-center mb-4">
                        <Building2 className="w-5 h-5 text-blue-600 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">Balance Sheets</h3>
                        <span className="ml-2 text-sm text-gray-500">({balanceSheetDocs.length} documents)</span>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        {balanceSheetDocs.map((doc, index) => (
                          <div key={doc.id || index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center mb-2">
                                  <FileText className="w-4 h-4 text-blue-600 mr-2" />
                                  <h4 className="font-medium text-gray-900">{doc.name}</h4>
                                  <span className="ml-2 text-sm text-gray-500">({doc.size})</span>
                                </div>

                                {doc.tags && doc.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mb-2">
                                    {doc.tags.map((tag: string, tagIndex: number) => (
                                      <span key={tagIndex} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}

                                {doc.contentPreview && <p className="text-sm text-gray-600 mb-2">{doc.contentPreview}</p>}

                                <p className="text-xs text-gray-500">
                                  Uploaded: {new Date(doc.createdAt).toLocaleDateString()} at {new Date(doc.createdAt).toLocaleTimeString()}
                                </p>
                              </div>

                              <div className="flex items-center ml-4">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Balance Sheet Summary */}
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-blue-700 font-medium">Total Balance Sheets:</span>
                            <span className="text-blue-900 ml-1">{balanceSheetDocs.length}</span>
                          </div>
                          <div>
                            <span className="text-blue-700 font-medium">Branches Covered:</span>
                            <span className="text-blue-900 ml-1">
                              {new Set(balanceSheetDocs.flatMap((doc) => doc.tags?.filter((tag: string) => ["1", "2", "restaurant-a", "restaurant-b"].includes(tag)) || [])).size}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Overall Summary */}
                  {(profitLossDocs.length > 0 || balanceSheetDocs.length > 0) && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center mb-2">
                        <FileText className="w-5 h-5 text-gray-600 mr-2" />
                        <h4 className="font-medium text-gray-900">Overall Summary</h4>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-700 font-medium">Total Documents:</span>
                          <span className="text-gray-900 ml-1">{documents.length}</span>
                        </div>
                        <div>
                          <span className="text-gray-700 font-medium">Document Types:</span>
                          <span className="text-gray-900 ml-1">{(profitLossDocs.length > 0 ? 1 : 0) + (balanceSheetDocs.length > 0 ? 1 : 0)} of 2</span>
                        </div>
                        <div>
                          <span className="text-gray-700 font-medium">Branches with Data:</span>
                          <span className="text-gray-900 ml-1">
                            {new Set(documents.flatMap((doc) => doc.tags?.filter((tag: string) => ["1", "2", "restaurant-a", "restaurant-b"].includes(tag)) || [])).size} of 2
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Documents Found</h3>
                  <p className="text-gray-600 mb-4">Upload financial documents using the Main Branch or Mall Branch tabs to get started.</p>
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => dispatch(setSelectedBranch("1"))}
                      className="px-4 py-2 bg-oxford_blue-600 text-white rounded-lg hover:bg-oxford_blue-700 transition-colors"
                    >
                      Go to Main Branch
                    </button>
                    <button onClick={() => dispatch(setSelectedBranch("2"))} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                      Go to Mall Branch
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Individual Branch Content */}
          {(selectedBranchId === "1" || selectedBranchId === "2") && (
            <div className="mt-4">
              {/* Document Upload Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex items-center mb-4">
                  <FileText className="w-5 h-5 text-oxford_blue-600 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-900">Upload Financial Documents</h2>
                  {uploading && (
                    <div className="ml-auto flex items-center text-sm text-oxford_blue-600">
                      <LoadingSpinner size="sm" className="mr-2" />
                      Processing documents...
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-6">
                  Upload your Profit & Loss statement and Balance Sheet for {selectedBranchId === "1" ? "Main Branch" : "Mall Branch"}. The system will automatically extract and
                  populate the financial data.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Profit & Loss Upload */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-oxford_blue-400 transition-colors">
                    <input
                      ref={profitLossFileRef}
                      type="file"
                      accept=".pdf,.xlsx,.xls,.csv"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload("profitLoss", e.target.files[0])}
                      className="hidden"
                    />
                    <div className="mb-4">{getUploadStatusIcon(uploadStatus.profitLoss)}</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Profit & Loss Statement</h3>
                    <p className="text-sm text-gray-600 mb-4">Upload PDF, Excel, or CSV format</p>
                    <button
                      onClick={() => profitLossFileRef.current?.click()}
                      disabled={uploadStatus.profitLoss === "uploading" || uploading}
                      className="px-4 py-2 bg-oxford_blue-600 text-white rounded-lg hover:bg-oxford_blue-700 transition-colors disabled:opacity-50"
                    >
                      {getUploadStatusText(uploadStatus.profitLoss)}
                    </button>
                  </div>

                  {/* Balance Sheet Upload */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-oxford_blue-400 transition-colors">
                    <input
                      ref={balanceSheetFileRef}
                      type="file"
                      accept=".pdf,.xlsx,.xls,.csv"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload("balanceSheet", e.target.files[0])}
                      className="hidden"
                    />
                    <div className="mb-4">{getUploadStatusIcon(uploadStatus.balanceSheet)}</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Balance Sheet</h3>
                    <p className="text-sm text-gray-600 mb-4">Upload PDF, Excel, or CSV format</p>
                    <button
                      onClick={() => balanceSheetFileRef.current?.click()}
                      disabled={uploadStatus.balanceSheet === "uploading" || uploading}
                      className="px-4 py-2 bg-oxford_blue-600 text-white rounded-lg hover:bg-oxford_blue-700 transition-colors disabled:opacity-50"
                    >
                      {getUploadStatusText(uploadStatus.balanceSheet)}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Select Range Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center mb-4">
            <Settings className="w-5 h-5 text-oxford_blue-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Select Range</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Period Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Period Type</label>
              <select
                value="monthly"
                onChange={(e) => dispatch(setPeriodType(e.target.value as "monthly"))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-oxford_blue-500 focus:border-transparent"
              >
                <option value="monthly">Monthly</option>
              </select>
            </div>

            {/* Number of Periods */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Number of Periods</label>
              <select
                value={4}
                onChange={(e) => dispatch(setNumberOfPeriods(parseInt(e.target.value)))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-oxford_blue-500 focus:border-transparent"
              >
                <option value={4}>4 Periods</option>
              </select>
            </div>

            {/* Search */}
            <div>
              <button
                onClick={() => setShowDataTables(!showDataTables)}
                className="flex items-center px-3 py-2 bg-oxford_blue-600 text-white rounded-md hover:bg-oxford_blue-700 transition-colors mt-7"
              >
                <Search className="w-4 h-4 mr-2" />
                {showDataTables ? "Hide Results" : "Search"}
              </button>
            </div>
          </div>

          {/* Data Display Tables */}
          {showDataTables && (
            <div className="mt-6 space-y-6">
              {/* Profit & Loss Statement */}
              <div className="bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between p-6 cursor-pointer border-b border-gray-200" onClick={() => toggleSection("profitLoss")}>
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Profit & Loss Statement
                      {selectedBranchId === "consolidated" && activeBranches.length > 1 && (
                        <span className="text-sm text-gray-600 ml-2">(Consolidated from {activeBranches.length} branches)</span>
                      )}
                    </h3>
                  </div>
                  {expandedSections.profitLoss ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                </div>

                {expandedSections.profitLoss && (
                  <div className="p-6">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        {renderPeriodHeaders()}
                        <tbody className="divide-y divide-gray-100">
                          <tr>
                            <td className="py-3 px-4 font-medium text-gray-900">Revenue</td>
                            {currentData.slice(0, inputData.numberOfPeriods).map((period) => (
                              <td key={period.periodId} className="py-3 px-4">
                                {renderDataDisplay("", period.revenue || 0)}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="py-3 px-4 font-medium text-gray-900">Gross Margin</td>
                            {currentData.slice(0, inputData.numberOfPeriods).map((period) => (
                              <td key={period.periodId} className="py-3 px-4">
                                {renderDataDisplay("", period.grossMargin || 0)}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="py-3 px-4 font-medium text-gray-900">Net Profit (After Tax)</td>
                            {currentData.slice(0, inputData.numberOfPeriods).map((period) => (
                              <td key={period.periodId} className="py-3 px-4">
                                {renderDataDisplay("", period.netProfitAfterTax || 0)}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="py-3 px-4 font-medium text-gray-900">Depreciation & Amortisation</td>
                            {currentData.slice(0, inputData.numberOfPeriods).map((period) => (
                              <td key={period.periodId} className="py-3 px-4">
                                {renderDataDisplay("", period.depreciationAmortisation || 0)}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="py-3 px-4 font-medium text-gray-900">Interest Paid</td>
                            {currentData.slice(0, inputData.numberOfPeriods).map((period) => (
                              <td key={period.periodId} className="py-3 px-4">
                                {renderDataDisplay("", period.interestPaid || 0)}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="py-3 px-4 font-medium text-gray-900">Tax</td>
                            {currentData.slice(0, inputData.numberOfPeriods).map((period) => (
                              <td key={period.periodId} className="py-3 px-4">
                                {renderDataDisplay("", period.tax || 0)}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="py-3 px-4 font-medium text-gray-900">Dividends</td>
                            {currentData.slice(0, inputData.numberOfPeriods).map((period) => (
                              <td key={period.periodId} className="py-3 px-4">
                                {renderDataDisplay("", period.dividends || 0)}
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Balance Sheet */}
              <div className="bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between p-6 cursor-pointer border-b border-gray-200" onClick={() => toggleSection("balanceSheet")}>
                  <div className="flex items-center">
                    <Building2 className="w-5 h-5 text-blue-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Balance Sheet
                      {selectedBranchId === "consolidated" && activeBranches.length > 1 && (
                        <span className="text-sm text-gray-600 ml-2">(Consolidated from {activeBranches.length} branches)</span>
                      )}
                    </h3>
                  </div>
                  {expandedSections.balanceSheet ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                </div>

                {expandedSections.balanceSheet && (
                  <div className="p-6 space-y-8">
                    {/* Assets Section */}
                    <div>
                      <h4 className="text-lg font-semibold text-blue-700 mb-4 flex items-center">
                        <Building2 className="w-5 h-5 mr-2" />
                        Assets
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          {renderPeriodHeaders()}
                          <tbody className="divide-y divide-gray-100">
                            <tr>
                              <td className="py-3 px-4 font-medium text-gray-900">Total Assets</td>
                              {currentData.slice(0, inputData.numberOfPeriods).map((period) => (
                                <td key={period.periodId} className="py-3 px-4">
                                  {renderDataDisplay("", period.totalAssets || 0)}
                                </td>
                              ))}
                            </tr>
                            <tr>
                              <td className="py-3 px-4 font-medium text-gray-900">Cash</td>
                              {currentData.slice(0, inputData.numberOfPeriods).map((period) => (
                                <td key={period.periodId} className="py-3 px-4">
                                  {renderDataDisplay("", period.cash || 0)}
                                </td>
                              ))}
                            </tr>
                            <tr>
                              <td className="py-3 px-4 font-medium text-gray-900">Accounts Receivable</td>
                              {currentData.slice(0, inputData.numberOfPeriods).map((period) => (
                                <td key={period.periodId} className="py-3 px-4">
                                  {renderDataDisplay("", period.accountsReceivable || 0)}
                                </td>
                              ))}
                            </tr>
                            <tr>
                              <td className="py-3 px-4 font-medium text-gray-900">Inventory</td>
                              {currentData.slice(0, inputData.numberOfPeriods).map((period) => (
                                <td key={period.periodId} className="py-3 px-4">
                                  {renderDataDisplay("", period.inventory || 0)}
                                </td>
                              ))}
                            </tr>
                            <tr>
                              <td className="py-3 px-4 font-medium text-gray-900">Total Current Assets</td>
                              {currentData.slice(0, inputData.numberOfPeriods).map((period) => (
                                <td key={period.periodId} className="py-3 px-4">
                                  {renderDataDisplay("", period.totalCurrentAssets || 0)}
                                </td>
                              ))}
                            </tr>
                            <tr>
                              <td className="py-3 px-4 font-medium text-gray-900">Fixed Assets</td>
                              {currentData.slice(0, inputData.numberOfPeriods).map((period) => (
                                <td key={period.periodId} className="py-3 px-4">
                                  {renderDataDisplay("", period.fixedAssets || 0)}
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Liabilities Section */}
                    <div>
                      <h4 className="text-lg font-semibold text-red-700 mb-4 flex items-center">
                        <AlertCircle className="w-5 h-5 mr-2" />
                        Liabilities
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          {renderPeriodHeaders()}
                          <tbody className="divide-y divide-gray-100">
                            <tr>
                              <td className="py-3 px-4 font-medium text-gray-900">Current Liabilities</td>
                              {currentData.slice(0, inputData.numberOfPeriods).map((period) => (
                                <td key={period.periodId} className="py-3 px-4">
                                  {renderDataDisplay("", period.currentLiabilities || 0)}
                                </td>
                              ))}
                            </tr>
                            <tr>
                              <td className="py-3 px-4 font-medium text-gray-900">Non-Current Liabilities</td>
                              {currentData.slice(0, inputData.numberOfPeriods).map((period) => (
                                <td key={period.periodId} className="py-3 px-4">
                                  {renderDataDisplay("", period.nonCurrentLiabilities || 0)}
                                </td>
                              ))}
                            </tr>
                            <tr>
                              <td className="py-3 px-4 font-medium text-gray-900">Accounts Payable</td>
                              {currentData.slice(0, inputData.numberOfPeriods).map((period) => (
                                <td key={period.periodId} className="py-3 px-4">
                                  {renderDataDisplay("", period.accountsPayable || 0)}
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Debt Funding Section */}
                    <div>
                      <h4 className="text-lg font-semibold text-purple-700 mb-4 flex items-center">
                        <DollarSign className="w-5 h-5 mr-2" />
                        Debt Funding
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          {renderPeriodHeaders()}
                          <tbody className="divide-y divide-gray-100">
                            <tr>
                              <td className="py-3 px-4 font-medium text-gray-900">Bank Loans - Current</td>
                              {currentData.slice(0, inputData.numberOfPeriods).map((period) => (
                                <td key={period.periodId} className="py-3 px-4">
                                  {renderDataDisplay("", period.bankLoansCurrent || 0)}
                                </td>
                              ))}
                            </tr>
                            <tr>
                              <td className="py-3 px-4 font-medium text-gray-900">Bank Loans - Non Current</td>
                              {currentData.slice(0, inputData.numberOfPeriods).map((period) => (
                                <td key={period.periodId} className="py-3 px-4">
                                  {renderDataDisplay("", period.bankLoansNonCurrent || 0)}
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Summary Footer */}
        <div className="mt-8 bg-oxford_blue-50 rounded-xl p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-oxford_blue-900 mb-2">
              {selectedBranchId === "consolidated"
                ? `Consolidated View${activeBranches.length > 1 ? ` (${activeBranches.length} branches)` : ""}`
                : `${activeBranches.find((b) => b.id === selectedBranchId)?.name} Branch`}
            </h3>
            <p className="text-sm text-oxford_blue-700">
              Showing {inputData.numberOfPeriods} {inputData.selectedPeriodType} periods •
              {selectedBranchId === "consolidated"
                ? `Data consolidated from ${activeBranches.length} active branch${activeBranches.length !== 1 ? "es" : ""}`
                : "Individual branch data"}
            </p>
          </div>
        </div>
      </div>

      {/* Add Branch Modal */}
      {showAddBranch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowAddBranch(false)}>
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add New Branch</h3>
              <button onClick={() => setShowAddBranch(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Branch Name</label>
              <input
                type="text"
                value={newBranchName}
                onChange={(e) => setNewBranchName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-oxford_blue-500 focus:border-transparent"
                placeholder="e.g., Downtown Branch"
                autoFocus
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button onClick={() => setShowAddBranch(false)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">
                Cancel
              </button>
              <button onClick={handleAddBranch} className="px-4 py-2 text-sm bg-oxford_blue-600 text-white rounded-md hover:bg-oxford_blue-700 transition-colors">
                Add Branch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataInputPage;
