import { SupportedLanguage, BusinessCategory } from '../types';

export interface ReceptionistSessionState {
  userName?: string;
  userPhone?: string;
  hasGreeted?: boolean;
  appointmentBooked?: boolean;
  selectedDate?: string;
  selectedTime?: string;
  selectedDoctor?: string;
  inquiredService?: string;
  turnCount?: number;
  lastIntent?: string;
}

export interface ExtractedEntities {
  name?: string;
  phone?: string;
  doctor?: string;
  date?: string;
  time?: string;
  service?: string;
  isCorrection?: boolean;
  correctedField?: 'date' | 'time' | 'doctor' | 'name';
  isUnderstandingAck?: boolean;
  isIncompleteThought?: boolean;
}

interface ResponseContext {
  language: SupportedLanguage;
  businessType?: BusinessCategory;
  userMessage: string;
  state?: ReceptionistSessionState;
}

/**
 * Robustly determines the best language for the conversation.
 */
export function resolveConversationLanguage(text: string, currentSelectedLang: SupportedLanguage = 'hi'): SupportedLanguage {
  const lower = text.toLowerCase().trim();

  // 1. Explicit user language commands
  if (
    lower.includes('hindi me') ||
    lower.includes('hindi please') ||
    lower.includes('हिंदी में') ||
    lower.includes('बात करो हिंदी') ||
    lower.includes('hindi bolo') ||
    lower.includes('in hindi')
  ) {
    return 'hi';
  }

  if (
    lower.includes('english me') ||
    lower.includes('in english') ||
    lower.includes('english please') ||
    lower.includes('speak in english')
  ) {
    return 'en';
  }

  // 2. Script detection
  if (/[\u0900-\u097F]/.test(text)) {
    return 'hi';
  }
  if (/[\u0A00-\u0A7F]/.test(text)) {
    return 'pa';
  }
  if (/[\u0600-\u06FF]/.test(text)) {
    return 'ur';
  }
  if (/[\u0980-\u09FF]/.test(text)) {
    return 'bn';
  }

  // 3. Clear English sentence detection
  const englishPhrases = [
    'i want', 'i need', 'who is the doctor', 'is doctor', 'what is the', 'how much',
    'can i get', 'please tell me', 'when can', 'my name is', 'what are the', 'where is your',
    'schedule an appointment', 'dental checkup', 'teeth cleaning', 'root canal cost',
    'appointment today', 'tomorrow morning', 'good morning', 'good afternoon', 'good evening',
    'thank you', 'how are you', 'tell me about', 'opening hours', 'what time', 'is there parking',
    'actually i wanted', 'i was thinking', 'not tomorrow'
  ];
  if (englishPhrases.some((p) => lower.includes(p))) {
    return 'en';
  }

  // 4. Romanized Hindi / Hinglish keywords
  const hinglishWords = [
    'namaste', 'namaskar', 'pranam', 'bhai', 'ji', 'kya', 'hai', 'hain', 'kaise', 'karenge', 'karega', 'chahiye',
    'mil', 'sakti', 'sakta', 'shukriya', 'kitna', 'kitne', 'timing', 'kab', 'kahan', 'kaha', 'doctor', 'batao',
    'dijiye', 'krna', 'karna', 'hoga', 'pe', 'bhejo', 'bhej', 'rates', 'paisa', 'paise', 'slot', 'theek',
    'naam', 'mera', 'apna', 'booking', 'haan', 'ha', 'nahi', 'shyam', 'sham', 'subah', 'bataiye', 'sun',
    'rahi', 'rahe', 'sunno', 'sunna', 'pata', 'baithta', 'baithega', 'daant', 'dard', 'safai', 'ilaj', 'chahiye',
    'khula', 'band', 'fees', 'kharch', 'kharcha', 'bol', 'diya', 'na'
  ];
  const words = lower.split(/\s+/);
  if (words.some((w) => hinglishWords.includes(w))) {
    return currentSelectedLang === 'hi' ? 'hi' : 'hinglish';
  }

  return currentSelectedLang;
}

export const detectLanguage = resolveConversationLanguage;

/**
 * Checks if the user's speech trailing fragment represents an unfinished sentence.
 */
