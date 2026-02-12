// Type definitions for Sui Agent OS Design System

export type AgentStatus = 'active' | 'thinking' | 'error' | 'idle';

export interface Agent {
  id: string;
  name: string;
  avatar?: string;
  status: AgentStatus;
  capabilities: string[];
  lastActive: Date;
  ptbCount: number;
}

export interface PTBStep {
  id: string;
  label: string;
  icon: string;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  timestamp?: Date;
}

export interface PTBTransaction {
  id: string;
  steps: PTBStep[];
  agentId: string;
  startTime: Date;
  endTime?: Date;
}

export interface VoiceCommand {
  text: string;
  timestamp: Date;
  confidence: number;
}
