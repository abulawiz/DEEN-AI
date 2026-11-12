import { QuranVerse, SurahSummary } from '../types';

export const SURAH_LIST: SurahSummary[] = [
  { number: 1, name_en: 'Al-Fatihah', name_ar: 'الفاتحة', english_translation: 'The Opening', verses_count: 7, revelation_type: 'Meccan' },
  { number: 2, name_en: 'Al-Baqarah', name_ar: 'البقرة', english_translation: 'The Cow', verses_count: 286, revelation_type: 'Medinan' },
  { number: 3, name_en: 'Ali \'Imran', name_ar: 'آل عمران', english_translation: 'Family of Imran', verses_count: 200, revelation_type: 'Medinan' },
  { number: 4, name_en: 'An-Nisa', name_ar: 'النساء', english_translation: 'The Women', verses_count: 176, revelation_type: 'Medinan' },
  { number: 5, name_en: 'Al-Ma\'idah', name_ar: 'المائدة', english_translation: 'The Table Spread', verses_count: 120, revelation_type: 'Medinan' },
  { number: 6, name_en: 'Al-An\'am', name_ar: 'الأنعام', english_translation: 'The Cattle', verses_count: 165, revelation_type: 'Meccan' },
  { number: 7, name_en: 'Al-A\'raf', name_ar: 'الأعراف', english_translation: 'The Heights', verses_count: 206, revelation_type: 'Meccan' },
  { number: 8, name_en: 'Al-Anfal', name_ar: 'الأنفال', english_translation: 'The Spoils of War', verses_count: 75, revelation_type: 'Medinan' },
  { number: 9, name_en: 'At-Tawbah', name_ar: 'التوبة', english_translation: 'The Repentance', verses_count: 129, revelation_type: 'Medinan' },
  { number: 10, name_en: 'Yunus', name_ar: 'يونس', english_translation: 'Jonah', verses_count: 109, revelation_type: 'Meccan' },
  { number: 11, name_en: 'Hud', name_ar: 'هود', english_translation: 'Hud', verses_count: 123, revelation_type: 'Meccan' },
  { number: 12, name_en: 'Yusuf', name_ar: 'يوسف', english_translation: 'Joseph', verses_count: 111, revelation_type: 'Meccan' },
  { number: 13, name_en: 'Ar-Ra\'d', name_ar: 'الرعد', english_translation: 'The Thunder', verses_count: 43, revelation_type: 'Medinan' },
  { number: 14, name_en: 'Ibrahim', name_ar: 'إبراهيم', english_translation: 'Abraham', verses_count: 52, revelation_type: 'Meccan' },
  { number: 15, name_en: 'Al-Hijr', name_ar: 'الحجر', english_translation: 'The Rocky Tract', verses_count: 99, revelation_type: 'Meccan' },
  { number: 16, name_en: 'An-Nahl', name_ar: 'النحل', english_translation: 'The Bee', verses_count: 128, revelation_type: 'Meccan' },
  { number: 17, name_en: 'Al-Isra', name_ar: 'الإسراء', english_translation: 'The Night Journey', verses_count: 111, revelation_type: 'Meccan' },
  { number: 18, name_en: 'Al-Kahf', name_ar: 'الكهف', english_translation: 'The Cave', verses_count: 110, revelation_type: 'Meccan' },
  { number: 19, name_en: 'Maryam', name_ar: 'مريم', english_translation: 'Mary', verses_count: 98, revelation_type: 'Meccan' },
  { number: 20, name_en: 'Ta-Ha', name_ar: 'طه', english_translation: 'Ta-Ha', verses_count: 135, revelation_type: 'Meccan' },
  { number: 21, name_en: 'Al-Anbiya', name_ar: 'الأنبياء', english_translation: 'The Prophets', verses_count: 112, revelation_type: 'Meccan' },
  { number: 22, name_en: 'Al-Hajj', name_ar: 'الحج', english_translation: 'The Pilgrimage', verses_count: 78, revelation_type: 'Medinan' },
  { number: 23, name_en: 'Al-Mu\'minun', name_ar: 'المؤمنون', english_translation: 'The Believers', verses_count: 118, revelation_type: 'Meccan' },
  { number: 24, name_en: 'An-Nur', name_ar: 'النور', english_translation: 'The Light', verses_count: 64, revelation_type: 'Medinan' },
  { number: 25, name_en: 'Al-Furqan', name_ar: 'الفرقان', english_translation: 'The Criterion', verses_count: 77, revelation_type: 'Meccan' },
  { number: 36, name_en: 'Ya-Sin', name_ar: 'يس', english_translation: 'Ya-Sin', verses_count: 83, revelation_type: 'Meccan' },
  { number: 55, name_en: 'Ar-Rahman', name_ar: 'الرحمن', english_translation: 'The Beneficent', verses_count: 78, revelation_type: 'Medinan' },
  { number: 56, name_en: 'Al-Waqi\'ah', name_ar: 'الواقعة', english_translation: 'The Inevitable', verses_count: 96, revelation_type: 'Meccan' },
  { number: 67, name_en: 'Al-Mulk', name_ar: 'الملك', english_translation: 'The Sovereignty', verses_count: 30, revelation_type: 'Meccan' },
  { number: 112, name_en: 'Al-Ikhlas', name_ar: 'الإخلاص', english_translation: 'The Sincerity', verses_count: 4, revelation_type: 'Meccan' },
  { number: 113, name_en: 'Al-Falaq', name_ar: 'الفلق', english_translation: 'The Daybreak', verses_count: 5, revelation_type: 'Meccan' },
  { number: 114, name_en: 'An-Nas', name_ar: 'الناس', english_translation: 'Mankind', verses_count: 6, revelation_type: 'Meccan' }
];

