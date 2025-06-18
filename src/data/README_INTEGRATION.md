# Financial Insights API Integration Guide

## 🔗 **Complete Integration Summary**

This document shows how your prompt engineering templates are now fully integrated with your backend API using the structure you specified.

## 📋 **API Payload Structure**

Each API call follows your specified format:

```typescript
{
  "prompt": "string", // The prompt engineering template
  "documentNames": ["string"], // Documents from previous page selection
  "userResponse": "string" // JSON string defining expected response format
}
```

## 🏗️ **Integration Architecture**

### **1. Prompt Engineering Templates** (`src/data/`)

- ✅ `profitabilityInsightsPrompt.ts`
- ✅ `workingCapitalInsightsPrompt.ts`
- ✅ `fundingInsightsPrompt.ts`
- ✅ `sensitivityAnalysisPrompt.ts`
- ✅ `valuationToolPrompt.ts`

### **2. API Service Layer** (`src/services/apiService.ts`)

- ✅ `getProfitabilityInsights(documentNames, branchTags)`
- ✅ `getWorkingCapitalInsights(documentNames, branchTags)`
- ✅ `getFundingInsights(documentNames, branchTags)`
- ✅ `getSensitivityAnalysis(documentNames, branchTags)`
- ✅ `getValuationTool(documentNames, branchTags)`

### **3. Financial Insights Service** (`src/services/financialInsightsService.ts`)

- ✅ High-level service that handles branch document retrieval
- ✅ JSON parsing and type safety
- ✅ Error handling and logging

## 🎯 **How to Use in Your Components**

### **Example 1: Individual Tab Data**

```typescript
import { financialInsightsService } from "@/services/financialInsightsService";

// In your PerformanceInsightsPage component
const handleProfitabilityTab = async (branchKey: string) => {
  const data = await financialInsightsService.getProfitabilityInsights(branchKey);

  if (data) {
    // Fully typed data structure
    console.log("Gross Margin:", data.gross_margin); // "65.0%"
    console.log("Operating Margin:", data.operating_margin); // "25.0%"

    // Array of insights with type safety
    data.insights.forEach((insight) => {
      console.log(`${insight.type}: ${insight.message}`);
      // insight.type is 'positive' | 'warning' | 'neutral'
      // insight.priority is 'high' | 'medium' | 'low'
    });

    // Array of actionable recommendations
    data.recommendations.forEach((rec) => {
      console.log(`Action: ${rec.action} (${rec.impact} impact)`);
      // rec.category is 'pricing' | 'cost_control' | 'efficiency' | 'growth'
      // rec.difficulty is 'easy' | 'medium' | 'hard'
    });
  }
};
```

### **Example 2: Processing Screen with All Data**

```typescript
// Replace your current handleBranchSelection method
const handleBranchSelection = async (branchKey: string) => {
  setSelectedBranch(branchKey);
  setIsProcessing(true);
  setProcessingStep(0);

  try {
    // Get all insights simultaneously
    const insights = await financialInsightsService.getAllInsights(branchKey);

    // Update processing steps
    setProcessingStep(1); // Working Capital
    setProcessingStep(2); // Funding
    setProcessingStep(3); // Sensitivity
    setProcessingStep(4); // Valuation
    setProcessingStep(5); // Complete

    // Store the actual API data
    setInsightsData(insights);

    // All data is now available with full type safety:
    if (insights.profitabilityInsights) {
      // Use real profitability data
      updateProfitabilityComponent(insights.profitabilityInsights);
    }

    if (insights.workingCapitalInsights) {
      // Use real working capital data
      updateWorkingCapitalComponent(insights.workingCapitalInsights);
    }

    // ... and so on for other insights
  } catch (error) {
    console.error("Error fetching insights:", error);
    // Handle error state
  } finally {
    setIsProcessing(false);
  }
};
```

## 📊 **Data Structure Examples**

### **Profitability Insights Response**

