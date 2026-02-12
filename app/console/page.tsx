'use client';

import { Header } from '@/components/header';
import { VoiceCommand } from '@/components/voice-command';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Play, Pause, Terminal, ArrowRight, Sparkles } from 'lucide-react';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ConsoleContent() {
  const searchParams = useSearchParams();
  const agentId = searchParams.get('agent');
  const deployed = searchParams.get('deployed');
  const [isRunning, setIsRunning] = useState(false);
  const [agentConfig, setAgentConfig] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([
    '> Agent OS initialized',
    '> Connecting to Sui testnet...',
    '> Ready for commands',
  ]);

  useEffect(() => {
    if (agentId === 'custom') {
      const stored = localStorage.getItem('customAgent');
      if (stored) {
        try {
          const config = JSON.parse(stored);
          setAgentConfig(config);
          setLogs(prev => [
            ...prev,
            `> Loading custom agent: ${config.name || 'Unnamed'}`,
            `> Type: ${config.type ? config.type.toUpperCase() : 'CUSTOM'}`,
            `> Capabilities: ${config.capabilities?.length || 0} enabled`,
            `> Mode: ${config.useDemo ? 'DEMO (Safe)' : 'LIVE'}`,
            `> Agent ready for deployment`,
          ]);
          
          if (deployed) {
            setTimeout(() => {
              setLogs(prev => [...prev, '> ✓ Agent deployed successfully!']);
            }, 500);
          }
        } catch (error) {
          console.error('Failed to load agent config:', error);
          setLogs(prev => [...prev, '> Error loading agent configuration']);
        }
      }
    } else if (agentId) {
      setLogs(prev => [...prev, `> Loading agent #${agentId}...`, `> Agent #${agentId} ready`]);
    }
  }, [agentId, deployed]);

  const handleStart = () => {
    setIsRunning(true);
    setLogs(prev => [
      ...prev,
      '> Starting agent...',
      '> Initializing AI engine...',
      '> Connecting to Sui RPC...',
      '> ✓ Agent is now running',
      '> Listening for voice commands...',
    ]);
    
    // Demo simulation
    setTimeout(() => {
      setLogs(prev => [...prev, '> Demo: Monitoring gas prices...']);
    }, 3000);
    
    setTimeout(() => {
      setLogs(prev => [...prev, '> Demo: Found optimal swap route']);
    }, 6000);
  };

  const handlePause = () => {
    setIsRunning(false);
    setLogs(prev => [...prev, '> Agent paused']);
  };

  return (
    <div className="min-h-screen pixel-ocean relative overflow-hidden">
      <div className="pixel-waves fixed bottom-0 left-0 right-0 h-24 opacity-60" />
      <div className="pixel-grid fixed inset-0 opacity-30" />
      <Header />

      <div className="relative pt-32 pb-24 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <div className="pixel-avatar w-24 h-24 mx-auto mb-8">
              <Terminal className="w-12 h-12 text-sky m-auto mt-5" />
            </div>
            
            <div className="pixel-badge inline-block mb-6">
              🎮 AGENT CONSOLE
            </div>
            
            <h1 className="text-3xl md:text-5xl font-pixel font-bold mb-6 text-foreground">
              <span className="pixel-gradient">AGENT</span>
              <br />
              <span className="text-foreground mt-2 inline-block">CONSOLE</span>
            </h1>
            
            <p className="text-sm text-foreground/70 max-w-2xl mx-auto leading-relaxed">
              Monitor and control your AI agents
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Voice Command Panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="pixel-card p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Terminal className="w-5 h-5 text-sky" />
                <h2 className="text-sm font-pixel">VOICE COMMANDS</h2>
              </div>
              <VoiceCommand />
              <div className="mt-4 text-xs text-foreground/60 space-y-1">
                <p className="font-pixel mb-2">TRY SAYING:</p>
                <p>• &quot;Swap 10 SUI for USDC&quot;</p>
                <p>• &quot;Check my balance&quot;</p>
                <p>• &quot;Send 5 SUI to...&quot;</p>
              </div>
            </motion.div>

            {/* Agent Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="pixel-card p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-pixel">AGENT STATUS</h2>
                <Button
                  size="sm"
                  onClick={isRunning ? handlePause : handleStart}
                  className={`pixel-btn font-pixel text-xs px-4 py-3 ${
                    isRunning ? 'bg-coral text-white border-coral' : 'bg-emerald text-white border-emerald'
                  }`}
                  style={{ border: `3px solid ${isRunning ? '#FFA07A' : '#50C878'}` }}
                >
                  {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                  {isRunning ? 'PAUSE' : 'START'}
                </Button>
              </div>
              
              <div className="space-y-3">
                {agentConfig && (
                  <>
                    <div className="flex justify-between text-xs">
                      <span className="text-foreground/60">Name</span>
                      <span className="font-pixel text-purple">{agentConfig.name || 'Unnamed'}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-foreground/60">Type</span>
                      <span className="font-pixel text-sky">{agentConfig.type ? agentConfig.type.toUpperCase() : 'CUSTOM'}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-foreground/60">Mode</span>
                      <span className={`pixel-badge ${agentConfig.useDemo ? 'bg-gold/20 text-gold' : 'bg-emerald/20 text-emerald'}`}>
                        {agentConfig.useDemo ? 'DEMO' : 'LIVE'}
                      </span>
                    </div>
                  </>
                )}
                {agentId && !agentConfig && (
                  <div className="flex justify-between text-xs">
                    <span className="text-foreground/60">Agent ID</span>
                    <span className="font-pixel text-purple">#{agentId}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs">
                  <span className="text-foreground/60">Network</span>
                  <span className="font-pixel text-sky">SUI TESTNET</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-foreground/60">Status</span>
                  <span className={`font-pixel ${isRunning ? 'text-emerald' : 'text-coral'}`}>
                    {isRunning ? 'RUNNING' : 'IDLE'}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-foreground/60">Gas Budget</span>
                  <span className="font-pixel">{agentConfig?.gasBudget || '0.1'} SUI</span>
                </div>
              </div>

              {!agentId && (
                <div className="mt-6 p-4 bg-sky/10 border-2 border-sky">
                  <p className="text-xs text-foreground/70 mb-3 leading-relaxed">
                    No agent selected. Deploy one from marketplace or create your own.
                  </p>
                  <div className="flex gap-2">
                    <Link href="/marketplace" className="flex-1">
                      <Button size="sm" className="w-full pixel-btn bg-sky text-white font-pixel text-xs py-3 border-sky" style={{ border: '3px solid #87CEEB' }}>
                        BROWSE
                      </Button>
                    </Link>
                    <Link href="/create" className="flex-1">
                      <Button size="sm" className="w-full pixel-btn bg-purple text-white font-pixel text-xs py-3 border-purple" style={{ border: '3px solid #A78BFA' }}>
                        CREATE
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Console Logs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 pixel-card p-6"
            >
              <h2 className="text-sm font-pixel mb-4">CONSOLE OUTPUT</h2>
              <div className="bg-foreground/5 border-2 border-sky p-4 font-mono text-xs h-64 overflow-y-auto">
                {logs.map((log, i) => (
                  <div key={i} className={`mb-1 ${log.includes('✓') ? 'text-emerald' : 'text-foreground/80'}`}>
                    {log}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Transaction Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2 pixel-card p-6"
            >
              <h2 className="text-sm font-pixel mb-4">TRANSACTION PREVIEW</h2>
              <div className="bg-foreground/5 border-2 border-purple p-8 text-center">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-purple" />
                <p className="text-xs text-foreground/60">
                  Execute a voice command to see the transaction structure
                </p>
              </div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex justify-center gap-4"
          >
            <Link href="/marketplace">
              <Button className="pixel-btn bg-white text-foreground font-pixel text-xs px-6 py-5 border-sky" style={{ border: '3px solid #87CEEB' }}>
                MARKETPLACE
              </Button>
            </Link>
            <Link href="/create">
              <Button className="pixel-btn bg-gradient-to-r from-sky via-purple to-emerald text-white font-pixel text-xs px-6 py-5 border-sky" style={{ border: '3px solid #87CEEB' }}>
                CREATE NEW
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function Console() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground font-pixel">Loading...</div>
      </div>
    }>
      <ConsoleContent />
    </Suspense>
  );
}
