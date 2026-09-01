import { useState, FormEvent } from 'react';
import { X, CheckCircle2, Sparkles, Building, Phone, Mail, User, MapPin } from 'lucide-react';

interface BookDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookDemoModal({ isOpen, onClose }: BookDemoModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    businessType: 'clinic',
    locality: 'South Delhi',
    phone: '',
    email: '',
    volume: '500-2000',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };


  const handleResetAndClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div
      id="book-demo-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleResetAndClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A1628]/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-[#CBD5E1] p-6 sm:p-8 relative overflow-hidden"
      >
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#64748B] hover:text-[#0A1628] hover:bg-[#F1F5F9] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#0066FF] uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Delhi NCR VIP Onboarding</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-editorial font-bold text-[#0A1628] mb-2 leading-tight">
              Book a Live <span className="text-[#0066FF] italic">AI Demo</span>
            </h3>

            <p className="text-xs sm:text-sm text-[#64748B] mb-6 font-sans-clean">
              See how DilliAI handles custom queries, booking rules, and multilingual conversations
              tailored to your exact business.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1.5">
                  Your Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Dr. A. Sharma / Priya Kapoor"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] focus:border-[#0066FF] focus:bg-white text-sm text-[#0A1628] focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1.5">
                    Business Name
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                    <input
                      type="text"
                      required
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      placeholder="e.g. Apex Dental Studio"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] focus:border-[#0066FF] focus:bg-white text-sm text-[#0A1628] focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1.5">
                    Business Sector
                  </label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] focus:border-[#0066FF] focus:bg-white text-sm text-[#0A1628] focus:outline-none transition-all"
                  >
                    <option value="clinic">Dental & Medical Clinic</option>
                    <option value="salon">Salon, Spa & Wellness</option>
                    <option value="restaurant">Restaurant, Cafe & Dining</option>
                    <option value="realestate">Real Estate & Advisory</option>
                    <option value="service">Local Services & Consultation</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1.5">
                    Phone / WhatsApp
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98110 XXXXX"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] focus:border-[#0066FF] focus:bg-white text-sm text-[#0A1628] focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1.5">
                    Delhi NCR Locality
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                    <select
                      value={formData.locality}
                      onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] focus:border-[#0066FF] focus:bg-white text-sm text-[#0A1628] focus:outline-none transition-all"
                    >
                      <option value="South Delhi">South Delhi (GK / Vasant Vihar)</option>
                      <option value="Central Delhi">Central Delhi (CP / Khan Market)</option>
                      <option value="Gurgaon">Gurgaon / DLF Cyber Hub</option>
                      <option value="Noida">Noida & Greater Noida</option>
                      <option value="West Delhi">West Delhi (Rajouri / Punjabi Bagh)</option>
                      <option value="North Delhi">North / East Delhi</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-blue-cta text-white font-semibold text-sm shadow-md shadow-[#0066FF]/25 hover:shadow-lg transition-all transform active:scale-98 cursor-pointer mt-2"
              >
                Schedule VIP Consultation →
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-6 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-[#F0FDF4] text-[#22C55E] flex items-center justify-center mx-auto mb-4 border border-[#BBF7D0]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-editorial font-bold text-[#0A1628] mb-2">
              Demo Request Confirmed!
            </h3>

            <p className="text-sm text-[#475569] max-w-sm mx-auto mb-6 leading-relaxed">
              Thank you, <strong>{formData.name}</strong>. Our Delhi onboarding specialist will connect
              with you on <strong>{formData.phone}</strong> with a personalized AI Receptionist sample
              trained for <strong>{formData.businessName || 'your business'}</strong>.
            </p>

            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#64748B] mb-6">
              ⚡ Deployment turnaround: <strong>Under 48 hours</strong> with full multilingual WhatsApp & Web integration.
            </div>

            <button
              onClick={handleResetAndClose}
              className="px-8 py-3 rounded-full bg-[#0066FF] text-white text-xs font-semibold hover:bg-[#0052CC] transition-colors"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