// Helper audio URL generator using Mishary Rashid Alafasy via high-availability CDN
export const getAyahAudioUrl = (surah: number, ayah: number): string => {
  const s = String(surah).padStart(3, '0');
  const a = String(ayah).padStart(3, '0');
  return `https://everyayah.com/data/Alafasy_128kbps/${s}${a}.mp3`;
};

export const VERIFIED_QURAN_VERSES: QuranVerse[] = [
  // Surah Al-Fatihah (1:1 - 1:7)
  {
    id: 'q-1-1',
    surah_number: 1,
    surah_name_en: 'Al-Fatihah',
    surah_name_ar: 'الفاتحة',
    ayah_number: 1,
    arabic_text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    english_translation: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
    revelation_type: 'Meccan',
    tafsir_ibn_kathir: 'The Basmalah is an opening of blessings. Ibn Kathir explains that beginning actions with the Name of Allah invokes Divine assistance and blessing.',
    tafsir_as_sadi: 'Allah began His book with His greatest names Ar-Rahman and Ar-Rahim to signify that His mercy encompasses all things.',
    audio_url: getAyahAudioUrl(1, 1)
  },
  {
    id: 'q-1-2',
    surah_number: 1,
    surah_name_en: 'Al-Fatihah',
    surah_name_ar: 'الفاتحة',
    ayah_number: 2,
    arabic_text: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    english_translation: '[All] praise is [due] to Allah, Lord of the worlds -',
    revelation_type: 'Meccan',
    tafsir_ibn_kathir: 'Al-Hamd represents the highest praise and gratitude exclusively due to Allah for His perfect attributes and countless bounties.',
    tafsir_as_sadi: 'Rabb al-\'Alameen means the Creator, Provider, Master and Sustainer of everything in existence.',
    audio_url: getAyahAudioUrl(1, 2)
  },
  {
    id: 'q-1-3',
    surah_number: 1,
    surah_name_en: 'Al-Fatihah',
    surah_name_ar: 'الفاتحة',
    ayah_number: 3,
    arabic_text: 'الرَّحْمَٰنِ الرَّحِيمِ',
    english_translation: 'The Entirely Merciful, the Especially Merciful,',
    revelation_type: 'Meccan',
    tafsir_ibn_kathir: 'Ar-Rahman denotes the vast, all-encompassing mercy for all creation; Ar-Rahim denotes the specific mercy bestowed upon the believers.',
    audio_url: getAyahAudioUrl(1, 3)
  },
  {
    id: 'q-1-4',
    surah_number: 1,
    surah_name_en: 'Al-Fatihah',
    surah_name_ar: 'الفاتحة',
    ayah_number: 4,
    arabic_text: 'مَالِكِ يَوْمِ الدِّينِ',
    english_translation: 'Sovereign of the Day of Recompense.',
    revelation_type: 'Meccan',
    tafsir_ibn_kathir: 'On the Day of Judgment, all earthly claims of ownership cease and Allah alone manifests total sovereignty and justice.',
    audio_url: getAyahAudioUrl(1, 4)
  },
  {
    id: 'q-1-5',
    surah_number: 1,
    surah_name_en: 'Al-Fatihah',
    surah_name_ar: 'الفاتحة',
    ayah_number: 5,
    arabic_text: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
    english_translation: 'It is You we worship and You we ask for help.',
    revelation_type: 'Meccan',
    tafsir_ibn_kathir: 'This verse represents the core of Tawheed: dedicating all acts of worship exclusively to Allah and placing reliance entirely upon Him.',
    audio_url: getAyahAudioUrl(1, 5)
  },
  {
    id: 'q-1-6',
    surah_number: 1,
    surah_name_en: 'Al-Fatihah',
    surah_name_ar: 'الفاتحة',
    ayah_number: 6,
    arabic_text: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
    english_translation: 'Guide us to the straight path -',
    revelation_type: 'Meccan',
    tafsir_ibn_kathir: 'The straight path is Islam, following the Sunnah of the Messenger ﷺ and the companion predecessors.',
    audio_url: getAyahAudioUrl(1, 6)
  },
  {
    id: 'q-1-7',
    surah_number: 1,
    surah_name_en: 'Al-Fatihah',
    surah_name_ar: 'الفاتحة',
    ayah_number: 7,
    arabic_text: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
    english_translation: 'The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.',
    revelation_type: 'Meccan',
    tafsir_ibn_kathir: 'Those favored are the Prophets, the truthful (Siddiqeen), the martyrs (Shuhada), and the righteous (Salihin).',
    audio_url: getAyahAudioUrl(1, 7)
  },

  // Ayat al-Kursi (2:255)
  {
    id: 'q-2-255',
    surah_number: 2,
    surah_name_en: 'Al-Baqarah',
    surah_name_ar: 'البقرة',
    ayah_number: 255,
    arabic_text: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    english_translation: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of [all] existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is [presently] before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.',
    revelation_type: 'Medinan',
    tafsir_ibn_kathir: 'Ayat al-Kursi is the greatest verse in the Qur\'an as confirmed by Prophet Muhammad ﷺ in Sahih Muslim. It affirms the absolute Oneness, Life, Self-Subsistence, Omniscience, and Supreme Transcendence of Allah without slumber, fatigue or equals.',
    tafsir_as_sadi: 'This noble verse contains fifty words, each affirming the divine attributes of majesty, sovereignty, and perfection.',
    audio_url: getAyahAudioUrl(2, 255)
  },

  // Surah Al-Baqarah 285-286 (Amanar-Rasul)
  {
    id: 'q-2-285',
    surah_number: 2,
    surah_name_en: 'Al-Baqarah',
    surah_name_ar: 'البقرة',
    ayah_number: 285,
    arabic_text: 'آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ وَالْمُؤْمِنُونَ ۚ كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِّن رُّسُلِهِ ۚ وَقَالُوا سَمِعْنَا وَأَطَعْنَا ۖ غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ الْمَصِيرُ',
    english_translation: 'The Messenger has believed in what was revealed to him from his Lord, and [so have] the believers. All of them have believed in Allah and His angels and His books and His messengers, [saying], "We make no distinction between any of His messengers." And they say, "We hear and we obey. [We seek] Your forgiveness, our Lord, and to You is the [final] destination."',
    revelation_type: 'Medinan',
    tafsir_ibn_kathir: 'Whoever recites the last two verses of Surah Al-Baqarah at night, they will suffice him against harm (Sahih al-Bukhari 5009).',
    audio_url: getAyahAudioUrl(2, 285)
  },
  {
    id: 'q-2-286',
    surah_number: 2,
    surah_name_en: 'Al-Baqarah',
    surah_name_ar: 'البقرة',
    ayah_number: 286,
    arabic_text: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ ۗ رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا ۚ رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِن قَبْلِنَا ۚ رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ ۖ وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا ۚ أَنتَ مَوْلَانَا فَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ',
    english_translation: 'Allah does not charge a soul except [with that within] its capacity. It will have [the consequence of] what [good] it has gained, and it will bear [the consequence of] what [evil] it has earned. "Our Lord, do not impose blame upon us if we have forgotten or erred. Our Lord, and lay not upon us a burden like that which You laid upon those before us. Our Lord, and burden us not with that which we have no ability to bear. And pardon us; and forgive us; and have mercy upon us. You are our protector, so give us victory over the disbelieving people."',
    revelation_type: 'Medinan',
    tafsir_ibn_kathir: 'Allah does not burden any person beyond what they can bear. This demonstrates the Divine mercy and ease inherent in the Shariah.',
    audio_url: getAyahAudioUrl(2, 286)
  },

  // Surah Al-Ikhlas (112:1-4)
  {
    id: 'q-112-1',
    surah_number: 112,
    surah_name_en: 'Al-Ikhlas',
    surah_name_ar: 'الإخلاص',
    ayah_number: 1,
    arabic_text: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
    english_translation: 'Say, "He is Allah, [who is] One,',
    revelation_type: 'Meccan',
    tafsir_ibn_kathir: 'He is the Single, Unique, who has no peer, no minister, no rival, and no equal.',
    audio_url: getAyahAudioUrl(112, 1)
  },
  {
    id: 'q-112-2',
    surah_number: 112,
    surah_name_en: 'Al-Ikhlas',
    surah_name_ar: 'الإخلاص',
    ayah_number: 2,
    arabic_text: 'اللَّهُ الصَّمَدُ',
    english_translation: 'Allah, the Eternal Refuge.',
    revelation_type: 'Meccan',
    tafsir_ibn_kathir: 'As-Samad: Ibn Abbas stated it means the Master who is perfect in His sovereignty, the Self-Sufficient to whom all creatures turn for all needs.',
    audio_url: getAyahAudioUrl(112, 2)
  },
  {
    id: 'q-112-3',
    surah_number: 112,
    surah_name_en: 'Al-Ikhlas',
    surah_name_ar: 'الإخلاص',
    ayah_number: 3,
    arabic_text: 'لَمْ يَلِدْ وَلَمْ يُولَدْ',
    english_translation: 'He neither begets nor is born,',
    revelation_type: 'Meccan',
    tafsir_ibn_kathir: 'He has no child, no father, and no spouse.',
    audio_url: getAyahAudioUrl(112, 3)
  },
  {
    id: 'q-112-4',
    surah_number: 112,
    surah_name_en: 'Al-Ikhlas',
    surah_name_ar: 'الإخلاص',
    ayah_number: 4,
    arabic_text: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
    english_translation: 'Nor is there to Him any equivalent."',
    revelation_type: 'Meccan',
    tafsir_ibn_kathir: 'There is none comparable or equal to Him in His Names, Attributes, or Actions. It equals one-third of the Qur\'an (Sahih al-Bukhari).',
    audio_url: getAyahAudioUrl(112, 4)
  },

  // Surah Al-Falaq (113:1-5)
  {
    id: 'q-113-1',
    surah_number: 113,
    surah_name_en: 'Al-Falaq',
    surah_name_ar: 'الفلق',
    ayah_number: 1,
    arabic_text: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',
    english_translation: 'Say, "I seek refuge in the Lord of daybreak',
    revelation_type: 'Meccan',
    tafsir_ibn_kathir: 'Al-Falaq refers to the breaking of the morning light; seeking refuge in the Creator of the dawn against all dark evil.',
    audio_url: getAyahAudioUrl(113, 1)
  },
  {
    id: 'q-113-2',
    surah_number: 113,
    surah_name_en: 'Al-Falaq',
    surah_name_ar: 'الفلق',
    ayah_number: 2,
    arabic_text: 'مِن شَرِّ مَا خَلَقَ',
    english_translation: 'From the evil of that which He created',
    revelation_type: 'Meccan',
    audio_url: getAyahAudioUrl(113, 2)
  },

  // Surah An-Nas (114:1-6)
  {
    id: 'q-114-1',
    surah_number: 114,
    surah_name_en: 'An-Nas',
    surah_name_ar: 'الناس',
    ayah_number: 1,
    arabic_text: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
    english_translation: 'Say, "I seek refuge in the Lord of mankind,',
    revelation_type: 'Meccan',
    audio_url: getAyahAudioUrl(114, 1)
  },
  {
    id: 'q-114-2',
    surah_number: 114,
    surah_name_en: 'An-Nas',
    surah_name_ar: 'الناس',
    ayah_number: 2,
    arabic_text: 'مَلِكِ النَّاسِ',
    english_translation: 'The Sovereign of mankind,',
    revelation_type: 'Meccan',
    audio_url: getAyahAudioUrl(114, 2)
  },
  {
    id: 'q-114-3',
    surah_number: 114,
    surah_name_en: 'An-Nas',
    surah_name_ar: 'الناس',
    ayah_number: 3,
    arabic_text: 'إِلَٰهِ النَّاسِ',
    english_translation: 'The God of mankind,',
    revelation_type: 'Meccan',
    audio_url: getAyahAudioUrl(114, 3)
  },
  {
    id: 'q-114-4',
    surah_number: 114,
    surah_name_en: 'An-Nas',
    surah_name_ar: 'الناس',
    ayah_number: 4,
    arabic_text: 'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ',
    english_translation: 'From the evil of the retreating whisperer -',
    revelation_type: 'Meccan',
    tafsir_ibn_kathir: 'The Satan who whispers in the chest of man when he forgets Allah, but retreats when Allah is remembered.',
    audio_url: getAyahAudioUrl(114, 4)
  },

  // Surah Al-Mulk (67:1-2)
  {
    id: 'q-67-1',
    surah_number: 67,
    surah_name_en: 'Al-Mulk',
    surah_name_ar: 'الملك',
    ayah_number: 1,
    arabic_text: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
    english_translation: 'Blessed is He in whose hand is dominion, and He is over all things competent -',
    revelation_type: 'Meccan',
    tafsir_ibn_kathir: 'Surah Al-Mulk intercedes for its companion until he is forgiven, and protects from the punishment of the grave (Sunan at-Tirmidhi).',
    audio_url: getAyahAudioUrl(67, 1)
  },
  {
    id: 'q-67-2',
    surah_number: 67,
    surah_name_en: 'Al-Mulk',
    surah_name_ar: 'الملك',
    ayah_number: 2,
    arabic_text: 'الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ الْعَزِيزُ الْغَفُورُ',
    english_translation: '[He] who created death and life to test you [as to] which of you is best in deed - and He is the Exalted in Might, the Forgiving -',
    revelation_type: 'Meccan',
    tafsir_ibn_kathir: 'Fudayl ibn \'Iyad said: "Best in deed means most sincere (dedicated purely to Allah) and most correct (in accordance with the Sunnah)."',
    audio_url: getAyahAudioUrl(67, 2)
  }
];
