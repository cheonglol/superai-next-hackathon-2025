// Funding Insights Prompt Engineering Response Template
// This defines the expected data structure for AI/API responses

export interface FundingInsightsResponse {
  // Main debt and funding metrics
  debt_to_equity_ratio: string; // e.g., "1.03"
  debt_to_assets_ratio: string; // e.g., "50.6%"
  equity_ratio: string; // e.g., "49.4%"
  interest_coverage_ratio: string; // e.g., "15.6x"
  debt_service_coverage_ratio: string; // e.g., "4.5x"

  // Debt breakdown and details
  debt_profile: {
    total_debt: number; // e.g., 150000 (in dollars)
    long_term_debt: number; // e.g., 150000 (in dollars)
    short_term_debt: number; // e.g., 0 (in dollars)
    average_interest_rate: string; // e.g., "5.3%"
    weighted_avg_maturity: string; // e.g., "3.2 years"
  };

  // Ideal ranges and benchmarks
  benchmark_ranges: {
    debt_to_equity_ideal: string; // e.g., "0.3 - 0.6"
    interest_coverage_minimum: string; // e.g., "2.5x"
    debt_service_coverage_minimum: string; // e.g., "1.25x"
  };

  // Financial risk assessment
  risk_assessment: {
    overall_risk_level: "low" | "moderate" | "high" | "critical";
    liquidity_risk: "low" | "moderate" | "high" | "critical";
    leverage_risk: "low" | "moderate" | "high" | "critical";
    interest_rate_risk: "low" | "moderate" | "high" | "critical";
  };

  // Funding capacity and opportunities
  funding_capacity: {
    additional_debt_capacity: number; // e.g., 75000 (in dollars)
    debt_capacity_utilization: string; // e.g., "66.7%"
    recommended_debt_ceiling: number; // e.g., 225000 (in dollars)
    equity_funding_need: number; // e.g., 0 (in dollars, if any)
  };

  // Funding recommendations and strategies
  funding_recommendations: Array<{
    strategy: "refinance" | "debt_reduction" | "equity_injection" | "debt_restructure" | "maintain_current";
    description: string; // Detailed explanation
    priority: "high" | "medium" | "low";
    estimated_savings: number; // Annual savings in dollars
    implementation_timeframe: string; // e.g., "3-6 months"
    risk_impact: "reduces" | "maintains" | "increases";
  }>;

  // Key insights and analysis
  insights: Array<{
    type: "positive" | "warning" | "critical" | "neutral";
    category: "leverage" | "liquidity" | "cost_of_capital" | "risk_management";
    message: string;
    impact_level: "high" | "medium" | "low";
    action_required: boolean;
  }>;
}

// Example response structure
export const exampleFundingInsightsResponse: FundingInsightsResponse = {
  debt_to_equity_ratio: "1.03",
  debt_to_assets_ratio: "50.6%",
  equity_ratio: "49.4%",
  interest_coverage_ratio: "15.6x",
  debt_service_coverage_ratio: "4.5x",
  debt_profile: {
    total_debt: 150000,
    long_term_debt: 150000,
    short_term_debt: 0,
    average_interest_rate: "5.3%",
    weighted_avg_maturity: "3.2 years",
  },
  benchmark_ranges: {
    debt_to_equity_ideal: "0.3 - 0.6",
    interest_coverage_minimum: "2.5x",
    debt_service_coverage_minimum: "1.25x",
  },
  risk_assessment: {
    overall_risk_level: "low",
    liquidity_risk: "low",
    leverage_risk: "moderate",
    interest_rate_risk: "low",
  },
  funding_capacity: {
    additional_debt_capacity: 75000,
    debt_capacity_utilization: "66.7%",
    recommended_debt_ceiling: 225000,
    equity_funding_need: 0,
  },
  funding_recommendations: [
    {
      strategy: "refinance",
      description: "Consider refinancing existing debt at current lower market rates to reduce interest expense",
      priority: "medium",
      estimated_savings: 8000,
      implementation_timeframe: "3-6 months",
      risk_impact: "reduces",
    },
    {
      strategy: "maintain_current",
      description: "Current debt levels are optimal for business operations and growth plans",
      priority: "low",
      estimated_savings: 0,
      implementation_timeframe: "Ongoing",
      risk_impact: "maintains",
    },
  ],
  insights: [
    {
      type: "positive",
      category: "liquidity",
      message: "Strong interest coverage ratio indicates low financial risk and ability to service debt obligations",
      impact_level: "high",
      action_required: false,
    },
    {
      type: "warning",
      category: "leverage",
      message: "Debt-to-equity ratio is above optimal range but manageable given strong cash flows",
      impact_level: "medium",
      action_required: false,
    },
    {
      type: "neutral",
      category: "cost_of_capital",
      message: "Current interest rates are competitive for the industry and credit profile",
      impact_level: "medium",
      action_required: false,
    },
  ],
};

// Prompt template for AI generation
export const fundingInsightsPrompt = `
Analyze the provided financial data and return a valid JSON string with funding insights following this exact structure:

REQUIRED FIELDS:
- debt_to_equity_ratio: string (decimal format, e.g., "1.03")
- debt_to_assets_ratio: string (percentage with % symbol, e.g., "50.6%")
- equity_ratio: string (percentage with % symbol, e.g., "49.4%")
- interest_coverage_ratio: string (with 'x' suffix, e.g., "15.6x")
- debt_service_coverage_ratio: string (with 'x' suffix, e.g., "4.5x")
- debt_profile: object with total debt, long/short term breakdown, interest rate, and maturity
- benchmark_ranges: object with ideal ranges as strings
- risk_assessment: object with risk levels for overall, liquidity, leverage, and interest rate
- funding_capacity: object with debt capacity metrics and recommendations
- funding_recommendations: array of strategy objects with description, priority, savings, timeframe, and risk impact
- insights: array of insight objects with type, category, message, impact level, and action required flag

IMPORTANT: Return ONLY a valid JSON string that can be parsed with JSON.parse(). Do not include any markdown formatting, code blocks, or additional text.
Focus on actionable funding strategies and risk management.
Provide 2-4 funding recommendations and 3-5 key insights.
All monetary amounts should be whole numbers without currency symbols.
Percentages should include the % symbol, ratios should include 'x' suffix where applicable.

Example response format:
{"debt_to_equity_ratio":"1.03","debt_to_assets_ratio":"50.6%",...}
`;

export default exampleFundingInsightsResponse;
