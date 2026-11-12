// Web Speech API Service for Voice Input and Text-To-Speech (TTS)

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export class SpeechService {
  private static recognition: any = null;
  private static isListening: boolean = false;

  public static isSpeechRecognitionSupported(): boolean {
    return typeof window !== 'undefined' && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  public static isSpeechSynthesisSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public static startListening(
    onResult: (transcript: string) => void,
    onError: (error: string) => void,
    onEnd: () => void,
    lang: 'en-US' | 'ar-SA' = 'en-US'
  ) {
    if (!this.isSpeechRecognitionSupported()) {
      onError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.lang = lang;
      this.recognition.continuous = false;
      this.recognition.interimResults = true;

      this.recognition.onstart = () => {
        this.isListening = true;
      };

      this.recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          currentTranscript += event.results[i][0].transcript;
        }
        if (currentTranscript) {
          onResult(currentTranscript);
        }
      };

      this.recognition.onerror = (event: any) => {
        this.isListening = false;
        onError(event.error || 'Speech recognition error occurred');
      };

      this.recognition.onend = () => {
        this.isListening = false;
        onEnd();
      };

      this.recognition.start();
    } catch (err: any) {
      onError(err.message || 'Failed to start speech recognition');
    }
  }

  public static stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  public static speak(text: string, onEnd?: () => void) {
    if (!this.isSpeechSynthesisSupported()) return;

    window.speechSynthesis.cancel(); // Stop any ongoing speech

    // Clean markdown headings, HTML tags and backticks for clean audio speech
    const cleanText = text
      .replace(/<[^>]*>?/gm, '')
      .replace(/[#*`_>]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/---/g, '')
      .trim();

    if (!cleanText) return;

    // Detect if text is mostly Arabic or English
    const arabicRegex = /[\u0600-\u06FF]/;
    const isArabic = arabicRegex.test(cleanText.slice(0, 100));

    const utterance = new SpeechSynthesisUtterance(cleanText.slice(0, 500)); // Speak first 500 chars comfortably
    utterance.lang = isArabic ? 'ar-SA' : 'en-US';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }

    window.speechSynthesis.speak(utterance);
  }

  public static stopSpeaking() {
    if (this.isSpeechSynthesisSupported()) {
      window.speechSynthesis.cancel();
    }
  }
}
