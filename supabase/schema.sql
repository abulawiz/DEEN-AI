-- ====================================================================
-- DEEN AI — SUPABASE POSTGRESQL DATABASE SCHEMA
-- Authentic Islamic AI Platform
-- Author: Abulawzat Digital Solution (Department of Computer Science)
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'scholar_reviewer', 'admin')),
    violation_count INT NOT NULL DEFAULT 0,
    is_suspended BOOLEAN NOT NULL DEFAULT false,
    restriction_until TIMESTAMPTZ,
    suspension_reason TEXT,
    preferred_translation TEXT DEFAULT 'Saheeh International',
    arabic_font_size TEXT DEFAULT 'text-2xl',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Islamic Categories Table
CREATE TABLE IF NOT EXISTS public.islamic_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name_en TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    description TEXT,
    icon_name TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Islamic Sources Reference Registry
CREATE TABLE IF NOT EXISTS public.islamic_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    title_ar TEXT,
    author TEXT NOT NULL,
    category_id UUID REFERENCES public.islamic_categories(id),
    source_type TEXT NOT NULL CHECK (source_type IN ('quran', 'hadith', 'tafsir', 'fiqh', 'aqeedah', 'scholarly_work')),
    publication_info TEXT,
    is_verified BOOLEAN NOT NULL DEFAULT true,
    verification_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Qur'an Verses Table
CREATE TABLE IF NOT EXISTS public.quran_verses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    surah_number INT NOT NULL CHECK (surah_number BETWEEN 1 AND 114),
    surah_name_en TEXT NOT NULL,
    surah_name_ar TEXT NOT NULL,
    ayah_number INT NOT NULL,
    arabic_text TEXT NOT NULL,
    english_translation TEXT NOT NULL,
    revelation_type TEXT CHECK (revelation_type IN ('Meccan', 'Medinan')),
    tafsir_ibn_kathir TEXT,
    tafsir_as_sadi TEXT,
    audio_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE (surah_number, ayah_number)
);

-- 6. Hadith Records Table
CREATE TABLE IF NOT EXISTS public.hadith_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    collection TEXT NOT NULL,
    collection_code TEXT NOT NULL,
    hadith_number TEXT NOT NULL,
    chapter_name_en TEXT,
    chapter_name_ar TEXT,
    narrator TEXT NOT NULL,
    arabic_text TEXT NOT NULL,
    english_text TEXT NOT NULL,
    authenticity_grade TEXT NOT NULL CHECK (authenticity_grade IN ('Sahih', 'Hasan', 'Da''if', 'Mawdu''')),
    graded_by TEXT NOT NULL DEFAULT 'Consensus of Ahl al-Hadith',
    explanation TEXT,
    category TEXT DEFAULT 'General',
    category_id UUID REFERENCES public.islamic_categories(id),
    is_verified BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. Tafsir Resources Table
CREATE TABLE IF NOT EXISTS public.tafsir_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    surah_number INT NOT NULL,
    ayah_number INT NOT NULL,
    scholar_name TEXT NOT NULL,
    tafsir_text TEXT NOT NULL,
    key_lessons TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. Conversations Table
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'New Islamic Consultation',
    primary_category TEXT,
    is_archived BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_role TEXT NOT NULL CHECK (sender_role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    arabic_content TEXT,
    is_restricted_rejection BOOLEAN NOT NULL DEFAULT false,
    rejection_reason TEXT,
    citations JSONB DEFAULT '[]'::jsonb,
    feedback_rating INT CHECK (feedback_rating IN (-1, 0, 1)),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. User Violations Table (Tracking progressive restriction)
CREATE TABLE IF NOT EXISTS public.user_violations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    user_name TEXT,
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE SET NULL,
    prompt_text TEXT NOT NULL,
    violation_level INT NOT NULL CHECK (violation_level >= 1),
    detected_category TEXT,
    action_taken TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. Account Restrictions & Appeals Table
CREATE TABLE IF NOT EXISTS public.account_restrictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    restriction_type TEXT NOT NULL CHECK (restriction_type IN ('timeout_15m', 'timeout_24h', 'admin_suspension')),
    reason TEXT NOT NULL,
    starts_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    ends_at TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'lifted_by_admin', 'appealed')),
    appeal_text TEXT,
    admin_notes TEXT,
    reviewed_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 12. Reported Answers Table (Scholar Review)
CREATE TABLE IF NOT EXISTS public.reported_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
    reported_by UUID NOT NULL REFERENCES public.profiles(id),
    report_reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'resolved', 'dismissed')),
    admin_resolution TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 13. User Feedback Table
