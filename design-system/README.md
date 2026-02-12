# Sui Agent OS - Design System

Complete design system for the Sui Agent OS hackathon project with nostalgic-futuristic aesthetic.

## 🎨 Design Philosophy

**Blade Runner UI meets Mac OS 9 meets Sui blockchain**

- Glassmorphism with retro grid overlays
- Animated gradient borders (teal → indigo)
- Terminal-style text with typing effects
- Pulsing status orbs and voice visualizations
- Deep space gradient backgrounds

## 📦 Components

### 1. AgentCard
Glassmorphic card displaying agent information with:
- Animated gradient border on hover
- Status orb (green/amber/red)
- Holographic avatar placeholder
- PTB preview expansion
- Lift + glow hover effect

### 2. PTBVisualizer
Transaction flow timeline with:
- Horizontal connected nodes
- Sequential step animation
- Terminal output display
- Retro aesthetic with modern glass styling
- Real-time execution progress

### 3. VoiceCommandOrb
Central voice interface featuring:
- Pulsing orb with glow rings
- Voice wave visualization (5 bars)
- Terminal typing effect for commands
- Confidence meter
- Click to activate

### 4. AgentConsole
Complete dashboard layout:
- Collapsible left sidebar (agent list)
- Main area (PTB visualization)
- Right panel (agent thoughts terminal)
- Bottom quick actions bar
- Retro grid background overlay

## 🎭 Animations

All animations use Framer Motion with:
- **Page transitions**: 300ms slide + fade
- **Micro-interactions**: 200ms spring physics
- **PTB execution**: 200ms staggered reveals
- **Voice waves**: 600ms infinite loop
- **Status orbs**: 2s pulse cycle

## 🎨 Color System

```css
--sui-teal: #00D4AA      /* Primary - trust, innovation */
--indigo: #6366F1         /* Secondary - AI intelligence */
--amber: #F59E0B          /* Accent - action, execution */
--bg-dark: #0B0F19        /* Background start */
--bg-darker: #1A1F2E      /* Background end */
--glass: rgba(255,255,255,0.05) /* Glass overlay */
```

## 📱 Responsive Design

- Mobile-first approach
- Optimized for desktop demos (1920x1080)
- Collapsible sidebar for smaller screens
- Touch-friendly interactions

## 🚀 Usage

```tsx
import { 
  AgentConsole, 
  AgentCard, 
  PTBVisualizer, 
  VoiceCommandOrb 
} from './design-system';

// Example usage
<AgentConsole
  agents={agents}
  activePTB={currentTransaction}
  onAgentSelect={(agent) => console.log(agent)}
/>
```

## 📁 File Structure

```
design-system/
├── components/
│   ├── AgentCard.tsx
│   ├── PTBVisualizer.tsx
│   ├── VoiceCommandOrb.tsx
│   └── AgentConsole.tsx
├── animations.ts
├── types.ts
├── globals.css
├── tailwind.config.ts
└── index.ts
```

## 🎯 Key Features

- **Glassmorphism**: backdrop-blur-xl with subtle borders
- **Retro Grid**: Cyan grid lines at 10% opacity
- **Terminal Aesthetic**: Monospace fonts with typing effects
- **Holographic Effects**: Animated gradient overlays
- **Status Indicators**: Pulsing orbs with color coding
- **Voice Visualization**: Real-time audio wave display
- **PTB Timeline**: Sequential step animation
- **Responsive Layout**: Collapsible panels

## 🔧 Dependencies

```json
{
  "framer-motion": "^11.x",
  "tailwindcss": "^3.x",
  "react": "^18.x",
  "typescript": "^5.x"
}
```

## 💡 Design Tokens

All design tokens are defined in `tailwind.config.ts` for consistency across the application.

## 🎬 Animation Variants

Pre-defined animation variants in `animations.ts`:
- `pageTransition` - Page enter/exit
- `cardHover` - Card lift effect
- `glowPulse` - Status orb pulse
- `staggerContainer` - Parent stagger
- `staggerItem` - Child stagger
- `orbPulse` - Voice orb animation
- `voiceWave` - Audio visualization
- `terminalType` - Typing effect

## 🌟 Special Effects

- **CRT Scanlines**: Optional retro monitor effect
- **Custom Scrollbar**: Themed with Sui teal
- **Glow Utilities**: Pre-defined glow classes
- **Holographic**: Animated gradient background

---

Built for **Sui Vibe Hackathon 2026** 🚀
