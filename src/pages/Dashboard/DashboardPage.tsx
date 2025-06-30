import { ErrorMessage } from "@/components/common/ErrorMessage";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { PageHeader } from "@/components/common/PageHeader";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchDashboardData } from "@/store/slices/dashboardSlice";
import { BarChart3, Activity, TrendingUp, Shield, Zap, AlertTriangle, CheckCircle, Clock, DollarSign, Users, ArrowUpRight, ArrowDownRight } from "lucide-react";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data: dashboardData, loading: dashboardLoading, error: dashboardError } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  const refetchDashboard = () => {
    dispatch(fetchDashboardData());
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Mock data for AI agents and financial metrics
  const agentStatus = [
    {
      id: "cash-flow",
      name: "Cash Flow Diagnostician",
      status: "active",
      lastUpdate: "2 min ago",
      icon: Activity,
      color: "text-green-600",
      bgColor: "bg-green-100",
      link: "/cash-flow-diagnostician",
      insights: "Cash flow healthy, 45 days runway",
    },
    {
      id: "scenario-stress",
      name: "Scenario Stress Tracker",
      status: "monitoring",
      lastUpdate: "5 min ago",
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      link: "/scenario-stress-tracker",
      insights: "3 scenarios analyzed, low risk detected",
    },
    {
      id: "liquidity-guardian",
      name: "Liquidity Guardian",
      status: "alert",
      lastUpdate: "1 min ago",
      icon: Shield,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      link: "/liquidity-guardian",
      insights: "Potential shortfall in 7 days",
    },
    {
      id: "receivables-autopilot",
      name: "Receivables Autopilot",
      status: "active",
      lastUpdate: "10 min ago",
      icon: Zap,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      link: "/receivables-autopilot",
      insights: "5 follow-ups sent, 2 payments received",
    },
  ];

  const financialMetrics = [
    {
      title: "Current Cash Balance",
      value: "$45,230",
      change: "+12.5%",
      isPositive: true,
      icon: DollarSign,
      description: "vs last month",
    },
    {
      title: "Monthly Cash Flow",
      value: "$8,450",
      change: "-5.2%",
      isPositive: false,
      icon: TrendingUp,
      description: "net inflow",
    },
    {
      title: "Outstanding Receivables",
      value: "$23,100",
      change: "+8.1%",
      isPositive: false,
      icon: Clock,
      description: "avg 32 days",
    },
    {
      title: "Active Customers",
      value: "127",
      change: "+15.3%",
      isPositive: true,
      icon: Users,
      description: "paying customers",
    },
  ];

  const recentAlerts = [
    {
      id: "1",
      type: "warning",
      title: "Liquidity Alert",
      message: "Cash balance may drop below $10,000 in 7 days",
      time: "2 min ago",
      agent: "Liquidity Guardian",
    },
    {
      id: "2",
      type: "success",
      title: "Payment Received",
      message: "Invoice #INV-2024-0156 paid ($2,450)",
      time: "15 min ago",
      agent: "Receivables Autopilot",
    },
    {
      id: "3",
      type: "info",
      title: "Cash Flow Analysis",
      message: "Monthly cash flow pattern shows seasonal trend",
      time: "1 hour ago",
      agent: "Cash Flow Diagnostician",
    },
  ];

  if (dashboardLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (dashboardError) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <ErrorMessage message={dashboardError} onRetry={refetchDashboard} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <PageHeader 
          title="SME Financial Command Center" 
          description="AI-powered financial management and cash flow optimization for your business"
          icon={<BarChart3 className="w-8 h-8 text-gray-700" />} 
        />

        {/* Financial Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {financialMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-gray-600">
                    <div className="p-3 bg-gray-100 rounded-lg mr-3">
                      <Icon className="w-5 h-5 text-gray-700" />
                    </div>
                    <span className="text-sm font-medium">{metric.title}</span>
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">{metric.value}</div>
                    <p className="text-sm text-gray-600">{metric.description}</p>
                  </div>
                  <div className={`flex items-center text-sm font-medium px-3 py-1 rounded-full ${
                    metric.isPositive ? "text-emerald-800 bg-emerald-100" : "text-red-800 bg-red-100"
                  }`}>
                    {metric.isPositive ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                    {metric.change}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* AI Agents Status */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="p-3 bg-caribbean_current-100 rounded-lg mr-3">
                <BarChart3 className="w-6 h-6 text-caribbean_current-700" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">AI Financial Agents</h2>
                <p className="text-sm text-gray-600">Autonomous agents monitoring and optimizing your financial operations</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">All systems operational</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {agentStatus.map((agent) => {
              const Icon = agent.icon;
              return (
                <Link
                  key={agent.id}
                  to={agent.link}
                  className="block p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-200 hover:border-caribbean_current-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 ${agent.bgColor} rounded-lg`}>
                      <Icon className={`w-6 h-6 ${agent.color}`} />
                    </div>
                    <div className={`px-2 py-1 text-xs rounded-full ${
                      agent.status === 'active' ? 'bg-green-100 text-green-800' :
                      agent.status === 'alert' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {agent.status}
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{agent.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{agent.insights}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Updated {agent.lastUpdate}</span>
                    <ArrowUpRight className="w-4 h-4 text-gray-400" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Alerts & Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Alerts */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-red-100 rounded-lg mr-3">
                <AlertTriangle className="w-5 h-5 text-red-700" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Recent Alerts</h2>
            </div>
            <div className="space-y-4">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-full ${
                    alert.type === 'warning' ? 'bg-yellow-100' :
                    alert.type === 'success' ? 'bg-green-100' :
                    'bg-blue-100'
                  }`}>
                    {alert.type === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-600" />}
                    {alert.type === 'success' && <CheckCircle className="w-4 h-4 text-green-600" />}
                    {alert.type === 'info' && <BarChart3 className="w-4 h-4 text-blue-600" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900">{alert.title}</h4>
                      <span className="text-xs text-gray-500">{alert.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{alert.message}</p>
                    <span className="text-xs text-caribbean_current-600 font-medium">{alert.agent}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-blue-100 rounded-lg mr-3">
                <Zap className="w-5 h-5 text-blue-700" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="space-y-3">
              <button className="w-full text-left p-4 bg-gradient-to-r from-caribbean_current-50 to-blue-50 rounded-lg border border-caribbean_current-200 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Run Cash Flow Forecast</h4>
                    <p className="text-sm text-gray-600">Generate 90-day cash flow projection</p>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-caribbean_current-600" />
                </div>
              </button>
              
              <button className="w-full text-left p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Send Payment Reminders</h4>
                    <p className="text-sm text-gray-600">Automated follow-up for overdue invoices</p>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-purple-600" />
                </div>
              </button>
              
              <button className="w-full text-left p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Stress Test Scenarios</h4>
                    <p className="text-sm text-gray-600">Model impact of delayed payments</p>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-yellow-600" />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg mr-3">
                <CheckCircle className="w-5 h-5 text-green-700" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
                <p className="text-sm text-gray-600">All AI agents operational • Last sync: 2 minutes ago</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Next automated analysis</div>
              <div className="text-lg font-semibold text-gray-900">in 28 minutes</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;