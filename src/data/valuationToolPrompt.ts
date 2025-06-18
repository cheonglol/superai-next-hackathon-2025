// Valuation Tool Prompt Engineering Response Template
// This defines the expected data structure for AI/API responses

export interface ValuationToolResponse {
  // Current financial metrics for valuation
  current_metrics: {
    ebitda: number; // e.g., 60000 (in dollars)
    revenue: number; // e.g., 500000 (in dollars)
    net_income: number; // e.g., 72000 (in dollars)
    total_assets: number; // e.g., 296000 (in dollars)
    book_value: number; // e.g., 146000 (in dollars)
  };

  // Valuation multiples and ranges
  valuation_multiples: {
    ebitda_multiple_range: {
      low: number; // e.g., 4.0
      high: number; // e.g., 15.0
      current: number; // e.g., 8.0 (user-controlled slider value)
      industry_average: number; // e.g., 7.5
    };
    revenue_multiple_range: {
      low: number; // e.g., 0.8
      high: number; // e.g., 3.2
      industry_average: number; // e.g., 1.6
    };
    book_value_multiple_range: {
      low: number; // e.g., 1.2
      high: number; // e.g., 2.8
      industry_average: number; // e.g., 2.0
    };
  };

  // Calculated valuations based on different methods
  valuation_estimates: {
    ebitda_valuation: number; // e.g., 480000 (EBITDA × current multiple)
    revenue_valuation: number; // e.g., 800000 (Revenue × industry average)
    asset_valuation: number; // e.g., 592000 (Assets × industry average)
    book_value_valuation: number; // e.g., 292000 (Book value × industry average)
    weighted_average_valuation: number; // e.g., 541000 (weighted average of methods)
  };

  // Industry benchmarks and context
  industry_context: {
    industry_name: string; // e.g., "Restaurant & Food Service"
    market_conditions: "favorable" | "neutral" | "challenging";
    growth_stage: "startup" | "growth" | "mature" | "declining";
    competitive_position: "leader" | "strong" | "average" | "weak";
    market_size: "large" | "medium" | "small" | "niche";
  };

  // Valuation factors that affect multiples
  valuation_factors: {
    positive_factors: Array<{
      factor: string; // Description of positive factor
      impact_level: "high" | "medium" | "low";
      multiple_adjustment: string; // e.g., "+0.5x to +1.5x"
    }>;
    negative_factors: Array<{
      factor: string; // Description of negative factor
      impact_level: "high" | "medium" | "low";
      multiple_adjustment: string; // e.g., "-0.3x to -1.0x"
    }>;
  };

  // Valuation enhancement opportunities
  value_enhancement_opportunities: Array<{
    opportunity: string; // Description of the opportunity
    impact_on_valuation: number; // Estimated dollar impact on valuation
    timeframe: string; // Implementation timeframe
    difficulty: "easy" | "medium" | "hard";
    priority: "high" | "medium" | "low";
    required_investment: number; // Investment needed in dollars
    roi_estimate: string; // e.g., "300%" (ROI percentage)
  }>;

  // Market transaction comparables (if available)
  market_comparables: Array<{
    transaction_type: "acquisition" | "ipo" | "private_sale" | "merger";
    company_description: string; // Brief description of comparable
    ebitda_multiple: number; // Multiple paid in transaction
    revenue_multiple: number; // Revenue multiple in transaction
    transaction_date: string; // e.g., "Q3 2023"
    relevance_score: "high" | "medium" | "low";
  }>;

  // Valuation insights and recommendations
  insights: Array<{
    type: "valuation_driver" | "market_factor" | "risk_factor" | "opportunity";
    priority: "high" | "medium" | "low";
    insight: string; // The insight text
    action_recommended: boolean; // Whether action is recommended
    impact_on_value: "positive" | "negative" | "neutral";
  }>;

  // Valuation summary and recommendations
  summary: {
    recommended_valuation_range: {
      low: number; // Conservative valuation estimate
      high: number; // Optimistic valuation estimate
      most_likely: number; // Most probable valuation
    };
    key_value_drivers: Array<string>; // Top 3-5 value drivers
    immediate_actions: Array<string>; // Actions to take to increase value
    valuation_methodology_notes: string; // Explanation of approach used
  };
}

