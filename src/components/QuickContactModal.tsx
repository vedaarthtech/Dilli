import { useState, FormEvent } from 'react';
import { X, MessageCircle, Phone, Sparkles, Send, CheckCircle2, PhoneCall } from 'lucide-react';

interface QuickContactModalProps {
  type: 'whatsapp' | 'phone' | null;
  onClose: () => void;
  onOpenAiTester: () => void;
  onOpenVoiceCall: () => void;
}

export default function QuickContactModal({
  type,
  onClose,
  onOpenAiTester,
  onOpenVoiceCall,
}: QuickContactModalProps) {
  const [phoneSubmitted, setPhoneSubmitted] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  if (!type) return null;

  const handlePhoneSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;
    setPhoneSubmitted(true);
  };


  const handleWhatsAppRedirect = () => {
    const text = encodeURIComponent(
      'Hi DilliAI Team, I would like to deploy the 24/7 Multilingual AI Receptionist for my business in Delhi NCR.'
    );
    window.open(`https://wa.me/919811000000?text=${text}`, '_blank');
    onClose();
  };

  return (
    <div
      id="quick-contact-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A1628]/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-[#CBD5E1] p-6 sm:p-7 relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#64748B] hover:text-[#0A1628] hover:bg-[#F1F5F9] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {type === 'whatsapp' ? (
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#F0FDF4] text-[#22C55E] flex items-center justify-center mb-4 border border-[#DCFCE7]">
              <MessageCircle className="w-7 h-7 fill-[#22C55E]" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DCFCE7] text-[11px] font-bold text-[#16A34A] uppercase tracking-wider mb-2">
              WhatsApp Integration
            </div>

            <h3 className="text-2xl font-editorial font-bold text-[#0A1628] mb-2">
              Chat on <span className="text-[#22C55E] italic">WhatsApp</span>
            </h3>

            <p className="text-xs sm:text-sm text-[#64748B] mb-6 font-sans-clean leading-relaxed">
              Experience how our AI Receptionist automatically greets customers on WhatsApp,
              answers questions in Hinglish/Hindi, and books appointments seamlessly.
            </p>

            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2 mb-6 text-xs text-[#334155]">
              <div className="font-semibold text-[#0A1628]">What you can test on WhatsApp:</div>
              <ul className="list-disc pl-4 space-y-1 text-[#64748B]">
                <li>Natural Delhi Hinglish & Hindi responses</li>
                <li>Instant appointment & slot booking confirmation</li>
                <li>Automatic service pricing & location sharing</li>
              </ul>
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={handleWhatsAppRedirect}
                className="w-full py-3.5 rounded-full bg-[#22C55E] hover:bg-[#16A34A] text-white font-semibold text-sm shadow-md shadow-[#22C55E]/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Launch WhatsApp Live Demo →</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenVoiceCall();
                }}
                className="w-full py-3 rounded-full bg-[#0A1628] hover:bg-[#1E293B] text-white text-xs font-semibold flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Try In-Browser Voice Call Instead</span>
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] text-[#0066FF] flex items-center justify-center mb-4 border border-[#DBEAFE]">
              <Phone className="w-6 h-6" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF6FF] text-[11px] font-bold text-[#0066FF] uppercase tracking-wider mb-2">
              Delhi Call Desk
            </div>

            <h3 className="text-2xl font-editorial font-bold text-[#0A1628] mb-2">
              24/7 AI <span className="text-[#0066FF] italic">Call Receptionist</span>
            </h3>

            <p className="text-xs sm:text-sm text-[#64748B] mb-5 font-sans-clean leading-relaxed">
              Experience two-way conversational voice calls with natural Delhi accents, Hindi & Hinglish recognition.
            </p>

            {/* In-Browser Direct Voice Call CTA */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE]/40 border border-[#BFDBFE] mb-5 text-center">
              <div className="text-xs font-bold text-[#0066FF] mb-1 flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping" />
                <span>Live Interactive Voice Call Active</span>
              </div>
              <p className="text-[11px] text-[#475569] mb-3">
                Talk directly to the AI receptionist in your browser right now using your microphone.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenVoiceCall();
                }}
                className="w-full py-3 rounded-full bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#0066FF]/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 animate-pulse" />
                <span>Start In-Browser Voice Call Now 📞</span>
              </button>
            </div>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-[#E2E8F0]"></div>
              <span className="flex-shrink mx-3 text-[11px] font-semibold text-[#94A3B8] uppercase">or request outbound call</span>
              <div className="flex-grow border-t border-[#E2E8F0]"></div>
            </div>

            {!phoneSubmitted ? (
              <form onSubmit={handlePhoneSubmit} className="space-y-3 mt-2">
                <div>
                  <label className="block text-[11px] font-bold text-[#334155] uppercase tracking-wider mb-1">
                    Your mobile number for automated phone dialer
                  </label>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+91 98110 XXXXX"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] focus:border-[#0066FF] focus:bg-white text-xs sm:text-sm text-[#0A1628] focus:outline-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-full bg-[#0A1628] hover:bg-[#1E293B] text-white font-semibold text-xs transition-all cursor-pointer"
                >
                  Request Automated Phone Call →
                </button>
              </form>
            ) : (
              <div className="text-center py-3 animate-in zoom-in-95 duration-150">
                <div className="w-10 h-10 rounded-full bg-[#F0FDF4] text-[#22C55E] flex items-center justify-center mx-auto mb-2 border border-[#BBF7D0]">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-[#0A1628] mb-1">
                  Call Request Registered!
                </h4>
                <p className="text-xs text-[#64748B] mb-3">
                  Our Delhi AI Voice desk will dial <strong>{phoneNumber}</strong> shortly.
                </p>
                <button
                  onClick={onClose}
                  className="px-5 py-1.5 rounded-full bg-[#F1F5F9] text-xs font-semibold text-[#0A1628]"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
