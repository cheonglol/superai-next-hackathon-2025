// Working Capital Insights Prompt Engineering Response Template
// This defines the expected data structure for AI/API responses

export interface WorkingCapitalInsightsResponse {
  // Main working capital metrics
  working_capital: number; // e.g., 60000 (in dollars)
  current_ratio: string; // e.g., "2.33"
  quick_ratio: string; // e.g., "1.56"
  cash_conversion_cycle: number; // e.g., 54 (in days)

  // Working capital components (all in days)
  components: {
    accounts_receivable_days: number; // e.g., 18
    inventory_days: number; // e.g., 73
    accounts_payable_days: number; // e.g., 37
  };

  // Ideal ranges for comparison
  ideal_ranges: {
    current_ratio_range: string; // e.g., "1.5 - 3.0"
    quick_ratio_range: string; // e.g., "1.0 - 1.5"
    cash_conversion_range: string; // e.g., "30 - 60 days"
  };

  // Efficiency analysis
  efficiency: {
    working_capital_ratio: string; // e.g., "12.0%" (as percentage of revenue)
    cash_flow_efficiency: "excellent" | "good" | "average" | "poor";
    liquidity_status: "strong" | "adequate" | "weak" | "critical";
  };

  // Optimization opportunities (array of improvement suggestions)
  optimization_opportunities: Array<{
    area: "inventory" | "receivables" | "payables" | "cash_management";
    current_performance: string; // Current state description
    target_improvement: string; // Target state description
    potential_cash_impact: number; // Estimated cash flow improvement
    priority: "high" | "medium" | "low";
    implementation_difficulty: "easy" | "medium" | "hard";
    timeframe: string; // e.g., "1-2 months"
  }>;

  // Key insights and recommendations
  insights: Array<{
    type: "positive" | "warning" | "critical" | "neutral";
    message: string;
    metric_affected: string; // Which metric this relates to
    impact_level: "high" | "medium" | "low";
  }>;
}

// Example response structure
export const exampleWorkingCapitalInsightsResponse: WorkingCapitalInsightsResponse = {
  working_capital: 60000,
  current_ratio: "2.33",
  quick_ratio: "1.56",
  cash_conversion_cycle: 54,
  components: {
    accounts_receivable_days: 18,
    inventory_days: 73,
    accounts_payable_days: 37,
  },
  ideal_ranges: {
    current_ratio_range: "1.5 - 3.0",
    quick_ratio_range: "1.0 - 1.5",
    cash_conversion_range: "30 - 60 days",
  },
  efficiency: {
    working_capital_ratio: "12.0%",
    cash_flow_efficiency: "good",
    liquidity_status: "strong",
  },
  optimization_opportunities: [
    {
      area: "inventory",
      current_performance: "73 days inventory holding period",
      target_improvement: "Reduce to 60 days through better demand forecasting",
      potential_cash_impact: 6000,
      priority: "high",
      implementation_difficulty: "medium",
      timeframe: "2-4 months",
    },
    {
      area: "payables",
      current_performance: "37 days payment period to suppliers",
      target_improvement: "Negotiate to 45 days payment terms",
      potential_cash_impact: 3500,
      priority: "medium",
      implementation_difficulty: "easy",
      timeframe: "1-2 months",
    },
    {
      area: "receivables",
      current_performance: "18 days collection period",
      target_improvement: "Maintain current excellent collection efficiency",
      potential_cash_impact: 0,
      priority: "low",
      implementation_difficulty: "easy",
      timeframe: "Ongoing",
    },
  ],
  insights: [
    {
      type: "positive",
      message: "Excellent accounts receivable collection with only 18 days outstanding",
      metric_affected: "accounts_receivable_days",
      impact_level: "high",
    },
    {
      type: "warning",
      message: "Inventory levels are higher than optimal, tying up working capital",
      metric_affected: "inventory_days",
      impact_level: "medium",
    },
    {
      type: "neutral",
      message: "Current ratio indicates healthy liquidity position",
      metric_affected: "current_ratio",
      impact_level: "medium",
    },
  ],
};

// Prompt template for AI generation
export const workingCapitalInsightsPrompt = `
Analyze the provided financial data and return a valid JSON string with working capital insights following this exact structure:

REQUIRED FIELDS:
- working_capital: number (dollar amount, no currency symbol)
- current_ratio: string (decimal format, e.g., "2.33")
- quick_ratio: string (decimal format, e.g., "1.56")
- cash_conversion_cycle: number (days as integer)
- components: object with receivables, inventory, and payables days
- ideal_ranges: object with benchmark ranges as strings
- efficiency: object with ratio percentage, cash flow efficiency, and liquidity status
- optimization_opportunities: array of opportunity objects with area, performance descriptions, cash impact, priority, difficulty, and timeframe
- insights: array of insight objects with type, message, affected metric, and impact level

IMPORTANT: Return ONLY a valid JSON string that can be parsed with JSON.parse(). Do not include any markdown formatting, code blocks, or additional text.
Focus on actionable insights for cash flow optimization and working capital efficiency.
Provide 2-4 optimization opportunities and 3-5 key insights.
All monetary amounts should be whole numbers without currency symbols.

Example response format:
{"working_capital":60000,"current_ratio":"2.33",...}
`;

export default exampleWorkingCapitalInsightsResponse;
