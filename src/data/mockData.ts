import {
  SupportedLanguage,
  LanguageOption,
  BusinessProfile,
  FeatureItem,
  StatItem,
  TestimonialItem,
  PricingPlan,
  FaqItem,
} from '../types';

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', badge: 'EN' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिंदी', badge: 'हि' },
  { code: 'hinglish', label: 'Hinglish', nativeLabel: 'Hinglish', badge: 'HG' },
  { code: 'pa', label: 'Punjabi', nativeLabel: 'ਪੰਜਾਬੀ', badge: 'ਪੰ' },
  { code: 'ur', label: 'Urdu', nativeLabel: 'اردو', badge: 'ار' },
  { code: 'bn', label: 'Bengali', nativeLabel: 'বাংলা', badge: 'বা' },
];

export const BUSINESS_PROFILES: BusinessProfile[] = [
  {
    id: 'clinic',
    name: 'Dr. Mehta Dental & Aesthetic Clinic',
    location: 'Vasant Vihar & South Ex, Delhi',
    tagline: 'Multi-specialty dental care, implantology & cosmetic teeth whitening',
    icon: 'Stethoscope',
    sampleQuestions: {
      en: [
        'Can I book a dental consultation for tomorrow?',
        'What are your root canal and teeth whitening charges?',
        'Do you have parking available at your clinic?',
        'Is emergency dental pain treatment available today?',
      ],
      hi: [
        'कल डॉक्टर साहब से मिलने का समय मिल सकता है?',
        'दांतों की सफाई और चेकअप की क्या फीस है?',
        'क्लिनिक का समय क्या है?',
        'क्या इमरजेंसी में आज दिखा सकते हैं?',
      ],
      hinglish: [
        'Hi, kal appointment mil sakti hai?',
        'Teeth cleaning and scaling ke charges kya hain?',
        'Dr. Mehta kal available hain evening slot mein?',
        'Clinic ka exact location kya hai South Delhi mein?',
      ],
      pa: [
        'ਕੱਲ੍ਹ ਡਾਕਟਰ ਸਾਹਿਬ ਨਾਲ ਮੁਲਾਕਾਤ ਦਾ ਸਮਾਂ ਮਿਲ ਸਕਦਾ ਹੈ?',
        'ਦੰਦਾਂ ਦੀ ਜਾਂਚ ਅਤੇ ਸਫਾਈ ਦਾ ਕਿੰਨਾ ਖਰਚਾ ਆਵੇਗਾ?',
        'ਕੀ ਕੱਲ੍ਹ ਸ਼ਾਮ ਦਾ ਸਲਾਟ ਖਾਲੀ ਹੈ?',
        'ਤੁਹਾਡਾ ਕਲੀਨਿਕ ਕਿੱਥੇ ਸਥਿਤ ਹੈ?',
      ],
      ur: [
        'کیا کل ڈاکٹر صاحب سے ملاقات کا وقت مل سکتا ہے؟',
        'دانتوں کے معائنے کی کیا فیس ہے؟',
        'کل شام کا وقت مل جائے گا؟',
        'کلینک کا پتہ اور اوقات کیا ہیں؟',
      ],
      bn: [
        'আগামীকাল কি ডাক্তারের সাথে অ্যাপয়েন্টমেন্ট বুক করা যাবে?',
        'দাঁতের রুট ক্যানাল ও চেকাপের চার্জ কত?',
        'আপনাদের ক্লিনিক খোলার সময় কখন?',
        'ক্লিনিকের ঠিকানা কোথায়?',
      ],
    },
  },
  {
    id: 'salon',
    name: 'Luxe Aura Hair & Spa Atelier',
    location: 'Connaught Place & Khan Market, New Delhi',
    tagline: 'Luxury hair styling, Keratin therapy & organic body rejuvenation',
    icon: 'Sparkles',
    sampleQuestions: {
      en: [
        'Can I book a hair spa and styling for Saturday 4 PM?',
        'What are your bridal makeover packages?',
        'Do you offer organic facial and hair botox?',
        'What are the salon timings on weekends?',
      ],
      hi: [
        'शनिवार को हेयर स्पा और फेशियल के लिए स्लॉट मिलेगा?',
        'ब्राइडल मेकअप के पैकेजेस क्या हैं?',
        'सैलून किस समय तक खुला रहता है?',
        'क्या एडवांस बुकिंग जरूरी है?',
      ],
      hinglish: [
        'Hi! Sunday ko Keratin treatment ke liye appointment mil sakta hai?',
        'Bridal makeup packages ke rates share kar dijiye.',
        'Khan Market branch mein female stylists available hain?',
        'Hair cut and blow dry ka kya rate hai?',
      ],
      pa: [
        'ਸ਼ਨੀਵਾਰ ਨੂੰ ਹੇਅਰ ਸਪਾ ਲਈ ਅਪਾਇੰਟਮੈਂਟ ਮਿਲ ਸਕਦੀ ਹੈ?',
        'ਵਿਆਹ ਦੇ ਮੇਕਅਪ ਦੇ ਕੀ ਪੈਕੇਜ ਹਨ?',
        'ਸੈਲੂਨ ਦੇ ਖੁੱਲ੍ਹਣ ਦਾ ਸਮਾਂ ਕੀ ਹੈ?',
        'ਕੀ ਕੱਲ੍ਹ ਦੁਪਹਿਰ ਦਾ ਸਮਾਂ ਮਿਲੇਗਾ?',
      ],
      ur: [
        'کیا کل ہیئر اسپا اور فیشل کا وقت مل سکتا ہے؟',
        'شادی کے میک اپ کے کیا پیکجز ہیں؟',
        'سیلون کے کھلنے اور بند ہونے کا کیا وقت ہے؟',
        'کیا ایڈوانس بکنگ کرنی ہوگی؟',
      ],
      bn: [
        'শনিবার কি হেয়ার স্পা এর জন্য বুকিং পাওয়া যাবে?',
        'ব্রাইডাল মেকআপ প্যাকেজের চার্জ কত?',
        'সেলুন খোলার সময় কখন?',
        'রবিবারের জন্য স্লট বুক করতে চাই।',
      ],
    },
  },
  {
    id: 'restaurant',
    name: 'Dastaan — Heritage Dining & Bar',
    location: 'Greater Kailash & DLF Cyber Hub',
    tagline: 'Progressive North Indian & Mughlai cuisine with rooftop lounge',
    icon: 'UtensilsCrossed',
    sampleQuestions: {
      en: [
        'Table reservation for 6 guests this Friday 8:30 PM',
        'Do you offer outdoor terrace seating with liquor menu?',
        'Is valet parking available?',
        'Can we host a private birthday party for 25 people?',
      ],
      hi: [
        'शुक्रवार शाम 8 बजे 4 लोगों के लिए टेबल बुक करनी है।',
        'क्या रूफटॉप पर सिटिंग मिल सकती है?',
        'क्या वेज और नॉन-वेज दोनों ऑप्शन्स हैं?',
        'पार्किंग की क्या सुविधा है?',
      ],
      hinglish: [
        'Hey! Tonight 8 PM 4 people ke liye table reserve karni hai.',
        'Rooftop outdoor seating available hai kya?',
        'Zomato Gold ya direct discount applicable hai?',
        'Private party booking ke liye minimum guarantee kya hai?',
      ],
      pa: [
        'ਸ਼ੁੱਕਰਵਾਰ ਰਾਤ 8 ਵਜੇ 6 ਜਣਿਆਂ ਲਈ ਟੇਬਲ ਬੁੱਕ ਕਰਨਾ ਹੈ।',
        'ਕੀ ਰੂਫਟੌਪ ਤੇ ਬੈਠਣ ਦੀ ਥਾਂ ਮਿਲ ਜਾਵੇਗੀ?',
        'ਕੀ ਤੁਹਾਡੇ ਕੋਲ ਪਾਰਕਿੰਗ ਦੀ ਸਹੂਲਤ ਹੈ?',
        'ਜਨਮਦਿਨ ਦੀ ਪਾਰਟੀ ਲਈ ਬੁਕਿੰਗ ਹੋ ਜਾਵੇਗੀ?',
      ],
      ur: [
        'جمعہ کی شام 8 بجے 4 افراد کے لیے ٹیبل بک کرنی ہے۔',
        'کیا چھت پر بیٹھنے کی جگہ مل جائے گی؟',
        'کیا پارکنگ کی سہولت دستیاب ہے؟',
        'کھانے کا مینیو اور اوقات کیا ہیں؟',
      ],
      bn: [
        'শুক্রবার রাত ৮টায় ৪ জনের জন্য টেবিল বুক করতে চাই।',
        'রুফটপ সিটিং কি পাওয়া যাবে?',
        'গাড়ী পার্কিং এর সুবিধা আছে কি?',
        'মেনু এবং স্পেশাল ডিশ সম্পর্কে জানতে চাই।',
      ],
    },
  },
  {
    id: 'realestate',
    name: 'Apex Heritage Properties NCR',
    location: 'Golf Course Road, Gurgaon & South Delhi',
    tagline: 'Ultra-luxury residences, commercial floors & builder floors',
    icon: 'Building2',
    sampleQuestions: {
      en: [
        'Looking for 3 & 4 BHK luxury builder floors in South Delhi',
        'Schedule a site visit for Golf Course Road penthouse this Sunday',
        'What are the price brackets for new launches in Greater Kailash?',
        'Can you share the project brochure and payment plans on WhatsApp?',
      ],
      hi: [
        'साउथ दिल्ली में 3 BHK फ्लोर के क्या ऑप्शन्स उपलब्ध हैं?',
        'रविवार को साइट विजिट का समय मिल सकता है?',
        'प्रोजेक्ट की ब्रोशर और पेमेंट प्लान साझा करें।',
        'क्या बैंक लोन की सुविधा उपलब्ध है?',
      ],
      hinglish: [
        'Looking for 3 BHK in Greater Kailash or Vasant Vihar. Budget 4-6 Cr.',
        'Kal site visit schedule kar sakte hain Gurgaon project ke liye?',
        'Brochure aur floor plan WhatsApp par send kar dijiye please.',
        'Ready-to-move builder floor options kya hain?',
      ],
      pa: [
        'ਦੱਖਣੀ ਦਿੱਲੀ ਵਿੱਚ 3 BHK ਫਲੋਰ ਦੇ ਕੀ ਵਿਕਲਪ ਹਨ?',
        'ਐਤਵਾਰ ਨੂੰ ਸਾਈਟ ਦੇਖਣ ਦਾ ਸਮਾਂ ਤੈਅ ਕਰਨਾ ਹੈ।',
        'ਕੀ ਤੁਸੀਂ WhatsApp ਤੇ ਵੇਰਵੇ ਭੇਜ ਸਕਦੇ ਹੋ?',
        'ਨਵੇਂ ਪ੍ਰੋਜੈਕਟ ਦੀਆਂ ਕੀਮਤਾਂ ਕੀ ਹਨ?',
      ],
      ur: [
        'جنوبی دہلی میں 3 بی ایچ کے کے کیا اختیارات ہیں؟',
        'اتوار کو سائٹ وزٹ کا وقت طے کرنا ہے۔',
        'کیا آپ واٹس ایپ پر بروشر بھیج سکتے ہیں؟',
        'نئی بلڈنگز کے ریٹس کیا ہیں؟',
      ],
      bn: [
        'সাউথ দিল্লিতে ৩ বিএইচকে ফ্ল্যাটের অপশন দেখতে চাই।',
        'রবিবার কি সাইট ভিজিটের সময় নির্ধারণ করা যাবে?',
        'হোয়াটসঅ্যাপে প্রজেক্টের ব্রোশার পাঠানো যাবে?',
        'পেমেন্ট প্ল্যান ও মূল্য তালিকা জানতে চাই।',
      ],
    },
  },
];

