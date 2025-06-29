import React, { useState } from "react";
import { 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle,
  DollarSign,
  Calendar,
  Target,
  Users,
  BarChart3,
  ArrowRight,
  RefreshCw,
  Settings,
  ExternalLink,
  Plus,
  Mail,
  MessageSquare,
  Clock,
  Search,
  Filter,
  ChevronDown
} from "lucide-react";

interface ReceivablesAutopilotProps {
  mockFinancialData?: {
    totalOutstanding: number;
    overdueAmount: number;
    avgDaysLate: number;
    collectionsRisk: number;
    invoices: {
      id: string;
      customer: string;
      amount: number;
      dueDate: string;
      status: 'on-time' | 'due-today' | 'overdue' | 'collections';
      daysLate?: number;
      payProbability?: number;
      riskOfDelay?: number;
    }[];
    customerHealthScores: {
      customer: string;
      score: number;
      insight: string;
    }[];
    trendAlerts: {
      trend: string;
      value: string;
    }[];
    optimizationTips: {
      tip: string;
    }[];
  };
}

const ReceivablesAutopilot: React.FC<ReceivablesAutopilotProps> = ({ mockFinancialData }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'due-today' | 'overdue' | 'critical'>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'friendly' | 'formal' | 'urgent'>('friendly');
  const [messageChannel, setMessageChannel] = useState<'email' | 'sms'>('email');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Default data if not provided
  const data = mockFinancialData || {
    totalOutstanding: 42560,
    overdueAmount: 18200,
    avgDaysLate: 12,
    collectionsRisk: 8,
    invoices: [
      {
        id: "INV-001",
        customer: "Ray's Hardware",
        amount: 2500,
        dueDate: "5 days ago",
        status: 'overdue',
        daysLate: 5,
        payProbability: 92
      },
      {
        id: "INV-002",
        customer: "Bloom Café",
        amount: 1200,
        dueDate: "Today",
        status: 'due-today',
        payProbability: 88,
        riskOfDelay: 35
      },
      {
        id: "INV-003",
        customer: "TechGadgets",
        amount: 4800,
        dueDate: "47 days ago",
        status: 'collections',
        daysLate: 47,
        payProbability: 68
      },
      {
        id: "INV-004",
        customer: "Green Grocers",
        amount: 850,
        dueDate: "Tomorrow",
        status: 'on-time',
        payProbability: 95
      },
      {
        id: "INV-005",
        customer: "City Fitness",
        amount: 3200,
        dueDate: "12 days ago",
        status: 'overdue',
        daysLate: 12,
        payProbability: 78
      },
      {
        id: "INV-006",
        customer: "Lakeside Spa",
        amount: 1750,
        dueDate: "3 days ago",
        status: 'overdue',
        daysLate: 3,
        payProbability: 89
      }
    ],
    customerHealthScores: [
      {
        customer: "Ray's Hardware",
        score: 76,
        insight: "Prompt payer, 5% delay risk next invoice"
      },
      {
        customer: "Bloom Café",
        score: 65,
        insight: "Increasing delay probability"
      },
      {
        customer: "TechGadgets",
        score: 42,
        insight: "Consistent late payments, needs attention"
      }
    ],
    trendAlerts: [
      {
        trend: "Overdue invoices increased",
        value: "+22% vs. last month"
      },
      {
        trend: "Bloom Café delay probability",
        value: "Rising trend detected"
      }
    ],
    optimizationTips: [
      {
        tip: "Offer 2% discount for Bloom Café early payments"
      },
      {
        tip: "Send reminders 3 days before due date to improve on-time payments"
      }
    ]
  };

  // Filter invoices based on active filter
  const filteredInvoices = data.invoices.filter(invoice => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'due-today') return invoice.status === 'due-today';
    if (activeFilter === 'overdue') return invoice.status === 'overdue';
    if (activeFilter === 'critical') return invoice.status === 'collections';
    return true;
  });

  // Get counts for each filter
  const getCounts = () => {
    const all = data.invoices.length;
    const dueToday = data.invoices.filter(inv => inv.status === 'due-today').length;
    const overdue = data.invoices.filter(inv => inv.status === 'overdue').length;
    const critical = data.invoices.filter(inv => inv.status === 'collections').length;
    
    return { all, dueToday, overdue, critical };
  };
  
  const counts = getCounts();

  // Simulate refresh data
  const refreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-time':
        return <div className="w-3 h-3 rounded-full bg-blue-500"></div>;
      case 'due-today':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'overdue':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'collections':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <div className="w-3 h-3 rounded-full bg-gray-500"></div>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'on-time':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">On Time</span>;
      case 'due-today':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Due Today</span>;
      case 'overdue':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">⚠️ Overdue</span>;
      case 'collections':
        return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">🚨 Collections</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Unknown</span>;
    }
  };

  // Generate automated message based on selected invoice and tone
  const generateMessage = () => {
    if (!selectedInvoice) return "";
    
    const invoice = data.invoices.find(inv => inv.id === selectedInvoice);
    if (!invoice) return "";
    
    switch (messageType) {
      case 'friendly':
        return `Hi ${invoice.customer.split(' ')[0]}, gentle reminder that invoice #${invoice.id} for ${formatCurrency(invoice.amount)} is ${invoice.status === 'overdue' ? `${invoice.daysLate} days overdue` : 'due today'}. Reply HELP for support.`;
      case 'formal':
        return `Dear ${invoice.customer}, this is a reminder that invoice #${invoice.id} for ${formatCurrency(invoice.amount)} ${invoice.status === 'overdue' ? `is now ${invoice.daysLate} days past due` : 'is due for payment today'}. Please process payment at your earliest convenience.`;
      case 'urgent':
        return `URGENT: ${invoice.customer}, invoice #${invoice.id} for ${formatCurrency(invoice.amount)} is ${invoice.daysLate} days overdue. Please remit payment immediately to avoid further action. Contact us ASAP if you need assistance.`;
      default:
        return "";
    }
  };

  // Check if human intervention is needed (15+ days overdue)
  const needsHumanIntervention = (invoice: any) => {
    return (invoice.status === 'overdue' && invoice.daysLate && invoice.daysLate >= 15) || 
           invoice.status === 'collections';
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg text-white p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex flex-col">
            <span className="text-blue-100 text-sm mb-1">Total Outstanding</span>
            <span className="text-2xl font-bold">{formatCurrency(data.totalOutstanding)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-blue-100 text-sm mb-1">Overdue (>30d)</span>
            <span className="text-2xl font-bold">{formatCurrency(data.overdueAmount)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-blue-100 text-sm mb-1">Avg. Days Late</span>
            <span className="text-2xl font-bold">{data.avgDaysLate}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-blue-100 text-sm mb-1">Collections Risk</span>
            <span className="text-2xl font-bold">{data.collectionsRisk}%</span>
          </div>
        </div>
      </div>
      
      {/* Main Content - 3 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Active Receivables Monitor - Takes 3 columns */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <DollarSign className="w-5 h-5 text-blue-600 mr-2" />
                Active Receivables
              </h3>
              <button 
                onClick={refreshData}
                disabled={isRefreshing}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
            
            {/* Smart Filter Bar */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({counts.all})
              </button>
              <button
                onClick={() => setActiveFilter('due-today')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === 'due-today' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Due Today ({counts.dueToday})
              </button>
              <button
                onClick={() => setActiveFilter('overdue')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === 'overdue' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Overdue ({counts.overdue})
              </button>
              <button
                onClick={() => setActiveFilter('critical')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === 'critical' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Critical (45+ Days) ({counts.critical})
              </button>
              
              <div className="ml-auto flex items-center gap-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search invoices..."
                    className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
            
            {/* Invoice List Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Customer</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Amount</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Due Date</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Prediction</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredInvoices.map((invoice) => (
                    <tr 
                      key={invoice.id} 
                      className={`hover:bg-gray-50 ${selectedInvoice === invoice.id ? 'bg-blue-50' : ''}`}
                      onClick={() => setSelectedInvoice(invoice.id)}
                    >
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">{invoice.customer}</div>
                        <div className="text-xs text-gray-500">#{invoice.id}</div>
                      </td>
                      <td className="py-3 px-4 text-center font-medium text-gray-900">
                        {formatCurrency(invoice.amount)}
                      </td>
                      <td className="py-3 px-4 text-center text-gray-700">
                        {invoice.dueDate}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {getStatusBadge(invoice.status)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {invoice.payProbability && (
                          <div className="text-xs text-green-700 bg-green-50 px-2 py-1 rounded-full inline-block">
                            {invoice.payProbability}% Pay Probability
                          </div>
                        )}
                        {invoice.riskOfDelay && (
                          <div className="text-xs text-yellow-700 bg-yellow-50 px-2 py-1 rounded-full inline-block mt-1">
                            {invoice.riskOfDelay}% Risk of Delay
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {needsHumanIntervention(invoice) ? (
                            <button className="px-3 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors">
                              Human Intervention
                            </button>
                          ) : (
                            <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors">
                              Send Reminder
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredInvoices.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-1">No invoices found</h4>
                <p className="text-gray-600">No invoices match your current filter criteria</p>
              </div>
            )}
          </div>
          
          {/* Dunning Assistant - Only show when an invoice is selected */}
          {selectedInvoice && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Mail className="w-5 h-5 text-purple-600 mr-2" />
                  Automated Reminders
                </h3>
                <div className="text-sm text-gray-600">
                  Invoice #{selectedInvoice}
                </div>
              </div>
              
              {/* Tone Selector */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setMessageType('friendly')}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium ${
                      messageType === 'friendly' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Friendly
                  </button>
                  <button
                    onClick={() => setMessageType('formal')}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium ${
                      messageType === 'formal' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Formal
                  </button>
                  <button
                    onClick={() => setMessageType('urgent')}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium ${
                      messageType === 'urgent' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Urgent
                  </button>
                </div>
              </div>
              
              {/* Auto-Generated Message */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Auto-Generated Message</label>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-gray-800">{generateMessage()}</p>
                </div>
              </div>
              
              {/* Channel Toggle */}
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">Channel</label>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setMessageChannel('email')}
                      className={`flex items-center ${messageChannel === 'email' ? 'text-blue-600' : 'text-gray-400'}`}
                    >
                      <Mail className="w-5 h-5 mr-1" />
                      <span className="text-sm">Email</span>
                    </button>
                    <button
                      onClick={() => setMessageChannel('sms')}
                      className={`flex items-center ${messageChannel === 'sms' ? 'text-blue-600' : 'text-gray-400'}`}
                    >
                      <MessageSquare className="w-5 h-5 mr-1" />
                      <span className="text-sm">SMS</span>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Send Options */}
              <div className="flex space-x-3">
                <button className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                  Send Now
                </button>
                <button className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center">
                  Schedule
                </button>
                <button className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center">
                  Save Template
                </button>
              </div>
            </div>
          )}
          
          {/* Collections Escalation Hub - Only show for critical invoices */}
          {selectedInvoice && data.invoices.find(inv => inv.id === selectedInvoice)?.status === 'collections' && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                  Collections Escalation
                </h3>
                <div className="text-sm text-gray-600">
                  45+ days overdue
                </div>
              </div>
              
              <div className="bg-red-50 rounded-lg p-4 border border-red-200 mb-6">
                <div className="flex items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="font-medium text-red-800">TechGadgets ($4,800)</span>
                    </div>
                    <div className="text-sm text-red-700 mb-2">Last contacted: 15 days ago</div>
                    <div className="text-sm text-red-700">Predicted recovery: 68% (AI model)</div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center">
                  🚨 Initiate Collections
                </button>
                <button className="flex-1 py-2 px-4 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center">
                  ✉️ Send Final Notice
                </button>
                <button className="flex-1 py-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center">
                  ⏸️ Pause Automation
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* AI Insights Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <Target className="w-5 h-5 text-purple-600 mr-2" />
                AI Insights
              </h3>
            </div>
            
            {/* Trend Alerts */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Trend Alerts</h4>
              {data.trendAlerts.map((alert, index) => (
                <div key={index} className="flex items-start mb-3 last:mb-0">
                  <TrendingUp className="w-4 h-4 text-red-600 mt-0.5 mr-2" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{alert.trend}</div>
                    <div className="text-xs text-gray-600">{alert.value}</div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Optimization Tips */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Optimization Tips</h4>
              {data.optimizationTips.map((tip, index) => (
                <div key={index} className="flex items-start mb-3 last:mb-0">
                  <div className="p-1 bg-blue-100 rounded-full mr-2">
                    <Zap className="w-3 h-3 text-blue-600" />
                  </div>
                  <p className="text-xs text-gray-700">{tip.tip}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 flex items-center mb-4">
              <Zap className="w-5 h-5 text-blue-600 mr-2" />
              Quick Actions
            </h3>
            
            <div className="space-y-3">
              <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm">
                <Mail className="w-4 h-4 mr-2" />
                Remind All Overdue
              </button>
              
              <button className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center text-sm">
                <BarChart3 className="w-4 h-4 mr-2" />
                Aging Report
              </button>
              
              <button className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center text-sm">
                <Settings className="w-4 h-4 mr-2" />
                Automation Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceivablesAutopilot;