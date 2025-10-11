import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type UserTier = 'artist' | 'label' | 'agency';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  updated_at: string;
}

interface UserRole {
  id: string;
  user_id: string;
  tier: UserTier;
  created_at: string;
}

interface Subscription {
  id: string;
  user_id: string;
  tier: UserTier;
  status: string;
  trial_ends_at: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  userRole: UserRole | null;
  subscription: Subscription | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isArtist: boolean;
  isLabel: boolean;
  isAgency: boolean;
  hasActiveSubscription: boolean;
  isTrialActive: boolean;
  daysUntilTrialEnd: number | null;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUserData = async (userId: string) => {
    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Fetch user role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (roleError) throw roleError;
      setUserRole(roleData);

      // Fetch subscription
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (subscriptionError) throw subscriptionError;
      setSubscription(subscriptionData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const refreshUserData = async () => {
    if (user) {
      await fetchUserData(user.id);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer data fetching to avoid blocking auth state change
          setTimeout(() => {
            fetchUserData(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setUserRole(null);
          setSubscription(null);
        }
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(() => {
          fetchUserData(session.user.id);
        }, 0);
      }
      setLoading(false);
    });

    return () => authSubscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        toast({
          title: 'Signup failed',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Welcome!',
          description: 'Your account has been created with a 14-day free trial.',
        });
      }

      return { error };
    } catch (error: any) {
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: 'Login failed',
          description: error.message,
          variant: 'destructive',
        });
      }

      return { error };
    } catch (error: any) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
      setUserRole(null);
      setSubscription(null);
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const isArtist = userRole?.tier === 'artist';
  const isLabel = userRole?.tier === 'label';
  const isAgency = userRole?.tier === 'agency';

  const hasActiveSubscription = subscription?.status === 'active' || subscription?.status === 'trial';
  
  const isTrialActive = subscription?.status === 'trial' && 
    subscription?.trial_ends_at && 
    new Date(subscription.trial_ends_at) > new Date();

  const daysUntilTrialEnd = subscription?.trial_ends_at
    ? Math.ceil((new Date(subscription.trial_ends_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const value = {
    user,
    session,
    profile,
    userRole,
    subscription,
    loading,
    signUp,
    signIn,
    signOut,
    isArtist,
    isLabel,
    isAgency,
    hasActiveSubscription,
    isTrialActive,
    daysUntilTrialEnd,
    refreshUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