export const DEMO_CONVERSATIONS: Record<
  SupportedLanguage,
  Array<{ sender: 'user' | 'ai'; text: string; time: string }>
> = {
  en: [
    {
      sender: 'user',
      text: 'Hi, can I book an appointment for tomorrow evening around 6 PM?',
      time: '6:42 PM',
    },
    {
      sender: 'ai',
      text: 'Absolutely! We have openings tomorrow at 5:45 PM and 6:30 PM with Dr. Mehta in Vasant Vihar. Which of these slots works better for you?',
      time: '6:42 PM',
    },
    {
      sender: 'user',
      text: '6:30 PM is perfect. Do you also have valet parking available?',
      time: '6:43 PM',
    },
    {
      sender: 'ai',
      text: 'Yes, complimentary valet parking is available right at our entrance. May I please have your Full Name and Mobile Number to confirm your 6:30 PM appointment slot on WhatsApp?',
      time: '6:43 PM',
    },
  ],
  hi: [
    {
      sender: 'user',
      text: 'नमस्ते, क्या कल डॉक्टर साहब से मिलने का समय मिल सकता है?',
      time: '6:42 PM',
    },
    {
      sender: 'ai',
      text: 'जी बिल्कुल! कल वसंत विहार क्लीनिक में शाम 5:30 बजे और 6:45 बजे के स्लॉट उपलब्ध हैं। आप कौन सा समय पसंद करेंगे?',
      time: '6:42 PM',
    },
    {
      sender: 'user',
      text: 'शाम 6:45 बजे का समय ठीक रहेगा। क्या चेकअप के साथ तुरंत कंसल्टेशन हो जाएगा?',
      time: '6:43 PM',
    },
    {
      sender: 'ai',
      text: 'हाँ जी, आपका पूरा चेकअप और डिजिटल स्कैनिंग उसी समय हो जाएगी। आपकी बुकिंग पक्की करने के लिए कृपया अपना नाम और फ़ोन नंबर बता दीजिए, मैं तुरंत WhatsApp पर कन्फर्मेशन भेज देती हूँ।',
      time: '6:43 PM',
    },
  ],
  hinglish: [
    {
      sender: 'user',
      text: 'Hi, kal appointment mil sakti hai?',
      time: '6:42 PM',
    },
    {
      sender: 'ai',
      text: 'Bilkul! Kal appointments available hain. Aap morning ya evening slot prefer karenge?',
      time: '6:42 PM',
    },
    {
      sender: 'user',
      text: 'Evening around 6. Aur teeth cleaning ke charges kya hain?',
      time: '6:43 PM',
    },
    {
      sender: 'ai',
      text: 'Perfect! Kal 6:15 PM ka slot reserved kar dete hain. Teeth cleaning & polishing ₹1,800 se start hoti hai including complete dental checkup. Kya main aapka Name aur WhatsApp number note kar loon confirmation ke liye?',
      time: '6:43 PM',
    },
  ],
  pa: [
    {
      sender: 'user',
      text: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਜੀ, ਅਪਾਇੰਟਮੈਂਟ ਬੁੱਕ ਕਰਨੀ ਆ ਕੱਲ੍ਹ ਲਈ।',
      time: '6:42 PM',
    },
    {
      sender: 'ai',
      text: 'ਬਿਲਕੁਲ ਜੀ! ਤੁਸੀਂ ਕੱਲ੍ਹ ਲਈ ਅਪਾਇੰਟਮੈਂਟ ਬੁੱਕ ਕਰ ਸਕਦੇ ਹੋ। ਤੁਸੀਂ ਸਵੇਰ ਦਾ ਸਮਾਂ ਪਸੰਦ ਕਰੋਗੇ ਜਾਂ ਸ਼ਾਮ ਦਾ?',
      time: '6:42 PM',
    },
    {
      sender: 'user',
      text: 'ਕੱਲ੍ਹ ਸ਼ਾਮ 6 ਵਜੇ ਦੇ ਨੇੜੇ ਕੋਈ ਸਲਾਟ ਹੈਗਾ ਜੀ?',
      time: '6:43 PM',
    },
    {
      sender: 'ai',
      text: 'ਹਾਂਜੀ, ਕੱਲ੍ਹ ਸ਼ਾਮ 6:15 ਵਜੇ ਦਾ ਸਲਾਟ ਬਿਲਕੁਲ ਖਾਲੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਸ਼ੁਭ ਨਾਮ ਅਤੇ ਫ਼ੋਨ ਨੰਬਰ ਦੱਸੋ ਜੀ, ਤਾਂ ਜੋ ਅਸੀਂ ਤੁਹਾਡੀ ਬੁਕਿੰਗ ਪੱਕੀ ਕਰਕੇ WhatsApp ਤੇ ਮੈਸੇਜ ਭੇਜ ਸਕੀਏ।',
      time: '6:43 PM',
    },
  ],
  ur: [
    {
      sender: 'user',
      text: 'السلام علیکم، کیا کل شام کے لیے اپائنٹمنٹ مل سکتی ہے؟',
      time: '6:42 PM',
    },
    {
      sender: 'ai',
      text: 'وعلیکم السلام! جی بالکل، کل شام 5:30 اور 6:30 بجے کے اوقات دستیاب ہیں۔ آپ کون سا وقت پسند فرمائیں گے؟',
      time: '6:42 PM',
    },
    {
      sender: 'user',
      text: 'شام 6:30 کا وقت مناسب رہے گا۔ کیا کلینک میں پارکنگ کی سہولت ہے؟',
      time: '6:43 PM',
    },
    {
      sender: 'ai',
      text: 'جی ہاں، ہمارے پاس مفت ویلٹ پارکنگ موجود ہے۔ آپ کی اپائنٹمنٹ کنفرم کرنے کے لیے براہ کرم اپنا نام اور موبائل نمبر بتا دیں تاکہ واٹس ایپ پر تفصیلات بھیجی جا سکیں۔',
      time: '6:43 PM',
    },
  ],
  bn: [
    {
      sender: 'user',
      text: 'নমস্কার, আগামীকাল কি ডাক্তারের সাথে অ্যাপয়েন্টমেন্ট পাওয়া যাবে?',
      time: '6:42 PM',
    },
    {
      sender: 'ai',
      text: 'অবশ্যই! আগামীকাল সকাল ১১:০০ এবং সন্ধ্যা ৬:১৫ টায় স্লট খালি আছে। আপনি কোন সময়টি পছন্দ করবেন?',
      time: '6:42 PM',
    },
    {
      sender: 'user',
      text: 'সন্ধ্যা ৬:১৫ টা ঠিক হবে। কনসালটেশন ফি কত?',
      time: '6:43 PM',
    },
    {
      sender: 'ai',
      text: 'সন্ধ্যা ৬:১৫ এর জন্য কনফার্ম করা হচ্ছে। সাধারণ কনসালটেশন ফি ₹১,০০০। বুকিং সম্পন্ন করার জন্য দয়া করে আপনার নাম ও ফোন নম্বরটি জানান, আমরা হোয়াটসঅ্যাপে নিশ্চিতকরণ পাঠিয়ে দেব।',
      time: '6:43 PM',
    },
  ],
};

