'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { VoiceCommand } from '../types';
import { orbPulse, voiceWave, terminalType } from '../animations';

interface VoiceCommandOrbProps {
  isListening?: boolean;
  onCommand?: (command: string) => void;
  currentCommand?: VoiceCommand;
}

export function VoiceCommandOrb({ 
  isListening = false, 
  onCommand,
  currentCommand 
}: VoiceCommandOrbProps) {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    if (!currentCommand) {
      setDisplayText('');
      return;
    }

    let index = 0;
    const text = currentCommand.text;
    const interval = setInterval(() => {
      if (index <= text.length) {
        setDisplayText(text.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [currentCommand]);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Main orb */}
      <div className="relative">
        {/* Outer glow rings */}
        {isListening && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-sui-teal/30"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-indigo/30"
              animate={{
                scale: [1, 1.8, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
          </>
        )}

        {/* Central orb */}
        <motion.button
          variants={orbPulse}
          animate={isListening ? 'animate' : 'rest'}
          onClick={() => onCommand?.('test')}
          className={`relative w-32 h-32 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${
            isListening 
              ? 'bg-gradient-to-br from-sui-teal to-indigo shadow-[0_0_60px_rgba(0,212,170,0.6)]' 
              : 'bg-glass backdrop-blur-glass border-2 border-white/20 hover:border-sui-teal/50'
          }`}
        >
          {/* Voice wave visualization */}
          {isListening && (
            <div className="flex items-center justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={voiceWave}
                  animate="animate"
                  className="w-1 h-8 bg-white rounded-full"
                />
              ))}
            </div>
          )}

          {/* Mic icon when not listening */}
          {!isListening && (
            <svg className="w-12 h-12 text-sui-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          )}
        </motion.button>

        {/* Retro grid overlay */}
        <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(#00D4AA 1px, transparent 1px), linear-gradient(90deg, #00D4AA 1px, transparent 1px)',
            backgroundSize: '8px 8px'
          }} />
        </div>
      </div>

      {/* Command text display */}
      <div className="w-full max-w-md">
        {displayText && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-glass backdrop-blur-glass border border-white/10 rounded-xl p-4"
          >
            {/* Terminal header */}
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10">
              <span className="text-xs font-mono text-sui-teal">VOICE_INPUT</span>
              <div className="flex-1" />
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>

            {/* Typing text */}
            <div className="font-mono text-sm text-white">
              <span className="text-white/40">{'>'}</span>{' '}
              {displayText.split('').map((char, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={terminalType}
                  initial="hidden"
                  animate="visible"
                >
                  {char}
                </motion.span>
              ))}
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-2 h-4 bg-sui-teal ml-1"
              />
            </div>

            {/* Confidence meter */}
            {currentCommand && (
              <div className="mt-3 pt-3 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-white/40">CONFIDENCE:</span>
                  <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-sui-teal to-indigo rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${currentCommand.confidence * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <span className="text-xs font-mono text-sui-teal">
                    {Math.round(currentCommand.confidence * 100)}%
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Hint text */}
        {!isListening && !displayText && (
          <p className="text-center text-sm font-mono text-white/40">
            Click to activate voice command
          </p>
        )}
      </div>
    </div>
  );
}
