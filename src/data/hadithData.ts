import { HadithRecord } from '../types';

export const VERIFIED_HADITH_RECORDS: HadithRecord[] = [
  // Hadith 1: Sincerity of Intentions (Bukhari 1)
  {
    id: 'h-bukhari-1',
    collection: 'Sahih al-Bukhari',
    collection_code: 'bukhari',
    hadith_number: '1',
    chapter_name_en: 'Revelation (Bad\' al-Wahy)',
    chapter_name_ar: 'كتاب بدء الوحي',
    narrator: '\'Umar ibn al-Khattab (may Allah be pleased with him)',
    arabic_text: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى دُنْيَا يُصِيبُهَا أَوْ إِلَى امْرَأَةٍ يَنْكِحُهَا، فَهِجْرَتُهُ إِلَى مَا هَاجَرَ إِلَيْهِ.',
    english_text: 'Actions are judged by intentions, and every person will get the reward according to what he has intended. So whoever emigrated for worldly benefits or for a woman to marry, his emigration was for what he emigrated for.',
    authenticity_grade: 'Sahih',
    graded_by: 'Imam al-Bukhari and Imam Muslim (Muttafaq \'Alayh)',
    explanation: 'Imam ash-Shafi\'i said this Hadith constitutes one-third of all religious knowledge because every action of the heart, tongue, and limbs revolves around intention and sincerity (Ikhlas).',
    category: 'Aqeedah & Sincerity',
    is_verified: true
  },

  // Hadith 2: The Hadith of Jibreel (Muslim 8)
  {
    id: 'h-muslim-8',
    collection: 'Sahih Muslim',
    collection_code: 'muslim',
    hadith_number: '8',
    chapter_name_en: 'The Book of Faith (Kitab al-Iman)',
    chapter_name_ar: 'كتاب الإيمان',
    narrator: '\'Umar ibn al-Khattab (may Allah be pleased with him)',
    arabic_text: 'قَالَ: فَأَخْبِرْنِي عَنِ الإِسْلاَمِ؟ قَالَ رَسُولُ اللَّهِ ﷺ: الإِسْلاَمُ أَنْ تَشْهَدَ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَتُقِيمَ الصَّلاَةَ، وَتُؤْتِيَ الزَّكَاةَ، وَتَصُومَ رَمَضَانَ، وَتَحُجَّ الْبَيْتَ إِنِ اسْتَطَعْتَ إِلَيْهِ سَبِيلاً... قَالَ: فَأَخْبِرْنِي عَنِ الإِحْسَانِ؟ قَالَ: أَنْ تَعْبُدَ اللَّهَ كَأَنَّكَ تَرَاهُ، فَإِنْ لَمْ تَكُنْ تَرَاهُ فَإِنَّهُ يَرَاكَ.',
    english_text: 'He (Jibreel) said: "Inform me about Islam." The Messenger of Allah ﷺ said: "Islam is to testify that there is no deity worthy of worship except Allah and that Muhammad is the Messenger of Allah, to establish prayer, to give Zakat, to fast Ramadan, and to perform Hajj to the House if you are able." ... He asked: "Inform me about Ihsan." He replied: "That you worship Allah as if you see Him, and if you do not see Him, [know that] He sees you."',
    authenticity_grade: 'Sahih',
    graded_by: 'Imam Muslim',
    explanation: 'Known as "Umm as-Sunnah" (The Mother of the Sunnah) as it defines the three progressive dimensions of the religion: Islam (outward pillars), Iman (internal faith in the 6 pillars), and Ihsan (excellence and spiritual mindfulness).',
    category: 'Foundations of Deen',
    is_verified: true
  },

  // Hadith 3: The Danger of Innovations in Religion (Muslim 1718)
  {
    id: 'h-muslim-1718',
    collection: 'Sahih Muslim',
    collection_code: 'muslim',
    hadith_number: '1718',
    chapter_name_en: 'Judicial Decisions (Al-Aqdiyah)',
    chapter_name_ar: 'كتاب الأقضية',
    narrator: '\'A\'ishah (may Allah be pleased with her)',
    arabic_text: 'مَنْ عَمِلَ عَمَلاً لَيْسَ عَلَيْهِ أَمْرُنَا فَهُوَ رَدٌّ.',
    english_text: 'Whoever performs an act of worship that is not according to our command (the Sunnah), it will be rejected.',
    authenticity_grade: 'Sahih',
    graded_by: 'Imam Muslim and Imam al-Bukhari',
    explanation: 'A fundamental scale for judging outward actions: for any act of worship to be accepted by Allah, it must satisfy two conditions: Sincerity (Ikhlas) purely for Allah, and Conformity (Ittiba\') to the Prophet\'s ﷺ Sunnah.',
    category: 'Sunnah & Aqeedah',
    is_verified: true
  },

  // Hadith 4: Halal and Haram are Clear (Bukhari 52, Muslim 1599)
  {
    id: 'h-bukhari-52',
    collection: 'Sahih al-Bukhari',
    collection_code: 'bukhari',
    hadith_number: '52',
    chapter_name_en: 'Belief (Kitab al-Iman)',
    chapter_name_ar: 'كتاب الإيمان',
    narrator: 'An-Nu\'man ibn Bashir (may Allah be pleased with him)',
    arabic_text: 'الْحَلاَلُ بَيِّنٌ وَالْحَرَامُ بَيِّنٌ، وَبَيْنَهُمَا أُمُورٌ مُشْتَبِهَاتٌ لاَ يَعْلَمُهَا كَثِيرٌ مِنَ النَّاسِ، فَمَنِ اتَّقَى الشُّبُهَاتِ اسْتَبْرَأَ لِدِينِهِ وَعِرْضِهِ... أَلاَ وَإِنَّ فِي الْجَسَدِ مُضْغَةً إِذَا صَلَحَتْ صَلَحَ الْجَسَدُ كُلُّهُ، وَإِذَا فَسَدَتْ فَسَدَ الْجَسَدُ كُلُّهُ، أَلاَ وَهِيَ الْقَلْبُ.',
    english_text: 'That which is lawful is clear and that which is unlawful is clear, and between them are matters that are unclear which many people do not know. Whoever guards against doubtful matters clears himself in regard to his religion and his honor... Verily, in the body there is a piece of flesh: if it is righteous, the whole body is righteous, and if it is corrupted, the whole body is corrupted. Indeed, it is the heart.',
    authenticity_grade: 'Sahih',
    graded_by: 'Imam al-Bukhari and Imam Muslim',
    explanation: 'A pillar of Islamic jurisprudence (Fiqh) establishing piety (Wara\')—refraining from ambiguous matters and protecting spiritual health.',
    category: 'Halal & Haram',
    is_verified: true
  },

  // Hadith 5: Love for Your Brother (Bukhari 13)
  {
    id: 'h-bukhari-13',
    collection: 'Sahih al-Bukhari',
    collection_code: 'bukhari',
    hadith_number: '13',
    chapter_name_en: 'Belief (Kitab al-Iman)',
    chapter_name_ar: 'كتاب الإيمان',
    narrator: 'Anas ibn Malik (may Allah be pleased with him)',
    arabic_text: 'لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ.',
    english_text: 'None of you truly believes until he loves for his brother what he loves for himself.',
    authenticity_grade: 'Sahih',
    graded_by: 'Imam al-Bukhari and Imam Muslim',
    explanation: 'True Islamic brotherhood and complete faith require wishing every goodness, guidance, and blessing for one\'s fellow believer.',
    category: 'Islamic Character & Manners',
    is_verified: true
  },

  // Hadith 6: Kindness and Good Character (Tirmidhi 2002)
  {
    id: 'h-tirmidhi-2002',
    collection: 'Jami\' at-Tirmidhi',
    collection_code: 'tirmidhi',
    hadith_number: '2002',
    chapter_name_en: 'Righteousness and Relations',
    chapter_name_ar: 'أبواب البر والصلة',
    narrator: 'Abu Ad-Darda (may Allah be pleased with him)',
    arabic_text: 'مَا مِنْ شَيْءٍ أَثْقَلُ فِي مِيزَانِ الْمُؤْمِنِ يَوْمَ الْقِيَامَةِ مِنْ حُسْنِ الْخُلُقِ، وَإِنَّ اللَّهَ لَيُبْغِضُ الْفَاحِشَ الْبَذِيءَ.',
    english_text: 'Nothing is weightier on the scale of the believer on the Day of Resurrection than good character. Indeed, Allah hates the vulgar and obscene.',
    authenticity_grade: 'Sahih',
    graded_by: 'Imam at-Tirmidhi (Hasan Sahih); authenticated by Shaykh al-Albani',
    explanation: 'Emphasizes that manners (Akhlaq), gentleness, and dignified speech are paramount weights on the Mizan of Judgment Day.',
    category: 'Islamic Character & Manners',
    is_verified: true
  },

  // Hadith 7: Seeking Sacred Knowledge (Abu Dawud 3641)
  {
    id: 'h-abudawud-3641',
    collection: 'Sunan Abi Dawud',
    collection_code: 'abu_dawud',
    hadith_number: '3641',
    chapter_name_en: 'Knowledge (Kitab al-\'Ilm)',
    chapter_name_ar: 'كتاب العلم',
    narrator: 'Kathir ibn Qays from Abu ad-Darda (may Allah be pleased with him)',
    arabic_text: 'مَنْ سَلَكَ طَرِيقًا يَطْلُبُ فِيهِ عِلْمًا سَلَكَ اللَّهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ، وَإِنَّ الْمَلاَئِكَةَ لَتَضَعُ أَجْنِحَتَهَا رِضًا لِطَالِبِ الْعِلْمِ، وَإِنَّ الْعَالِمَ لَيَسْتَغْفِرُ لَهُ مَنْ فِي السَّمَاوَاتِ وَمَنْ فِي الأَرْضِ حَتَّى الْحِيتَانُ فِي الْمَاءِ.',
    english_text: 'Whoever treads a path seeking knowledge, Allah makes easy for him a path to Paradise. Verily the angels lower their wings in pleased approval for the seeker of knowledge, and all creatures in the heavens and earth, even the fish in the depths of water, seek forgiveness for the scholar.',
    authenticity_grade: 'Sahih',
    graded_by: 'Shaykh al-Albani (Sahih Sunan Abi Dawud)',
    explanation: 'The supreme virtue of seeking Islamic knowledge according to the Qur\'an and Sunnah to worship Allah upon clear proof.',
    category: 'Islamic Education & Seeking Knowledge',
    is_verified: true
  },

  // Hadith 8: Best of People to Their Families (Tirmidhi 3895)
  {
    id: 'h-tirmidhi-3895',
    collection: 'Jami\' at-Tirmidhi',
    collection_code: 'tirmidhi',
    hadith_number: '3895',
    chapter_name_en: 'Virtues (Kitab al-Manaqib)',
    chapter_name_ar: 'كتاب المناقب',
    narrator: '\'A\'ishah (may Allah be pleased with her)',
    arabic_text: 'خَيْرُكُمْ خَيْرُكُمْ لِأَهْلِهِ، وَأَنَا خَيْرُكُمْ لِأَهْلِي.',
    english_text: 'The best of you are those who are best to their wives and families, and I am the best among you to my family.',
    authenticity_grade: 'Sahih',
    graded_by: 'Imam at-Tirmidhi (Hasan Sahih); Shaykh al-Albani',
    explanation: 'The true measure of a Muslim\'s character is observed in private conduct, mercy, patience, and kindness towards their family members.',
    category: 'Islamic Family & Marriage',
    is_verified: true
  },

  // Hadith 9: The Five Daily Prayers Cleanse Sins (Bukhari 528)
  {
    id: 'h-bukhari-528',
    collection: 'Sahih al-Bukhari',
    collection_code: 'bukhari',
    hadith_number: '528',
    chapter_name_en: 'Times of the Prayers',
    chapter_name_ar: 'كتاب مواقيت الصلاة',
    narrator: 'Abu Hurairah (may Allah be pleased with him)',
    arabic_text: 'أَرَأَيْتُمْ لَوْ أَنَّ نَهَرًا بِبَابِ أَحَدِكُمْ يَغْتَسِلُ مِنْهُ كُلَّ يَوْمٍ خَمْسَ مَرَّاتٍ، هَلْ يَبْقَى مِنْ دَرَنِهِ شَيْءٌ؟ قَالُوا: لاَ يَبْقَى مِنْ دَرَنِهِ شَيْءٌ. قَالَ: فَذَلِكَ مَثَلُ الصَّلَوَاتِ الْخَمْسِ، يَمْحُو اللَّهُ بِهِنَّ الْخَطَايَا.',
    english_text: 'Tell me, if there were a river at the doorstep of one of you in which he bathed five times a day, would any filth remain on him? They said: "No filth would remain on him." He said: "That is the example of the five daily prayers: with them Allah wipes away sins."',
    authenticity_grade: 'Sahih',
    graded_by: 'Imam al-Bukhari and Imam Muslim',
    explanation: 'Salah purifies the heart and soul from minor sins and spiritual transgressions continuously throughout day and night.',
    category: 'Salah & Worship',
    is_verified: true
  },

  // Hadith 10: Prohibition of Riba and Unjust Gain (Muslim 1598)
  {
    id: 'h-muslim-1598',
    collection: 'Sahih Muslim',
    collection_code: 'muslim',
    hadith_number: '1598',
    chapter_name_en: 'Sharecropping and Transactions',
    chapter_name_ar: 'كتاب المساقاة',
    narrator: 'Jabir ibn Abdillah (may Allah be pleased with him)',
    arabic_text: 'لَعَنَ رَسُولُ اللَّهِ ﷺ آكِلَ الرِّبَا، وَمُؤْكِلَهُ، وَكَاتِبَهُ، وَشَاهِدَيْهِ، وَقَالَ: هُمْ سَوَاءٌ.',
    english_text: 'The Messenger of Allah ﷺ cursed the one who consumes usury (Riba), the one who pays it, the one who records it, and the two witnesses to it. He said: "They are all equal in guilt."',
    authenticity_grade: 'Sahih',
    graded_by: 'Imam Muslim',
    explanation: 'Riba is among the seven destructive sins; Islamic commercial ethics strictly prohibit interest, unjust enrichment, and oppressive lending.',
    category: 'Islamic Business & Transactions',
    is_verified: true
  }
];
