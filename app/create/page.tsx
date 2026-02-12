'use client';

import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Sparkles, Code, Zap, ArrowRight, CheckCircle, Rocket, Shield, Cpu, Key } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { sanitizeInput, validateAgentConfig, secureStore, logSecurityEvent } from '@/lib/security';

export default function CreateAgent() {
  const router = useRouter();
  const [agentName, setAgentName] = useState('');
  const [agentType, setAgentType] = useState('defi');
  const [capabilities, setCapabilities] = useState<string[]>([]);
  const [gasBudget, setGasBudget] = useState('0.1');
  const [description, setDescription] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [useDemo, setUseDemo] = useState(true);
  const [isDeploying, setIsDeploying] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const agentTypes = [
    { id: 'defi', label: 'DeFi', icon: Zap, color: 'emerald', desc: 'Trading & swaps' },
    { id: 'nft', label: 'NFT', icon: Sparkles, color: 'purple', desc: 'Collections' },
    { id: 'custom', label: 'Custom', icon: Code, color: 'sky', desc: 'Your logic' },
  ];

  const capabilityOptions = [
    { id: 'swap', label: 'Execute Swaps', icon: Zap },
    { id: 'liquidity', label: 'Manage Liquidity', icon: Shield },
    { id: 'monitor', label: 'Monitor Prices', icon: Cpu },
    { id: 'notify', label: 'Send Notifications', icon: Sparkles },
  ];

  const toggleCapability = (id: string) => {
    setCapabilities(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleDeploy = async () => {
    // Sanitize inputs
    const sanitizedName = sanitizeInput(agentName.trim());
    const sanitizedDesc = sanitizeInput(description.trim());
    
    // Create agent config
    const agentConfig = {
      name: sanitizedName,
      type: agentType || 'custom',
      capabilities: capabilities || [],
      gasBudget: gasBudget || '0.1',
      description: sanitizedDesc,
      useDemo: useDemo,
      apiKey: useDemo ? 'DEMO_MODE' : (apiKey || ''),
      createdAt: new Date().toISOString(),
    };
    
    // Validate configuration
    const validation = validateAgentConfig(agentConfig);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }
    
    setErrors([]);
    setIsDeploying(true);
    
    try {
      // Log security event
      logSecurityEvent('agent_deployment', {
        type: agentType,
        useDemo,
        capabilitiesCount: capabilities.length,
      });
      
      // Simulate deployment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Store securely
      secureStore('customAgent', agentConfig);
      
      // Verify storage
      const stored = localStorage.getItem('customAgent');
      if (!stored) {
        throw new Error('Failed to save agent configuration');
      }
      
      setIsDeploying(false);
      router.push('/console?agent=custom&deployed=true');
    } catch (error) {
      console.error('Deployment error:', error);
      setErrors(['Failed to deploy agent. Please try again.']);
      setIsDeploying(false);
    }
  };

  return (
    <div className="min-h-screen pixel-sky relative overflow-hidden">
      <div className="pixel-grid fixed inset-0 opacity-30" />
      <div className="pixel-stars fixed inset-0" />
      <div className="pixel-sun fixed top-16 right-16 w-24 h-24 rounded-full" />
      
      <Header />

      <div className="relative pt-32 pb-24 px-6">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="pixel-avatar w-24 h-24 mx-auto mb-8">
              <Rocket className="w-12 h-12 text-purple m-auto mt-5" />
            </div>
            
            <div className="pixel-badge inline-block mb-6">
              🛠️ AGENT BUILDER
            </div>
            
            <h1 className="text-3xl md:text-5xl font-pixel font-bold mb-6 text-foreground">
              <span className="pixel-gradient">BUILD CUSTOM</span>
              <br />
              <span className="text-foreground mt-2 inline-block">AGENT</span>
            </h1>
            
            <p className="text-sm text-foreground/70 max-w-2xl mx-auto leading-relaxed">
              Build a custom AI agent with no code required
            </p>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="pixel-card p-8 md:p-12 space-y-8"
          >
            {/* Agent Name */}
            <div>
              <label className="block text-sm font-pixel mb-3 text-foreground">AGENT NAME *</label>
              <input
                type="text"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                placeholder="My Trading Agent"
                className="w-full bg-white border-3 border-sky px-4 py-4 text-sm focus:outline-none focus:border-purple transition-colors"
                style={{ border: '3px solid #87CEEB' }}
              />
            </div>

            {/* Agent Type */}
            <div>
              <label className="block text-sm font-pixel mb-4 text-foreground">AGENT TYPE</label>
              <div className="grid grid-cols-3 gap-4">
                {agentTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setAgentType(type.id)}
                    className={`p-6 border-3 transition-all ${
                      agentType === type.id
                        ? 'border-purple bg-purple/10'
                        : 'border-sky bg-white hover:border-purple/50'
                    }`}
                    style={{ border: `3px solid ${agentType === type.id ? '#A78BFA' : '#87CEEB'}` }}
                  >
                    <type.icon className={`w-8 h-8 mx-auto mb-3 text-${type.color}`} />
                    <div className="text-xs font-pixel mb-1">{type.label}</div>
                    <div className="text-xs text-foreground/60">{type.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Capabilities */}
            <div>
              <label className="block text-sm font-pixel mb-4 text-foreground">CAPABILITIES</label>
              <div className="grid grid-cols-2 gap-3">
                {capabilityOptions.map((cap) => (
                  <button
                    key={cap.id}
                    onClick={() => toggleCapability(cap.id)}
                    className={`p-4 border-3 flex items-center gap-3 transition-all ${
                      capabilities.includes(cap.id)
                        ? 'border-emerald bg-emerald/10'
                        : 'border-sky bg-white hover:border-emerald/50'
                    }`}
                    style={{ border: `3px solid ${capabilities.includes(cap.id) ? '#50C878' : '#87CEEB'}` }}
                  >
                    <div className={`w-6 h-6 border-2 flex items-center justify-center ${
                      capabilities.includes(cap.id) ? 'border-emerald bg-emerald' : 'border-sky'
                    }`}>
                      {capabilities.includes(cap.id) && (
                        <CheckCircle className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span className="text-xs font-pixel">{cap.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Gas Budget */}
            <div>
              <label className="block text-sm font-pixel mb-3 text-foreground">GAS BUDGET (SUI)</label>
              <input
                type="number"
                value={gasBudget}
                onChange={(e) => setGasBudget(e.target.value)}
                step="0.01"
                min="0.01"
                className="w-full bg-white border-3 border-sky px-4 py-4 text-sm focus:outline-none focus:border-purple transition-colors"
                style={{ border: '3px solid #87CEEB' }}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-pixel mb-3 text-foreground">DESCRIPTION</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what your agent should do..."
                className="w-full bg-white border-3 border-sky px-4 py-4 text-sm focus:outline-none focus:border-purple transition-colors resize-none"
                style={{ border: '3px solid #87CEEB' }}
              />
            </div>

            {/* Divider */}
            <div className="pixel-divider" />

            {/* API Key Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Key className="w-5 h-5 text-gold" />
                <label className="text-sm font-pixel text-foreground">AI CONFIGURATION</label>
              </div>
              
              {/* Demo Mode Toggle */}
              <button
                onClick={() => setUseDemo(!useDemo)}
                className={`w-full p-4 border-3 flex items-center justify-between transition-all ${
                  useDemo ? 'border-gold bg-gold/10' : 'border-sky bg-white'
                }`}
                style={{ border: `3px solid ${useDemo ? '#FFD700' : '#87CEEB'}` }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 border-2 flex items-center justify-center ${
                    useDemo ? 'border-gold bg-gold' : 'border-sky'
                  }`}>
                    {useDemo && <CheckCircle className="w-4 h-4 text-white" />}
                  </div>
                  <span className="text-xs font-pixel">USE DEMO MODE</span>
                </div>
                <span className="pixel-badge text-xs">SAFE</span>
              </button>

              {!useDemo && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-3"
                >
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-..."
                    className="w-full bg-white border-3 border-gold px-4 py-4 text-sm focus:outline-none focus:border-purple transition-colors"
                    style={{ border: '3px solid #FFD700' }}
                  />
                  <p className="text-xs text-foreground/60 leading-relaxed">
                    🔒 Your API key is stored locally and never sent to our servers
                  </p>
                </motion.div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button
                onClick={handleDeploy}
                disabled={!agentName || isDeploying}
                className="flex-1 pixel-btn bg-purple hover:bg-lavender text-white font-pixel text-xs py-6 border-purple disabled:opacity-50"
                style={{ border: '3px solid #A78BFA' }}
              >
                {isDeploying ? 'DEPLOYING...' : 'DEPLOY AGENT'}
                {!isDeploying && <ArrowRight className="ml-2 w-4 h-4" />}
              </Button>
              <Button
                onClick={() => router.push('/marketplace')}
                className="flex-1 pixel-btn bg-white hover:bg-gray-50 text-foreground font-pixel text-xs py-6 border-sky"
                style={{ border: '3px solid #87CEEB' }}
              >
                CANCEL
              </Button>
            </div>

            {/* Error Messages */}
            {errors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-coral/10 border-2 border-coral"
              >
                <p className="text-xs font-pixel text-coral mb-2">ERRORS:</p>
                {errors.map((error, i) => (
                  <p key={i} className="text-xs text-foreground/70">• {error}</p>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {[
              { icon: Sparkles, title: 'NO CODE', desc: 'Visual builder', color: 'purple' },
              { icon: Zap, title: 'FAST', desc: 'Deploy in seconds', color: 'emerald' },
              { icon: Shield, title: 'SAFE', desc: 'Demo mode included', color: 'sky' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="pixel-card p-6 text-center"
              >
                <feature.icon className={`w-8 h-8 mx-auto mb-3 text-${feature.color}`} />
                <h3 className="text-xs font-pixel mb-1">{feature.title}</h3>
                <p className="text-xs text-foreground/60">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="pixel-mountains fixed bottom-0 left-0 right-0 h-32 opacity-40" />
    </div>
  );
}
