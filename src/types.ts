export type SupportedLanguage = 'en' | 'hi' | 'hinglish' | 'pa' | 'ur' | 'bn';

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  nativeLabel: string;
  badge: string;
}

export type BusinessCategory = 'clinic' | 'salon' | 'restaurant' | 'realestate' | 'service';

export interface BusinessProfile {
  id: BusinessCategory;
  name: string;
  location: string;
  tagline: string;
  icon: string;
  sampleQuestions: {
    en: string[];
    hi: string[];
    hinglish: string[];
    pa: string[];
    ur: string[];
    bn: string[];
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  time?: string;
  language?: SupportedLanguage;
}

export interface FeatureItem {
  id: number;
  title: string;
  description: string;
  iconName: string;
  badge?: string;
}

export interface StatItem {
  value: string;
  label: string;
  sublabel: string;
}

export interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
  business: string;
  locality: string;
  rating: number;
}

export interface PricingPlan {
  name: string;
  badge?: string;
  description: string;
  price: string;
  period: string;
  popular?: boolean;
  features: string[];
  ctaText: string;
}

export interface FaqItem {
  question: string;
  answer: string;
  category?: string;
}
