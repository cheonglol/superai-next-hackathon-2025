import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Search, 
  Filter, 
  ArrowUpRight, 
  BarChart3, 
  Calendar, 
  FileText, 
  Mail, 
  Phone, 
  MessageSquare,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  AlertCircle,
  Zap
} from "lucide-react";

const ReceivablesManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"all" | "overdue" | "upcoming">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<"dueDate" | "amount" | "client">("dueDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for receivables
  const receivables = [
    {
      id: "1",
      invoiceNumber: "INV-2025-0078",
      client: "Linear Dots Production Pte Ltd",
      amount: 12500,
      issueDate: "2025-01-05",
      dueDate: "2025-02-05",
      status: "On Time",
      daysOverdue: 0,
      redFlag: "",
      contactName: "Sarah Chen",
      contactEmail: "sarah@lineardots.com",
      contactPhone: "+65 9123 4567",
      notes: "Regular client, always pays on time",
      lastContact: "2025-01-15",
      paymentHistory: [
        { date: "2024-12-05", amount: 8500, invoiceNumber: "INV-2024-0945" },
        { date: "2024-11-05", amount: 9200, invoiceNumber: "INV-2024-0876" },
      ],
    },
    {
      id: "2",
      invoiceNumber: "INV-2025-0123",
      client: "A&P Floral Creation",
      amount: 8750,
      issueDate: "2025-01-01",
      dueDate: "2025-01-31",
      status: "Overdue",
      daysOverdue: 5,
      redFlag: "Payment delay pattern",
      contactName: "Peter Lim",
      contactEmail: "peter@apfloral.com",
      contactPhone: "+65 8765 4321",
      notes: "Has requested payment extensions twice in the past",
      lastContact: "2025-01-28",
      paymentHistory: [
        { date: "2024-12-15", amount: 7500, invoiceNumber: "INV-2024-0912", daysLate: 10 },
        { date: "2024-11-15", amount: 6800, invoiceNumber: "INV-2024-0845", daysLate: 5 },
      ],
    },
    {
      id: "3",
      invoiceNumber: "INV-2025-0156",
      client: "Curators Collective Pte Ltd",
      amount: 15000,
      issueDate: "2024-12-15",
      dueDate: "2025-01-15",
      status: "Critical",
      daysOverdue: 21,
      redFlag: "Requires escalation",
      contactName: "Michelle Tan",
      contactEmail: "michelle@curatorscollective.com",
      contactPhone: "+65 9876 5432",
      notes: "No response to last two email reminders",
      lastContact: "2025-01-20",
      paymentHistory: [
        { date: "2024-11-30", amount: 12000, invoiceNumber: "INV-2024-0823", daysLate: 15 },
        { date: "2024-10-30", amount: 9500, invoiceNumber: "INV-2024-0756", daysLate: 8 },
      ],
    },
    {
      id: "4",
      invoiceNumber: "INV-2025-0189",
      client: "HoneySpree Pte Ltd",
      amount: 5250,
      issueDate: "2025-01-10",
      dueDate: "2025-02-10",
      status: "On Time",
      daysOverdue: 0,
      redFlag: "",
      contactName: "David Wong",
      contactEmail: "david@honeyspree.com",
      contactPhone: "+65 9234 5678",
      notes: "New client, first invoice",
      lastContact: "2025-01-25",
      paymentHistory: [],
    },
    {
      id: "5",
      invoiceNumber: "INV-2025-0201",
      client: "Quant Consulting Group Pte Ltd",
      amount: 22500,
      issueDate: "2024-12-20",
      dueDate: "2025-01-20",
      status: "Critical",
      daysOverdue: 16,
      redFlag: "Requires escalation",
      contactName: "Jessica Lee",
      contactEmail: "jessica@quantconsulting.com",
      contactPhone: "+65 8234 5678",
      notes: "Large account, unusual delay",
      lastContact: "2025-01-25",
      paymentHistory: [
        { date: "2024-11-20", amount: 18500, invoiceNumber: "INV-2024-0789" },
        { date: "2024-10-20", amount: 20000, invoiceNumber: "INV-2024-0712" },
      ],
    },
    {
      id: "6",
      invoiceNumber: "INV-2025-0215",
      client: "Whimsy Safari Pte Ltd",
      amount: 7800,
      issueDate: "2025-01-15",
      dueDate: "2025-02-15",
      status: "On Time",
      daysOverdue: 0,
      redFlag: "",
      contactName: "Michael Teo",
      contactEmail: "michael@whimsysafari.com",
      contactPhone: "+65 9345 6789",
      notes: "Consistent payment history",
      lastContact: "2025-01-20",
      paymentHistory: [
        { date: "2024-12-15", amount: 6500, invoiceNumber: "INV-2024-0867" },
        { date: "2024-11-15", amount: 7200, invoiceNumber: "INV-2024-0798" },
      ],
    },
  ];

  // AI insights based on receivables data
  const aiInsights = [
    {
      id: "1",
      type: "warning",
      title: "Payment Delay Pattern",
      description: "A&P Floral Creation has shown a pattern of delayed payments over the last 3 invoices.",
      recommendation: "Consider implementing a pre-payment policy or shorter payment terms for this client.",
    },
    {
      id: "2",
      type: "critical",
      title: "High-Value Overdue Invoice",
      description: "Quant Consulting Group has a large overdue invoice of $22,500 that requires immediate attention.",
      recommendation: "Escalate to management and consider a direct phone call to their finance department.",
    },
    {
      id: "3",
      type: "info",
      title: "Cash Flow Forecast",
      description: "Based on current receivables, expected cash inflow for next 30 days is approximately $44,300.",
      recommendation: "Plan expenditures accordingly to maintain healthy cash reserves.",
    },
  ];

  // Filter receivables based on active tab and search query
  const filteredReceivables = receivables.filter((receivable) => {
    // Filter by tab
    if (activeTab === "overdue" && receivable.daysOverdue <= 0) return false;
    if (activeTab === "upcoming" && receivable.daysOverdue > 0) return false;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        receivable.client.toLowerCase().includes(query) ||
        receivable.invoiceNumber.toLowerCase().includes(query) ||
        receivable.amount.toString().includes(query)
      );
    }

    return true;
  });

  // Sort receivables
  const sortedReceivables = [...filteredReceivables].sort((a, b) => {
    if (sortField === "dueDate") {
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    } else if (sortField === "amount") {
      return sortDirection === "asc" ? a.amount - b.amount : b.amount - a.amount;
    } else {
      return sortDirection === "asc"
        ? a.client.localeCompare(b.client)
        : b.client.localeCompare(a.client);
    }
  });

  // Get selected invoice details
  const selectedInvoiceDetails = receivables.find((r) => r.id === selectedInvoice);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-SG", {
      style: "currency",
      currency: "SGD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-SG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "On Time":
        return "bg-green-100 text-green-800";
      case "Overdue":
        return "bg-amber-100 text-amber-800";
      case "Critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "On Time":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "Overdue":
        return <Clock className="w-4 h-4 text-amber-600" />;
      case "Critical":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  // Handle sort
  const handleSort = (field: "dueDate" | "amount" | "client") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Simulate loading data
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [activeTab]);

  // Calculate receivables metrics
  const totalReceivables = receivables.reduce((sum, r) => sum + r.amount, 0);
  const overdueReceivables = receivables
    .filter((r) => r.daysOverdue > 0)
    .reduce((sum, r) => sum + r.amount, 0);
  const overduePercentage = (overdueReceivables / totalReceivables) * 100;
  const criticalReceivables = receivables
    .filter((r) => r.status === "Critical")
    .reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Receivables Management"
          description="Track, manage, and collect outstanding invoices"
          icon={<DollarSign className="w-8 h-8 text-oxford_blue-600" />}
        />

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Receivables</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalReceivables)}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Overdue Amount</p>
                <p className="text-2xl font-bold text-amber-600">{formatCurrency(overdueReceivables)}</p>
                <p className="text-xs text-gray-500">{overduePercentage.toFixed(1)}% of total</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-lg">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Critical Receivables</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(criticalReceivables)}</p>
                <p className="text-xs text-gray-500">Requires immediate action</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Receivables List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Tabs and Search */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                    <button
                      onClick={() => setActiveTab("all")}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        activeTab === "all" ? "bg-oxford_blue-600 text-white" : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      All Receivables
                    </button>
                    <button
                      onClick={() => setActiveTab("overdue")}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        activeTab === "overdue" ? "bg-oxford_blue-600 text-white" : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Overdue
                    </button>
                    <button
                      onClick={() => setActiveTab("upcoming")}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        activeTab === "upcoming" ? "bg-oxford_blue-600 text-white" : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Upcoming
                    </button>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search invoices..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-oxford_blue-500 focus:border-transparent w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Receivables Table */}
              <div className="overflow-x-auto">
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-oxford_blue-600"></div>
                  </div>
                ) : sortedReceivables.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No receivables found</h3>
                    <p className="text-gray-600">Try adjusting your search or filters</p>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort("client")}
                        >
                          <div className="flex items-center">
                            Client
                            {sortField === "client" && (
                              <span className="ml-1">
                                {sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                              </span>
                            )}
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Invoice
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort("amount")}
                        >
                          <div className="flex items-center">
                            Amount
                            {sortField === "amount" && (
                              <span className="ml-1">
                                {sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                              </span>
                            )}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort("dueDate")}
                        >
                          <div className="flex items-center">
                            Due Date
                            {sortField === "dueDate" && (
                              <span className="ml-1">
                                {sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                              </span>
                            )}
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Red Flag
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sortedReceivables.map((receivable) => (
                        <tr
                          key={receivable.id}
                          className={`hover:bg-gray-50 cursor-pointer ${selectedInvoice === receivable.id ? "bg-blue-50" : ""}`}
                          onClick={() => setSelectedInvoice(receivable.id)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{receivable.client}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{receivable.invoiceNumber}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{formatCurrency(receivable.amount)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatDate(receivable.dueDate)}</div>
                            {receivable.daysOverdue > 0 && (
                              <div className="text-xs text-red-600">{receivable.daysOverdue} days overdue</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                receivable.status
                              )}`}
                            >
                              {getStatusIcon(receivable.status)}
                              <span className="ml-1">{receivable.status}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {receivable.redFlag && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                {receivable.redFlag}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* AI Insights */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-6 p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-purple-100 rounded-lg mr-3">
                  <Zap className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">AI Insights</h2>
              </div>
              <div className="space-y-4">
                {aiInsights.map((insight) => (
                  <div
                    key={insight.id}
                    className={`p-4 rounded-lg border ${
                      insight.type === "warning"
                        ? "bg-amber-50 border-amber-200"
                        : insight.type === "critical"
                        ? "bg-red-50 border-red-200"
                        : "bg-blue-50 border-blue-200"
                    }`}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-0.5">
                        {insight.type === "warning" ? (
                          <AlertCircle className="h-5 w-5 text-amber-600" />
                        ) : insight.type === "critical" ? (
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                        ) : (
                          <BarChart3 className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                      <div className="ml-3">
                        <h3
                          className={`text-sm font-medium ${
                            insight.type === "warning"
                              ? "text-amber-800"
                              : insight.type === "critical"
                              ? "text-red-800"
                              : "text-blue-800"
                          }`}
                        >
                          {insight.title}
                        </h3>
                        <p
                          className={`mt-1 text-sm ${
                            insight.type === "warning"
                              ? "text-amber-700"
                              : insight.type === "critical"
                              ? "text-red-700"
                              : "text-blue-700"
                          }`}
                        >
                          {insight.description}
                        </p>
                        <p
                          className={`mt-1 text-sm font-medium ${
                            insight.type === "warning"
                              ? "text-amber-800"
                              : insight.type === "critical"
                              ? "text-red-800"
                              : "text-blue-800"
                          }`}
                        >
                          Recommendation: {insight.recommendation}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="lg:col-span-1">
            {selectedInvoiceDetails ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Invoice Details</h2>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        selectedInvoiceDetails.status
                      )}`}
                    >
                      {getStatusIcon(selectedInvoiceDetails.status)}
                      <span className="ml-1">{selectedInvoiceDetails.status}</span>
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Invoice Information */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-3">Invoice Information</h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Invoice Number</span>
                        <span className="text-sm font-medium text-gray-900">{selectedInvoiceDetails.invoiceNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Amount</span>
                        <span className="text-sm font-medium text-gray-900">{formatCurrency(selectedInvoiceDetails.amount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Issue Date</span>
                        <span className="text-sm font-medium text-gray-900">{formatDate(selectedInvoiceDetails.issueDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Due Date</span>
                        <span className="text-sm font-medium text-gray-900">{formatDate(selectedInvoiceDetails.dueDate)}</span>
                      </div>
                      {selectedInvoiceDetails.daysOverdue > 0 && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Days Overdue</span>
                          <span className="text-sm font-medium text-red-600">{selectedInvoiceDetails.daysOverdue} days</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Client Information */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-3">Client Information</h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Client Name</span>
                        <span className="text-sm font-medium text-gray-900">{selectedInvoiceDetails.client}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Contact Person</span>
                        <span className="text-sm font-medium text-gray-900">{selectedInvoiceDetails.contactName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Email</span>
                        <a
                          href={`mailto:${selectedInvoiceDetails.contactEmail}`}
                          className="text-sm font-medium text-oxford_blue-600 hover:text-oxford_blue-700 flex items-center"
                        >
                          <Mail className="w-3 h-3 mr-1" />
                          {selectedInvoiceDetails.contactEmail}
                        </a>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Phone</span>
                        <a
                          href={`tel:${selectedInvoiceDetails.contactPhone}`}
                          className="text-sm font-medium text-oxford_blue-600 hover:text-oxford_blue-700 flex items-center"
                        >
                          <Phone className="w-3 h-3 mr-1" />
                          {selectedInvoiceDetails.contactPhone}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Payment History */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-3">Payment History</h3>
                    {selectedInvoiceDetails.paymentHistory.length > 0 ? (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="space-y-3">
                          {selectedInvoiceDetails.paymentHistory.map((payment, index) => (
                            <div key={index} className="flex justify-between items-center">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{formatCurrency(payment.amount)}</div>
                                <div className="text-xs text-gray-600">{payment.invoiceNumber}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-gray-900">{formatDate(payment.date)}</div>
                                {payment.daysLate && (
                                  <div className="text-xs text-red-600">{payment.daysLate} days late</div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <p className="text-sm text-gray-600">No payment history available</p>
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-3">Notes</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-900">{selectedInvoiceDetails.notes}</p>
                      <p className="text-xs text-gray-600 mt-2">
                        Last contacted: {formatDate(selectedInvoiceDetails.lastContact)}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col space-y-3">
                    <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-oxford_blue-600 hover:bg-oxford_blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-oxford_blue-500">
                      <Mail className="w-4 h-4 mr-2" />
                      Send Payment Reminder
                    </button>
                    <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-oxford_blue-500">
                      <Phone className="w-4 h-4 mr-2" />
                      Log Phone Call
                    </button>
                    <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-oxford_blue-500">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Add Note
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex items-center justify-center">
                <div className="text-center p-6">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No invoice selected</h3>
                  <p className="text-gray-600">Select an invoice from the list to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceivablesManagementPage;