# AI Agent Backend - API Documentation

## Architecture

```
┌─────────────────┐
│   Frontend      │
│  (Next.js UI)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   API Routes    │
│  /api/agent/*   │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐ ┌──────────┐
│OpenAI  │ │Sui Client│
│GPT-4   │ │  (PTB)   │
└────────┘ └──────────┘
```

## API Endpoints

### 1. `/api/agent/execute` (POST)

Main execution endpoint for agent commands.

**Request:**
```json
{
  "command": "Deploy yield farming agent with $100 to USDC-USDT pools",
  "agentId": "0x123...",
  "capabilities": ["0x2::coin::split", "cetus::swap"],
  "sender": "0xabc..."
}
```

**Response:**
```json
{
  "success": true,
  "intent": {
    "strategy": "yield_farming",
    "budget": 100,
    "pools": ["USDC-USDT"]
  },
  "ptb": {
    "commands": [...],
    "gasEstimate": 10000000,
    "description": "Yield farming setup"
  },
  "simulation": {
    "success": true,
    "gasUsed": {...}
  },
  "transactionBlock": "..."
}
```

**Flow:**
1. Rate limit check (100 req/min)
2. Intent recognition (GPT-4)
3. PTB generation with allowed contracts
4. Safety validation (budget, capabilities)
5. Transaction simulation
6. Return PTB for client signing

### 2. `/api/agent/chat` (POST)

Natural language to PTB conversion.

**Request:**
```json
{
  "message": "Swap 10 SUI for USDC",
  "conversationHistory": []
}
```

**Response:**
```json
{
  "type": "command",
  "intent": {
    "strategy": "swap",
    "budget": 10,
    "tokens": ["SUI", "USDC"]
  },
  "message": "I understand you want to swap..."
}
```

### 3. `/api/agent/stream` (GET - SSE)

Real-time execution updates via Server-Sent Events.

**Request:**
```
GET /api/agent/stream?executionId=exec_123
```

**Stream:**
```
data: {"step":0,"total":8,"message":"Initializing agent...","timestamp":1234567890}

data: {"step":1,"total":8,"message":"Validating capabilities...","timestamp":1234567891}

...
```

### 4. `/api/voice/transcribe` (POST)

Voice transcription endpoint.

**Request:**
```
FormData {
  audio: Blob (audio/webm)
}
```

**Response:**
```json
{
  "transcript": "Deploy a yield farming agent...",
  "confidence": 0.95,
  "duration": 3.5
}
```

## AI Integration

### Intent Recognition

Uses GPT-4 with structured output:

```typescript
const intent = await recognizeIntent(userInput);
// Returns: { strategy, budget, pools, tokens, parameters }
```

### PTB Generation

Generates Sui transaction blocks:

```typescript
const ptb = await generatePTB(intent, allowedContracts);
// Returns: { commands, gasEstimate, description }
```

### Safety Layer

Multi-level validation:

1. **Budget Check**: Max $500 without approval
2. **Capability Check**: Only allowed contracts
3. **Gas Validation**: Max 10% of budget
4. **Simulation**: Dry run before execution

## Security Features

### Rate Limiting

In-memory rate limiter:
- 100 requests/minute for execute
- 200 requests/minute for chat
- 50 requests/minute for voice

### Input Sanitization

All inputs validated with Zod schemas:
- IntentSchema
- PTBCommandSchema
- PTBStructureSchema

### API Key Management

```env
OPENAI_API_KEY=sk-...  # Server-side only
SUI_NETWORK=testnet
AGENT_OS_PACKAGE_ID=0x...
```

Never exposed to frontend.

### Transaction Simulation

All transactions simulated before execution:

```typescript
const simulation = await simulateTransaction(tx, sender);
if (!simulation.success) {
  throw new Error(simulation.error);
}
```

## Client Usage

### Execute Agent

```typescript
import { executeAgent } from '@/lib/api-client';

const result = await executeAgent({
  command: 'Deploy yield farming agent with $100',
  agentId: '0x123...',
  capabilities: ['cetus::swap'],
  sender: account.address,
});

// Sign and execute transaction
const signature = await signTransaction(result.transactionBlock);
```

### Real-time Updates

```typescript
import { useExecutionStream } from '@/lib/api-client';

const { updates, isConnected } = useExecutionStream(executionId);

updates.forEach(update => {
  console.log(`Step ${update.step}: ${update.message}`);
});
```

### Voice Commands

```typescript
import { transcribeAudio } from '@/lib/api-client';

const result = await transcribeAudio(audioBlob);
const response = await chatWithAgent(result.transcript);
```

## Error Handling

All endpoints return consistent error format:

```json
{
  "error": "Error message",
  "details": "Detailed error info",
  "requiresApproval": true
}
```

HTTP Status Codes:
- `400` - Bad request (validation failed)
- `403` - Forbidden (safety check failed)
- `429` - Rate limit exceeded
- `500` - Internal server error

## Logging

All operations logged with prefix:

```
[Agent] Recognizing intent: ...
[Agent] Intent: { strategy: 'yield_farming', ... }
[Agent] Generating PTB...
[Agent] Validating safety...
[Agent] Building transaction...
[Agent] Simulating transaction...
```

## Environment Variables

Required:
```env
OPENAI_API_KEY=sk-...
SUI_NETWORK=testnet|mainnet
AGENT_OS_PACKAGE_ID=0x...
```

Optional:
```env
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=60000
MAX_TRANSACTION_VALUE_USD=500
```

## Testing

```bash
# Test execute endpoint
curl -X POST http://localhost:3000/api/agent/execute \
  -H "Content-Type: application/json" \
  -d '{"command":"Swap 10 SUI for USDC","agentId":"0x123","sender":"0xabc"}'

# Test chat endpoint
curl -X POST http://localhost:3000/api/agent/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What can you do?"}'

# Test SSE stream
curl http://localhost:3000/api/agent/stream?executionId=test
```

## Production Considerations

1. **Replace in-memory rate limiter** with Redis
2. **Add authentication** (JWT, session)
3. **Implement proper voice transcription** (Deepgram, AssemblyAI)
4. **Add monitoring** (Sentry, DataDog)
5. **Use WebSocket** for bidirectional communication
6. **Add request logging** to database
7. **Implement retry logic** for failed transactions
8. **Add transaction history** tracking

---

Built for **Sui Vibe Hackathon 2026** 🚀
