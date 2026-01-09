/**
 * Murranno Music - React Native App
 * Full featured app with navigation matching the web version
 */
import React, { useEffect, useState, useRef, createContext, useContext } from 'react';
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
  FlatList,
  RefreshControl,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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
  background: '#050810',
  foreground: '#F8FAFC',
  card: '#0C1220',
  cardForeground: '#F8FAFC',
  primary: '#7C3AED',
  primaryForeground: '#F8FAFC',
  primaryGlow: '#8B5CF6',
  secondary: '#1E293B',
  secondaryForeground: '#E2E8F0',
  muted: '#1E293B',
  mutedForeground: '#94A3B8',
  accent: '#8B5CF6',
  accentForeground: '#F8FAFC',
  destructive: '#EF4444',
  destructiveForeground: '#F8FAFC',
  border: '#1E293B',
  success: '#22C55E',
  successForeground: '#F8FAFC',
  warning: '#F59E0B',
  warningForeground: '#F8FAFC',
};

// Carousel slides
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

// User types
const userTypes = [
  { type: 'artist', label: 'Artist', icon: '👤', description: 'Manage your music, track streams, and earnings', color: colors.primary },
  { type: 'label', label: 'Record Label', icon: '🏢', description: 'Manage artists, campaigns, and label analytics', color: colors.secondary },
  { type: 'agency', label: 'Marketing Agency', icon: '📢', description: 'Run promotional campaigns for your clients', color: colors.accent },
];

// Auth Context
interface AuthContextType {
  user: any;
  profile: any;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, userType: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

// Navigation
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ============ SCREENS ============

// Welcome Screen
const WelcomeScreen = ({ navigation }: any) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState<string | null>(null);
  const slideAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    Animated.timing(slideAnimation, {
      toValue: currentSlide,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [currentSlide]);

  return (
    <View style={styles.container}>
      <ExpoStatusBar style="light" />
      
      {slides.map((slide, index) => (
        <Animated.View
          key={index}
          style={[styles.carouselBackground, {
            opacity: slideAnimation.interpolate({
              inputRange: [index - 1, index, index + 1],
              outputRange: [0, 1, 0],
              extrapolate: 'clamp',
            }),
          }]}
        >
          <ImageBackground source={slide.backgroundImage} style={styles.backgroundImage} resizeMode="cover">
            <View style={styles.backgroundOverlay} />
          </ImageBackground>
        </Animated.View>
      ))}

      <SafeAreaView style={styles.welcomeContent}>
        <View style={styles.carouselContainer}>
          <View style={styles.carouselCard}>
            <BlurView intensity={40} tint="dark" style={styles.blurCard}>
              <View style={styles.cardInner}>
                <Text style={styles.carouselTitle}>{slides[currentSlide].title}</Text>
                <Text style={styles.carouselDescription}>{slides[currentSlide].description}</Text>
              </View>
            </BlurView>
          </View>

          <View style={styles.progressDots}>
            {slides.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setCurrentSlide(index)}
                style={[styles.dot, index === currentSlide && styles.dotActive]}
              />
            ))}
          </View>
        </View>

        <LinearGradient colors={['transparent', colors.background, colors.background]} style={styles.bottomGradient}>
          <TouchableOpacity style={styles.primaryButton} onPress={() => setShowDrawer(true)}>
            <LinearGradient colors={[colors.primary, colors.accent]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradientButton}>
              <Text style={styles.primaryButtonText}>Get Started</Text>
              <Text style={styles.buttonIcon}>↑</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <Text style={styles.loginPrompt}>
            Already have an account?{' '}
            <Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}>Log in</Text>
          </Text>
        </LinearGradient>
      </SafeAreaView>

      {showDrawer && (
        <View style={styles.drawerOverlay}>
          <TouchableOpacity style={styles.drawerBackdrop} onPress={() => setShowDrawer(false)} activeOpacity={1} />
          <View style={styles.drawer}>
            <View style={styles.drawerHandle} />
            <Text style={styles.drawerTitle}>Choose Your Account Type</Text>
            <Text style={styles.drawerSubtitle}>Select how you'll be using Murranno Music</Text>
            
            <ScrollView style={styles.userTypeList}>
              {userTypes.map((item) => (
                <TouchableOpacity
                  key={item.type}
                  style={[styles.userTypeCard, selectedUserType === item.type && styles.userTypeCardSelected]}
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
                    <View style={styles.checkmark}><Text style={styles.checkmarkText}>✓</Text></View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={[styles.primaryButton, !selectedUserType && styles.buttonDisabled]}
              onPress={() => {
                if (selectedUserType) {
                  setShowDrawer(false);
                  navigation.navigate('Signup', { userType: selectedUserType });
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
            <Text style={styles.drawerNote}>You can change your account type later in settings</Text>
          </View>
        </View>
      )}
    </View>
  );
};

// Login Screen
const LoginScreen = ({ navigation }: any) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage('Please enter email and password');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      await signIn(email, password);
    } catch (error: any) {
      setMessage(error.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ExpoStatusBar style="light" />
      <ImageBackground source={musicianBg} style={styles.backgroundImage} resizeMode="cover">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
          <SafeAreaView style={styles.flex}>
            <ScrollView contentContainerStyle={styles.loginContainer} keyboardShouldPersistTaps="handled">
              <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>←</Text>
              </TouchableOpacity>

              <View style={styles.loginCard}>
                <BlurView intensity={60} tint="dark" style={styles.loginBlur}>
                  <View style={styles.loginCardHeader}>
                    <Text style={styles.loginTitle}>Log in to your account</Text>
                  </View>
                  
                  <View style={styles.loginCardContent}>
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
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <View style={styles.passwordHeader}>
                        <Text style={styles.inputLabel}>Password</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
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
                      />
                    </View>

                    {message ? (
                      <View style={[styles.messageBox, message.includes('success') ? styles.successBox : styles.errorBox]}>
                        <Text style={[styles.messageText, message.includes('success') ? styles.successText : styles.errorText]}>{message}</Text>
                      </View>
                    ) : null}

                    <TouchableOpacity style={styles.primaryButton} onPress={handleLogin} disabled={loading}>
                      <LinearGradient colors={[colors.primary, colors.accent]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradientButton}>
                        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Log In</Text>}
                      </LinearGradient>
                    </TouchableOpacity>

                    <Text style={styles.signupPrompt}>
                      Don't have an account?{' '}
                      <Text style={styles.signupLink} onPress={() => navigation.navigate('Signup')}>Sign up</Text>
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
};

// Signup Screen
const SignupScreen = ({ navigation, route }: any) => {
  const { signUp } = useAuth();
  const userType = route.params?.userType || 'artist';
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSignup = async () => {
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
      await signUp(email, password, fullName, userType);
      setMessage('Check your email for verification link!');
    } catch (error: any) {
      setMessage(error.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  const selectedType = userTypes.find(u => u.type === userType);

  return (
    <View style={styles.container}>
      <ExpoStatusBar style="light" />
      <ImageBackground source={musicianBg} style={styles.backgroundImage} resizeMode="cover">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
          <SafeAreaView style={styles.flex}>
            <ScrollView contentContainerStyle={styles.loginContainer} keyboardShouldPersistTaps="handled">
              <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>←</Text>
              </TouchableOpacity>

              <View style={styles.loginCard}>
                <BlurView intensity={60} tint="dark" style={styles.loginBlur}>
                  <View style={styles.loginCardHeader}>
                    <Text style={styles.loginTitle}>Create your account</Text>
                  </View>
                  
                  <View style={styles.loginCardContent}>
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
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Password</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Create a password (min 6 characters)"
                        placeholderTextColor="rgba(255,255,255,0.5)"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                      />
                    </View>

                    {selectedType && (
                      <View style={styles.selectedTypeChip}>
                        <Text style={styles.selectedTypeText}>{selectedType.icon} {selectedType.label}</Text>
                      </View>
                    )}

                    {message ? (
                      <View style={[styles.messageBox, message.includes('Check') ? styles.successBox : styles.errorBox]}>
                        <Text style={[styles.messageText, message.includes('Check') ? styles.successText : styles.errorText]}>{message}</Text>
                      </View>
                    ) : null}

                    <TouchableOpacity style={styles.primaryButton} onPress={handleSignup} disabled={loading}>
                      <LinearGradient colors={[colors.primary, colors.accent]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradientButton}>
                        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Create Account</Text>}
                      </LinearGradient>
                    </TouchableOpacity>

                    <Text style={styles.signupPrompt}>
                      Already have an account?{' '}
                      <Text style={styles.signupLink} onPress={() => navigation.navigate('Login')}>Log in</Text>
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
};

// Dashboard Screen (Home Tab)
const DashboardScreen = ({ navigation }: any) => {
  const { user, signOut } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  return (
    <View style={styles.dashboardContainer}>
      <ExpoStatusBar style="light" />
      
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Image source={mmLogo} style={styles.topBarLogo} resizeMode="contain" />
        <View style={styles.artistBadge}>
          <Text style={styles.artistBadgeText}>ARTIST</Text>
        </View>
        <TouchableOpacity style={styles.avatarButton} onPress={() => navigation.navigate('ProfileTab')}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.email?.charAt(0).toUpperCase() || 'U'}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.dashboardScroll} 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        <Text style={styles.sectionTitle}>Performance Insights</Text>
        
        {/* Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statsHeader}>
            <View style={styles.statsIcon}><Text style={styles.statsIconText}>💰</Text></View>
            <Text style={styles.statsChange}>+12%</Text>
          </View>
          <Text style={styles.statsValue}>₦0.00</Text>
          <Text style={styles.statsLabel}>Total Earnings</Text>
        </View>

        {/* Mini Stats */}
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
            <Text style={styles.emptyActivityText}>No recent activity. Upload your first release to get started!</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('ReleasesTab', { screen: 'Upload' })}>
            <Text style={styles.actionIcon}>📀</Text>
            <Text style={styles.actionLabel}>New Release</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('EarningsTab', { screen: 'Analytics' })}>
            <Text style={styles.actionIcon}>📊</Text>
            <Text style={styles.actionLabel}>Analytics</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('EarningsTab')}>
            <Text style={styles.actionIcon}>💰</Text>
            <Text style={styles.actionLabel}>Earnings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('PromoteTab')}>
            <Text style={styles.actionIcon}>📢</Text>
            <Text style={styles.actionLabel}>Promote</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('ReleasesTab', { screen: 'Upload' })}>
        <LinearGradient colors={[colors.accent, colors.primaryGlow]} style={styles.fabGradient}>
          <Text style={styles.fabIcon}>+</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

