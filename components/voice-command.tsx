'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Loader2 } from 'lucide-react';

export function VoiceCommand() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [audioLevels, setAudioLevels] = useState<number[]>([0, 0, 0, 0, 0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;

        recognitionRef.current.onresult = (event: any) => {
          const current = event.resultIndex;
          const transcriptText = event.results[current][0].transcript;
          setTranscript(transcriptText);

          if (event.results[current].isFinal) {
            handleCommand(transcriptText);
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setAudioLevels(prev => prev.map(() => Math.random() * 2));
      }, 100);
      return () => clearInterval(interval);
    } else {
      setAudioLevels([0, 0, 0, 0, 0]);
    }
  }, [isListening]);

  const handleCommand = async (text: string) => {
    setIsProcessing(true);
    
    // Demo responses
    const responses: { [key: string]: string } = {
      'swap': '✓ Swap transaction prepared',
      'balance': '✓ Balance: 100 SUI',
      'send': '✓ Transfer initiated',
      'check': '✓ Portfolio value: $1,234',
      'price': '✓ SUI price: $2.50',
    };
    
    const lowerText = text.toLowerCase();
    let foundResponse = '✓ Command received';
    
    for (const [key, value] of Object.entries(responses)) {
      if (lowerText.includes(key)) {
        foundResponse = value;
        break;
      }
    }
    
    setTimeout(() => {
      setResponse(foundResponse);
      setIsProcessing(false);
      setTimeout(() => setResponse(''), 3000);
    }, 1000);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
      setTranscript('');
      setResponse('');
    }
  };

  return (
    <div className="pixel-card p-8 max-w-2xl mx-auto">
      <div className="flex flex-col items-center space-y-6">
        {/* Microphone Button */}
        <button
          onClick={toggleListening}
          className={`pixel-avatar w-24 h-24 cursor-pointer transition-all ${
            isListening ? 'pixel-glow' : ''
          }`}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <Loader2 className="w-12 h-12 text-purple m-auto mt-5 animate-spin" />
          ) : isListening ? (
            <Mic className="w-12 h-12 text-emerald m-auto mt-5" />
          ) : (
            <MicOff className="w-12 h-12 text-sky m-auto mt-5" />
          )}
        </button>

        {/* Status */}
        <div className="text-center">
          <div className="pixel-badge inline-block mb-2">
            {isProcessing ? 'PROCESSING...' : isListening ? 'LISTENING' : 'READY'}
          </div>
        </div>

        {/* Audio Visualizer */}
        {isListening && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-end gap-2 h-16"
          >
            {audioLevels.map((level, i) => (
              <motion.div
                key={i}
                className="w-3 bg-gradient-to-t from-emerald to-sky"
                animate={{ height: `${20 + level * 30}px` }}
                transition={{ duration: 0.1 }}
              />
            ))}
          </motion.div>
        )}

        {/* Transcript */}
        <AnimatePresence>
          {transcript && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full p-4 bg-sky/10 border-2 border-sky text-center"
            >
              <p className="text-xs font-pixel text-foreground">&quot;{transcript}&quot;</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Response */}
        <AnimatePresence>
          {response && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full p-4 bg-emerald/10 border-2 border-emerald text-center"
            >
              <p className="text-xs font-pixel text-emerald">{response}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Instructions */}
        {!isListening && !transcript && (
          <div className="text-center text-xs text-foreground/60 leading-relaxed">
            <p className="font-pixel mb-2">CLICK TO START</p>
            <p>Try: &quot;Swap 10 SUI&quot; or &quot;Check balance&quot;</p>
          </div>
        )}
      </div>
    </div>
  );
}
