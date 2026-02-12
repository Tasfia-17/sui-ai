// Framer Motion Animation Variants

export const pageTransition = {
  initial: { opacity: 0, x: -20, filter: 'blur(4px)' },
  animate: { opacity: 1, x: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, x: 20, filter: 'blur(4px)' },
  transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
};

export const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: { 
    scale: 1.02, 
    y: -4,
    transition: { duration: 0.2, type: 'spring', stiffness: 300 }
  }
};

export const glowPulse = {
  animate: {
    boxShadow: [
      '0 0 20px rgba(0, 212, 170, 0.3)',
      '0 0 40px rgba(0, 212, 170, 0.6)',
      '0 0 20px rgba(0, 212, 170, 0.3)',
    ],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
  }
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

export const orbPulse = {
  animate: {
    scale: [1, 1.1, 1],
    opacity: [0.8, 1, 0.8],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
  }
};

export const voiceWave = {
  animate: (i: number) => ({
    scaleY: [1, 1.5, 1],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      delay: i * 0.1,
      ease: 'easeInOut'
    }
  })
};

export const terminalType = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: { delay: i * 0.05 }
  })
};
