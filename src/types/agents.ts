export interface Agent {
  id: string;
  name: string;
  type: 'diagnostician' | 'stress-tester' | 'sentinel' | 'autopilot' | 'orchestrator';
  status: 'active' | 'idle' | 'processing' | 'error';
  lastActivity: string;
  capabilities: string[];
  metrics: {
    tasksCompleted: number;
    accuracy: number;
    responseTime: number;
  };
}

export interface CashFlowDiagnostician extends Agent {
  type: 'diagnostician';
  analysis: {
    healthScore: number;
    trends: CashFlowTrend[];
    issues: CashFlowIssue[];
    recommendations: Recommendation[];
  };
}

export interface ScenarioStressTester extends Agent {
  type: 'stress-tester';
  scenarios: StressTestScenario[];
  results: StressTestResult[];
}

export interface LiquiditySentinel extends Agent {
  type: 'sentinel';
  alerts: LiquidityAlert[];
  thresholds: LiquidityThreshold[];
  monitoring: MonitoringConfig;
}

export interface ReceivablesAutopilot extends Agent {
  type: 'autopilot';
  collections: CollectionTask[];
  automation: AutomationRule[];
  performance: CollectionMetrics;
}

export interface CentralOrchestrator extends Agent {
  type: 'orchestrator';
  agents: Agent[];
  coordination: CoordinationTask[];
  insights: OrchestrationInsight[];
}

// Supporting types
export interface CashFlowTrend {
  period: string;
  inflow: number;
  outflow: number;
  netFlow: number;
  trend: 'improving' | 'declining' | 'stable';
}

export interface CashFlowIssue {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'receivables' | 'payables' | 'inventory' | 'seasonal' | 'operational';
  description: string;
  impact: number;
  suggestedActions: string[];
}

export interface Recommendation {
  id: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  title: string;
  description: string;
  expectedImpact: string;
  timeframe: string;
  effort: 'low' | 'medium' | 'high';
}

export interface StressTestScenario {
  id: string;
  name: string;
  description: string;
  parameters: {
    revenueChange: number;
    expenseChange: number;
    paymentDelays: number;
    duration: number;
  };
  probability: number;
}

export interface StressTestResult {
  scenarioId: string;
  cashFlowImpact: number[];
  liquidityRisk: 'low' | 'medium' | 'high' | 'critical';
  survivalDays: number;
  recommendations: string[];
}

export interface LiquidityAlert {
  id: string;
  type: 'warning' | 'critical' | 'opportunity';
  message: string;
  threshold: number;
  currentValue: number;
  timestamp: string;
  actionRequired: boolean;
}

export interface LiquidityThreshold {
  id: string;
  name: string;
  value: number;
  type: 'minimum' | 'optimal' | 'maximum';
  alertEnabled: boolean;
}

export interface MonitoringConfig {
  frequency: 'real-time' | 'hourly' | 'daily' | 'weekly';
  metrics: string[];
  alertChannels: string[];
}

export interface CollectionTask {
  id: string;
  customerId: string;
  amount: number;
  daysOverdue: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed' | 'escalated';
  nextAction: string;
  automationApplied: boolean;
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  action: string;
  enabled: boolean;
  successRate: number;
}

export interface CollectionMetrics {
  totalOutstanding: number;
  averageCollectionDays: number;
  collectionRate: number;
  automationEfficiency: number;
}

export interface CoordinationTask {
  id: string;
  type: 'data-sharing' | 'alert-escalation' | 'recommendation-synthesis';
  involvedAgents: string[];
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

export interface OrchestrationInsight {
  id: string;
  title: string;
  description: string;
  sourceAgents: string[];
  confidence: number;
  actionable: boolean;
  impact: 'low' | 'medium' | 'high';
}

// Agent Communication
export interface AgentMessage {
  id: string;
  fromAgent: string;
  toAgent: string;
  type: 'data' | 'alert' | 'request' | 'response';
  payload: any;
  timestamp: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface AgentCapability {
  name: string;
  description: string;
  inputTypes: string[];
  outputTypes: string[];
  dependencies: string[];
}