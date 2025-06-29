import React, { useState, useMemo } from "react";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Calendar,
  Target,
  Zap,
  BarChart3,
  ArrowRight,
  RefreshCw,
  Settings,
  ExternalLink,
  Plus,
} from "lucide-react";

interface LiquidityGuardianProps {
  mockFinancialData?: {
    totalLiquidity: number;
    safetyBuffer: number;
    bankBalances: {
      name: string;
      balance: number;
      change: number;
      trend: "up" | "down" | "stable";
    }[];
    todayNetChange: number;
    alerts: {
      date: string;
      projectedBalance: number;
      bufferDifference: number;
      reason: string;
      likelihood: number;
    }[];
    predictionConfidence: number;
    predictionVariance: number;
    lastUpdated: string;
    dataSources: string[];
  };
}

const LiquidityGuardian: React.FC<LiquidityGuardianProps> = ({ mockFinancialData }) => {
  const [isConnected, setIsConnected] = useState(true);
  const [showBufferSettings, setShowBufferSettings] = useState(false);
  const [timeHorizon, setTimeHorizon] = useState<7 | 14 | 30>(7);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Monthly expenses and loan installment
  const monthlyExpenses = 70000; // Estimated monthly expenses
  const monthlyLoanInstallment = 7000; // Estimated monthly loan installment (10% of expenses)

  // Safety buffer state - default is 1 month of expenses + 1 month of loan installments
  const [safetyBufferMonths, setSafetyBufferMonths] = useState(1);

  // Calculate safety buffer based on months
  const calculateSafetyBuffer = (months: number) => {
    return (monthlyExpenses + monthlyLoanInstallment) * months;
  };

  const [safetyBuffer, setSafetyBuffer] = useState(calculateSafetyBuffer(1));

  // Default data if not provided
  const data = mockFinancialData || {
    totalLiquidity: 48920,
    safetyBuffer: 77000, // Updated to 1 month expenses + 1 month loan installment
    bankBalances: [
      { name: "DBS", balance: 28400, change: 1.5, trend: "up" as const },
      { name: "OCBC", balance: 15700, change: -0.8, trend: "down" as const },
      { name: "UOB", balance: 4820, change: 0, trend: "stable" as const },
    ],
    todayNetChange: 1200,
    alerts: [
      {
        date: "July 3",
        projectedBalance: 12400,
        bufferDifference: -64600, // Updated based on new safety buffer
        reason: "Vendor payment",
        likelihood: 89,
      },
      {
        date: "July 5",
        projectedBalance: 14100,
        bufferDifference: -62900, // Updated based on new safety buffer
        reason: "Payroll processing day",
        likelihood: 76,
      },
    ],
    predictionConfidence: 97.3,
    predictionVariance: 2.1,
    lastUpdated: "Today 08:45",
    dataSources: ["Xero", "Bank feeds"],
  };

  // --- Type for cash flow events ---
  interface CashFlowEvent {
    date: Date;
    amount: number;
    description?: string;
  }

  // Example deterministic cash flow events (replace with Redux/CSV data in future)
  const cashFlowEvents: CashFlowEvent[] = [
    { date: new Date(), amount: +1200, description: "Customer payment" },
    { date: new Date(Date.now() + 2 * 86400000), amount: -8000, description: "Vendor payment" },
    { date: new Date(Date.now() + 4 * 86400000), amount: -15000, description: "Payroll" },
    { date: new Date(Date.now() + 6 * 86400000), amount: +5000, description: "Loan drawdown" },
    // Add more events as needed
  ];

  // --- Robust projection calculation ---
  const projectionData = useMemo(() => {
    const arr = [];
    let currentBalance = data.totalLiquidity;
    const startDate = new Date();
    for (let i = 0; i < timeHorizon; i++) {
      const dayDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i);
      // Aggregate all events for this day
      const dayNet = cashFlowEvents
        .filter((e) => e.date.getFullYear() === dayDate.getFullYear() && e.date.getMonth() === dayDate.getMonth() && e.date.getDate() === dayDate.getDate())
        .reduce((sum, e) => sum + e.amount, 0);
      currentBalance += dayNet;
      // Robust alert matching (by month and day string)
      const alertForDay = data.alerts.find((alert) => {
        const [alertMonth, alertDay] = alert.date.split(" ");
        return dayDate.toLocaleString("en-US", { month: "short" }) === alertMonth && dayDate.getDate() === parseInt(alertDay);
      });
      arr.push({
        day: i + 1,
        date: dayDate.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        balance: currentBalance,
        isAlert: !!alertForDay,
        bufferDifference: currentBalance - safetyBuffer,
        runningCash: currentBalance,
      });
    }
    // Fallback: if arr is empty, add a flat line
    if (arr.length === 0) {
      arr.push({
        day: 1,
        date: startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        balance: data.totalLiquidity,
        isAlert: false,
        bufferDifference: data.totalLiquidity - safetyBuffer,
        runningCash: data.totalLiquidity,
      });
    }
    return arr;
  }, [cashFlowEvents, data.totalLiquidity, data.alerts, safetyBuffer, timeHorizon]);

  // --- Y-axis scaling with margin for visual clarity ---
  const minBalance = Math.min(...projectionData.map((p) => p.balance), safetyBuffer);
  const maxBalance = Math.max(...projectionData.map((p) => p.balance), safetyBuffer);
  const yMargin = Math.max(1, (maxBalance - minBalance) * 0.05);
  const yMin = minBalance - yMargin;
  const yMax = maxBalance + yMargin;
  const yRange = yMax - yMin || 1;

  // --- SVG helpers to clamp and handle edge cases ---
  const getY = (balance: number) => {
    // Clamp to [yMin, yMax]
    const clamped = Math.max(yMin, Math.min(yMax, balance));
    return 100 - ((clamped - yMin) / yRange) * 100;
  };
  const getX = (i: number, total: number) => {
    if (total <= 1) return 0;
    return (i / (total - 1)) * 100;
  };

  // Simulate refresh data
  const refreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getTrendIcon = (trend: "up" | "down" | "stable", className: string = "w-4 h-4") => {
    switch (trend) {
      case "up":
        return <TrendingUp className={`${className} text-green-600`} />;
      case "down":
        return <TrendingDown className={`${className} text-red-600`} />;
      case "stable":
        return <Activity className={`${className} text-blue-600`} />;
    }
  };

  const getRiskStatus = () => {
    const alertsCount = data.alerts.length;
    if (alertsCount === 0) return { text: "All Clear", color: "text-green-600", bg: "bg-green-100" };
    if (alertsCount <= 2) return { text: `${alertsCount} Alerts`, color: "text-yellow-600", bg: "bg-yellow-100" };
    return { text: `${alertsCount} Alerts`, color: "text-red-600", bg: "bg-red-100" };
  };

  const riskStatus = getRiskStatus();

  // Update safety buffer when months change
  const updateSafetyBufferMonths = (months: number) => {
    setSafetyBufferMonths(months);

    // Calculate new safety buffer based on months
    const newBuffer = calculateSafetyBuffer(months);
    setSafetyBuffer(newBuffer);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg mr-3">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Liquidity Guardian</h2>
              <p className="text-sm text-gray-600">Real-time cash flow monitoring and alerts</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setIsConnected(!isConnected)}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${isConnected ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
            >
              {isConnected ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Connected
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Connect Accounts
                </>
              )}
            </button>

            <button
              onClick={refreshData}
              disabled={isRefreshing}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh Data
            </button>
          </div>
        </div>
      </div>

      {/* Current Liquidity Snapshot */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-2">
            <DollarSign className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="font-semibold text-gray-900">Total Cash</h3>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{formatCurrency(data.totalLiquidity)}</div>
          <div className="flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            +3.2% vs yesterday
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Target className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Safety Buffer</h3>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{formatCurrency(safetyBuffer)}</div>

          {/* Integrated safety buffer slider */}
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-600">Buffer Months:</span>
              <span className="text-xs font-medium text-gray-900">
                {safetyBufferMonths} month{safetyBufferMonths > 1 ? "s" : ""}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="3"
              step="1"
              value={safetyBufferMonths}
              onChange={(e) => updateSafetyBufferMonths(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-1">
              {safetyBufferMonths} month{safetyBufferMonths > 1 ? "s" : ""} of expenses + loan payments
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
            <h3 className="font-semibold text-gray-900">Next 7-Day Risk Status</h3>
          </div>
          <div className={`text-3xl font-bold ${riskStatus.color} mb-1 flex items-center`}>
            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${riskStatus.bg} mr-2`}>{data.alerts.length > 0 ? "⚠️" : "✓"}</span>
            {riskStatus.text}
          </div>
          <div className="text-sm text-gray-600">{data.alerts.length === 0 ? "No liquidity issues detected" : `${data.alerts.length} potential shortfalls`}</div>
        </div>
      </div>

      {/* Main Content - 3 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Bank Balance Aggregator */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Bank Balances</h3>
              <button className="text-xs text-blue-600 hover:text-blue-800 flex items-center">
                View All <ArrowRight className="w-3 h-3 ml-1" />
              </button>
            </div>

            <div className="space-y-4">
              {data.bankBalances.map((bank, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium text-gray-900">{bank.name}</div>
                  <div className="flex items-center">
                    <div className="text-right mr-3">
                      <div className="font-bold text-gray-900">{formatCurrency(bank.balance)}</div>
                      <div className="flex items-center text-xs">
                        {getTrendIcon(bank.trend, "w-3 h-3")}
                        <span className={`ml-1 ${bank.trend === "up" ? "text-green-600" : bank.trend === "down" ? "text-red-600" : "text-blue-600"}`}>
                          {bank.change === 0 ? "steady" : `${bank.change > 0 ? "+" : ""}${bank.change}%`}
                        </span>
                      </div>
                    </div>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-gray-900">Today's Net</div>
                  <div className={`font-bold ${data.todayNetChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {data.todayNetChange >= 0 ? "+" : ""}
                    {formatCurrency(data.todayNetChange)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cash Flow Projection Hub */}
        <div className="lg:col-span-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Cash Flow Projection</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setTimeHorizon(7)}
                  className={`px-3 py-1 text-xs font-medium rounded-lg ${timeHorizon === 7 ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
                >
                  7-Day
                </button>
                <button
                  onClick={() => setTimeHorizon(14)}
                  className={`px-3 py-1 text-xs font-medium rounded-lg ${timeHorizon === 14 ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
                >
                  14-Day
                </button>
                <button
                  onClick={() => setTimeHorizon(30)}
                  className={`px-3 py-1 text-xs font-medium rounded-lg ${timeHorizon === 30 ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
                >
                  30-Day
                </button>
              </div>
            </div>

            {/* Interactive Chart */}
            <div className="h-64 relative mb-4">
              {/* Chart Background */}
              <div className="absolute inset-0 flex flex-col">
                <div className="flex-1 border-b border-gray-200"></div>
                <div className="flex-1 border-b border-gray-200"></div>
                <div className="flex-1 border-b border-gray-200"></div>
                <div className="flex-1"></div>
              </div>

              {/* Projection Line */}
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(59, 130, 246, 0.5)" />
                    <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
                  </linearGradient>
                </defs>
                {/* Area under the line */}
                <path
                  d={
                    projectionData.length > 1
                      ? `
                    M0,${getY(projectionData[0].balance)}
                    ${projectionData.map((point, i) => `L${getX(i, projectionData.length)},${getY(point.balance)}`).join(" ")}
                    L100,${getY(projectionData[projectionData.length - 1].balance)}
                    L100,100 L0,100 Z
                  `
                      : `M0,${getY(projectionData[0].balance)} L100,${getY(projectionData[0].balance)} L100,100 L0,100 Z`
                  }
                  fill="url(#gradient)"
                />

                {/* Line */}
                <path
                  d={
                    projectionData.length > 1
                      ? `
                    M0,${getY(projectionData[0].balance)}
                    ${projectionData.map((point, i) => `L${getX(i, projectionData.length)},${getY(point.balance)}`).join(" ")}
                  `
                      : `M0,${getY(projectionData[0].balance)} L100,${getY(projectionData[0].balance)}`
                  }
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                />

                {/* Alert Points */}
                {projectionData.map(
                  (point, i) =>
                    point.isAlert && <circle key={i} cx={`${getX(i, projectionData.length)}%`} cy={`${getY(point.balance)}%`} r="4" fill="#ef4444" stroke="#fff" strokeWidth="1" />
                )}
              </svg>

              {/* Alert Markers */}
              {projectionData.map(
                (point, i) =>
                  point.isAlert && (
                    <div
                      key={i}
                      className="absolute"
                      style={{
                        left: `${getX(i, projectionData.length)}%`,
                        top: `${getY(point.balance)}%`,
                        transform: "translate(-50%, -100%)",
                      }}
                    >
                      <div className="bg-red-100 border border-red-200 rounded px-2 py-1 text-xs text-red-700 font-medium mt-2">❗ {point.date}</div>
                    </div>
                  )
              )}
            </div>

            {/* X-Axis Labels */}
            <div className="flex justify-between text-xs text-gray-500 px-2">
              {[0, Math.floor(timeHorizon / 4), Math.floor(timeHorizon / 2), Math.floor((3 * timeHorizon) / 4), timeHorizon - 1].map((index) => (
                <div key={index}>{projectionData[index]?.date}</div>
              ))}
            </div>

            {/* Y-Axis Labels */}
            <div className="flex justify-between mt-4">
              <div className="text-xs text-gray-500">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                  <span>Projected Balance</span>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                  <span>Safety Buffer</span>
                </div>
              </div>
            </div>

            {/* Cash Flow Visualization */}
            <div className="mt-6"></div>
          </div>
        </div>

        {/* Alert Console */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                Liquidity Alerts ({data.alerts.length})
              </h3>
            </div>

            {data.alerts.length > 0 ? (
              <div className="space-y-4">
                {data.alerts.map((alert, index) => (
                  <div key={index} className="bg-red-50 rounded-lg p-4 border border-red-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span className="text-red-600 mr-2">❗</span>
                        <span className="font-medium text-red-800">{alert.date}</span>
                      </div>
                      <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded-full">{alert.likelihood}% likelihood</span>
                    </div>

                    <div className="mb-2">
                      <div className="text-sm text-red-700">Projected: {formatCurrency(alert.projectedBalance)}</div>
                      <div className="text-sm text-red-700">({formatCurrency(alert.bufferDifference)} below buffer)</div>
                    </div>

                    <div className="text-xs text-red-700 mb-3">
                      <span className="font-medium">High impact:</span> {alert.reason}
                    </div>

                    <button className="w-full py-2 px-3 bg-white text-red-700 border border-red-300 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors flex items-center justify-center">
                      View Action Plan <ArrowRight className="w-3 h-3 ml-2" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-green-50 rounded-lg p-4 border border-green-200 text-center">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <h4 className="font-medium text-green-800 mb-1">All Clear</h4>
                <p className="text-sm text-green-700">No liquidity issues detected in the next {timeHorizon} days</p>
              </div>
            )}

            {/* Historical Alerts */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                View historical alerts <ArrowRight className="w-3 h-3 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiquidityGuardian;
