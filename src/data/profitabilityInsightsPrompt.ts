// Profitability Insights Prompt Engineering Response Template
// This defines the expected data structure for AI/API responses

export interface ProfitabilityInsightsResponse {
  // Main profitability metrics (all percentages as strings with % symbol)
  gross_margin: string; // e.g., "65.0%"
  operating_margin: string; // e.g., "25.0%"
  net_margin: string; // e.g., "14.4%"
  ebitda_margin: string; // e.g., "25.0%"

  // Return metrics (all percentages as strings with % symbol)
  return_on_assets: string; // e.g., "18.7%"
  return_on_equity: string; // e.g., "37.9%"

  // Industry benchmarks for comparison (all percentages as strings with % symbol)
  industry_benchmarks: {
    gross_margin_benchmark: string; // e.g., "60-70%"
    operating_margin_benchmark: string; // e.g., "15-25%"
    net_margin_benchmark: string; // e.g., "10-15%"
  };

  // Analysis insights (array of insight objects)
  insights: Array<{
    type: "positive" | "warning" | "neutral"; // Determines color coding
    message: string; // Insight text
    priority: "high" | "medium" | "low"; // Priority level
  }>;

  // Recommendations (array of actionable recommendations)
  recommendations: Array<{
    category: "pricing" | "cost_control" | "efficiency" | "growth";
    action: string; // Recommended action
    impact: "high" | "medium" | "low"; // Expected impact
    timeframe: string; // e.g., "1-3 months"
    difficulty: "easy" | "medium" | "hard";
  }>;
}

// Example response structure
export const exampleProfitabilityInsightsResponse: ProfitabilityInsightsResponse = {
  gross_margin: "65.0%",
  operating_margin: "25.0%",
  net_margin: "14.4%",
  ebitda_margin: "25.0%",
  return_on_assets: "18.7%",
  return_on_equity: "37.9%",
  industry_benchmarks: {
    gross_margin_benchmark: "60-70%",
    operating_margin_benchmark: "15-25%",
    net_margin_benchmark: "10-15%",
  },
  insights: [
    {
      type: "positive",
      message: "Strong gross margin indicates good pricing power and cost control",
      priority: "high",
    },
    {
      type: "warning",
      message: "Operating margin could be improved through operational efficiency",
      priority: "medium",
    },
    {
      type: "positive",
      message: "ROE indicates efficient use of shareholder equity",
      priority: "medium",
    },
  ],
  recommendations: [
    {
      category: "efficiency",
      action: "Implement automated inventory management system",
      impact: "medium",
      timeframe: "3-6 months",
      difficulty: "medium",
    },
    {
      category: "cost_control",
      action: "Negotiate better supplier terms",
      impact: "high",
      timeframe: "1-3 months",
      difficulty: "easy",
    },
  ],
};

// Prompt template for AI generation
export const profitabilityInsightsPrompt = `
Analyze the provided financial data and return a valid JSON string with profitability insights following this exact structure:

REQUIRED FIELDS:
- gross_margin: string (percentage with % symbol, e.g., "65.0%")
- operating_margin: string (percentage with % symbol, e.g., "25.0%")
- net_margin: string (percentage with % symbol, e.g., "14.4%")
- ebitda_margin: string (percentage with % symbol, e.g., "25.0%")
- return_on_assets: string (percentage with % symbol, e.g., "18.7%")
- return_on_equity: string (percentage with % symbol, e.g., "37.9%")
- industry_benchmarks: object with benchmark ranges as strings
- insights: array of insight objects with type, message, and priority
- recommendations: array of recommendation objects with category, action, impact, timeframe, and difficulty

IMPORTANT: Return ONLY a valid JSON string that can be parsed with JSON.parse(). Do not include any markdown formatting, code blocks, or additional text.
Ensure all percentage values include the % symbol and are formatted to 1 decimal place.
Provide 3-5 insights and 2-4 actionable recommendations.

Example response format:
{"gross_margin":"65.0%","operating_margin":"25.0%",...}
`;

export default exampleProfitabilityInsightsResponse;
