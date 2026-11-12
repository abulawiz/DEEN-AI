import { LibraryArticle } from '../types';

export interface CategoryInfo {
  id: string;
  name: string;
  arabicName: string;
  description: string;
  icon: string;
}

export const ISLAMIC_CATEGORIES: CategoryInfo[] = [
  { id: 'aqeedah', name: 'Aqeedah', arabicName: 'العقيدة الإسلامية', description: 'The fundamentals of faith, Tawheed, and creed according to the Salaf as-Salih.', icon: 'ShieldCheck' },
  { id: 'fiqh', name: 'Fiqh', arabicName: 'الفقه الإسلامي', description: 'Islamic jurisprudence, Taharah, Salah, Zakat, Sawm, and rulings of worship.', icon: 'Scale' },
  { id: 'tafsir', name: 'Tafsir', arabicName: 'تفسير القرآن', description: 'Authentic explanations of the Qur\'an based on Ibn Kathir and As-Sa\'di.', icon: 'BookOpen' },
  { id: 'hadith', name: 'Hadith Sciences', arabicName: 'علوم الحديث', description: 'Methodology of Hadith verification, Sahih literature, and sanad preservation.', icon: 'Scroll' },
  { id: 'seerah', name: 'Seerah', arabicName: 'السيرة النبوية', description: 'The noble life, character, and battles of the final Messenger ﷺ.', icon: 'Compass' },
  { id: 'history', name: 'Islamic History', arabicName: 'التاريخ الإسلامي', description: 'The era of the Khulafa ar-Rashideen and the early righteous generations.', icon: 'Landmark' },
  { id: 'manners', name: 'Islamic Manners (Adab & Akhlaq)', arabicName: 'الآداب والأخلاق', description: 'Purification of the soul, modesty, truthfulness, and righteous character.', icon: 'Heart' },
  { id: 'family', name: 'Islamic Family Life', arabicName: 'الأسرة المسلمة', description: 'Islamic marriage, spousal rights, upbringing of children, and filial piety.', icon: 'Users' },
  { id: 'transactions', name: 'Islamic Transactions (Mu\'amalat)', arabicName: 'المعاملات المالية', description: 'Halal income, prohibition of Riba, contracts, and business ethics.', icon: 'Briefcase' },
  { id: 'adhkar', name: 'Daily Adhkar & Du\'a', arabicName: 'الأذكار والأدعية', description: 'Authentic remembrances and supplications for day and night from the Sunnah.', icon: 'Sun' }
];

