// ============================================================
// DEEN AI — Supabase Edge Function: deen-ai-chat
// Enforces server-side Islamic Topic Classification,
// progressive user violation tracking, RAG retrieval from
// PostgreSQL, and LLM generation without exposing API keys.
//
// Deploy with:
//   supabase functions deploy deen-ai-chat
// Set secrets:
//   supabase secrets set OPENAI_API_KEY=... GEMINI_API_KEY=...
// ============================================================

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are DEEN AI — "Your Intelligent Islamic Companion", built by Abulawzat Digital Solution (Department of Computer Science).

CORE ISLAMIC METHODOLOGY:
1. Follow the Noble Qur'an, Authentic Sunnah of Prophet Muhammad ﷺ, understanding of the Salaf as-Salih, and recognized scholars (Ibn Kathir, As-Sa'di, Al-Bukhari, Muslim, Nawawi, Ibn Taymiyyah, Ibn Baz, Ibn Uthaymeen).
2. Prioritize authentic Islamic evidence with exact Surah:Verse and Hadith collection/number references.
3. Identify Hadith grading accurately (Sahih, Hasan, Da'if, Mawdu'). Never fabricate religious evidence.
4. Explain legitimate scholarly differences respectfully without presenting personal opinions as established rulings.
5. Recommend consulting qualified local scholars for complex personal rulings (fatwas), divorce, inheritance, or disputes.

ISLAMIC-ONLY RESTRICTION:
- Only answer Islamic topics or everyday life/safety/health/tech/family questions asked from an Islamic perspective.
- Politely decline unrelated entertainment, sports betting, celebrity gossip, general coding, or non-Islamic politics.
- Format detailed answers clearly with: Direct Answer, Qur'anic Evidence, Hadith Evidence, Scholarly Explanation, Practical Lessons, and References (keep simple questions concise).`;

const ISLAMIC_KEYWORDS = [
  'islam', 'muslim', 'allah', 'quran', "qur'an", 'surah', 'ayah', 'verse', 'tafsir',
  'hadith', 'sunnah', 'prophet', 'muhammad', 'pbuh', 'salaf', 'aqeedah', 'tawhid',
  'shirk', 'iman', 'fiqh', 'salah', 'salat', 'prayer', 'wudu', 'ghusl', 'zakah', 'zakat',
  'sawm', 'fasting', 'ramadan', 'hajj', 'umrah', 'halal', 'haram', 'makruh', 'dua', 'dhikr',
  'adhkar', 'nikah', 'marriage', 'divorce', 'talaq', 'parenting', 'parents', 'family',
  'inheritance', 'riba', 'interest', 'charity', 'sadaqah', 'jannah', 'jahannam', 'akhlaq',
  'manners', 'seerah', 'companions', 'sahabah', 'caliph', 'friday', 'jummah', 'masjid',
  'mosque', 'hijab', 'modesty', 'repentance', 'tawbah', 'istighfar', 'bismillah',
  'inshallah', 'alhamdulillah', 'subhanallah', 'assalamu', 'salam', 'scholar', 'fatwa',
  'islamic', 'shariah', 'sharia', 'angel', 'jinn', 'qadar', 'destiny', 'soul',
  'hereafter', 'death', 'funeral', 'janazah', 'eid', 'ummah', 'patience', 'sabr',
  'gratitude', 'shukr', 'trust', 'tawakkul', 'technology', 'ai', 'ethics', 'business',
  'food', 'meat', 'dhabihah', 'pork', 'alcohol', 'gambling', 'emergency', 'help', 'safety',
];

const UNRELATED_PATTERNS = [
  /\b(betting|odds|parlay|sportsbook|casino|poker|blackjack|lottery)\b/i,
  /\b(nfl|nba|premier league|champions league|world cup|fifa|goal scorer|fantasy football)\b/i,
  /\b(kardashian|celebrity gossip|taylor swift|hollywood|netflix|movie review|box office)\b/i,
  /\b(write.*(python|javascript|react|sql|html|css|c\+\+|java)\b|debug.*code|leetcode)\b/i,
  /\b(stock pick|crypto pump|memecoin|forex signal|day trading)\b/i,
  /\b(horoscope|zodiac|astrology|tarot)\b/i,
];