// Releases Screen
const ReleasesScreen = ({ navigation }: any) => {
  const [releases, setReleases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReleases();
  }, []);

  const loadReleases = async () => {
    setLoading(true);
    try {
      // In real app, fetch from Supabase
      setReleases([]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>My Releases</Text>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('Upload')}>
          <Text style={styles.headerButtonText}>+ New</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : releases.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📀</Text>
          <Text style={styles.emptyTitle}>No Releases Yet</Text>
          <Text style={styles.emptyDescription}>Upload your first track to start distributing your music worldwide.</Text>
          <TouchableOpacity style={styles.emptyButton} onPress={() => navigation.navigate('Upload')}>
            <LinearGradient colors={[colors.primary, colors.accent]} style={styles.gradientButton}>
              <Text style={styles.primaryButtonText}>Upload Release</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={releases}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.releaseItem} onPress={() => navigation.navigate('ReleaseDetail', { id: item.id })}>
              <View style={styles.releaseCover}>
                <Text style={styles.releaseCoverText}>🎵</Text>
              </View>
              <View style={styles.releaseInfo}>
                <Text style={styles.releaseTitle}>{item.title}</Text>
                <Text style={styles.releaseArtist}>{item.artist}</Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
    </View>
  );
};

// Upload Screen
const UploadScreen = ({ navigation }: any) => {
  return (
    <View style={styles.screenContainer}>
      <View style={styles.screenHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>New Release</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.uploadContent}>
        <View style={styles.uploadCoverArea}>
          <TouchableOpacity style={styles.uploadCoverButton}>
            <Text style={styles.uploadCoverIcon}>🖼️</Text>
            <Text style={styles.uploadCoverText}>Upload Cover Art</Text>
            <Text style={styles.uploadCoverHint}>3000x3000px recommended</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Release Title *</Text>
          <TextInput style={styles.formInput} placeholder="Enter release title" placeholderTextColor={colors.mutedForeground} />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Primary Artist *</Text>
          <TextInput style={styles.formInput} placeholder="Artist name" placeholderTextColor={colors.mutedForeground} />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Genre *</Text>
          <TouchableOpacity style={styles.formSelect}>
            <Text style={styles.formSelectText}>Select genre</Text>
            <Text style={styles.formSelectArrow}>▼</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.addTrackButton}>
          <Text style={styles.addTrackIcon}>🎵</Text>
          <Text style={styles.addTrackText}>Add Tracks</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.primaryButton, { marginTop: 24 }]}>
          <LinearGradient colors={[colors.primary, colors.accent]} style={styles.gradientButton}>
            <Text style={styles.primaryButtonText}>Continue to Distribution</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

