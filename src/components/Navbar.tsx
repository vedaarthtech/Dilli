import { useState } from 'react';
import { Menu, X, Sparkles, Globe, ChevronDown, PhoneCall } from 'lucide-react';
import { LANGUAGES } from '../data/mockData';
import { SupportedLanguage } from '../types';

interface NavbarProps {
  currentLanguage: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  onOpenAiTester: () => void;
  onOpenVoiceCall: () => void;
  onOpenBookDemo: () => void;
}

export default function Navbar({
  currentLanguage,
  onSelectLanguage,
  onOpenAiTester,
  onOpenVoiceCall,
  onOpenBookDemo,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const selectedLangObj = LANGUAGES.find((l) => l.code === currentLanguage) || LANGUAGES[0];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 backdrop-blur-md border-b border-[#E2E8F0]/70 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          id="nav-brand-logo"
          href="#"
          className="flex items-center gap-2.5 group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0066FF] to-[#38BDF8] flex items-center justify-center text-white shadow-md shadow-[#0066FF]/20 group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-[#0A1628] flex items-center gap-1.5">
              Dilli<span className="text-[#0066FF]">AI</span>
            </span>
            <span className="text-[10px] tracking-wider font-semibold text-[#64748B] uppercase">
              Receptionist · Delhi NCR
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#475569]">
          <a
            id="nav-link-home"
            href="#hero"
            className="hover:text-[#0066FF] transition-colors py-1"
          >
            Home
          </a>
          <a
            id="nav-link-features"
            href="#features"
            className="hover:text-[#0066FF] transition-colors py-1"
          >
            Features
          </a>
          <a
            id="nav-link-how-it-works"
            href="#how-it-works"
            className="hover:text-[#0066FF] transition-colors py-1"
          >
            How It Works
          </a>
          <a
            id="nav-link-live-demo"
            href="#live-demo"
            className="hover:text-[#0066FF] transition-colors py-1"
          >
            Live Demo
          </a>
          <a
            id="nav-link-pricing"
            href="#pricing"
            className="hover:text-[#0066FF] transition-colors py-1"
          >
            Pricing
          </a>
          <a
            id="nav-link-faq"
            href="#faq"
            className="hover:text-[#0066FF] transition-colors py-1"
          >
            FAQ
          </a>
        </nav>

        {/* Action Controls & Language Switcher */}
        <div className="hidden md:flex items-center gap-3.5">
          {/* Language Switcher */}
          <div className="relative">
            <button
              id="navbar-language-btn"
              type="button"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-full border border-[#E2E8F0] hover:border-[#CBD5E1] bg-white text-xs font-semibold text-[#334155] shadow-xs transition-all hover:bg-[#F8FAFC]"
              aria-label="Select Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#0066FF]" />
              <span>{selectedLangObj.nativeLabel}</span>
              <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
            </button>

            {langDropdownOpen && (
              <div
                id="navbar-language-dropdown"
                className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-[#E2E8F0] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <div className="px-3 py-1 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
                  Supported Languages
                </div>
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    id={`lang-select-${lang.code}`}
                    onClick={() => {
                      onSelectLanguage(lang.code);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors ${
                      currentLanguage === lang.code
                        ? 'bg-[#F0F7FF] text-[#0066FF] font-semibold'
                        : 'text-[#334155] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <span className="font-medium">{lang.nativeLabel}</span>
                    <span className="text-[10px] text-[#94A3B8] font-mono uppercase bg-[#F1F5F9] px-1.5 py-0.5 rounded">
                      {lang.badge}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Voice Call AI Button */}
          <button
            id="nav-voice-call-btn"
            onClick={onOpenVoiceCall}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#0066FF] border border-[#BFDBFE] text-xs font-bold transition-all hover:scale-102 active:scale-98 cursor-pointer"
            title="Start Live In-Browser Voice Call"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#0066FF] animate-pulse" />
            <span>Voice Call AI</span>
          </button>

          {/* Book a Demo Button */}
          <button
            id="nav-book-demo-btn"
            onClick={onOpenBookDemo}
            className="px-4 py-2.5 rounded-full text-xs font-semibold text-[#0A1628] hover:text-[#0066FF] bg-[#F1F5F9] hover:bg-[#E2E8F0] transition-colors"
          >
            Book a Demo
          </button>

          {/* Primary CTA */}
          <button
            id="nav-try-ai-cta-btn"
            onClick={onOpenAiTester}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-cta text-white text-xs font-semibold shadow-md shadow-[#0066FF]/25 hover:shadow-lg hover:shadow-[#0066FF]/35 transition-all transform active:scale-98"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Try AI Receptionist</span>
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl border border-[#E2E8F0] text-[#334155] hover:bg-[#F8FAFC] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="md:hidden bg-white border-b border-[#E2E8F0] px-4 pt-3 pb-6 shadow-xl space-y-4 animate-in slide-in-from-top duration-200"
        >
          <nav className="flex flex-col space-y-3 text-sm font-medium text-[#334155]">
            <a
              href="#hero"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-[#F0F7FF] hover:text-[#0066FF]"
            >
              Home
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-[#F0F7FF] hover:text-[#0066FF]"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-[#F0F7FF] hover:text-[#0066FF]"
            >
              How It Works
            </a>
            <a
              href="#live-demo"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-[#F0F7FF] hover:text-[#0066FF]"
            >
              Live Demo
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-[#F0F7FF] hover:text-[#0066FF]"
            >
              Pricing
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-[#F0F7FF] hover:text-[#0066FF]"
            >
              FAQ
            </a>
          </nav>

          {/* Mobile Language Switcher */}
          <div className="pt-2 border-t border-[#E2E8F0]">
            <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-2 px-1">
              Select Language / भाषा चुनें
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    onSelectLanguage(lang.code);
                    setMobileMenuOpen(false);
                  }}
                  className={`py-2 px-2.5 rounded-xl text-xs font-semibold text-center border transition-all ${
                    currentLanguage === lang.code
                      ? 'bg-[#0066FF] text-white border-[#0066FF]'
                      : 'bg-[#F8FAFC] text-[#334155] border-[#E2E8F0]'
                  }`}
                >
                  {lang.nativeLabel}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenVoiceCall();
              }}
              className="w-full py-3 rounded-full bg-[#0066FF] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-md shadow-[#0066FF]/20 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 animate-pulse" />
              <span>Start Live Voice Call 📞</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAiTester();
              }}
              className="w-full py-3 rounded-full bg-[#EFF6FF] text-[#0066FF] text-sm font-semibold flex items-center justify-center gap-2 border border-[#BFDBFE]"
            >
              <Sparkles className="w-4 h-4" />
              Try AI Receptionist Chat
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBookDemo();
              }}
              className="w-full py-3 rounded-full bg-[#F1F5F9] text-[#0A1628] text-sm font-semibold hover:bg-[#E2E8F0]"
            >
              Book a Demo
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
