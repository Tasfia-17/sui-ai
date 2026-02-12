import OpenAI from 'openai';
import { z } from 'zod';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-build',
});

// Intent schema
const IntentSchema = z.object({
  strategy: z.enum(['yield_farming', 'swap', 'nft_trade', 'social_post']),
  budget: z.number().positive(),
  pools: z.array(z.string()).optional(),
  tokens: z.array(z.string()).optional(),
  parameters: z.record(z.any()).optional(),
});

export type Intent = z.infer<typeof IntentSchema>;

// PTB Command schema
const PTBCommandSchema = z.object({
  type: z.enum(['moveCall', 'transferObjects', 'splitCoins', 'mergeCoins']),
  target: z.string().optional(),
  arguments: z.array(z.any()),
  typeArguments: z.array(z.string()).optional(),
});

export type PTBCommand = z.infer<typeof PTBCommandSchema>;

// PTB Structure schema
const PTBStructureSchema = z.object({
  commands: z.array(PTBCommandSchema),
  gasEstimate: z.number(),
  description: z.string(),
});

export type PTBStructure = z.infer<typeof PTBStructureSchema>;

export async function recognizeIntent(userInput: string): Promise<Intent> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: `You are an AI agent that extracts structured intent from natural language commands for blockchain operations.
Extract: strategy, budget (in USD), pools/tokens, and any additional parameters.
Respond with valid JSON matching the Intent schema.`,
      },
      {
        role: 'user',
        content: userInput,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.3,
  });

  const content = completion.choices[0].message.content;
  if (!content) throw new Error('No response from AI');

  const parsed = JSON.parse(content);
  return IntentSchema.parse(parsed);
}

export async function generatePTB(
  intent: Intent,
  allowedContracts: string[]
): Promise<PTBStructure> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: `You are an expert at generating Sui Programmable Transaction Blocks (PTBs).
Given an intent and allowed contracts, generate a valid PTB structure.
Only use contracts from the allowed list: ${allowedContracts.join(', ')}
Estimate gas cost in MIST (1 SUI = 1,000,000,000 MIST).
Respond with valid JSON matching the PTBStructure schema.`,
      },
      {
        role: 'user',
        content: JSON.stringify(intent),
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.2,
  });

  const content = completion.choices[0].message.content;
  if (!content) throw new Error('No response from AI');

  const parsed = JSON.parse(content);
  return PTBStructureSchema.parse(parsed);
}

export async function explainExecution(
  ptb: PTBStructure,
  currentStep: number
): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: 'You are an AI agent explaining blockchain operations in simple terms. Be concise and clear.',
      },
      {
        role: 'user',
        content: `Explain step ${currentStep + 1} of this transaction: ${JSON.stringify(ptb.commands[currentStep])}`,
      },
    ],
    max_tokens: 100,
    temperature: 0.7,
  });

  return completion.choices[0].message.content || 'Processing...';
}

export async function validateSafety(
  intent: Intent,
  ptb: PTBStructure,
  capabilities: string[]
): Promise<{ safe: boolean; reason?: string }> {
  // Check budget
  if (intent.budget > 500) {
    return {
      safe: false,
      reason: 'Transaction exceeds $500 limit. Human approval required.',
    };
  }

  // Check gas estimate
  const gasInSUI = ptb.gasEstimate / 1_000_000_000;
  if (gasInSUI > intent.budget * 0.1) {
    return {
      safe: false,
      reason: 'Gas cost exceeds 10% of budget.',
    };
  }

  // Check capabilities
  for (const command of ptb.commands) {
    if (command.target && !capabilities.includes(command.target)) {
      return {
        safe: false,
        reason: `Unauthorized contract call: ${command.target}`,
      };
    }
  }

  return { safe: true };
}
