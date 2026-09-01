import { useState, useEffect, useRef } from 'react';
import {
  X,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  RotateCcw,
  AudioWaveform,
  User,
  CalendarCheck,
  Languages,
} from 'lucide-react';
import { LANGUAGES, QUICK_REPLIES } from '../data/mockData';
import { SupportedLanguage, BusinessCategory, ChatMessage } from '../types';
import {
  generateSmartReceptionistReply,
  resolveConversationLanguage,
  extractUserName,
  extractPhoneNumber,
  isIncompleteThought,
  ReceptionistSessionState,
} from '../utils/aiResponseEngine';
import { speakHumanVoice, stopHumanVoice, isHumanVoiceSpeaking } from '../utils/voiceSynthesis';
import { isSelfSpeechEcho } from '../utils/echoFilter';

interface LiveVoiceCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLanguage?: SupportedLanguage;
  initialBusiness?: BusinessCategory;
  onOpenBookDemo: () => void;
}

export default function LiveVoiceCallModal({
  isOpen,
  onClose,
  initialLanguage = 'hi',
  onOpenBookDemo,
}: LiveVoiceCallModalProps) {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(initialLanguage);
  const [isMuted, setIsMuted] = useState(false);
  const [speakerEnabled, setSpeakerEnabled] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [callStatus, setCallStatus] = useState<'connecting' | 'connected' | 'ended'>('connecting');
  const [aiState, setAiState] = useState<'idle' | 'speaking' | 'listening' | 'thinking'>('idle');
  const [transcript, setTranscript] = useState<ChatMessage[]>([]);
  const [interimSpeech, setInterimSpeech] = useState('');
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [micSupported, setMicSupported] = useState(true);
  const [customText, setCustomText] = useState('');
  const [sessionState, setSessionState] = useState<ReceptionistSessionState>({ turnCount: 0 });

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);
  const transcriptBottomRef = useRef<HTMLDivElement>(null);
  const isAiSpeakingRef = useRef<boolean>(false);
  const aiSpokenHistoryRef = useRef<string[]>([]);
  const speechCooldownUntilRef = useRef<number>(0);
  const restartRecogTimerRef = useRef<any>(null);
  const silenceDebounceTimerRef = useRef<any>(null);
  const longSilenceTimerRef = useRef<any>(null);
  const accumulatedSpeechRef = useRef<string>('');

  // Sync initial language prop
  useEffect(() => {
    if (initialLanguage) setCurrentLanguage(initialLanguage);
  }, [initialLanguage]);

  // Handle Call Lifecycle
  useEffect(() => {
    if (isOpen) {
      setCallStatus('connecting');
      setCallDuration(0);
      setTranscript([]);
      setLeadCaptured(false);
      setInterimSpeech('');
      accumulatedSpeechRef.current = '';
      aiSpokenHistoryRef.current = [];
      speechCooldownUntilRef.current = 0;
      setSessionState({ turnCount: 0 });
      isAiSpeakingRef.current = false;

      const initialGreeting =
        currentLanguage === 'hi'
          ? 'नमस्ते, मैक्स डेंटल क्लिनिक। बताइए, मैं क्या मदद करूँ?'
          : currentLanguage === 'hinglish'
          ? 'Hello, Max Dental Clinic. बताइए, क्या help करूँ?'
          : 'Hello, Max Dental Clinic. How can I help you?';

      // Record initial greeting in history to prevent echo
      aiSpokenHistoryRef.current = [initialGreeting];

      // Connect after short realistic ringing simulation
      const connectTimer = setTimeout(() => {
        setCallStatus('connected');

        const initialMsg: ChatMessage = {
          id: `voice-init-${Date.now()}`,
          sender: 'ai',
          text: initialGreeting,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          language: currentLanguage,
        };

        setTranscript([initialMsg]);
        triggerAiSpeech(initialGreeting, currentLanguage);
      }, 700);

      // Duration counter
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);

      return () => {
        clearTimeout(connectTimer);
        if (timerRef.current) clearInterval(timerRef.current);
        if (restartRecogTimerRef.current) clearTimeout(restartRecogTimerRef.current);
        if (silenceDebounceTimerRef.current) clearTimeout(silenceDebounceTimerRef.current);
        if (longSilenceTimerRef.current) clearTimeout(longSilenceTimerRef.current);
        stopSpeech();
        stopListening();
      };
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (restartRecogTimerRef.current) clearTimeout(restartRecogTimerRef.current);
      if (silenceDebounceTimerRef.current) clearTimeout(silenceDebounceTimerRef.current);
      if (longSilenceTimerRef.current) clearTimeout(longSilenceTimerRef.current);
      stopSpeech();
      stopListening();
    }
  }, [isOpen, currentLanguage]);

  // Auto-scroll transcript smoothly
  useEffect(() => {
    transcriptBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript, interimSpeech]);

  // Setup Speech Recognition with full Barge-In & Fast Real-Time Human Response
  useEffect(() => {
    if (!isOpen || callStatus !== 'connected') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMicSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      // Set recognition language
      if (currentLanguage === 'hi') {
        recognition.lang = 'hi-IN';
      } else if (currentLanguage === 'pa') {
        recognition.lang = 'pa-IN';
      } else if (currentLanguage === 'bn') {
        recognition.lang = 'bn-IN';
      } else if (currentLanguage === 'ur') {
        recognition.lang = 'ur-PK';
      } else {
        recognition.lang = 'en-IN';
      }

      recognition.onresult = (event: any) => {
        let finalChunk = '';
        let interimChunk = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalChunk += event.results[i][0].transcript;
          } else {
            interimChunk += event.results[i][0].transcript;
          }
        }

        const currentSpoken = (finalChunk || interimChunk).trim();

        // ---------------------------------------------------------------------
        // REAL-TIME VOICE RULE 1: STRICT SELF-ECHO & FEEDBACK PREVENTION
        // ---------------------------------------------------------------------
        const isActivelySpeaking = isAiSpeakingRef.current || isHumanVoiceSpeaking();

        if (currentSpoken) {
          const isEcho = isSelfSpeechEcho(currentSpoken, aiSpokenHistoryRef.current);

          // If it is an echo of the AI's own voice playback, discard it completely
          if (isEcho) {
            return;
          }

          // If AI is speaking and genuine words from human caller are heard:
          // BARGE-IN: Stop AI speech immediately and listen to the caller.
          if (isActivelySpeaking && currentSpoken.length > 1) {
            stopHumanVoice();
            isAiSpeakingRef.current = false;
            setAiState('listening');
          }
        }

        let hadFinalChunk = false;
        if (finalChunk.trim()) {
          const cleanFinal = finalChunk.trim();
          if (!isSelfSpeechEcho(cleanFinal, aiSpokenHistoryRef.current)) {
            hadFinalChunk = true;
            accumulatedSpeechRef.current = accumulatedSpeechRef.current
              ? `${accumulatedSpeechRef.current} ${cleanFinal}`
              : cleanFinal;
          }
        }

        const activeText = (accumulatedSpeechRef.current
          ? `${accumulatedSpeechRef.current} ${interimChunk}`
          : interimChunk || finalChunk).trim();

        if (activeText) {
          // Double check echo on combined string
          if (isSelfSpeechEcho(activeText, aiSpokenHistoryRef.current)) {
            return;
          }

          setInterimSpeech(activeText);
          setAiState('listening');

          if (silenceDebounceTimerRef.current) clearTimeout(silenceDebounceTimerRef.current);
          if (longSilenceTimerRef.current) clearTimeout(longSilenceTimerRef.current);

          // -------------------------------------------------------------------
          // ADAPTIVE TURN DETECTION & NATURAL PHONE PAUSE
          // - If browser provided isFinal and the utterance is a complete thought: 220ms
          // - If thought is incomplete (e.g. ends with 'aur', 'because', 'lekin'): 480ms
          // - If only interim result: 400ms
          // -------------------------------------------------------------------
          const isIncomplete = isIncompleteThought(activeText);
          let turnDebounceMs = 400;

          if (hadFinalChunk) {
            turnDebounceMs = isIncomplete ? 480 : 220;
          } else if (isIncomplete) {
            turnDebounceMs = 520;
          }

          silenceDebounceTimerRef.current = setTimeout(() => {
            const statementToProcess = (accumulatedSpeechRef.current
              ? `${accumulatedSpeechRef.current} ${interimChunk}`
              : interimChunk || finalChunk || accumulatedSpeechRef.current).trim();

            accumulatedSpeechRef.current = '';
            setInterimSpeech('');

            // CRITICAL: NEVER respond to self speech or empty silence
            if (
              statementToProcess &&
              statementToProcess.length > 1 &&
              !isSelfSpeechEcho(statementToProcess, aiSpokenHistoryRef.current)
            ) {
              handleUserSpoken(statementToProcess);
            }
          }, turnDebounceMs);
        }
      };

      recognition.onerror = (err: any) => {
        console.warn('Speech recognition status:', err.error);
        if (err.error === 'not-allowed') {
          setMicSupported(false);
        }
      };

      recognition.onend = () => {
        // Auto-restart recognition only if caller is not muted and call is active
        if (isOpen && callStatus === 'connected' && !isMuted) {
          try {
            recognition.start();
          } catch {
            // Already active
          }
        }
      };

      recognitionRef.current = recognition;

      if (!isMuted) {
        try {
          recognition.start();
        } catch {
          // ignore
        }
      }
    } catch (e) {
      console.warn('Speech recognition setup error:', e);
      setMicSupported(false);
    }

    return () => {
      stopListening();
    };
  }, [isOpen, callStatus, currentLanguage, isMuted]);

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // no-op
      }
    }
  };

  const resumeListening = () => {
    if (isMuted || !isOpen || callStatus !== 'connected') return;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch {
        // already active
      }
    }
  };

  const stopSpeech = () => {
    isAiSpeakingRef.current = false;
    stopHumanVoice();
    setAiState('idle');
  };

  const triggerAiSpeech = (text: string, lang: SupportedLanguage) => {
    // Record utterance in history to avoid self-echo forever
    aiSpokenHistoryRef.current = [text, ...aiSpokenHistoryRef.current.slice(0, 5)];

    if (!speakerEnabled) {
      setAiState('idle');
      return;
    }

    isAiSpeakingRef.current = true;
    setAiState('speaking');

    speakHumanVoice({
      text,
      language: lang,
      onStart: () => {
        setAiState('speaking');
      },
      onEnd: () => {
        isAiSpeakingRef.current = false;
        // Natural 200ms audio bounce cooldown
        speechCooldownUntilRef.current = Date.now() + 200;
        setAiState('listening');
        if (restartRecogTimerRef.current) clearTimeout(restartRecogTimerRef.current);
        restartRecogTimerRef.current = setTimeout(() => {
          resumeListening();
        }, 50);
      },
      onError: () => {
        isAiSpeakingRef.current = false;
        speechCooldownUntilRef.current = Date.now() + 100;
        setAiState('listening');
        resumeListening();
      },
    });
  };

  // -------------------------------------------------------------
  // Conversational Cycle: Instant Natural Front Desk Response
  // -------------------------------------------------------------
  const handleUserSpoken = (spokenText: string) => {
    if (!spokenText.trim()) return;

    // Reject self echo / audio bleed completely
    if (isSelfSpeechEcho(spokenText, aiSpokenHistoryRef.current)) {
      return;
    }

    // Detect language accurately
    const detectedLang = resolveConversationLanguage(spokenText, currentLanguage);
    if (detectedLang !== currentLanguage && (spokenText.length > 10 || detectedLang === 'hi')) {
      setCurrentLanguage(detectedLang);
    }

    const extractedName = extractUserName(spokenText);
    const extractedPhone = extractPhoneNumber(spokenText);

    const updatedState: ReceptionistSessionState = {
      ...sessionState,
      userName: extractedName || sessionState.userName,
      userPhone: extractedPhone || sessionState.userPhone,
      turnCount: (sessionState.turnCount || 0) + 1,
    };

    setSessionState(updatedState);

    // Record User Turn in Transcript
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const userMessage: ChatMessage = {
      id: `voice-user-${Date.now()}`,
      sender: 'user',
      text: spokenText,
      time: nowTime,
      language: detectedLang,
    };

    setTranscript((prev) => [...prev, userMessage]);

    if (
      extractedPhone ||
      spokenText.toLowerCase().includes('कन्फर्म') ||
      spokenText.toLowerCase().includes('confirm') ||
      spokenText.toLowerCase().includes('हाँ') ||
      spokenText.toLowerCase().includes('ha') ||
      spokenText.toLowerCase().includes('haan')
    ) {
      setLeadCaptured(true);
    }

    // Instant realistic response without artificial delays
    stopSpeech();
    setAiState('thinking');

    // Immediate generation & immediate voice trigger (0ms delay)
    const reply = generateSmartReceptionistReply({
      language: detectedLang,
      businessType: 'clinic',
      userMessage: spokenText,
      state: updatedState,
    });

    const aiMessage: ChatMessage = {
      id: `voice-ai-${Date.now()}`,
      sender: 'ai',
      text: reply,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      language: detectedLang,
    };

    setTranscript((prev) => [...prev, aiMessage]);
    triggerAiSpeech(reply, detectedLang);
  };

  const handleEndCall = () => {
    stopSpeech();
    stopListening();
    setCallStatus('ended');
  };

  const handleRestartCall = () => {
    setCallStatus('connecting');
    setCallDuration(0);
    setTranscript([]);
    setLeadCaptured(false);
    setInterimSpeech('');
    accumulatedSpeechRef.current = '';
    setSessionState({ turnCount: 0 });

    setTimeout(() => {
      setCallStatus('connected');
      const greeting =
        currentLanguage === 'hi'
          ? 'नमस्ते! मैक्स डेंटल क्लिनिक में आपका स्वागत है। बताइए, मैं आपकी क्या सहायता कर सकती हूँ?'
          : currentLanguage === 'hinglish'
          ? 'Hello! Max Dental Clinic mein aapka swagat hai. Main aapki kya help kar sakti hoon?'
          : 'Hello! Welcome to Max Dental Clinic. How may I assist you today?';

      setTranscript([
        {
          id: `voice-reinit-${Date.now()}`,
          sender: 'ai',
          text: greeting,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          language: currentLanguage,
        },
      ]);
      triggerAiSpeech(greeting, currentLanguage);
    }, 600);
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const quickChips = QUICK_REPLIES[currentLanguage] || QUICK_REPLIES.hi || QUICK_REPLIES.hinglish;

  if (!isOpen) return null;

  return (
    <div
      id="live-voice-calling-modal"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#070D18]/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      {/* Floating Always-Visible Top Right Close/Cut Button */}
      <button
        onClick={onClose}
        className="fixed top-3 right-3 sm:top-5 sm:right-5 z-60 w-11 h-11 rounded-full bg-[#1E293B]/90 hover:bg-[#334155] border border-[#475569] text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md"
        aria-label="कॉल काटें / Close Call"
        title="कॉल काटें / Close Window"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0A1628] text-white w-full max-w-4xl rounded-3xl shadow-2xl border border-[#1E293B] flex flex-col md:flex-row h-[92vh] max-h-[780px] overflow-hidden relative"
      >
        {/* Left / Main Voice Calling Screen */}
        <div className="flex-1 flex flex-col justify-between p-4 sm:p-7 relative border-b md:border-b-0 md:border-r border-[#1E293B] bg-gradient-to-b from-[#0F1E36] via-[#0A1628] to-[#060D18] overflow-y-auto">
          {/* Top Status Bar */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    callStatus === 'connected' ? 'bg-[#22C55E]' : 'bg-[#EAB308]'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-3 w-3 ${
                    callStatus === 'connected' ? 'bg-[#22C55E]' : 'bg-[#EAB308]'
                  }`}
                />
              </span>
              <div>
                <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                  {callStatus === 'connected'
                    ? 'Live Voice Call • Active'
                    : callStatus === 'connecting'
                    ? 'Connecting to Clinic Front Desk...'
                    : 'Call Ended'}
                </span>
                <div className="text-xs font-mono font-bold text-white flex items-center gap-2">
                  <span>{formatTimer(callDuration)}</span>
                  <span className="text-[#38BDF8]">• AI Clinic Receptionist</span>
                </div>
              </div>
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-2 pr-8 sm:pr-0">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#1E293B] border border-[#334155]">
                <Languages className="w-3.5 h-3.5 text-[#38BDF8]" />
                <select
                  value={currentLanguage}
                  onChange={(e) => {
                    const newLang = e.target.value as SupportedLanguage;
                    setCurrentLanguage(newLang);
                  }}
                  className="bg-transparent text-[#38BDF8] text-xs font-semibold focus:outline-none cursor-pointer"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code} className="bg-[#0F1E36] text-white">
                      {l.nativeLabel} ({l.label})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Center: AI Avatar & Dynamic Voice Visualizer */}
          <div className="flex flex-col items-center justify-center my-auto py-3">
            {/* Caller ID badge if name is recognized */}
            {sessionState.userName && (
              <div className="mb-3 px-4 py-1.5 rounded-full bg-[#1E293B] border border-[#38BDF8]/40 text-xs font-bold text-[#38BDF8] flex items-center gap-1.5 animate-in fade-in">
                <User className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Caller: {sessionState.userName} Ji</span>
              </div>
            )}

            <div className="relative mb-4">
              {/* Pulsating animated glow for speaking / listening / thinking states */}
              {aiState === 'speaking' && (
                <div className="absolute inset-0 -m-3 rounded-full bg-[#0066FF]/35 animate-ping duration-1000" />
              )}
              {aiState === 'listening' && (
                <div className="absolute inset-0 -m-3 rounded-full bg-[#22C55E]/30 animate-pulse duration-700" />
              )}
              {aiState === 'thinking' && (
                <div className="absolute inset-0 -m-3 rounded-full bg-[#38BDF8]/30 animate-pulse duration-500" />
              )}

              <div
                className={`w-20 h-20 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-[#0066FF] to-[#38BDF8] flex items-center justify-center text-white shadow-xl relative z-10 border-2 transition-all ${
                  aiState === 'speaking'
                    ? 'border-[#38BDF8] ring-4 ring-[#0066FF]/50 scale-105'
                    : aiState === 'listening'
                    ? 'border-[#22C55E] ring-4 ring-[#22C55E]/50'
                    : aiState === 'thinking'
                    ? 'border-[#38BDF8] ring-4 ring-[#38BDF8]/50'
                    : 'border-[#1E293B]'
                }`}
              >
                <Sparkles className="w-10 h-10 sm:w-12 sm:h-12" />
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-editorial font-bold text-white mb-0.5">
              Max Dental <span className="text-[#38BDF8] italic">Front Desk</span>
            </h3>
            <p className="text-xs text-[#94A3B8] mb-3 text-center">
              Vasant Vihar, South Delhi • Dr. Arvind Sharma (Senior Dental Surgeon)
            </p>

            {/* Live Audio Frequency Visualizer */}
            <div className="flex items-center gap-1.5 h-10 px-5 sm:px-6 py-2 rounded-full bg-[#132238]/90 border border-[#1E293B]">
              <span className="text-[11px] font-semibold text-[#94A3B8] mr-2">
                {aiState === 'speaking'
                  ? 'AI Speaking...'
                  : aiState === 'listening'
                  ? 'Listening to caller...'
                  : aiState === 'thinking'
                  ? 'Processing...'
                  : 'Ready • Speak into Mic'}
              </span>
              {[35, 75, 95, 55, 85, 100, 70, 45, 90, 60, 30].map((h, i) => (
                <span
                  key={i}
                  className={`w-1 rounded-full transition-all duration-150 ${
                    aiState === 'speaking'
                      ? 'bg-[#38BDF8] animate-pulse'
                      : aiState === 'listening'
                      ? 'bg-[#22C55E]'
                      : aiState === 'thinking'
                      ? 'bg-[#EAB308]'
                      : 'bg-[#334155]'
                  }`}
                  style={{
                    height:
                      aiState === 'speaking' || aiState === 'listening' || aiState === 'thinking'
                        ? `${Math.max(14, (h * ((i % 3) + 1)) % 30)}px`
                        : '6px',
                  }}
                />
              ))}
            </div>

            {/* Real-time speech preview banner if caller is currently speaking */}
            {interimSpeech && (
              <div className="mt-3 px-4 py-2 rounded-2xl bg-[#0F2942] border border-[#0284C7] text-xs text-[#E0F2FE] max-w-sm text-center animate-pulse">
                🎙️ "{interimSpeech}..."
              </div>
            )}

            {/* Lead capture notification */}
            {leadCaptured && (
              <div className="mt-3 px-3.5 py-1.5 rounded-full bg-[#14532D]/90 border border-[#22C55E]/40 text-[11px] font-bold text-[#86EFAC] flex items-center gap-1.5 animate-in fade-in">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
                <span>Appointment details logged in Clinic Front Desk</span>
              </div>
            )}
          </div>

          {/* Quick Voice Suggestion Chips */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-[11px] text-[#94A3B8] mb-1.5 px-1 font-semibold">
              <span>Sample Caller Statements:</span>
              <span className="text-[#38BDF8]">Tap to simulate speech</span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {quickChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleUserSpoken(chip)}
                  className="shrink-0 px-3 py-1.5 rounded-full bg-[#1E293B] hover:bg-[#334155] text-xs font-medium text-[#E2E8F0] border border-[#334155] transition-all cursor-pointer"
                >
                  "{chip}"
                </button>
              ))}
            </div>
          </div>

          {/* Bottom In-Call Controls */}
          <div className="flex items-center justify-center gap-3 pt-2">
            {callStatus !== 'ended' ? (
              <>
                {/* Mic Mute / Unmute Button */}
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-3.5 rounded-full border transition-all cursor-pointer ${
                    isMuted
                      ? 'bg-[#EF4444]/20 border-[#EF4444] text-[#EF4444]'
                      : 'bg-[#1E293B] hover:bg-[#334155] border-[#334155] text-white'
                  }`}
                  title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
                >
                  {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                {/* Speaker Toggle */}
                <button
                  onClick={() => setSpeakerEnabled(!speakerEnabled)}
                  className={`p-3.5 rounded-full border transition-all cursor-pointer ${
                    !speakerEnabled
                      ? 'bg-[#EF4444]/20 border-[#EF4444] text-[#EF4444]'
                      : 'bg-[#1E293B] hover:bg-[#334155] border-[#334155] text-white'
                  }`}
                  title={speakerEnabled ? 'Mute AI Voice' : 'Enable AI Voice'}
                >
                  {speakerEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </button>

                {/* End Call Button */}
                <button
                  onClick={handleEndCall}
                  className="px-6 py-3.5 rounded-full bg-[#EF4444] hover:bg-[#DC2626] text-white font-bold text-sm shadow-lg shadow-[#EF4444]/30 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                >
                  <PhoneOff className="w-5 h-5" />
                  <span>End Call</span>
                </button>

                {/* Close window */}
                <button
                  onClick={onClose}
                  className="p-3.5 rounded-full bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-[#94A3B8] hover:text-white cursor-pointer"
                  title="कॉल काटें / Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleRestartCall}
                  className="px-6 py-3 rounded-full bg-blue-cta text-white font-bold text-sm flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Call Again</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onOpenBookDemo();
                  }}
                  className="px-5 py-3 rounded-full bg-[#22C55E] text-white font-bold text-sm flex items-center gap-2 cursor-pointer"
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>Deploy for My Clinic</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Live Call Transcript & Typing input fallback */}
        <div className="w-full md:w-80 lg:w-96 bg-[#08101E] flex flex-col justify-between p-4 sm:p-5 h-[280px] md:h-auto border-t md:border-t-0 border-[#1E293B]">
          {/* Header */}
          <div className="pb-3 border-b border-[#1E293B] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AudioWaveform className="w-4 h-4 text-[#38BDF8]" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Live Voice Transcript
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1E293B] text-[#94A3B8]">
              {transcript.length} turns
            </span>
          </div>

          {/* Transcript Scroll Area */}
          <div className="flex-1 overflow-y-auto py-3 space-y-3 chat-scroll pr-1 overscroll-contain touch-pan-y">
            {transcript.map((msg) => {
              const isAi = msg.sender === 'ai';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAi ? 'items-start' : 'items-end'} text-xs`}
                >
                  <div className="flex items-center gap-1 mb-1 text-[10px] text-[#64748B]">
                    <span>{isAi ? '🤖 Max Dental Receptionist' : `👤 ${sessionState.userName || 'You'}`}</span>
                    <span>• {msg.time}</span>
                  </div>
                  <div
                    className={`p-3 rounded-2xl leading-relaxed max-w-[90%] ${
                      isAi
                        ? 'bg-[#0F1E36] text-[#E2E8F0] border border-[#1E293B] rounded-tl-xs'
                        : 'bg-[#0066FF] text-white rounded-tr-xs'
                    }`}
                  >
                    <p>{msg.text}</p>
                  </div>
                </div>
              );
            })}
            <div ref={transcriptBottomRef} />
          </div>

          {/* Manual Speak/Type Bar */}
          <div className="pt-3 border-t border-[#1E293B]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!customText.trim()) return;
                handleUserSpoken(customText);
                setCustomText('');
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="बोलें या लिखें (जैसे: मेरा नाम अभिषेक है...)"
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#0F1E36] border border-[#1E293B] text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#0066FF]"
              />
              <button
                type="submit"
                disabled={!customText.trim()}
                className="p-2.5 rounded-xl bg-[#0066FF] disabled:opacity-40 text-white text-xs font-bold shrink-0 cursor-pointer"
              >
                Send
              </button>
            </form>
            <p className="text-[10px] text-[#64748B] mt-2 text-center">
              🎙️ Speak via microphone or type questions directly into the live call.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
