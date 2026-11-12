import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile } from '../types';
import { DBService } from '../services/dbService';
import { getSupabaseClient } from '../services/supabaseClient';

interface AuthContextType {
  currentUser: UserProfile | null;
  isAdmin: boolean;
  isSuspended: boolean;
  isRestricted: boolean;
  restrictionSecondsRemaining: number;
  loading: boolean;
  isSupabaseAuthActive: boolean;
  switchUser: (userId: string) => Promise<void>;
  updateProfile: (updated: Partial<UserProfile>) => Promise<void>;
  submitAppeal: (appealText: string) => Promise<void>;
  register: (email: string, fullName: string, role?: 'user' | 'admin', password?: string) => Promise<{ needsEmailConfirmation?: boolean }>;
  loginByEmail: (email: string, password?: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [restrictionSecondsRemaining, setRestrictionSecondsRemaining] = useState(0);

  const fetchUser = async () => {
    try {
      const user = await DBService.getCurrentUser();
      setCurrentUser(user);
      if (user) {
        checkRestriction(user);
      } else {
        setRestrictionSecondsRemaining(0);
      }
    } catch (err) {
      console.error('Failed to load user:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkRestriction = (user: UserProfile) => {
    if (user.restriction_until) {
      const remainingMs = new Date(user.restriction_until).getTime() - Date.now();
      if (remainingMs > 0) {
        setRestrictionSecondsRemaining(Math.ceil(remainingMs / 1000));
      } else {
        setRestrictionSecondsRemaining(0);
      }
    } else {
      setRestrictionSecondsRemaining(0);
    }
  };

  useEffect(() => {
    fetchUser();

    const supabase = getSupabaseClient();
    if (!supabase) return;

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(() => {
      fetchUser();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Countdown timer for active restriction
  useEffect(() => {
    if (restrictionSecondsRemaining <= 0) return;
    const interval = setInterval(() => {
      setRestrictionSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          fetchUser();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [restrictionSecondsRemaining]);

  const switchUser = async (userId: string) => {
    const user = await DBService.setCurrentUser(userId);
    if (user) {
      setCurrentUser(user);
      checkRestriction(user);
    }
  };

  const updateProfile = async (updated: Partial<UserProfile>) => {
    if (!currentUser) return;
    const result = await DBService.updateUserProfile({ ...updated, id: currentUser.id });
    setCurrentUser(result);
  };

  const submitAppeal = async (appealText: string) => {
    if (!currentUser) return;
    await DBService.submitAppeal(currentUser.id, appealText);
    await fetchUser();
  };

  const register = async (
    email: string,
    fullName: string,
    _role: 'user' | 'admin' = 'user',
    password = ''
  ): Promise<{ needsEmailConfirmation?: boolean }> => {
    const result = await DBService.signUpWithPassword(email, password, fullName);
    if (result.user) {
      setCurrentUser(result.user);
      setRestrictionSecondsRemaining(0);
    }
    return { needsEmailConfirmation: result.needsEmailConfirmation };
  };

  const loginByEmail = async (email: string, password = ''): Promise<boolean> => {
    const user = await DBService.signInWithPassword(email, password);
    setCurrentUser(user);
    checkRestriction(user);
    return true;
  };

  const resetPassword = async (email: string): Promise<void> => {
    await DBService.resetPasswordForEmail(email);
  };

  const updatePassword = async (newPassword: string): Promise<void> => {
    await DBService.updatePassword(newPassword, currentUser?.email);
  };

  const logout = async () => {
    await DBService.signOut();
    setCurrentUser(null);
    setRestrictionSecondsRemaining(0);
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  const isSuspended = Boolean(currentUser?.is_suspended);
  const isRestricted = Boolean(
    isSuspended ||
    (currentUser?.restriction_until && new Date(currentUser.restriction_until) > new Date())
  );
  const isAdmin = currentUser?.role === 'admin';
  const isSupabaseAuthActive = Boolean(getSupabaseClient());

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin,
        isSuspended,
        isRestricted,
        restrictionSecondsRemaining,
        loading,
        isSupabaseAuthActive,
        switchUser,
        updateProfile,
        submitAppeal,
        register,
        loginByEmail,
        resetPassword,
        updatePassword,
        logout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
