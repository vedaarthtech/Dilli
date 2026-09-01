import { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Sparkles,
  PhoneCall,
  Volume2,
  VolumeX,
  RotateCcw,
  CheckCircle2,
  CheckCheck,
  User,
  Languages,
} from 'lucide-react';
import { LANGUAGES, QUICK_REPLIES } from '../data/mockData';
import { SupportedLanguage, BusinessCategory, ChatMessage } from '../types';
import {
  generateSmartReceptionistReply,
  resolveConversationLanguage,
  extractUserName,
  extractPhoneNumber,
  ReceptionistSessionState,
} from '../utils/aiResponseEngine';
import { speakHumanVoice } from '../utils/voiceSynthesis';

interface AiReceptionistModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLanguage?: SupportedLanguage;
  initialBusiness?: BusinessCategory;
  onOpenVoiceCall: (business?: BusinessCategory, lang?: SupportedLanguage) => void;
  onOpenBookDemo: () => void;
}

export default function AiReceptionistModal({
  isOpen,
  onClose,
  initialLanguage = 'hi',
  onOpenVoiceCall,
  onOpenBookDemo,
}: AiReceptionistModalProps) {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(initialLanguage);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [voiceAudio, setVoiceAudio] = useState(false);
  const [appointmentBooked, setAppointmentBooked] = useState(false);
  const [sessionState, setSessionState] = useState<ReceptionistSessionState>({ turnCount: 0 });
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      setSessionState({ turnCount: 0 });
      setAppointmentBooked(false);

      const greeting =
        currentLanguage === 'hi'
          ? 'नमस्ते! मैक्स डेंटल क्लिनिक में आपका स्वागत है। बताइए, मैं आपकी क्या सहायता कर सकती हूँ?'
          : currentLanguage === 'hinglish'
          ? 'Hello! Max Dental Clinic mein aapka swagat hai. Main aapki kya help kar sakti hoon?'
          : 'Hello! Welcome to Max Dental Clinic. How may I assist you today?';

      setMessages([
        {
          id: `modal-init-${Date.now()}`,
          sender: 'ai',
          text: greeting,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          language: currentLanguage,
        },
      ]);
    }
  }, [isOpen, currentLanguage]);

  if (!isOpen) return null;

  const quickReplies = QUICK_REPLIES[currentLanguage] || QUICK_REPLIES.hi || QUICK_REPLIES.hinglish;

  const handleSend = (customText?: string) => {
    const text = (customText || inputValue).trim();
    if (!text) return;

    const detectedLang = resolveConversationLanguage(text, currentLanguage);
    if (detectedLang !== currentLanguage && (text.length > 10 || detectedLang === 'hi')) {
      setCurrentLanguage(detectedLang);
    }

    const extractedName = extractUserName(text);
    const extractedPhone = extractPhoneNumber(text);

    const updatedState: ReceptionistSessionState = {
      ...sessionState,
      userName: extractedName || sessionState.userName,
      userPhone: extractedPhone || sessionState.userPhone,
      turnCount: (sessionState.turnCount || 0) + 1,
    };

    setSessionState(updatedState);

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg: ChatMessage = {
      id: `modal-user-${Date.now()}`,
      sender: 'user',
      text,
      time: nowTime,
      language: detectedLang,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    if (extractedPhone || text.toLowerCase().includes('कन्फर्म') || text.toLowerCase().includes('confirm') || text.toLowerCase().includes('हाँ')) {
      setTimeout(() => {
        setAppointmentBooked(true);
      }, 1000);
    }

    setTimeout(() => {
      const reply = generateSmartReceptionistReply({
        language: detectedLang,
        businessType: 'clinic',
        userMessage: text,
        state: updatedState,
      });

      const aiMsg: ChatMessage = {
        id: `modal-ai-${Date.now()}`,
        sender: 'ai',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language: detectedLang,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);

      if (voiceAudio) {
        speakHumanVoice({
          text: reply,
          language: detectedLang,
        });
      }
    }, 120);
  };

  const handleReset = () => {
    setAppointmentBooked(false);
    setSessionState({ turnCount: 0 });
    const greeting =
      currentLanguage === 'hi'
        ? 'नमस्ते! मैक्स डेंटल क्लिनिक में आपका स्वागत है। बताइए, मैं आपकी क्या सहायता कर सकती हूँ?'
        : currentLanguage === 'hinglish'
        ? 'Hello! Max Dental Clinic mein aapka swagat hai. Main aapki kya help kar sakti hoon?'
        : 'Hello! Welcome to Max Dental Clinic. How may I assist you today?';
    setMessages([
      {
        id: `modal-reset-${Date.now()}`,
        sender: 'ai',
        text: greeting,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language: currentLanguage,
      },
    ]);
  };

  return (
    <div
      id="ai-receptionist-full-modal"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#0A1628]/70 backdrop-blur-md animate-in fade-in duration-200"
    >
      {/* Floating Always-Visible Top Right Close Button */}
      <button
        onClick={onClose}
        className="fixed top-3 right-3 sm:top-5 sm:right-5 z-60 w-11 h-11 rounded-full bg-[#1E293B]/90 hover:bg-[#334155] border border-[#475569] text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md"
        aria-label="काटें / Close"
        title="काटें / Close Window"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-[#CBD5E1] flex flex-col h-[90vh] max-h-[780px] overflow-hidden relative"
      >
        {/* Modal Top Navigation */}
        <div className="bg-[#F8FAFC] px-4 sm:px-5 py-3.5 border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0066FF] to-[#38BDF8] flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#0A1628]">Max Dental Clinic AI Front Desk</h3>
                <span className="flex items-center gap-1 text-[10px] font-bold text-[#22C55E] bg-[#F0FDF4] px-2 py-0.5 rounded-full border border-[#DCFCE7]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                  Live Simulator
                </span>
              </div>
              <p className="text-xs text-[#64748B]">Vasant Vihar, South Delhi • Dr. Arvind Sharma</p>
            </div>
          </div>

          <div className="flex items-center gap-2 pr-8 sm:pr-0">
            <button
              onClick={() => {
                onClose();
                onOpenVoiceCall('clinic', currentLanguage);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0A1628] hover:bg-[#1E293B] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              title="Switch to Live Voice Call"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#38BDF8] animate-pulse" />
              <span className="hidden sm:inline">Voice Call</span>
            </button>

            <button
              onClick={() => setVoiceAudio(!voiceAudio)}
              className={`p-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                voiceAudio
                  ? 'bg-[#EFF6FF] text-[#0066FF] border-[#BFDBFE]'
                  : 'bg-white text-[#64748B] border-[#E2E8F0]'
              }`}
              title={voiceAudio ? 'Voice is ON' : 'Enable Voice Audio'}
            >
              {voiceAudio ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={handleReset}
              className="p-2 rounded-xl text-xs font-semibold bg-white text-[#64748B] border border-[#E2E8F0] hover:bg-[#F8FAFC] cursor-pointer"
              title="Reset Chat"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-xs font-semibold bg-white text-[#64748B] border border-[#E2E8F0] hover:bg-[#F8FAFC] hover:text-[#0A1628] cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Language Selection Bar */}
        <div className="bg-[#F1F5F9] px-4 py-2.5 border-b border-[#E2E8F0] flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-xs text-[#475569] font-medium">
            <span>Max Dental & Multispeciality Clinic</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Languages className="w-3.5 h-3.5 text-[#0066FF]" />
            <select
              value={currentLanguage}
              onChange={(e) => setCurrentLanguage(e.target.value as SupportedLanguage)}
              className="bg-white border border-[#CBD5E1] rounded-lg px-2.5 py-1 text-xs font-semibold text-[#0066FF] focus:outline-none cursor-pointer"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.nativeLabel} ({l.label})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Caller ID Badge */}
        {sessionState.userName && (
          <div className="bg-[#EFF6FF] px-4 py-1.5 border-b border-[#DBEAFE] flex items-center gap-2 text-xs text-[#1D4ED8]">
            <User className="w-3.5 h-3.5" />
            <span>Patient: <strong>{sessionState.userName} Ji</strong></span>
          </div>
        )}

        {/* Chat History Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 chat-scroll bg-gradient-to-b from-[#F8FAFC] to-white">
          {messages.map((msg) => {
            const isAi = msg.sender === 'ai';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isAi ? 'items-start' : 'items-end'}`}
              >
                <div className="flex items-center gap-1 mb-1 text-[11px] text-[#94A3B8]">
                  <span>{isAi ? '🤖 Max Dental Receptionist' : `👤 ${sessionState.userName || 'You'}`}</span>
                  <span>• {msg.time}</span>
                </div>
                <div
                  className={`p-3.5 rounded-2xl leading-relaxed text-sm max-w-[85%] sm:max-w-[75%] shadow-2xs ${
                    isAi
                      ? 'bg-white text-[#0A1628] border border-[#E2E8F0] rounded-tl-xs'
                      : 'bg-[#0066FF] text-white rounded-tr-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-white border border-[#E2E8F0] w-fit">
              <span className="w-2 h-2 rounded-full bg-[#0066FF] animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-[#0066FF] animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-[#0066FF] animate-bounce [animation-delay:0.4s]" />
            </div>
          )}

          {appointmentBooked && (
            <div className="p-4 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#22C55E] flex items-center justify-center text-white shrink-0">
                  <CheckCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#166534]">Dental Consultation Confirmed</h4>
                  <p className="text-[11px] text-[#15803D]">Slot reserved at Max Dental Clinic, Vasant Vihar</p>
                </div>
              </div>
              <button
                onClick={onOpenBookDemo}
                className="px-3 py-1.5 rounded-xl bg-[#166534] text-white text-xs font-bold hover:bg-[#14532D] cursor-pointer"
              >
                View in CRM
              </button>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2.5 bg-[#F8FAFC] border-t border-[#E2E8F0]">
          <div className="text-[11px] font-semibold text-[#64748B] mb-1.5 px-1">
            Quick Clinic Questions:
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            {quickReplies.map((reply, i) => (
              <button
                key={i}
                onClick={() => handleSend(reply)}
                className="shrink-0 px-3 py-1.5 rounded-full bg-white hover:bg-[#EFF6FF] hover:border-[#BFDBFE] hover:text-[#0066FF] text-xs font-medium text-[#334155] border border-[#CBD5E1] transition-all cursor-pointer shadow-2xs"
              >
                {reply}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-[#E2E8F0]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="दांतों के इलाज, डॉक्टर की टाइमिंग या फीस के बारे में पूछें..."
              className="flex-1 px-4 py-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-sm text-[#0A1628] placeholder-[#94A3B8] focus:outline-none focus:border-[#0066FF] focus:bg-white transition-all"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="p-3 rounded-2xl bg-[#0066FF] hover:bg-[#0052CC] disabled:opacity-40 text-white transition-colors cursor-pointer shadow-xs"
              title="Send Message"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
