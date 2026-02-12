'use client';

import { motion } from 'framer-motion';
import { PTBTransaction, PTBStep } from '../types';
import { staggerContainer, staggerItem } from '../animations';
import { useEffect, useState } from 'react';

interface PTBVisualizerProps {
  transaction: PTBTransaction;
  isExecuting?: boolean;
}

const stepIcons: Record<string, string> = {
  init: '⚡',
  validate: '✓',
  execute: '⚙️',
  confirm: '✨',
  complete: '🎯',
};

const statusColors = {
  pending: 'border-white/20 bg-white/5',
  executing: 'border-amber-500 bg-amber-500/10 animate-pulse',
  completed: 'border-sui-teal bg-sui-teal/10',
  failed: 'border-red-500 bg-red-500/10',
};

export function PTBVisualizer({ transaction, isExecuting }: PTBVisualizerProps) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (!isExecuting) return;
    
    const interval = setInterval(() => {
      setActiveStep(prev => {
        if (prev >= transaction.steps.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [isExecuting, transaction.steps.length]);

  return (
    <div className="relative bg-glass backdrop-blur-glass border border-white/10 rounded-2xl p-6">
      {/* Terminal header */}
      <div className="flex items-center gap-2 mb-6 pb-3 border-b border-white/10">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/50" />
          <div className="w-3 h-3 rounded-full bg-amber-500/50" />
          <div className="w-3 h-3 rounded-full bg-green-500/50" />
        </div>
        <span className="text-xs font-mono text-white/40 ml-2">
          PTB_EXEC_{transaction.id.slice(0, 8)}
        </span>
      </div>

      {/* Timeline */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="relative"
      >
        {/* Connection line */}
        <div className="absolute top-8 left-0 right-0 h-[2px] bg-white/10">
          <motion.div
            className="h-full bg-gradient-to-r from-sui-teal to-indigo"
            initial={{ width: '0%' }}
            animate={{ width: `${(activeStep / (transaction.steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {transaction.steps.map((step, index) => {
            const isActive = index <= activeStep;
            const isCurrent = index === activeStep;

            return (
              <motion.div
                key={step.id}
                variants={staggerItem}
                className="flex flex-col items-center gap-3 flex-1"
              >
                {/* Step node */}
                <motion.div
                  className={`relative w-16 h-16 rounded-xl border-2 ${
                    statusColors[step.status]
                  } flex items-center justify-center transition-all duration-300`}
                  animate={isCurrent ? {
                    scale: [1, 1.1, 1],
                    transition: { duration: 1, repeat: Infinity }
                  } : {}}
                >
                  {/* Glow effect for active step */}
                  {isCurrent && (
                    <motion.div
                      className="absolute inset-0 rounded-xl bg-sui-teal/20"
                      animate={{
                        scale: [1, 1.5],
                        opacity: [0.5, 0],
                      }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  )}

                  <span className="text-2xl relative z-10">
                    {stepIcons[step.icon] || '○'}
                  </span>

                  {/* Status indicator */}
                  {step.status === 'completed' && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-sui-teal rounded-full flex items-center justify-center">
                      <span className="text-[10px]">✓</span>
                    </div>
                  )}
                </motion.div>

                {/* Step label */}
                <div className="text-center">
                  <p className={`text-sm font-mono transition-colors ${
                    isActive ? 'text-white' : 'text-white/40'
                  }`}>
                    {step.label}
                  </p>
                  {step.timestamp && (
                    <p className="text-xs font-mono text-white/30 mt-1">
                      {step.timestamp.toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Terminal output */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="font-mono text-xs text-sui-teal space-y-1">
          {transaction.steps.slice(0, activeStep + 1).map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <span className="text-white/40">{'>'}</span> {step.label}...{' '}
              <span className="text-green-400">OK</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
