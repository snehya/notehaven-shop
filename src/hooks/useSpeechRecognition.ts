/**
 * Custom hook for Web Speech API integration
 * @author NoteMart Team
 */

import { useState, useRef, useCallback } from 'react';

// Define the SpeechRecognition interface for TypeScript
interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: ISpeechRecognition, ev: Event) => any) | null;
  onend: ((this: ISpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: ISpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onresult: ((this: ISpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface ISpeechRecognitionConstructor {
  new (): ISpeechRecognition;
}

// Extend the Window interface to include webkitSpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: ISpeechRecognitionConstructor;
    webkitSpeechRecognition: ISpeechRecognitionConstructor;
  }
}

interface UseSpeechRecognitionProps {
  onResult?: (transcript: string) => void;
  onError?: (error: string) => void;
  silenceTimeout?: number; // timeout in milliseconds
  language?: string;
}

interface UseSpeechRecognitionReturn {
  transcript: string;
  isListening: boolean;
  isSupported: boolean;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

export const useSpeechRecognition = ({
  onResult,
  onError,
  silenceTimeout = 3000, // 3 seconds default
  language = 'en-US'
}: UseSpeechRecognitionProps = {}): UseSpeechRecognitionReturn => {
  const [transcript, setTranscript] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Check if Speech Recognition is supported
  const isSupported = Boolean(
    typeof window !== 'undefined' && 
    (window.SpeechRecognition || window.webkitSpeechRecognition)
  );

  // Initialize speech recognition
  const initializeRecognition = useCallback(() => {
    if (!isSupported) return null;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    // Configure recognition settings
    recognition.continuous = true; // Keep listening until manually stopped
    recognition.interimResults = true; // Show partial results
    recognition.lang = language;
    recognition.maxAlternatives = 1;

    // Handle successful speech recognition
    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      // Process all results
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;

        if (result.isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      // Update transcript with final + interim results
      const fullTranscript = finalTranscript || interimTranscript;
      setTranscript(fullTranscript);
      
      // Reset silence timer when speech is detected
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }

      // Set new silence timer
      silenceTimerRef.current = setTimeout(() => {
        stopListening();
      }, silenceTimeout);

      // Call result callback if provided
      if (finalTranscript && onResult) {
        onResult(finalTranscript);
      }
    };

    // Handle recognition start
    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
      console.log('Speech recognition started');
    };

    // Handle recognition end
    recognition.onend = () => {
      setIsListening(false);
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      console.log('Speech recognition ended');
    };

    // Handle recognition errors
    recognition.onerror = (event) => {
      setIsListening(false);
      let errorMessage = 'Speech recognition error occurred';

      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No speech detected. Please try again.';
          break;
        case 'audio-capture':
          errorMessage = 'No microphone was found. Please check your microphone.';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone permission denied. Please allow microphone access.';
          break;
        case 'network':
          errorMessage = 'Network error occurred. Please check your connection.';
          break;
        case 'service-not-allowed':
          errorMessage = 'Speech recognition service is not allowed.';
          break;
        default:
          errorMessage = `Speech recognition error: ${event.error}`;
      }

      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
      
      console.error('Speech recognition error:', event.error);
    };

    return recognition;
  }, [isSupported, language, silenceTimeout, onResult, onError]);

  // Start listening function
  const startListening = useCallback(() => {
    if (!isSupported) {
      const errorMsg = 'Speech recognition is not supported in this browser';
      setError(errorMsg);
      if (onError) onError(errorMsg);
      return;
    }

    if (isListening) return; // Already listening

    try {
      const recognition = initializeRecognition();
      if (recognition) {
        recognitionRef.current = recognition;
        recognition.start();
        setTranscript(''); // Clear previous transcript
        setError(null);

        // Set initial silence timer
        silenceTimerRef.current = setTimeout(() => {
          stopListening();
          setError('No speech detected within timeout period.');
        }, silenceTimeout);
      }
    } catch (err) {
      const errorMsg = 'Failed to start speech recognition';
      setError(errorMsg);
      if (onError) onError(errorMsg);
      console.error('Start listening error:', err);
    }
  }, [isSupported, isListening, initializeRecognition, silenceTimeout, onError]);

  // Stop listening function
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    
    setIsListening(false);
  }, [isListening]);

  // Reset transcript function
  const resetTranscript = useCallback(() => {
    setTranscript('');
    setError(null);
  }, []);

  return {
    transcript,
    isListening,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript
  };
};