import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Mock transcription - in production, use a service like Deepgram or AssemblyAI
export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = rateLimit(ip, 50, 60000);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    const formData = await req.formData();
    const audio = formData.get('audio') as Blob;

    if (!audio) {
      return NextResponse.json(
        { error: 'Audio file is required' },
        { status: 400 }
      );
    }

    // In production, send to transcription service
    // For now, return mock response
    const mockTranscript = 'Deploy a yield farming agent with $100 to USDC-USDT pools';

    return NextResponse.json({
      transcript: mockTranscript,
      confidence: 0.95,
      duration: 3.5,
    });

  } catch (error: any) {
    console.error('[Transcribe] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
