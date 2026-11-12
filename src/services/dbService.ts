import {
  UserProfile,
  Conversation,
  Message,
  UserViolation,
  AccountRestriction,
  AdminStats,
  LearningProgress,
  QuranVerse,
  HadithRecord
} from '../types';
import { getSupabaseClient } from './supabaseClient';
import { VERIFIED_QURAN_VERSES } from '../data/quranData';
import { VERIFIED_HADITH_RECORDS } from '../data/hadithData';

// Storage Keys (Local Fallback Mode)
const STORAGE_PROFILES = 'deen_profiles_v1';
const STORAGE_CREDENTIALS = 'deen_credentials_v1';
const STORAGE_CURRENT_USER = 'deen_current_user_id';
const STORAGE_CONVERSATIONS = 'deen_conversations_v1';
const STORAGE_MESSAGES = 'deen_messages_v1';
const STORAGE_VIOLATIONS = 'deen_violations_v1';
const STORAGE_RESTRICTIONS = 'deen_restrictions_v1';
const STORAGE_PROGRESS = 'deen_learning_progress_v1';
const STORAGE_REPORTED_ANSWERS = 'deen_reported_answers_v1';
const STORAGE_CUSTOM_QURAN = 'deen_custom_quran_v1';
const STORAGE_CUSTOM_HADITH = 'deen_custom_hadith_v1';

// Seed default users for instant local testability when Supabase is not configured
const DEFAULT_USERS: UserProfile[] = [
  {
    id: 'user-admin-1',
    email: 'admin@deen.ai',
    full_name: 'Shaykh Ahmad Al-Amin (Admin)',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    role: 'admin',
    violation_count: 0,
    is_suspended: false,
    preferred_translation: 'Saheeh International',
    arabic_font_size: 'text-2xl',
    created_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'user-member-1',
    email: 'tariq@deen.ai',
    full_name: 'Tariq Mansoor',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    role: 'user',
    violation_count: 0,
    is_suspended: false,
    preferred_translation: 'Saheeh International',
    arabic_font_size: 'text-2xl',
    created_at: '2026-02-10T12:00:00Z'
  }
];

const getStored = <T>(key: string, defaultValue: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const setStored = <T>(key: string, value: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage set failed', e);
  }
};

