/**
 * Speech Recognition Component with Microphone Button
 * @author NoteMart Team
 */

import React, { useState } from 'react';
import { Mic, MicOff, Volume2, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

interface SpeechRecognitionComponentProps {
  onTranscriptChange?: (transcript: string) => void;
  placeholder?: string;
  className?: string;
  silenceTimeout?: number;
  showCard?: boolean;
  autoSubmit?: boolean;
}

export const SpeechRecognitionComponent: React.FC<SpeechRecognitionComponentProps> = ({
  onTranscriptChange,
  placeholder = "Click the microphone button and start speaking...",
  className = "",
  silenceTimeout = 3000,
  showCard = true,
  autoSubmit = false
}) => {
  const [finalTranscript, setFinalTranscript] = useState<string>('');

  const {
    transcript,
    isListening,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript
  } = useSpeechRecognition({
    onResult: (result) => {
      setFinalTranscript(result);
      if (onTranscriptChange) {
        onTranscriptChange(result);
      }
      if (autoSubmit) {
        // Auto-submit logic can be implemented here
        console.log('Auto-submitting:', result);
      }
    },
    onError: (errorMsg) => {
      console.error('Speech recognition error:', errorMsg);
    },
    silenceTimeout
  });

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleClear = () => {
    resetTranscript();
    setFinalTranscript('');
    if (onTranscriptChange) {
      onTranscriptChange('');
    }
  };

  const displayText = transcript || finalTranscript;

  // If browser doesn't support speech recognition
  if (!isSupported) {
    return (
      <Alert className={`border-destructive ${className}`}>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Speech recognition is not supported in this browser. Please use Google Chrome for the best experience.
        </AlertDescription>
      </Alert>
    );
  }

  const content = (
    <div className="space-y-4">
      {/* Control Buttons */}
      <div className="flex items-center gap-3">
        {/* Microphone Button */}
        <Button
          onClick={handleMicClick}
          variant={isListening ? "destructive" : "default"}
          size="lg"
          className={`
            transition-all duration-200 transform hover:scale-105
            ${isListening 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
              : 'bg-primary hover:bg-primary/90'
            }
          `}
          disabled={!isSupported}
        >
          {isListening ? (
            <>
              <MicOff className="h-5 w-5 mr-2" />
              Stop Recording
            </>
          ) : (
            <>
              <Mic className="h-5 w-5 mr-2" />
              Start Recording
            </>
          )}
        </Button>

        {/* Clear Button */}
        {displayText && (
          <Button
            onClick={handleClear}
            variant="outline"
            size="lg"
            className="transition-all duration-200"
          >
            Clear
          </Button>
        )}

        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          {isListening && (
            <div className="flex items-center text-green-600">
              <Volume2 className="h-4 w-4 mr-1 animate-pulse" />
              <span className="text-sm font-medium">Listening...</span>
            </div>
          )}
          
          {finalTranscript && !isListening && (
            <div className="flex items-center text-green-600">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">Captured</span>
            </div>
          )}
        </div>
      </div>

      {/* Transcript Display Area */}
      <div className="space-y-2">
        <div className="relative">
          <div 
            className={`
              min-h-[120px] p-4 border-2 rounded-lg bg-background
              ${isListening ? 'border-green-400 bg-green-50/50' : 'border-border'}
              transition-all duration-200
            `}
          >
            {displayText ? (
              <p className="text-foreground leading-relaxed">
                {displayText}
                {isListening && <span className="animate-pulse">|</span>}
              </p>
            ) : (
              <p className="text-muted-foreground italic">
                {placeholder}
              </p>
            )}
          </div>
          
          {/* Listening Animation */}
          {isListening && (
            <div className="absolute top-2 right-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce-delay-1"></div>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce-delay-2"></div>
              </div>
            </div>
          )}
        </div>

        {/* Character Count */}
        {displayText && (
          <div className="text-right">
            <span className="text-sm text-muted-foreground">
              {displayText.length} characters
            </span>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <Alert className="border-destructive bg-destructive/10">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-destructive">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Instructions */}
      <div className="text-sm text-muted-foreground space-y-1">
        <p>💡 <strong>Tips:</strong></p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Click the microphone button to start/stop recording</li>
          <li>Speak clearly and at a normal pace</li>
          <li>Recording will auto-stop after {silenceTimeout / 1000} seconds of silence</li>
          <li>Works best in Google Chrome</li>
        </ul>
      </div>
    </div>
  );

  // Return with or without card wrapper
  if (showCard) {
    return (
      <Card className={`w-full max-w-2xl mx-auto ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Voice Input
          </CardTitle>
        </CardHeader>
        <CardContent>
          {content}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {content}
    </div>
  );
};

export default SpeechRecognitionComponent;