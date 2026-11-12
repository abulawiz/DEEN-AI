import { TopicClassificationResult } from '../types';

// Curated Islamic topics suggested to users when an off-topic request is submitted
export const SUGGESTED_ISLAMIC_TOPICS = [
  'How to achieve Khushu\' (focus) in daily Salah',
  'The conditions and nullifiers of Wudu and Tayammum',
  'The virtue and Tafsir of Ayat al-Kursi (Surah Al-Baqarah 2:255)',
  'Differences between Major Shirk and Minor Shirk (Ar-Riya\')',
  'The rights of parents (Birr al-Walidayn) in Islam',
  'Authentic Morning & Evening Adhkar according to the Sunnah',
  'Islamic rulings on business ethics, contracts, and Riba',
  'The status of Hadith sciences: how Sahih narrations are verified',
  'Islamic principles for raising righteous children in modern society',
  'Repentance (Tawbah): Its conditions and Allah\'s infinite mercy'
];

// Keywords strongly indicating Islamic domains
const ISLAMIC_LEXICON = [
  // Core theological & Quranic terms
  'allah', 'god', 'quran', 'qur\'an', 'koran', 'surah', 'ayah', 'ayat', 'tafsir',
  'hadith', 'hadeeth', 'sunnah', 'prophet', 'muhammad', 'rasulullah', 'sahabah',
  'companion', 'salaf', 'aqeedah', 'iman', 'islam', 'muslim', 'muslimah', 'tawheed',
  'tauhid', 'shirk', 'kufr', 'nifaq', 'dunya', 'akhirah', 'jannah', 'jahannam',
  'paradise', 'hellfire', 'angels', 'jibreel', 'qadar', 'destiny', 'resurrection',
  
  // Fiqh & Worship
  'fiqh', 'salah', 'salat', 'namaz', 'prayer', 'wudu', 'ablution', 'ghusl', 'tayammum',
  'zakat', 'zakah', 'sadaqah', 'charity', 'sawm', 'fasting', 'ramadan', 'taraweeh',
  'hajj', 'umrah', 'qiblah', 'kaaba', 'masjid', 'mosque', 'athan', 'adhaan', 'iqamah',
  'imam', 'jummah', 'jumuah', 'friday prayer', 'tashahhud', 'sujud', 'ruku', 'rakah',
  
  // Halal, Haram & Ethics
  'halal', 'haram', 'makruh', 'mustahabb', 'mubah', 'waajib', 'fard', 'fatwa', 'ruling',
  'shariah', 'riba', 'interest', 'usury', 'pork', 'alcohol', 'khamr', 'slaughter', 'zabiha',
  'zina', 'modesty', 'haya', 'hijab', 'niqab', 'awrah', 'chastity', 'adab', 'akhlaq',
  'character', 'manners', 'honesty', 'patience', 'sabr', 'shukr', 'tawakkul', 'istighfar',
  'repentance', 'tawbah', 'du\'a', 'dua', 'supplication', 'adhkar', 'dhikr', 'tasbeeh',
  
  // Family, Marriage & Society
  'nikah', 'marriage', 'husband', 'wife', 'spouse', 'divorce', 'talaq', 'khula', 'iddah',
  'mahr', 'dowry', 'parents', 'mother', 'father', 'birr', 'children', 'parenting',
  'inheritance', 'mirath', 'orphan', 'kinship', 'silat ar-rahim', 'neighbor',
  
  // History & Figures
  'seerah', 'bukhari', 'muslim', 'tirmidhi', 'abu dawud', 'nasai', 'ibn majah',
  'ibn kathir', 'as-sadi', 'nawawi', 'abu bakr', 'umar', 'uthman', 'ali', 'aisha',
  'khadijah', 'fatima', 'bilal', 'mecca', 'makkah', 'medina', 'madinah', 'hijrah',
  
  // Modern Context / Islamic Perspective
  'islamic perspective', 'ruling on', 'is it permissible', 'is it halal', 'is it haram',
  'what does islam say', 'in the light of quran', 'according to sunnah', 'scholar view',
  'islamic banking', 'crypto in islam', 'ai in islam', 'medical ethics in islam',
  'organ donation in islam', 'cosmetics in islam', 'tattoos in islam', 'music in islam',
  'finance in islam', 'halal investment', 'insurance in islam',

  // Arabic Terms and Lexicon
  'الله', 'قرآن', 'القرآن', 'سورة', 'آية', 'تفسير', 'حديث', 'الحديث', 'سنة', 'السنة',
  'نبي', 'محمد', 'رسول', 'رسول الله', 'توحيد', 'التوحيد', 'عقيدة', 'العقيدة', 'إيمان',
  'إسلام', 'صلاة', 'الصلاة', 'زكاة', 'صوم', 'رمضان', 'حج', 'عمرة', 'وضوء', 'غسل',
  'حلال', 'حرام', 'شرع', 'شريعة', 'فقه', 'دعاء', 'أذكار', 'ذكر', 'استغفار', 'توبة',
  'سلف', 'البخاري', 'مسلم', 'الترمذي', 'ابن كثير', 'السعدي', 'بر الوالدين'
];

