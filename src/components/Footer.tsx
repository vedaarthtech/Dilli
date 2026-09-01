import { Sparkles, MapPin, Phone, Mail, Globe } from 'lucide-react';
import { LANGUAGES } from '../data/mockData';
import { SupportedLanguage } from '../types';

interface FooterProps {
  currentLanguage: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  onOpenBookDemo: () => void;
}

export default function Footer({ currentLanguage, onSelectLanguage, onOpenBookDemo }: FooterProps) {
  return (
    <footer className="bg-white border-t border-[#E2E8F0] pt-16 pb-12 text-[#475569] text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-[#F1F5F9]">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#0066FF] to-[#38BDF8] flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold tracking-tight text-[#0A1628]">
                Dilli<span className="text-[#0066FF]">AI</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed max-w-sm font-sans-clean">
              24/7 Multilingual AI Front Desk & Receptionist engineered for clinics, salons, restaurants,
              and fast-growing businesses across Delhi NCR.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#1E293B] pt-1">
              <MapPin className="w-3.5 h-3.5 text-[#0066FF]" />
              <span>Headquartered in New Delhi, India</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-[#0A1628] uppercase tracking-wider mb-4 font-sans-clean">
              Product
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#64748B]">
              <li>
                <a href="#features" className="hover:text-[#0066FF] transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#live-demo" className="hover:text-[#0066FF] transition-colors">
                  Live Demo
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-[#0066FF] transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-[#0066FF] transition-colors">
                  Pricing Plans
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#0066FF] transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Business Sectors */}
          <div>
            <h4 className="text-xs font-bold text-[#0A1628] uppercase tracking-wider mb-4 font-sans-clean">
              Delhi Sectors
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#64748B]">
              <li>
                <span className="hover:text-[#0A1628]">Dental & Specialty Clinics</span>
              </li>
              <li>
                <span className="hover:text-[#0A1628]">Luxury Salons & Spas</span>
              </li>
              <li>
                <span className="hover:text-[#0A1628]">Fine Dining & Cafes</span>
              </li>
              <li>
                <span className="hover:text-[#0A1628]">Real Estate & Developers</span>
              </li>
              <li>
                <span className="hover:text-[#0A1628]">Boutique Hotels & Stays</span>
              </li>
            </ul>
          </div>

          {/* Multilingual Support list */}
          <div>
            <h4 className="text-xs font-bold text-[#0A1628] uppercase tracking-wider mb-4 font-sans-clean">
              Languages
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => onSelectLanguage(lang.code)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                    currentLanguage === lang.code
                      ? 'bg-[#0066FF] text-white border-[#0066FF]'
                      : 'bg-[#F8FAFC] text-[#334155] border-[#E2E8F0] hover:bg-[#F1F5F9]'
                  }`}
                >
                  {lang.nativeLabel}
                </button>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-[#F1F5F9]">
              <button
                onClick={onOpenBookDemo}
                className="text-xs font-bold text-[#0066FF] hover:underline"
              >
                Request Custom Dialect →
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Sub-footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#94A3B8]">
          <div>
            © {new Date().getFullYear()} DilliAI Receptionist Systems. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-[#475569] cursor-pointer">Privacy Policy</span>
            <span className="hover:text-[#475569] cursor-pointer">Terms of Service</span>
            <span className="hover:text-[#475569] cursor-pointer">Security & Encryption</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
