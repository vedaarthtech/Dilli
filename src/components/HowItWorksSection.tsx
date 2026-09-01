import { HOW_IT_WORKS } from '../data/mockData';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface HowItWorksSectionProps {
  onOpenBookDemo: () => void;
}

export default function HowItWorksSection({ onOpenBookDemo }: HowItWorksSectionProps) {
  return (
    <section id="how-it-works" className="py-20 sm:py-28 bg-[#F8FBFF] border-t border-[#E2E8F0]/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E0F2FE] border border-[#BAE6FD] text-xs font-bold text-[#0284C7] uppercase tracking-wider mb-4">
            HOW IT WORKS
          </div>

          <h2
            id="how-it-works-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-editorial tracking-tight text-[#0A1628] leading-[1.15] mb-4"
          >
            Live in less than <span className="italic text-[#0066FF]">48 hours.</span>
          </h2>

          <p className="text-base sm:text-lg text-[#475569] leading-relaxed font-sans-clean">
            Simple 3-step setup with zero complicated engineering required from your team.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {HOW_IT_WORKS.map((item, idx) => (
            <div
              key={idx}
              id={`how-it-works-step-${idx + 1}`}
              className="relative p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-xs hover:shadow-md hover:border-[#BFDBFE] transition-all flex flex-col justify-between"
            >
              <div>
                {/* Step Number in Serif Display */}
                <div className="text-5xl sm:text-6xl font-editorial font-bold text-[#0066FF]/25 mb-6 group-hover:text-[#0066FF] transition-colors">
                  {item.step}
                </div>

                <h3 className="text-xl font-bold text-[#0A1628] mb-3 font-sans-clean">
                  {item.title}
                </h3>

                <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-[#F1F5F9] flex items-center gap-2 text-xs font-semibold text-[#0066FF]">
                <CheckCircle2 className="w-4 h-4 text-[#0066FF]" />
                <span>Delhi NCR Onboarding Support Included</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Micro CTA */}
        <div className="mt-14 text-center">
          <button
            onClick={onOpenBookDemo}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0066FF] hover:text-[#0052CC] hover:underline"
          >
            <span>Have specific setup questions? Schedule a consultation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
