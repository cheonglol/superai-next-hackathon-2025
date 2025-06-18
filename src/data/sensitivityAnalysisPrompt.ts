// Sensitivity Analysis Prompt Engineering Response Template
// This defines the expected data structure for AI/API responses

export interface SensitivityAnalysisResponse {
  // Scenario analysis table data
  scenarios: Array<{
    scenario_name: string; // e.g., "Increase prices by 5%"
    profit_impact: string; // e.g., "+$15,000" or "-$5,000"
    cash_flow_impact: string; // e.g., "+$12,000" or "-$3,000"
    probability: "high" | "medium" | "low";
    timeframe: string; // e.g., "1-3 months"
    implementation_difficulty: "easy" | "medium" | "hard";
    risk_level: "low" | "medium" | "high";
  }>;

  // Top opportunities ranked by impact
  top_opportunities: {
    profit_impact: Array<{
      opportunity: string; // Description of the opportunity
      estimated_impact: number; // Profit impact in dollars (positive number)
      timeframe: string; // Implementation timeframe
      confidence_level: "high" | "medium" | "low";
      required_investment: number; // Initial investment required in dollars
    }>;

    cash_flow_impact: Array<{
      opportunity: string; // Description of the opportunity
      estimated_impact: number; // Cash flow impact in dollars (positive number)
      timeframe: string; // Implementation timeframe
      confidence_level: "high" | "medium" | "low";
      required_investment: number; // Initial investment required in dollars
    }>;
  };

  // Implementation priority matrix
  implementation_matrix: {
    immediate_actions: Array<{
      action: string; // Specific action to take
      expected_outcome: string; // Expected result
      success_probability: string; // e.g., "85%"
      resource_requirement: "low" | "medium" | "high";
      estimated_timeline: string; // e.g., "2-4 weeks"
    }>;

    short_term_initiatives: Array<{
      initiative: string; // Description of initiative
      expected_outcome: string; // Expected result
      success_probability: string; // e.g., "70%"
      resource_requirement: "low" | "medium" | "high";
      estimated_timeline: string; // e.g., "3-6 months"
    }>;

    long_term_strategies: Array<{
      strategy: string; // Description of strategy
      expected_outcome: string; // Expected result
      success_probability: string; // e.g., "60%"
      resource_requirement: "low" | "medium" | "high";
      estimated_timeline: string; // e.g., "6-12 months"
    }>;
  };

  // Key risk factors and mitigation strategies
  risk_factors: Array<{
    risk_description: string; // Description of the risk
    potential_impact: number; // Financial impact in dollars (negative)
    probability: "high" | "medium" | "low";
    mitigation_strategy: string; // How to mitigate this risk
    monitoring_metric: string; // Key metric to watch
  }>;

  // Sensitivity insights and recommendations
  insights: Array<{
    type: "opportunity" | "risk" | "optimization" | "strategic";
    priority: "high" | "medium" | "low";
    insight: string; // The insight text
    action_required: boolean; // Whether immediate action is needed
    impact_potential: "high" | "medium" | "low";
  }>;

  // Overall analysis summary
  summary: {
    most_impactful_lever: string; // The single most impactful change
    quickest_win: string; // Fastest implementable improvement
    highest_risk: string; // Biggest risk to monitor
    recommended_focus: Array<string>; // 2-3 key focus areas
  };
}

