import { TESTIMONIALS } from '../data/mockData';
import { Star, Quote, MapPin } from 'lucide-react';

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 sm:py-28 bg-white border-t border-[#E2E8F0]/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E0F2FE] border border-[#BAE6FD] text-xs font-bold text-[#0284C7] uppercase tracking-wider mb-4">
            CUSTOMER STORIES
          </div>

          <h2
            id="testimonials-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-editorial tracking-tight text-[#0A1628] leading-[1.15] mb-4"
          >
            Trusted across <span className="italic text-[#0066FF]">Delhi NCR.</span>
          </h2>

          <p className="text-base sm:text-lg text-[#475569] leading-relaxed font-sans-clean">
            How clinics, salons, restaurants and businesses capture enquiries round the clock.
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              id={`testimonial-card-${idx}`}
              className="p-8 rounded-3xl bg-[#F8FAFC] border border-[#E2E8F0] shadow-2xs hover:shadow-md hover:border-[#BFDBFE] transition-all flex flex-col justify-between"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-base sm:text-lg text-[#1E293B] leading-relaxed mb-6 font-sans-clean">
                  "{t.quote}"
                </blockquote>
              </div>

              {/* Author & Business Info */}
              <div className="pt-5 border-t border-[#E2E8F0]/80 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-[#0A1628]">{t.author}</div>
                  <div className="text-xs text-[#64748B] font-medium">
                    {t.role} · <span className="text-[#0066FF]">{t.business}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-semibold text-[#64748B] bg-white px-2.5 py-1 rounded-full border border-[#E2E8F0]">
                  <MapPin className="w-3 h-3 text-[#0066FF]" />
                  <span>{t.locality}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Benchmark Note */}
        <div className="mt-8 text-center text-[11px] text-[#94A3B8]">
          * Representative customer experience testimonials from Delhi pilot deployments.
        </div>
      </div>
    </section>
  );
}
