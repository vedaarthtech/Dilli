import { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  ArrowRight,
  Bot,
  User,
  Volume2,
  VolumeX,
  RotateCcw,
  CheckCheck,
  Building2,
  Stethoscope,
  Scissors,
  UtensilsCrossed,
  PhoneCall,
} from 'lucide-react';
import { LANGUAGES, BUSINESS_PROFILES, DEMO_CONVERSATIONS, QUICK_REPLIES } from '../data/mockData';
import { SupportedLanguage, BusinessCategory, ChatMessage } from '../types';
import {
  generateSmartReceptionistReply,
  resolveConversationLanguage,
  extractUserName,
  extractPhoneNumber,
  ReceptionistSessionState,
} from '../utils/aiResponseEngine';
import { speakHumanVoice } from '../utils/voiceSynthesis';

interface LiveDemoSectionProps {
  currentLanguage: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  onOpenAiTester: () => void;
  onOpenVoiceCall: () => void;
}

export default function LiveDemoSection({
  currentLanguage,
  onSelectLanguage,
  onOpenAiTester,
  onOpenVoiceCall,
}: LiveDemoSectionProps) {
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessCategory>('clinic');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [voiceAudioEnabled, setVoiceAudioEnabled] = useState(false);
  const [sessionState, setSessionState] = useState<ReceptionistSessionState>({ turnCount: 0 });
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Initialize/Reset conversation when language or business category changes
  useEffect(() => {
    setSessionState({ turnCount: 0 });
    const baseThread = DEMO_CONVERSATIONS[currentLanguage] || DEMO_CONVERSATIONS.hi || DEMO_CONVERSATIONS.en;
    const initialMsgs: ChatMessage[] = baseThread.map((msg, idx) => ({
      id: `init-${idx}-${currentLanguage}`,
      sender: msg.sender,
      text: msg.text,
      time: msg.time,
      language: currentLanguage,
    }));
    setMessages(initialMsgs);
  }, [currentLanguage, selectedBusiness]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const activeBusinessObj = BUSINESS_PROFILES.find((b) => b.id === selectedBusiness) || BUSINESS_PROFILES[0];
  const quickReplies = QUICK_REPLIES[currentLanguage] || QUICK_REPLIES.hi || QUICK_REPLIES.hinglish;

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    const userLang = resolveConversationLanguage(text, currentLanguage);
    if (userLang !== currentLanguage && (text.length > 10 || userLang === 'hi')) {
      onSelectLanguage(userLang);
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

    const newUserMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      time: nowTime,
      language: userLang,
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking and typing response
    setTimeout(() => {
      const reply = generateSmartReceptionistReply({
        language: userLang,
        businessType: selectedBusiness,
        userMessage: text,
        state: updatedState,
      });

      const newAiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language: userLang,
      };

      setMessages((prev) => [...prev, newAiMsg]);
      setIsTyping(false);

      // Voice synthesis simulation if enabled
      if (voiceAudioEnabled) {
        speakHumanVoice({
          text: reply,
          language: userLang,
        });
      }
    }, 120);
  };

  const handleResetChat = () => {
    setSessionState({ turnCount: 0 });
    const baseThread = DEMO_CONVERSATIONS[currentLanguage] || DEMO_CONVERSATIONS.hi || DEMO_CONVERSATIONS.en;
    setMessages(
      baseThread.map((msg, idx) => ({
        id: `reset-${idx}-${Date.now()}`,
        sender: msg.sender,
        text: msg.text,
        time: msg.time,
        language: currentLanguage,
      }))
    );
  };

  return (
    <section id="live-demo" className="py-20 sm:py-28 bg-white relative overflow-hidden">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-b from-[#E0F2FE]/40 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E0F2FE] border border-[#BAE6FD] text-xs font-bold text-[#0284C7] uppercase tracking-wider mb-3">
            LIVE DEMO
          </div>

          <h2
            id="live-demo-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-editorial tracking-tight text-[#0A1628] leading-[1.15] mb-4"
          >
            See it talk to a <span className="italic text-[#0066FF]">real customer.</span>
          </h2>

          <p className="text-base sm:text-lg text-[#475569] leading-relaxed font-sans-clean">
            A ChatGPT-style AI receptionist built for Delhi businesses.
          </p>
        </div>

        {/* Business Context Switcher Chips */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-6">
          <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider hidden sm:inline">
            Business Type:
          </span>
          <button
            onClick={() => setSelectedBusiness('clinic')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              selectedBusiness === 'clinic'
                ? 'bg-[#0066FF] text-white border-[#0066FF] shadow-xs'
                : 'bg-white text-[#334155] border-[#E2E8F0] hover:bg-[#F8FAFC]'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Dental Clinic (Vasant Vihar)</span>
          </button>
          <button
            onClick={() => setSelectedBusiness('salon')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              selectedBusiness === 'salon'
                ? 'bg-[#0066FF] text-white border-[#0066FF] shadow-xs'
                : 'bg-white text-[#334155] border-[#E2E8F0] hover:bg-[#F8FAFC]'
            }`}
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>Salon & Spa (Connaught Place)</span>
          </button>
          <button
            onClick={() => setSelectedBusiness('restaurant')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              selectedBusiness === 'restaurant'
                ? 'bg-[#0066FF] text-white border-[#0066FF] shadow-xs'
                : 'bg-white text-[#334155] border-[#E2E8F0] hover:bg-[#F8FAFC]'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Dining & Bar (GK II)</span>
          </button>
          <button
            onClick={() => setSelectedBusiness('realestate')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              selectedBusiness === 'realestate'
                ? 'bg-[#0066FF] text-white border-[#0066FF] shadow-xs'
                : 'bg-white text-[#334155] border-[#E2E8F0] hover:bg-[#F8FAFC]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>NCR Real Estate</span>
          </button>
        </div>

        {/* Multilingual Selector Bar */}
        <div className="bg-[#F1F5F9] p-1.5 rounded-2xl flex items-center justify-center gap-1 mb-6 flex-wrap shadow-inner border border-[#E2E8F0]">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              id={`demo-lang-btn-${lang.code}`}
              onClick={() => onSelectLanguage(lang.code)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                currentLanguage === lang.code
                  ? 'bg-white text-[#0066FF] shadow-xs font-bold'
                  : 'text-[#64748B] hover:text-[#0A1628]'
              }`}
            >
              {lang.nativeLabel}
            </button>
          ))}
        </div>

        {/* Interactive Chat Window */}
        <div
          id="live-chat-window"
          className="bg-white rounded-3xl border border-[#CBD5E1] shadow-xl overflow-hidden flex flex-col h-[560px] transition-all"
        >
          {/* Chat Window Header */}
          <div className="bg-[#F8FAFC] px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#0066FF] to-[#38BDF8] flex items-center justify-center text-white shadow-xs">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#22C55E] ring-2 ring-white" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-[#0A1628]">AI Receptionist</h4>
                  <span className="text-[10px] font-bold text-[#0066FF] bg-[#EFF6FF] px-2 py-0.5 rounded-full border border-[#DBEAFE]">
                    {activeBusinessObj.name.split(' ')[0]} Front Desk
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#22C55E] font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                  <span>Online · Typically replies instantly</span>
                </div>
              </div>
            </div>

            {/* Quick Chat Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenVoiceCall}
                title="Start Live Voice Call with AI"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#0A1628] hover:bg-[#1E293B] text-white transition-all shadow-xs cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#38BDF8] animate-pulse" />
                <span>Switch to Live Voice Call</span>
              </button>

              <button
                type="button"
                onClick={() => setVoiceAudioEnabled(!voiceAudioEnabled)}
                title={voiceAudioEnabled ? 'Voice audio enabled' : 'Enable voice audio'}
                className={`p-2 rounded-xl text-xs font-medium border transition-colors ${
                  voiceAudioEnabled
                    ? 'bg-[#EFF6FF] text-[#0066FF] border-[#BFDBFE]'
                    : 'bg-white text-[#64748B] border-[#E2E8F0] hover:bg-[#F8FAFC]'
                }`}
                aria-label="Toggle voice simulation"
              >
                {voiceAudioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={handleResetChat}
                title="Reset conversation"
                className="p-2 rounded-xl text-xs font-medium bg-white text-[#64748B] border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors"
                aria-label="Reset conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Message Thread */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 chat-scroll bg-gradient-to-b from-[#FAFBFD] to-white">
            {messages.map((msg) => {
              const isAi = msg.sender === 'ai';
              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2.5 ${isAi ? 'justify-start' : 'justify-end'}`}
                >
                  {isAi && (
                    <div className="w-7 h-7 rounded-full bg-[#0066FF] text-white flex items-center justify-center shrink-0 mb-1 text-xs font-bold shadow-2xs">
                      AI
                    </div>
                  )}

                  <div className={`max-w-[85%] sm:max-w-[75%] flex flex-col ${isAi ? 'items-start' : 'items-end'}`}>
                    <div
                      className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                        isAi
                          ? 'bg-white border border-[#E2E8F0] text-[#1E293B] shadow-2xs rounded-bl-xs'
                          : 'bg-[#0066FF] text-white shadow-xs rounded-br-xs'
                      }`}
                    >
                      <p>{msg.text}</p>
                    </div>

                    <div className="flex items-center gap-1.5 mt-1 px-1">
                      <span className="text-[10px] text-[#94A3B8] font-medium">{msg.time}</span>
                      {!isAi && <CheckCheck className="w-3 h-3 text-[#0066FF]" />}
                    </div>
                  </div>

                  {!isAi && (
                    <div className="w-7 h-7 rounded-full bg-[#E2E8F0] text-[#475569] flex items-center justify-center shrink-0 mb-1 text-xs font-bold">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-end gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-full bg-[#0066FF] text-white flex items-center justify-center shrink-0 mb-1 text-xs font-bold">
                  AI
                </div>
                <div className="px-4 py-3 rounded-2xl bg-white border border-[#E2E8F0] text-sm text-[#64748B] shadow-2xs rounded-bl-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#0066FF] animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 rounded-full bg-[#0066FF] animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 rounded-full bg-[#0066FF] animate-bounce"></span>
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Quick-Reply Suggestion Chips */}
          <div className="px-4 py-2.5 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider shrink-0">
              Quick Ask:
            </span>
            {quickReplies.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip)}
                className="shrink-0 px-3 py-1 rounded-full bg-white hover:bg-[#F0F7FF] text-[#0066FF] border border-[#CBD5E1] text-xs font-medium hover:border-[#0066FF] transition-all"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Chat Message Input Bar */}
          <div className="p-3 sm:p-4 bg-white border-t border-[#E2E8F0]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                id="live-demo-chat-input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-3 rounded-full bg-[#F8FAFC] border border-[#CBD5E1] focus:border-[#0066FF] focus:bg-white text-sm text-[#0A1628] placeholder-[#94A3B8] focus:outline-none transition-all"
              />
              <button
                id="live-demo-send-btn"
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="p-3 rounded-full bg-[#0066FF] hover:bg-[#0052CC] disabled:opacity-40 text-white shadow-xs transition-all flex items-center justify-center shrink-0 cursor-pointer"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* CTA Below Demo */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            id="demo-open-full-ai-btn"
            onClick={onOpenAiTester}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-blue-cta text-white text-sm sm:text-base font-semibold glow-blue hover:scale-[1.02] transition-all transform active:scale-98 cursor-pointer shadow-lg shadow-[#0066FF]/25"
          >
            <span>Open the full AI Receptionist</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            id="demo-start-voice-call-btn"
            onClick={onOpenVoiceCall}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-full bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#0066FF] text-sm sm:text-base font-semibold border border-[#BFDBFE] transition-all hover:scale-[1.02] cursor-pointer"
          >
            <PhoneCall className="w-4 h-4 text-[#0066FF] animate-pulse" />
            <span>Try Live Voice Call 📞</span>
          </button>
        </div>
      </div>
    </section>
  );
}
