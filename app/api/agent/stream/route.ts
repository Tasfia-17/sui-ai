import { NextRequest } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  const rateLimitResult = rateLimit(ip, 50, 60000);

  if (!rateLimitResult.success) {
    return new Response('Rate limit exceeded', { status: 429 });
  }

  const { searchParams } = new URL(req.url);
  const executionId = searchParams.get('executionId');

  if (!executionId) {
    return new Response('executionId is required', { status: 400 });
  }

  // Set up SSE
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Simulate execution steps
        const steps = [
          'Initializing agent...',
          'Validating capabilities...',
          'Building transaction...',
          'Simulating execution...',
          'Waiting for signature...',
          'Broadcasting transaction...',
          'Confirming on-chain...',
          'Execution complete!',
        ];

        for (let i = 0; i < steps.length; i++) {
          const data = JSON.stringify({
            step: i,
            total: steps.length,
            message: steps[i],
            timestamp: Date.now(),
          });

          controller.enqueue(
            encoder.encode(`data: ${data}\n\n`)
          );

          // Wait between steps
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