// Patterns clearly representing off-topic non-Islamic requests
const NON_ISLAMIC_PATTERNS = [
  // General programming & coding help unrelated to religion
  /\b(write|create|debug|fix|build)\s+(a\s+)?(python|javascript|typescript|c\+\+|java|react|html|css|php|rust|go|sql)\s+(code|script|app|program|website|scraper|crawler|function|api)\b/i,
  /\b(leetcode|codeforces|hackerrank|npm error|runtime error|webpack|dockerfile|kubernetes|bash script)\b/i,
  
  // Sports betting and predictions
  /\b(betting|bet|odds|gambling|prediction|who will win|match score|fifa world cup|premier league|champions league|nba|super bowl)\b/i,
  
  // Celebrity gossip & pop entertainment
  /\b(celebrity|hollywood|bollywood|k-pop|bts|grammys|oscars|dating rumor|gossip|box office|latest movie plot|netflix series)\b/i,
  
  // Partisan political campaign / unrelated worldly conflicts
  /\b(presidential election|who should i vote for|democrat|republican|labour party|tory party|political campaign)\b/i,
  
  // General homework / essays on non-religious topics
  /\b(write an essay about photosynthesis|solve this calculus|quadratic equation|physics homework|chemistry formula)\b/i,
  
  // Video games / general gaming
  /\b(fortnite|gta|call of duty|minecraft|playstation|xbox|nintendo|game cheat)\b/i
];

// Emergency & safety keywords (must receive compassionate Islamic safety response, not blunt block)
const EMERGENCY_PATTERNS = [
  /\b(kill myself|commit suicide|end my life|want to die|suicidal|hopeless|cut myself|self-harm|someone is beating me|in danger|call police)\b/i
];