function classifyTopic(query: string): { allowed: boolean; category: string } {
  const lower = query.toLowerCase();
  for (const pattern of UNRELATED_PATTERNS) {
    if (pattern.test(lower)) {
      return { allowed: false, category: 'restricted_non_islamic' };
    }
  }
  const hasIslamic = ISLAMIC_KEYWORDS.some((kw) => lower.includes(kw));
  if (hasIslamic || lower.length <= 28) {
    return { allowed: true, category: 'islamic_knowledge' };
  }
  // If long query has zero Islamic terms and looks like general off-topic chatter
  const offTopicSignals = ['recipe for', 'video game', 'playstation', 'xbox', 'gta', 'minecraft', 'election poll', 'celebrity'];
  if (offTopicSignals.some((s) => lower.includes(s))) {
    return { allowed: false, category: 'unrelated_topic' };
  }
  return { allowed: true, category: 'islamic_guidance' };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

    const authHeader = req.headers.get('Authorization') ?? '';
    const supabaseUser = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey || anonKey);

    const { prompt, history = [], conversationId } = await req.json();
    if (!prompt || typeof prompt !== 'string') {
      return new Response(JSON.stringify({ error: 'Prompt is required.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Identify authenticated user if present
    const { data: authData } = await supabaseUser.auth.getUser();
    const userId = authData?.user?.id ?? null;

    // 1. Check account suspension / temporary restriction
    if (userId) {
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('id, full_name, is_suspended, restricted_until, violation_count')
        .eq('id', userId)
        .single();

      if (profile?.is_suspended) {
        return new Response(
          JSON.stringify({
            isRestricted: true,
            isIslamic: false,
            content:
              'Your account is currently suspended pending administrator review. Please submit an appeal from Settings if you believe this is an error.',
            references: [],
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (profile?.restricted_until && new Date(profile.restricted_until).getTime() > Date.now()) {
        const secs = Math.ceil((new Date(profile.restricted_until).getTime() - Date.now()) / 1000);
        return new Response(
          JSON.stringify({
            isRestricted: true,
            isIslamic: false,
            content: `Your messaging access is temporarily restricted for ${secs} more seconds due to repeated off-topic prompts.`,
            references: [],
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // 2. Islamic Topic Classification
    const classification = classifyTopic(prompt);
    if (!classification.allowed) {
      let violationLevel = 1;
      let warningText =
        'Assalamu Alaikum. DEEN AI is dedicated to authentic Islamic knowledge and guidance. I cannot assist with unrelated requests. You may ask me about Islamic teachings, Aqeedah, Fiqh, Qur\'an or Hadith.';

      if (userId) {
        const { data: prof } = await supabaseAdmin
          .from('profiles')
          .select('full_name, violation_count')
          .eq('id', userId)
          .single();

        violationLevel = (prof?.violation_count ?? 0) + 1;
        let actionTaken = 'polite_warning';
        let restrictedUntil: string | null = null;

        if (violationLevel === 2) {
          actionTaken = 'strong_reminder';
          warningText =
            'Reminder (Violation 2): DEEN AI operates exclusively for Islamic knowledge and guidance. Repeated unrelated prompts will temporarily restrict your messaging access.';
        } else if (violationLevel === 3) {
          actionTaken = 'temporary_restriction';
          restrictedUntil = new Date(Date.now() + 5 * 60 * 1000).toISOString();
          warningText =
            'Notice (Violation 3): Your ability to send messages has been temporarily restricted for 5 minutes due to repeated off-topic requests.';
        } else if (violationLevel >= 4) {
          actionTaken = 'flagged_for_admin_review';
          restrictedUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString();
          warningText =
            'Account Flagged (Repeated Violations): Your account has been flagged for administrator review and temporarily restricted for 15 minutes.';
        }

        await supabaseAdmin.from('user_violations').insert({
          user_id: userId,
          user_name: prof?.full_name ?? 'User',
          prompt_text: prompt,
          violation_level: violationLevel,
          detected_category: classification.category,
          action_taken: actionTaken,
        });

        await supabaseAdmin
          .from('profiles')
          .update({
            violation_count: violationLevel,
            restricted_until: restrictedUntil,
            updated_at: new Date().toISOString(),
          })
          .eq('id', userId);

        if (violationLevel >= 3) {
          await supabaseAdmin.from('account_restrictions').insert({
            user_id: userId,
            reason: `Automatic restriction after violation #${violationLevel} (${classification.category})`,
            restriction_type: violationLevel >= 4 ? 'admin_suspension' : 'timeout_15m',
            ends_at: restrictedUntil,
            status: 'active',
          });
        }
      }

      return new Response(
        JSON.stringify({
          isRestricted: true,
          isIslamic: false,
          violationLevel,
          content: warningText,
          references: [],
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 3. RAG Retrieval from PostgreSQL (quran_verses & hadith_records)
    const terms = prompt
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((t) => t.length > 3)
      .slice(0, 4);

    const searchPattern = terms.length > 0 ? `%${terms[0]}%` : '%Allah%';

    const [{ data: quranHits }, { data: hadithHits }] = await Promise.all([
      supabaseAdmin
        .from('quran_verses')
        .select('surah_number, surah_name_en, ayah_number, arabic_text, english_translation, tafsir_ibn_kathir')
        .or(`english_translation.ilike.${searchPattern},tafsir_ibn_kathir.ilike.${searchPattern}`)
        .limit(3),
      supabaseAdmin
        .from('hadith_records')
        .select('collection, hadith_number, narrator, arabic_text, english_text, authenticity_grade, explanation')
        .or(`english_text.ilike.${searchPattern},explanation.ilike.${searchPattern}`)
        .limit(3),
    ]);

    const references: Array<{ type: string; citation: string; text: string; grading?: string }> = [];
    for (const q of quranHits ?? []) {
      references.push({
        type: 'quran',
        citation: `Surah ${q.surah_name_en} (${q.surah_number}:${q.ayah_number})`,
        text: q.english_translation,
      });
    }
    for (const h of hadithHits ?? []) {
      references.push({
        type: 'hadith',
        citation: `${h.collection} #${h.hadith_number}`,
        text: h.english_text,
        grading: h.authenticity_grade,
      });
    }

    const ragContext =
      references.length > 0
        ? `\n\nVERIFIED KNOWLEDGE BASE CONTEXT:\n${references
            .map((r) => `- [${r.type.toUpperCase()}] ${r.citation}${r.grading ? ` (${r.grading})` : ''}: "${r.text}"`)
            .join('\n')}`
        : '';

    // 4. Generate response with OpenAI or Gemini if server secret is configured
    const openAiKey = Deno.env.get('OPENAI_API_KEY');
    const geminiKey = Deno.env.get('GEMINI_API_KEY');

    let aiContent = '';

    if (openAiKey) {
      const messages = [
        { role: 'system', content: SYSTEM_PROMPT + ragContext },
        ...history.slice(-6).map((m: { role: string; content: string }) => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content,
        })),
        { role: 'user', content: prompt },
      ];

      const resp = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${openAiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages,
          temperature: 0.3,
        }),
      });
      if (resp.ok) {
        const json = await resp.json();
        aiContent = json.choices?.[0]?.message?.content ?? '';
      }
    } else if (geminiKey) {
      const resp = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT + ragContext }] },
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
          }),
        }
      );
      if (resp.ok) {
        const json = await resp.json();
        aiContent = json.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
      }
    }

    // 5. Structured RAG fallback if no LLM secret is set on Edge Function yet
    if (!aiContent) {
      const evidenceLines =
        references.length > 0
          ? references
              .map(
                (r) =>
                  `**${r.citation}**${r.grading ? ` *[${r.grading}]*` : ''}\n> "${r.text}"`
              )
              .join('\n\n')
          : 'Consult the Qur\'an and Hadith tabs for full verified texts on this subject.';

      aiContent = `### 1. Direct Answer\nWa Alaikum Assalam wa Rahmatullahi wa Barakatuh. Your question regarding *"${prompt}"* falls within authentic Islamic guidance.\n\n### 2. Retrieved Knowledge Base Evidence\n${evidenceLines}\n\n### 3. Scholarly Reminder\nAlways verify specific personal rulings with qualified scholars grounded in the Qur'an, authentic Sunnah, and the understanding of the Salaf as-Salih.\n\n*(Note: Add \`OPENAI_API_KEY\` or \`GEMINI_API_KEY\` to Supabase Edge Function secrets for full generative synthesis.)*`;
    }

    return new Response(
      JSON.stringify({
        isRestricted: false,
        isIslamic: true,
        conversationId,
        content: aiContent,
        references,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Edge function error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
