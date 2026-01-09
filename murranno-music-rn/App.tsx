/**
 * Murranno Music - React Native App
 * Pixel-perfect migration from React web app
 */
import React, { useEffect, useState, useRef } from 'react';
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
  TextInput,
  KeyboardAvoidingView,
  ImageBackground,
  Dimensions,
  Animated,
  Image,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { supabase } from './src/services/supabase';

// Assets
const musicianBg = require('./src/assets/musician-background.jpg');
const mmLogo = require('./src/assets/mm_logo.png');
const prototype1 = require('./src/assets/prototype-1.jpg');
const prototype2 = require('./src/assets/prototype-2.jpg');
const prototype3 = require('./src/assets/prototype-3.jpg');

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Theme colors matching web app exactly
const colors = {
  background: '#050810',       // hsl(222, 84%, 5%)
  foreground: '#F8FAFC',       // hsl(210, 40%, 98%)
  card: '#0C1220',             // hsl(222, 84%, 8%)
  cardForeground: '#F8FAFC',
  primary: '#7C3AED',          // hsl(263, 70%, 50%)
  primaryForeground: '#F8FAFC',
  primaryGlow: '#8B5CF6',      // hsl(263, 85%, 60%)
  secondary: '#1E293B',        // hsl(217, 32%, 17%)
  secondaryForeground: '#E2E8F0',
  muted: '#1E293B',
  mutedForeground: '#94A3B8',  // hsl(215, 20%, 65%)
  accent: '#8B5CF6',           // hsl(262, 83%, 58%)
  accentForeground: '#F8FAFC',
  destructive: '#7F1D1D',
  destructiveForeground: '#F8FAFC',
  border: '#1E293B',
  success: '#22C55E',
  successForeground: '#F8FAFC',
  warning: '#F59E0B',
  warningForeground: '#F8FAFC',
};

// Carousel slides matching web app
const slides = [
  {
    title: "Distribute Your Music Globally",
    description: "Upload once and reach all major streaming platforms including Spotify, Apple Music, Boomplay, and more.",
    backgroundImage: prototype1,
  },
  {
    title: "Promote & Grow Your Fanbase",
    description: "Run targeted campaigns, playlist pitching, and influencer partnerships to amplify your reach.",
    backgroundImage: prototype2,
  },
  {
    title: "Track Royalties & Get Paid Fast",
    description: "Real-time analytics, transparent earnings, and fast payouts to your bank or mobile money wallet.",
    backgroundImage: prototype3,
  },
];

// User types for account selection
const userTypes = [
  {
    type: 'artist',
    label: 'Artist',
    icon: '👤',
    description: 'Manage your music, track streams, and earnings',
    color: colors.primary,
  },
  {
    type: 'label',
    label: 'Record Label',
    icon: '🏢',
    description: 'Manage artists, campaigns, and label analytics',
    color: colors.secondary,
  },
  {
    type: 'agency',
    label: 'Marketing Agency',
    icon: '📢',
    description: 'Run promotional campaigns for your clients',
    color: colors.accent,
  },
];

type Screen = 'loading' | 'welcome' | 'login' | 'signup' | 'dashboard';

