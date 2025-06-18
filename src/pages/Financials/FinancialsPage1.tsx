import React, { useState, useRef } from "react";
import { DollarSign, Plus, Building2, Upload, FileText, Save, Eye, EyeOff, Settings, CheckCircle, AlertCircle } from "lucide-react";
import { useFinancialsData } from "@/hooks/useFinancialsData";
import { useAppDispatch, useAppSelector } from "@/store";
import { setSelectedBranch, setPeriodType, setNumberOfPeriods, saveBranchData, saveConsolidatedData, addBranch, uploadFinancialDocument } from "@/store/slices/financialsSlice";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorMessage } from "@/components/common/ErrorMessage";

const FinancialsPage1: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data, loading, error, refetch } = useFinancialsData();
  const { selectedBranchId, saving, uploading } = useAppSelector((state) => state.financials);
  
  const [showAddBranch, setShowAddBranch] = useState(false);
  const [newBranchName, setNewBranchName] = useState("");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    profitLoss: true,
    balanceSheet: false,
  });
  const [uploadStatus, setUploadStatus] = useState<{
    profitLoss: 'idle' | 'uploading' | 'success' | 'error';
    balanceSheet: 'idle' | 'uploading' | 'success' | 'error';
  }>({
    profitLoss: 'idle',
    balanceSheet: 'idle'
  });

  const profitLossFileRef = useRef<HTMLInputElement>(null);
  const balanceSheetFileRef = useRef<HTMLInputElement>(null);

  const inputData = data?.inputData;
  const activeBranches = inputData?.branches.filter(b => b.isActive) || [];
  
  // Calculate consolidated data as sum of all enabled branches
  const getConsolidatedData = () => {
    if (!inputData || activeBranches.length === 0) return [];
    
    if (activeBranches.length === 1) {
      // If only one branch, mirror its data exactly
      const singleBranchData = inputData.branchData.find(b => b.branchId === activeBranches[0].id);
      return singleBranchData?.periods || [];
    }
    
    // Sum data from all enabled branches
    const consolidatedPeriods = [];
    const maxPeriods = Math.max(...inputData.branchData.map(b => b.periods.length));
    
    for (let i = 0; i < maxPeriods; i++) {
      const consolidatedPeriod = {
        periodId: `period-${i}`,
        periodLabel: `Period ${i + 1}`,
        date: '',
        
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
      activeBranches.forEach(branch => {
        const branchData = inputData.branchData.find(b => b.branchId === branch.id);
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

  const currentData = selectedBranchId === 'consolidated' 
    ? getConsolidatedData()
    : inputData?.branchData.find(b => b.branchId === selectedBranchId)?.periods || [];

  const periodTypes = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleFileUpload = async (type: 'profitLoss' | 'balanceSheet', file: File) => {
    if (!file) return;
    
    setUploadStatus(prev => ({ ...prev, [type]: 'uploading' }));
    
    try {
      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, this would:
      // 1. Upload the file to the server
      // 2. Process the document (OCR/parsing)
      // 3. Extract financial data automatically
      // 4. Return structured data to populate the forms
      
      dispatch(uploadFinancialDocument({ 
        branchId: selectedBranchId, 
        documentType: type, 
        file 
      }));
      
      setUploadStatus(prev => ({ ...prev, [type]: 'success' }));
    } catch (error) {
      setUploadStatus(prev => ({ ...prev, [type]: 'error' }));
    }
  };

  const handleSave = () => {
    if (selectedBranchId === 'consolidated') {
      dispatch(saveConsolidatedData(currentData));
    } else {
      dispatch(saveBranchData({ branchId: selectedBranchId, periodData: currentData }));
    }
  };

  const handleAddBranch = () => {
    if (newBranchName.trim()) {
      dispatch(addBranch({
        name: newBranchName.trim(),
        location: "",
        isActive: true,
      }));
      setNewBranchName("");
      setShowAddBranch(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getUploadStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading':
        return <LoadingSpinner size="sm" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Upload className="w-4 h-4" />;
    }
  };

  const getUploadStatusText = (status: string) => {
    switch (status) {
      case 'uploading':
        return 'Processing...';
      case 'success':
        return 'Data extracted successfully';
      case 'error':
        return 'Upload failed';
      default:
        return 'Upload Document';
    }
  };

  const renderDataDisplay = (label: string, value: number, isRequired: boolean = false) => (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-gray-700">
        {label} {isRequired && selectedBranchId !== 'consolidated' && <span className="text-red-500">*</span>}
      </label>
      <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50">
        {formatCurrency(value)}
      </div>
    </div>
  );

  const renderPeriodHeaders = () => (
    <thead>
      <tr className="border-b border-gray-200">
        <th className="text-left py-3 px-4 font-medium text-gray-900">Item</th>
        {currentData.slice(0, inputData?.numberOfPeriods || 4).map(period => (
          <th key={period.periodId} className="text-center py-3 px-4 font-medium text-gray-900 min-w-[150px]">
            <div className="space-y-2">
              <div>{period.periodLabel}</div>
              <div className="text-xs text-gray-500">
                <span className="block mb-1">Period Ending Date:</span>
                <span className="text-center">{period.date || 'Not specified'}</span>
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
          title="Financial Data Management"
          description="Upload and manage financial documents across all branches"
          icon={<DollarSign className="w-8 h-8 text-oxford_blue-600" />}
          actions={
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center px-4 py-2 bg-oxford_blue-600 text-white rounded-lg hover:bg-oxford_blue-700 transition-colors disabled:opacity-50"
            >
              {saving ? <LoadingSpinner size="sm" className="mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Save Data
            </button>
          }
        />

        {/* Configuration Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center mb-4">
            <Settings className="w-5 h-5 text-oxford_blue-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Configuration</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Period Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Period Type</label>
              <select
                value={inputData.selectedPeriodType}
                onChange={(e) => dispatch(setPeriodType(e.target.value as any))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-oxford_blue-500 focus:border-transparent"
              >
                {periodTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            {/* Number of Periods */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Number of Periods (2-6)</label>
              <select
                value={inputData.numberOfPeriods}
                onChange={(e) => dispatch(setNumberOfPeriods(parseInt(e.target.value)))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-oxford_blue-500 focus:border-transparent"
              >
                {[2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>{num} Periods</option>
                ))}
              </select>
            </div>

            {/* Add Branch */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Manage Branches</label>
              <button
                onClick={() => setShowAddBranch(!showAddBranch)}
                className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Branch
              </button>
            </div>
          </div>

          {/* Add Branch Form */}
          {showAddBranch && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Add New Branch</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Branch Name</label>
                  <input
                    type="text"
                    value={newBranchName}
                    onChange={(e) => setNewBranchName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-oxford_blue-500 focus:border-transparent"
                    placeholder="e.g., Downtown Branch"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => setShowAddBranch(false)}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddBranch}
                  className="px-3 py-2 text-sm bg-oxford_blue-600 text-white rounded-md hover:bg-oxford_blue-700"
                >
                  Add Branch
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Branch Selection */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center mb-4">
            <Building2 className="w-5 h-5 text-oxford_blue-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Select Branch/View</h2>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => dispatch(setSelectedBranch('consolidated'))}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedBranchId === 'consolidated'
                  ? 'bg-oxford_blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📊 Consolidated View {activeBranches.length > 1 ? `(${activeBranches.length} branches)` : ''}
            </button>
            
            {activeBranches.map(branch => (
              <button
                key={branch.id}
                onClick={() => dispatch(setSelectedBranch(branch.id))}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedBranchId === branch.id
                    ? 'bg-oxford_blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🏢 {branch.name}
              </button>
            ))}
          </div>
        </div>

        {/* Document Upload Section */}
        {selectedBranchId !== 'consolidated' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center mb-4">
              <FileText className="w-5 h-5 text-oxford_blue-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Upload Financial Documents</h2>
            </div>
            <p className="text-sm text-gray-600 mb-6">Upload your Profit & Loss statement and Balance Sheet. The system will automatically extract and populate the financial data.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profit & Loss Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-oxford_blue-400 transition-colors">
                <input
                  ref={profitLossFileRef}
                  type="file"
                  accept=".pdf,.xlsx,.xls,.csv"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload('profitLoss', e.target.files[0])}
                  className="hidden"
                />
                <div className="mb-4">
                  {getUploadStatusIcon(uploadStatus.profitLoss)}
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Profit & Loss Statement</h3>
                <p className="text-sm text-gray-600 mb-4">Upload PDF, Excel, or CSV format</p>
                <button
                  onClick={() => profitLossFileRef.current?.click()}
                  disabled={uploadStatus.profitLoss === 'uploading'}
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
                  onChange={(e) => e.target.files?.[0] && handleFileUpload('balanceSheet', e.target.files[0])}
                  className="hidden"
                />
                <div className="mb-4">
                  {getUploadStatusIcon(uploadStatus.balanceSheet)}
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Balance Sheet</h3>
                <p className="text-sm text-gray-600 mb-4">Upload PDF, Excel, or CSV format</p>
                <button
                  onClick={() => balanceSheetFileRef.current?.click()}
                  disabled={uploadStatus.balanceSheet === 'uploading'}
                  className="px-4 py-2 bg-oxford_blue-600 text-white rounded-lg hover:bg-oxford_blue-700 transition-colors disabled:opacity-50"
                >
                  {getUploadStatusText(uploadStatus.balanceSheet)}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Data Display Tables */}
        <div className="space-y-6">
          {/* Profit & Loss Statement */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div 
              className="flex items-center justify-between p-6 cursor-pointer border-b border-gray-200"
              onClick={() => toggleSection('profitLoss')}
            >
              <div className="flex items-center">
                <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Profit & Loss Statement
                  {selectedBranchId === 'consolidated' && activeBranches.length > 1 && (
                    <span className="text-sm text-gray-600 ml-2">(Consolidated from {activeBranches.length} branches)</span>
                  )}
                </h2>
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
                        {currentData.slice(0, inputData.numberOfPeriods).map(period => (
                          <td key={period.periodId} className="py-3 px-4">
                            {renderDataDisplay('', period.revenue || 0, true)}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-medium text-gray-900">Gross Margin</td>
                        {currentData.slice(0, inputData.numberOfPeriods).map(period => (
                          <td key={period.periodId} className="py-3 px-4">
                            {renderDataDisplay('', period.grossMargin || 0, true)}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-medium text-gray-900">Net Profit (After Tax)</td>
                        {currentData.slice(0, inputData.numberOfPeriods).map(period => (
                          <td key={period.periodId} className="py-3 px-4">
                            {renderDataDisplay('', period.netProfitAfterTax || 0, true)}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-medium text-gray-900">Depreciation & Amortisation</td>
                        {currentData.slice(0, inputData.numberOfPeriods).map(period => (
                          <td key={period.periodId} className="py-3 px-4">
                            {renderDataDisplay('', period.depreciationAmortisation || 0)}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-medium text-gray-900">Interest Paid</td>
                        {currentData.slice(0, inputData.numberOfPeriods).map(period => (
                          <td key={period.periodId} className="py-3 px-4">
                            {renderDataDisplay('', period.interestPaid || 0)}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-medium text-gray-900">Tax</td>
                        {currentData.slice(0, inputData.numberOfPeriods).map(period => (
                          <td key={period.periodId} className="py-3 px-4">
                            {renderDataDisplay('', period.tax || 0)}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-medium text-gray-900">Dividends</td>
                        {currentData.slice(0, inputData.numberOfPeriods).map(period => (
                          <td key={period.periodId} className="py-3 px-4">
                            {renderDataDisplay('', period.dividends || 0)}
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div 
              className="flex items-center justify-between p-6 cursor-pointer border-b border-gray-200"
              onClick={() => toggleSection('balanceSheet')}
            >
              <div className="flex items-center">
                <Building2 className="w-5 h-5 text-blue-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Balance Sheet
                  {selectedBranchId === 'consolidated' && activeBranches.length > 1 && (
                    <span className="text-sm text-gray-600 ml-2">(Consolidated from {activeBranches.length} branches)</span>
                  )}
                </h2>
              </div>
              {expandedSections.balanceSheet ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
            </div>
            
            {expandedSections.balanceSheet && (
              <div className="p-6 space-y-8">
                {/* Assets Section */}
                <div>
                  <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center">
                    <Building2 className="w-5 h-5 mr-2" />
                    Assets
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      {renderPeriodHeaders()}
                      <tbody className="divide-y divide-gray-100">
                        <tr>
                          <td className="py-3 px-4 font-medium text-gray-900">Total Assets</td>
                          {currentData.slice(0, inputData.numberOfPeriods).map(period => (
                            <td key={period.periodId} className="py-3 px-4">
                              {renderDataDisplay('', period.totalAssets || 0, true)}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-medium text-gray-900">Cash</td>
                          {currentData.slice(0, inputData.numberOfPeriods).map(period => (
                            <td key={period.periodId} className="py-3 px-4">
                              {renderDataDisplay('', period.cash || 0)}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-medium text-gray-900">Accounts Receivable</td>
                          {currentData.slice(0, inputData.numberOfPeriods).map(period => (
                            <td key={period.periodId} className="py-3 px-4">
                              {renderDataDisplay('', period.accountsReceivable || 0)}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-medium text-gray-900">Inventory</td>
                          {currentData.slice(0, inputData.numberOfPeriods).map(period => (
                            <td key={period.periodId} className="py-3 px-4">
                              {renderDataDisplay('', period.inventory || 0)}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-medium text-gray-900">Total Current Assets</td>
                          {currentData.slice(0, inputData.numberOfPeriods).map(period => (
                            <td key={period.periodId} className="py-3 px-4">
                              {renderDataDisplay('', period.totalCurrentAssets || 0)}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-medium text-gray-900">Fixed Assets</td>
                          {currentData.slice(0, inputData.numberOfPeriods).map(period => (
                            <td key={period.periodId} className="py-3 px-4">
                              {renderDataDisplay('', period.fixedAssets || 0)}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Liabilities Section */}
                <div>
                  <h3 className="text-lg font-semibold text-red-700 mb-4 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    Liabilities
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      {renderPeriodHeaders()}
                      <tbody className="divide-y divide-gray-100">
                        <tr>
                          <td className="py-3 px-4 font-medium text-gray-900">Current Liabilities</td>
                          {currentData.slice(0, inputData.numberOfPeriods).map(period => (
                            <td key={period.periodId} className="py-3 px-4">
                              {renderDataDisplay('', period.currentLiabilities || 0)}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-medium text-gray-900">Non-Current Liabilities</td>
                          {currentData.slice(0, inputData.numberOfPeriods).map(period => (
                            <td key={period.periodId} className="py-3 px-4">
                              {renderDataDisplay('', period.nonCurrentLiabilities || 0)}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-medium text-gray-900">Accounts Payable</td>
                          {currentData.slice(0, inputData.numberOfPeriods).map(period => (
                            <td key={period.periodId} className="py-3 px-4">
                              {renderDataDisplay('', period.accountsPayable || 0)}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Debt Funding Section */}
                <div>
                  <h3 className="text-lg font-semibold text-purple-700 mb-4 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Debt Funding
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      {renderPeriodHeaders()}
                      <tbody className="divide-y divide-gray-100">
                        <tr>
                          <td className="py-3 px-4 font-medium text-gray-900">Bank Loans - Current</td>
                          {currentData.slice(0, inputData.numberOfPeriods).map(period => (
                            <td key={period.periodId} className="py-3 px-4">
                              {renderDataDisplay('', period.bankLoansCurrent || 0)}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-medium text-gray-900">Bank Loans - Non Current</td>
                          {currentData.slice(0, inputData.numberOfPeriods).map(period => (
                            <td key={period.periodId} className="py-3 px-4">
                              {renderDataDisplay('', period.bankLoansNonCurrent || 0)}
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

        {/* Summary Footer */}
        <div className="mt-8 bg-oxford_blue-50 rounded-xl p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-oxford_blue-900 mb-2">
              {selectedBranchId === 'consolidated' 
                ? `Consolidated View${activeBranches.length > 1 ? ` (${activeBranches.length} branches)` : ''}` 
                : `${activeBranches.find(b => b.id === selectedBranchId)?.name} Branch`
              }
            </h3>
            <p className="text-sm text-oxford_blue-700">
              Showing {inputData.numberOfPeriods} {inputData.selectedPeriodType} periods • 
              {selectedBranchId === 'consolidated' 
                ? `Data consolidated from ${activeBranches.length} active branch${activeBranches.length !== 1 ? 'es' : ''}`
                : 'Individual branch data'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialsPage1;