// Example response structure
export const exampleValuationToolResponse: ValuationToolResponse = {
  current_metrics: {
    ebitda: 60000,
    revenue: 500000,
    net_income: 72000,
    total_assets: 296000,
    book_value: 146000,
  },
  valuation_multiples: {
    ebitda_multiple_range: {
      low: 4.0,
      high: 15.0,
      current: 8.0,
      industry_average: 7.5,
    },
    revenue_multiple_range: {
      low: 0.8,
      high: 3.2,
      industry_average: 1.6,
    },
    book_value_multiple_range: {
      low: 1.2,
      high: 2.8,
      industry_average: 2.0,
    },
  },
  valuation_estimates: {
    ebitda_valuation: 480000,
    revenue_valuation: 800000,
    asset_valuation: 592000,
    book_value_valuation: 292000,
    weighted_average_valuation: 541000,
  },
  industry_context: {
    industry_name: "Restaurant & Food Service",
    market_conditions: "neutral",
    growth_stage: "growth",
    competitive_position: "strong",
    market_size: "large",
  },
  valuation_factors: {
    positive_factors: [
      {
        factor: "Strong and consistent profitability with growing margins",
        impact_level: "high",
        multiple_adjustment: "+1.0x to +2.0x",
      },
      {
        factor: "Diversified revenue streams and customer base",
        impact_level: "medium",
        multiple_adjustment: "+0.5x to +1.0x",
      },
      {
        factor: "Experienced management team with proven track record",
        impact_level: "medium",
        multiple_adjustment: "+0.3x to +0.8x",
      },
    ],
    negative_factors: [
      {
        factor: "High dependence on local market conditions",
        impact_level: "medium",
        multiple_adjustment: "-0.5x to -1.0x",
      },
      {
        factor: "Intense competition in the food service industry",
        impact_level: "medium",
        multiple_adjustment: "-0.3x to -0.7x",
      },
    ],
  },
  value_enhancement_opportunities: [
    {
      opportunity: "Implement digital ordering and delivery platform",
      impact_on_valuation: 75000,
      timeframe: "6-9 months",
      difficulty: "medium",
      priority: "high",
      required_investment: 15000,
      roi_estimate: "400%",
    },
    {
      opportunity: "Expand to additional locations",
      impact_on_valuation: 150000,
      timeframe: "12-18 months",
      difficulty: "hard",
      priority: "medium",
      required_investment: 100000,
      roi_estimate: "150%",
    },
    {
      opportunity: "Optimize menu pricing and cost structure",
      impact_on_valuation: 45000,
      timeframe: "3-6 months",
      difficulty: "easy",
      priority: "high",
      required_investment: 5000,
      roi_estimate: "800%",
    },
  ],
  market_comparables: [
    {
      transaction_type: "acquisition",
      company_description: "Regional restaurant chain with similar footprint",
      ebitda_multiple: 8.5,
      revenue_multiple: 1.8,
      transaction_date: "Q2 2023",
      relevance_score: "high",
    },
    {
      transaction_type: "private_sale",
      company_description: "Independent restaurant group",
      ebitda_multiple: 6.8,
      revenue_multiple: 1.4,
      transaction_date: "Q4 2023",
      relevance_score: "medium",
    },
  ],
  insights: [
    {
      type: "valuation_driver",
      priority: "high",
      insight: "Strong profitability metrics support above-average industry multiples",
      action_recommended: false,
      impact_on_value: "positive",
    },
    {
      type: "opportunity",
      priority: "high",
      insight: "Digital transformation initiatives could significantly increase valuation",
      action_recommended: true,
      impact_on_value: "positive",
    },
    {
      type: "risk_factor",
      priority: "medium",
      insight: "Market concentration risk may limit valuation multiple expansion",
      action_recommended: true,
      impact_on_value: "negative",
    },
  ],
  summary: {
    recommended_valuation_range: {
      low: 450000,
      high: 650000,
      most_likely: 541000,
    },
    key_value_drivers: [
      "Consistent profitability and cash generation",
      "Strong market position and brand recognition",
      "Growth potential through digital initiatives",
      "Experienced management team",
      "Diversified customer base",
    ],
    immediate_actions: ["Implement menu pricing optimization", "Develop digital ordering capabilities", "Document key business processes and procedures"],
    valuation_methodology_notes:
      "Valuation based on weighted average of EBITDA, revenue, and asset-based approaches, adjusted for industry-specific factors and company-specific strengths and weaknesses.",
  },
};

// Prompt template for AI generation
export const valuationToolPrompt = `
Analyze the provided financial data and return a valid JSON string with valuation analysis following this exact structure:

REQUIRED FIELDS:
- current_metrics: object with ebitda, revenue, net_income, total_assets, book_value as numbers
- valuation_multiples: object with ebitda_multiple_range, revenue_multiple_range, book_value_multiple_range
- valuation_estimates: object with different valuation approaches as numbers
- industry_context: object with industry name, market conditions, growth stage, competitive position, market size
- valuation_factors: object with positive_factors and negative_factors arrays
- value_enhancement_opportunities: array of opportunity objects with impact, timeframe, difficulty, priority, investment, ROI
- market_comparables: array of comparable transaction objects
- insights: array of insight objects with type, priority, insight text, action recommended, impact on value
- summary: object with valuation range, key drivers, immediate actions, methodology notes

IMPORTANT: Return ONLY a valid JSON string that can be parsed with JSON.parse(). Do not include any markdown formatting, code blocks, or additional text.
Focus on realistic valuation ranges and actionable value enhancement opportunities.
Provide 3-5 positive and negative factors, 2-4 enhancement opportunities, and 2-4 market comparables.
All monetary amounts should be whole numbers without currency symbols.
Include specific multiple adjustments (e.g., "+1.0x to +2.0x") for valuation factors.

Example response format:
{"current_metrics":{"ebitda":60000,"revenue":500000,...},"valuation_multiples":{...},...}
`;

export default exampleValuationToolResponse;
