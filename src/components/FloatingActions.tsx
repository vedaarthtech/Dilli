import { useState } from 'react';
import { Sparkles, Phone, MessageCircle, X } from 'lucide-react';

interface FloatingActionsProps {
  onOpenAiTester: () => void;
  onOpenVoiceCall: () => void;
  onOpenWhatsAppModal: () => void;
}

export default function FloatingActions({
  onOpenAiTester,
  onOpenVoiceCall,
  onOpenWhatsAppModal,
}: FloatingActionsProps) {
  const [tooltip, setTooltip] = useState<string | null>(null);

  return (
    <aside
      id="floating-actions-container"
      aria-label="Quick Actions"
      className="fixed bottom-6 right-4 sm:right-6 z-50 flex flex-col items-end gap-3 pointer-events-auto select-none"
    >
      {/* 1. Green Circular WhatsApp Button */}
      <div className="relative group">
        <button
          id="floating-whatsapp-btn"
          type="button"
          onClick={onOpenWhatsAppModal}
          onMouseEnter={() => setTooltip('whatsapp')}
          onMouseLeave={() => setTooltip(null)}
          className="w-13 h-13 rounded-full bg-[#22C55E] hover:bg-[#16A34A] text-white flex items-center justify-center shadow-lg shadow-[#22C55E]/30 hover:scale-108 active:scale-95 transition-all duration-200 cursor-pointer"
          aria-label="Open WhatsApp Chat"
        >
          <MessageCircle className="w-6 h-6 fill-white" />
        </button>
        {tooltip === 'whatsapp' && (
          <div className="hidden sm:block absolute right-16 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#0A1628] text-white text-xs font-semibold rounded-xl whitespace-nowrap shadow-md pointer-events-none animate-in fade-in slide-in-from-right-2 duration-150">
            WhatsApp AI Assistant
          </div>
        )}
      </div>

      {/* 2. Blue Circular Phone Button - Triggers Live Voice Call */}
      <div className="relative group">
        <button
          id="floating-phone-btn"
          type="button"
          onClick={onOpenVoiceCall}
          onMouseEnter={() => setTooltip('phone')}
          onMouseLeave={() => setTooltip(null)}
          className="w-13 h-13 rounded-full bg-[#0066FF] hover:bg-[#0052CC] text-white flex items-center justify-center shadow-lg shadow-[#0066FF]/30 hover:scale-108 active:scale-95 transition-all duration-200 cursor-pointer animate-bounce [animation-iteration-count:3]"
          aria-label="Start Live AI Voice Call"
        >
          <Phone className="w-6 h-6 animate-pulse" />
        </button>
        {tooltip === 'phone' && (
          <div className="hidden sm:block absolute right-16 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#0A1628] text-white text-xs font-semibold rounded-xl whitespace-nowrap shadow-md pointer-events-none animate-in fade-in slide-in-from-right-2 duration-150">
            📞 Live Voice Call with AI
          </div>
        )}
      </div>

      {/* 3. Blue Pill: "✦ AI Receptionist" */}
      <div className="relative group">
        <button
          id="floating-ai-receptionist-pill"
          type="button"
          onClick={onOpenAiTester}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-blue-cta text-white text-xs sm:text-sm font-bold shadow-xl shadow-[#0066FF]/35 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 border border-white/20 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-cyan-200 animate-pulse" />
          <span>✦ AI Receptionist</span>
        </button>
      </div>
    </aside>
  );
}
