// Enhanced Animation Variants with Advanced Physics

export const springConfig = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
  mass: 0.8,
};

export const smoothSpring = {
  type: 'spring',
  stiffness: 200,
  damping: 25,
  mass: 1,
};

export const bouncySpring = {
  type: 'spring',
  stiffness: 400,
  damping: 20,
  mass: 0.5,
};

// Page Transitions with Blur
export const pageTransition = {
  initial: { 
    opacity: 0, 
    x: -20, 
    filter: 'blur(8px)',
    scale: 0.98,
  },
  animate: { 
    opacity: 1, 
    x: 0, 
    filter: 'blur(0px)',
    scale: 1,
    transition: { 
      duration: 0.4, 
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.1,
    }
  },
  exit: { 
    opacity: 0, 
    x: 20, 
    filter: 'blur(8px)',
    scale: 0.98,
    transition: { duration: 0.3 }
  }
};

// 3D Card Hover with Perspective
export const card3DHover = {
  rest: { 
    scale: 1, 
    y: 0,
    rotateX: 0,
    rotateY: 0,
    z: 0,
  },
  hover: { 
    scale: 1.03, 
    y: -8,
    rotateX: 2,
    rotateY: -2,
    z: 20,
    transition: { 
      ...springConfig,
      duration: 0.3,
    }
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 }
  }
};

// Enhanced Glow Pulse
export const glowPulse = {
  animate: {
    boxShadow: [
      '0 0 20px rgba(0, 212, 170, 0.3), 0 0 40px rgba(0, 212, 170, 0.1)',
      '0 0 30px rgba(0, 212, 170, 0.6), 0 0 60px rgba(0, 212, 170, 0.3)',
      '0 0 20px rgba(0, 212, 170, 0.3), 0 0 40px rgba(0, 212, 170, 0.1)',
    ],
    transition: { 
      duration: 2, 
      repeat: Infinity, 
      ease: 'easeInOut' 
    }
  }
};

// Stagger Container with Delay
export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    }
  }
};

// Stagger Item with Spring
export const staggerItem = {
  initial: { 
    opacity: 0, 
    y: 20,
    scale: 0.95,
  },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: springConfig,
  }
};

// Orb Pulse with Scale and Glow
export const orbPulse = {
  rest: {
    scale: 1,
    opacity: 0.8,
  },
  animate: {
    scale: [1, 1.15, 1],
    opacity: [0.8, 1, 0.8],
    boxShadow: [
      '0 0 20px rgba(0, 212, 170, 0.3)',
      '0 0 40px rgba(0, 212, 170, 0.6)',
      '0 0 20px rgba(0, 212, 170, 0.3)',
    ],
    transition: { 
      duration: 2.5, 
      repeat: Infinity, 
      ease: 'easeInOut' 
    }
  }
};

// Voice Wave with Individual Delays
export const voiceWave = {
  animate: (i: number) => ({
    scaleY: [1, 2, 1],
    opacity: [0.6, 1, 0.6],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      delay: i * 0.08,
      ease: 'easeInOut'
    }
  })
};

// Terminal Typing Effect
export const terminalType = {
  hidden: { opacity: 0, x: -5 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { 
      delay: i * 0.03,
      duration: 0.1,
    }
  })
};

// Shared Layout Transition
export const sharedLayout = {
  layout: true,
  transition: {
    layout: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    }
  }
};

// Floating Animation
export const floating = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: 'easeInOut',
    }
  }
};

// Gradient Animation
export const gradientShift = {
  animate: {
    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: 'linear',
    }
  }
};

// Glitch Effect
export const glitch = {
  animate: {
    x: [0, -2, 2, -2, 2, 0],
    y: [0, 2, -2, 2, -2, 0],
    filter: [
      'hue-rotate(0deg)',
      'hue-rotate(90deg)',
      'hue-rotate(0deg)',
    ],
    transition: {
      duration: 0.3,
      repeat: Infinity,
      repeatDelay: 5,
    }
  }
};

// Reveal from Bottom
export const revealFromBottom = {
  initial: {
    y: 100,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      ...smoothSpring,
      duration: 0.6,
    }
  }
};

// Scale In
export const scaleIn = {
  initial: {
    scale: 0.8,
    opacity: 0,
  },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      ...bouncySpring,
      duration: 0.5,
    }
  }
};

// Rotate In
export const rotateIn = {
  initial: {
    rotate: -10,
    opacity: 0,
  },
  animate: {
    rotate: 0,
    opacity: 1,
    transition: {
      ...springConfig,
      duration: 0.6,
    }
  }
};

// Slide and Fade
export const slideAndFade = (direction: 'left' | 'right' | 'up' | 'down' = 'left') => {
  const directions = {
    left: { x: -50, y: 0 },
    right: { x: 50, y: 0 },
    up: { x: 0, y: -50 },
    down: { x: 0, y: 50 },
  };

  return {
    initial: {
      ...directions[direction],
      opacity: 0,
    },
    animate: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: smoothSpring,
    }
  };
};

// Morph Shape
export const morphShape = {
  initial: {
    borderRadius: '50%',
  },
  animate: {
    borderRadius: ['50%', '20%', '50%'],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    }
  }
};

// Parallax Scroll
export const parallaxScroll = (speed: number = 0.5) => ({
  animate: (scrollY: number) => ({
    y: scrollY * speed,
  })
});
