'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Agent, PTBTransaction } from '../types';
import { AgentCard } from './AgentCard';
import { PTBVisualizer } from './PTBVisualizer';
import { VoiceCommandOrb } from './VoiceCommandOrb';
import { useState } from 'react';
import { pageTransition, staggerContainer, staggerItem } from '../animations';

interface AgentConsoleProps {
  agents: Agent[];
  activePTB?: PTBTransaction;
  onAgentSelect?: (agent: Agent) => void;
}

export function AgentConsole({ agents, activePTB, onAgentSelect }: AgentConsoleProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [agentThoughts, setAgentThoughts] = useState<string[]>([
    'Initializing agent protocols...',
    'Connecting to Sui network...',
    'Ready for commands.',
  ]);

  return (
    <div className="min-h-screen bg-space-gradient relative overflow-hidden">
      {/* Retro grid background */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(#00D4AA 1px, transparent 1px), linear-gradient(90deg, #00D4AA 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Main layout */}
      <div className="relative z-10 flex h-screen">
        {/* Left Sidebar - Agent List */}
        <motion.aside
          initial={false}
          animate={{ width: isSidebarCollapsed ? 80 : 320 }}
          className="border-r border-white/10 bg-glass backdrop-blur-glass flex flex-col"
        >
          {/* Sidebar header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            {!isSidebarCollapsed && (
              <h2 className="text-lg font-mono text-sui-teal">AGENTS</h2>
            )}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isSidebarCollapsed ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
              </svg>
            </button>
          </div>

          {/* Agent list */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="flex-1 overflow-y-auto p-4 space-y-3"
          >
            {agents.map((agent) => (
              <motion.div
                key={agent.id}
                variants={staggerItem}
                onClick={() => {
                  setSelectedAgent(agent);
                  onAgentSelect?.(agent);
                }}
              >
                {isSidebarCollapsed ? (
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sui-teal/20 to-indigo/20 border border-sui-teal/30 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                    <span className="text-sui-teal font-mono">{agent.name[0]}</span>
                  </div>
                ) : (
                  <AgentCard agent={agent} />
                )}
              </motion.div>
            ))}
          </motion.div>
        </motion.aside>

        {/* Main Area - PTB Visualization */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="border-b border-white/10 bg-glass backdrop-blur-glass p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">
                  Sui Agent <span className="text-sui-teal">OS</span>
                </h1>
                <p className="text-sm font-mono text-white/60">
                  Autonomous AI Agents on Sui Blockchain
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 bg-sui-teal/10 border border-sui-teal/30 rounded-lg">
                  <span className="text-xs font-mono text-sui-teal">MAINNET</span>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </div>
            </div>
          </header>

          {/* Content area */}
          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              {activePTB ? (
                <motion.div
                  key="ptb"
                  {...pageTransition}
                >
                  <PTBVisualizer transaction={activePTB} isExecuting />
                </motion.div>
              ) : (
                <motion.div
                  key="voice"
                  {...pageTransition}
                  className="h-full flex items-center justify-center"
                >
                  <VoiceCommandOrb />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* Right Panel - Agent Thoughts */}
        <aside className="w-80 border-l border-white/10 bg-glass backdrop-blur-glass flex flex-col">
          {/* Panel header */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <span className="text-xs font-mono text-white/40 ml-2">
                AGENT_CONSOLE
              </span>
            </div>
          </div>

          {/* Terminal output */}
          <div className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-2">
            {agentThoughts.map((thought, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-sui-teal"
              >
                <span className="text-white/40">{'>'}</span> {thought}
              </motion.div>
            ))}
            <motion.div
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block w-2 h-4 bg-sui-teal"
            />
          </div>

          {/* Selected agent info */}
          {selectedAgent && (
            <div className="p-4 border-t border-white/10">
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-xs font-mono text-white/40 mb-2">SELECTED:</p>
                <p className="text-sm font-semibold text-white">{selectedAgent.name}</p>
                <p className="text-xs font-mono text-sui-teal mt-1">
                  {selectedAgent.status.toUpperCase()}
                </p>
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Bottom bar - Quick actions */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-glass backdrop-blur-glass p-4">
        <div className="flex items-center justify-center gap-4">
          <button className="px-4 py-2 bg-sui-teal/10 hover:bg-sui-teal/20 border border-sui-teal/30 rounded-lg text-sm font-mono text-sui-teal transition-colors">
            Deploy Agent
          </button>
          <button className="px-4 py-2 bg-indigo/10 hover:bg-indigo/20 border border-indigo/30 rounded-lg text-sm font-mono text-indigo transition-colors">
            Execute PTB
          </button>
          <button className="px-4 py-2 bg-amber/10 hover:bg-amber/20 border border-amber/30 rounded-lg text-sm font-mono text-amber transition-colors">
            View Marketplace
          </button>
        </div>
      </div>
    </div>
  );
}
