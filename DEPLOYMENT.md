# 🚀 Deployment Guide - Sui Agent OS

## Prerequisites

- Node.js 18+ installed
- Sui CLI installed
- Git installed
- OpenAI API key (optional, for live mode)

---

## 📦 Installation

### 1. Clone Repository
```bash
git clone https://github.com/Tasfia-17/sui.git
cd sui
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
# Optional - for live AI features
OPENAI_API_KEY=sk-your-key-here

# Sui Network
SUI_NETWORK=testnet

# Package ID (after deployment)
AGENT_OS_PACKAGE_ID=0x...
```

---

## 🎮 Run Locally

### Start Development Server
```bash
npm run dev
```

Visit: http://localhost:3000

### Test Features
1. **Onboarding**: Click "START NOW"
2. **Marketplace**: Browse 6 pre-built agents
3. **Create Agent**: Build custom agent (demo mode is safe!)
4. **Console**: Monitor and control agents
5. **Voice Commands**: Click microphone and speak

---

## 🔗 Deploy Smart Contracts to Sui Testnet

### 1. Install Sui CLI
```bash
# macOS/Linux
curl -fsSL https://sui.io/install.sh | sh

# Or download from: https://docs.sui.io/guides/developer/getting-started/sui-install
```

### 2. Create Sui Wallet
```bash
sui client new-address ed25519
```

### 3. Get Testnet SUI
```bash
# Request from faucet
sui client faucet

# Or visit: https://discord.gg/sui
```

### 4. Deploy Contracts
```bash
cd move
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

### 5. Save Package ID
After deployment, you'll see:
```
Published package: 0xABCD1234...
```

Copy this Package ID to `.env.local`:
```env
AGENT_OS_PACKAGE_ID=0xABCD1234...
```

---

## 🌐 Deploy Frontend to Vercel

### 1. Push to GitHub
```bash
git add -A
git commit -m "Ready for deployment"
git push origin main
```

### 2. Deploy to Vercel
1. Visit https://vercel.com
2. Import your GitHub repository
3. Add environment variables:
   - `OPENAI_API_KEY` (optional)
   - `SUI_NETWORK=testnet`
   - `AGENT_OS_PACKAGE_ID=0x...`
4. Click "Deploy"

### 3. Custom Domain (Optional)
- Add custom domain in Vercel settings
- Update DNS records

---

## 🧪 Testing

### Run Tests
```bash
# Frontend tests
npm test

# Move tests
cd move
sui move test
```

### Manual Testing Checklist
- [ ] Landing page loads
- [ ] Onboarding flow works
- [ ] Marketplace displays agents
- [ ] Create agent form validates
- [ ] Agent deploys to console
- [ ] Voice commands work
- [ ] Demo mode functions
- [ ] All navigation works

---

## 🔐 Security Checklist

Before production:
- [ ] API keys in environment variables (not code)
- [ ] Input validation enabled
- [ ] Rate limiting configured
- [ ] HTTPS enabled
- [ ] CORS configured
- [ ] Error handling in place
- [ ] Security headers set

---

## 📊 Monitoring

### Check Deployment Status
```bash
# Check Sui package
sui client object <PACKAGE_ID>

# Check frontend
curl https://your-domain.vercel.app
```

### View Logs
```bash
# Vercel logs
vercel logs

# Local logs
npm run dev
```

---

## 🐛 Troubleshooting

### Common Issues

**1. "Module not found" error**
```bash
rm -rf node_modules package-lock.json
npm install
```

**2. "Sui CLI not found"**
```bash
# Add to PATH
export PATH="$HOME/.sui/bin:$PATH"
```

**3. "Insufficient gas"**
```bash
# Request more from faucet
sui client faucet
```

**4. "Voice commands not working"**
- Use Chrome/Edge (best support)
- Allow microphone permissions
- Check browser console for errors

---

## 📝 Post-Deployment

### Update README
Add your deployed URLs:
```markdown
- Live Demo: https://your-app.vercel.app
- Package ID: 0xABCD1234...
- Sui Explorer: https://suiexplorer.com/object/0xABCD1234...
```

### Share Links
- Demo video
- GitHub repository
- Live application
- Sui Explorer links

---

## 🎯 Production Checklist

- [ ] Smart contracts deployed to testnet
- [ ] Package ID in environment variables
- [ ] Frontend deployed to Vercel
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] Error tracking enabled
- [ ] Analytics configured (optional)
- [ ] Documentation updated
- [ ] Demo video recorded
- [ ] Submission form completed

---

## 🆘 Support

If you encounter issues:
1. Check documentation
2. Review error logs
3. Test in demo mode first
4. Check Sui Discord for help

---

## 🎉 Success!

Your Sui Agent OS is now live! 🚀

Next steps:
1. Test all features
2. Record demo video
3. Submit to hackathon
4. Share with community

---

**Built for Sui Vibe Hackathon 2026** 🏆
