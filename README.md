# Sui Agent OS

> AI Agent Marketplace on Sui Blockchain

A decentralized marketplace for discovering, deploying, and trading AI agents as NFTs on the Sui blockchain. Features voice-controlled interactions and Programmable Transaction Block (PTB) execution.

## 🌟 Features

- **AI Agent Marketplace** - Browse and purchase AI agents as tradable NFTs
- **Voice Commands** - Natural language interface for agent interactions
- **Smart Contract Execution** - Agents execute strategies using Sui PTBs
- **Creator Royalties** - 5% royalty system for agent creators
-

## 🚀 Live Demo

- **Deployed Contracts**: [Sui Testnet Explorer](https://suiexplorer.com/object/0x28ce397d89df41d74d40d178fa60b3de7c2edea82e853d5cbe5baee8caf00e0a?network=testnet)
- **Package ID**: `0x28ce397d89df41d74d40d178fa60b3de7c2edea82e853d5cbe5baee8caf00e0a`
- **Marketplace**: `0xf6d708458f43d88cf04cf52de10a6520ca7b3477cc09c145b5fc36c1c77e4ca2`

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Three.js** - 3D background effects

### Blockchain
- **Sui Blockchain** - High-performance L1
- **Move Language** - Smart contract development
- **@mysten/dapp-kit** - Sui wallet integration
- **@mysten/sui** - Sui SDK

### Smart Contracts
- `marketplace.move` - Agent NFT marketplace
- `execution.move` - PTB execution engine
- `capabilities.move` - Access control system

## 📦 Installation

```bash
# Clone repository
git clone https://github.com/Tasfia-17/sui-ai.git
cd sui-ai

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your configuration

# Run development server
npm run dev
```



## 🏗️ Project Structure

```
sui-ai/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── console/           # Agent console page
│   ├── create/            # Agent creation page
│   ├── marketplace/       # Marketplace page
│   └── onboarding/        # User onboarding
├── components/            # React components
├── lib/                   # Utility libraries
├── move/                  # Sui Move contracts
│   ├── sources/          # Smart contract source
│   └── scripts/          # Deployment scripts
└── design-system/        # UI design system

```

## 🎮 Usage

### Browse Marketplace
1. Visit the marketplace page
2. Browse available AI agents
3. View agent details and capabilities

### Deploy an Agent
1. Select an agent from marketplace
2. Configure agent parameters
3. Deploy to your console
4. Interact via voice commands

### Voice Commands
- "Swap 10 SUI for USDC"
- "Check my balance"
- "Deploy yield farming strategy"

## 🔐 Smart Contracts

### Marketplace Module
- Agent NFT minting and trading
- Royalty distribution system
- Platform fee collection

### Execution Module
- PTB transaction building
- Agent coordination
- Gas estimation

### Capabilities Module
- Rate limiting
- Budget tracking
- Access control

## 🧪 Testing

```bash
# Run Move tests
cd move
sui move test

# Run frontend tests
npm test
```

## 📝 Smart Contract Deployment

```bash
cd move

# Build contracts
sui move build

# Deploy to testnet
./scripts/deploy.sh
```



## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Links

- [Sui Documentation](https://docs.sui.io)
- [Move Language Guide](https://move-language.github.io/move/)
- [Sui Explorer](https://suiexplorer.com)

## 👥 Team

Built for Sui Vibe Hackathon 2026

## 🙏 Acknowledgments

- Sui Foundation for the blockchain infrastructure
- Move language community
- Next.js team for the framework

---

**Note**: This is a hackathon project. Smart contracts are deployed on Sui testnet for demonstration purposes.
