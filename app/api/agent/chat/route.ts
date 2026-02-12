import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { recognizeIntent } from '@/lib/ai-agent';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = rateLimit(ip, 200, 60000);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Check if this is a command or just chat
    const isCommand = /deploy|execute|swap|trade|farm|mint|transfer/i.test(message);

    if (isCommand) {
      // Extract intent
      const intent = await recognizeIntent(message);
      
      return NextResponse.json({
        type: 'command',
        intent,
        message: `I understand you want to ${intent.strategy} with a budget of $${intent.budget}. Would you like me to proceed?`,
      });
    } else {
      // Regular chat response
      return NextResponse.json({
        type: 'chat',
        message: 'I can help you deploy and manage AI agents on Sui blockchain. Try commands like "Deploy a yield farming agent with $100" or "Swap 10 SUI for USDC".',
      });
    }

  } catch (error: any) {
    console.error('[Chat] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
