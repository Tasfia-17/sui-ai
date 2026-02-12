'use client';

import { motion } from 'framer-motion';
import { Agent, AgentStatus } from '../types';
import { cardHover, glowPulse } from '../animations';
import { useState } from 'react';

interface AgentCardProps {
  agent: Agent;
  onClick?: () => void;
}

const statusColors: Record<AgentStatus, string> = {
  active: 'bg-green-500',
  thinking: 'bg-amber-500',
  error: 'bg-red-500',
  idle: 'bg-gray-500',
};

export function AgentCard({ agent, onClick }: AgentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      variants={cardHover}
      initial="rest"
      whileHover="hover"
      onHoverStart={() => setIsExpanded(true)}
      onHoverEnd={() => setIsExpanded(false)}
      onClick={onClick}
      className="relative group cursor-pointer"
    >
      {/* Animated gradient border */}
      <div className="absolute -inset-[1px] bg-gradient-to-r from-sui-teal via-indigo to-sui-teal bg-[length:200%_100%] animate-gradient rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Card content */}
      <div className="relative bg-glass backdrop-blur-glass border border-white/10 rounded-2xl p-6 overflow-hidden">
        {/* Retro grid background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(#00D4AA 1px, transparent 1px), linear-gradient(90deg, #00D4AA 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }} />
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            {/* Avatar placeholder with holographic effect */}
            <div className="relative w-16 h-16 rounded-xl bg-gradient-to-br from-sui-teal/20 to-indigo/20 border border-sui-teal/30 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent animate-gradient" />
              {agent.avatar ? (
                <img src={agent.avatar} alt={agent.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sui-teal font-mono text-2xl">
                  {agent.name[0]}
                </div>
              )}
            </div>

            {/* Status orb */}
            <motion.div
              variants={glowPulse}
              animate="animate"
              className={`w-3 h-3 rounded-full ${statusColors[agent.status]}`}
            />
          </div>

          {/* Agent info */}
          <h3 className="text-xl font-semibold text-white mb-1">{agent.name}</h3>
          <p className="text-sm text-white/60 font-mono mb-3">
            {agent.ptbCount} PTBs executed
          </p>

          {/* Capabilities */}
          <div className="flex flex-wrap gap-2 mb-3">
            {agent.capabilities.slice(0, 3).map((cap, i) => (
              <span
                key={i}
                className="px-2 py-1 text-xs font-mono bg-sui-teal/10 text-sui-teal border border-sui-teal/30 rounded"
              >
                {cap}
              </span>
            ))}
          </div>

          {/* PTB Preview (expanded on hover) */}
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: isExpanded ? 'auto' : 0,
              opacity: isExpanded ? 1 : 0,
            }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-3 border-t border-white/10">
              <p className="text-xs font-mono text-white/40 mb-2">LAST PTB:</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-gradient-to-r from-sui-teal to-indigo rounded-full" />
                </div>
                <span className="text-xs font-mono text-white/60">75%</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Hover glow effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-sui-teal/0 via-sui-teal/5 to-sui-teal/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </motion.div>
  );
}
