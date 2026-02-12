'use client';

import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';

export function Header() {
  const account = useCurrentAccount();

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 glass-card"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sui-teal to-indigo flex items-center justify-center">
              <span className="text-2xl">🤖</span>
            </div>
            <div>
              <h1 className="text-xl font-display font-bold text-white">
                Sui Agent <span className="text-sui-teal">OS</span>
              </h1>
              <p className="text-xs text-muted-foreground font-mono">v1.0.0</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/marketplace" className="text-sm text-muted-foreground hover:text-sui-teal transition-colors">
              Marketplace
            </Link>
            <Link href="/console" className="text-sm text-muted-foreground hover:text-sui-teal transition-colors">
              Console
            </Link>
            <Link href="/create" className="text-sm text-muted-foreground hover:text-sui-teal transition-colors">
              Create Agent
            </Link>
          </nav>

          {/* Wallet Connection */}
          <div className="flex items-center gap-4">
            {account && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sui-teal/10 border border-sui-teal/30">
                <Wallet className="w-4 h-4 text-sui-teal" />
                <span className="text-xs font-mono text-sui-teal">
                  {account.address.slice(0, 6)}...{account.address.slice(-4)}
                </span>
              </div>
            )}
            <ConnectButton />
          </div>
        </div>
      </div>
    </motion.header>
  );
}
