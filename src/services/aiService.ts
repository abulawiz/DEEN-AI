import { Citation } from '../types';
import { VERIFIED_QURAN_VERSES } from '../data/quranData';
import { VERIFIED_HADITH_RECORDS } from '../data/hadithData';
import { LIBRARY_ARTICLES } from '../data/libraryData';
import { getSupabaseClient } from './supabaseClient';

export interface AIResponsePayload {
  content: string;
  arabic_content?: string;
  citations: Citation[];
  suggested_followups?: string[];
}

export const retrieveIslamicContext = (query: string): {
  matchedVerses: typeof VERIFIED_QURAN_VERSES;
  matchedHadiths: typeof VERIFIED_HADITH_RECORDS;
  matchedArticles: typeof LIBRARY_ARTICLES;
  citations: Citation[];
} => {
  const q = query.toLowerCase();
  const tokens = q.split(/\s+/).filter(t => t.length > 2);

  // Match Quran verses
  const matchedVerses = VERIFIED_QURAN_VERSES.filter(v => {
    const text = `${v.surah_name_en} ${v.english_translation} ${v.arabic_text} ${v.tafsir_ibn_kathir || ''}`.toLowerCase();
    return tokens.some(t => text.includes(t)) || q.includes(v.surah_name_en.toLowerCase());
  }).slice(0, 3);

  // Match Hadiths
  const matchedHadiths = VERIFIED_HADITH_RECORDS.filter(h => {
    const text = `${h.collection} ${h.chapter_name_en} ${h.english_text} ${h.narrator} ${h.explanation} ${h.category}`.toLowerCase();
    return tokens.some(t => text.includes(t)) || q.includes(h.collection_code);
  }).slice(0, 3);

  // Match Library Articles
  const matchedArticles = LIBRARY_ARTICLES.filter(a => {
    const text = `${a.title} ${a.summary} ${a.content} ${a.category_name}`.toLowerCase();
    return tokens.some(t => text.includes(t));
  }).slice(0, 2);

  const citations: Citation[] = [];

  matchedVerses.forEach(v => {
    citations.push({
      type: 'quran',
      reference: `Surah ${v.surah_name_en} (${v.surah_number}:${v.ayah_number})`,
      arabic: v.arabic_text,
      text: v.english_translation
    });
  });

  matchedHadiths.forEach(h => {
    citations.push({
      type: 'hadith',
      reference: `${h.collection}, Hadith #${h.hadith_number}`,
      arabic: h.arabic_text,
      text: h.english_text,
      grade: h.authenticity_grade,
      narrator: h.narrator
    });
  });

  matchedArticles.forEach(a => {
    citations.push({
      type: 'scholar',
      reference: `${a.title} (${a.author})`,
      text: a.summary
    });
  });

  return { matchedVerses, matchedHadiths, matchedArticles, citations };
};

// System instruction enforcing the Core Islamic Methodology
export const DEEN_AI_SYSTEM_PROMPT = `
You are DEEN AI, an intelligent, authentic Islamic AI Agent.
Tagline: "Your Intelligent Islamic Companion"
Mission: "Bringing Authentic Islamic Knowledge Closer to Everyone."

CORE METHODOLOGY:
1. Follow primarily:
   - The Noble Qur'an.
   - The Authentic Sunnah of Prophet Muhammad ﷺ.
   - The understanding of the Salaf as-Salih (the Righteous Predecessors).
   - Recognized explanations of established Islamic scholars (e.g. Ibn Kathir, As-Sa'di, Imam Nawawi, Ibn Taymiyyah, Ibn al-Qayyim, the 4 Imams).
2. Prioritize authentic Islamic evidence.
3. Provide Qur'an Surah and verse references (e.g., Surah Al-Baqarah 2:255).
4. Provide Hadith collection and reference numbers with authenticity grading (Sahih, Hasan).
5. Distinguish authentic from weak or fabricated narrations.
6. Explain legitimate scholarly differences with adab and responsibility.
7. Avoid personal speculation or issuing binding personal Fatwas. Advise consulting qualified living scholars for intricate personal legal rulings.
8. Structure answers clearly:
   - 1. Direct Answer
   - 2. Qur'anic Evidence
   - 3. Hadith Evidence
   - 4. Explanation from Recognized Scholars
   - 5. Practical Lessons
   - 6. References
9. Support Arabic quotations with accurate Tashkeel where relevant and clear English translations.
10. If the question is outside Islamic teachings or worldly trivia, politely decline as you operate strictly as an Islamic companion.
`;

