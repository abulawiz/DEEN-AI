-- ============================================================
-- DEEN AI — Initial Knowledge Base Seed Script
-- Run in Supabase SQL Editor AFTER running supabase/schema.sql
-- ============================================================

-- 1. Islamic Categories (10 Core Categories)
INSERT INTO public.islamic_categories (slug, name_en, name_ar, description, icon_name, sort_order)
VALUES
  ('aqeedah', 'Aqeedah', 'العقيدة', 'Islamic Creed, Tawhid, Pillars of Iman, and Sound Belief according to the Salaf as-Salih.', 'shield', 1),
  ('fiqh', 'Fiqh', 'الفقه', 'Islamic Jurisprudence: Purification, Salah, Zakah, Sawm, Hajj, and Everyday Rulings.', 'scale', 2),
  ('tafsir', 'Tafsir', 'التفسير', 'Exegesis and explanation of the Noble Qur''an from Ibn Kathir and As-Sa''di.', 'book-open', 3),
  ('hadith', 'Hadith', 'الحديث', 'Authentic Prophetic Traditions from Sahih al-Bukhari, Sahih Muslim, and Sunan collections.', 'scroll', 4),
  ('seerah', 'Seerah', 'السيرة', 'Biography of Prophet Muhammad ﷺ, Makkan and Madinan eras, and Prophetic lessons.', 'compass', 5),
  ('islamic-history', 'Islamic History', 'التاريخ الإسلامي', 'History of the Rightly Guided Caliphs, Companions, and Islamic civilization.', 'landmark', 6),
  ('islamic-manners', 'Islamic Manners', 'الأخلاق والآداب', 'Adab, Akhlaq, truthfulness, humility, kindness to parents, and character.', 'heart', 7),
  ('islamic-family-life', 'Islamic Family Life', 'الأسرة المسلمة', 'Marriage, rights of spouses, Islamic parenting, and maintaining family ties.', 'users', 8),
  ('islamic-transactions', 'Islamic Transactions', 'المعاملات', 'Halal business ethics, contracts, prohibition of Riba, and honest trade.', 'briefcase', 9),
  ('daily-adhkar', 'Daily Adhkar', 'الأذكار اليومية', 'Morning and evening remembrances, prophetic supplications, and fortress of the Muslim.', 'sparkles', 10)
ON CONFLICT (slug) DO NOTHING;

