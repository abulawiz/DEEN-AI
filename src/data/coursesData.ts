import { Course } from '../types';

export const ISLAMIC_COURSES: Course[] = [
  // Course 1: Beginner - Foundations of Islam and Iman
  {
    id: 'course-beg-1',
    slug: 'foundations-of-islam-and-iman',
    title: 'Foundations of Islam & Iman',
    level: 'Beginner',
    description: 'A comprehensive entry-level study of the 5 Pillars of Islam, 6 Pillars of Faith (Iman), and the meaning of the two testimonies.',
    estimated_hours: 4,
    icon_name: 'BookOpen',
    modules: [
      {
        id: 'mod-1-1',
        title: 'Module 1: The Two Testimonies of Faith (Shahadatayn)',
        lessons: [
          {
            id: 'les-1-1-1',
            title: 'Meaning and Conditions of La Ilaha Illallah',
            summary: 'Understanding the negation and affirmation in the Shahadah, and its 7 essential conditions.',
            content: `The testimony **La Ilaha Illallah** is the key to Paradise. It consists of two essential pillars:
1. **An-Nafy (Negation):** "La Ilaha" denies that any entity, angel, prophet, or idol has any right to worship.
2. **Al-Ithbat (Affirmation):** "Illallah" affirms that worship in its entirety belongs solely and exclusively to Allah.

### The 7 Conditions of La Ilaha Illallah:
1. **Al-'Ilm (Knowledge):** Knowing its meaning, negating ignorance (Surah Muhammad 47:19).
2. **Al-Yaqeen (Certainty):** Complete conviction without doubt (Surah Al-Hujurat 49:15).
3. **Al-Qubul (Acceptance):** Wholeheartedly accepting its rulings and requirements.
4. **Al-Inqiyad (Submission):** Practical obedience and surrender to Allah's laws.
5. **As-Sidq (Truthfulness):** Sincere belief in the heart aligning with speech, refraining from hypocrisy.
6. **Al-Ikhlas (Sincerity):** Purifying all intentions for Allah alone.
7. **Al-Mahabbah (Love):** Loving this statement, what it indicates, and those who adhere to it.`,
            arabic_quotes: [
              {
                arabic: 'فَاعْلَمْ أَنَّهُ لَا إِلَٰهَ إِلَّا اللَّهُ وَاسْتَغْفِرْ لِذَنبِكَ',
                translation: 'So know, [O Muhammad], that there is no deity except Allah and ask forgiveness for your sin.',
                source: 'Surah Muhammad 47:19'
              }
            ],
            quiz: [
              {
                id: 'q-1-1-1-1',
                question: 'What are the two foundational pillars of the testimony "La Ilaha Illallah"?',
                options: [
                  'Creation and Sustenance',
                  'Negation (An-Nafy) and Affirmation (Al-Ithbat)',
                  'Mercy and Punishment',
                  'Life and Death'
                ],
                correct_index: 1,
                explanation: '"La Ilaha" negates all false gods, and "Illallah" affirms worship exclusively for Allah.'
              },
              {
                id: 'q-1-1-1-2',
                question: 'Which of the following is NOT one of the 7 conditions of La Ilaha Illallah?',
                options: [
                  'Certainty (Al-Yaqeen)',
                  'Wealth and social status',
                  'Sincerity (Al-Ikhlas)',
                  'Submission (Al-Inqiyad)'
                ],
                correct_index: 1,
                explanation: 'Wealth is not a religious condition for the validity of the Shahadah; rather knowledge, certainty, and sincerity are essential.'
              }
            ]
          },
          {
            id: 'les-1-1-2',
            title: 'Testifying that Muhammad is the Messenger of Allah ﷺ',
            summary: 'What it means to acknowledge Prophet Muhammad ﷺ as the final Messenger and follow his Sunnah.',
            content: `The second half of the Shahadah requires four fundamental commitments:
1. **Obeying him in what he commanded** without hesitation or reservation.
2. **Believing him in all that he informed us of** regarding the unseen, the past prophets, and the Day of Judgment.
3. **Refraining from what he prohibited and warned against**.
4. **Worshiping Allah only in the manner that he legislated**, avoiding innovations (Bid'ah) in religion.`,
            arabic_quotes: [
              {
                arabic: 'وَمَا آتَاكُمُ الرَّسُولُ فَخُذُوهُ وَمَا نَهَاكُمْ عَنْهُ فَانتَهُوا',
                translation: 'And whatever the Messenger has given you - take; and what he has forbidden you - refrain from.',
                source: 'Surah Al-Hashr 59:7'
              }
            ],
            quiz: [
              {
                id: 'q-1-1-2-1',
                question: 'What does worshiping Allah only as legislated by the Prophet ﷺ prevent in religion?',
                options: [
                  'Religious innovations (Bid\'ah)',
                  'Performing charity',
                  'Reciting Qur\'an',
                  'Traveling for knowledge'
                ],
                correct_index: 0,
                explanation: 'The Prophet ﷺ warned: "Whoever introduces into this affair of ours that which is not part of it, it will be rejected."'
              }
            ]
          }
        ]
      },
      {
        id: 'mod-1-2',
        title: 'Module 2: The Six Pillars of Iman',
        lessons: [
          {
            id: 'les-1-2-1',
            title: 'Belief in Allah, His Angels, and His Books',
            summary: 'Core tenants of Islamic faith as outlined in the Hadith of Jibreel.',
            content: `Faith (Iman) in Islam is speech of the tongue, belief in the heart, and actions of the limbs. It increases with obedience and decreases with disobedience.
The first three pillars of faith are:
1. **Belief in Allah:** In His Existence, Lordship (Rububiyyah), exclusive right to worship (Uluhiyyah), and His perfect Names and Attributes.
2. **Belief in the Angels:** Created from light, obedient servants of Allah who never disobey Him. Examples: Jibreel (revelation), Mika'eel (rain/provisions), Israfeel (blowing the trumpet), Malik (guardian of Hell).
3. **Belief in the Revealed Scriptures:** Including the Tawrah given to Musa, Injeel to 'Isa, Zabur to Dawud, Suhuf of Ibrahim, and the final unchanged criterion: the Holy Qur'an.`,
            arabic_quotes: [
              {
                arabic: 'آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ وَالْمُؤْمِنُونَ',
                translation: 'The Messenger has believed in what was revealed to him from his Lord, and so have the believers.',
                source: 'Surah Al-Baqarah 2:285'
              }
            ],
            quiz: [
              {
                id: 'q-1-2-1-1',
                question: 'Which angel is entrusted with bringing down Divine Revelation to the Prophets?',
                options: ['Mika\'eel', 'Jibreel (Gabriel)', 'Israfeel', 'Malik'],
                correct_index: 1,
                explanation: 'Jibreel (\'alayhis salam) is the trustworthy angel of Divine Revelation (Ruh al-Qudus).'
              }
            ]
          }
        ]
      }
    ]
  },

  // Course 2: Intermediate - The Pillars of Tawheed & Islamic Aqeedah
  {
    id: 'course-int-1',
    slug: 'the-pillars-of-tawheed-and-aqeedah',
    title: 'The Pillars of Tawheed & Aqeedah',
    level: 'Intermediate',
    description: 'Detailed study of the creed of Ahl us-Sunnah wal-Jama\'ah according to the Salaf, avoiding Shirk and deviations.',
    estimated_hours: 6,
    icon_name: 'ShieldCheck',
    modules: [
      {
        id: 'mod-2-1',
        title: 'Module 1: Warning Against Shirk (Major & Minor)',
        lessons: [
          {
            id: 'les-2-1-1',
            title: 'Major Shirk vs Minor Shirk: Definitions and Dangers',
            summary: 'Understanding the unpardonable sin of Shirk Akbar and the hidden peril of Shirk Asghar (Riya\').',
            content: `Shirk is associating partners with Allah in that which is unique to Him. It is the greatest injustice (Dhulm 'Azeem).

### 1. Major Shirk (Ash-Shirk al-Akbar):
- Nullifies Islam entirely.
- Removes a person from the fold of faith.
- If one dies upon it without repentance, Allah will never forgive it, and Paradise is made unlawful for him.
- Examples: Praying to other than Allah, seeking rescue (Istighathah) from the dead, sacrificing animals to jinn or graves, claiming knowledge of the unseen.

### 2. Minor Shirk (Ash-Shirk al-Asghar):
- Does not take one out of Islam, but is a tremendous sin greater than all major sins (Kabā'ir).
- Invalidates the specific deed in which it was mixed.
- Examples: **Ar-Riya'** (showing off in worship to be praised by people), swearing by other than Allah without believing that creation equals Allah in sanctity.`,
            arabic_quotes: [
              {
                arabic: 'إِنَّ اللَّهَ لَا يَغْفِرُ أَن يُشْرَكَ بِهِ وَيَغْفِرُ مَا دُونَ ذَٰلِكَ لِمَن يَشَاءُ',
                translation: 'Indeed, Allah does not forgive association with Him, but He forgives what is less than that for whom He wills.',
                source: 'Surah An-Nisa 4:48'
              }
            ],
            quiz: [
              {
                id: 'q-2-1-1-1',
                question: 'What is the Islamic ruling if someone dies upon Major Shirk without repenting?',
                options: [
                  'They are forgiven automatically after a period of time',
                  'Allah will never forgive it and Paradise is forbidden to them',
                  'It is considered a minor transgression',
                  'Their good deeds will outweigh it'
                ],
                correct_index: 1,
                explanation: 'Surah An-Nisa 4:48 and 4:116 explicitly state that Allah does not forgive Shirk if a person dies without repentance.'
              }
            ]
          }
        ]
      }
    ]
  },

  // Course 3: Advanced - Usul al-Fiqh and Hadith Terminology
  {
    id: 'course-adv-1',
    slug: 'usul-al-fiqh-and-mustalah-al-hadith',
    title: 'Mustalah al-Hadith (Hadith Terminology)',
    level: 'Advanced',
    description: 'Mastery of Hadith verification: Sanad, Matn, Sahih, Hasan, Da\'if, and the criteria of the classical Muhadditheen.',
    estimated_hours: 8,
    icon_name: 'Scroll',
    modules: [
      {
        id: 'mod-3-1',
        title: 'Module 1: The 5 Conditions of a Sahih Hadith',
        lessons: [
          {
            id: 'les-3-1-1',
            title: 'Rigorous Verification in the Science of Hadith',
            summary: 'The five mandatory criteria established by Imam al-Bukhari, Muslim, and the master traditionists for an authentic narration.',
            content: `A Hadith cannot be designated as **Sahih** (Sound/Authentic) unless it satisfies five strict conditions simultaneously:

1. **Ittisal as-Sanad (Unbroken Chain of Transmission):**
Every single narrator in the chain received the narration directly from the teacher preceding him from the Prophet ﷺ all the way to the author of the collection.

2. **'Adalah ar-Ruwat (Moral Integrity and Uprightness of Narrators):**
Every narrator in the chain must be a practicing, sane, truthful adult Muslim free of major sins, unrepentant minor sins, or breaches of customary dignity.

3. **Dabt ar-Ruwat (Precision and Retention of Narrators):**
Every narrator must possess acute memory (Dabt as-Sadr) or impeccably preserved, corroborated written notes (Dabt al-Kitab).

4. **'Adam ash-Shudhudh (Absence of Irregularity/Anomaly):**
The narration must not contradict a report narrated by someone more trustworthy or verified by a greater number of reliable transmitters.

5. **'Adam al-'Illah al-Qadihah (Absence of Hidden Detrimental Defects):**
The narration must be free of obscure, subtle defects that undermine its soundness, detectable only by critical Hadith masters.`,
            arabic_quotes: [
              {
                arabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا إِن جَاءَكُمْ فَاسِقٌ بِنَبَإٍ فَتَبَيَّنُوا',
                translation: 'O you who have believed, if there comes to you a disobedient one with information, investigate...',
                source: 'Surah Al-Hujurat 49:6'
              }
            ],
            quiz: [
              {
                id: 'q-3-1-1-1',
                question: 'How many conditions must be simultaneously satisfied for a Hadith to be classified as Sahih?',
                options: ['3', '4', '5', '7'],
                correct_index: 2,
                explanation: 'A Sahih Hadith requires 5 conditions: Connected chain, narrator integrity, narrator precision, absence of abnormality, and absence of subtle defect.'
              }
            ]
          }
        ]
      }
    ]
  }
];