export const QUICK_REPLIES: Record<SupportedLanguage, string[]> = {
  en: [
    'Book tomorrow',
    'Service pricing',
    'Opening hours',
    'Talk to a human',
  ],
  hi: [
    'कल के लिए अपॉइंटमेंट बुक करें',
    'सर्विसेज और फीस की जानकारी',
    'क्लिनिक की टाइमिंग क्या है?',
    'इमरजेंसी दांत दर्द स्लॉट',
  ],
  hinglish: [
    'Book tomorrow',
    'Service pricing',
    'Opening hours',
    'Talk to a human',
  ],
  pa: [
    'ਕੱਲ੍ਹ ਲਈ ਬੁਕਿੰਗ ਕਰੋ',
    'ਸਰਵਿਸ ਦੀ ਫੀਸ ਦੱਸੋ',
    'ਖੁੱਲ੍ਹਣ ਦਾ ਸਮਾਂ ਕੀ ਹੈ?',
    'ਡਾਕਟਰ ਨਾਲ ਗੱਲ ਕਰੋ',
  ],
  ur: [
    'کل کے لیے اپائنٹمنٹ بک کریں',
    'سروسز اور فیس کی تفصیلات',
    'کھلنے کے اوقات کیا ہیں؟',
    'کسی نمائندے سے بات کریں',
  ],
  bn: [
    'আগামীকালের জন্য বুকিং',
    'সার্ভিস ও খরচের তালিকা',
    'ক্লিনিক খোলার সময়',
    'কারো সাথে কথা বলতে চাই',
  ],
};