// Example response structure
export const exampleSensitivityAnalysisResponse: SensitivityAnalysisResponse = {
  scenarios: [
    {
      scenario_name: "Increase prices by 5%",
      profit_impact: "+$15,000",
      cash_flow_impact: "+$12,000",
      probability: "medium",
      timeframe: "1-3 months",
      implementation_difficulty: "easy",
      risk_level: "medium",
    },
    {
      scenario_name: "Reduce operating costs by 10%",
      profit_impact: "+$12,000",
      cash_flow_impact: "+$10,000",
      probability: "high",
      timeframe: "2-4 months",
      implementation_difficulty: "medium",
      risk_level: "low",
    },
    {
      scenario_name: "Increase sales volume by 15%",
      profit_impact: "+$18,000",
      cash_flow_impact: "+$15,000",
      probability: "medium",
      timeframe: "3-6 months",
      implementation_difficulty: "hard",
      risk_level: "medium",
    },
    {
      scenario_name: "Economic downturn impact",
      profit_impact: "-$25,000",
      cash_flow_impact: "-$20,000",
      probability: "low",
      timeframe: "6-12 months",
      implementation_difficulty: "easy",
      risk_level: "high",
    },
  ],
  top_opportunities: {
    profit_impact: [
      {
        opportunity: "Increase sales volume through expanded marketing",
        estimated_impact: 18000,
        timeframe: "3-6 months",
        confidence_level: "medium",
        required_investment: 5000,
      },
      {
        opportunity: "Implement strategic price increases",
        estimated_impact: 15000,
        timeframe: "1-3 months",
        confidence_level: "high",
        required_investment: 1000,
      },
      {
        opportunity: "Optimize operational efficiency",
        estimated_impact: 12000,
        timeframe: "2-4 months",
        confidence_level: "high",
        required_investment: 3000,
      },
    ],
    cash_flow_impact: [
      {
        opportunity: "Accelerate accounts receivable collection",
        estimated_impact: 15000,
        timeframe: "1-2 months",
        confidence_level: "high",
        required_investment: 500,
      },
      {
        opportunity: "Optimize inventory management",
        estimated_impact: 12000,
        timeframe: "2-3 months",
        confidence_level: "medium",
        required_investment: 2000,
      },
      {
        opportunity: "Negotiate extended payment terms",
        estimated_impact: 8000,
        timeframe: "1 month",
        confidence_level: "high",
        required_investment: 0,
      },
    ],
  },
  implementation_matrix: {
    immediate_actions: [
      {
        action: "Implement 3% price increase on high-margin products",
        expected_outcome: "Increase monthly profit by $2,500",
        success_probability: "85%",
        resource_requirement: "low",
        estimated_timeline: "2-4 weeks",
      },
      {
        action: "Negotiate extended payment terms with top 3 suppliers",
        expected_outcome: "Improve cash flow by $8,000",
        success_probability: "80%",
        resource_requirement: "low",
        estimated_timeline: "3-4 weeks",
      },
    ],
    short_term_initiatives: [
      {
        initiative: "Implement customer retention program",
        expected_outcome: "Reduce churn by 20% and increase lifetime value",
        success_probability: "70%",
        resource_requirement: "medium",
        estimated_timeline: "3-4 months",
      },
      {
        initiative: "Optimize inventory management system",
        expected_outcome: "Reduce inventory holding costs by 15%",
        success_probability: "75%",
        resource_requirement: "medium",
        estimated_timeline: "4-6 months",
      },
    ],
    long_term_strategies: [
      {
        strategy: "Expand into adjacent market segments",
        expected_outcome: "Increase revenue by 25-30%",
        success_probability: "60%",
        resource_requirement: "high",
        estimated_timeline: "9-12 months",
      },
      {
        strategy: "Develop strategic partnerships for distribution",
        expected_outcome: "Access new customer base and reduce acquisition costs",
        success_probability: "65%",
        resource_requirement: "medium",
        estimated_timeline: "6-8 months",
      },
    ],
  },
  risk_factors: [
    {
      risk_description: "Economic recession reducing customer demand",
      potential_impact: -25000,
      probability: "low",
      mitigation_strategy: "Diversify customer base and maintain cash reserves",
      monitoring_metric: "Monthly sales trends and economic indicators",
    },
    {
      risk_description: "Key supplier price increases",
      potential_impact: -8000,
      probability: "medium",
      mitigation_strategy: "Develop alternative supplier relationships",
      monitoring_metric: "Supplier cost trends and contract renewal dates",
    },
  ],
  insights: [
    {
      type: "opportunity",
      priority: "high",
      insight: "Price optimization offers the quickest path to profit improvement with minimal risk",
      action_required: true,
      impact_potential: "high",
    },
    {
      type: "optimization",
      priority: "medium",
      insight: "Working capital management improvements can significantly boost cash flow",
      action_required: true,
      impact_potential: "medium",
    },
    {
      type: "strategic",
      priority: "medium",
      insight: "Market expansion opportunities exist but require careful planning and execution",
      action_required: false,
      impact_potential: "high",
    },
  ],
  summary: {
    most_impactful_lever: "Price optimization combined with volume growth",
    quickest_win: "Strategic price increases on high-margin products",
    highest_risk: "Economic downturn impact on customer demand",
    recommended_focus: ["Implement immediate price optimization", "Improve working capital efficiency", "Develop customer retention strategies"],
  },
};

// Prompt template for AI generation
export const sensitivityAnalysisPrompt = `
Analyze the provided financial data and return a valid JSON string with sensitivity analysis following this exact structure:

REQUIRED FIELDS:
- scenarios: array of scenario objects with impact strings (include + or - and $ symbol, e.g., "+$15,000")
- top_opportunities: object with profit_impact and cash_flow_impact arrays of opportunity objects
- implementation_matrix: object with immediate_actions, short_term_initiatives, and long_term_strategies arrays
- risk_factors: array of risk objects with potential_impact as negative numbers
- insights: array of insight objects with type, priority, insight text, action required, and impact potential
- summary: object with most impactful lever, quickest win, highest risk, and recommended focus areas

IMPORTANT: Return ONLY a valid JSON string that can be parsed with JSON.parse(). Do not include any markdown formatting, code blocks, or additional text.
Focus on realistic, actionable scenarios and opportunities.
Provide 4-7 scenarios, 3 opportunities per impact type, 2-3 items per implementation timeframe.
Include both positive and negative scenarios for comprehensive analysis.
All monetary impacts should include appropriate + or - signs and $ symbols in impact strings.

Example response format:
{"scenarios":[{"scenario_name":"Increase prices by 5%","profit_impact":"+$15,000",...}],...}
`;

export default exampleSensitivityAnalysisResponse;
