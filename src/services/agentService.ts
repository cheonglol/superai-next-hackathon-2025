import type { 
  Agent, 
  CashFlowDiagnostician, 
  ScenarioStressTester, 
  LiquiditySentinel, 
  ReceivablesAutopilot,
  CentralOrchestrator,
  AgentMessage,
  StressTestResult,
  LiquidityAlert,
  CollectionTask
} from '@/types/agents';

import type {
  CashFlowData,
  CashFlowAnalysis
} from '@/types/cashflow';

class AgentService {
  private agents: Map<string, Agent> = new Map();
  private messageQueue: AgentMessage[] = [];
  private orchestrator: CentralOrchestrator | null = null;

  constructor() {
    this.initializeAgents();
  }

  private initializeAgents() {
    // Initialize Cash Flow Diagnostician
    const diagnostician: CashFlowDiagnostician = {
      id: 'cashflow-diagnostician',
      name: 'Cash Flow Diagnostician',
      type: 'diagnostician',
      status: 'active',
      lastActivity: new Date().toISOString(),
      capabilities: [
        'cash-flow-analysis',
        'trend-detection',
        'health-scoring',
        'issue-identification',
        'recommendation-generation'
      ],
      metrics: {
        tasksCompleted: 0,
        accuracy: 0.95,
        responseTime: 2.3
      },
      analysis: {
        healthScore: 0,
        trends: [],
        issues: [],
        recommendations: []
      }
    };

    // Initialize Scenario Stress Tester
    const stressTester: ScenarioStressTester = {
      id: 'scenario-stress-tester',
      name: 'Scenario Stress Tester',
      type: 'stress-tester',
      status: 'active',
      lastActivity: new Date().toISOString(),
      capabilities: [
        'scenario-modeling',
        'stress-testing',
        'risk-assessment',
        'survival-analysis',
        'contingency-planning'
      ],
      metrics: {
        tasksCompleted: 0,
        accuracy: 0.92,
        responseTime: 5.1
      },
      scenarios: [],
      results: []
    };

    // Initialize Liquidity Sentinel
    const liquiditySentinel: LiquiditySentinel = {
      id: 'liquidity-sentinel',
      name: 'Liquidity Sentinel',
      type: 'sentinel',
      status: 'active',
      lastActivity: new Date().toISOString(),
      capabilities: [
        'real-time-monitoring',
        'threshold-management',
        'alert-generation',
        'liquidity-optimization',
        'risk-prevention'
      ],
      metrics: {
        tasksCompleted: 0,
        accuracy: 0.98,
        responseTime: 0.5
      },
      alerts: [],
      thresholds: [
        {
          id: 'minimum-cash',
          name: 'Minimum Cash Balance',
          value: 50000,
          type: 'minimum',
          alertEnabled: true
        },
        {
          id: 'optimal-cash',
          name: 'Optimal Cash Balance',
          value: 150000,
          type: 'optimal',
          alertEnabled: true
        }
      ],
      monitoring: {
        frequency: 'real-time',
        metrics: ['cash-balance', 'liquidity-ratio', 'burn-rate'],
        alertChannels: ['dashboard', 'email', 'sms']
      }
    };

    // Initialize Receivables Autopilot
    const receivablesAutopilot: ReceivablesAutopilot = {
      id: 'receivables-autopilot',
      name: 'Receivables Autopilot',
      type: 'autopilot',
      status: 'active',
      lastActivity: new Date().toISOString(),
      capabilities: [
        'automated-collections',
        'payment-reminders',
        'risk-scoring',
        'workflow-optimization',
        'customer-communication'
      ],
      metrics: {
        tasksCompleted: 0,
        accuracy: 0.89,
        responseTime: 1.8
      },
      collections: [],
      automation: [
        {
          id: 'payment-reminder',
          name: 'Automated Payment Reminders',
          trigger: 'invoice-overdue-3-days',
          action: 'send-email-reminder',
          enabled: true,
          successRate: 0.67
        },
        {
          id: 'escalation-rule',
          name: 'Collection Escalation',
          trigger: 'invoice-overdue-30-days',
          action: 'escalate-to-manager',
          enabled: true,
          successRate: 0.45
        }
      ],
      performance: {
        totalOutstanding: 0,
        averageCollectionDays: 0,
        collectionRate: 0,
        automationEfficiency: 0
      }
    };

    // Initialize Central Orchestrator
    this.orchestrator = {
      id: 'central-orchestrator',
      name: 'Central Orchestrator',
      type: 'orchestrator',
      status: 'active',
      lastActivity: new Date().toISOString(),
      capabilities: [
        'agent-coordination',
        'task-distribution',
        'insight-synthesis',
        'priority-management',
        'system-optimization'
      ],
      metrics: {
        tasksCompleted: 0,
        accuracy: 0.96,
        responseTime: 1.2
      },
      agents: [diagnostician, stressTester, liquiditySentinel, receivablesAutopilot],
      coordination: [],
      insights: []
    };

    // Register all agents
    this.agents.set(diagnostician.id, diagnostician);
    this.agents.set(stressTester.id, stressTester);
    this.agents.set(liquiditySentinel.id, liquiditySentinel);
    this.agents.set(receivablesAutopilot.id, receivablesAutopilot);
    this.agents.set(this.orchestrator.id, this.orchestrator);
  }

