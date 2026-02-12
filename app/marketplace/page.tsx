'use client';

import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Zap, Star, ArrowRight, Sparkles, Flame, Droplet, Heart, Rocket, Gem } from 'lucide-react';
import Link from 'next/link';

const agents = [
  { id: 1, name: 'DEFI TRADER', description: 'Automated trading strategies', price: '10 SUI', rating: 4.8, icon: Flame, color: 'coral' },
  { id: 2, name: 'NFT SCOUT', description: 'Find trending collections', price: '5 SUI', rating: 4.6, icon: Gem, color: 'purple' },
  { id: 3, name: 'PORTFOLIO', description: 'Track all your assets', price: '8 SUI', rating: 4.9, icon: Heart, color: 'pink' },
  { id: 4, name: 'YIELD OPT', description: 'Maximize lending returns', price: '12 SUI', rating: 4.7, icon: Rocket, color: 'yellow' },
  { id: 5, name: 'GAS SAVER', description: 'Smart transaction batching', price: '6 SUI', rating: 4.5, icon: Droplet, color: 'blue' },
  { id: 6, name: 'LP MANAGER', description: 'Auto liquidity positions', price: '15 SUI', rating: 4.8, icon: Zap, color: 'mint' },
];

export default function Marketplace() {
  return (
    <div className="min-h-screen pixel-ocean relative overflow-hidden">
      <div className="pixel-waves fixed bottom-0 left-0 right-0 h-24 opacity-60" />
      <div className="pixel-grid fixed inset-0 opacity-30" />
      <Header />

      <div className="relative pt-32 pb-24 px-6">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="text-center mb-20">
            <div className="pixel-avatar w-24 h-24 mx-auto mb-8">
              <Sparkles className="w-12 h-12 text-pink m-auto mt-5" />
            </div>
            
            <div className="pixel-badge inline-block mb-6">
              🎮 AGENT MARKETPLACE
            </div>
            
            <h1 className="text-3xl md:text-5xl font-pixel font-bold mb-6 text-foreground">
              <span className="pixel-gradient">AGENT</span>
              <br />
              <span className="text-foreground mt-2 inline-block">MARKETPLACE</span>
            </h1>
            
            <p className="text-sm text-foreground/70 max-w-2xl mx-auto leading-relaxed">
              Pre-built AI agents ready to deploy on Sui blockchain
            </p>
          </div>

          {/* Agent Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {agents.map((agent, index) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="pixel-card p-8"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="pixel-avatar w-16 h-16">
                    <agent.icon className={`w-8 h-8 text-${agent.color} m-auto mt-3`} />
                  </div>
                  <div className="pixel-badge">
                    <Star className="w-3 h-3 inline text-yellow fill-yellow mr-1" />
                    {agent.rating}
                  </div>
                </div>
                
                <h3 className="text-xs font-pixel mb-3 text-foreground">{agent.name}</h3>
                <p className="text-xs text-foreground/70 mb-6 leading-relaxed">{agent.description}</p>
                
                <div className="flex items-center justify-between mb-6">
                  <span className="text-pink font-pixel text-sm">{agent.price}</span>
                  <div className="pixel-badge text-xs">
                    READY
                  </div>
                </div>

                <Link href={`/console?agent=${agent.id}`}>
                  <Button className="w-full pixel-btn bg-pink hover:bg-rose text-white font-pixel text-xs py-6 border-pink">
                    DEPLOY NOW
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Divider */}
          <div className="pixel-divider mx-auto max-w-4xl mb-16" />

          {/* Custom Agent CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            className="pixel-card p-12 md:p-16 text-center pixel-glow max-w-3xl mx-auto"
          >
            <div className="pixel-sun w-20 h-20 mx-auto mb-8 rounded-full" />
            
            <div className="pixel-badge inline-block mb-6">
              ✨ BUILD CUSTOM
            </div>
            
            <h2 className="text-2xl md:text-4xl font-pixel mb-6 text-foreground">
              BUILD YOUR
              <br />
              <span className="pixel-gradient">CUSTOM AGENT</span>
            </h2>
            
            <p className="text-xs md:text-sm text-foreground/70 mb-10 leading-relaxed max-w-md mx-auto">
              Use our no-code builder to create a custom AI agent tailored to your needs
            </p>
            
            <Link href="/create">
              <Button className="pixel-btn bg-gradient-to-r from-blue via-mint to-purple hover:opacity-90 text-white font-pixel text-xs px-12 py-7 border-blue">
                START BUILDING
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
