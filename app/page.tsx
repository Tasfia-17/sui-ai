import { Header } from '@/components/header';
import { VoiceCommand } from '@/components/voice-command';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Shield, Cpu, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen pixel-sky relative overflow-hidden">
      <div className="pixel-clouds fixed inset-0" />
      <div className="pixel-stars fixed inset-0" />
      <div className="pixel-grid fixed inset-0 opacity-50" />
      
      {/* Pixel Sun */}
      <div className="pixel-sun fixed top-16 right-16 w-24 h-24 rounded-full" />
      
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-10">
            {/* Hero Avatar */}
            <div className="pixel-avatar w-32 h-32 mx-auto">
              <Sparkles className="w-16 h-16 text-pink m-auto mt-7" />
            </div>

            <div className="space-y-6">
              <div className="pixel-badge inline-block">
                ✨ AI AGENT PLATFORM
              </div>
              
              <h1 className="text-4xl md:text-6xl font-pixel font-bold leading-tight">
                <span className="pixel-gradient">AUTONOMOUS AI</span>
                <br />
                <span className="text-foreground mt-2 inline-block">ON SUI</span>
              </h1>
              
              <p className="text-sm md:text-base text-foreground/70 max-w-2xl mx-auto leading-relaxed">
                Deploy autonomous AI agents with voice commands.
                <br />Execute complex transactions through natural language.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/onboarding">
                <Button size="lg" className="pixel-btn bg-pink hover:bg-rose text-white font-pixel text-xs px-10 py-7 border-pink">
                  START NOW
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button size="lg" className="pixel-btn bg-white hover:bg-gray-50 text-foreground font-pixel text-xs px-10 py-7 border-pink">
                  EXPLORE
                </Button>
              </Link>
            </div>
          </div>

          {/* Voice Command Demo */}
          <div className="mt-24">
            <div className="text-center mb-8">
              <div className="pixel-badge inline-block mb-4">
                🎤 TRY VOICE COMMANDS
              </div>
            </div>
            <VoiceCommand />
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="pixel-divider mx-auto max-w-4xl" />

      {/* Features Section */}
      <section className="relative py-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="pixel-badge inline-block mb-4">
              ⚡ CORE FEATURES
            </div>
            <h2 className="text-2xl md:text-4xl font-pixel font-bold text-foreground">
              ADVANCED CAPABILITIES
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="pixel-card p-8 text-center">
              <div className="pixel-avatar w-20 h-20 mx-auto mb-6">
                <Zap className="w-10 h-10 text-yellow m-auto mt-4" />
              </div>
              <h3 className="text-sm font-pixel mb-4 text-foreground">VOICE CONTROL</h3>
              <p className="text-xs text-foreground/70 leading-relaxed">
                Command your agents with natural speech. No typing needed.
              </p>
            </div>

            <div className="pixel-card p-8 text-center">
              <div className="pixel-avatar w-20 h-20 mx-auto mb-6">
                <Shield className="w-10 h-10 text-blue m-auto mt-4" />
              </div>
              <h3 className="text-sm font-pixel mb-4 text-foreground">SECURE PTBs</h3>
              <p className="text-xs text-foreground/70 leading-relaxed">
                Safe, atomic transactions on Sui blockchain.
              </p>
            </div>

            <div className="pixel-card p-8 text-center">
              <div className="pixel-avatar w-20 h-20 mx-auto mb-6">
                <Cpu className="w-10 h-10 text-purple m-auto mt-4" />
              </div>
              <h3 className="text-sm font-pixel mb-4 text-foreground">AI POWERED</h3>
              <p className="text-xs text-foreground/70 leading-relaxed">
                GPT-4 intelligence with blockchain execution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="pixel-divider mx-auto max-w-4xl" />

      {/* CTA Section */}
      <section className="relative py-24 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="pixel-card p-12 md:p-16 text-center pixel-glow">
            <div className="pixel-moon w-20 h-20 mx-auto mb-8" />
            
            <div className="pixel-badge inline-block mb-6">
              🚀 GET STARTED
            </div>
            
            <h2 className="text-2xl md:text-4xl font-pixel mb-6 text-foreground">
              DEPLOY YOUR
              <br />
              <span className="pixel-gradient">FIRST AGENT</span>
            </h2>
            
            <p className="text-xs md:text-sm text-foreground/70 mb-10 leading-relaxed max-w-md mx-auto">
              Connect your wallet and deploy your first AI agent in minutes
            </p>
            
            <Link href="/console">
              <Button className="pixel-btn bg-gradient-to-r from-pink via-coral to-purple hover:opacity-90 text-white font-pixel text-xs px-12 py-7 border-pink">
                LAUNCH CONSOLE
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Soft Mountains at bottom */}
      <div className="pixel-mountains fixed bottom-0 left-0 right-0 h-32 opacity-40" />
    </div>
  );
}