// Promote Screen
const PromoteScreen = ({ navigation }: any) => {
  return (
    <View style={styles.screenContainer}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>Promotions</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Text style={styles.headerButtonText}>+ Campaign</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.emptyState}>
        <Text style={styles.emptyIcon}>📢</Text>
        <Text style={styles.emptyTitle}>Boost Your Music</Text>
        <Text style={styles.emptyDescription}>Create promotional campaigns to reach more listeners and grow your fanbase.</Text>
        <TouchableOpacity style={styles.emptyButton}>
          <LinearGradient colors={[colors.primary, colors.accent]} style={styles.gradientButton}>
            <Text style={styles.primaryButtonText}>Create Campaign</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Earnings Screen
const EarningsScreen = ({ navigation }: any) => {
  return (
    <View style={styles.screenContainer}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>Earnings</Text>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('Analytics')}>
          <Text style={styles.headerButtonText}>Analytics</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Balance Card */}
        <LinearGradient colors={[colors.primary, colors.accent]} style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceValue}>₦0.00</Text>
          <TouchableOpacity style={styles.withdrawButton}>
            <Text style={styles.withdrawButtonText}>Withdraw</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Stats */}
        <View style={styles.earningsStats}>
          <View style={styles.earningStat}>
            <Text style={styles.earningStatValue}>₦0.00</Text>
            <Text style={styles.earningStatLabel}>This Month</Text>
          </View>
          <View style={styles.earningStat}>
            <Text style={styles.earningStatValue}>₦0.00</Text>
            <Text style={styles.earningStatLabel}>Pending</Text>
          </View>
          <View style={styles.earningStat}>
            <Text style={styles.earningStatValue}>₦0.00</Text>
            <Text style={styles.earningStatLabel}>Total Earned</Text>
          </View>
        </View>

        {/* Transactions */}
        <View style={styles.transactionsSection}>
          <Text style={styles.transactionsTitle}>Recent Transactions</Text>
          <View style={styles.emptyTransactions}>
            <Text style={styles.emptyTransactionsText}>No transactions yet</Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

