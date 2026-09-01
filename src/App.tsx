import { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import StatisticsSection from './components/StatisticsSection';
import FeaturesSection from './components/FeaturesSection';
import LiveDemoSection from './components/LiveDemoSection';
import HowItWorksSection from './components/HowItWorksSection';
import TestimonialsSection from './components/TestimonialsSection';
import PricingSection from './components/PricingSection';
import FaqSection from './components/FaqSection';
import FinalCtaSection from './components/FinalCtaSection';
import Footer from './components/Footer';
import FloatingActions from './components/FloatingActions';
import AiReceptionistModal from './components/AiReceptionistModal';
import LiveVoiceCallModal from './components/LiveVoiceCallModal';
import BookDemoModal from './components/BookDemoModal';
import QuickContactModal from './components/QuickContactModal';
import { SupportedLanguage, BusinessCategory } from './types';

export default function App() {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('en');
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [voiceCallOpen, setVoiceCallOpen] = useState(false);
  const [voiceCallBusiness, setVoiceCallBusiness] = useState<BusinessCategory>('clinic');
  const [bookDemoOpen, setBookDemoOpen] = useState(false);
  const [quickContactType, setQuickContactType] = useState<'whatsapp' | 'phone' | null>(null);

  const handleSelectLanguage = (lang: SupportedLanguage) => {
    setCurrentLanguage(lang);
  };

  const handleOpenAiTester = () => {
    setAiModalOpen(true);
  };

  const handleOpenVoiceCall = (business?: BusinessCategory, lang?: SupportedLanguage) => {
    if (business) setVoiceCallBusiness(business);
    if (lang) setCurrentLanguage(lang);
    setVoiceCallOpen(true);
  };

  const handleOpenBookDemo = () => {
    setBookDemoOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0A1628] font-sans antialiased selection:bg-[#0066FF]/15 selection:text-[#0066FF] relative">
      {/* Top Navbar */}
      <Navbar
        currentLanguage={currentLanguage}
        onSelectLanguage={handleSelectLanguage}
        onOpenAiTester={handleOpenAiTester}
        onOpenVoiceCall={() => handleOpenVoiceCall()}
        onOpenBookDemo={handleOpenBookDemo}
      />

      {/* Main Landing Page Flow */}
      <main className="flex-1">
        <HeroSection
          currentLanguage={currentLanguage}
          onOpenAiTester={handleOpenAiTester}
          onOpenVoiceCall={() => handleOpenVoiceCall()}
          onOpenBookDemo={handleOpenBookDemo}
        />

        <StatisticsSection />

        <FeaturesSection />

        <LiveDemoSection
          currentLanguage={currentLanguage}
          onSelectLanguage={handleSelectLanguage}
          onOpenAiTester={handleOpenAiTester}
          onOpenVoiceCall={() => handleOpenVoiceCall()}
        />

        <HowItWorksSection onOpenBookDemo={handleOpenBookDemo} />

        <TestimonialsSection />

        <PricingSection onOpenBookDemo={handleOpenBookDemo} />

        <FaqSection onOpenBookDemo={handleOpenBookDemo} />

        <FinalCtaSection
          onOpenAiTester={handleOpenAiTester}
          onOpenVoiceCall={() => handleOpenVoiceCall()}
          onOpenBookDemo={handleOpenBookDemo}
        />
      </main>

      {/* Footer */}
      <Footer
        currentLanguage={currentLanguage}
        onSelectLanguage={handleSelectLanguage}
        onOpenBookDemo={handleOpenBookDemo}
      />

      {/* Floating Action Controls on the Right */}
      <FloatingActions
        onOpenAiTester={handleOpenAiTester}
        onOpenVoiceCall={() => handleOpenVoiceCall()}
        onOpenWhatsAppModal={() => setQuickContactType('whatsapp')}
      />

      {/* Interactive AI Receptionist Live Testing Modal */}
      <AiReceptionistModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        initialLanguage={currentLanguage}
        onOpenVoiceCall={(b, l) => handleOpenVoiceCall(b, l)}
        onOpenBookDemo={() => {
          setAiModalOpen(false);
          setBookDemoOpen(true);
        }}
      />

      {/* Real-time Interactive Voice Calling Modal (Live Calling Conversation) */}
      <LiveVoiceCallModal
        isOpen={voiceCallOpen}
        onClose={() => setVoiceCallOpen(false)}
        initialLanguage={currentLanguage}
        initialBusiness={voiceCallBusiness}
        onOpenBookDemo={() => {
          setVoiceCallOpen(false);
          setBookDemoOpen(true);
        }}
      />

      {/* Book a Demo Modal */}
      <BookDemoModal
        isOpen={bookDemoOpen}
        onClose={() => setBookDemoOpen(false)}
      />

      {/* Quick WhatsApp / Phone Assistance Modal */}
      <QuickContactModal
        type={quickContactType}
        onClose={() => setQuickContactType(null)}
        onOpenAiTester={() => {
          setQuickContactType(null);
          setAiModalOpen(true);
        }}
        onOpenVoiceCall={() => {
          setQuickContactType(null);
          handleOpenVoiceCall();
        }}
      />
    </div>
  );
}
