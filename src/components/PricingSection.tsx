import { Check, Sparkles, ArrowRight } from 'lucide-react';
import { PRICING_PLANS } from '../data/mockData';

interface PricingSectionProps {
  onOpenBookDemo: () => void;
}

export default function PricingSection({ onOpenBookDemo }: PricingSectionProps) {
  return (
    <section id="pricing" className="py-20 sm:py-28 bg-[#F8FBFF] border-t border-[#E2E8F0]/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E0F2FE] border border-[#BAE6FD] text-xs font-bold text-[#0284C7] uppercase tracking-wider mb-4">
            PRICING
          </div>

          <h2
            id="pricing-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-editorial tracking-tight text-[#0A1628] leading-[1.15] mb-4"
          >
            Predictable plans for <span className="italic text-[#0066FF]">Delhi businesses.</span>
          </h2>

          <p className="text-base sm:text-lg text-[#475569] leading-relaxed font-sans-clean">
            Never miss high-value customer appointments or lose walk-ins due to delayed replies.
          </p>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {PRICING_PLANS.map((plan, idx) => (
            <div
              key={idx}
              id={`pricing-card-${idx}`}
              className={`relative p-8 rounded-3xl bg-white flex flex-col justify-between transition-all duration-200 ${
                plan.popular
                  ? 'border-2 border-[#0066FF] shadow-xl ring-4 ring-[#0066FF]/10 lg:-translate-y-2'
                  : 'border border-[#E2E8F0] shadow-xs hover:shadow-md'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#0066FF] text-white text-[10px] font-extrabold uppercase tracking-widest px-3.5 py-1 rounded-full shadow-sm">
                  {plan.badge}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-[#0A1628] font-sans-clean">{plan.name}</h3>
                  {plan.popular && <Sparkles className="w-5 h-5 text-[#0066FF]" />}
                </div>

                <p className="text-xs sm:text-sm text-[#64748B] mb-6 leading-relaxed">
                  {plan.description}
                </p>

                <div className="flex items-baseline gap-1.5 mb-8 pb-6 border-b border-[#F1F5F9]">
                  <span className="text-4xl sm:text-5xl font-editorial font-bold text-[#0A1628]">
                    {plan.price}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-[#64748B]">
                    {plan.period}
                  </span>
                </div>

                {/* Features List */}
                <div className="space-y-3.5 mb-8">
                  <div className="text-xs font-bold text-[#0A1628] uppercase tracking-wider">
                    Included Capabilities:
                  </div>
                  {plan.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#334155]">
                      <div className="w-4 h-4 rounded-full bg-[#EFF6FF] text-[#0066FF] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <button
                  onClick={onOpenBookDemo}
                  className={`w-full py-4 rounded-full text-sm font-semibold flex items-center justify-center gap-2 transition-all transform active:scale-98 cursor-pointer ${
                    plan.popular
                      ? 'bg-blue-cta text-white shadow-md shadow-[#0066FF]/25 hover:shadow-lg'
                      : 'bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0A1628]'
                  }`}
                >
                  <span>{plan.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Guarantee Banner */}
        <div className="mt-12 text-center text-xs text-[#64748B] max-w-lg mx-auto">
          Need a custom setup for multi-location clinics or restaurant franchises?{' '}
          <button
            onClick={onOpenBookDemo}
            className="text-[#0066FF] font-semibold hover:underline"
          >
            Contact our Delhi Enterprise Desk
          </button>
        </div>
      </div>
    </section>
  );
}
