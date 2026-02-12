// Enhanced Design System Configuration with Advanced Spacing & Typography

import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // 8pt Grid System (multiples of 8px for perfect alignment)
      spacing: {
        '0': '0',
        'px': '1px',
        '0.5': '2px',   // 0.125rem
        '1': '4px',     // 0.25rem
        '1.5': '6px',   // 0.375rem
        '2': '8px',     // 0.5rem - Base unit
        '3': '12px',    // 0.75rem
        '4': '16px',    // 1rem
        '5': '20px',    // 1.25rem
        '6': '24px',    // 1.5rem
        '8': '32px',    // 2rem
        '10': '40px',   // 2.5rem
        '12': '48px',   // 3rem
        '16': '64px',   // 4rem
        '20': '80px',   // 5rem
        '24': '96px',   // 6rem
        '32': '128px',  // 8rem
        '40': '160px',  // 10rem
        '48': '192px',  // 12rem
        '56': '224px',  // 14rem
        '64': '256px',  // 16rem
      },
      colors: {
        sui: {
          teal: '#00D4AA',
          'teal-light': '#00FFD1',
          'teal-dark': '#00A88A',
          dark: '#0B0F19',
          darker: '#1A1F2E',
        },
        indigo: {
          DEFAULT: '#6366F1',
          light: '#818CF8',
          dark: '#4F46E5',
        },
        amber: {
          DEFAULT: '#F59E0B',
          light: '#FBBF24',
          dark: '#D97706',
        },
        cyber: {
          pink: '#FF006E',
          purple: '#8338EC',
          blue: '#3A86FF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Orbitron', 'Inter', 'sans-serif'], // Futuristic display font
      },
      fontSize: {
        // Fluid typography scale
        'xs': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.05em' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.025em' }],
        'base': ['1rem', { lineHeight: '1.5rem', letterSpacing: '0' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],
        '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.02em' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.02em' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.03em' }],
        '5xl': ['3rem', { lineHeight: '1', letterSpacing: '-0.03em' }],
        '6xl': ['3.75rem', { lineHeight: '1', letterSpacing: '-0.04em' }],
      },
      backgroundImage: {
        'space-gradient': 'linear-gradient(180deg, #0B0F19 0%, #1A1F2E 100%)',
        'glass': 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
        'glass-strong': 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)',
        'cyber-gradient': 'linear-gradient(135deg, #00D4AA 0%, #6366F1 50%, #F59E0B 100%)',
        'noise': "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noiseFilter\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"3.5\" numOctaves=\"4\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noiseFilter)\"/%3E%3C/svg%3E')",
      },
      backdropBlur: {
        'glass': '24px',
        'glass-strong': '40px',
      },
      boxShadow: {
        'glow-teal': '0 0 20px rgba(0, 212, 170, 0.3), 0 0 40px rgba(0, 212, 170, 0.1)',
        'glow-teal-strong': '0 0 30px rgba(0, 212, 170, 0.5), 0 0 60px rgba(0, 212, 170, 0.2)',
        'glow-indigo': '0 0 20px rgba(99, 102, 241, 0.3), 0 0 40px rgba(99, 102, 241, 0.1)',
        'glow-amber': '0 0 20px rgba(245, 158, 11, 0.3), 0 0 40px rgba(245, 158, 11, 0.1)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-inset': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
        'depth-1': '0 2px 8px rgba(0, 0, 0, 0.3)',
        'depth-2': '0 4px 16px rgba(0, 0, 0, 0.4)',
        'depth-3': '0 8px 32px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient': 'gradient 8s ease infinite',
        'typing': 'typing 0.05s steps(1) forwards',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'scan': 'scan 8s linear infinite',
        'glitch': 'glitch 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        typing: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
      },
      borderRadius: {
        'glass': '16px',
        'glass-lg': '24px',
      },
      // 3D Transform utilities
      perspective: {
        '1000': '1000px',
        '1500': '1500px',
        '2000': '2000px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/container-queries'),
  ],
}

export default config
