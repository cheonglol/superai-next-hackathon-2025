/* eslint-disable */
// @ts-nocheck
import React, { useEffect } from "react";
import { Shield, RefreshCw, AlertTriangle, TrendingUp, TrendingDown, DollarSign, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { useAppDispatch, useAppSelector } from "@/store";
import { calculateLiquidityData, setAlertThreshold, toggleMonitoring, dismissAlert } from "@/store/slices/liquidityGuardianSlice";
import { loadFinancialData, calculateCashFlowMetrics } from "@/store/slices/cashFlowSlice";

const LiquidityGuardianPage: React.FC = () => {
  const dispatch = useAppDispatch();

  const { periods, currentPeriod } = useAppSelector((state) => state.cashFlow);
  const { metrics, loading, lastUpdated, dataSources, monitoringEnabled } = useAppSelector((state) => state.liquidityGuardian);

  // Local state for chart period selection
  const [selectedPeriod, setSelectedPeriod] = React.useState<"7-Day" | "14-Day" | "30-Day">("7-Day");

  // Generate chart data based on selected period
  const getChartData = () => {
    switch (selectedPeriod) {
      case "7-Day":
        return {
          dates: ["Jun 29", "Jun 30", "Jul 2", "Jul 4", "Jul 5"],
          path: "M 20 80 Q 60 60 100 70 Q 140 75 180 85 Q 220 90 260 95",
          points: [
            { x: 20, y: 80 },
            { x: 100, y: 70 },
            { x: 180, y: 85 },
            { x: 260, y: 95 },
          ],
        };
      case "14-Day":
        return {
          dates: ["Jun 22", "Jun 26", "Jun 30", "Jul 4", "Jul 8"],
          path: "M 20 90 Q 60 75 100 65 Q 140 70 180 80 Q 220 85 260 90",
          points: [
            { x: 20, y: 90 },
            { x: 100, y: 65 },
            { x: 180, y: 80 },
            { x: 260, y: 90 },
          ],
        };
      case "30-Day":
        return {
          dates: ["Jun 8", "Jun 15", "Jun 22", "Jun 29", "Jul 5"],
          path: "M 20 95 Q 60 85 100 75 Q 140 65 180 70 Q 220 75 260 85",
          points: [
            { x: 20, y: 95 },
            { x: 100, y: 75 },
            { x: 180, y: 70 },
            { x: 260, y: 85 },
          ],
        };
      default:
        return {
          dates: ["Jun 29", "Jun 30", "Jul 2", "Jul 4", "Jul 5"],
          path: "M 20 80 Q 60 60 100 70 Q 140 75 180 85 Q 220 90 260 95",
          points: [
            { x: 20, y: 80 },
            { x: 100, y: 70 },
            { x: 180, y: 85 },
            { x: 260, y: 95 },
          ],
        };
    }
  };

  const chartData = getChartData();

  // Initialize data
  useEffect(() => {
    if (periods.length === 0) {
      dispatch(loadFinancialData());
    }
  }, [dispatch, periods.length]);

  useEffect(() => {
    if (periods.length > 0) {
      dispatch(calculateCashFlowMetrics()).then(() => {
        dispatch(calculateLiquidityData());
      });
    }
  }, [dispatch, periods.length, currentPeriod]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading || !metrics) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <PageHeader title="Liquidity Guardian" description="Real-time liquidity monitoring and cash flow alerts" icon={<Shield className="w-8 h-8 text-oxford_blue-600" />} />
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading liquidity data...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <PageHeader title="Liquidity Guardian" description="Real-time liquidity monitoring and cash flow alerts" icon={<Shield className="w-8 h-8 text-oxford_blue-600" />} />

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => dispatch(calculateLiquidityData())}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh Data
              </button>
              <button
                onClick={() => dispatch(toggleMonitoring())}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  monitoringEnabled ? "bg-green-600 text-white hover:bg-green-700" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <Shield className="w-4 h-4" />
                {monitoringEnabled ? "Monitoring Active" : "Monitoring Paused"}
              </button>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleString() : "Never"}</span>
            </div>
          </div>
        </div>

        {/* Top Overview Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Total Cash */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-gray-600">Total Cash</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">$48,920</div>
            <div className="flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-green-600">+3.2% vs yesterday</span>
            </div>
          </div>

          {/* Safety Buffer */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center mb-2">
              <Shield className="w-5 h-5 text-purple-600 mr-2" />
              <span className="text-sm font-medium text-gray-600">Safety Buffer</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">$77,000</div>
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Buffer Months:</span>
                <span className="font-medium">1 month</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: "33%" }}></div>
              </div>
            </div>
            <div className="text-xs text-gray-500">1 month of expenses + loan payments</div>
          </div>

          {/* Next 7-Day Risk Status */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center mb-2">
              <AlertTriangle className="w-5 h-5 text-orange-600 mr-2" />
              <span className="text-sm font-medium text-gray-600">Next 7-Day Risk Status</span>
            </div>
            <div className="flex items-center mb-2">
              <AlertTriangle className="w-6 h-6 text-orange-500 mr-2" />
              <span className="text-2xl font-bold text-orange-600">2 Alerts</span>
            </div>
            <div className="text-sm text-gray-600">2 potential shortfalls</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          {/* Bank Balances */}
          <div className="lg:col-span-4 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Bank Balances</h3>
              <button className="text-blue-600 text-sm hover:text-blue-800 flex items-center">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <span className="font-medium text-gray-900 mr-3">DBS</span>
                  <div className="flex items-center text-sm">
                    <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-green-600">+1.5%</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">$28,400</div>
                  <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <span className="font-medium text-gray-900 mr-3">OCBC</span>
                  <div className="flex items-center text-sm">
                    <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                    <span className="text-red-600">-0.8%</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">$15,700</div>
                  <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <span className="font-medium text-gray-900 mr-3">UOB</span>
                  <div className="flex items-center text-sm">
                    <span className="text-blue-600">steady</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">$4,820</div>
                  <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">Today's Net</span>
                  <span className="font-bold text-green-600">+$1,200</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cash Flow Projection */}
          <div className="lg:col-span-5 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cash Flow Projection</h3>

            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setSelectedPeriod("7-Day")}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  selectedPeriod === "7-Day" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                7-Day
              </button>
              <button
                onClick={() => setSelectedPeriod("14-Day")}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  selectedPeriod === "14-Day" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                14-Day
              </button>
              <button
                onClick={() => setSelectedPeriod("30-Day")}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  selectedPeriod === "30-Day" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                30-Day
              </button>
            </div>

            <div className="h-64 bg-gray-50 rounded-lg p-4 mb-4 relative">
              {/* Chart Area */}
              <div className="w-full h-full relative pb-6">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 py-2 pr-2">
                  <span>$60k</span>
                  <span>$50k</span>
                  <span>$40k</span>
                  <span>$30k</span>
                  <span>$20k</span>
                </div>

                {/* Chart content */}
                <div className="ml-10 h-full relative pb-6">
                  {/* Grid lines */}
                  <div className="absolute inset-0 top-2 bottom-6">
                    <div className="h-full flex flex-col justify-between">
                      <div className="border-t border-gray-300 opacity-30"></div>
                      <div className="border-t border-gray-300 opacity-30"></div>
                      <div className="border-t border-gray-300 opacity-30"></div>
                      <div className="border-t border-gray-300 opacity-30"></div>
                      <div className="border-t border-gray-300 opacity-30"></div>
                    </div>
                  </div>

                  {/* Projected Balance Line */}
                  <svg className="absolute inset-0 top-2 bottom-6 w-full h-full" viewBox="0 0 300 180" preserveAspectRatio="none">
                    {/* Projected Balance (blue line) */}
                    <path d={chartData.path} stroke="#3B82F6" strokeWidth="3" fill="none" strokeDasharray="0" vectorEffect="non-scaling-stroke" />
                    {/* Safety Buffer (red line) */}
                    <path d="M 20 120 L 280 120" stroke="#EF4444" strokeWidth="2" fill="none" strokeDasharray="5,5" vectorEffect="non-scaling-stroke" />
                    {/* Data points */}
                    {chartData.points.map((point, index) => (
                      <circle key={index} cx={point.x} cy={point.y} r="4" fill="#3B82F6" vectorEffect="non-scaling-stroke" />
                    ))}
                  </svg>
                </div>

                {/* X-axis labels */}
                <div className="absolute bottom-2 left-10 right-4 flex justify-between text-xs text-gray-500">
                  {chartData.dates.map((date, index) => (
                    <span key={index}>{date}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Projected Balance</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Safety Buffer</span>
              </div>
            </div>
          </div>

          {/* Liquidity Alerts */}
          <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Liquidity Alerts (2)</h3>
              <AlertTriangle className="w-5 h-5 text-orange-500" />
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                  <div className="flex-1">
                    <div className="font-medium text-red-800">July 3</div>
                    <div className="text-sm text-red-600">89% likelihood</div>
                  </div>
                </div>
                <div className="text-sm text-red-700 mb-2">
                  Projected: $12,400
                  <br />
                  (-$2,600 below buffer)
                </div>
                <div className="text-xs text-red-600 mb-2">High impact: Vendor payment</div>
                <button className="w-full py-1 px-2 bg-white border border-red-300 rounded text-xs text-red-700 hover:bg-red-50">View Action Plan →</button>
              </div>

              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="w-4 h-4 text-orange-600 mr-2" />
                  <div className="flex-1">
                    <div className="font-medium text-orange-800">July 5</div>
                    <div className="text-sm text-orange-600">76% likelihood</div>
                  </div>
                </div>
                <div className="text-sm text-orange-700 mb-2">
                  Projected: $14,100
                  <br />
                  (-$900 below buffer)
                </div>
                <div className="text-xs text-orange-600 mb-2">Medium impact: Payroll</div>
                <button className="w-full py-1 px-2 bg-white border border-orange-300 rounded text-xs text-orange-700 hover:bg-orange-50">View Action Plan →</button>
              </div>
            </div>
          </div>
        </div>

        {/* Data Sources */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">Data sources: {dataSources.join(", ")}</p>
        </div>
      </div>
    </div>
  );
};

export default LiquidityGuardianPage;