export const classifyIslamicTopic = (prompt: string): TopicClassificationResult => {
  const normalized = prompt.trim().toLowerCase();

  // 1. Check for emergency / distress / self-harm
  for (const pattern of EMERGENCY_PATTERNS) {
    if (pattern.test(normalized)) {
      return {
        is_islamic: true,
        confidence: 0.99,
        is_emergency: true,
        matched_category: 'Emergency & Islamic Life Sanctity',
        suggested_islamic_topics: SUGGESTED_ISLAMIC_TOPICS.slice(0, 3)
      };
    }
  }

  // 2. Explicit Non-Islamic check via regex rules
  for (const pattern of NON_ISLAMIC_PATTERNS) {
    // If the prompt matches a non-Islamic pattern and DOES NOT specifically ask for an Islamic ruling or perspective
    const asksIslamicRuling = /\b(islam|halal|haram|permissible|ruling|shariah|quran|sunnah|muslim)\b/i.test(normalized);
    if (pattern.test(normalized) && !asksIslamicRuling) {
      return {
        is_islamic: false,
        confidence: 0.95,
        matched_category: 'Unrelated Worldly Topic',
        reason: 'This request pertains to general programming, sports, entertainment, or secular topics outside Islamic sciences.',
        suggested_islamic_topics: SUGGESTED_ISLAMIC_TOPICS.slice(0, 3)
      };
    }
  }

  // 3. Count Islamic lexicon occurrences
  let islamicTokensCount = 0;
  for (const token of ISLAMIC_LEXICON) {
    if (normalized.includes(token)) {
      islamicTokensCount++;
    }
  }

  // 4. Greetings check
  const isGreeting = /^(assalamu\s+alaikum|as-salamu\s+alaykum|salam|peace be upon you|marhaban|ahlan|bismillah)/i.test(normalized);
  if (isGreeting && (normalized.length < 50 || islamicTokensCount > 0)) {
    return {
      is_islamic: true,
      confidence: 0.98,
      matched_category: 'Islamic Greeting & Adab',
      suggested_islamic_topics: SUGGESTED_ISLAMIC_TOPICS.slice(0, 3)
    };
  }

  // 5. If query contains Islamic terms, classify as Islamic
  if (islamicTokensCount >= 1) {
    return {
      is_islamic: true,
      confidence: Math.min(0.6 + islamicTokensCount * 0.15, 0.99),
      matched_category: 'Authentic Islamic Knowledge',
      suggested_islamic_topics: SUGGESTED_ISLAMIC_TOPICS.slice(0, 3)
    };
  }

  // 6. Generic or ambiguous questions (e.g. "What is the weather?", "Tell me a joke", "Who is Elon Musk?")
  const isGenericWorldly = /\b(weather|joke|elon musk|stock market|cryptocurrency price|crypto price|sing a song|recipe for pizza|movie recommendation)\b/i.test(normalized);
  if (isGenericWorldly || normalized.length < 8) {
    return {
      is_islamic: false,
      confidence: 0.88,
      matched_category: 'General Worldly Conversation',
      reason: 'This query does not contain any religious, spiritual, ethical, or Islamic context.',
      suggested_islamic_topics: SUGGESTED_ISLAMIC_TOPICS.slice(0, 3)
    };
  }

  // Default: if it's an ethical, life, advice, or existential question, interpret generously in an Islamic light
  return {
    is_islamic: true,
    confidence: 0.70,
    matched_category: 'Everyday Life & Islamic Guidance',
    suggested_islamic_topics: SUGGESTED_ISLAMIC_TOPICS.slice(0, 3)
  };
};

export const getViolationMessage = (violationCount: number): {
  title: string;
  message: string;
  actionTaken: string;
  isRestricted: boolean;
  timeoutMinutes?: number;
} => {
  if (violationCount === 1) {
    return {
      title: 'Islamic Scope Reminder',
      message: 'Assalamu Alaikum. DEEN AI is strictly dedicated to authentic Islamic knowledge, Qur\'an, Sunnah, and recognized scholarly guidance according to the Salaf as-Salih. Please keep your inquiries focused on religious, ethical, and Islamic subjects.',
      actionTaken: '1st Violation: Polite Educational Warning',
      isRestricted: false
    };
  } else if (violationCount === 2) {
    return {
      title: 'Second Notice: Islamic Topic Restriction',
      message: 'Notice: DEEN AI operates exclusively as an Islamic companion platform. Non-Islamic inquiries regarding entertainment, coding, secular sports, or general worldly matters are prohibited. Repeated off-topic inquiries will trigger temporary access restrictions.',
      actionTaken: '2nd Violation: Formal Policy Reminder',
      isRestricted: false
    };
  } else if (violationCount === 3) {
    return {
      title: 'Temporary Message Restriction',
      message: 'Your ability to send messages has been temporarily paused for 15 minutes due to repeated submissions outside DEEN AI\'s Islamic scope. You may still browse the Holy Qur\'an, Hadith collections, and the Learning Centre.',
      actionTaken: '3rd Violation: 15-Minute Temporary Message Lockout',
      isRestricted: true,
      timeoutMinutes: 15
    };
  } else {
    return {
      title: 'Account Flagged for Review',
      message: 'Your account has been flagged for administrative review due to excessive policy violations. If you believe this occurred in error or wish to appeal, you may submit an appeal directly to the administration below.',
      actionTaken: '4th+ Violation: Flagged for Administrator Review',
      isRestricted: true,
      timeoutMinutes: 1440 // 24 hours
    };
  }
};