```typescript
{
  gross_margin: "65.0%",
  operating_margin: "25.0%",
  net_margin: "14.4%",
  ebitda_margin: "25.0%",
  return_on_assets: "18.7%",
  return_on_equity: "37.9%",
  industry_benchmarks: {
    gross_margin_benchmark: "60-70%",
    operating_margin_benchmark: "15-25%",
    net_margin_benchmark: "10-15%"
  },
  insights: [
    {
      type: "positive",
      message: "Strong gross margin indicates good pricing power",
      priority: "high"
    }
  ],
  recommendations: [
    {
      category: "efficiency",
      action: "Implement automated inventory management",
      impact: "medium",
      timeframe: "3-6 months",
      difficulty: "medium"
    }
  ]
}
```

### **Working Capital Insights Response**

```typescript
{
  working_capital: 60000,
  current_ratio: "2.33",
  quick_ratio: "1.56",
  cash_conversion_cycle: 54,
  components: {
    accounts_receivable_days: 18,
    inventory_days: 73,
    accounts_payable_days: 37
  },
  optimization_opportunities: [
    {
      area: "inventory",
      current_performance: "73 days inventory holding period",
      target_improvement: "Reduce to 60 days through demand forecasting",
      potential_cash_impact: 6000,
      priority: "high"
    }
  ]
}
```

## 🔧 **Backend API Integration**

### **Your Existing API Endpoint**: `/query`

**Request Format**:

```json
{
  "prompt": "Analyze the provided financial data and return a valid JSON string with profitability insights...",
  "documentNames": ["restaurant-a-q1-pl.pdf", "restaurant-a-q1-bs.pdf"],
  "userResponse": "{\"gross_margin\":\"string\",\"operating_margin\":\"string\",...}"
}
```

**Response Format**:

```json
{
  "success": true,
  "data": {
    "response": "{\"gross_margin\":\"65.0%\",\"operating_margin\":\"25.0%\",...}"
  }
}
```

## 🎨 **Frontend Component Integration**

### **Replace Mock Data in Your Components**

```typescript
// OLD: Using mock data
const mockFinancialData = {
  grossMargin: 65.0,
  operatingMargin: 25.0,
  // ...
};

// NEW: Using real API data
const [profitabilityData, setProfitabilityData] = useState<ProfitabilityInsightsResponse | null>(null);

useEffect(() => {
  if (selectedBranch) {
    financialInsightsService.getProfitabilityInsights(selectedBranch)
      .then(setProfitabilityData);
  }
}, [selectedBranch]);

// In your render:
{profitabilityData && (
  <ProfitabilityInsights
    data={profitabilityData}
    formatCurrency={formatCurrency}
    formatPercentage={formatPercentage}
  />
)}
```

## ⚡ **Key Features**

### **1. Type Safety**

- All responses are fully typed with TypeScript interfaces
- Autocomplete and IntelliSense support
- Compile-time error checking

### **2. Error Handling**

- Graceful fallbacks when API calls fail
- Detailed logging for debugging
- Null checks and safe navigation

### **3. Performance**

- `Promise.allSettled()` for parallel API calls
- Efficient document filtering by branch
- Minimal API requests with proper caching

### **4. Flexibility**

- Branch-specific document filtering
- Optional tag-based filtering
- Easy to extend with new insight types

## 🚀 **Next Steps**

1. **Update your existing components** to use the new API service instead of mock data
2. **Test the integration** with your SambaNova + Mistral backend
3. **Handle loading states** during API calls
4. **Add error boundaries** for better user experience
5. **Implement caching** if needed for performance

## 📞 **Support**

If you need help implementing any part of this integration:

- Check the type definitions in each prompt file
- Look at the examples in `financialInsightsService.ts`
- Test individual API calls first before integrating full workflows
- Use browser dev tools to inspect API responses and debug JSON parsing

---

**You now have a complete, type-safe integration between your prompt engineering templates and your backend API!** 🎉
