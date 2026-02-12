'use client';

import { useState, useEffect } from 'react';

interface ExecutionUpdate {
  step: number;
  total: number;
  message: string;
  timestamp: number;
}

export function useExecutionStream(executionId: string | null) {
  const [updates, setUpdates] = useState<ExecutionUpdate[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!executionId) return;

    const eventSource = new EventSource(
      `/api/agent/stream?executionId=${executionId}`
    );

    eventSource.onopen = () => {
      setIsConnected(true);
      setError(null);
    };

    eventSource.onmessage = (event) => {
      try {
        const update: ExecutionUpdate = JSON.parse(event.data);
        setUpdates((prev) => [...prev, update]);
      } catch (err) {
        console.error('Failed to parse SSE data:', err);
      }
    };

    eventSource.onerror = (err) => {
      console.error('SSE error:', err);
      setError('Connection lost');
      setIsConnected(false);
      eventSource.close();
    };

    return () => {
      eventSource.close();
      setIsConnected(false);
    };
  }, [executionId]);

  return { updates, isConnected, error };
}

export async function executeAgent(params: {
  command: string;
  agentId: string;
  capabilities: string[];
  sender: string;
}) {
  const response = await fetch('/api/agent/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Execution failed');
  }

  return response.json();
}

export async function chatWithAgent(message: string, history?: any[]) {
  const response = await fetch('/api/agent/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, conversationHistory: history }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Chat failed');
  }

  return response.json();
}

export async function transcribeAudio(audioBlob: Blob) {
  const formData = new FormData();
  formData.append('audio', audioBlob);

  const response = await fetch('/api/voice/transcribe', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Transcription failed');
  }

  return response.json();
}
