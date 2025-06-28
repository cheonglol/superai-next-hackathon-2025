import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  Zap,
  Shield,
  Target,
  Brain
} from 'lucide-react';
import { agentService } from '@/services/agentService';
import type { Agent, CentralOrchestrator } from '@/types/agents';

interface AgentDashboardProps {
  onAgentSelect: (agentId: string) => void;
}

export const AgentDashboard: React.FC<AgentDashboardProps> = ({ onAgentSelect }) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [orchestrator, setOrchestrator] = useState<CentralOrchestrator | null>(null);
  const [systemStatus, setSystemStatus] = useState<'healthy' | 'warning' | 'critical'>('healthy');

  useEffect(() => {
    loadAgents();
    const interval = setInterval(loadAgents, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const loadAgents = () => {
    const allAgents = agentService.getAllAgents();
    const orchestratorAgent = agentService.getOrchestrator();
    
    setAgents(allAgents.filter(agent => agent.type !== 'orchestrator'));
    setOrchestrator(orchestratorAgent);
    
    // Determine system status
    const hasErrors = allAgents.some(agent => agent.status === 'error');
    const hasWarnings = allAgents.some(agent => agent.status === 'idle');
    
    if (hasErrors) setSystemStatus('critical');
    else if (hasWarnings) setSystemStatus('warning');
    else setSystemStatus('healthy');
  };

  const getAgentIcon = (type: string) => {
    switch (type) {
      case 'diagnostician': return <Activity className="w-5 h-5" />;
      case 'stress-tester': return <Target className="w-5 h-5" />;
      case 'sentinel': return <Shield className="w-5 h-5" />;
      case 'autopilot': return <Zap className="w-5 h-5" />;
      case 'orchestrator': return <Brain className="w-5 h-5" />;
      default: return <Bot className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'idle': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSystemStatusColor = () => {
    switch (systemStatus) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg mr-3">
              <Brain className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Agentic AI System</h2>
              <p className="text-sm text-gray-600">SME Financial Empowerment & Inclusion Platform</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getSystemStatusColor()}`}>
            {systemStatus.charAt(0).toUpperCase() + systemStatus.slice(1)}
          </div>
        </div>

        {/* Central Orchestrator */}
        {orchestrator && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-blue-600 rounded-lg mr-3">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{orchestrator.name}</h3>
                  <p className="text-sm text-gray-600">Coordinating {orchestrator.agents.length} specialized agents</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-600">{orchestrator.metrics.tasksCompleted}</div>
                <div className="text-xs text-gray-600">Tasks Completed</div>
              </div>
            </div>
          </div>
        )}

        {/* Agent Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {agents.map((agent) => (
            <div
              key={agent.id}
              onClick={() => onAgentSelect(agent.id)}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-blue-300"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="p-2 bg-gray-100 rounded-lg mr-2">
                    {getAgentIcon(agent.type)}
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                    {agent.status}
                  </div>
                </div>
              </div>

              <h3 className="font-semibold text-gray-900 mb-1">{agent.name}</h3>
              <p className="text-xs text-gray-600 mb-3">{agent.capabilities.slice(0, 2).join(', ')}</p>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Tasks</span>
                  <span className="font-medium">{agent.metrics.tasksCompleted}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Accuracy</span>
                  <span className="font-medium">{(agent.metrics.accuracy * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Response</span>
                  <span className="font-medium">{agent.metrics.responseTime}s</span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="w-3 h-3 mr-1" />
                  {new Date(agent.lastActivity).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Tasks Processed</p>
              <p className="text-2xl font-bold text-gray-900">
                {agents.reduce((sum, agent) => sum + agent.metrics.tasksCompleted, 0)}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Accuracy</p>
              <p className="text-2xl font-bold text-gray-900">
                {((agents.reduce((sum, agent) => sum + agent.metrics.accuracy, 0) / agents.length) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Agents</p>
              <p className="text-2xl font-bold text-gray-900">
                {agents.filter(agent => agent.status === 'active').length}/{agents.length}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Bot className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};