  // Agent Management
  getAgent(id: string): Agent | undefined {
    return this.agents.get(id);
  }

  getAllAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  getOrchestrator(): CentralOrchestrator | null {
    return this.orchestrator;
  }

  // Cash Flow Analysis
  async analyzeCashFlow(data: CashFlowData): Promise<CashFlowAnalysis> {
    const diagnostician = this.agents.get('cashflow-diagnostician') as CashFlowDiagnostician;
    
    if (!diagnostician) {
      throw new Error('Cash Flow Diagnostician not available');
    }

    // Simulate AI analysis
    await this.simulateProcessing(2000);

    const analysis: CashFlowAnalysis = {
      healthScore: this.calculateHealthScore(data),
      liquidityRatio: this.calculateLiquidityRatio(data),
      burnRate: this.calculateBurnRate(data),
      runwayDays: this.calculateRunwayDays(data),
      seasonality: this.detectSeasonality(data),
      trends: {
        direction: this.analyzeTrend(data),
        velocity: Math.random() * 10,
        volatility: Math.random() * 5
      },
      risks: this.identifyRisks(data),
      opportunities: this.identifyOpportunities(data)
    };

    // Update agent state
    diagnostician.analysis.healthScore = analysis.healthScore;
    diagnostician.metrics.tasksCompleted++;
    diagnostician.lastActivity = new Date().toISOString();

    return analysis;
  }

  // Stress Testing
  async runStressTest(data: CashFlowData, scenarioId: string): Promise<StressTestResult> {
    const stressTester = this.agents.get('scenario-stress-tester') as ScenarioStressTester;
    
    if (!stressTester) {
      throw new Error('Scenario Stress Tester not available');
    }

    await this.simulateProcessing(3000);

    const result: StressTestResult = {
      scenarioId,
      cashFlowImpact: this.generateStressTestImpact(),
      liquidityRisk: this.assessLiquidityRisk(),
      survivalDays: Math.floor(Math.random() * 180) + 30,
      recommendations: [
        'Increase cash reserves by 20%',
        'Diversify revenue streams',
        'Negotiate extended payment terms with suppliers',
        'Establish emergency credit line'
      ]
    };

    stressTester.results.push(result);
    stressTester.metrics.tasksCompleted++;
    stressTester.lastActivity = new Date().toISOString();

    return result;
  }

  // Liquidity Monitoring
  async checkLiquidity(data: CashFlowData): Promise<LiquidityAlert[]> {
    const sentinel = this.agents.get('liquidity-sentinel') as LiquiditySentinel;
    
    if (!sentinel) {
      throw new Error('Liquidity Sentinel not available');
    }

    const alerts: LiquidityAlert[] = [];
    const currentBalance = data.closingBalance;

    // Check against thresholds
    for (const threshold of sentinel.thresholds) {
      if (threshold.alertEnabled) {
        if (threshold.type === 'minimum' && currentBalance < threshold.value) {
          alerts.push({
            id: `alert-${Date.now()}`,
            type: 'critical',
            message: `Cash balance (${this.formatCurrency(currentBalance)}) is below minimum threshold (${this.formatCurrency(threshold.value)})`,
            threshold: threshold.value,
            currentValue: currentBalance,
            timestamp: new Date().toISOString(),
            actionRequired: true
          });
        }
      }
    }

    sentinel.alerts = alerts;
    sentinel.metrics.tasksCompleted++;
    sentinel.lastActivity = new Date().toISOString();

    return alerts;
  }

  // Receivables Management
  async processReceivables(data: CashFlowData): Promise<CollectionTask[]> {
    const autopilot = this.agents.get('receivables-autopilot') as ReceivablesAutopilot;
    
    if (!autopilot) {
      throw new Error('Receivables Autopilot not available');
    }

    await this.simulateProcessing(1500);

    // Generate mock collection tasks
    const tasks: CollectionTask[] = [
      {
        id: 'task-1',
        customerId: 'customer-001',
        amount: 15000,
        daysOverdue: 15,
        priority: 'medium',
        status: 'pending',
        nextAction: 'Send payment reminder email',
        automationApplied: true
      },
      {
        id: 'task-2',
        customerId: 'customer-002',
        amount: 8500,
        daysOverdue: 45,
        priority: 'high',
        status: 'in-progress',
        nextAction: 'Schedule collection call',
        automationApplied: false
      }
    ];

    autopilot.collections = tasks;
    autopilot.metrics.tasksCompleted++;
    autopilot.lastActivity = new Date().toISOString();

    return tasks;
  }

