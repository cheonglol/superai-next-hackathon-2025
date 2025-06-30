export interface CashFlowData {
  id: string;
  companyId: string;
  period: string;
  startDate: string;
  endDate: string;
  
  // Core cash flow components
  operatingCashFlow: {
    receipts: CashFlowItem[];
    payments: CashFlowItem[];
    netOperating: number;
  };
  
  investingCashFlow: {
    receipts: CashFlowItem[];
    payments: CashFlowItem[];
    netInvesting: number;
  };
  
  financingCashFlow: {
    receipts: CashFlowItem[];
    payments: CashFlowItem[];
    netFinancing: number;
  };
  
  // Summary metrics
  openingBalance: number;
  closingBalance: number;
  netCashFlow: number;
  
  // Forecasting data
  forecast: CashFlowForecast[];
  
  // Analysis metadata
  lastUpdated: string;
  dataQuality: 'high' | 'medium' | 'low';
  confidence: number;
}

export interface CashFlowItem {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  type: 'inflow' | 'outflow';
  source: 'actual' | 'projected' | 'recurring';
  confidence: number;
  tags: string[];
}

export interface CashFlowForecast {
  period: string;
  projectedInflow: number;
  projectedOutflow: number;
  projectedBalance: number;
  confidence: number;
  scenarios: {
    optimistic: number;
    realistic: number;
    pessimistic: number;
  };
  assumptions: string[];
}

export interface CashFlowAnalysis {
  healthScore: number;
  liquidityRatio: number;
  burnRate: number;
  runwayDays: number;
  seasonality: SeasonalityPattern[];
  trends: {
    direction: 'improving' | 'declining' | 'stable';
    velocity: number;
    volatility: number;
  };
  risks: CashFlowRisk[];
  opportunities: CashFlowOpportunity[];
}

export interface SeasonalityPattern {
  period: string;
  pattern: 'high' | 'medium' | 'low';
  variance: number;
  confidence: number;
}

export interface CashFlowRisk {
  id: string;
  type: 'concentration' | 'timing' | 'market' | 'operational' | 'credit';
  severity: 'low' | 'medium' | 'high' | 'critical';
  probability: number;
  impact: number;
  description: string;
  mitigation: string[];
}

export interface CashFlowOpportunity {
  id: string;
  type: 'optimization' | 'acceleration' | 'cost-reduction' | 'revenue-enhancement';
  potential: number;
  effort: 'low' | 'medium' | 'high';
  timeframe: string;
  description: string;
  requirements: string[];
}

// Working Capital Management
export interface WorkingCapital {
  accountsReceivable: {
    total: number;
    aging: AgingBucket[];
    averageDays: number;
    turnoverRatio: number;
  };
  
  accountsPayable: {
    total: number;
    aging: AgingBucket[];
    averageDays: number;
    turnoverRatio: number;
  };
  
  inventory: {
    total: number;
    turnoverRatio: number;
    daysOnHand: number;
    categories: InventoryCategory[];
  };
  
  cashConversionCycle: number;
  workingCapitalRatio: number;
}

export interface AgingBucket {
  range: string;
  amount: number;
  percentage: number;
  count: number;
}

export interface InventoryCategory {
  name: string;
  value: number;
  turnover: number;
  daysOnHand: number;
}

// Credit and Financing
export interface CreditProfile {
  creditScore: number;
  creditLimit: number;
  utilization: number;
  paymentHistory: PaymentRecord[];
  tradelines: Tradeline[];
  recommendations: CreditRecommendation[];
}

export interface PaymentRecord {
  date: string;
  amount: number;
  status: 'on-time' | 'late' | 'missed';
  daysLate?: number;
}

export interface Tradeline {
  creditor: string;
  type: 'revolving' | 'installment' | 'trade';
  limit: number;
  balance: number;
  status: 'current' | 'past-due' | 'charged-off';
  openDate: string;
}

export interface CreditRecommendation {
  type: 'improve-score' | 'increase-limit' | 'diversify' | 'optimize-utilization';
  description: string;
  impact: number;
  timeframe: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

// Financial Inclusion Metrics
export interface InclusionMetrics {
  digitalAdoption: {
    score: number;
    capabilities: string[];
    gaps: string[];
  };
  
  accessToCredit: {
    score: number;
    availableProducts: CreditProduct[];
    barriers: string[];
  };
  
  financialLiteracy: {
    score: number;
    strengths: string[];
    improvementAreas: string[];
  };
  
  marketParticipation: {
    score: number;
    channels: string[];
    opportunities: string[];
  };
}

export interface CreditProduct {
  id: string;
  name: string;
  type: 'line-of-credit' | 'term-loan' | 'invoice-financing' | 'merchant-advance';
  amount: number;
  rate: number;
  term: string;
  requirements: string[];
  probability: number;
}