export const LIBRARY_ARTICLES: LibraryArticle[] = [
  // 1. Aqeedah
  {
    id: 'lib-aq-1',
    category_id: 'aqeedah',
    category_name: 'Aqeedah',
    title: 'The Three Categories of Tawheed Explained',
    arabic_title: 'أقسام التوحيد الثلاثة',
    author: 'Based on the works of Imam Ibn Taymiyyah and Ibn al-Qayyim',
    summary: 'An authentic explanation of Tawheed ar-Rububiyyah, Tawheed al-Uluhiyyah, and Tawheed al-Asma\' was-Sifat.',
    content: `Tawheed (Islamic Monotheism) is the core foundation of Islam. Islamic scholars of Ahl us-Sunnah wal-Jama'ah, based on extensive inductive study of the Qur'an and Sunnah, categorized Tawheed into three inseparable divisions:

1. **Tawheed ar-Rububiyyah (Oneness of Lordship):**
Affirming that Allah alone is the sole Creator, Provider, Sustainer, and Sovereign Controller of the entire cosmos without any partner or assistant. Allah says: *"Unquestionably, to Him belongs the creation and the command; blessed is Allah, Lord of the worlds."* (Surah Al-A'raf, 7:54). Even the pre-Islamic pagans of Quraysh affirmed this aspect, yet it alone was not sufficient to enter them into Islam until they worshiped Him exclusively.

2. **Tawheed al-Uluhiyyah / al-'Ibadah (Oneness of Worship):**
Directing every act of worship—inward and outward—exclusively to Allah alone. This includes Du'a (supplication), Salah (prayer), Khawf (fear), Raja' (hope), Tawakkul (reliance), sacrifice, and vows. Allah says: *"And your Lord has decreed that you worship not except Him..."* (Surah Al-Isra, 17:23). This is the exact purpose for which all Prophets were sent and the point of conflict between the messengers and their peoples.

3. **Tawheed al-Asma' was-Sifat (Oneness of Allah's Names and Attributes):**
Affirming all the Names and Attributes that Allah affirmed for Himself in the Qur'an and that His Messenger ﷺ affirmed in authentic Hadith, in a manner befitting His Majesty:
- Without **Tahreef** (distortion or false metaphorical reinterpretation).
- Without **Ta'teel** (denial or negation of their reality).
- Without **Takyeef** (speculating on how their reality operates).
- Without **Tamtheel** (likening them to the attributes of creation).
As Allah affirmed in the definitive verse: *"There is nothing like unto Him, and He is the All-Hearing, the All-Seeing."* (Surah Ash-Shura, 42:11).`,
    references: [
      'Sharh al-Aqeedah al-Wasitiyyah by Ibn Taymiyyah',
      'Kitab at-Tawheed by Muhammad ibn Abdil-Wahhab',
      'Al-Qawl al-Mufeed by Shaykh Ibn Uthaymeen',
      'Surah Ash-Shura 42:11; Surah Al-Fatihah 1:5'
    ]
  },

  // 2. Fiqh
  {
    id: 'lib-fq-1',
    category_id: 'fiqh',
    category_name: 'Fiqh',
    title: 'Pillars, Obligations, and Conditions of the Daily Prayer (Salah)',
    arabic_title: 'شروط الصلاة وأركانها وواجباتها',
    author: 'Summarized from the classical Hanbali, Shafi\'i, and Maliki treatises',
    summary: 'A precise breakdown distinguishing the conditions (Shurut), pillars (Arkan), and obligations (Wajibat) of Salah.',
    content: `To ensure the validity of Salah, the worshiper must understand its three levels of requirements:

### I. The 9 Conditions of Salah (Shurut - prior to entering the prayer):
1. Islam.
2. Sanity / Sound intellect ('Aql).
3. Age of discernment (Tamyiz).
4. Removal of ritual impurity (Taharah from minor impurity via Wudu and major via Ghusl).
5. Removal of physical filth (Najasah) from body, clothes, and place of prayer.
6. Covering the 'Awrah with lawful, non-revealing clothing.
7. Entry of the prescribed prayer time (Dukhul al-Waqt).
8. Facing the direction of the Qiblah (Istiqlal al-Qiblah).
9. Intention in the heart (An-Niyyah) without vocalization.

### II. The 14 Pillars of Salah (Arkan - prayer is invalid if any is omitted, whether intentionally or forgetfully, unless rectified):
1. Standing (Qiyam) for the able in obligatory prayers.
2. The opening Takbeer (Takbeerat al-Ihram: saying "Allahu Akbar").
3. Recitation of Surah Al-Fatihah in every Rak'ah.
4. Ruku' (bowing).
5. Rising from Ruku' and standing upright.
6. Sujud (prostrating on the seven designated limbs: forehead/nose, both palms, both knees, and tips of both toes).
7. Rising from Sujud.
8. Sitting between the two prostrations.
9. Tranquility (Tuma'ninah) in all bodily postures.
10. The final Tashahhud.
11. Sitting for the final Tashahhud.
12. Sending blessings upon Prophet Muhammad ﷺ in the final Tashahhud.
13. The Taslim (saying "As-Salamu 'Alaykum wa Rahmatullah" to exit the prayer).
14. Observing the proper order between these pillars.

### III. Prostration of Forgetfulness (Sujud as-Sahw):
If an obligation (such as the first Tashahhud or saying "Subhana Rabbiyal-A'la" in Sujud) is omitted out of forgetfulness, it is rectified by performing two prostrations of forgetfulness at the end of the prayer.`,
    references: [
      'Al-Majmu\' Sharh al-Muhadhdhab by Imam an-Nawawi',
      'Al-Mughni by Imam Ibn Qudamah',
      'Sahih al-Bukhari 757 (Hadith of the man who prayed improperly)'
    ]
  },

  // 3. Tafsir
  {
    id: 'lib-tf-1',
    category_id: 'tafsir',
    category_name: 'Tafsir',
    title: 'The Principles of Tafsir: How the Salaf Interpreted the Qur\'an',
    arabic_title: 'أصول التفسير وقواعد فهم القرآن',
    author: 'Imam Ibn Kathir and Shaykh al-Islam Ibn Taymiyyah',
    summary: 'The hierarchical methodology of authentic Qur\'anic exegesis: Qur\'an by Qur\'an, Sunnah, Sahaba, and Tabi\'un.',
    content: `Imam Ibn Kathir established in the introduction to his magnificent *Tafsir al-Qur'an al-'Azeem* the precise scholarly criteria required for authentic Tafsir:

1. **Explaining the Qur'an by the Qur'an:**
What is mentioned concisely in one passage of the Qur'an is frequently elaborated and clarified in another verse. This is the highest and most authoritative form of Tafsir.

2. **Explaining the Qur'an by the Authentic Sunnah:**
The primary mission of the Messenger of Allah ﷺ was to explain and demonstrate the Qur'an in practical detail. Allah says: *"And We revealed to you the message that you may make clear to the people what was sent down to them."* (Surah An-Nahl, 16:44).

3. **Consulting the Explanations of the Sahabah:**
The companions witnessed the revelation firsthand, understood the Arabic language with native eloquence, and possessed the purest hearts. Prominent among them were 'Abdullah ibn 'Abbas (the "Translator of the Qur'an"), 'Abdullah ibn Mas'ud, and the Khulafa ar-Rashideen.

4. **Consulting the Explanations of the Senior Tabi'un:**
Scholars who studied directly under the Sahabah in Mecca, Medina, and Iraq, such as Mujahid ibn Jabr, Sa'id ibn Jubayr, 'Ikrimah, 'Ata ibn Abi Rabah, and Qatadah.

5. **Strict Prohibition of Tafsir bil-Ra'y al-Madhmoom (Subjective Opinion without Knowledge):**
The Prophet ﷺ said: *"Whoever speaks about the Qur'an without knowledge, let him take his seat in the Hellfire."* (Sunan at-Tirmidhi, Hasan).`,
    references: [
      'Muqaddimah fi Usul at-Tafsir by Shaykh al-Islam Ibn Taymiyyah',
      'Tafsir Ibn Kathir (Introduction)',
      'Tafsir Taysir al-Kareem ar-Rahman by Shaykh Abdur-Rahman as-Sa\'di'
    ]
  },

  // 4. Seerah
  {
    id: 'lib-sr-1',
    category_id: 'seerah',
    category_name: 'Seerah',
    title: 'The Prophetic Character: Mercy to All the Worlds',
    arabic_title: 'أخلاق النبي ﷺ: رحمة للعالمين',
    author: 'Summarized from Zad al-Ma\'ad and Ar-Raheeq al-Makhtum',
    summary: 'An exploration of the moral perfection, humility, forbearance, and justice of the Prophet Muhammad ﷺ.',
    content: `When the Mother of the Believers, 'A'ishah (may Allah be pleased with her), was asked about the character of the Prophet ﷺ, she answered concisely: *"His character was the Qur'an."* (Sahih Muslim 746). He lived every command, avoided every prohibition, and embodied every noble virtue revealed by Allah.

### Hallmark Traits of the Prophet ﷺ:
1. **Mercy and Forbearance:**
Even after years of persecution, boycott, and murder of his beloved companions by the Quraysh, upon the Conquest of Mecca (Fath Makkah) in 8 AH, standing victorious before his former oppressors, he declared: *"Go, for you are free!"*

2. **Humility (Tawadu'):**
Despite being the leader of all creation, he mended his own sandals, patched his garments, milked his sheep, served his family, and sat with the poorest companions without distinction.

3. **Truthfulness and Trustworthiness:**
Long before receiving revelation at age 40, his enemies recognized him by the title *As-Sadiq al-Ameen* (The Truthful, The Trustworthy).

4. **Courage and Steadfastness:**
In the fiercest heat of battle, such as the Battle of Hunayn, when lines broke, the Messenger of Allah ﷺ stood firm on his mount shouting: *"I am the Prophet without falsehood; I am the son of Abdul-Muttalib!"*`,
    references: [
      'Zad al-Ma\'ad fi Hady Khayr al-\'Ibad by Ibn al-Qayyim',
      'Ar-Raheeq al-Makhtum by Safiur-Rahman al-Mubarakpuri',
      'Ash-Shama\'il al-Muhammadiyyah by Imam at-Tirmidhi'
    ]
  },

  // 5. Islamic Manners
  {
    id: 'lib-mn-1',
    category_id: 'manners',
    category_name: 'Islamic Manners (Adab & Akhlaq)',
    title: 'The Greatness of Birr al-Walidayn (Righteousness to Parents)',
    arabic_title: 'بر الوالدين في ضوء الكتاب والسنة',
    author: 'Classical ethical compilation',
    summary: 'The supreme virtue, rights, and practical expressions of honoring one\'s mother and father in Islam.',
    content: `Allah has linked the command to worship Him alone directly with the obligation to treat parents with utmost excellence:
*"And your Lord has decreed that you not worship except Him, and to parents, good treatment. Whether one or both of them reach old age [while] with you, say not to them [so much as], 'uff,' and do not repel them but speak to them a noble word."* (Surah Al-Isra, 17:23-24).

### Key Rules of Righteousness to Parents:
1. **The Precedence of the Mother:**
A man came to the Messenger of Allah ﷺ and asked: *"Who among the people is most deserving of my fine companionship?"* The Prophet ﷺ replied: *"Your mother."* The man asked: *"Then who?"* He replied: *"Your mother."* He asked again: *"Then who?"* He replied: *"Your mother."* He asked a fourth time: *"Then who?"* He said: *"Then your father."* (Sahih al-Bukhari 5971, Sahih Muslim 2548).

2. **Obedience in Goodness:**
Obeying parents in all matters of good and permissible affairs is obligatory. However, if they command disobedience to Allah, there is no obedience to creation in disobedience to the Creator; yet, one must still treat them with worldly kindness.

3. **Honoring Parents after Their Demise:**
Righteousness does not end with death. Children can benefit deceased parents through continuous Du'a (supplication), giving Sadaqah Jariyah on their behalf, fulfilling their permissible wills, and maintaining bonds with their family and friends.`,
    references: [
      'Al-Adab al-Mufrad by Imam al-Bukhari',
      'Surah Al-Isra 17:23-24; Surah Luqman 31:14',
      'Sahih Muslim 2548'
    ]
  },

  // 6. Islamic Transactions
  {
    id: 'lib-tr-1',
    category_id: 'transactions',
    category_name: 'Islamic Transactions (Mu\'amalat)',
    title: 'The Islamic Principles of Halal Commerce and Wealth',
    arabic_title: 'ضوابط التجارة الحلال والتحذير من الربا والغرر',
    author: 'Compendium of Islamic Commercial Fiqh',
    summary: 'Essential guidelines governing contracts, trading, avoidance of usury (Riba), and excessive uncertainty (Gharar).',
    content: `The foundation of Islamic commercial law (Fiqh al-Mu'amalat) is permissibility (*Al-Aslu fil-Mu'amalati al-Ibahah*), with strict prohibitions against injustice, harm, deception, and exploitation.

### Core Prohibitions in Islamic Finance:
1. **Riba (Usury / Interest):**
Riba includes any guaranteed contractual excess or interest charged on loans (*Riba ad-Duyun*) or unequal exchange of specific commodities (*Riba al-Fadl*). Allah declared war against those who persist in Riba: *"O you who have believed, fear Allah and give up what remains [due to you] of interest, if you should be believers. And if you do not, then be informed of a war [against you] from Allah and His Messenger."* (Surah Al-Baqarah, 2:278-279).

2. **Gharar (Excessive Ambiguity and Uncertainty):**
The Prophet ﷺ forbade transactions involving Gharar (Sahih Muslim 1513), such as selling unborn calves, unharvested fruits before they ripen, or assets the seller does not possess or cannot deliver.

3. **Maysir & Qimar (Gambling):**
Any zero-sum transaction where a party risks money solely on chance or speculation is strictly forbidden.

4. **Honesty and Transparency in Trade:**
The Prophet ﷺ said: *"The truthful, trustworthy merchant will be with the Prophets, the truthful ones, and the martyrs on the Day of Resurrection."* (Jami' at-Tirmidhi 1209, Hasan). Concealing defects in merchandise invalidates the blessing (Barakah) of the sale.`,
    references: [
      'Al-Fawa\'id fi Ikhtisar al-Maqasid by Al-\'Izz ibn \'Abd al-Salam',
      'Bidayat al-Mujtahid by Ibn Rushd',
      'Sahih Muslim 1513, Jami\' at-Tirmidhi 1209'
    ]
  }
];
