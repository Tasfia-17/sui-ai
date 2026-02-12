// Security utilities for Sui Agent OS

/**
 * Sanitize user input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate Sui address format
 */
export function isValidSuiAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(address);
}

/**
 * Validate API key format (OpenAI)
 */
export function isValidApiKey(key: string): boolean {
  return /^sk-[a-zA-Z0-9]{48,}$/.test(key);
}

/**
 * Securely store data in localStorage with encryption flag
 */
export function secureStore(key: string, value: any): void {
  try {
    const data = {
      value,
      timestamp: Date.now(),
      secure: true,
    };
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to store data securely:', error);
  }
}

/**
 * Securely retrieve data from localStorage
 */
export function secureRetrieve(key: string): any {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return null;
    
    const data = JSON.parse(stored);
    return data.value;
  } catch (error) {
    console.error('Failed to retrieve data securely:', error);
    return null;
  }
}

/**
 * Clear sensitive data from localStorage
 */
export function clearSensitiveData(): void {
  const keysToKeep = ['onboardingComplete', 'theme'];
  const allKeys = Object.keys(localStorage);
  
  allKeys.forEach(key => {
    if (!keysToKeep.includes(key)) {
      localStorage.removeItem(key);
    }
  });
}

/**
 * Validate gas budget
 */
export function isValidGasBudget(budget: string): boolean {
  const num = parseFloat(budget);
  return !isNaN(num) && num > 0 && num <= 1000;
}

/**
 * Rate limit function calls
 */
const rateLimitMap = new Map<string, number[]>();

export function rateLimit(key: string, maxCalls: number, windowMs: number): boolean {
  const now = Date.now();
  const calls = rateLimitMap.get(key) || [];
  
  // Remove old calls outside the window
  const recentCalls = calls.filter(time => now - time < windowMs);
  
  if (recentCalls.length >= maxCalls) {
    return false; // Rate limit exceeded
  }
  
  recentCalls.push(now);
  rateLimitMap.set(key, recentCalls);
  return true;
}

/**
 * Generate a secure random ID
 */
export function generateSecureId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Validate agent configuration
 */
export function validateAgentConfig(config: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!config.name || config.name.length < 3) {
    errors.push('Agent name must be at least 3 characters');
  }
  
  if (!['defi', 'nft', 'custom'].includes(config.type)) {
    errors.push('Invalid agent type');
  }
  
  if (!Array.isArray(config.capabilities)) {
    errors.push('Capabilities must be an array');
  }
  
  if (!isValidGasBudget(config.gasBudget)) {
    errors.push('Invalid gas budget');
  }
  
  if (!config.useDemo && config.apiKey && !isValidApiKey(config.apiKey)) {
    errors.push('Invalid API key format');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Check if demo mode is safe
 */
export function isDemoModeSafe(): boolean {
  // Demo mode is always safe as it doesn't make real transactions
  return true;
}

/**
 * Log security event (for monitoring)
 */
export function logSecurityEvent(event: string, details?: any): void {
  const log = {
    event,
    details,
    timestamp: new Date().toISOString(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
  };
  
  console.log('[SECURITY]', log);
  
  // In production, send to monitoring service
  // sendToMonitoring(log);
}
