# 🚀 Sui Agent OS - Quick Start Guide

## Prerequisites

- Node.js 18+ and npm
- Sui CLI (optional, for smart contract deployment)
- OpenAI API key

## Step 1: Clone and Install

```bash
cd /home/rifa/sui-agent-os
npm install
```

## Step 2: Environment Setup

Create `.env.local` file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
# OpenAI API Key (required for AI features)
OPENAI_API_KEY=sk-your-key-here

# Sui Network
SUI_NETWORK=testnet

# Agent OS Package ID (after deployment)
AGENT_OS_PACKAGE_ID=0x...

# Rate Limiting (optional)
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=60000
MAX_TRANSACTION_VALUE_USD=500
```

## Step 3: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 4: Deploy Smart Contracts (Optional)

```bash
cd move
sui move build
sui move test
./scripts/deploy.sh testnet
```

Copy the package ID to `.env.local`.

## Step 5: Build for Production

```bash
npm run build
npm start
```

## 🎯 Features to Test

### 1. Landing Page
- ✅ 3D floating agents background
- ✅ Voice command demo
- ✅ Feature cards
- ✅ CTA buttons

### 2. Marketplace (Coming Soon)
- Browse agent cards
- Filter by category
- Purchase agents

### 3. Console (Coming Soon)
- Dashboard with PTB visualizer
- Agent execution
- Real-time updates

### 4. Voice Commands
- Click the orb on landing page
- Say: "Deploy yield farming agent with $100"
- See transcript appear

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
npm run dev
```

### Build Errors
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### OpenAI API Errors
- Check API key is valid
- Ensure you have credits
- Check rate limits

### Sui Wallet Connection
- Install Sui Wallet extension
- Switch to testnet
- Refresh page

## 📦 Project Structure

```
sui-agent-os/
├── app/                 # Next.js 14 pages
├── components/          # React components
├── lib/                 # Utilities
├── move/                # Smart contracts
├── design-system/       # Design tokens
└── public/              # Static assets
```

## 🔗 Useful Links

- **Localhost**: http://localhost:3000
- **Sui Explorer**: https://suiscan.xyz/testnet
- **Sui Docs**: https://docs.sui.io
- **OpenAI Docs**: https://platform.openai.com/docs

## 🎨 Design System

All design tokens are in `/design-system`:
- Colors: Sui Teal, Indigo, Amber
- Typography: Inter, JetBrains Mono, Orbitron
- Components: Glassmorphism, 3D effects
- Animations: Framer Motion variants

## 🧪 Testing

```bash
# Type check
npm run type-check

# Lint
npm run lint

# Move tests
cd move && sui move test
```

## 📝 Next Steps

1. ✅ Landing page with 3D background
2. ✅ Voice command interface
3. ✅ AI agent backend (GPT-4)
4. ✅ Smart contracts (Move 2024)
5. 🔄 Marketplace page
6. 🔄 Console dashboard
7. 🔄 Agent builder
8. 🔄 zkLogin integration

## 🆘 Need Help?

- Check README.md for full documentation
- Review API_DOCUMENTATION.md for backend
- See design-system/README.md for UI components
- Check move/README.md for smart contracts

---

**Ready to build the future of AI agents on Sui!** 🚀