-- 2. Core Qur'an Verses
INSERT INTO public.quran_verses (
  surah_number, surah_name_en, surah_name_ar, ayah_number,
  arabic_text, english_translation, revelation_type,
  tafsir_ibn_kathir, tafsir_as_sadi
)
VALUES
  (
    1, 'Al-Fatihah', 'الفاتحة', 1,
    'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
    'Meccan',
    'Opening every noble deed by seeking blessing and help through the Names of Allah, Ar-Rahman (vast mercy) and Ar-Rahim (special mercy for the believers).',
    'Allah begins His Book with His two great Names of Mercy, affirming His perfection and compassion toward His creation.'
  ),
  (
    1, 'Al-Fatihah', 'الفاتحة', 5,
    'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
    'It is You we worship and You we ask for help.',
    'Meccan',
    'The core of Tawhid al-Uluhiyyah: dedicating all worship solely to Allah and relying upon Him alone for aid and guidance.',
    'Preceding "You" restricts worship and seeking ultimate help to Allah alone, negating all forms of shirk.'
  ),
  (
    2, 'Al-Baqarah', 'البقرة', 255,
    'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ',
    'Allah - there is no deity except Him, the Ever-Living, the Sustainer of [all] existence. Neither drowsiness overtakes Him nor sleep.',
    'Medinan',
    'Ayat al-Kursi, the greatest verse in the Qur''an, affirming Allah''s absolute oneness, eternal life, sovereignty, and complete knowledge.',
    'Establishes the perfection of Allah''s Life and Self-Subsistence, by which all creation is sustained.'
  ),
  (
    2, 'Al-Baqarah', 'البقرة', 286,
    'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا',
    'Allah does not charge a soul except [with that within] its capacity.',
    'Medinan',
    'Islamic legislation is built upon ease, justice, and mercy; Allah never burdens a servant beyond their capability.',
    'Demonstrates Allah''s immense kindness: obligations are tailored to human ability and ease.'
  ),
  (
    3, 'Ali ''Imran', 'آل عمران', 103,
    'وَاعْتَصِمُوا بِحَبْلِ اللَّهِ جَمِيعًا وَلَا تَفَرَّقُوا',
    'And hold firmly to the rope of Allah all together and do not become divided.',
    'Medinan',
    'Commanding unity upon the Qur''an and authentic Sunnah and warning against sectarianism and division.',
    'The rope of Allah is His Book and religion; holding fast to it unites hearts upon truth.'
  ),
  (
    16, 'An-Nahl', 'النحل', 90,
    'إِنَّ اللَّهَ يَأْمُرُ بِالْعَدْلِ وَالْإِحْسَانِ وَإِيتَاءِ ذِي الْقُرْبَىٰ',
    'Indeed, Allah orders justice and good conduct and giving to relatives.',
    'Meccan',
    'A comprehensive verse commanding justice, excellence in worship and character (Ihsan), and maintaining kinship.',
    'Justice is giving every rightful person their due, while Ihsan is going beyond duty in kindness.'
  ),
  (
    49, 'Al-Hujurat', 'الحجرات', 13,
    'إِنَّ أَكْرَمَكُمْ عِندَ اللَّهِ أَتْقَاكُمْ',
    'Indeed, the most noble of you in the sight of Allah is the most righteous of you.',
    'Medinan',
    'True honor in Islam is measured solely by Taqwa (piety and consciousness of Allah), not lineage, wealth, or race.',
    'All people descend from Adam and Eve; superiority is strictly through obedience and piety.'
  ),
  (
    94, 'Ash-Sharh', 'الشرح', 5,
    'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا',
    'For indeed, with hardship [will be] ease.',
    'Meccan',
    'A divine promise reassuring believers that every trial is accompanied by relief and ease from Allah.',
    'The repetition of the verse emphasizes that one hardship cannot overcome two eases.'
  ),
  (
    112, 'Al-Ikhlas', 'الإخلاص', 1,
    'قُلْ هُوَ اللَّهُ أَحَدٌ',
    'Say, "He is Allah, [who is] One,"',
    'Meccan',
    'Surah Al-Ikhlas equals one-third of the Qur''an in meaning because it purely establishes the Oneness and perfection of Allah.',
    'Affirms Allah''s absolute uniqueness in Lordship, Worship, and Names & Attributes.'
  )
ON CONFLICT (surah_number, ayah_number) DO NOTHING;

