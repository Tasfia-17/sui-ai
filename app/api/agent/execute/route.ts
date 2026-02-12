import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { recognizeIntent, generatePTB, validateSafety } from '@/lib/ai-agent';
import { buildPTBFromStructure, simulateTransaction } from '@/lib/sui-client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = rateLimit(ip, 100, 60000);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
          },
        }
      );
    }

    // Parse request
    const body = await req.json();
    const { command, agentId, capabilities, sender } = body;

    if (!command || !agentId || !sender) {
      return NextResponse.json(
        { error: 'Missing required fields: command, agentId, sender' },
        { status: 400 }
      );
    }

    // Step 1: Recognize intent
    console.log('[Agent] Recognizing intent:', command);
    const intent = await recognizeIntent(command);
    console.log('[Agent] Intent:', intent);

    // Step 2: Generate PTB
    const allowedContracts = capabilities || [
      '0x2::coin::split',
      '0x2::coin::merge',
      '0x2::transfer::public_transfer',
    ];

    console.log('[Agent] Generating PTB...');
    const ptbStructure = await generatePTB(intent, allowedContracts);
    console.log('[Agent] PTB generated:', ptbStructure);

    // Step 3: Safety validation
    console.log('[Agent] Validating safety...');
    const safetyCheck = await validateSafety(intent, ptbStructure, allowedContracts);

    if (!safetyCheck.safe) {
      return NextResponse.json(
        {
          error: 'Safety check failed',
          reason: safetyCheck.reason,
          requiresApproval: intent.budget > 500,
        },
        { status: 403 }
      );
    }

    // Step 4: Build and simulate transaction
    console.log('[Agent] Building transaction...');
    const tx = buildPTBFromStructure(ptbStructure);

    console.log('[Agent] Simulating transaction...');
    const simulation = await simulateTransaction(tx);

    if (!simulation.success) {
      return NextResponse.json(
        {
          error: 'Transaction simulation failed',
          details: simulation.error,
        },
        { status: 400 }
      );
    }

    // Return PTB for client-side signing
    return NextResponse.json({
      success: true,
      intent,
      ptb: ptbStructure,
      simulation: {
        success: simulation.success,
        gasUsed: simulation.effects?.gasUsed,
      },
      // Note: Transaction block should be built client-side for signing
      requiresClientSigning: true,
    });

  } catch (error: any) {
    console.error('[Agent] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