export class DBService {
  // --- CONNECTION TEST ---
  public static async testConnection(): Promise<{ ok: boolean; message: string }> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { ok: false, message: 'Supabase URL or Anon Key is not configured.' };
    }
    try {
      const { error } = await supabase.from('islamic_categories').select('id').limit(1);
      if (error) {
        return { ok: false, message: `Supabase query error: ${error.message}` };
      }
      return { ok: true, message: 'Connected to Supabase PostgreSQL successfully!' };
    } catch (err) {
      return {
        ok: false,
        message: err instanceof Error ? err.message : 'Failed to reach Supabase.'
      };
    }
  }

  // --- SUPABASE & LOCAL AUTH HELPERS ---
  private static getLocalCredentials(): Record<string, string> {
    return getStored<Record<string, string>>(STORAGE_CREDENTIALS, {
      'admin@deen.ai': 'Admin@123',
      'tariq@deen.ai': 'User@123'
    });
  }

  public static async signInWithPassword(email: string, password: string): Promise<UserProfile> {
    const cleanEmail = email.trim().toLowerCase();
    const supabase = getSupabaseClient();
    if (!supabase) {
      const profiles = getStored<UserProfile[]>(STORAGE_PROFILES, DEFAULT_USERS);
      const user = profiles.find(p => p.email.toLowerCase() === cleanEmail);
      const creds = this.getLocalCredentials();
      if (!user || creds[cleanEmail] !== password) {
        throw new Error('Invalid email or password.');
      }
      localStorage.setItem(STORAGE_CURRENT_USER, user.id);
      return user;
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
    if (error) throw new Error(error.message);
    if (!data.user) throw new Error('Authentication failed.');
    return this.ensureProfileFromAuthUser(data.user);
  }

  public static async signUpWithPassword(
    email: string,
    password: string,
    fullName: string
  ): Promise<{ user: UserProfile | null; needsEmailConfirmation: boolean }> {
    const cleanEmail = email.trim().toLowerCase();
    const supabase = getSupabaseClient();
    if (!supabase) {
      const profiles = getStored<UserProfile[]>(STORAGE_PROFILES, DEFAULT_USERS);
      if (profiles.some(p => p.email.toLowerCase() === cleanEmail)) {
        throw new Error('An account with this email already exists. Please sign in.');
      }
      const creds = this.getLocalCredentials();
      creds[cleanEmail] = password;
      setStored(STORAGE_CREDENTIALS, creds);
      const user = await this.registerUser(cleanEmail, fullName.trim(), 'user');
      return { user, needsEmailConfirmation: false };
    }
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: { full_name: fullName.trim() }
      }
    });
    if (error) throw new Error(error.message);
    if (data.user && data.session) {
      const profile = await this.ensureProfileFromAuthUser(data.user);
      return { user: profile, needsEmailConfirmation: false };
    }
    return { user: null, needsEmailConfirmation: true };
  }

  public static async resetPasswordForEmail(email: string): Promise<void> {
    const cleanEmail = email.trim().toLowerCase();
    const supabase = getSupabaseClient();
    if (!supabase) {
      const profiles = getStored<UserProfile[]>(STORAGE_PROFILES, DEFAULT_USERS);
      if (!profiles.some(p => p.email.toLowerCase() === cleanEmail)) {
        throw new Error('No account found with that email address.');
      }
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo: window.location.origin
    });
    if (error) throw new Error(error.message);
  }

  public static async updatePassword(newPassword: string, email?: string): Promise<void> {
    if (newPassword.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }
    const supabase = getSupabaseClient();
    if (supabase) {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw new Error(error.message);
      return;
    }
    if (email) {
      const creds = this.getLocalCredentials();
      creds[email.trim().toLowerCase()] = newPassword;
      setStored(STORAGE_CREDENTIALS, creds);
    }
  }

  public static async signOut(): Promise<void> {
    localStorage.removeItem(STORAGE_CURRENT_USER);
    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
  }

  private static async ensureProfileFromAuthUser(authUser: {
    id: string;
    email?: string;
    user_metadata?: Record<string, any>;
  }): Promise<UserProfile> {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Supabase client unavailable');

    const { data: existing, error: fetchErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .maybeSingle();

    if (!fetchErr && existing) {
      return existing as UserProfile;
    }

    const fallbackProfile: UserProfile = {
      id: authUser.id,
      email: authUser.email || '',
      full_name:
        authUser.user_metadata?.full_name ||
        authUser.email?.split('@')[0] ||
        'Muslim Learner',
      avatar_url: authUser.user_metadata?.avatar_url,
      role: 'user',
      violation_count: 0,
      is_suspended: false,
      preferred_translation: 'Saheeh International',
      arabic_font_size: 'text-2xl',
      created_at: new Date().toISOString()
    };

    const { data: inserted } = await supabase
      .from('profiles')
      .upsert({
        id: fallbackProfile.id,
        email: fallbackProfile.email,
        full_name: fallbackProfile.full_name,
        avatar_url: fallbackProfile.avatar_url || null,
        role: fallbackProfile.role,
        preferred_translation: fallbackProfile.preferred_translation,
        arabic_font_size: fallbackProfile.arabic_font_size
      })
      .select('*')
      .maybeSingle();

    return (inserted as UserProfile) || fallbackProfile;
  }

  // --- PROFILES & AUTH ---
  public static async getCurrentUser(): Promise<UserProfile | null> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        return this.ensureProfileFromAuthUser(data.user);
      }
      return null;
    }

    const currentId = localStorage.getItem(STORAGE_CURRENT_USER);
    if (!currentId) return null;

    const profiles = getStored<UserProfile[]>(STORAGE_PROFILES, DEFAULT_USERS);
    return profiles.find(p => p.id === currentId) || null;
  }

  public static async setCurrentUser(userId: string): Promise<UserProfile | null> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      if (data) return data as UserProfile;
    }

    const profiles = getStored<UserProfile[]>(STORAGE_PROFILES, DEFAULT_USERS);
    const user = profiles.find(p => p.id === userId);
    if (user) {
      localStorage.setItem(STORAGE_CURRENT_USER, user.id);
      return user;
    }
    return null;
  }

  public static async getAllUsers(): Promise<UserProfile[]> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data as UserProfile[];
    }
    return getStored<UserProfile[]>(STORAGE_PROFILES, DEFAULT_USERS);
  }

  public static async updateUserProfile(
    updated: Partial<UserProfile> & { id: string }
  ): Promise<UserProfile> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { id, ...fields } = updated;
      const { data, error } = await supabase
        .from('profiles')
        .update({ ...fields, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select('*')
        .single();
      if (!error && data) return data as UserProfile;
    }

    const profiles = getStored<UserProfile[]>(STORAGE_PROFILES, DEFAULT_USERS);
    const index = profiles.findIndex(p => p.id === updated.id);
    if (index !== -1) {
      profiles[index] = { ...profiles[index], ...updated };
      setStored(STORAGE_PROFILES, profiles);
      return profiles[index];
    }
    throw new Error('User not found');
  }

  public static async registerUser(
    email: string,
    fullName: string,
    role: 'user' | 'admin' = 'user'
  ): Promise<UserProfile> {
    const profiles = getStored<UserProfile[]>(STORAGE_PROFILES, DEFAULT_USERS);
    const existing = profiles.find(p => p.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      localStorage.setItem(STORAGE_CURRENT_USER, existing.id);
      return existing;
    }
    const newUser: UserProfile = {
      id: 'user-' + Date.now(),
      email,
      full_name: fullName,
      role,
      violation_count: 0,
      is_suspended: false,
      preferred_translation: 'Saheeh International',
      arabic_font_size: 'text-2xl',
      created_at: new Date().toISOString()
    };
    profiles.push(newUser);
    setStored(STORAGE_PROFILES, profiles);
    localStorage.setItem(STORAGE_CURRENT_USER, newUser.id);
    return newUser;
  }

  // --- CONVERSATIONS ---
  public static async getConversations(userId: string): Promise<Conversation[]> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', userId)
        .eq('is_archived', false)
        .order('updated_at', { ascending: false });
      if (!error && data) return data as Conversation[];
    }

    const convs = getStored<Conversation[]>(STORAGE_CONVERSATIONS, []);
    return convs
      .filter(c => c.user_id === userId && !c.is_archived)
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  }

  public static async createConversation(
    userId: string,
    title = 'New Islamic Consultation'
  ): Promise<Conversation> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('conversations')
        .insert({ user_id: userId, title })
        .select('*')
        .single();
      if (!error && data) return data as Conversation;
    }

    const convs = getStored<Conversation[]>(STORAGE_CONVERSATIONS, []);
    const newConv: Conversation = {
      id: 'conv-' + Date.now(),
      user_id: userId,
      title,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    convs.unshift(newConv);
    setStored(STORAGE_CONVERSATIONS, convs);
    return newConv;
  }

  public static async updateConversationTitle(id: string, title: string): Promise<void> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { error } = await supabase
        .from('conversations')
        .update({ title, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (!error) return;
    }

    const convs = getStored<Conversation[]>(STORAGE_CONVERSATIONS, []);
    const conv = convs.find(c => c.id === id);
    if (conv) {
      conv.title = title;
      conv.updated_at = new Date().toISOString();
      setStored(STORAGE_CONVERSATIONS, convs);
    }
  }

  public static async deleteConversation(id: string): Promise<void> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { error } = await supabase.from('conversations').delete().eq('id', id);
      if (!error) return;
    }

    const convs = getStored<Conversation[]>(STORAGE_CONVERSATIONS, []);
    setStored(
      STORAGE_CONVERSATIONS,
      convs.filter(c => c.id !== id)
    );

    const msgs = getStored<Message[]>(STORAGE_MESSAGES, []);
    setStored(
      STORAGE_MESSAGES,
      msgs.filter(m => m.conversation_id !== id)
    );
  }

  // --- MESSAGES ---
  public static async getMessages(conversationId: string): Promise<Message[]> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
      if (!error && data) return data as Message[];
    }

    const msgs = getStored<Message[]>(STORAGE_MESSAGES, []);
    return msgs
      .filter(m => m.conversation_id === conversationId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }

  public static async saveMessage(msg: Omit<Message, 'id' | 'created_at'>): Promise<Message> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: msg.conversation_id,
          sender_role: msg.sender_role,
          content: msg.content,
          arabic_content: msg.arabic_content || null,
          is_restricted_rejection: Boolean(msg.is_restricted_rejection),
          rejection_reason: msg.rejection_reason || null,
          citations: msg.citations || [],
          feedback_rating: msg.feedback_rating ?? null
        })
        .select('*')
        .single();

      if (!error && data) {
        await supabase
          .from('conversations')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', msg.conversation_id);
        return data as Message;
      }
    }

    const msgs = getStored<Message[]>(STORAGE_MESSAGES, []);
    const newMsg: Message = {
      ...msg,
      id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      created_at: new Date().toISOString()
    };
    msgs.push(newMsg);
    setStored(STORAGE_MESSAGES, msgs);

    const convs = getStored<Conversation[]>(STORAGE_CONVERSATIONS, []);
    const conv = convs.find(c => c.id === msg.conversation_id);
    if (conv) {
      conv.updated_at = new Date().toISOString();
      setStored(STORAGE_CONVERSATIONS, convs);
    }

    return newMsg;
  }

  public static async setMessageFeedback(messageId: string, rating: number): Promise<void> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { error } = await supabase
        .from('messages')
        .update({ feedback_rating: rating })
        .eq('id', messageId);
      if (!error) return;
    }

    const msgs = getStored<Message[]>(STORAGE_MESSAGES, []);
    const msg = msgs.find(m => m.id === messageId);
    if (msg) {
      msg.feedback_rating = rating;
      setStored(STORAGE_MESSAGES, msgs);
    }
  }

  public static async reportMessage(
    messageId: string,
    reportedBy: string,
    reason: string
  ): Promise<void> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { error } = await supabase.from('reported_answers').insert({
        message_id: messageId,
        reported_by: reportedBy,
        report_reason: reason,
        status: 'pending'
      });
      if (!error) return;
    }

    const reports = getStored<any[]>(STORAGE_REPORTED_ANSWERS, []);
    reports.push({
      id: 'rep-' + Date.now(),
      message_id: messageId,
      reported_by: reportedBy,
      report_reason: reason,
      status: 'pending',
      created_at: new Date().toISOString()
    });
    setStored(STORAGE_REPORTED_ANSWERS, reports);
  }

  public static async getReportedAnswers(): Promise<any[]> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('reported_answers')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data;
    }
    return getStored<any[]>(STORAGE_REPORTED_ANSWERS, []);
  }

  public static async resolveReportedAnswer(
    reportId: string,
    resolution: string,
    status: 'resolved' | 'dismissed'
  ): Promise<void> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { error } = await supabase
        .from('reported_answers')
        .update({ status, admin_resolution: resolution })
        .eq('id', reportId);
      if (!error) return;
    }

    const reports = getStored<any[]>(STORAGE_REPORTED_ANSWERS, []);
    const report = reports.find(r => r.id === reportId);
    if (report) {
      report.status = status;
      report.admin_resolution = resolution;
      setStored(STORAGE_REPORTED_ANSWERS, reports);
    }
  }

  // --- VIOLATIONS & RESTRICTIONS ---
  public static async recordViolation(
    userId: string,
    prompt: string,
    level: number,
    detectedCategory: string,
    actionTaken: string,
    timeoutMinutes?: number
  ): Promise<UserProfile> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      await supabase.from('user_violations').insert({
        user_id: userId,
        user_name: userProfile?.full_name || 'Member',
        prompt_text: prompt,
        violation_level: level,
        detected_category: detectedCategory,
        action_taken: actionTaken
      });

      const until = timeoutMinutes
        ? new Date(Date.now() + timeoutMinutes * 60 * 1000).toISOString()
        : userProfile?.restriction_until || null;

      if (timeoutMinutes) {
        await supabase.from('account_restrictions').insert({
          user_id: userId,
          restriction_type: timeoutMinutes >= 1440 ? 'admin_suspension' : 'timeout_15m',
          reason: actionTaken,
          starts_at: new Date().toISOString(),
          ends_at: until,
          status: 'active'
        });
      }

      const { data: updatedProfile, error } = await supabase
        .from('profiles')
        .update({
          violation_count: (userProfile?.violation_count || 0) + 1,
          restriction_until: until,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select('*')
        .single();

      if (!error && updatedProfile) return updatedProfile as UserProfile;
    }

    const violations = getStored<UserViolation[]>(STORAGE_VIOLATIONS, []);
    const profiles = getStored<UserProfile[]>(STORAGE_PROFILES, DEFAULT_USERS);
    const user = profiles.find(p => p.id === userId);

    violations.unshift({
      id: 'viol-' + Date.now(),
      user_id: userId,
      user_name: user?.full_name || 'Member',
      prompt_text: prompt,
      violation_level: level,
      detected_category: detectedCategory,
      action_taken: actionTaken,
      created_at: new Date().toISOString()
    });
    setStored(STORAGE_VIOLATIONS, violations);

    if (user) {
      user.violation_count = (user.violation_count || 0) + 1;
      if (timeoutMinutes) {
        const until = new Date(Date.now() + timeoutMinutes * 60 * 1000).toISOString();
        user.restriction_until = until;

        const restrictions = getStored<AccountRestriction[]>(STORAGE_RESTRICTIONS, []);
        restrictions.unshift({
          id: 'rest-' + Date.now(),
          user_id: userId,
          restriction_type: timeoutMinutes >= 1440 ? 'admin_suspension' : 'timeout_15m',
          reason: actionTaken,
          starts_at: new Date().toISOString(),
          ends_at: until,
          status: 'active'
        });
        setStored(STORAGE_RESTRICTIONS, restrictions);
      }
      setStored(STORAGE_PROFILES, profiles);
      return user;
    }
    throw new Error('User not found');
  }

  public static async submitAppeal(userId: string, appealText: string): Promise<void> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { error } = await supabase
        .from('account_restrictions')
        .update({ appeal_text: appealText, status: 'appealed' })
        .eq('user_id', userId)
        .eq('status', 'active');
      if (!error) return;
    }

    const restrictions = getStored<AccountRestriction[]>(STORAGE_RESTRICTIONS, []);
    const userRest = restrictions.find(r => r.user_id === userId && r.status === 'active');
    if (userRest) {
      userRest.appeal_text = appealText;
      userRest.status = 'appealed';
      setStored(STORAGE_RESTRICTIONS, restrictions);
    }
  }

  public static async getAllViolations(): Promise<UserViolation[]> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('user_violations')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data as UserViolation[];
    }
    return getStored<UserViolation[]>(STORAGE_VIOLATIONS, []);
  }

  public static async getAllRestrictions(): Promise<AccountRestriction[]> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('account_restrictions')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data as AccountRestriction[];
    }
    return getStored<AccountRestriction[]>(STORAGE_RESTRICTIONS, []);
  }

  public static async liftRestriction(
    userId: string,
    adminNotes = 'Lifted by Admin'
  ): Promise<void> {
    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase
        .from('profiles')
        .update({
          restriction_until: null,
          is_suspended: false,
          violation_count: 0,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      await supabase
        .from('account_restrictions')
        .update({ status: 'lifted_by_admin', admin_notes: adminNotes })
        .eq('user_id', userId)
        .in('status', ['active', 'appealed']);
      return;
    }

    const profiles = getStored<UserProfile[]>(STORAGE_PROFILES, DEFAULT_USERS);
    const user = profiles.find(p => p.id === userId);
    if (user) {
      user.restriction_until = null;
      user.is_suspended = false;
      user.violation_count = 0;
      setStored(STORAGE_PROFILES, profiles);
    }
    const restrictions = getStored<AccountRestriction[]>(STORAGE_RESTRICTIONS, []);
    restrictions.forEach(r => {
      if (r.user_id === userId && (r.status === 'active' || r.status === 'appealed')) {
        r.status = 'lifted_by_admin';
        r.admin_notes = adminNotes;
      }
    });
    setStored(STORAGE_RESTRICTIONS, restrictions);
  }

  public static async toggleUserSuspension(
    userId: string,
    reason?: string
  ): Promise<UserProfile> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data: existing } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (existing) {
        const nextSuspended = !existing.is_suspended;
        const { data: updated, error } = await supabase
          .from('profiles')
          .update({
            is_suspended: nextSuspended,
            suspension_reason: nextSuspended ? reason || 'Suspended by Administrator' : null,
            restriction_until: nextSuspended ? existing.restriction_until : null,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId)
          .select('*')
          .single();
        if (!error && updated) return updated as UserProfile;
      }
    }

    const profiles = getStored<UserProfile[]>(STORAGE_PROFILES, DEFAULT_USERS);
    const user = profiles.find(p => p.id === userId);
    if (!user) throw new Error('User not found');
    user.is_suspended = !user.is_suspended;
    user.suspension_reason = user.is_suspended
      ? reason || 'Suspended by Administrator'
      : null;
    if (!user.is_suspended) {
      user.restriction_until = null;
    }
    setStored(STORAGE_PROFILES, profiles);
    return user;
  }

  // --- LEARNING PROGRESS ---
  public static async getLearningProgress(
    userId: string,
    courseId: string
  ): Promise<LearningProgress> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('learning_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .maybeSingle();
      if (!error && data) {
        return {
          user_id: data.user_id,
          course_id: data.course_id,
          completed_lessons: data.completed_lessons || [],
          quiz_scores: data.quiz_scores || {},
          is_completed: Boolean(data.is_completed)
        };
      }
    }

    const allProgress = getStored<Record<string, LearningProgress>>(STORAGE_PROGRESS, {});
    const key = `${userId}_${courseId}`;
    return (
      allProgress[key] || {
        user_id: userId,
        course_id: courseId,
        completed_lessons: [],
        quiz_scores: {},
        is_completed: false
      }
    );
  }

  public static async completeLesson(
    userId: string,
    courseId: string,
    lessonId: string
  ): Promise<LearningProgress> {
    const current = await this.getLearningProgress(userId, courseId);
    if (!current.completed_lessons.includes(lessonId)) {
      current.completed_lessons = [...current.completed_lessons, lessonId];
    }

    const supabase = getSupabaseClient();
    if (supabase) {
      const { error } = await supabase.from('learning_progress').upsert(
        {
          user_id: userId,
          course_id: courseId,
          completed_lessons: current.completed_lessons,
          quiz_scores: current.quiz_scores,
          is_completed: current.is_completed,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'user_id,course_id' }
      );
      if (!error) return current;
    }

    const allProgress = getStored<Record<string, LearningProgress>>(STORAGE_PROGRESS, {});
    allProgress[`${userId}_${courseId}`] = current;
    setStored(STORAGE_PROGRESS, allProgress);
    return current;
  }

  public static async saveQuizScore(
    userId: string,
    courseId: string,
    quizId: string,
    score: number
  ): Promise<LearningProgress> {
    const current = await this.getLearningProgress(userId, courseId);
    current.quiz_scores = { ...current.quiz_scores, [quizId]: score };

    const supabase = getSupabaseClient();
    if (supabase) {
      const { error } = await supabase.from('learning_progress').upsert(
        {
          user_id: userId,
          course_id: courseId,
          completed_lessons: current.completed_lessons,
          quiz_scores: current.quiz_scores,
          is_completed: current.is_completed,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'user_id,course_id' }
      );
      if (!error) return current;
    }

    const allProgress = getStored<Record<string, LearningProgress>>(STORAGE_PROGRESS, {});
    allProgress[`${userId}_${courseId}`] = current;
    setStored(STORAGE_PROGRESS, allProgress);
    return current;
  }

  // --- KNOWLEDGE BASE MANAGEMENT ---
  public static async getCustomQuranVerses(): Promise<QuranVerse[]> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('quran_verses')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data as QuranVerse[];
    }
    return getStored<QuranVerse[]>(STORAGE_CUSTOM_QURAN, []);
  }

  public static async addCustomQuranVerse(
    verse: Omit<QuranVerse, 'id'>
  ): Promise<QuranVerse> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('quran_verses')
        .insert({
          surah_number: verse.surah_number,
          surah_name_en: verse.surah_name_en,
          surah_name_ar: verse.surah_name_ar,
          ayah_number: verse.ayah_number,
          arabic_text: verse.arabic_text,
          english_translation: verse.english_translation,
          revelation_type: verse.revelation_type || null,
          tafsir_ibn_kathir: verse.tafsir_ibn_kathir || null,
          tafsir_as_sadi: verse.tafsir_as_sadi || null,
          audio_url: verse.audio_url || null
        })
        .select('*')
        .single();
      if (!error && data) return data as QuranVerse;
    }

    const verses = getStored<QuranVerse[]>(STORAGE_CUSTOM_QURAN, []);
    const newV: QuranVerse = {
      ...verse,
      id: 'custom-q-' + Date.now()
    };
    verses.unshift(newV);
    setStored(STORAGE_CUSTOM_QURAN, verses);
    return newV;
  }

  public static async getCustomHadiths(): Promise<HadithRecord[]> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('hadith_records')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data as HadithRecord[];
    }
    return getStored<HadithRecord[]>(STORAGE_CUSTOM_HADITH, []);
  }

  public static async addCustomHadith(
    hadith: Omit<HadithRecord, 'id' | 'is_verified'>
  ): Promise<HadithRecord> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('hadith_records')
        .insert({
          collection: hadith.collection,
          collection_code: hadith.collection_code,
          hadith_number: hadith.hadith_number,
          chapter_name_en: hadith.chapter_name_en,
          chapter_name_ar: hadith.chapter_name_ar || null,
          narrator: hadith.narrator,
          arabic_text: hadith.arabic_text,
          english_text: hadith.english_text,
          authenticity_grade: hadith.authenticity_grade,
          graded_by: hadith.graded_by,
          explanation: hadith.explanation,
          category: hadith.category,
          is_verified: true
        })
        .select('*')
        .single();
      if (!error && data) return data as HadithRecord;
    }

    const hadiths = getStored<HadithRecord[]>(STORAGE_CUSTOM_HADITH, []);
    const newH: HadithRecord = {
      ...hadith,
      id: 'custom-h-' + Date.now(),
      is_verified: true
    };
    hadiths.unshift(newH);
    setStored(STORAGE_CUSTOM_HADITH, hadiths);
    return newH;
  }

  // --- ADMIN STATISTICS ---
  public static async getAdminStats(): Promise<AdminStats> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const [
          { data: profiles },
          { count: convCount },
          { data: messages },
          { count: violCount },
          { count: quranCount },
          { count: hadithCount }
        ] = await Promise.all([
          supabase.from('profiles').select('is_suspended, restriction_until'),
          supabase.from('conversations').select('id', { count: 'exact', head: true }),
          supabase.from('messages').select('sender_role, is_restricted_rejection'),
          supabase.from('user_violations').select('id', { count: 'exact', head: true }),
          supabase.from('quran_verses').select('id', { count: 'exact', head: true }),
          supabase.from('hadith_records').select('id', { count: 'exact', head: true })
        ]);

        if (profiles) {
          const now = Date.now();
          const totalUsers = profiles.length;
          const activeUsers = profiles.filter(
            p => !p.is_suspended && (!p.restriction_until || new Date(p.restriction_until).getTime() < now)
          ).length;
          const suspendedUsers = totalUsers - activeUsers;
          const rejectedQuestions = (messages || []).filter(m => m.is_restricted_rejection).length;
          const islamicQuestions = (messages || []).filter(
            m => m.sender_role === 'assistant' && !m.is_restricted_rejection
          ).length;

          return {
            total_users: totalUsers,
            active_users: activeUsers,
            suspended_users: suspendedUsers,
            total_conversations: convCount || 0,
            islamic_questions: islamicQuestions,
            rejected_questions: rejectedQuestions,
            flagged_conversations: violCount || 0,
            knowledge_resources:
              VERIFIED_QURAN_VERSES.length +
              VERIFIED_HADITH_RECORDS.length +
              (quranCount || 0) +
              (hadithCount || 0)
          };
        }
      } catch (e) {
        console.warn('Supabase admin stats fallback:', e);
      }
    }

    const profiles = getStored<UserProfile[]>(STORAGE_PROFILES, DEFAULT_USERS);
    const convs = getStored<Conversation[]>(STORAGE_CONVERSATIONS, []);
    const msgs = getStored<Message[]>(STORAGE_MESSAGES, []);
    const violations = getStored<UserViolation[]>(STORAGE_VIOLATIONS, []);

    const totalUsers = profiles.length;
    const activeUsers = profiles.filter(
      p => !p.is_suspended && (!p.restriction_until || new Date(p.restriction_until) < new Date())
    ).length;
    const suspendedUsers = profiles.filter(
      p => p.is_suspended || (p.restriction_until && new Date(p.restriction_until) > new Date())
    ).length;
    const totalConversations = convs.length;
    const rejectedQuestions = msgs.filter(m => m.is_restricted_rejection).length;
    const islamicQuestions = msgs.filter(
      m => m.sender_role === 'assistant' && !m.is_restricted_rejection
    ).length;
    const flaggedConversations = violations.length;
    const knowledgeResources = VERIFIED_QURAN_VERSES.length + VERIFIED_HADITH_RECORDS.length;

    return {
      total_users: totalUsers,
      active_users: activeUsers,
      suspended_users: suspendedUsers,
      total_conversations: totalConversations,
      islamic_questions: islamicQuestions,
      rejected_questions: rejectedQuestions,
      flagged_conversations: flaggedConversations,
      knowledge_resources: knowledgeResources
    };
  }
}
