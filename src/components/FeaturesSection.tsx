import {
  Clock,
  Languages,
  CalendarCheck,
  MessageSquare,
  HelpCircle,
  UserCheck,
  PhoneCall,
  Zap,
} from 'lucide-react';
import { FEATURES } from '../data/mockData';

const iconMap = {
  Clock,
  Languages,
  CalendarCheck,
  MessageSquare,
  HelpCircle,
  UserCheck,
  PhoneCall,
  Zap,
};

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 sm:py-28 bg-[#F8FBFF] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E0F2FE] border border-[#BAE6FD] text-xs font-bold text-[#0284C7] uppercase tracking-wider mb-4">
            FEATURES
          </div>

          <h2
            id="features-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-editorial tracking-tight text-[#0A1628] leading-[1.15] mb-5"
          >
            Everything your front desk does — <span className="italic text-[#0066FF]">automated.</span>
          </h2>

          <p className="text-base sm:text-lg text-[#475569] leading-relaxed font-sans-clean">
            A complete AI receptionist that handles routine customer conversations, enquiries and bookings
            without making your customers wait.
          </p>
        </div>

        {/* 8 Clean Rounded Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature) => {
            const IconComponent = iconMap[feature.iconName as keyof typeof iconMap] || Zap;

            return (
              <div
                key={feature.id}
                id={`feature-card-${feature.id}`}
                className="group relative p-6 sm:p-7 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs hover:shadow-md hover:border-[#BFDBFE] transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-[#F0F7FF] group-hover:bg-[#0066FF] text-[#0066FF] group-hover:text-white flex items-center justify-center transition-colors duration-200 shadow-2xs">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    {feature.badge && (
                      <span className="text-[10px] font-bold text-[#0066FF] bg-[#EFF6FF] px-2.5 py-0.5 rounded-full border border-[#DBEAFE]">
                        {feature.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-[#0A1628] mb-2 group-hover:text-[#0066FF] transition-colors font-sans-clean">
                    {feature.title}
                  </h3>

                  <p className="text-sm text-[#64748B] leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#F1F5F9] flex items-center justify-between text-xs font-semibold text-[#0066FF] opacity-80 group-hover:opacity-100">
                  <span>Delhi NCR Optimized</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF]" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
