# DEEN AI (دين) — Your Intelligent Islamic Companion
### *Tagline: Your Intelligent Islamic Companion*
### *Mission: Bringing Authentic Islamic Knowledge Closer to Everyone.*

**Author & Engineering:**
- **Name:** Abulawzat Digital Solution
- **Department:** Department of Computer Science

DEEN AI is a full-featured, professional Islamic artificial intelligence platform designed to help Muslims learn, understand, and practice Islam strictly through the Noble Qur'an, authentic Sunnah, and recognized scholarly explanations according to the understanding of the Salaf as-Salih.

---

## 🌟 Core Islamic Methodology

1. **The Noble Qur'an** with verified Surah and Ayah citations.
2. **The Authentic Sunnah** of Prophet Muhammad ﷺ (Sahih al-Bukhari, Sahih Muslim, Jami' at-Tirmidhi, Sunan Abi Dawud, etc.).
3. **Understanding of the Salaf as-Salih** (the Righteous Predecessors: Sahabah, Tabi'un, and the master Imams).
4. **Scholarly Authenticity**: Clear grading for all Hadiths (Sahih, Hasan) with narrator chains and gradings.
5. **No Fabrication**: Strict guardrails preventing religious innovation (Bid'ah) or unverified claims.
6. **Scholarly Deference**: Clear disclaimers advising users to consult qualified living Muftis for intricate personal legal verdicts.

---

## 🛡️ Islamic-Only Topic Restriction System

DEEN AI operates exclusively as a sacred Islamic knowledge assistant. Off-topic secular inquiries are rejected by backend decision rules:

### Allowed Conversations
- Qur'an & Tafsir (Ibn Kathir, As-Sa'di).
- Hadith & Sunnah sciences.
- Aqeedah & Tawheed (Rububiyyah, Uluhiyyah, Asma wa Sifat).
- Fiqh of Taharah, Salah, Zakat, Sawm, and Hajj.
- Islamic marriage, family life, and parenting.
- Islamic commercial transactions, Halal earnings, and Riba prohibition.
- Islamic history, Seerah, and manners (Adab & Akhlaq).
- Islamic perspective on modern technology, medicine, and everyday challenges.
- Compassionate emergency support and life sanctity guidance (Surah An-Nisa 4:29).

### Restricted Conversations
- General programming / secular coding help (e.g., web scrapers, game scripts).
- Sports betting, match predictions, and secular entertainment gossip.
- Celebrity culture, movies, music gossip, and video games.
- Partisan political campaigning and worldly conflicts.
- Random non-Islamic chatter.

### Progressive Warning & Restriction Tiers
1. **1st Violation**: Polite educational warning explaining DEEN AI's sacred scope, plus suggestions of authentic Islamic topics.
2. **2nd Violation**: Formal policy reminder warning against repeated off-topic inquiries.
3. **3rd Violation**: Temporary 15-minute message lockout with live countdown timer and appeal form.
4. **4th+ Violation**: Account flagged for administrator review; user can submit a formal appeal directly to administrators.

---

## 🚀 Key Features

### 1. Islamic AI Chat Assistant
- **Retrieval-Augmented Generation (RAG)**: Connects verified Qur'anic verses, Sahih Hadiths, and scholarly treatises before formulating responses.
- **Structured Scholarly Output**:
  1. Direct Answer
  2. Qur'anic Evidence (Arabic calligraphy block + English + Surah:Ayah citation)
  3. Hadith Evidence (Arabic text + Narrator + Reference + Authenticity Grade)
  4. Scholarly Commentary (Salaf as-Salih & classical scholars)
  5. Practical Everyday Lessons
  6. Verified References & Sources
- **Interactive Citations Modal**: Click any citation pill to view source details, narrator chain, and Tafsir context.
- **Voice Input & TTS**: Web Speech recognition in English (`en-US`) and Arabic (`ar-SA`) plus Text-to-Speech synthesis.
- **Feedback & Scholar Review Reporting**: Flag answers for administrative scholarly review.

### 2. The Holy Qur'an
- Complete catalog of **114 Surahs** with Arabic names, English meanings, revelation types, and verse counts.
- Verse reader with authentic Arabic font, English translations, and Tafsir excerpts (Ibn Kathir & As-Sa'di).
- Streaming audio recitation by Shaykh Mishary Rashid Alafasy.

### 3. Authenticated Hadith Repository
- Browse Sahih al-Bukhari, Sahih Muslim, Jami' at-Tirmidhi, and Sunan Abi Dawud.
- Filter by collection or authenticity grade (Sahih / Hasan).
- Detailed narrator chains, Arabic texts, English translations, and Fiqh significance.

### 4. Islamic Knowledge Library
- 10 distinct knowledge categories:
  - Aqeedah
  - Fiqh
  - Tafsir
  - Hadith Sciences
  - Seerah
  - Islamic History
  - Islamic Manners (Adab & Akhlaq)
  - Islamic Family Life
  - Islamic Transactions (Mu'amalat)
  - Daily Adhkar
- Deep treatises citing Imam Ibn Taymiyyah, Ibn al-Qayyim, Imam an-Nawawi, and classical scholars.

### 5. Daily Adhkar & Reminders
- Interactive Morning & Evening Adhkar counters with required repetition tracking (1x, 3x, 100x).
- Hadith of the Day and Qur'an Verse of the Day with audio recitation.
- Friday Sunan reminders (Surah Al-Kahf, Salawat upon the Prophet ﷺ, Ghusl, Siwak, Hour of Du'a).

### 6. Islamic Learning Centre
- Three progressive learning tracks:
  - **Beginner**: Foundations of Islam & Iman (The Two Testimonies, 6 Pillars of Faith).
  - **Intermediate**: Pillars of Tawheed & Islamic Aqeedah (Major & Minor Shirk).
  - **Advanced**: Mustalah al-Hadith (The 5 Conditions of a Sahih Hadith).
- Interactive verification quizzes with instant grading, explanations, and celebratory confetti upon passing.

### 7. Administrator Console
- Real-time KPIs: Registered Users, Active Users, Suspended Users, Islamic Questions, Off-Topic Rejections, Flagged Violations.
- User management: Search, toggle suspension, restore accounts, promote to Admin.
- Flagged Violations & Appeals: Review user appeal statements, approve or dismiss strikes.
- Knowledge Base Manager: Add new verified Qur'an verses and Hadith records.
- AI Configuration: Customize system instructions and strictness presets.
- Reported Answers Review: Audit responses flagged by users.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Canvas Confetti.
- **Audio & Speech**: HTML5 Audio API (streaming high-fidelity Quran recitations) + Web Speech API (Voice Recognition & TTS).
- **Backend & Database**:
  - `supabase/schema.sql`: Full PostgreSQL schema with Row Level Security (RLS) policies, indexes, and triggers across 16 tables.
  - Unified `DBService` with seamless local storage sync for immediate zero-dependency testing, plus live Supabase connectivity.
- **AI Integration**: Support for OpenAI API (`gpt-4o-mini`), Google Gemini API (`gemini-1.5-flash`), and an intelligent local Islamic RAG synthesizer.

---

## 🏃 Getting Started

```bash
# Navigate to project directory
cd deen-ai

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to explore DEEN AI!
