import { ArrowRight, Sparkles, Phone, PhoneCall } from 'lucide-react';

interface FinalCtaSectionProps {
  onOpenAiTester: () => void;
  onOpenVoiceCall: () => void;
  onOpenBookDemo: () => void;
}

export default function FinalCtaSection({
  onOpenAiTester,
  onOpenVoiceCall,
  onOpenBookDemo,
}: FinalCtaSectionProps) {
  return (
    <section className="py-20 sm:py-28 bg-gradient-to-b from-[#FFFFFF] to-[#EFF6FF] relative overflow-hidden border-t border-[#E2E8F0]/70">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] bg-gradient-to-r from-[#BAE6FD]/30 via-[#BFDBFE]/40 to-[#BAE6FD]/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#CBD5E1] shadow-2xs text-xs font-semibold text-[#0066FF] mb-8">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Start in Delhi NCR Today</span>
        </div>

        {/* Large Editorial Headline */}
        <h2
          id="final-cta-heading"
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-editorial tracking-tight text-[#0A1628] leading-[1.15] mb-6 max-w-3xl mx-auto"
        >
          Your customers are asking questions.{' '}
          <span className="text-[#0066FF] italic">Make sure someone answers.</span>
        </h2>

        {/* Supporting Copy */}
        <p className="text-base sm:text-lg md:text-xl text-[#475569] leading-relaxed max-w-2xl mx-auto mb-10 font-sans-clean">
          Give your business a 24/7 multilingual AI receptionist built for the way Delhi customers actually
          communicate — via real-time phone calls, WhatsApp, and web chat.
        </p>

        {/* CTA Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md sm:max-w-none mx-auto mb-12">
          <button
            id="final-cta-primary-btn"
            onClick={onOpenAiTester}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-blue-cta text-white text-base font-semibold flex items-center justify-center gap-2.5 glow-blue hover:scale-[1.02] transition-all transform active:scale-98 cursor-pointer shadow-lg shadow-[#0066FF]/25"
          >
            <span>Try Live AI Receptionist</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            id="final-cta-secondary-btn"
            onClick={onOpenBookDemo}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white hover:bg-[#F8FAFC] text-[#0A1628] border border-[#CBD5E1] text-base font-semibold transition-all shadow-xs cursor-pointer"
          >
            Book a Demo
          </button>

          <button
            id="final-cta-voice-btn"
            onClick={onOpenVoiceCall}
            className="w-full sm:w-auto px-6 py-4 rounded-full bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#0066FF] text-base font-semibold flex items-center justify-center gap-2 border border-[#BFDBFE] transition-all hover:scale-[1.02] cursor-pointer"
          >
            <PhoneCall className="w-4 h-4 text-[#0066FF] animate-pulse" />
            <span>Live Voice Call 📞</span>
          </button>
        </div>

        {/* Delhi NCR Coverage Badges */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-[#64748B] pt-4 border-t border-[#E2E8F0]/80">
          <span className="text-[#0A1628]">Supported Across:</span>
          <span className="bg-white px-2.5 py-1 rounded-full border border-[#E2E8F0]">South Delhi</span>
          <span className="bg-white px-2.5 py-1 rounded-full border border-[#E2E8F0]">Connaught Place</span>
          <span className="bg-white px-2.5 py-1 rounded-full border border-[#E2E8F0]">Gurgaon / Gurugram</span>
          <span className="bg-white px-2.5 py-1 rounded-full border border-[#E2E8F0]">Noida & Greater Noida</span>
          <span className="bg-white px-2.5 py-1 rounded-full border border-[#E2E8F0]">West & North Delhi</span>
        </div>
      </div>
    </section>
  );
}
