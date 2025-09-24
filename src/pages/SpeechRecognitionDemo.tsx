/**
 * Speech Recognition Demo Page
 * @author NoteMart Team
 */

import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import SpeechRecognitionComponent from '@/components/ui/SpeechRecognition';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Copy, Download, Mic } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SpeechRecognitionDemo: React.FC = () => {
  const [capturedText, setCapturedText] = useState<string>('');
  const [transcriptHistory, setTranscriptHistory] = useState<string[]>([]);
  const { toast } = useToast();

  const handleTranscriptChange = (transcript: string) => {
    setCapturedText(transcript);
    
    // Add to history if it's a new complete transcript
    if (transcript && !transcriptHistory.includes(transcript)) {
      setTranscriptHistory(prev => [transcript, ...prev.slice(0, 9)]); // Keep last 10
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Text copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy text",
        variant: "destructive",
      });
    }
  };

  const downloadAsText = (text: string) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `speech-transcript-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "Transcript saved as text file",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Mic className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-primary">Voice Input Demo</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Test our speech recognition feature. Perfect for taking quick notes, transcribing lectures, 
            or any time you want to convert speech to text.
          </p>
          <Badge variant="secondary" className="text-sm">
            Powered by Web Speech API
          </Badge>
        </div>

        <Separator />

        {/* Main Speech Recognition Component */}
        <SpeechRecognitionComponent
          onTranscriptChange={handleTranscriptChange}
          placeholder="🎤 Click the microphone and start speaking to see the magic happen..."
          silenceTimeout={4000} // 4 seconds for demo
          showCard={true}
        />

        {/* Current Transcript Actions */}
        {capturedText && (
          <Card>
            <CardHeader>
              <CardTitle>Current Transcript Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => copyToClipboard(capturedText)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copy Text
                </Button>
                <Button
                  onClick={() => downloadAsText(capturedText)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download as File
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Transcript History */}
        {transcriptHistory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Transcripts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transcriptHistory.map((transcript, index) => (
                  <div key={index} className="p-3 bg-muted rounded-lg">
                    <div className="flex justify-between items-start gap-3">
                      <p className="text-sm flex-1">{transcript}</p>
                      <Button
                        onClick={() => copyToClipboard(transcript)}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Browser Compatibility Info */}
        <Card>
          <CardHeader>
            <CardTitle>Browser Compatibility</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-green-600 mb-2">✅ Fully Supported</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Google Chrome (Desktop & Mobile)</li>
                  <li>• Microsoft Edge (Chromium-based)</li>
                  <li>• Opera</li>
                  <li>• Samsung Internet</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-orange-600 mb-2">⚠️ Limited or No Support</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Mozilla Firefox (Limited)</li>
                  <li>• Safari (No support)</li>
                  <li>• Internet Explorer (No support)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Info */}
        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Web Speech API Features:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground list-disc list-inside">
                  <li>Real-time speech-to-text conversion</li>
                  <li>Automatic silence detection (stops after 3-4 seconds of silence)</li>
                  <li>Multiple language support</li>
                  <li>Interim results (see text as you speak)</li>
                  <li>Error handling for various scenarios</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Privacy & Security:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground list-disc list-inside">
                  <li>Audio is processed by Google's servers (when using Chrome)</li>
                  <li>Requires microphone permission</li>
                  <li>No audio is stored locally by this application</li>
                  <li>Works only over HTTPS in production</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SpeechRecognitionDemo;