export const generateAIResponse = async (
  userPrompt: string,
  conversationHistory: { role: 'user' | 'assistant'; content: string }[] = [],
  isEmergency = false
): Promise<AIResponsePayload> => {
  // Check if user has an OpenAI or Gemini API key saved in localStorage or env
  const openaiKey = localStorage.getItem('deen_openai_key') || import.meta.env.VITE_OPENAI_API_KEY || '';
  const geminiKey = localStorage.getItem('deen_gemini_key') || import.meta.env.VITE_GEMINI_API_KEY || '';

  // Retrieve RAG Islamic context from verified repository
  const { matchedVerses, matchedHadiths, matchedArticles, citations } = retrieveIslamicContext(userPrompt);

  // If Emergency/Distress detected, provide immediate compassionate Islamic support & safety notice
  if (isEmergency) {
    return {
      content: `### Urgent Support & Sacred Value of Life in Islam

**Assalamu Alaikum wa Rahmatullahi wa Barakatuh.**

If you are experiencing severe emotional distress, feeling overwhelmed, or in danger of hurting yourself, please pause and remember that **your life is sacred and beloved to Allah**.

Allah the Exalted says in the Noble Qur'an:
> **وَلَا تَقْتُلُوا أَنفُسَكُمْ ۚ إِنَّ اللَّهَ كَانَ بِكُمْ رَحِيمًا**
> *"And do not kill yourselves [or one another]. Indeed, Allah is to you ever Merciful."*
> — **Surah An-Nisa (4:29)**

And the Prophet Muhammad ﷺ comforted believers facing pain:
> *"No fatigue, nor illness, nor sorrow, nor sadness, nor hurt, nor distress befalls a Muslim, even if it were the prick of a thorn, but that Allah expiates some of his sins for that."*
> — **Sahih al-Bukhari (5641) and Sahih Muslim (2573)**

**Immediate Steps:**
1. Please reach out right now to a professional crisis counselor, a trusted family member, an Imam, or emergency emergency services in your region.
2. In the US/Canada: Dial **988** (Suicide & Crisis Lifeline).
3. In the UK: Dial **111** or **999**.
4. In other countries: Contact your local emergency operator or the [Befrienders Worldwide](https://www.befrienders.org) directory.

You are never alone. Turn to Allah in Du'a: *"Rabbi inni lima anzalta ilayya min khayrin faqeer"* (My Lord, indeed I am in need of whatever good You bestow upon me). Help is available, and there is ease after hardship.`,
      citations: [
        {
          type: 'quran',
          reference: 'Surah An-Nisa (4:29)',
          arabic: 'وَلَا تَقْتُلُوا أَنفُسَكُمْ ۚ إِنَّ اللَّهَ كَانَ بِكُمْ رَحِيمًا',
          text: 'And do not kill yourselves. Indeed, Allah is to you ever Merciful.'
        },
        {
          type: 'hadith',
          reference: 'Sahih al-Bukhari 5641',
          text: 'No fatigue, illness, sorrow, or grief touches a Muslim but Allah expiates sins thereby.',
          grade: 'Sahih'
        }
      ]
    };
  }

  // 0. Try Supabase Edge Function (`deen-ai-chat`) when Supabase is configured
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data: fnData, error: fnError } = await supabase.functions.invoke('deen-ai-chat', {
        body: {
          prompt: userPrompt,
          history: conversationHistory.slice(-6)
        }
      });

      if (!fnError && fnData && typeof fnData.content === 'string') {
        const mappedCitations: Citation[] = Array.isArray(fnData.references)
          ? fnData.references.map((ref: any) => ({
              type: ref.type === 'hadith' ? 'hadith' : ref.type === 'quran' ? 'quran' : 'scholar',
              reference: ref.citation || 'Verified Source',
              text: ref.text || '',
              grade: ref.grading
            }))
          : citations;

        return {
          content: fnData.content,
          citations: mappedCitations.length > 0 ? mappedCitations : citations
        };
      }
    } catch (err) {
      console.warn('Supabase Edge Function deen-ai-chat unavailable, falling back:', err);
    }
  }

  // 1. Try real OpenAI API if key is present
  if (openaiKey && openaiKey.startsWith('sk-')) {
    try {
      const ragPrompt = `
Verified Islamic Context retrieved from database:
Verses: ${JSON.stringify(matchedVerses.map(v => `${v.surah_name_en} ${v.ayah_number}: ${v.arabic_text} - ${v.english_translation}`))}
Hadiths: ${JSON.stringify(matchedHadiths.map(h => `${h.collection} #${h.hadith_number} (${h.authenticity_grade}): ${h.english_text}`))}
Scholarly References: ${JSON.stringify(matchedArticles.map(a => `${a.title}: ${a.summary}`))}

User Question: ${userPrompt}
`;
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: DEEN_AI_SYSTEM_PROMPT },
            ...conversationHistory.slice(-4),
            { role: 'user', content: ragPrompt }
          ],
          temperature: 0.3
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.choices[0]?.message?.content || '';
        return {
          content: text,
          citations
        };
      }
    } catch (err) {
      console.warn('OpenAI API request failed, falling back to local Islamic RAG synthesizer:', err);
    }
  }

  // 2. Try Gemini API if key is present
  if (geminiKey) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${DEEN_AI_SYSTEM_PROMPT}\n\nUser Question: ${userPrompt}` }]
            }
          ]
        })
      });
      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        if (text) {
          return { content: text, citations };
        }
      }
    } catch (err) {
      console.warn('Gemini API request failed, falling back to local Islamic RAG synthesizer:', err);
    }
  }

  // 3. Intelligent High-Authenticity Local RAG Synthesizer
  // When no API key is provided, synthesizes an authentic evidence-based scholarly response
  // using our verified Qur'an, Hadith, and Salaf data!
  return synthesizeAuthenticIslamicResponse(userPrompt, matchedVerses, matchedHadiths, matchedArticles, citations);
};