  // Orchestration
  async orchestrateAnalysis(data: CashFlowData): Promise<any> {
    if (!this.orchestrator) {
      throw new Error('Central Orchestrator not available');
    }

    // Coordinate all agents
    const [analysis, stressTest, liquidity, receivables] = await Promise.all([
      this.analyzeCashFlow(data),
      this.runStressTest(data, 'economic-downturn'),
      this.checkLiquidity(data),
      this.processReceivables(data)
    ]);

    // Synthesize insights
    const orchestratedInsights = {
      analysis,
      stressTest,
      liquidity,
      receivables,
      synthesis: {
        overallRisk: this.calculateOverallRisk(analysis, stressTest, liquidity),
        priorityActions: this.generatePriorityActions(analysis, liquidity, receivables),
        confidence: 0.92
      }
    };

    this.orchestrator.metrics.tasksCompleted++;
    this.orchestrator.lastActivity = new Date().toISOString();

    return orchestratedInsights;
  }

  // Helper methods
  private async simulateProcessing(delay: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  private calculateHealthScore(data: CashFlowData): number {
    // Simplified health score calculation
    const netFlow = data.netCashFlow;
    const balance = data.closingBalance;
    
    if (balance > 100000 && netFlow > 0) return 85 + Math.random() * 15;
    if (balance > 50000 && netFlow >= 0) return 70 + Math.random() * 15;
    if (balance > 0 && netFlow >= 0) return 55 + Math.random() * 15;
    return 30 + Math.random() * 25;
  }

  private calculateLiquidityRatio(data: CashFlowData): number {
    return Math.random() * 2 + 1; // Mock ratio between 1-3
  }

  private calculateBurnRate(data: CashFlowData): number {
    return Math.abs(data.operatingCashFlow.netOperating) / 30; // Daily burn rate
  }

  private calculateRunwayDays(data: CashFlowData): number {
    const burnRate = this.calculateBurnRate(data);
    return burnRate > 0 ? Math.floor(data.closingBalance / burnRate) : 365;
  }

  private detectSeasonality(data: CashFlowData): any[] {
    return [
      { period: 'Q1', pattern: 'low', variance: 0.15, confidence: 0.8 },
      { period: 'Q2', pattern: 'medium', variance: 0.10, confidence: 0.9 },
      { period: 'Q3', pattern: 'high', variance: 0.20, confidence: 0.85 },
      { period: 'Q4', pattern: 'high', variance: 0.25, confidence: 0.9 }
    ];
  }

  private analyzeTrend(data: CashFlowData): 'improving' | 'declining' | 'stable' {
    if (data.netCashFlow > 10000) return 'improving';
    if (data.netCashFlow < -10000) return 'declining';
    return 'stable';
  }

  private identifyRisks(data: CashFlowData): any[] {
    return [
      {
        id: 'risk-1',
        type: 'concentration',
        severity: 'medium',
        probability: 0.3,
        impact: 25000,
        description: 'High customer concentration risk',
        mitigation: ['Diversify customer base', 'Implement credit limits']
      }
    ];
  }

  private identifyOpportunities(data: CashFlowData): any[] {
    return [
      {
        id: 'opp-1',
        type: 'optimization',
        potential: 15000,
        effort: 'medium',
        timeframe: '3-6 months',
        description: 'Optimize payment terms with suppliers',
        requirements: ['Negotiate with suppliers', 'Update contracts']
      }
    ];
  }

  private generateStressTestImpact(): number[] {
    return Array.from({ length: 12 }, () => Math.random() * 50000 - 25000);
  }

  private assessLiquidityRisk(): 'low' | 'medium' | 'high' | 'critical' {
    const risks = ['low', 'medium', 'high', 'critical'] as const;
    return risks[Math.floor(Math.random() * risks.length)];
  }

  private calculateOverallRisk(analysis: any, stressTest: any, liquidity: any): string {
    if (liquidity.length > 0) return 'high';
    if (analysis.healthScore < 50) return 'medium';
    return 'low';
  }

  private generatePriorityActions(analysis: any, liquidity: any, receivables: any): string[] {
    const actions = [];
    
    if (liquidity.length > 0) {
      actions.push('Address liquidity concerns immediately');
    }
    
    if (analysis.healthScore < 70) {
      actions.push('Improve cash flow management');
    }
    
    if (receivables.length > 0) {
      actions.push('Accelerate receivables collection');
    }
    
    return actions;
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
}

export const agentService = new AgentService();