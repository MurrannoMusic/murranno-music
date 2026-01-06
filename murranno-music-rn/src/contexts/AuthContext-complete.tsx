import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, signInWithEmail, signUpWithEmail, signOut } from '../services/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session, User } from '@supabase/supabase-js';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  user_type: 'artist' | 'label' | 'agency' | 'admin';
  avatar_url: string | null;
  bio: string | null;
  onboarding_completed: boolean;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string, userType: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Load profile from database
  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
      
      // Cache profile
      await AsyncStorage.setItem('user_profile', JSON.stringify(data));
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Check for existing session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (mounted) {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          
          if (currentSession?.user) {
            await loadProfile(currentSession.user.id);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state changed:', event);
        
        if (mounted) {
          setSession(newSession);
          setUser(newSession?.user ?? null);
          
          if (newSession?.user) {
            await loadProfile(newSession.user.id);
          } else {
            setProfile(null);
            await AsyncStorage.removeItem('user_profile');
          }
          
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Sign in
  const handleSignIn = async (email: string, password: string) => {
    try {
      const { data, error } = await signInWithEmail(email, password);
      
      if (error) return { error };
      
      if (data.user) {
        await loadProfile(data.user.id);
      }
      
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  // Sign up
  const handleSignUp = async (
    email: string,
    password: string,
    fullName: string,
    userType: string = 'artist'
  ) => {
    try {
      // Sign up with metadata
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            user_type: userType,
          },
        },
      });
      
      if (error) return { error };
      
      // Profile is auto-created by database trigger
      // Wait a moment for trigger to complete
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (data.user) {
        await loadProfile(data.user.id);
      }
      
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await signOut();
      setUser(null);
      setProfile(null);
      setSession(null);
      await AsyncStorage.removeItem('user_profile');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Refresh profile
  const refreshProfile = async () => {
    if (user) {
      await loadProfile(user.id);
    }
  };

  // Update profile
  const handleUpdateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('Not authenticated') };
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();
      
      if (error) return { error };
      
      setProfile(data);
      await AsyncStorage.setItem('user_profile', JSON.stringify(data));
      
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const value = {
    user,
    profile,
    session,
    loading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    logout: handleLogout,
    refreshProfile,
    updateProfile: handleUpdateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
