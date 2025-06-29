/* eslint-disable */
// @ts-nocheck
import React, { useState, useMemo } from "react";
import { TrendingUp, AlertTriangle, DollarSign, Wallet, Clock, ChevronRight } from "lucide-react";

interface LiquidityGuardianProps {
  selectedPeriod: "7-day" | "14-day" | "30-day";
  onPeriodChange: (period: "7-day" | "14-day" | "30-day") => void;
}

const LiquidityGuardian: React.FC<LiquidityGuardianProps> = ({ selectedPeriod, onPeriodChange }) => {
  // Mock data for demonstration
  const mockBankBalances = [
    { bank: "DBS", balance: 28400, change: 1.5 },
    { bank: "OCBC", balance: 15700, change: -0.8 },
    { bank: "UOB", balance: 4820, change: 0 },
  ];

  const mockAlerts = [
    {
      id: 1,
      date: "July 3",
      likelihood: 89,
      shortfall: 12500,
      severity: "high" as const,
      description: "Major supplier payment due",
    },
    {
      id: 2,
      date: "July 5",
      likelihood: 76,
      shortfall: 8200,
      severity: "medium" as const,
      description: "Payroll processing",
    },
  ];

  const cashFlowEvents = useMemo(() => {
    const baseEvents = [
      { date: "2024-01-01", inflow: 45000, outflow: 32000 },
      { date: "2024-01-02", inflow: 28000, outflow: 41000 },
      { date: "2024-01-03", inflow: 52000, outflow: 29000 },
      { date: "2024-01-04", inflow: 31000, outflow: 38000 },
      { date: "2024-01-05", inflow: 47000, outflow: 35000 },
      { date: "2024-01-06", inflow: 39000, outflow: 44000 },
      { date: "2024-01-07", inflow: 55000, outflow: 31000 },
    ];

    if (selectedPeriod === "14-day") {
      return [
        ...baseEvents,
        ...baseEvents.map((event, index) => ({
          ...event,
          date: `2024-01-${8 + index}`,
          inflow: event.inflow * 0.9,
          outflow: event.outflow * 1.1,
        })),
      ];
    } else if (selectedPeriod === "30-day") {
      const extended = [];
      for (let i = 0; i < 30; i++) {
        const baseIndex = i % baseEvents.length;
        const base = baseEvents[baseIndex];
        extended.push({
          ...base,
          date: `2024-01-${i + 1}`,
          inflow: base.inflow * (0.8 + Math.random() * 0.4),
          outflow: base.outflow * (0.8 + Math.random() * 0.4),
        });
      }
      return extended;
    }

    return baseEvents;
  }, [selectedPeriod]);

  const getChartData = () => {
    const events = cashFlowEvents;
    const maxValue = Math.max(...events.map((e) => Math.max(e.inflow, e.outflow)));
    const minValue = Math.min(...events.map((e) => Math.min(e.inflow, e.outflow)));
    const range = maxValue - minValue;

    const chartHeight = 150;
    const chartWidth = 280;

    const inflowPath = events
      .map((event, index) => {
        const x = (index / (events.length - 1)) * chartWidth;
        const y = chartHeight - ((event.inflow - minValue) / range) * chartHeight;
        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");

    const outflowPath = events
      .map((event, index) => {
        const x = (index / (events.length - 1)) * chartWidth;
        const y = chartHeight - ((event.outflow - minValue) / range) * chartHeight;
        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");

    return { inflowPath, outflowPath, events, maxValue, minValue };
  };

  const chartData = getChartData();

  const totalCash = mockBankBalances.reduce((sum, bank) => sum + bank.balance, 0);
  const todaysNet = 1200;
  const safetyBuffer = 77000;
  const safetyBufferPercentage = Math.min((totalCash / safetyBuffer) * 100, 100);

  return (
    <div className="space-y-6">
      {/* Top Row - 3 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Cash */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Cash</p>
              <p className="text-2xl font-bold text-gray-900">${totalCash.toLocaleString()}</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                +3.2% vs yesterday
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Safety Buffer */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Safety Buffer</p>
              <p className="text-2xl font-bold text-gray-900">${safetyBuffer.toLocaleString()}</p>
              <p className="text-sm text-gray-500">1 month coverage</p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <Wallet className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full transition-all duration-300" style={{ width: `${safetyBufferPercentage}%` }}></div>
          </div>
        </div>

        {/* Next 7-Day Risk Status */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Next 7-Day Risk Status</p>
              <p className="text-2xl font-bold text-red-600">{mockAlerts.length} Alerts</p>
              <p className="text-sm text-gray-500">{mockAlerts.length} potential shortfalls</p>
            </div>
            <div className="p-3 bg-red-50 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid - 3 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bank Balances */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Bank Balances</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
          </div>

          <div className="space-y-4">
            {mockBankBalances.map((bank, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-xs font-medium text-blue-600">{bank.bank[0]}</span>
                  </div>
                  <span className="font-medium text-gray-900">{bank.bank}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${bank.balance.toLocaleString()}</p>
                  <p className={`text-xs ${bank.change > 0 ? "text-green-600" : bank.change < 0 ? "text-red-600" : "text-gray-500"}`}>
                    {bank.change > 0 ? "+" : ""}
                    {bank.change}%
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Today's Net</span>
              <span className="text-sm font-semibold text-green-600">+${todaysNet.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Cash Flow Projection */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Cash Flow Projection</h3>
            <div className="flex space-x-1">
              {(["7-day", "14-day", "30-day"] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => onPeriodChange(period)}
                  className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                    selectedPeriod === period ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64">
            <svg width="100%" height="100%" viewBox="0 0 300 180" className="overflow-visible" preserveAspectRatio="none">
              {/* Grid lines */}
              <defs>
                <pattern id="grid" width="30" height="18" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 18" fill="none" stroke="#f3f4f6" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="280" height="150" fill="url(#grid)" />

              {/* Y-axis labels */}
              <text x="5" y="15" className="text-xs fill-gray-500">
                ${Math.round(chartData.maxValue / 1000)}k
              </text>
              <text x="5" y="80" className="text-xs fill-gray-500">
                ${Math.round((chartData.maxValue + chartData.minValue) / 2000)}k
              </text>
              <text x="5" y="145" className="text-xs fill-gray-500">
                ${Math.round(chartData.minValue / 1000)}k
              </text>

              {/* Safety Buffer line */}
              <line x1="20" y1="100" x2="280" y2="100" stroke="#fbbf24" strokeWidth="2" strokeDasharray="5,5" />
              <text x="285" y="105" className="text-xs fill-amber-500">
                Safety Buffer
              </text>

              {/* Chart lines */}
              <g transform="translate(20, 15)">
                <path d={chartData.inflowPath} fill="none" stroke="#10b981" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                <path d={chartData.outflowPath} fill="none" stroke="#ef4444" strokeWidth="2" vectorEffect="non-scaling-stroke" />

                {/* Data points */}
                {chartData.events.map((event, index) => {
                  const x = (index / (chartData.events.length - 1)) * 260;
                  const inflowY = 135 - ((event.inflow - chartData.minValue) / (chartData.maxValue - chartData.minValue)) * 135;
                  const outflowY = 135 - ((event.outflow - chartData.minValue) / (chartData.maxValue - chartData.minValue)) * 135;

                  return (
                    <g key={index}>
                      <circle cx={x} cy={inflowY} r="4" fill="#10b981" />
                      <circle cx={x} cy={outflowY} r="4" fill="#ef4444" />
                    </g>
                  );
                })}
              </g>

              {/* X-axis labels */}
              <text x="25" y="175" className="text-xs fill-gray-500">
                {selectedPeriod === "7-day" ? "Jan 1" : selectedPeriod === "14-day" ? "Week 1" : "Month 1"}
              </text>
              <text x="150" y="175" className="text-xs fill-gray-500">
                {selectedPeriod === "7-day" ? "Jan 4" : selectedPeriod === "14-day" ? "Week 2" : "Month 2"}
              </text>
              <text x="260" y="175" className="text-xs fill-gray-500">
                {selectedPeriod === "7-day" ? "Jan 7" : selectedPeriod === "14-day" ? "Week 3" : "Month 3"}
              </text>
            </svg>
          </div>

          <div className="flex items-center justify-center space-x-6 mt-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Inflow</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Outflow</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-0.5 bg-amber-500 mr-2"></div>
              <span className="text-sm text-gray-600">Safety Buffer</span>
            </div>
          </div>
        </div>

        {/* Liquidity Alerts */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Liquidity Alerts</h3>
            <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{mockAlerts.length} Active</span>
          </div>

          <div className="space-y-4">
            {mockAlerts.map((alert) => (
              <div key={alert.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="font-medium text-gray-900">{alert.date}</span>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      alert.severity === "high" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {alert.likelihood}% likelihood
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-3">{alert.description}</p>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">Potential shortfall: ${alert.shortfall.toLocaleString()}</span>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                    Action Plan
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiquidityGuardian;