-- 3. Core Authentic Hadith Records
INSERT INTO public.hadith_records (
  collection, collection_code, hadith_number, chapter_name_en, narrator,
  arabic_text, english_text, authenticity_grade, graded_by,
  explanation, category, is_verified
)
VALUES
  (
    'Sahih al-Bukhari', 'bukhari', '1', 'Revelation & Intentions', 'Umar ibn al-Khattab (RA)',
    'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
    'Actions are judged by intentions, and every person will get the reward according to what they intended.',
    'Sahih', 'Imam al-Bukhari & Imam Muslim',
    'Foundational principle of Islam: sincerity (Ikhlas) for Allah alone determines the acceptance and reward of every act of worship and permissible deed.',
    'Aqeedah', true
  ),
  (
    'Sahih al-Bukhari', 'bukhari', '8', 'Book of Belief', 'Ibn Umar (RA)',
    'بُنِيَ الإِسْلاَمُ عَلَى خَمْسٍ: شَهَادَةِ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَإِقَامِ الصَّلاَةِ، وَإِيتَاءِ الزَّكَاةِ، وَالْحَجِّ، وَصَوْمِ رَمَضَانَ',
    'Islam is built upon five pillars: testifying that there is no deity worthy of worship except Allah and that Muhammad is the Messenger of Allah, establishing prayer, paying Zakah, performing Hajj, and fasting Ramadan.',
    'Sahih', 'Imam al-Bukhari',
    'Defines the five foundational obligations upon which the structure of Islam stands.',
    'Aqeedah', true
  ),
  (
    'Sahih Muslim', 'muslim', '55', 'Book of Faith', 'Tamim ad-Dari (RA)',
    'الدِّينُ النَّصِيحَةُ',
    'The religion is sincerity (nasihah). We said: To whom? He said: To Allah, His Book, His Messenger, and to the leaders of the Muslims and their common folk.',
    'Sahih', 'Imam Muslim',
    'Nasihah encompasses sincere devotion to Allah, reverence for the Qur''an, obedience to the Prophet ﷺ, and wishing good for all Muslims.',
    'Islamic Manners', true
  ),
  (
    'Sahih al-Bukhari', 'bukhari', '6011', 'Book of Good Manners', 'Abu Hurayrah (RA)',
    'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ',
    'Whoever believes in Allah and the Last Day should speak good or remain silent.',
    'Sahih', 'Imam al-Bukhari & Imam Muslim',
    'Teaches strict discipline of the tongue, avoiding gossip, backbiting, and harmful speech.',
    'Islamic Manners', true
  ),
  (
    'Sahih Muslim', 'muslim', '2564', 'Book of Virtue', 'Abu Hurayrah (RA)',
    'إِنَّ اللَّهَ لاَ يَنْظُرُ إِلَى صُوَرِكُمْ وَأَمْوَالِكُمْ وَلَكِنْ يَنْظُرُ إِلَى قُلُوبِكُمْ وَأَعْمَالِكُمْ',
    'Indeed, Allah does not look at your appearance or your wealth, but rather He looks at your hearts and your deeds.',
    'Sahih', 'Imam Muslim',
    'Emphasizes inner purity, sincerity of heart, and righteous actions over outward status.',
    'Aqeedah', true
  ),
  (
    'Jami'' at-Tirmidhi', 'tirmidhi', '1209', 'Book on Business', 'Abu Sa''id al-Khudri (RA)',
    'التَّاجِرُ الصَّدُوقُ الأَمِينُ مَعَ النَّبِيِّينَ وَالصِّدِّيقِينَ وَالشُّهَدَاءِ',
    'The truthful, trustworthy merchant will be with the Prophets, the truthful ones, and the martyrs.',
    'Hasan', 'Imam at-Tirmidhi',
    'Highlights the immense reward for honesty, transparency, and trustworthiness in Islamic business and trade.',
    'Islamic Transactions', true
  )
ON CONFLICT DO NOTHING;

-- 4. Learning Courses
INSERT INTO public.learning_courses (slug, title, level, description, estimated_hours)
VALUES
  (
    'course-beg-1',
    'Foundations of Tawhid & Iman',
    'Beginner',
    'A structured beginner course covering the Three Fundamental Principles, Pillars of Islam, and Pillars of Iman with Qur''anic and Hadith evidence.',
    4
  ),
  (
    'course-int-1',
    'Fiqh of Purification & Salah',
    'Intermediate',
    'Intermediate practical jurisprudence on Wudu, Ghusl, conditions of Salah, and common mistakes according to authentic Sunnah.',
    6
  ),
  (
    'course-adv-1',
    'Sciences of Hadith & Usul al-Tafsir',
    'Advanced',
    'Advanced study of Hadith authentication (Sahih, Hasan, Da''if, Mawdu''), narrator chains (Isnad), and principles of Qur''anic exegesis.',
    8
  )
ON CONFLICT (slug) DO NOTHING;
