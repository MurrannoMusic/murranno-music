/**
 * Murranno Music - React Native App Entry Point
 * Simplified version for testing - connects to Supabase
 */
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { supabase } from './src/services/supabase';

// Dark theme colors
const colors = {
  background: '#080C15',
  card: '#0E1524',
  primary: '#7C3AED',
  foreground: '#F8FAFC',
  muted: '#94A3B8',
  border: '#1E293B',
  success: '#22C55E',
  destructive: '#EF4444',
};

// App state types
type Screen = 'loading' | 'auth' | 'dashboard';

export default function App() {
  const [screen, setScreen] = useState<Screen>('loading');
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');

  useEffect(() => {
    // Check Supabase connection and auth state
    checkConnection();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setScreen(session?.user ? 'dashboard' : 'auth');
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkConnection = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      
      setConnectionStatus('connected');
      setUser(data.session?.user ?? null);
      setScreen(data.session?.user ? 'dashboard' : 'auth');
    } catch (error) {
      setConnectionStatus('error');
      setScreen('auth');
    }
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      setMessage('Please enter email and password');
      return;
    }
    
    setLoading(true);
    setMessage('');
    
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setMessage('Signed in successfully!');
    } catch (error: any) {
      setMessage(error.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password) {
      setMessage('Please enter email and password');
      return;
    }
    
    setLoading(true);
    setMessage('');
    
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      setMessage('Check your email for verification link!');
    } catch (error: any) {
      setMessage(error.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Loading screen
  if (screen === 'loading') {
    return (
      <View style={styles.container}>
        <ExpoStatusBar style="light" />
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading Murranno Music...</Text>
      </View>
    );
  }

  // Auth screen
  if (screen === 'auth') {
    return (
      <SafeAreaView style={styles.container}>
        <ExpoStatusBar style="light" />
        <ScrollView contentContainerStyle={styles.authContainer}>
          <Text style={styles.title}>🎵 Murranno Music</Text>
          <Text style={styles.subtitle}>Music Distribution Platform</Text>
          
          {/* Connection Status */}
          <View style={[styles.statusBadge, connectionStatus === 'connected' ? styles.statusConnected : styles.statusError]}>
            <Text style={styles.statusText}>
              {connectionStatus === 'connected' ? '✅ Connected to Supabase' : '❌ Connection Error'}
            </Text>
          </View>
          
          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.input}>
              <Text 
                style={styles.inputText}
                onPress={() => {/* Would open keyboard */}}
              >
                {email || 'Enter your email'}
              </Text>
            </View>
          </View>
          
          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.input}>
              <Text style={styles.inputText}>
                {password ? '••••••••' : 'Enter your password'}
              </Text>
            </View>
          </View>
          
          {/* Message */}
          {message ? (
            <Text style={[styles.message, message.includes('success') || message.includes('Check') ? styles.successMessage : styles.errorMessage]}>
              {message}
            </Text>
          ) : null}
          
          {/* Buttons */}
          <TouchableOpacity 
            style={[styles.button, styles.primaryButton]}
            onPress={handleSignIn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]}
            onPress={handleSignUp}
            disabled={loading}
          >
            <Text style={styles.secondaryButtonText}>Create Account</Text>
          </TouchableOpacity>
          
          <Text style={styles.footerText}>
            Expo SDK 54 • React Native 0.81{'\n'}
            Supabase Backend
          </Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Dashboard screen
  return (
    <SafeAreaView style={styles.container}>
      <ExpoStatusBar style="light" />
      <ScrollView contentContainerStyle={styles.dashboardContainer}>
        <Text style={styles.title}>🎵 Murranno Music</Text>
        <Text style={styles.welcomeText}>Welcome, {user?.email}</Text>
        
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Releases</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>₦0</Text>
            <Text style={styles.statLabel}>Earnings</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Streams</Text>
          </View>
        </View>
        
        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>📀</Text>
            <Text style={styles.actionText}>New Release</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>📊</Text>
            <Text style={styles.actionText}>Analytics</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>💰</Text>
            <Text style={styles.actionText}>Earnings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>📢</Text>
            <Text style={styles.actionText}>Promote</Text>
          </TouchableOpacity>
        </View>
        
        {/* Sign Out Button */}
        <TouchableOpacity 
          style={[styles.button, styles.outlineButton]}
          onPress={handleSignOut}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <Text style={styles.outlineButtonText}>Sign Out</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  loadingText: {
    marginTop: 16,
    color: colors.muted,
    fontSize: 16,
  },
  authContainer: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  dashboardContainer: {
    flexGrow: 1,
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.foreground,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 32,
  },
  welcomeText: {
    fontSize: 16,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 32,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 32,
  },
  statusConnected: {
    backgroundColor: `${colors.success}20`,
  },
  statusError: {
    backgroundColor: `${colors.destructive}20`,
  },
  statusText: {
    color: colors.foreground,
    fontSize: 14,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    color: colors.foreground,
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
  },
  inputText: {
    color: colors.muted,
    fontSize: 16,
  },
  message: {
    textAlign: 'center',
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
  },
  successMessage: {
    color: colors.success,
    backgroundColor: `${colors.success}20`,
  },
  errorMessage: {
    color: colors.destructive,
    backgroundColor: `${colors.destructive}20`,
  },
  button: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
    marginTop: 32,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: colors.foreground,
    fontSize: 16,
    fontWeight: '600',
  },
  outlineButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  footerText: {
    color: colors.muted,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 32,
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.foreground,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.muted,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 16,
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionText: {
    color: colors.foreground,
    fontSize: 14,
    fontWeight: '500',
  },
});
