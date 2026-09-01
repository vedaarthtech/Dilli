import { SupportedLanguage } from '../types';

// Cache available browser voices
let cachedVoices: SpeechSynthesisVoice[] = [];

export function getBrowserVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return [];
  }
  const voices = window.speechSynthesis.getVoices();
  if (voices && voices.length > 0) {
    cachedVoices = voices;
  }
  return cachedVoices;
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  // Eagerly populate voices
  getBrowserVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
}

/**
 * Finds the highest quality, most natural sounding voice for the requested language.
 * Prefers natural neural voices (Google, Microsoft Online, Natural) for human-like conversational warmth.
 */
export function getBestVoiceForLanguage(lang: SupportedLanguage): SpeechSynthesisVoice | null {
  const voices = getBrowserVoices();
  if (!voices || voices.length === 0) return null;

  if (lang === 'hi' || lang === 'hinglish') {
    // 1. First priority: High-quality natural Hindi voices (hi-IN)
    const naturalHindi = voices.find(
      (v) =>
        (v.lang.toLowerCase().startsWith('hi') || v.lang.includes('HI')) &&
        (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Swara') || v.name.includes('Madhur') || v.name.includes('Kalpana') || v.name.includes('Lekha'))
    );
    if (naturalHindi) return naturalHindi;

    // 2. Any Hindi voice
    const anyHindi = voices.find(
      (v) => v.lang.toLowerCase().startsWith('hi') || v.name.toLowerCase().includes('hindi') || v.name.toLowerCase().includes('हिन्दी')
    );
    if (anyHindi) return anyHindi;

    // 3. Indian English voice fallback for warm Indian pronunciation
    const indianEnglish = voices.find(
      (v) =>
        (v.lang === 'en-IN' || v.lang === 'en_IN') &&
        (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Neerja') || v.name.includes('Prabhat') || v.name.includes('Heera'))
    );
    if (indianEnglish) return indianEnglish;
  }

  if (lang === 'pa') {
    const paVoice = voices.find((v) => v.lang.toLowerCase().startsWith('pa') || v.name.toLowerCase().includes('punjabi'));
    if (paVoice) return paVoice;
  }

  if (lang === 'bn') {
    const bnVoice = voices.find((v) => v.lang.toLowerCase().startsWith('bn') || v.name.toLowerCase().includes('bengali') || v.name.toLowerCase().includes('bangla'));
    if (bnVoice) return bnVoice;
  }

  if (lang === 'ur') {
    const urVoice = voices.find((v) => v.lang.toLowerCase().startsWith('ur') || v.name.toLowerCase().includes('urdu'));
    if (urVoice) return urVoice;
  }

  // English: Prioritize Indian English for natural local clinic tone, or natural clear English voice
  const naturalIndianEnglish = voices.find(
    (v) =>
      v.lang.startsWith('en-IN') &&
      (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Neerja') || v.name.includes('Online'))
  );
  if (naturalIndianEnglish) return naturalIndianEnglish;

  const anyIndianEnglish = voices.find((v) => v.lang === 'en-IN' || v.lang === 'en_IN');
  if (anyIndianEnglish) return anyIndianEnglish;

  const naturalEnglish = voices.find(
    (v) =>
      v.lang.startsWith('en') &&
      (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Karen') || v.name.includes('Zira'))
  );
  if (naturalEnglish) return naturalEnglish;

  return voices.find((v) => v.lang.startsWith('en')) || voices[0] || null;
}

export interface SpeakOptions {
  text: string;
  language: SupportedLanguage;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: any) => void;
}

// Retain reference globally to prevent garbage collection cutoff in Chromium
declare global {
  interface Window {
    __activeSpeechUtterance?: SpeechSynthesisUtterance | null;
  }
}

/**
 * Converts numbers and times into natural phonetically clear spoken words for TTS.
 */
function prepareTextForSpeech(text: string, language: SupportedLanguage): string {
  let cleaned = text
    .replace(/[*_#~`]/g, '')
    .replace(/[\u{1F300}-\u{1F9FF}]/gu, '') // strip decorative emojis
    .replace(/\s+/g, ' ')
    .trim();

  if (language === 'hi' || language === 'hinglish') {
    cleaned = cleaned
      .replace(/₹\s*800/g, 'आठ सौ रुपये')
      .replace(/₹\s*1[,.]?800/g, 'अठारह सौ रुपये')
      .replace(/₹\s*4[,.]?500/g, 'साढ़े चार हज़ार रुपये')
      .replace(/₹\s*(\d+)/g, '$1 रुपये')
      .replace(/\b5:00\s*pm\b/gi, 'शाम पाँच बजे')
      .replace(/\b6:00\s*pm\b/gi, 'शाम छह बजे')
      .replace(/\b2:00\s*pm\b/gi, 'दोपहर दो बजे')
      .replace(/\b8:00\s*pm\b/gi, 'रात आठ बजे')
      .replace(/\b11:30\s*am\b/gi, 'सुबह साढ़े ग्यारह बजे')
      .replace(/\bdr\.\s*/gi, 'डॉक्टर ');
  } else {
    cleaned = cleaned
      .replace(/₹\s*(\d+)/g, '$1 rupees')
      .replace(/\bdr\.\s*/gi, 'Doctor ');
  }

  return cleaned;
}

/**
 * Speaks text naturally with human conversational cadence.
 */
export function speakHumanVoice({ text, language, onStart, onEnd, onError }: SpeakOptions): SpeechSynthesisUtterance | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return null;
  }

  try {
    // Unpause if in paused state
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    // Cancel previous
    window.speechSynthesis.cancel();
  } catch {
    // ignore
  }

  // Clean text of markdown/asterisks or excessive emojis for clean, crisp voice synthesis
  const cleanSpeechText = prepareTextForSpeech(text, language);

  if (!cleanSpeechText) {
    if (onEnd) onEnd();
    return null;
  }

  const utterance = new SpeechSynthesisUtterance(cleanSpeechText);
  window.__activeSpeechUtterance = utterance;

  const voice = getBestVoiceForLanguage(language);
  if (voice) {
    utterance.voice = voice;
  }

  // Warm, clear conversational pacing (0.95 - 0.98 for optimal clarity and human warmth)
  if (language === 'hi' || language === 'hinglish') {
    utterance.lang = 'hi-IN';
    utterance.rate = 0.96;
    utterance.pitch = 1.0;
  } else if (language === 'pa') {
    utterance.lang = 'pa-IN';
    utterance.rate = 0.96;
    utterance.pitch = 1.0;
  } else if (language === 'bn') {
    utterance.lang = 'bn-IN';
    utterance.rate = 0.96;
    utterance.pitch = 1.0;
  } else if (language === 'ur') {
    utterance.lang = 'ur-PK';
    utterance.rate = 0.96;
    utterance.pitch = 1.0;
  } else {
    utterance.lang = 'en-IN';
    utterance.rate = 0.98;
    utterance.pitch = 1.0;
  }

  utterance.onstart = () => {
    if (onStart) onStart();
  };

  utterance.onend = () => {
    window.__activeSpeechUtterance = null;
    if (onEnd) onEnd();
  };

  utterance.onerror = (e) => {
    console.warn('Speech synthesis error:', e);
    window.__activeSpeechUtterance = null;
    if (onError) onError(e);
    if (onEnd) onEnd();
  };

  try {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    window.speechSynthesis.speak(utterance);
    return utterance;
  } catch (e) {
    console.warn('SpeechSynthesis execute error:', e);
    window.__activeSpeechUtterance = null;
    if (onEnd) onEnd();
    return null;
  }
}

/**
 * Returns whether speech synthesis is actively outputting voice.
 */
export function isHumanVoiceSpeaking(): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }
  return window.speechSynthesis.speaking || window.speechSynthesis.pending || !!window.__activeSpeechUtterance;
}

/**
 * Instantly stops any active speech synthesis for immediate interruption/barge-in.
 */
export function stopHumanVoice() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      window.__activeSpeechUtterance = null;
    } catch {
      // ignore
    }
  }
}