export const STATS: StatItem[] = [
  {
    value: '24/7',
    label: 'AVAILABLE',
    sublabel: 'Day, night, weekends & Delhi holidays',
  },
  {
    value: '95%',
    label: 'QUESTIONS ANSWERED',
    sublabel: 'Accurate instant answers without human intervention',
  },
  {
    value: '<10s',
    label: 'RESPONSE TIME',
    sublabel: 'Zero customer waiting on WhatsApp and web chat',
  },
  {
    value: '4.9★',
    label: 'CUSTOMER EXPERIENCE',
    sublabel: 'Across Delhi clinics, salons, cafes & businesses',
  },
];

export const FEATURES: FeatureItem[] = [
  {
    id: 1,
    title: '24/7 AI Receptionist',
    description: 'Answers customer questions anytime — whether it is 2 PM in Connaught Place or 2 AM on a Sunday.',
    iconName: 'Clock',
    badge: 'Always On',
  },
  {
    id: 2,
    title: 'Multilingual Conversations',
    description: 'Fluent in English, Hindi, Hinglish, Punjabi, Urdu and Bengali. Seamlessly switches based on how customers talk.',
    iconName: 'Languages',
    badge: '6 Languages',
  },
  {
    id: 3,
    title: 'Appointment Booking',
    description: 'Collects preferred date and time, checks real availability, and automatically locks in bookings for your business.',
    iconName: 'CalendarCheck',
    badge: 'Direct Sync',
  },
  {
    id: 4,
    title: 'WhatsApp Integration',
    description: 'Moves web visitors and phone callers directly to WhatsApp with automated instant greetings and summaries.',
    iconName: 'MessageSquare',
    badge: 'Official API',
  },
  {
    id: 5,
    title: 'Business Information',
    description: 'Accurately answers questions about your services, doctor schedules, pricing, menus, timings, and Delhi location details.',
    iconName: 'HelpCircle',
  },
  {
    id: 6,
    title: 'Lead Capture',
    description: 'Collects customer name, verified phone number, specific requirements, and saves them straight to your CRM/Google Sheets.',
    iconName: 'UserCheck',
  },
  {
    id: 7,
    title: 'Call Assistance',
    description: 'Helps eliminate missed calls and unattended customer enquiries when your front desk is busy with in-person walk-ins.',
    iconName: 'PhoneCall',
  },
  {
    id: 8,
    title: 'Instant Responses',
    description: 'Customers never wait on hold or abandon your website due to slow response times. Instant replies in under 2 seconds.',
    iconName: 'Zap',
  },
];

