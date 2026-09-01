import { useState } from 'react';
import { ChevronDown, HelpCircle, MessageSquare } from 'lucide-react';
import { FAQS } from '../data/mockData';

interface FaqSectionProps {
  onOpenBookDemo: () => void;
}

export default function FaqSection({ onOpenBookDemo }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 sm:py-28 bg-white border-t border-[#E2E8F0]/70">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E0F2FE] border border-[#BAE6FD] text-xs font-bold text-[#0284C7] uppercase tracking-wider mb-4">
            FREQUENTLY ASKED QUESTIONS
          </div>

          <h2
            id="faq-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-editorial tracking-tight text-[#0A1628] leading-[1.15] mb-4"
          >
            Everything you need <span className="italic text-[#0066FF]">to know.</span>
          </h2>

          <p className="text-base sm:text-lg text-[#475569] leading-relaxed font-sans-clean">
            Clear answers about multilingual AI capabilities, WhatsApp routing, and Delhi deployments.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                id={`faq-item-${idx}`}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-[#F8FAFC] border-[#BFDBFE] shadow-sm'
                    : 'bg-white border-[#E2E8F0] hover:border-[#CBD5E1]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-bold text-[#0A1628] font-sans-clean">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen
                        ? 'bg-[#0066FF] text-white rotate-180'
                        : 'bg-[#F1F5F9] text-[#64748B]'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-[#475569] leading-relaxed border-t border-[#F1F5F9] font-sans-clean">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Help Box */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-[#F0F7FF] border border-[#BAE6FD]/80 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="text-base font-bold text-[#0A1628] mb-1">
              Have a custom requirement for your business?
            </h4>
            <p className="text-xs sm:text-sm text-[#64748B]">
              Speak directly with our Delhi team about your clinic software, CRM, or phone setup.
            </p>
          </div>
          <button
            onClick={onOpenBookDemo}
            className="px-6 py-3 rounded-full bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs sm:text-sm font-semibold shrink-0 transition-colors shadow-xs"
          >
            Talk with Specialist
          </button>
        </div>
      </div>
    </section>
  );
}
