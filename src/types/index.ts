export type UserRole = 'user' | 'scholar_reviewer' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: UserRole;
  violation_count: number;
  is_suspended: boolean;
  restriction_until?: string | null;
  suspension_reason?: string | null;
  preferred_translation: string;
  arabic_font_size: 'text-xl' | 'text-2xl' | 'text-3xl';
  created_at: string;
}

export interface Citation {
  type: 'quran' | 'hadith' | 'tafsir' | 'scholar';
  reference: string;
  arabic?: string;
  text: string;
  grade?: 'Sahih' | 'Hasan' | 'Da\'if' | 'Mawdu\'';
  narrator?: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_role: 'user' | 'assistant' | 'system';
  content: string;
  arabic_content?: string;
  is_restricted_rejection?: boolean;
  rejection_reason?: string;
  citations?: Citation[];
  feedback_rating?: number; // 1 (helpful) or -1 (unhelpful)
  created_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  primary_category?: string;
  is_archived?: boolean;
  created_at: string;
  updated_at: string;
}

export interface SurahSummary {
  number: number;
  name_en: string;
  name_ar: string;
  english_translation: string;
  verses_count: number;
  revelation_type: 'Meccan' | 'Medinan';
}

export interface QuranVerse {
  id: string;
  surah_number: number;
  surah_name_en: string;
  surah_name_ar: string;
  ayah_number: number;
  arabic_text: string;
  english_translation: string;
  revelation_type: 'Meccan' | 'Medinan';
  tafsir_ibn_kathir?: string;
  tafsir_as_sadi?: string;
  audio_url?: string;
}

export type AuthenticityGrade = 'Sahih' | 'Hasan' | 'Da\'if' | 'Mawdu\'';

export interface HadithRecord {
  id: string;
  collection: string;
  collection_code: string; // 'bukhari' | 'muslim' | 'tirmidhi' | 'abu_dawud' | 'nawawi'
  hadith_number: string;
  chapter_name_en: string;
  chapter_name_ar?: string;
  narrator: string;
  arabic_text: string;
  english_text: string;
  authenticity_grade: AuthenticityGrade;
  graded_by: string;
  explanation: string;
  category: string;
  is_verified: boolean;
}

export interface AdhkarItem {
  id: string;
  category: 'morning' | 'evening' | 'daily' | 'sleep' | 'prayer';
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  repeat_count: number;
  reference: string;
  benefit: string;
}

export interface LibraryArticle {
  id: string;
  category_id: string;
  category_name: string;
  title: string;
  arabic_title?: string;
  author: string;
  summary: string;
  content: string;
  references: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
}

export interface CourseLesson {
  id: string;
  title: string;
  summary: string;
  content: string;
  arabic_quotes?: { arabic: string; translation: string; source: string }[];
  quiz?: QuizQuestion[];
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: CourseLesson[];
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  estimated_hours: number;
  icon_name: string;
  modules: CourseModule[];
}

export interface LearningProgress {
  user_id: string;
  course_id: string;
  completed_lessons: string[];
  quiz_scores: Record<string, number>;
  is_completed: boolean;
}

export interface UserViolation {
  id: string;
  user_id: string;
  user_name?: string;
  prompt_text: string;
  violation_level: number; // 1: polite, 2: reminder, 3: timeout, 4: flagged for admin
  detected_category: string;
  action_taken: string;
  created_at: string;
}

export interface AccountRestriction {
  id: string;
  user_id: string;
  restriction_type: 'timeout_15m' | 'timeout_24h' | 'admin_suspension';
  reason: string;
  starts_at: string;
  ends_at?: string;
  status: 'active' | 'expired' | 'lifted_by_admin' | 'appealed';
  appeal_text?: string;
  admin_notes?: string;
}

export interface TopicClassificationResult {
  is_islamic: boolean;
  confidence: number;
  matched_category?: string;
  reason?: string;
  suggested_islamic_topics: string[];
  violation_level?: number;
  is_emergency?: boolean;
}

export interface AdminStats {
  total_users: number;
  active_users: number;
  suspended_users: number;
  total_conversations: number;
  islamic_questions: number;
  rejected_questions: number;
  flagged_conversations: number;
  knowledge_resources: number;
}