export const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Connect your business',
    description: 'Enter your business details, upload your service menu, pricing sheet, timings, and FAQs in 5 minutes.',
  },
  {
    step: '02',
    title: 'Train your AI Receptionist',
    description: 'Our system customizes the AI with your brand voice, appointment rules, and Delhi multilingual dialect preferences.',
  },
  {
    step: '03',
    title: 'Let it handle conversations 24/7',
    description: 'Go live on your website, WhatsApp, and phone channels. Watch unattended enquiries turn into confirmed customers.',
  },
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    quote:
      'In Delhi, half our patients message in Hindi or casual Hinglish asking about slots after 9 PM. DilliAI books them right away instead of waiting till morning.',
    author: 'Dr. A. Sharma',
    role: 'Principal Implantologist',
    business: 'South Delhi Dental & Aesthetic Clinic',
    locality: 'Vasant Vihar, New Delhi',
    rating: 5,
  },
  {
    quote:
      'We used to miss dozens of bridal makeup and hair spa enquiries on busy weekend afternoons. Now the AI receptionist handles WhatsApp questions and books appointments instantly.',
    author: 'Priya K.',
    role: 'Managing Director',
    business: 'The Luxe Atelier Salon & Wellness',
    locality: 'Connaught Place & Khan Market',
    rating: 5,
  },
  {
    quote:
      'Table reservations, valet parking queries, and weekend private party bookings are now 100% automated. Guests love how natural the conversational replies sound.',
    author: 'Rohan Mehra',
    role: 'Co-Founder & General Manager',
    business: 'Heritage Social & Bar',
    locality: 'Greater Kailash II, New Delhi',
    rating: 5,
  },
  {
    quote:
      'High-intent property buyers contacting us at night get immediate answers on floor plans, pricing brackets, and weekend site visits without any receptionist delay.',
    author: 'Vikramjit B.',
    role: 'Managing Partner',
    business: 'Prime NCR Realty & Estates',
    locality: 'Golf Course Road, Gurgaon',
    rating: 5,
  },
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    name: 'Starter Front Desk',
    description: 'Perfect for boutique clinics, single-location salons, and local Delhi cafes.',
    price: '₹4,999',
    period: '/ month',
    popular: false,
    features: [
      'Up to 1,500 customer conversations / mo',
      'Web chat & WhatsApp link integration',
      'English, Hindi & Hinglish support',
      'Appointment & table booking collection',
      'Lead capture sent to email & WhatsApp',
      'Standard business hours setup support',
    ],
    ctaText: 'Book a Demo',
  },
  {
    name: 'Pro Multilingual',
    badge: 'MOST POPULAR IN DELHI',
    description: 'Designed for high-traffic clinics, luxury salons, busy restaurants & growing businesses.',
    price: '₹9,999',
    period: '/ month',
    popular: true,
    features: [
      'Up to 5,000 customer conversations / mo',
      'Full 6-language fluency (incl. Punjabi & Urdu)',
      'Official WhatsApp Business API integration',
      'Live Google Calendar / Practo / CRM sync',
      'Automated SMS / WhatsApp reminders',
      'Instant human handoff alerts',
      'Dedicated Delhi-based onboarding manager',
    ],
    ctaText: 'Book a Demo',
  },
  {
    name: 'Enterprise NCR',
    description: 'For multi-branch hospitals, restaurant chains, real estate developers and luxury hotels.',
    price: 'Custom',
    period: 'tailored setup',
    popular: false,
    features: [
      'Unlimited customer conversations & locations',
      'Direct telephony voice bot + WhatsApp sync',
      'Custom ERP, HMS & CRM custom integrations',
      'Multi-branch location routing (Delhi, Noida, GGN)',
      'Custom security & enterprise SLA guarantees',
      '24/7 dedicated account manager',
    ],
    ctaText: 'Talk to Sales',
  },
];

