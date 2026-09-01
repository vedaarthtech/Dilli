import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Play, Bot, PhoneCall, MessageSquare } from 'lucide-react';
import { SupportedLanguage } from '../types';

interface HeroSectionProps {
  currentLanguage: SupportedLanguage;
  onOpenAiTester: () => void;
  onOpenVoiceCall: () => void;
  onOpenBookDemo: () => void;
}

export default function HeroSection({
  onOpenAiTester,
  onOpenVoiceCall,
  onOpenBookDemo,
}: HeroSectionProps) {
  const featurePills = [
    'Available 24/7',
    'English + Hindi',
    'Multilingual Support',
    'Appointment Booking',
    'WhatsApp Integration',
    'Instant Responses',
  ];

  return (
    <section id="hero" className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-radial-hero">
      {/* Soft Ambient Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[700px] md:w-[900px] h-[350px] bg-gradient-to-b from-[#BAE6FD]/40 via-[#E0F2FE]/25 to-transparent rounded-[100%] blur-3xl" />
        <div className="absolute top-24 left-1/4 w-72 h-72 bg-[#0066FF]/10 rounded-full blur-3xl" />
        <div className="absolute top-28 right-1/4 w-80 h-80 bg-[#38BDF8]/15 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Status / Trust Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/90 border border-[#CBD5E1]/80 shadow-xs backdrop-blur-xs mb-8 transition-all hover:border-[#94A3B8]">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#22C55E]"></span>
          </span>
          <span className="text-xs font-semibold text-[#1E293B] tracking-wide">
            Live · Trusted by Delhi businesses
          </span>
          <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-[#CBD5E1]" />
          <span className="hidden sm:inline-block text-[11px] font-medium text-[#64748B]">
            NCR Front Desk AI
          </span>
        </div>

        {/* Large Editorial Headline */}
        <h1
          id="hero-main-heading"
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-editorial tracking-tight text-[#0A1628] leading-[1.1] sm:leading-[1.12] mb-6 max-w-4xl mx-auto"
        >
          Your 24/7{' '}
          <span className="relative inline-block text-[#0066FF] font-editorial italic underline decoration-[#0066FF]/30 underline-offset-8">
            AI Receptionist
          </span>
        </h1>

        {/* Supporting Copy */}
        <p
          id="hero-supporting-copy"
          className="text-base sm:text-lg md:text-xl text-[#475569] leading-relaxed max-w-3xl mx-auto mb-10 font-normal font-sans-clean"
        >
          Answers customer questions, handles enquiries, books appointments, shares business information,
          and supports your customers in English, Hindi and Delhi's most-used languages — day and night.
        </p>

        {/* CTA Button Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md sm:max-w-none mx-auto mb-12">
          {/* Primary CTA */}
          <button
            id="hero-primary-cta-btn"
            onClick={onOpenAiTester}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-blue-cta text-white text-base font-semibold flex items-center justify-center gap-2.5 glow-blue hover:scale-[1.02] transition-all transform active:scale-98 cursor-pointer shadow-lg shadow-[#0066FF]/25"
          >
            <span>Try Live AI Receptionist</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          {/* Secondary CTA */}
          <button
            id="hero-secondary-cta-btn"
            onClick={onOpenBookDemo}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white hover:bg-[#F8FAFC] text-[#0A1628] border border-[#CBD5E1] text-base font-semibold transition-all hover:border-[#94A3B8] shadow-xs cursor-pointer"
          >
            Book a Demo
          </button>

          {/* Live Voice Call Button */}
          <button
            id="hero-voice-call-cta-btn"
            onClick={onOpenVoiceCall}
            className="w-full sm:w-auto px-6 py-4 rounded-full bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#0066FF] text-base font-semibold flex items-center justify-center gap-2 border border-[#BFDBFE] transition-all hover:scale-[1.02] cursor-pointer"
          >
            <PhoneCall className="w-4 h-4 text-[#0066FF] animate-pulse" />
            <span>Voice Call AI 📞</span>
          </button>
        </div>

        {/* Feature Pills Grid */}
        <div
          id="hero-feature-pills"
          className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 max-w-3xl mx-auto"
        >
          {featurePills.map((pill, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 border border-[#E2E8F0] shadow-2xs text-xs font-semibold text-[#334155]"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#0066FF] shrink-0" />
              <span>{pill}</span>
            </div>
          ))}
        </div>

        {/* Delhi NCR Sub-Banner Badge */}
        <div className="mt-12 inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-gradient-to-r from-[#EFF6FF] via-[#F0FDF4] to-[#EFF6FF] border border-[#BFDBFE]/60 text-xs text-[#1E3A8A] font-medium">
          <span className="flex items-center gap-1.5 font-semibold text-[#0066FF]">
            <span className="w-2 h-2 rounded-full bg-[#0066FF]" />
            Delhi NCR Specialized:
          </span>
          <span>Clinics · Salons · Spas · Restaurants · Real Estate · Local Services</span>
        </div>
      </div>
    </section>
  );
}