// Analytics Screen
const AnalyticsScreen = ({ navigation }: any) => {
  return (
    <View style={styles.screenContainer}>
      <View style={styles.screenHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Analytics</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Time Period Selector */}
        <View style={styles.periodSelector}>
          {['7D', '30D', '90D', '1Y', 'All'].map((period, index) => (
            <TouchableOpacity key={period} style={[styles.periodButton, index === 1 && styles.periodButtonActive]}>
              <Text style={[styles.periodButtonText, index === 1 && styles.periodButtonTextActive]}>{period}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Chart Placeholder */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Streams Over Time</Text>
          <View style={styles.chartPlaceholder}>
            <Text style={styles.chartPlaceholderText}>📊 Chart will appear here</Text>
          </View>
        </View>

        {/* Top Tracks */}
        <View style={styles.analyticsSection}>
          <Text style={styles.analyticsSectionTitle}>Top Tracks</Text>
          <View style={styles.emptyAnalytics}>
            <Text style={styles.emptyAnalyticsText}>No data available yet</Text>
          </View>
        </View>

        {/* Top Countries */}
        <View style={styles.analyticsSection}>
          <Text style={styles.analyticsSectionTitle}>Top Countries</Text>
          <View style={styles.emptyAnalytics}>
            <Text style={styles.emptyAnalyticsText}>No data available yet</Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

// Profile Screen
const ProfileScreen = ({ navigation }: any) => {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { icon: '👤', label: 'Edit Profile', screen: 'EditProfile' },
    { icon: '⚙️', label: 'Settings', screen: 'Settings' },
    { icon: '🔔', label: 'Notifications', screen: 'Notifications' },
    { icon: '💳', label: 'Payment Methods', screen: 'PaymentMethods' },
    { icon: '📜', label: 'Terms of Service', screen: 'Terms' },
    { icon: '🔒', label: 'Privacy Policy', screen: 'Privacy' },
    { icon: '❓', label: 'Help & Support', screen: 'Support' },
  ];

  return (
    <View style={styles.screenContainer}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>{user?.email?.charAt(0).toUpperCase() || 'U'}</Text>
          </View>
          <Text style={styles.profileName}>{user?.user_metadata?.full_name || 'User'}</Text>
          <Text style={styles.profileEmail}>{user?.email}</Text>
          <View style={styles.profileBadge}>
            <Text style={styles.profileBadgeText}>Artist</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.profileMenu}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign Out */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={colors.destructive} />
          ) : (
            <Text style={styles.signOutText}>Sign Out</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.versionText}>Version 1.0.0</Text>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

// Tab Navigator
const TabIcon = ({ icon, focused }: { icon: string; focused: boolean }) => (
  <View style={[styles.tabIconContainer, focused && styles.tabIconContainerActive]}>
    <Text style={styles.tabIcon}>{icon}</Text>
  </View>
);

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => <TabIcon icon="🏠" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="ReleasesTab"
        component={ReleasesStack}
        options={{
          tabBarLabel: 'Releases',
          tabBarIcon: ({ focused }) => <TabIcon icon="📀" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="PromoteTab"
        component={PromoteScreen}
        options={{
          tabBarLabel: 'Promote',
          tabBarIcon: ({ focused }) => <TabIcon icon="📢" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="EarningsTab"
        component={EarningsStack}
        options={{
          tabBarLabel: 'Earnings',
          tabBarIcon: ({ focused }) => <TabIcon icon="💰" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused }) => <TabIcon icon="👤" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
};

// Stack Navigators for tabs
const ReleasesStackNav = createNativeStackNavigator();
const ReleasesStack = () => (
  <ReleasesStackNav.Navigator screenOptions={{ headerShown: false }}>
    <ReleasesStackNav.Screen name="ReleasesList" component={ReleasesScreen} />
    <ReleasesStackNav.Screen name="Upload" component={UploadScreen} />
  </ReleasesStackNav.Navigator>
);

const EarningsStackNav = createNativeStackNavigator();
const EarningsStack = () => (
  <EarningsStackNav.Navigator screenOptions={{ headerShown: false }}>
    <EarningsStackNav.Screen name="EarningsMain" component={EarningsScreen} />
    <EarningsStackNav.Screen name="Analytics" component={AnalyticsScreen} />
  </EarningsStackNav.Navigator>
);

// Auth Provider
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAuth = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        await loadProfile(data.session.user.id);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadProfile = async (userId: string) => {
    try {
      const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string, fullName: string, userType: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, user_type: userType } },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// Main App
export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}

const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ExpoStatusBar style="light" />
        <Image source={mmLogo} style={styles.loadingLogo} resizeMode="contain" />
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 24 }} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Main" component={MainTabs} />
        ) : (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// ============ STYLES ============
const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: colors.background },
  
  // Loading
  loadingContainer: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  loadingLogo: { width: 120, height: 60 },

  // Welcome/Carousel
  carouselBackground: { ...StyleSheet.absoluteFillObject },
  backgroundImage: { flex: 1, width: '100%', height: '100%' },
  backgroundOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
  welcomeContent: { flex: 1, justifyContent: 'flex-end' },
  carouselContainer: { paddingHorizontal: 16, marginBottom: 16 },
  carouselCard: { borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  blurCard: { padding: 24 },
  cardInner: { alignItems: 'center' },
  carouselTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 12, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 },
  carouselDescription: { fontSize: 15, color: 'rgba(255,255,255,0.9)', textAlign: 'center', lineHeight: 22 },
  progressDots: { flexDirection: 'row', justifyContent: 'center', marginTop: 16, gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.5)' },
  dotActive: { width: 24, backgroundColor: colors.primary },
  bottomGradient: { paddingHorizontal: 24, paddingTop: 48, paddingBottom: Platform.OS === 'ios' ? 40 : 24 },
  primaryButton: { borderRadius: 16, overflow: 'hidden', marginBottom: 16, shadowColor: colors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 8 },
  gradientButton: { paddingVertical: 16, paddingHorizontal: 24, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  gradientButtonDisabled: { opacity: 0.5 },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  buttonIcon: { color: '#fff', fontSize: 18, marginLeft: 8 },
  buttonDisabled: { opacity: 0.5 },
  loginPrompt: { textAlign: 'center', color: colors.mutedForeground, fontSize: 14 },
  loginLink: { color: colors.primary, fontWeight: '600' },

  // Drawer
  drawerOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'flex-end' },
  drawerBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  drawer: { backgroundColor: colors.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 16, paddingBottom: Platform.OS === 'ios' ? 40 : 24, maxHeight: '85%' },
  drawerHandle: { width: 40, height: 4, backgroundColor: colors.border, borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 16 },
  drawerTitle: { fontSize: 20, fontWeight: 'bold', color: colors.foreground, textAlign: 'center' },
  drawerSubtitle: { fontSize: 14, color: colors.mutedForeground, textAlign: 'center', marginTop: 4, marginBottom: 16 },
  userTypeList: { maxHeight: 300 },
  userTypeCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.secondary, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 2, borderColor: 'transparent' },
  userTypeCardSelected: { borderColor: colors.primary },
  userTypeIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  userTypeIconText: { fontSize: 20 },
  userTypeInfo: { flex: 1, marginLeft: 12 },
  userTypeLabel: { fontSize: 16, fontWeight: '600', color: colors.foreground },
  userTypeDescription: { fontSize: 13, color: colors.mutedForeground, marginTop: 2 },
  checkmark: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  checkmarkText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  drawerNote: { fontSize: 12, color: colors.mutedForeground, textAlign: 'center', marginTop: 8 },

  // Login/Signup
  loginContainer: { flexGrow: 1, justifyContent: 'flex-end', paddingHorizontal: 16, paddingBottom: Platform.OS === 'ios' ? 40 : 24 },
  backButton: { position: 'absolute', top: Platform.OS === 'ios' ? 60 : 40, left: 16, zIndex: 10 },
  backButtonText: { fontSize: 28, color: '#fff', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 },
  loginCard: { borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  loginBlur: { overflow: 'hidden' },
  loginCardHeader: { backgroundColor: 'rgba(255,255,255,0.05)', paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
  loginTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  loginCardContent: { padding: 20 },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 14, color: 'rgba(255,255,255,0.9)', marginBottom: 8 },
  passwordHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  forgotPassword: { fontSize: 13, color: colors.primary },
  input: { backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: '#fff' },
  messageBox: { padding: 12, borderRadius: 8, marginBottom: 16 },
  successBox: { backgroundColor: 'rgba(34, 197, 94, 0.2)' },
  errorBox: { backgroundColor: 'rgba(239, 68, 68, 0.2)' },
  messageText: { fontSize: 14, textAlign: 'center' },
  successText: { color: colors.success },
  errorText: { color: colors.destructive },
  signupPrompt: { textAlign: 'center', color: 'rgba(255,255,255,0.9)', fontSize: 14, marginTop: 8 },
  signupLink: { color: colors.primary, fontWeight: '600' },
  selectedTypeChip: { backgroundColor: colors.primary + '30', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, alignSelf: 'center', marginBottom: 16, borderWidth: 1, borderColor: colors.primary + '50' },
  selectedTypeText: { color: colors.primaryForeground, fontSize: 14, fontWeight: '500' },

  // Dashboard
  dashboardContainer: { flex: 1, backgroundColor: colors.background },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, paddingTop: Platform.OS === 'ios' ? 50 : 12, backgroundColor: colors.background },
  topBarLogo: { width: 80, height: 32 },
  artistBadge: { backgroundColor: colors.primary + '25', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: colors.primary + '50' },
  artistBadgeText: { color: colors.primary, fontSize: 12, fontWeight: '600', letterSpacing: 1 },
  avatarButton: { width: 40, height: 40 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  dashboardScroll: { flex: 1, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: colors.foreground, marginTop: 20, marginBottom: 12 },
  statsCard: { backgroundColor: colors.card, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: colors.border },
  statsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  statsIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primary + '30', alignItems: 'center', justifyContent: 'center' },
  statsIconText: { fontSize: 16 },
  statsChange: { color: colors.success, fontSize: 12, fontWeight: '600' },
  statsValue: { fontSize: 24, fontWeight: 'bold', color: colors.foreground },
  statsLabel: { fontSize: 12, color: colors.mutedForeground, fontWeight: '500', marginTop: 4 },
  miniStatsRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  miniStatCard: { flex: 1, backgroundColor: colors.card, borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  miniStatValue: { fontSize: 20, fontWeight: 'bold', color: colors.foreground },
  miniStatLabel: { fontSize: 11, color: colors.mutedForeground, marginTop: 4 },
  activityCard: { backgroundColor: colors.card, borderRadius: 20, padding: 16, marginTop: 16, borderWidth: 1, borderColor: colors.border },
  activityHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  activityIcon: { fontSize: 20 },
  activityTitle: { fontSize: 16, fontWeight: 'bold', color: colors.foreground },
  emptyActivity: { paddingVertical: 24, alignItems: 'center' },
  emptyActivityText: { color: colors.mutedForeground, fontSize: 14, textAlign: 'center' },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  actionCard: { width: (SCREEN_WIDTH - 44) / 2, backgroundColor: colors.card, borderRadius: 16, padding: 20, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  actionIcon: { fontSize: 32, marginBottom: 8 },
  actionLabel: { fontSize: 14, fontWeight: '500', color: colors.foreground },
  fab: { position: 'absolute', bottom: 100, right: 24, borderRadius: 28, overflow: 'hidden', shadowColor: colors.accent, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.5, shadowRadius: 16, elevation: 8 },
  fabGradient: { width: 56, height: 56, alignItems: 'center', justifyContent: 'center' },
  fabIcon: { color: '#fff', fontSize: 28, fontWeight: '300' },

  // Tab Bar
  tabBar: { backgroundColor: colors.card, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 8, paddingBottom: Platform.OS === 'ios' ? 24 : 8, height: Platform.OS === 'ios' ? 88 : 64 },
  tabBarLabel: { fontSize: 10, fontWeight: '500' },
  tabIconContainer: { width: 40, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  tabIconContainerActive: { backgroundColor: colors.primary + '20' },
  tabIcon: { fontSize: 20 },

  // Screen Container
  screenContainer: { flex: 1, backgroundColor: colors.background, paddingTop: Platform.OS === 'ios' ? 50 : 10 },
  screenHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  screenTitle: { fontSize: 24, fontWeight: 'bold', color: colors.foreground },
  headerButton: { backgroundColor: colors.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  headerButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  backArrow: { fontSize: 24, color: colors.foreground },
  centerContent: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  // Empty State
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: colors.foreground, marginBottom: 8 },
  emptyDescription: { fontSize: 14, color: colors.mutedForeground, textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  emptyButton: { borderRadius: 16, overflow: 'hidden' },

  // Releases
  releaseItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: 16, padding: 12, marginHorizontal: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  releaseCover: { width: 56, height: 56, borderRadius: 8, backgroundColor: colors.secondary, alignItems: 'center', justifyContent: 'center' },
  releaseCoverText: { fontSize: 24 },
  releaseInfo: { flex: 1, marginLeft: 12 },
  releaseTitle: { fontSize: 16, fontWeight: '600', color: colors.foreground },
  releaseArtist: { fontSize: 13, color: colors.mutedForeground, marginTop: 2 },

  // Upload
  uploadContent: { paddingHorizontal: 16 },
  uploadCoverArea: { marginBottom: 24 },
  uploadCoverButton: { height: 200, backgroundColor: colors.card, borderRadius: 20, borderWidth: 2, borderColor: colors.border, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
  uploadCoverIcon: { fontSize: 48, marginBottom: 12 },
  uploadCoverText: { fontSize: 16, fontWeight: '600', color: colors.foreground },
  uploadCoverHint: { fontSize: 12, color: colors.mutedForeground, marginTop: 4 },
  formGroup: { marginBottom: 16 },
  formLabel: { fontSize: 14, fontWeight: '500', color: colors.foreground, marginBottom: 8 },
  formInput: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: colors.foreground },
  formSelect: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  formSelectText: { fontSize: 16, color: colors.mutedForeground },
  formSelectArrow: { fontSize: 12, color: colors.mutedForeground },
  addTrackButton: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
  addTrackIcon: { fontSize: 24 },
  addTrackText: { fontSize: 16, fontWeight: '600', color: colors.foreground },

  // Earnings
  balanceCard: { margin: 16, borderRadius: 20, padding: 24, alignItems: 'center' },
  balanceLabel: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  balanceValue: { fontSize: 36, fontWeight: 'bold', color: '#fff', marginVertical: 8 },
  withdrawButton: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 20, marginTop: 8 },
  withdrawButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  earningsStats: { flexDirection: 'row', paddingHorizontal: 16, gap: 8 },
  earningStat: { flex: 1, backgroundColor: colors.card, borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  earningStatValue: { fontSize: 16, fontWeight: 'bold', color: colors.foreground },
  earningStatLabel: { fontSize: 11, color: colors.mutedForeground, marginTop: 4 },
  transactionsSection: { margin: 16 },
  transactionsTitle: { fontSize: 18, fontWeight: '600', color: colors.foreground, marginBottom: 12 },
  emptyTransactions: { backgroundColor: colors.card, borderRadius: 16, padding: 32, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  emptyTransactionsText: { color: colors.mutedForeground, fontSize: 14 },

  // Analytics
  periodSelector: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 16, gap: 8 },
  periodButton: { flex: 1, paddingVertical: 10, borderRadius: 20, backgroundColor: colors.card, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  periodButtonActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  periodButtonText: { fontSize: 13, fontWeight: '500', color: colors.mutedForeground },
  periodButtonTextActive: { color: '#fff' },
  chartCard: { marginHorizontal: 16, backgroundColor: colors.card, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 16 },
  chartTitle: { fontSize: 16, fontWeight: '600', color: colors.foreground, marginBottom: 16 },
  chartPlaceholder: { height: 180, backgroundColor: colors.secondary, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  chartPlaceholderText: { color: colors.mutedForeground, fontSize: 14 },
  analyticsSection: { marginHorizontal: 16, marginBottom: 16 },
  analyticsSectionTitle: { fontSize: 16, fontWeight: '600', color: colors.foreground, marginBottom: 12 },
  emptyAnalytics: { backgroundColor: colors.card, borderRadius: 16, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  emptyAnalyticsText: { color: colors.mutedForeground, fontSize: 14 },

  // Profile
  profileHeader: { alignItems: 'center', paddingVertical: 24 },
  profileAvatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  profileAvatarText: { fontSize: 32, fontWeight: 'bold', color: '#fff' },
  profileName: { fontSize: 20, fontWeight: 'bold', color: colors.foreground },
  profileEmail: { fontSize: 14, color: colors.mutedForeground, marginTop: 4 },
  profileBadge: { backgroundColor: colors.primary + '25', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginTop: 12, borderWidth: 1, borderColor: colors.primary + '50' },
  profileBadgeText: { color: colors.primary, fontSize: 12, fontWeight: '600' },
  profileMenu: { marginHorizontal: 16 },
  menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: 16, padding: 16, marginBottom: 8, borderWidth: 1, borderColor: colors.border },
  menuIcon: { fontSize: 20, marginRight: 12 },
  menuLabel: { flex: 1, fontSize: 16, color: colors.foreground },
  menuArrow: { fontSize: 20, color: colors.mutedForeground },
  signOutButton: { marginHorizontal: 16, marginTop: 16, paddingVertical: 16, borderRadius: 16, borderWidth: 1, borderColor: colors.destructive, alignItems: 'center' },
  signOutText: { color: colors.destructive, fontSize: 16, fontWeight: '600' },
  versionText: { textAlign: 'center', color: colors.mutedForeground, fontSize: 12, marginTop: 24 },
});
