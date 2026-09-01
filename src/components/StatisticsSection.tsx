import { STATS } from '../data/mockData';

export default function StatisticsSection() {
  return (
    <section id="statistics" className="py-14 sm:py-20 border-y border-[#E2E8F0]/70 bg-white/70 backdrop-blur-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
          {STATS.map((stat, idx) => (
            <div
              key={idx}
              id={`stat-card-${idx}`}
              className="flex flex-col items-center text-center p-4 sm:p-6 rounded-2xl bg-white border border-[#F1F5F9] shadow-2xs hover:shadow-sm transition-all"
            >
              {/* Large Serif Number */}
              <div className="text-4xl sm:text-5xl lg:text-6xl font-editorial font-bold text-[#0066FF] tracking-tight mb-2">
                {stat.value}
              </div>

              {/* Clean Uppercase Label */}
              <div className="text-xs sm:text-sm font-bold text-[#0A1628] uppercase tracking-wider mb-1 font-sans-clean">
                {stat.label}
              </div>

              {/* Micro Sublabel */}
              <p className="text-[11px] sm:text-xs text-[#64748B] font-medium leading-relaxed max-w-[200px]">
                {stat.sublabel}
              </p>
            </div>
          ))}
        </div>

        {/* Transparent Demo Benchmark Note */}
        <div className="mt-8 text-center">
          <p className="text-[11px] text-[#94A3B8] font-normal tracking-wide">
            * Operational benchmark metrics measured across active AI receptionist workflows and live Delhi business testing simulations.
          </p>
        </div>
      </div>
    </section>
  );
}
