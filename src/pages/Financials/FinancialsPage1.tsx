import React, { useState } from "react";
import { DollarSign, Plus, Building2, Calendar, Save, Eye, EyeOff, Settings } from "lucide-react";
import { useFinancialsData } from "@/hooks/useFinancialsData";
import { useAppDispatch, useAppSelector } from "@/store";
import { setSelectedBranch, updatePeriodData, setPeriodType, setNumberOfPeriods, saveBranchData, saveConsolidatedData, addBranch } from "@/store/slices/financialsSlice";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import type { PeriodData, Branch } from "@/types/financials";

const FinancialsPage1: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data, loading, error, refetch } = useFinancialsData();
  const { selectedBranchId, saving } = useAppSelector((state) => state.financials);
  
  const [showAddBranch, setShowAddBranch] = useState(false);
  const [newBranchName, setNewBranchName] = useState("");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    profitLoss: true,
    balanceSheet: false,
  });

  const inputData = data?.inputData;
  const activeBranches = inputData?.branches.filter(b => b.isActive) || [];
  const currentData = selectedBranchId === 'consolidated' 
    ? inputData?.consolidatedData.periods || []
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

  const handleFieldChange = (periodId: string, field: string, value: string) => {
    const numericValue = parseFloat(value) || 0;
    dispatch(updatePeriodData({
      branchId: selectedBranchId,
      periodId,
      field,
      value: numericValue,
    }));
  };

  const handleDateChange = (periodId: string, value: string) => {
    dispatch(updatePeriodData({
      branchId: selectedBranchId,
      periodId,
      field: 'date',
      value: value,
    }));
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
        location: "", // Default empty location since it's not required
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

  const renderInputField = (
    period: PeriodData,
    field: keyof PeriodData,
    label: string,
    isRequired: boolean = false
  ) => (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-gray-700">
        {label} {isRequired && <span className="text-red-500">*</span>}
      </label>
      <input
        type="number"
        value={(period[field] as number) || ''}
        onChange={(e) => handleFieldChange(period.periodId, field, e.target.value)}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-prussian_blue-500 focus:border-transparent"
        placeholder="0"
      />
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
                <label className="block mb-1">Period Ending Date:</label>
                <input
                  type="text"
                  value={period.date || ''}
                  onChange={(e) => handleDateChange(period.periodId, e.target.value)}
                  placeholder="DD-MM-YYYY"
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-prussian_blue-500 focus:border-transparent text-center"
                />
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
          description="Input and manage financial data across all branches"
          icon={<DollarSign className="w-8 h-8 text-prussian_blue-600" />}
          actions={
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center px-4 py-2 bg-prussian_blue-600 text-white rounded-lg hover:bg-prussian_blue-700 transition-colors disabled:opacity-50"
            >
              {saving ? <LoadingSpinner size="sm" className="mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Save Data
            </button>
          }
        />

        {/* Configuration Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center mb-4">
            <Settings className="w-5 h-5 text-prussian_blue-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Configuration</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Period Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Period Type</label>
              <select
                value={inputData.selectedPeriodType}
                onChange={(e) => dispatch(setPeriodType(e.target.value as any))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-prussian_blue-500 focus:border-transparent"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-prussian_blue-500 focus:border-transparent"
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
                className="flex items-center px-3 py-2 bg-caribbean_current-600 text-white rounded-md hover:bg-caribbean_current-700 transition-colors"
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
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-prussian_blue-500 focus:border-transparent"
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
                  className="px-3 py-2 text-sm bg-prussian_blue-600 text-white rounded-md hover:bg-prussian_blue-700"
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
            <Building2 className="w-5 h-5 text-prussian_blue-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Select Branch/View</h2>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => dispatch(setSelectedBranch('consolidated'))}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedBranchId === 'consolidated'
                  ? 'bg-prussian_blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📊 Consolidated View
            </button>
            
            {activeBranches.map(branch => (
              <button
                key={branch.id}
                onClick={() => dispatch(setSelectedBranch(branch.id))}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedBranchId === branch.id
                    ? 'bg-prussian_blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🏢 {branch.name}
              </button>
            ))}
          </div>
        </div>

        {/* Data Input Tables */}
        <div className="space-y-6">
          {/* Profit & Loss Statement */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div 
              className="flex items-center justify-between p-6 cursor-pointer border-b border-gray-200"
              onClick={() => toggleSection('profitLoss')}
            >
              <div className="flex items-center">
                <DollarSign className="w-5 h-5 text-caribbean_current-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Profit & Loss Statement</h2>
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
                        <td className="py-3 px-4 font-medium text-gray-900">Revenue *</td>
                        {currentData.slice(0, inputData.numberOfPeriods).map(period => (
                          <td key={period.periodId} className="py-3 px-4">
                            {renderInputField(period, 'revenue', '', true)}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-medium text-gray-900">Gross Margin *</td>
                        {currentData.slice(0, inputData.numberOfPeriods).map(period => (
                          <td key={period.periodId} className="py-3 px-4">
                            {renderInputField(period, 'grossMargin', '', true)}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-medium text-gray-900">Net Profit (After Tax) *</td>
                        {currentData.slice(0, inputData.numberOfPeriods).map(period => (
                          <td key={period.periodId} className="py-3 px-4">
                            {renderInputField(period, 'netProfitAfterTax', '', true)}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-medium text-gray-900">Depreciation & Amortisation</td>
                        {currentData.slice(0, inputData.numberOfPeriods).map(period => (
                          <td key={period.periodId} className="py-3 px-4">
                            {renderInputField(period, 'depreciationAmortisation', '')}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-medium text-gray-900">Interest Paid</td>
                        {currentData.slice(0, inputData.numberOfPeriods).map(period => (
                          <td key={period.periodId} className="py-3 px-4">
                            {renderInputField(period, 'interestPaid', '')}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-medium text-gray-900">Tax</td>
                        {currentData.slice(0, inputData.numberOfPeriods).map(period => (
                          <td key={period.periodId} className="py-3 px-4">
                            {renderInputField(period, 'tax', '')}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-medium text-gray-900">Dividends</td>
                        {currentData.slice(0, inputData.numberOfPeriods).map(period => (
                          <td key={period.periodId} className="py-3 px-4">
                            {renderInputField(period, 'dividends', '')}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Balance Sheet - Combined */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div 
              className="flex items-center justify-between p-6 cursor-pointer border-b border-gray-200"
              onClick={() => toggleSection('balanceSheet')}
            >
              <div className="flex items-center">
                <Building2 className="w-5 h-5 text-charcoal-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Balance Sheet</h2>
              </div>
              {expandedSections.balanceSheet ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
            </div>
            
            {expandedSections.balanceSheet && (
              <div className="p-6 space-y-8">
                {/* Assets Section */}
                <div>
                  <h3 className="text-lg font-semibold text-charcoal-700 mb-4 flex items-center">
                    <Building2 className="w-5 h-5 mr-2" />
                    Assets
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      {renderPeriodHeaders()}
                      <tbody className="divide-y divide-gray-100">
                        <tr>
                          <td className="py-3 px-4 font-medium text-gray-900">Total Assets *</td>
                          {currentData.slice(0, inputData.numberOfPeriods).map(period => (
                            <td key={period.periodId} className="py-3 px-4">
                              {renderInputField(period, 'totalAssets', '', true)}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-medium text-gray-900">Cash</td>
                          {currentData.slice(0, inputData.numberOfPeriods).map(period => (
                            <td key={period.periodId} className="py-3 px-4">
                              {renderInputField(period, 'cash', '')}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-medium text-gray-900">Accounts Receivable</td>
                          {currentData.slice(0, inputData.numberOfPeriods).map(period => (
                            <td key={period.periodId} className="py-3 px-4">
                              {renderInputField(period, 'accountsReceivable', '')}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-medium text-gray-900">Inventory</td>
                          {currentData.slice(0, inputData.numberOfPeriods).map(period => (
                            <td key={period.periodId} className="py-3 px-4">
                              {renderInputField(period, 'inventory', '')}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-medium text-gray-900">Total Current Assets</td>
                          {currentData.slice(0, inputData.numberOfPeriods).map(period => (
                            <td key={period.periodId} className="py-3 px-4">
                              {renderInputField(period, 'totalCurrentAssets', '')}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-medium text-gray-900">Fixed Assets</td>
                          {currentData.slice(0, inputData.numberOfPeriods).map(period => (
                            <td key={period.periodId} className="py-3 px-4">
                              {renderInputField(period, 'fixedAssets', '')}
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
                    <Calendar className="w-5 h-5 mr-2" />
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
                              {renderInputField(period, 'currentLiabilities', '')}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-medium text-gray-900">Non-Current Liabilities</td>
                          {currentData.slice(0, inputData.numberOfPeriods).map(period => (
                            <td key={period.periodId} className="py-3 px-4">
                              {renderInputField(period, 'nonCurrentLiabilities', '')}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-medium text-gray-900">Accounts Payable</td>
                          {currentData.slice(0, inputData.numberOfPeriods).map(period => (
                            <td key={period.periodId} className="py-3 px-4">
                              {renderInputField(period, 'accountsPayable', '')}
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
                              {renderInputField(period, 'bankLoansCurrent', '')}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-medium text-gray-900">Bank Loans - Non Current</td>
                          {currentData.slice(0, inputData.numberOfPeriods).map(period => (
                            <td key={period.periodId} className="py-3 px-4">
                              {renderInputField(period, 'bankLoansNonCurrent', '')}
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
        <div className="mt-8 bg-prussian_blue-50 rounded-xl p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-prussian_blue-900 mb-2">
              {selectedBranchId === 'consolidated' ? 'Consolidated View' : `${activeBranches.find(b => b.id === selectedBranchId)?.name} Branch`}
            </h3>
            <p className="text-sm text-prussian_blue-700">
              Showing {inputData.numberOfPeriods} {inputData.selectedPeriodType} periods • 
              {currentData.filter(p => p.revenue > 0).length} periods with data
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialsPage1;