export function isIncompleteThought(text: string): boolean {
  const lower = text.toLowerCase().trim();
  const trailingIncompleteMarkers = [
    'because', 'and', 'actually', 'for', 'around', 'thinking', 'so', 'but', 'if', 'when',
    'aur', 'kyunki', 'lekin', 'par', 'toh', 'kyonki', 'actually', 'matlab', 'soch', 'raha', 'rahi',
    'क्योंकि', 'और', 'लेकिन', 'पर', 'तो', 'शायद'
  ];

  return trailingIncompleteMarkers.some((marker) => lower.endsWith(marker) || lower.endsWith(`${marker}...`));
}

/**
 * Extracts person name accurately from Hindi, Hinglish, or English introductions
 */
export function extractUserName(text: string): string | undefined {
  const clean = text.trim();

  const hindiMatch = clean.match(/(?:मेरा\s+नाम|नाम\s+है|मैं\s+हूँ|मैं)\s+([\u0900-\u097F\w]+)/i);
  if (hindiMatch && hindiMatch[1]) {
    const raw = hindiMatch[1].trim();
    const blacklist = ['एक', 'यहाँ', 'वहाँ', 'नमस्ते', 'हैलो', 'हेलो', 'डॉक्टर', 'बुक', 'अस्पताल', 'क्लिनिक', 'बात', 'पेशेंट', 'दांत', 'दर्द', 'कल', 'आज'];
    if (!blacklist.includes(raw) && raw.length >= 2) {
      return raw;
    }
  }

  const engMatch = clean.match(/(?:my\s+name\s+is|i\s+am|i'm|this\s+is|name\s+is|call\s+me)\s+([a-zA-Z]+)/i);
  if (engMatch && engMatch[1]) {
    const raw = engMatch[1].trim();
    const blacklist = ['a', 'an', 'the', 'here', 'calling', 'doctor', 'booking', 'hello', 'hi', 'patient', 'user', 'appointment', 'tomorrow', 'today'];
    if (!blacklist.includes(raw.toLowerCase()) && raw.length >= 2) {
      return raw.charAt(0).toUpperCase() + raw.slice(1);
    }
  }

  const commonNames = [
    'अभिषेक', 'राहुल', 'प्रिया', 'अमित', 'रोहित', 'अंजलि', 'करण', 'सिमरन', 'विकास', 'नेहा',
    'गौरव', 'पूजा', 'दीपक', 'सोनिया', 'अंकित', 'संजय', 'राकेश', 'मोनिका', 'सुरेश', 'अनिल',
    'राजेश', 'मनीष', 'स्वाति', 'कविता', 'अमन', 'हर्ष', 'तरुण', 'विवेक', 'समीर', 'आशीष', 'रोहन',
    'Abhishek', 'Rahul', 'Priya', 'Amit', 'Rohit', 'Anjali', 'Karan', 'Simran', 'Vikas', 'Neha',
    'Gaurav', 'Pooja', 'Deepak', 'Sonia', 'Ankit', 'Sanjay', 'Rakesh', 'Suresh', 'Anil', 'Manish',
    'Aman', 'Harsh', 'Vivek', 'Sameer', 'Ashish', 'Rohan'
  ];

  for (const name of commonNames) {
    if (new RegExp(`\\b${name}\\b`, 'i').test(clean)) {
      return name;
    }
  }

  return undefined;
}

/**
 * Extracts 10-digit phone number if present
 */
export function extractPhoneNumber(text: string): string | undefined {
  const match = text.match(/(?:\+91[\s-]?)?[6-9]\d{9}/);
  return match ? match[0] : undefined;
}

/**
 * Extracts comprehensive entities from caller statement
 */
export function extractAllEntities(text: string): ExtractedEntities {
  const lower = text.toLowerCase().trim();
  const entities: ExtractedEntities = {};

  entities.name = extractUserName(text);
  entities.phone = extractPhoneNumber(text);

  // Doctor extraction
  if (lower.includes('sharma') || lower.includes('शर्मा') || lower.includes('arvind') || lower.includes('अरविन्द')) {
    entities.doctor = 'Dr. Sharma';
  } else if (lower.includes('specialist') || lower.includes('सर्जन') || lower.includes('surgeon')) {
    entities.doctor = 'Senior Surgeon';
  }

  // Date extraction
  if (lower.includes('कल') || lower.includes('kal') || lower.includes('tomorrow')) {
    entities.date = 'tomorrow';
  } else if (lower.includes('आज') || lower.includes('aaj') || lower.includes('today')) {
    entities.date = 'today';
  } else if (lower.includes('friday') || lower.includes('शुक्रवार')) {
    entities.date = 'Friday';
  } else if (lower.includes('saturday') || lower.includes('शनिवार')) {
    entities.date = 'Saturday';
  } else if (lower.includes('sunday') || lower.includes('रविवार') || lower.includes('इतवार')) {
    entities.date = 'Sunday';
  } else if (lower.includes('monday') || lower.includes('सोमवार')) {
    entities.date = 'Monday';
  }

  // Time extraction
  const timeRegex = /(?:around|at|shyam|shaam|sham|subah|morning|evening)?\s*(\d{1,2}(?::\d{2})?\s*(?:pm|am|बजे|baje)?)/i;
  const timeMatch = lower.match(timeRegex);
  if (timeMatch && timeMatch[1]) {
    const rawTime = timeMatch[1].trim();
    if (rawTime.includes('6') || lower.includes('around 6') || lower.includes('6 बजे') || lower.includes('6 pm')) {
      entities.time = '6:00 PM';
    } else if (rawTime.includes('5') || lower.includes('around 5') || lower.includes('5 बजे') || lower.includes('5 pm')) {
      entities.time = '5:00 PM';
    } else if (rawTime.includes('11') || lower.includes('11:30')) {
      entities.time = '11:30 AM';
    } else if (rawTime.includes('2') || lower.includes('2:00')) {
      entities.time = '2:00 PM';
    } else {
      entities.time = rawTime;
    }
  } else if (lower.includes('evening') || lower.includes('शाम') || lower.includes('sham') || lower.includes('shaam')) {
    entities.time = 'evening';
  } else if (lower.includes('morning') || lower.includes('सुबह') || lower.includes('subah')) {
    entities.time = 'morning';
  }

  // Service extraction
  if (lower.includes('root canal') || lower.includes('रूट कैनाल') || lower.includes('rct')) {
    entities.service = 'Root Canal';
  } else if (lower.includes('cleaning') || lower.includes('क्लीनिंग') || lower.includes('scaling') || lower.includes('सफाई')) {
    entities.service = 'Teeth Cleaning';
  } else if (lower.includes('दर्द') || lower.includes('pain') || lower.includes('dard') || lower.includes('toothache')) {
    entities.service = 'Emergency Pain Checkup';
  } else if (lower.includes('braces') || lower.includes('aligner') || lower.includes('अलाइनर')) {
    entities.service = 'Aligners & Braces';
  } else if (lower.includes('implant') || lower.includes('इम्प्लांट')) {
    entities.service = 'Dental Implant';
  }

  // Corrections Check
  if (
    lower.startsWith('no, not') ||
    lower.startsWith('not tomorrow') ||
    lower.startsWith('no not') ||
    lower.includes('नहीं कल नहीं') ||
    lower.includes('मैंने बोल दिया ना') ||
    lower.includes('maine bol diya na') ||
    lower.includes('already told') ||
    lower.includes('bol to diya')
  ) {
    entities.isCorrection = true;
  }

  // Understanding Acknowledgement Check
  if (
    lower === 'हाँ समझ गया' ||
    lower === 'समझ गया' ||
    lower === 'samajh gaya' ||
    lower === 'got it' ||
    lower === 'understood' ||
    lower === 'i understand'
  ) {
    entities.isUnderstandingAck = true;
  }

  return entities;
}

/**
 * REAL-TIME HUMAN PHONE CONVERSATION ENGINE
 *
 * Implements strict rules:
 * - Clear, short 5-15 word conversational responses.
 * - Everyday spoken Indian Hindi / Hinglish / English without textbook formality.
 * - Single question / single idea per response.
 * - No robotic explanations, no internal thought outputs, no echoing.
 */
export function generateSmartReceptionistReply(ctx: ResponseContext): string {
  const { language, userMessage, state = {} } = ctx;
  const lower = userMessage.toLowerCase().trim();

  // Extract all details from this user turn
  const extracted = extractAllEntities(userMessage);

  // Update session state context
  const currentName = extracted.name || state.userName;
  const currentDate = extracted.date || state.selectedDate;
  const currentTime = extracted.time || state.selectedTime;

  const nameSuffix = currentName ? `${currentName} जी` : '';

  // -------------------------------------------------------------
  // Caller Corrections (e.g. "नहीं, शुक्रवार को", "Not tomorrow, Friday")
  // -------------------------------------------------------------
  if (extracted.isCorrection) {
    if (extracted.date === 'Friday' || lower.includes('friday') || lower.includes('शुक्रवार')) {
      if (language === 'hi') {
        return `अच्छा, शुक्रवार। किस समय आना चाहेंगे?`;
      }
      if (language === 'hinglish') {
        return `Got it, Friday. किस time पर आना चाहेंगे?`;
      }
      return `Got it, Friday. What time would you prefer?`;
    }

    if (lower.includes('कल शाम') || lower.includes('kal sham') || lower.includes('कल')) {
      if (language === 'hi') {
        return `हाँ, कल शाम। आपका नाम क्या है?`;
      }
      if (language === 'hinglish') {
        return `हाँ, कल शाम। May I have your name, please?`;
      }
      return `Sure, tomorrow evening. May I have your name?`;
    }

    if (language === 'hi') {
      return `जी, मैंने नोट कर लिया। बताइए, क्या मदद करूँ?`;
    }
    if (language === 'hinglish') {
      return `Noted. बताइए, आगे क्या help करूँ?`;
    }
    return `Noted. How can I help you?`;
  }

  // -------------------------------------------------------------
  // Caller Acknowledgement ("हाँ समझ गया" / "Got it")
  // -------------------------------------------------------------
  if (extracted.isUnderstandingAck) {
    if (language === 'hi') {
      return `बढ़िया। क्या appointment book कर दूँ?`;
    }
    if (language === 'hinglish') {
      return `Perfect. क्या appointment book कर दूँ?`;
    }
    return `Great. Would you like to book an appointment?`;
  }

  // -------------------------------------------------------------
  // Multi-Information Provided
  // -------------------------------------------------------------
  if (extracted.doctor && extracted.date && extracted.time && extracted.name) {
    if (language === 'hi') {
      return `जी ${extracted.name} जी। कल पाँच बजे का समय मिल जाएगा। मोबाइल नंबर बता दीजिए?`;
    }
    if (language === 'hinglish') {
      return `Got it ${extracted.name} ji. कल 5 PM slot open है। आपका phone number?`;
    }
    return `Got it, ${extracted.name}. Tomorrow at 5 PM is available. Your phone number?`;
  }

  if (extracted.doctor && extracted.date && extracted.time) {
    if (language === 'hi') {
      return `कल पाँच बजे स्लॉट उपलब्ध है। आपका नाम क्या है?`;
    }
    if (language === 'hinglish') {
      return `कल 5 PM slot available है। आपका नाम?`;
    }
    return `Tomorrow at 5 PM is open. May I have your name?`;
  }

  // -------------------------------------------------------------
  // Combined Day + Time + Doctor query
  // -------------------------------------------------------------
  if (
    (lower.includes('kal') || lower.includes('कल') || lower.includes('tomorrow')) &&
    (lower.includes('around 6') || lower.includes('6') || lower.includes('office ke baad') || lower.includes('evening')) &&
    (lower.includes('doctor') || lower.includes('available') || lower.includes('milenge'))
  ) {
    if (language === 'hi') {
      return `हाँ, कल शाम छह बजे स्लॉट मिल जाएगा। किस डॉक्टर से मिलना है?`;
    }
    if (language === 'hinglish') {
      return `हाँ, कल 6 PM slot open है। किस doctor से मिलना है?`;
    }
    return `Sure, 6 PM tomorrow is open. Which doctor would you like to see?`;
  }

  // -------------------------------------------------------------
  // Initial Greeting (Hello / Hi / Namaste)
  // -------------------------------------------------------------
  if (
    lower === 'hello' ||
    lower === 'hi' ||
    lower === 'hey' ||
    lower === 'हैलो' ||
    lower === 'हेलो' ||
    lower === 'नमस्ते' ||
    lower === 'नमस्कार' ||
    lower === 'good morning' ||
    lower === 'good afternoon' ||
    lower === 'good evening' ||
    lower === 'hello ji' ||
    lower === 'namaste'
  ) {
    switch (language) {
      case 'hi':
        return `नमस्ते, मैक्स डेंटल क्लिनिक। बताइए, मैं क्या मदद करूँ?`;
      case 'hinglish':
        return `Hello, Max Dental Clinic. बताइए, क्या help करूँ?`;
      case 'pa':
        return `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਜੀ, ਮੈਕਸ ਡੈਂਟਲ ਕਲੀਨਿਕ। ਦੱਸੋ ਜੀ ਕੀ ਮਦਦ ਕਰਾਂ?`;
      case 'ur':
        return `السلام علیکم، میکس ڈینٹل کلینک। فرمائیے کیا مدد کروں؟`;
      case 'bn':
        return `নমস্কার, ম্যাক্স ডেন্টাল ক্লিনিক। বলুন, কীভাবে সাহায্য করতে পারি?`;
      default:
        return `Hello, Max Dental Clinic. How can I help you?`;
    }
  }

  // -------------------------------------------------------------
  // Phone Number Provided (10-digits) -> Confirmation
  // -------------------------------------------------------------
  if (extracted.phone || /\b[6-9]\d{9}\b/.test(userMessage)) {
    switch (language) {
      case 'hi':
        return `धन्यवाद ${nameSuffix}! आपकी appointment कल शाम पाँच बजे कन्फर्म है।`;
      case 'hinglish':
        return `Perfect ${nameSuffix}! आपकी appointment confirm हो गई है।`;
      default:
        return `Perfect ${currentName || ''}! Your appointment is confirmed for tomorrow at 5 PM.`;
    }
  }

  // -------------------------------------------------------------
  // Doctor Availability Query
  // -------------------------------------------------------------
  if (
    lower.includes('कौन सा डॉक्टर') ||
    lower.includes('कौन डॉक्टर') ||
    lower.includes('डॉक्टर कब') ||
    lower.includes('doctor available') ||
    lower.includes('kaun sa doctor') ||
    lower.includes('who is the doctor') ||
    lower.includes('doctor timing') ||
    (lower.includes('doctor') && (lower.includes('aaj') || lower.includes('आज') || lower.includes('available') || lower.includes('sharma') || lower.includes('kal') || lower.includes('कल')))
  ) {
    switch (language) {
      case 'hi':
        return `हाँ, डॉ. शर्मा कल दोपहर दो से रात आठ बजे तक उपलब्ध हैं। किस समय आना चाहेंगे?`;
      case 'hinglish':
        return `हाँ, Dr. Sharma कल available हैं। किस time पर आना चाहेंगे?`;
      default:
        return `Yes, Dr. Sharma is available tomorrow from 2 to 8 PM. What time suits you?`;
    }
  }

  // -------------------------------------------------------------
  // Emergency / Tooth Pain
  // -------------------------------------------------------------
  if (
    lower.includes('दर्द') ||
    lower.includes('pain') ||
    lower.includes('toothache') ||
    lower.includes('dard') ||
    lower.includes('emergency') ||
    lower.includes('सूजन')
  ) {
    switch (language) {
      case 'hi':
        return `हाँ, दर्द के लिए आज शाम का स्लॉट मिल जाएगा। आपका नाम क्या है?`;
      case 'hinglish':
        return `हाँ, tooth pain के लिए आज शाम slot open है। आपका नाम?`;
      default:
        return `We have an emergency slot open this evening. May I have your name?`;
    }
  }

  // -------------------------------------------------------------
  // Pricing: Root Canal
  // -------------------------------------------------------------
  if (lower.includes('root canal') || lower.includes('रूट कैनाल') || lower.includes('rct')) {
    switch (language) {
      case 'hi':
        return `रूट कैनाल साढ़े चार हज़ार रुपये से शुरू होता है। क्या चेकअप का समय तय करूँ?`;
      case 'hinglish':
        return `Root canal starts at ₹4,500. क्या कल का slot book करूँ?`;
      default:
        return `Root canal starts at ₹4,500. Would you like to schedule a checkup?`;
    }
  }

  // -------------------------------------------------------------
  // Pricing: Teeth Cleaning / Scaling
  // -------------------------------------------------------------
  if (lower.includes('cleaning') || lower.includes('क्लीनिंग') || lower.includes('scaling') || lower.includes('सफाई')) {
    switch (language) {
      case 'hi':
        return `टीथ क्लीनिंग अठारह सौ रुपये की है। किस दिन आना चाहेंगे?`;
      case 'hinglish':
        return `Teeth cleaning is ₹1,800. किस दिन आना चाहेंगे?`;
      default:
        return `Teeth cleaning is ₹1,800. What day works for you?`;
    }
  }

  // -------------------------------------------------------------
  // General Pricing & Consultation
  // -------------------------------------------------------------
  if (
    lower.includes('price') ||
    lower.includes('cost') ||
    lower.includes('charge') ||
    lower.includes('fees') ||
    lower.includes('kitna') ||
    lower.includes('kharcha') ||
    lower.includes('फीस') ||
    lower.includes('खर्च')
  ) {
    switch (language) {
      case 'hi':
        return `डॉक्टर कंसल्टेशन फीस आठ सौ रुपये है। क्या appointment book करूँ?`;
      case 'hinglish':
        return `Doctor consultation fee ₹800 है। क्या appointment book करूँ?`;
      default:
        return `Doctor consultation fee is ₹800. Would you like to book a slot?`;
    }
  }

  // -------------------------------------------------------------
  // Date / Time Slot Offered or Selected (e.g. "5 baje", "kal sham", "tomorrow")
  // -------------------------------------------------------------
  if (
    lower.includes('kal') ||
    lower.includes('कल') ||
    lower.includes('aaj') ||
    lower.includes('आज') ||
    lower.includes('tomorrow') ||
    lower.includes('today') ||
    lower.includes('evening') ||
    lower.includes('morning') ||
    lower.includes('shyam') ||
    lower.includes('sham') ||
    lower.includes('subah') ||
    lower.includes('baje') ||
    lower.includes('बजे') ||
    lower.includes('pm') ||
    lower.includes('am') ||
    /^\s*\d{1,2}\s*(?:baje|बजे|pm|am)?\s*$/i.test(lower)
  ) {
    const slotLabel = currentDate === 'tomorrow' || lower.includes('kal') || lower.includes('कल') || lower.includes('tomorrow') ? 'कल' : 'आज';
    const timeLabel = currentTime || 'शाम पाँच बजे';

    if (currentName) {
      switch (language) {
        case 'hi':
          return `ठीक है ${currentName} जी, ${slotLabel} ${timeLabel}। अपना मोबाइल नंबर बता दीजिए?`;
        case 'hinglish':
          return `ठीक है ${currentName} ji, ${slotLabel} ${timeLabel}। आपका mobile number?`;
        default:
          return `Noted ${currentName}, ${slotLabel} at ${timeLabel}. Your mobile number, please?`;
      }
    } else {
      switch (language) {
        case 'hi':
          return `ठीक है, ${slotLabel} ${timeLabel}। आपका नाम क्या है?`;
        case 'hinglish':
          return `ठीक है, ${slotLabel} ${timeLabel}। May I have your name?`;
        default:
          return `Noted for ${slotLabel} at ${timeLabel}. May I have your name?`;
      }
    }
  }

  // -------------------------------------------------------------
  // Name Introduction
  // -------------------------------------------------------------
  if (extracted.name || lower.includes('मेरा नाम') || lower.includes('my name')) {
    const name = extracted.name || currentName || '';
    switch (language) {
      case 'hi':
        return `नमस्ते ${name} जी! कल सुबह या शाम, किस समय आना चाहेंगे?`;
      case 'hinglish':
        return `Namaste ${name} ji! कल morning या evening, किस time आना चाहेंगे?`;
      default:
        return `Hello ${name}! Would morning or evening work better for you?`;
    }
  }

  // -------------------------------------------------------------
  // Human Transfer Request
  // -------------------------------------------------------------
  if (lower.includes('human') || lower.includes('manager') || lower.includes('person') || lower.includes('इंसान') || lower.includes('transfer')) {
    switch (language) {
      case 'hi':
        return `हाँ, बिल्कुल। मैं अभी आपकी कॉल मैनेजर को कनेक्ट करती हूँ।`;
      case 'hinglish':
        return `Sure, मैं अभी call manager को connect करती हूँ।`;
      default:
        return `Sure, connecting you to our clinic manager right now.`;
    }
  }

  // -------------------------------------------------------------
  // Location & Parking
  // -------------------------------------------------------------
  if (lower.includes('location') || lower.includes('address') || lower.includes('kahan') || lower.includes('पता') || lower.includes('parking') || lower.includes('पार्किंग')) {
    switch (language) {
      case 'hi':
        return `क्लिनिक वसंत विहार मार्केट में है और पार्किंग उपलब्ध है। क्या appointment book करूँ?`;
      case 'hinglish':
        return `Clinic Vasant Vihar market mein hai with parking. क्या visit book करूँ?`;
      default:
        return `We are in Vasant Vihar market with parking. Would you like to book a visit?`;
    }
  }

  // -------------------------------------------------------------
  // Timings
  // -------------------------------------------------------------
  if (lower.includes('timing') || lower.includes('open') || lower.includes('close') || lower.includes('समय') || lower.includes('खुला')) {
    switch (language) {
      case 'hi':
        return `क्लिनिक सुबह 10 से रात 9 बजे तक खुला रहता है। किस समय आना चाहेंगे?`;
      case 'hinglish':
        return `Clinic 10 AM se 9 PM tak open hai. किस time आना चाहेंगे?`;
      default:
        return `We are open 10 AM to 9 PM daily. What time would you prefer?`;
    }
  }

  // -------------------------------------------------------------
  // General Booking Request
  // -------------------------------------------------------------
  if (lower.includes('appointment') || lower.includes('book') || lower.includes('अपॉइंटमेंट') || lower.includes('मिलना')) {
    if (currentName) {
      switch (language) {
        case 'hi':
          return `जी ${currentName} जी, कल सुबह या शाम, किस समय आना चाहेंगे?`;
        case 'hinglish':
          return `Sure ${currentName} ji, कल morning या evening, किस time आना चाहेंगे?`;
        default:
          return `Sure ${currentName}, would morning or evening suit you tomorrow?`;
      }
    } else {
      switch (language) {
        case 'hi':
          return `हाँ, बिल्कुल। आपका नाम क्या है?`;
        case 'hinglish':
          return `Sure, बिल्कुल। May I know your name?`;
        default:
          return `Sure, I can book that. May I have your name?`;
      }
    }
  }

  // -------------------------------------------------------------
  // Thanks / Courtesy
  // -------------------------------------------------------------
  if (lower.includes('thank') || lower.includes('dhanyawad') || lower.includes('धन्यवाद') || lower.includes('शुक्रिया') || lower.includes('bye')) {
    switch (language) {
      case 'hi':
        return `आपका बहुत-बहुत धन्यवाद! अपना ध्यान रखिएगा।`;
      case 'hinglish':
        return `Thank you so much! Take care.`;
      default:
        return `You are welcome! Have a great day.`;
    }
  }

  // -------------------------------------------------------------
  // Default Short Natural Receptionist Fallback (5-8 words)
  // -------------------------------------------------------------
  switch (language) {
    case 'hi':
      return `जी, बताइए। मैं क्या मदद कर सकती हूँ?`;
    case 'hinglish':
      return `जी, बताइए। क्या help कर सकती हूँ?`;
    case 'pa':
      return `ਜੀ, ਦੱਸੋ ਮੈਂ ਕੀ ਮਦਦ ਕਰ ਸਕਦੀ ਹਾਂ?`;
    case 'ur':
      return `جی، فرمائیے میں کیا مدد کر سکتی ہوں؟`;
    case 'bn':
      return `বলুন, আমি কীভাবে সাহায্য করতে পারি?`;
    default:
      return `Sure. How can I help you?`;
  }
}