CREATE TABLE IF NOT EXISTS public.user_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    message_id UUID REFERENCES public.messages(id) ON DELETE SET NULL,
    rating INT NOT NULL CHECK (rating IN (1, 2, 3, 4, 5)),
    comment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 14. Admin Roles & Audit Log Table
CREATE TABLE IF NOT EXISTS public.admin_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    granted_by UUID REFERENCES public.profiles(id),
    permissions JSONB NOT NULL DEFAULT '["manage_users", "review_violations", "manage_knowledge", "configure_ai"]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 15. Learning Courses Table
CREATE TABLE IF NOT EXISTS public.learning_courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    level TEXT NOT NULL CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
    description TEXT NOT NULL,
    estimated_hours INT DEFAULT 4,
    thumbnail_url TEXT,
    modules JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 16. Learning Progress Table
CREATE TABLE IF NOT EXISTS public.learning_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id TEXT NOT NULL,
    completed_lessons TEXT[] DEFAULT '{}',
    quiz_scores JSONB DEFAULT '{}'::jsonb,
    is_completed BOOLEAN NOT NULL DEFAULT false,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, course_id)
);

-- ====================================================================
-- HELPER FUNCTIONS & TRIGGERS
-- ====================================================================

-- Check if current authenticated user is an admin (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Automatically create a profile row when a new user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_restrictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reported_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.islamic_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.islamic_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quran_verses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hadith_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tafsir_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;

-- Public Read for Islamic Knowledge
CREATE POLICY "Public Read Quran" ON public.quran_verses FOR SELECT USING (true);
CREATE POLICY "Admins Manage Quran" ON public.quran_verses FOR ALL USING (public.is_admin());

CREATE POLICY "Public Read Hadith" ON public.hadith_records FOR SELECT USING (true);
CREATE POLICY "Admins Manage Hadith" ON public.hadith_records FOR ALL USING (public.is_admin());

CREATE POLICY "Public Read Tafsir" ON public.tafsir_resources FOR SELECT USING (true);
CREATE POLICY "Admins Manage Tafsir" ON public.tafsir_resources FOR ALL USING (public.is_admin());

CREATE POLICY "Public Read Categories" ON public.islamic_categories FOR SELECT USING (true);
CREATE POLICY "Public Read Sources" ON public.islamic_sources FOR SELECT USING (true);
CREATE POLICY "Public Read Courses" ON public.learning_courses FOR SELECT USING (true);

-- User Profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id OR public.is_admin());

-- Conversations
CREATE POLICY "Users can view own conversations" ON public.conversations FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users can insert own conversations" ON public.conversations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own conversations" ON public.conversations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own conversations" ON public.conversations FOR DELETE USING (auth.uid() = user_id);

-- Messages
CREATE POLICY "Users can view own conversation messages" ON public.messages FOR SELECT
USING (conversation_id IN (SELECT id FROM public.conversations WHERE user_id = auth.uid()) OR public.is_admin());
CREATE POLICY "Users can insert messages to own conversations" ON public.messages FOR INSERT
WITH CHECK (conversation_id IN (SELECT id FROM public.conversations WHERE user_id = auth.uid()));
CREATE POLICY "Users can update feedback on own messages" ON public.messages FOR UPDATE
USING (conversation_id IN (SELECT id FROM public.conversations WHERE user_id = auth.uid()));

-- Violations & Restrictions
CREATE POLICY "Users view own violations, admins view all" ON public.user_violations FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users insert own violations" ON public.user_violations FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users view/appeal own restrictions, admins manage all" ON public.account_restrictions FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users insert/appeal own restrictions" ON public.account_restrictions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update appeal or admins manage" ON public.account_restrictions FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());

-- Reported Answers & Feedback
CREATE POLICY "Users insert reported answers" ON public.reported_answers FOR INSERT WITH CHECK (auth.uid() = reported_by);
CREATE POLICY "Admins manage reported answers" ON public.reported_answers FOR ALL USING (public.is_admin());
CREATE POLICY "Users manage own feedback" ON public.user_feedback FOR ALL USING (auth.uid() = user_id);

-- Learning Progress
CREATE POLICY "Users can manage own learning progress" ON public.learning_progress FOR ALL USING (auth.uid() = user_id);

-- Admin Roles
CREATE POLICY "Admins manage admin_roles" ON public.admin_roles FOR ALL USING (public.is_admin());

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_quran_surah_ayah ON public.quran_verses(surah_number, ayah_number);
CREATE INDEX IF NOT EXISTS idx_hadith_collection ON public.hadith_records(collection_code, hadith_number);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_violations_user ON public.user_violations(user_id);