export const FAQS: FaqItem[] = [
  {
    question: 'Can the AI speak Hindi?',
    answer:
      'Yes, fluently. The AI Receptionist understands standard Devanagari Hindi as well as spoken colloquial Hindi used daily by customers across Delhi NCR.',
  },
  {
    question: 'Can it understand Hinglish?',
    answer:
      'Yes, exceptionally well. It is specifically optimized for natural Delhi-style Hinglish (e.g. "Kal 6 PM appointment mil sakta hai kya?", "Teeth cleaning charges share kar do"). It replies in natural, professional Hinglish or your chosen brand tone.',
  },
  {
    question: 'Can it answer WhatsApp enquiries?',
    answer:
      'Yes! DilliAI connects directly with WhatsApp so customers visiting your website or clicking your ads are greeted instantly on WhatsApp and guided to book.',
  },
  {
    question: 'Can it book appointments?',
    answer:
      'Yes. It collects the customer’s preferred date, time, service requirement, and contact details, and can automatically check your schedule and confirm the appointment.',
  },
  {
    question: 'Can it answer calls?',
    answer:
      'Yes. On our Pro and Enterprise plans, we provide phone call assistance that picks up missed or overflow calls, greets callers naturally, and sends follow-up booking links via SMS/WhatsApp.',
  },
  {
    question: 'Can I train it with my business information?',
    answer:
      'Yes, easily. You simply upload your service list, pricing cards, clinic timings, parking guidelines, doctor bios, or restaurant menu. The AI strictly answers using your verified facts.',
  },
  {
    question: 'Can it transfer a customer to a human?',
    answer:
      'Absolutely. Whenever a customer asks for a human ("Talk to human", "Doctor se baat karni hai") or has an urgent custom query, the AI flags the chat and instantly notifies your team with the full transcript.',
  },
  {
    question: 'Does it work 24/7?',
    answer:
      'Yes, 24 hours a day, 7 days a week, 365 days a year. It never sleeps, takes leave, or misses an enquiry during late nights or public holidays.',
  },
  {
    question: 'How quickly can it be deployed?',
    answer:
      'Most Delhi businesses go live within 24 to 48 hours. Our team assists with uploading your FAQs, configuring your calendar, and adding the chat widget to your website.',
  },
];
