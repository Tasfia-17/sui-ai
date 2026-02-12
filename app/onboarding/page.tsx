'use client';

import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, Shield, Rocket, CheckCircle, Lock, Eye, Cpu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: 'WELCOME TO',
      subtitle: 'SUI AGENT OS',
      description: 'Deploy autonomous AI agents on Sui blockchain with voice commands',
      icon: Sparkles,
      bg: 'pixel-sky',
      features: [
        { icon: Zap, text: 'Voice-controlled agents', color: 'emerald' },
        { icon: Shield, text: 'Secure PTB execution', color: 'sky' },
        { icon: Cpu, text: 'GPT-4 powered AI', color: 'purple' },
      ],
      decoration: 'sun',
    },
    {
      title: 'CHOOSE YOUR',
      subtitle: 'PATH',
      description: 'Browse pre-built agents or create your own custom agent',
      icon: Rocket,
      bg: 'pixel-ocean',
      features: [
        { icon: CheckCircle, text: '6 ready-to-deploy agents', color: 'emerald' },
        { icon: Sparkles, text: 'No-code agent builder', color: 'purple' },
        { icon: Zap, text: 'Deploy in seconds', color: 'gold' },
      ],
      decoration: 'waves',
    },
    {
      title: 'SECURE &',
      subtitle: 'SAFE',
      description: 'Your keys, your control. Demo mode for safe testing',
      icon: Shield,
      bg: 'pixel-sky',
      features: [
        { icon: Lock, text: 'Keys stored locally only', color: 'sky' },
        { icon: Eye, text: 'Demo mode included', color: 'gold' },
        { icon: Shield, text: 'Open source & audited', color: 'emerald' },
      ],
      decoration: 'moon',
    },
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem('onboardingComplete', 'true');
      router.push('/marketplace');
    }
  };

  const handleSkip = () => {
    localStorage.setItem('onboardingComplete', 'true');
    router.push('/marketplace');
  };

  const CurrentIcon = steps[step].icon;

  return (
    <div className={`min-h-screen ${steps[step].bg} relative overflow-hidden`}>
      {/* Complex Background Layers */}
      <div className="pixel-grid fixed inset-0 opacity-30" />
      <div className="pixel-stars fixed inset-0" />
      <div className="pixel-clouds fixed inset-0" />
      
      {/* Decorative Elements */}
      {steps[step].decoration === 'sun' && (
        <div className="pixel-sun fixed top-16 right-16 w-32 h-32 rounded-full" />
      )}
      {steps[step].decoration === 'moon' && (
        <div className="pixel-moon fixed top-16 left-16 w-24 h-24" />
      )}
      {steps[step].decoration === 'waves' && (
        <div className="pixel-waves fixed bottom-0 left-0 right-0 h-32 opacity-60" />
      )}
      
      {/* Mountains */}
      <div className="pixel-mountains fixed bottom-0 left-0 right-0 h-40 opacity-30" />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.4 }}
          className="relative min-h-screen flex items-center justify-center px-6 py-20"
        >
          <div className="pixel-card p-10 md:p-16 max-w-3xl w-full pixel-glow">
            {/* Avatar */}
            <div className="pixel-avatar w-28 h-28 mx-auto mb-8">
              <CurrentIcon className="w-14 h-14 text-purple m-auto mt-6" />
            </div>

            {/* Badge */}
            <div className="text-center mb-6">
              <div className="pixel-badge inline-block">
                STEP {step + 1} OF {steps.length}
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-pixel font-bold text-center mb-3 text-foreground leading-tight">
              {steps[step].title}
            </h1>
            <h2 className="text-2xl md:text-4xl font-pixel font-bold text-center mb-6">
              <span className="pixel-gradient">{steps[step].subtitle}</span>
            </h2>
            
            {/* Description */}
            <p className="text-sm text-foreground/70 text-center mb-10 leading-relaxed max-w-xl mx-auto">
              {steps[step].description}
            </p>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-4 mb-10">
              {steps[step].features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="pixel-card p-6 text-center border-2"
                  style={{ borderColor: `var(--${feature.color})` }}
                >
                  <feature.icon className={`w-8 h-8 mx-auto mb-3 text-${feature.color}`} />
                  <p className="text-xs font-pixel leading-relaxed">{feature.text}</p>
                </motion.div>
              ))}
            </div>

            {/* Progress Dots */}
            <div className="flex gap-3 justify-center mb-10">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-3 border-2 transition-all ${
                    i === step 
                      ? 'w-16 bg-purple border-purple' 
                      : i < step 
                      ? 'w-3 bg-emerald border-emerald'
                      : 'w-3 bg-transparent border-sky'
                  }`}
                />
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleSkip}
                className="pixel-btn bg-white hover:bg-gray-50 text-foreground font-pixel text-xs px-8 py-6 border-sky"
                style={{ border: '3px solid #87CEEB' }}
              >
                SKIP INTRO
              </Button>
              <Button
                onClick={handleNext}
                className="pixel-btn bg-purple hover:bg-lavender text-white font-pixel text-xs px-8 py-6 border-purple"
                style={{ border: '3px solid #A78BFA' }}
              >
                {step === steps.length - 1 ? 'GET STARTED' : 'NEXT'}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>

            {/* Security Note */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 p-4 bg-emerald/10 border-2 border-emerald text-center"
              >
                <Lock className="w-5 h-5 mx-auto mb-2 text-emerald" />
                <p className="text-xs text-foreground/70 leading-relaxed">
                  🔒 Your API keys never leave your browser. All data is stored locally.
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