export default function App() {
  const [screen, setScreen] = useState<Screen>('loading');
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedUserType, setSelectedUserType] = useState<string | null>(null);
  const [showUserTypeDrawer, setShowUserTypeDrawer] = useState(false);
  
  // Carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setScreen('dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    if (screen !== 'welcome') return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [screen]);

  // Animate carousel slide
  useEffect(() => {
    Animated.timing(slideAnimation, {
      toValue: currentSlide,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [currentSlide]);

  const checkAuth = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (data.session?.user) {
        setUser(data.session.user);
        setScreen('dashboard');
      } else {
        setScreen('welcome');
      }
    } catch (error) {
      setScreen('welcome');
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
      setScreen('dashboard');
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

    if (password.length < 6) {
      setMessage('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    setMessage('');
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            user_type: selectedUserType,
          },
        },
      });
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
      setUser(null);
      setScreen('welcome');
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Loading Screen
  if (screen === 'loading') {
    return (
      <View style={styles.loadingContainer}>
        <ExpoStatusBar style="light" />
        <Image source={mmLogo} style={styles.loadingLogo} resizeMode="contain" />
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 24 }} />
      </View>
    );
  }

  // Welcome Screen with Carousel
  if (screen === 'welcome') {
    return (
      <View style={styles.container}>
        <ExpoStatusBar style="light" />
        
        {/* Background Images */}
        {slides.map((slide, index) => (
          <Animated.View
            key={index}
            style={[
              styles.carouselBackground,
              {
                opacity: slideAnimation.interpolate({
                  inputRange: [index - 1, index, index + 1],
                  outputRange: [0, 1, 0],
                  extrapolate: 'clamp',
                }),
              },
            ]}
          >
            <ImageBackground
              source={slide.backgroundImage}
              style={styles.backgroundImage}
              resizeMode="cover"
            >
              <View style={styles.backgroundOverlay} />
            </ImageBackground>
          </Animated.View>
        ))}

        {/* Content */}
        <SafeAreaView style={styles.welcomeContent}>
          {/* Carousel Card */}
          <View style={styles.carouselContainer}>
            <View style={styles.carouselCard}>
              <BlurView intensity={40} tint="dark" style={styles.blurCard}>
                <View style={styles.cardInner}>
                  <Text style={styles.carouselTitle}>{slides[currentSlide].title}</Text>
                  <Text style={styles.carouselDescription}>{slides[currentSlide].description}</Text>
                </View>
              </BlurView>
            </View>

            {/* Progress Dots */}
            <View style={styles.progressDots}>
              {slides.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setCurrentSlide(index)}
                  style={[
                    styles.dot,
                    index === currentSlide && styles.dotActive,
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Bottom CTA */}
          <LinearGradient
            colors={['transparent', colors.background, colors.background]}
            style={styles.bottomGradient}
          >
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => setShowUserTypeDrawer(true)}
            >
              <LinearGradient
                colors={[colors.primary, colors.accent]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientButton}
              >
                <Text style={styles.primaryButtonText}>Get Started</Text>
                <Text style={styles.buttonIcon}>↑</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <Text style={styles.loginPrompt}>
              Already have an account?{' '}
              <Text style={styles.loginLink} onPress={() => setScreen('login')}>
                Log in
              </Text>
            </Text>
          </LinearGradient>
        </SafeAreaView>

        {/* User Type Selection Drawer */}
        {showUserTypeDrawer && (
          <View style={styles.drawerOverlay}>
            <TouchableOpacity 
              style={styles.drawerBackdrop} 
              onPress={() => setShowUserTypeDrawer(false)}
              activeOpacity={1}
            />
            <View style={styles.drawer}>
              <View style={styles.drawerHandle} />
              <Text style={styles.drawerTitle}>Choose Your Account Type</Text>
              <Text style={styles.drawerSubtitle}>Select how you'll be using Murranno Music</Text>
              
              <ScrollView style={styles.userTypeList}>
                {userTypes.map((item) => (
                  <TouchableOpacity
                    key={item.type}
                    style={[
                      styles.userTypeCard,
                      selectedUserType === item.type && styles.userTypeCardSelected,
                    ]}
                    onPress={() => setSelectedUserType(item.type)}
                  >
                    <View style={[styles.userTypeIcon, { backgroundColor: item.color }]}>
                      <Text style={styles.userTypeIconText}>{item.icon}</Text>
                    </View>
                    <View style={styles.userTypeInfo}>
                      <Text style={styles.userTypeLabel}>{item.label}</Text>
                      <Text style={styles.userTypeDescription}>{item.description}</Text>
                    </View>
                    {selectedUserType === item.type && (
                      <View style={styles.checkmark}>
                        <Text style={styles.checkmarkText}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <TouchableOpacity
                style={[styles.primaryButton, !selectedUserType && styles.buttonDisabled]}
                onPress={() => {
                  if (selectedUserType) {
                    setShowUserTypeDrawer(false);
                    setScreen('signup');
                  }
                }}
                disabled={!selectedUserType}
              >
                <LinearGradient
                  colors={[colors.primary, colors.accent]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.gradientButton, !selectedUserType && styles.gradientButtonDisabled]}
                >
                  <Text style={styles.primaryButtonText}>Create Account</Text>
                </LinearGradient>
              </TouchableOpacity>
              <Text style={styles.drawerNote}>
                You can change your account type later in settings
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  }

  // Login Screen
  if (screen === 'login') {
    return (
      <View style={styles.container}>
        <ExpoStatusBar style="light" />
        <ImageBackground
          source={musicianBg}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.flex}
          >
            <SafeAreaView style={styles.flex}>
              <ScrollView 
                contentContainerStyle={styles.loginContainer}
                keyboardShouldPersistTaps="handled"
              >
                {/* Back Button */}
                <TouchableOpacity 
                  style={styles.backButton}
                  onPress={() => setScreen('welcome')}
                >
                  <Text style={styles.backButtonText}>←</Text>
                </TouchableOpacity>

                {/* Login Card */}
                <View style={styles.loginCard}>
                  <BlurView intensity={60} tint="dark" style={styles.loginBlur}>
                    <View style={styles.loginCardHeader}>
                      <Text style={styles.loginTitle}>Log in to your account</Text>
                    </View>
                    
                    <View style={styles.loginCardContent}>
                      {/* Email Input */}
                      <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Email</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="Enter your email"
                          placeholderTextColor="rgba(255,255,255,0.5)"
                          value={email}
                          onChangeText={setEmail}
                          keyboardType="email-address"
                          autoCapitalize="none"
                          autoCorrect={false}
                        />
                      </View>

                      {/* Password Input */}
                      <View style={styles.inputGroup}>
                        <View style={styles.passwordHeader}>
                          <Text style={styles.inputLabel}>Password</Text>
                          <TouchableOpacity>
                            <Text style={styles.forgotPassword}>Forgot password?</Text>
                          </TouchableOpacity>
                        </View>
                        <TextInput
                          style={styles.input}
                          placeholder="Enter your password"
                          placeholderTextColor="rgba(255,255,255,0.5)"
                          value={password}
                          onChangeText={setPassword}
                          secureTextEntry
                          autoCapitalize="none"
                        />
                      </View>

                      {/* Message */}
                      {message ? (
                        <View style={[
                          styles.messageBox,
                          message.includes('success') ? styles.successBox : styles.errorBox
                        ]}>
                          <Text style={[
                            styles.messageText,
                            message.includes('success') ? styles.successText : styles.errorText
                          ]}>
                            {message}
                          </Text>
                        </View>
                      ) : null}

                      {/* Login Button */}
                      <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={handleSignIn}
                        disabled={loading}
                      >
                        <LinearGradient
                          colors={[colors.primary, colors.accent]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.gradientButton}
                        >
                          {loading ? (
                            <ActivityIndicator color="#fff" />
                          ) : (
                            <Text style={styles.primaryButtonText}>Log In</Text>
                          )}
                        </LinearGradient>
                      </TouchableOpacity>

                      <Text style={styles.signupPrompt}>
                        Don't have an account?{' '}
                        <Text style={styles.signupLink} onPress={() => setScreen('signup')}>
                          Sign up
                        </Text>
                      </Text>
                    </View>
                  </BlurView>
                </View>
              </ScrollView>
            </SafeAreaView>
          </KeyboardAvoidingView>
        </ImageBackground>
      </View>
    );
  }

  // Signup Screen
  if (screen === 'signup') {
    return (
      <View style={styles.container}>
        <ExpoStatusBar style="light" />
        <ImageBackground
          source={musicianBg}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.flex}
          >
            <SafeAreaView style={styles.flex}>
              <ScrollView 
                contentContainerStyle={styles.loginContainer}
                keyboardShouldPersistTaps="handled"
              >
                {/* Back Button */}
                <TouchableOpacity 
                  style={styles.backButton}
                  onPress={() => setScreen('welcome')}
                >
                  <Text style={styles.backButtonText}>←</Text>
                </TouchableOpacity>

                {/* Signup Card */}
                <View style={styles.loginCard}>
                  <BlurView intensity={60} tint="dark" style={styles.loginBlur}>
                    <View style={styles.loginCardHeader}>
                      <Text style={styles.loginTitle}>Create your account</Text>
                    </View>
                    
                    <View style={styles.loginCardContent}>
                      {/* Full Name Input */}
                      <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Full Name</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="Enter your full name"
                          placeholderTextColor="rgba(255,255,255,0.5)"
                          value={fullName}
                          onChangeText={setFullName}
                          autoCapitalize="words"
                        />
                      </View>

                      {/* Email Input */}
                      <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Email</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="Enter your email"
                          placeholderTextColor="rgba(255,255,255,0.5)"
                          value={email}
                          onChangeText={setEmail}
                          keyboardType="email-address"
                          autoCapitalize="none"
                          autoCorrect={false}
                        />
                      </View>

                      {/* Password Input */}
                      <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Password</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="Create a password (min 6 characters)"
                          placeholderTextColor="rgba(255,255,255,0.5)"
                          value={password}
                          onChangeText={setPassword}
                          secureTextEntry
                          autoCapitalize="none"
                        />
                      </View>

                      {/* Selected User Type */}
                      {selectedUserType && (
                        <View style={styles.selectedTypeChip}>
                          <Text style={styles.selectedTypeText}>
                            {userTypes.find(u => u.type === selectedUserType)?.icon}{' '}
                            {userTypes.find(u => u.type === selectedUserType)?.label}
                          </Text>
                        </View>
                      )}

                      {/* Message */}
                      {message ? (
                        <View style={[
                          styles.messageBox,
                          message.includes('Check') || message.includes('success') ? styles.successBox : styles.errorBox
                        ]}>
                          <Text style={[
                            styles.messageText,
                            message.includes('Check') || message.includes('success') ? styles.successText : styles.errorText
                          ]}>
                            {message}
                          </Text>
                        </View>
                      ) : null}

                      {/* Signup Button */}
                      <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={handleSignUp}
                        disabled={loading}
                      >
                        <LinearGradient
                          colors={[colors.primary, colors.accent]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.gradientButton}
                        >
                          {loading ? (
                            <ActivityIndicator color="#fff" />
                          ) : (
                            <Text style={styles.primaryButtonText}>Create Account</Text>
                          )}
                        </LinearGradient>
                      </TouchableOpacity>

                      <Text style={styles.signupPrompt}>
                        Already have an account?{' '}
                        <Text style={styles.signupLink} onPress={() => setScreen('login')}>
                          Log in
                        </Text>
                      </Text>
                    </View>
                  </BlurView>
                </View>
              </ScrollView>
            </SafeAreaView>
          </KeyboardAvoidingView>
        </ImageBackground>
      </View>
    );
  }

  // Dashboard Screen
  return (
    <View style={styles.container}>
      <ExpoStatusBar style="light" />
      <LinearGradient
        colors={[colors.background, '#0A0F1A']}
        style={styles.dashboardGradient}
      >
        <SafeAreaView style={styles.flex}>
          {/* Top Bar */}
          <View style={styles.topBar}>
            <Image source={mmLogo} style={styles.topBarLogo} resizeMode="contain" />
            <View style={styles.artistBadge}>
              <Text style={styles.artistBadgeText}>ARTIST</Text>
            </View>
            <TouchableOpacity style={styles.avatarButton}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.dashboardScroll} showsVerticalScrollIndicator={false}>
            {/* Analytics Section */}
            <Text style={styles.sectionTitle}>Performance Insights</Text>
            
            {/* Stats Card */}
            <View style={styles.statsCard}>
              <View style={styles.statsHeader}>
                <View style={styles.statsIcon}>
                  <Text style={styles.statsIconText}>💰</Text>
                </View>
                <Text style={styles.statsChange}>+12%</Text>
              </View>
              <Text style={styles.statsValue}>₦0.00</Text>
              <Text style={styles.statsLabel}>Total Earnings</Text>
            </View>

            {/* Mini Stats Row */}
            <View style={styles.miniStatsRow}>
              <View style={styles.miniStatCard}>
                <Text style={styles.miniStatValue}>0</Text>
                <Text style={styles.miniStatLabel}>Releases</Text>
              </View>
              <View style={styles.miniStatCard}>
                <Text style={styles.miniStatValue}>0</Text>
                <Text style={styles.miniStatLabel}>Streams</Text>
              </View>
              <View style={styles.miniStatCard}>
                <Text style={styles.miniStatValue}>0</Text>
                <Text style={styles.miniStatLabel}>Followers</Text>
              </View>
            </View>

            {/* Recent Activity */}
            <View style={styles.activityCard}>
              <View style={styles.activityHeader}>
                <Text style={styles.activityIcon}>🕐</Text>
                <Text style={styles.activityTitle}>Recent Activity</Text>
              </View>
              <View style={styles.emptyActivity}>
                <Text style={styles.emptyActivityText}>
                  No recent activity. Upload your first release to get started!
                </Text>
              </View>
            </View>

            {/* Quick Actions */}
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionsGrid}>
              <TouchableOpacity style={styles.actionCard}>
                <Text style={styles.actionIcon}>📀</Text>
                <Text style={styles.actionLabel}>New Release</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionCard}>
                <Text style={styles.actionIcon}>📊</Text>
                <Text style={styles.actionLabel}>Analytics</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionCard}>
                <Text style={styles.actionIcon}>💰</Text>
                <Text style={styles.actionLabel}>Earnings</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionCard}>
                <Text style={styles.actionIcon}>📢</Text>
                <Text style={styles.actionLabel}>Promote</Text>
              </TouchableOpacity>
            </View>

            {/* Sign Out */}
            <TouchableOpacity
              style={styles.signOutButton}
              onPress={handleSignOut}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.primary} />
              ) : (
                <Text style={styles.signOutText}>Sign Out</Text>
              )}
            </TouchableOpacity>

            <View style={{ height: 100 }} />
          </ScrollView>

          {/* Bottom Navigation */}
          <View style={styles.bottomNav}>
            <BlurView intensity={80} tint="dark" style={styles.bottomNavBlur}>
              <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
                <Text style={styles.navIcon}>🏠</Text>
                <Text style={[styles.navLabel, styles.navLabelActive]}>Home</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navItem}>
                <Text style={styles.navIcon}>📀</Text>
                <Text style={styles.navLabel}>Releases</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navItem}>
                <Text style={styles.navIcon}>📢</Text>
                <Text style={styles.navLabel}>Promote</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navItem}>
                <Text style={styles.navIcon}>💰</Text>
                <Text style={styles.navLabel}>Earnings</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navItem}>
                <Text style={styles.navIcon}>👤</Text>
                <Text style={styles.navLabel}>Profile</Text>
              </TouchableOpacity>
            </BlurView>
          </View>

          {/* Floating Action Button */}
          <TouchableOpacity style={styles.fab}>
            <LinearGradient
              colors={[colors.accent, colors.primaryGlow]}
              style={styles.fabGradient}
            >
              <Text style={styles.fabIcon}>+</Text>
            </LinearGradient>
          </TouchableOpacity>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  // Loading
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingLogo: {
    width: 120,
    height: 60,
  },

  // Welcome/Carousel
  carouselBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  welcomeContent: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  carouselContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  carouselCard: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  blurCard: {
    padding: 24,
  },
  cardInner: {
    alignItems: 'center',
  },
  carouselTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  carouselDescription: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 22,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  dotActive: {
    width: 24,
    backgroundColor: colors.primary,
  },
  bottomGradient: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  primaryButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  gradientButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  gradientButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonIcon: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  loginPrompt: {
    textAlign: 'center',
    color: colors.mutedForeground,
    fontSize: 14,
  },
  loginLink: {
    color: colors.primary,
    fontWeight: '600',
  },

  // Drawer
  drawerOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  drawerBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  drawer: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    maxHeight: '85%',
  },
  drawerHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.foreground,
    textAlign: 'center',
  },
  drawerSubtitle: {
    fontSize: 14,
    color: colors.mutedForeground,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  userTypeList: {
    maxHeight: 300,
  },
  userTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  userTypeCardSelected: {
    borderColor: colors.primary,
    transform: [{ scale: 1.02 }],
  },
  userTypeIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userTypeIconText: {
    fontSize: 20,
  },
  userTypeInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userTypeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.foreground,
  },
  userTypeDescription: {
    fontSize: 13,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  drawerNote: {
    fontSize: 12,
    color: colors.mutedForeground,
    textAlign: 'center',
    marginTop: 8,
  },

  // Login Screen
  loginContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 16,
    zIndex: 10,
  },
  backButtonText: {
    fontSize: 28,
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  loginCard: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  loginBlur: {
    overflow: 'hidden',
  },
  loginCardHeader: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  loginTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  loginCardContent: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  forgotPassword: {
    fontSize: 13,
    color: colors.primary,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#fff',
  },
  messageBox: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  successBox: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  messageText: {
    fontSize: 14,
    textAlign: 'center',
  },
  successText: {
    color: colors.success,
  },
  errorText: {
    color: '#EF4444',
  },
  signupPrompt: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    marginTop: 8,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  signupLink: {
    color: colors.primary,
    fontWeight: '600',
  },
  selectedTypeChip: {
    backgroundColor: colors.primary + '30',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.primary + '50',
  },
  selectedTypeText: {
    color: colors.primaryForeground,
    fontSize: 14,
    fontWeight: '500',
  },

  // Dashboard
  dashboardGradient: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(5, 8, 16, 0.9)',
  },
  topBarLogo: {
    width: 80,
    height: 32,
  },
  artistBadge: {
    backgroundColor: colors.primary + '25',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary + '50',
  },
  artistBadgeText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
  avatarButton: {
    width: 40,
    height: 40,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dashboardScroll: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.foreground,
    marginTop: 20,
    marginBottom: 12,
  },
  statsCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statsIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary + '30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsIconText: {
    fontSize: 16,
  },
  statsChange: {
    color: colors.success,
    fontSize: 12,
    fontWeight: '600',
  },
  statsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.foreground,
  },
  statsLabel: {
    fontSize: 12,
    color: colors.mutedForeground,
    fontWeight: '500',
    marginTop: 4,
  },
  miniStatsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  miniStatCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  miniStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.foreground,
  },
  miniStatLabel: {
    fontSize: 11,
    color: colors.mutedForeground,
    marginTop: 4,
  },
  activityCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  activityIcon: {
    fontSize: 20,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.foreground,
  },
  emptyActivity: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyActivityText: {
    color: colors.mutedForeground,
    fontSize: 14,
    textAlign: 'center',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: (SCREEN_WIDTH - 44) / 2,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.foreground,
  },
  signOutButton: {
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
  },
  signOutText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },

  // Bottom Navigation
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: colors.border + '50',
  },
  bottomNavBlur: {
    flexDirection: 'row',
    paddingBottom: Platform.OS === 'ios' ? 30 : 10,
    paddingTop: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 16,
    marginHorizontal: 4,
  },
  navItemActive: {
    backgroundColor: colors.primary + '20',
  },
  navIcon: {
    fontSize: 22,
    marginBottom: 4,
  },
  navLabel: {
    fontSize: 10,
    color: colors.mutedForeground,
    fontWeight: '500',
  },
  navLabelActive: {
    color: colors.primary,
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 100 : 80,
    right: 24,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  fabGradient: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabIcon: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '300',
  },
});