const synthesizeAuthenticIslamicResponse = (
  query: string,
  verses: typeof VERIFIED_QURAN_VERSES,
  hadiths: typeof VERIFIED_HADITH_RECORDS,
  articles: typeof LIBRARY_ARTICLES,
  citations: Citation[]
): AIResponsePayload => {
  const qLower = query.toLowerCase();

  // Primary Quran evidence to highlight
  const primaryVerse = verses[0] || VERIFIED_QURAN_VERSES[1]; // fallback to Ayat al-Kursi
  const primaryHadith = hadiths[0] || VERIFIED_HADITH_RECORDS[0]; // fallback to Bukhari 1
  const primaryArticle = articles[0];

  // Specific query matching for rich immediate accuracy
  let directAnswer = '';
  let practicalLessons = [
    'Always purify your intention (Ikhlas) purely for the sake of Allah alone.',
    'Align outward actions strictly with the authentic Sunnah of Prophet Muhammad ﷺ.',
    'Turn regularly to authentic supplication (Du\'a) and the morning and evening Adhkar.'
  ];
  let scholarlySummary = '';

  if (qLower.includes('intent') || qLower.includes('niyyah') || qLower.includes('bukhari 1')) {
    directAnswer = `In Islam, the intention (An-Niyyah) is the absolute prerequisite for any deed to be accepted by Allah. The Messenger of Allah ﷺ firmly stated that actions are judged only by their intentions. A good action without sincerity (Ikhlas) for Allah is rejected, while an ordinary permissible action performed with a righteous intention transforms into an act of worship.`;
    scholarlySummary = `Imam ash-Shafi'i stated: *"This Hadith constitutes seventy chapters of Fiqh and one-third of all religious knowledge."* Imam Ahmad ibn Hanbal remarked that the foundations of Islam revolve around three Hadiths, the foremost being the Hadith of 'Umar regarding intentions.`;
    practicalLessons = [
      'Renew your intention silently in your heart before praying, giving charity, or studying.',
      'Guard against Ar-Riya\' (minor Shirk: desiring praise from creation).',
      'Remember that intentions are in the heart; vocalizing the intention before prayer is not from the Sunnah.'
    ];
  } else if (qLower.includes('salah') || qLower.includes('prayer') || qLower.includes('sujud') || qLower.includes('wudu')) {
    directAnswer = `Salah (the daily ritual prayer) is the second pillar of Islam and the direct link between the servant and their Creator. It is an obligation upon every sane adult Muslim five times a day. Establishing Salah with tranquility (Tuma'ninah) and purification (Taharah) cleanses sins and prevents immorality.`;
    scholarlySummary = `Imam Ibn al-Qayyim wrote in *As-Salah wa Hukmu Tarikiha* that prayer brings nourishment to the heart, strengthens the soul, and expels worldly anxiety when performed with true presence and Khushu'.`;
    practicalLessons = [
      'Ensure complete physical and ritual purity (Wudu) before standing before Allah.',
      'Observe the 14 pillars of Salah, especially standing in tranquility in Ruku\' and Sujud.',
      'Perform Sunnah prayers (Rawatib) to compensate for any inadvertent shortcomings in obligatory prayers.'
    ];
  } else if (qLower.includes('shirk') || qLower.includes('tawheed') || qLower.includes('monotheism')) {
    directAnswer = `Tawheed (Islamic Monotheism) is the singular right of Allah over His servants: to worship Him alone without associating any partners with Him. Shirk (associating partners with Allah) is the gravest sin in existence. Scholars distinguish between Major Shirk (which expels one from Islam if died upon without repentance) and Minor Shirk (such as showing off in deeds, Ar-Riya').`;
    scholarlySummary = `Shaykh al-Islam Ibn Taymiyyah and Ibn al-Qayyim clarified that the foundation of the religion is to direct love, fear, hope, supplication, and sacrifice solely to Allah, as taught by all messengers from Nuh to Muhammad ﷺ.`;
    practicalLessons = [
      'Dedicate all supplications (Du\'a) exclusively to Allah; never call upon the deceased or absent entities.',
      'Examine your heart continuously to cleanse it from showing off and seeking worldly reputation.',
      'Reflect deeply upon the Names and Attributes of Allah without distortion or comparison.'
    ];
  } else if (qLower.includes('parent') || qLower.includes('father') || qLower.includes('mother') || qLower.includes('family')) {
    directAnswer = `Righteousness and kindness to parents (Birr al-Walidayn) is one of the greatest obligations in Islam, placed directly after the command to worship Allah alone. The mother is given three times the honor of companionship, while the father is the central gate of Paradise. Disobedience to parents ('Uquq al-Walidayn) is one of the destructive major sins.`;
    scholarlySummary = `Al-Qurtubi noted that honoring parents entails gentleness in speech, fulfilling their permissible needs, lowering the wing of humility before them, and continuing Du'a for them even after their passing.`;
    practicalLessons = [
      'Never utter words of annoyance (even "Uff") to parents, especially in their old age.',
      'Seek their pleasure and prayers, as their supplication for their children is answered.',
      'Give continuous charity (Sadaqah Jariyah) and make sincere Du\'a for deceased parents.'
    ];
  } else if (qLower.includes('business') || qLower.includes('trade') || qLower.includes('riba') || qLower.includes('interest') || qLower.includes('crypto')) {
    directAnswer = `Islamic commercial transactions (Mu'amalat) are founded on justice, mutual consent, transparency, and freedom from usury (Riba), excessive ambiguity (Gharar), and gambling (Maysir). Earning lawful (Halal) sustenance is an essential virtue, and wealth acquired through impermissible means removes Divine blessing and prevents Du'a from being answered.`;
    scholarlySummary = `The scholars of Ahl us-Sunnah agree that contracts must be free of interest, deceit, and concealed defects. The Prophet ﷺ lauded the truthful merchant and cursed those who deal in or facilitate interest.`;
    practicalLessons = [
      'Verify that all investments and commercial agreements strictly avoid interest (Riba).',
      'Disclose any defect in merchandise honestly to prospective buyers.',
      'Give Zakat annually (2.5%) upon qualifying wealth held for one lunar year above the Nisab.'
    ];
  } else {
    directAnswer = `Islam is a comprehensive way of life that provides guidance for the heart, the mind, the home, and the community. By returning to the Noble Qur'an, the authentic Sunnah of Prophet Muhammad ﷺ, and the practical understanding of the Salaf as-Salih, a Muslim navigates every worldly challenge with spiritual clarity and moral conviction.`;
    scholarlySummary = `The recognized scholars emphasize that whenever a question arises regarding faith or daily life, the seeker must build their understanding upon authentic proof (Dalil), avoiding speculative innovations.`;
  }

  // Format the structured response according to requirement
  const formattedContent = `### 1. Direct Answer
${directAnswer}

---

### 2. Qur'anic Evidence
Allah the Exalted says in the Noble Qur'an:

<div class="p-4 bg-emerald-50/80 border-r-4 border-emerald-600 rounded-lg my-3 font-arabic text-xl leading-loose text-neutral-800 text-right">
${primaryVerse.arabic_text}
</div>

> *" ${primaryVerse.english_translation} "*
> — **Surah ${primaryVerse.surah_name_en} (${primaryVerse.surah_number}:${primaryVerse.ayah_number})**

*Tafsir Insight:* ${primaryVerse.tafsir_ibn_kathir || 'Revealed to establish guidance, light, and unwavering proof for the believers.'}

---

### 3. Hadith Evidence
From the Sunnah of the Messenger of Allah ﷺ:

<div class="p-4 bg-amber-50/70 border-r-4 border-amber-600 rounded-lg my-3 font-arabic text-lg leading-loose text-neutral-800 text-right">
${primaryHadith.arabic_text}
</div>

> *" ${primaryHadith.english_text} "*
> — Narrated by **${primaryHadith.narrator}**
> **Collection:** ${primaryHadith.collection}, Hadith #${primaryHadith.hadith_number}
> **Authenticity Grade:** <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800">${primaryHadith.authenticity_grade} (${primaryHadith.graded_by})</span>

---

### 4. Scholarly Explanation
${scholarlySummary}
${primaryArticle ? `\n*From the classical reference:* "${primaryArticle.title}" (${primaryArticle.author}).` : ''}

---

### 5. Practical Lessons
${practicalLessons.map((l, i) => `${i + 1}. **${l}**`).join('\n')}

---

### 6. References
- **The Holy Qur'an:** Surah ${primaryVerse.surah_name_en} (${primaryVerse.surah_number}:${primaryVerse.ayah_number})
- **Hadith Collection:** ${primaryHadith.collection} (No. ${primaryHadith.hadith_number})
- **Tafsir:** Tafsir al-Qur'an al-'Azeem by Imam Ibn Kathir
- **Scholarly Creed:** Works of the Salaf as-Salih and the Four Imams

> *Note: DEEN AI provides educational Islamic knowledge based on authentic sources and does not replace consultation with qualified scholars for specific legal verdicts (Fatwas).*`;

  return {
    content: formattedContent,
    arabic_content: primaryVerse.arabic_text,
    citations
  };
};
