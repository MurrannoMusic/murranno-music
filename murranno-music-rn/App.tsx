/**
 * Murranno Music - Complete React Native App
 * Full featured app with all screens and Supabase integration
 */
import React, { useEffect, useState, useRef, createContext, useContext, useCallback } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView,
  SafeAreaView, Platform, TextInput, KeyboardAvoidingView, ImageBackground,
  Dimensions, Animated, Image, FlatList, RefreshControl, Switch, Alert, Modal,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';

import { supabase } from './src/services/supabase';
import { colors } from './src/theme';
import api, { Profile, Release, Notification, Earning, Campaign } from './src/services/api';

// Assets
const musicianBg = require('./src/assets/musician-background.jpg');
const mmLogo = require('./src/assets/mm_logo.png');
const prototype1 = require('./src/assets/prototype-1.jpg');
const prototype2 = require('./src/assets/prototype-2.jpg');
const prototype3 = require('./src/assets/prototype-3.jpg');

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Carousel slides
const slides = [
  { title: "Distribute Your Music Globally", description: "Upload once and reach all major streaming platforms including Spotify, Apple Music, Boomplay, and more.", backgroundImage: prototype1 },
  { title: "Promote & Grow Your Fanbase", description: "Run targeted campaigns, playlist pitching, and influencer partnerships to amplify your reach.", backgroundImage: prototype2 },
  { title: "Track Royalties & Get Paid Fast", description: "Real-time analytics, transparent earnings, and fast payouts to your bank or mobile money wallet.", backgroundImage: prototype3 },
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
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, userType: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
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

// ============ AUTH SCREENS ============

const WelcomeScreen = ({ navigation }: any) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState<string | null>(null);
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const interval = setInterval(() => setCurrentSlide((p) => (p + 1) % slides.length), 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    Animated.timing(slideAnim, { toValue: currentSlide, duration: 500, useNativeDriver: true }).start();
  }, [currentSlide]);

  return (
    <View style={styles.container}>
      <ExpoStatusBar style="light" />
      {slides.map((slide, i) => (
        <Animated.View key={i} style={[styles.carouselBg, { opacity: slideAnim.interpolate({ inputRange: [i - 1, i, i + 1], outputRange: [0, 1, 0], extrapolate: 'clamp' }) }]}>
          <ImageBackground source={slide.backgroundImage} style={styles.bgImage} resizeMode="cover">
            <View style={styles.bgOverlay} />
          </ImageBackground>
        </Animated.View>
      ))}
      <SafeAreaView style={styles.welcomeContent}>
        <View style={styles.carouselContainer}>
          <View style={styles.carouselCard}>
            <BlurView intensity={40} tint="dark" style={styles.blurCard}>
              <Text style={styles.carouselTitle}>{slides[currentSlide].title}</Text>
              <Text style={styles.carouselDesc}>{slides[currentSlide].description}</Text>
            </BlurView>
          </View>
          <View style={styles.dots}>
            {slides.map((_, i) => (
              <TouchableOpacity key={i} onPress={() => setCurrentSlide(i)} style={[styles.dot, i === currentSlide && styles.dotActive]} />
            ))}
          </View>
        </View>
        <LinearGradient colors={['transparent', colors.background, colors.background]} style={styles.bottomGradient}>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => setShowDrawer(true)}>
            <LinearGradient colors={colors.gradientPrimary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradientBtn}>
              <Text style={styles.primaryBtnText}>Get Started</Text>
              <Text style={styles.btnIcon}>↑</Text>
            </LinearGradient>
          </TouchableOpacity>
          <Text style={styles.loginPrompt}>Already have an account? <Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}>Log in</Text></Text>
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
                <TouchableOpacity key={item.type} style={[styles.userTypeCard, selectedUserType === item.type && styles.userTypeCardSelected]} onPress={() => setSelectedUserType(item.type)}>
                  <View style={[styles.userTypeIcon, { backgroundColor: item.color }]}><Text style={styles.userTypeIconText}>{item.icon}</Text></View>
                  <View style={styles.userTypeInfo}>
                    <Text style={styles.userTypeLabel}>{item.label}</Text>
                    <Text style={styles.userTypeDesc}>{item.description}</Text>
                  </View>
                  {selectedUserType === item.type && <View style={styles.checkmark}><Text style={styles.checkmarkText}>✓</Text></View>}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={[styles.primaryBtn, !selectedUserType && styles.btnDisabled]} onPress={() => { if (selectedUserType) { setShowDrawer(false); navigation.navigate('Signup', { userType: selectedUserType }); } }} disabled={!selectedUserType}>
              <LinearGradient colors={colors.gradientPrimary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.gradientBtn, !selectedUserType && styles.gradientBtnDisabled]}>
                <Text style={styles.primaryBtnText}>Create Account</Text>
              </LinearGradient>
            </TouchableOpacity>
            <Text style={styles.drawerNote}>You can change your account type later in settings</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const LoginScreen = ({ navigation }: any) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    if (!email || !password) { setMessage('Please enter email and password'); return; }
    setLoading(true); setMessage('');
    try { await signIn(email, password); } catch (e: any) { setMessage(e.message || 'Sign in failed'); } finally { setLoading(false); }
  };

  return (
    <View style={styles.container}>
      <ExpoStatusBar style="light" />
      <ImageBackground source={musicianBg} style={styles.bgImage} resizeMode="cover">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
          <SafeAreaView style={styles.flex}>
            <ScrollView contentContainerStyle={styles.authContainer} keyboardShouldPersistTaps="handled">
              <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}><Text style={styles.backBtnText}>←</Text></TouchableOpacity>
              <View style={styles.authCard}>
                <BlurView intensity={60} tint="dark" style={styles.authBlur}>
                  <View style={styles.authHeader}><Text style={styles.authTitle}>Log in to your account</Text></View>
                  <View style={styles.authContent}>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Email</Text>
                      <TextInput style={styles.input} placeholder="Enter your email" placeholderTextColor="rgba(255,255,255,0.5)" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                    </View>
                    <View style={styles.inputGroup}>
                      <View style={styles.passwordHeader}>
                        <Text style={styles.inputLabel}>Password</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}><Text style={styles.forgotPw}>Forgot password?</Text></TouchableOpacity>
                      </View>
                      <TextInput style={styles.input} placeholder="Enter your password" placeholderTextColor="rgba(255,255,255,0.5)" value={password} onChangeText={setPassword} secureTextEntry />
                    </View>
                    {message ? <View style={[styles.msgBox, message.includes('success') ? styles.successBox : styles.errorBox]}><Text style={[styles.msgText, message.includes('success') ? styles.successText : styles.errorText]}>{message}</Text></View> : null}
                    <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin} disabled={loading}>
                      <LinearGradient colors={colors.gradientPrimary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradientBtn}>
                        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Log In</Text>}
                      </LinearGradient>
                    </TouchableOpacity>
                    <Text style={styles.signupPrompt}>Don't have an account? <Text style={styles.signupLink} onPress={() => navigation.navigate('Signup')}>Sign up</Text></Text>
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

const SignupScreen = ({ navigation, route }: any) => {
  const { signUp } = useAuth();
  const userType = route.params?.userType || 'artist';
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSignup = async () => {
    if (!email || !password) { setMessage('Please enter email and password'); return; }
    if (password.length < 6) { setMessage('Password must be at least 6 characters'); return; }
    setLoading(true); setMessage('');
    try { await signUp(email, password, fullName, userType); setMessage('Check your email for verification link!'); } catch (e: any) { setMessage(e.message || 'Sign up failed'); } finally { setLoading(false); }
  };

  const selectedType = userTypes.find(u => u.type === userType);

  return (
    <View style={styles.container}>
      <ExpoStatusBar style="light" />
      <ImageBackground source={musicianBg} style={styles.bgImage} resizeMode="cover">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
          <SafeAreaView style={styles.flex}>
            <ScrollView contentContainerStyle={styles.authContainer} keyboardShouldPersistTaps="handled">
              <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}><Text style={styles.backBtnText}>←</Text></TouchableOpacity>
              <View style={styles.authCard}>
                <BlurView intensity={60} tint="dark" style={styles.authBlur}>
                  <View style={styles.authHeader}><Text style={styles.authTitle}>Create your account</Text></View>
                  <View style={styles.authContent}>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Full Name</Text>
                      <TextInput style={styles.input} placeholder="Enter your full name" placeholderTextColor="rgba(255,255,255,0.5)" value={fullName} onChangeText={setFullName} autoCapitalize="words" />
                    </View>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Email</Text>
                      <TextInput style={styles.input} placeholder="Enter your email" placeholderTextColor="rgba(255,255,255,0.5)" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                    </View>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Password</Text>
                      <TextInput style={styles.input} placeholder="Create a password (min 6 characters)" placeholderTextColor="rgba(255,255,255,0.5)" value={password} onChangeText={setPassword} secureTextEntry />
                    </View>
                    {selectedType && <View style={styles.typeChip}><Text style={styles.typeChipText}>{selectedType.icon} {selectedType.label}</Text></View>}
                    {message ? <View style={[styles.msgBox, message.includes('Check') ? styles.successBox : styles.errorBox]}><Text style={[styles.msgText, message.includes('Check') ? styles.successText : styles.errorText]}>{message}</Text></View> : null}
                    <TouchableOpacity style={styles.primaryBtn} onPress={handleSignup} disabled={loading}>
                      <LinearGradient colors={colors.gradientPrimary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradientBtn}>
                        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Create Account</Text>}
                      </LinearGradient>
                    </TouchableOpacity>
                    <Text style={styles.signupPrompt}>Already have an account? <Text style={styles.signupLink} onPress={() => navigation.navigate('Login')}>Log in</Text></Text>
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

const ForgotPasswordScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleReset = async () => {
    if (!email) { setMessage('Please enter your email'); return; }
    setLoading(true); setMessage('');
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      setMessage('Password reset email sent! Check your inbox.');
    } catch (e: any) { setMessage(e.message || 'Failed to send reset email'); } finally { setLoading(false); }
  };

  return (
    <View style={styles.container}>
      <ExpoStatusBar style="light" />
      <SafeAreaView style={styles.flex}>
        <View style={styles.screenHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.backArrow}>←</Text></TouchableOpacity>
          <Text style={styles.screenTitle}>Reset Password</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.centerContent}>
          <Text style={styles.forgotIcon}>🔐</Text>
          <Text style={styles.forgotTitle}>Forgot your password?</Text>
          <Text style={styles.forgotDesc}>Enter your email and we'll send you a link to reset your password.</Text>
          <View style={[styles.inputGroup, { width: '100%', paddingHorizontal: 24 }]}>
            <TextInput style={[styles.input, styles.inputDark]} placeholder="Enter your email" placeholderTextColor={colors.mutedForeground} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          </View>
          {message ? <View style={[styles.msgBox, { marginHorizontal: 24 }, message.includes('sent') ? styles.successBox : styles.errorBox]}><Text style={[styles.msgText, message.includes('sent') ? styles.successText : styles.errorText]}>{message}</Text></View> : null}
          <TouchableOpacity style={[styles.primaryBtn, { marginHorizontal: 24 }]} onPress={handleReset} disabled={loading}>
            <LinearGradient colors={colors.gradientPrimary} style={styles.gradientBtn}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Send Reset Link</Text>}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

// ============ MAIN SCREENS ============

const DashboardScreen = ({ navigation }: any) => {
  const { user, profile, refreshProfile } = useAuth();
  const [stats, setStats] = useState({ totalReleases: 0, totalEarnings: 0, availableBalance: 0, thisMonthEarnings: 0 });
  const [refreshing, setRefreshing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadData = useCallback(async () => {
    if (!user) return;
    const [dashStats, unread] = await Promise.all([
      api.analytics.getDashboardStats(user.id),
      api.notifications.getUnreadCount(user.id),
    ]);
    setStats(dashStats);
    setUnreadCount(unread);
  }, [user]);

  useEffect(() => { loadData(); }, [loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadData(), refreshProfile()]);
    setRefreshing(false);
  };

  const userTypeLabel = profile?.user_type?.toUpperCase() || 'ARTIST';

  return (
    <View style={styles.dashContainer}>
      <ExpoStatusBar style="light" />
      <View style={styles.topBar}>
        <Image source={mmLogo} style={styles.topBarLogo} resizeMode="contain" />
        <View style={styles.badge}><Text style={styles.badgeText}>{userTypeLabel}</Text></View>
        <TouchableOpacity style={styles.notifBtn} onPress={() => navigation.navigate('Notifications')}>
          <Text style={styles.notifIcon}>🔔</Text>
          {unreadCount > 0 && <View style={styles.notifBadge}><Text style={styles.notifBadgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text></View>}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.dashScroll} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}>
        <Text style={styles.greeting}>Welcome back, {profile?.full_name?.split(' ')[0] || 'Artist'}! 👋</Text>
        
        <Text style={styles.sectionTitle}>Performance Insights</Text>
        
        <LinearGradient colors={colors.gradientPrimary} style={styles.mainStatCard}>
          <View style={styles.mainStatHeader}>
            <View style={styles.mainStatIcon}><Text>💰</Text></View>
            <View style={[styles.changeBadge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}><Text style={styles.changeText}>+12%</Text></View>
          </View>
          <Text style={styles.mainStatValue}>₦{stats.totalEarnings.toLocaleString()}</Text>
          <Text style={styles.mainStatLabel}>Total Earnings</Text>
        </LinearGradient>

        <View style={styles.statsRow}>
          <View style={styles.miniStatCard}>
            <Text style={styles.miniStatIcon}>📀</Text>
            <Text style={styles.miniStatValue}>{stats.totalReleases}</Text>
            <Text style={styles.miniStatLabel}>Releases</Text>
          </View>
          <View style={styles.miniStatCard}>
            <Text style={styles.miniStatIcon}>🎧</Text>
            <Text style={styles.miniStatValue}>0</Text>
            <Text style={styles.miniStatLabel}>Streams</Text>
          </View>
          <View style={styles.miniStatCard}>
            <Text style={styles.miniStatIcon}>👥</Text>
            <Text style={styles.miniStatValue}>0</Text>
            <Text style={styles.miniStatLabel}>Followers</Text>
          </View>
        </View>

        <View style={styles.activityCard}>
          <View style={styles.activityHeader}>
            <Text style={styles.activityIcon}>🕐</Text>
            <Text style={styles.activityTitle}>Recent Activity</Text>
          </View>
          <View style={styles.emptyActivity}><Text style={styles.emptyText}>No recent activity. Upload your first release to get started!</Text></View>
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {[
            { icon: '📀', label: 'New Release', action: () => navigation.navigate('ReleasesTab', { screen: 'Upload' }) },
            { icon: '📊', label: 'Analytics', action: () => navigation.navigate('EarningsTab', { screen: 'Analytics' }) },
            { icon: '💰', label: 'Earnings', action: () => navigation.navigate('EarningsTab') },
            { icon: '📢', label: 'Promote', action: () => navigation.navigate('PromoteTab') },
          ].map((item, i) => (
            <TouchableOpacity key={i} style={styles.actionCard} onPress={item.action}>
              <Text style={styles.actionIcon}>{item.icon}</Text>
              <Text style={styles.actionLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ height: 120 }} />
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('ReleasesTab', { screen: 'Upload' })}>
        <LinearGradient colors={colors.gradientAccent} style={styles.fabGradient}><Text style={styles.fabIcon}>+</Text></LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const ReleasesScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadReleases = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const data = await api.releases.getAll(user.id);
    setReleases(data);
    setLoading(false);
  }, [user]);

  useEffect(() => { loadReleases(); }, [loadReleases]);

  const onRefresh = async () => { setRefreshing(true); await loadReleases(); setRefreshing(false); };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return colors.success;
      case 'pending': return colors.warning;
      case 'rejected': return colors.destructive;
      default: return colors.mutedForeground;
    }
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>My Releases</Text>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.navigate('Upload')}><Text style={styles.headerBtnText}>+ New</Text></TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerContent}><ActivityIndicator size="large" color={colors.primary} /></View>
      ) : releases.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📀</Text>
          <Text style={styles.emptyTitle}>No Releases Yet</Text>
          <Text style={styles.emptyDesc}>Upload your first track to start distributing your music worldwide.</Text>
          <TouchableOpacity style={styles.emptyBtn} onPress={() => navigation.navigate('Upload')}>
            <LinearGradient colors={colors.gradientPrimary} style={styles.gradientBtn}><Text style={styles.primaryBtnText}>Upload Release</Text></LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={releases}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.releaseItem} onPress={() => navigation.navigate('ReleaseDetail', { id: item.id })}>
              <View style={styles.releaseCover}>{item.cover_art_url ? <Image source={{ uri: item.cover_art_url }} style={styles.releaseCoverImg} /> : <Text style={styles.releaseCoverIcon}>🎵</Text>}</View>
              <View style={styles.releaseInfo}>
                <Text style={styles.releaseTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.releaseArtist} numberOfLines={1}>{item.artist_name}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status.toUpperCase()}</Text>
                </View>
              </View>
              <Text style={styles.releaseArrow}>›</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        />
      )}
    </View>
  );
};

const UploadScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [artistName, setArtistName] = useState('');
  const [genre, setGenre] = useState('');
  const [coverUri, setCoverUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showGenreModal, setShowGenreModal] = useState(false);

  const genres = ['Afrobeats', 'Afropop', 'Hip Hop', 'R&B', 'Gospel', 'Highlife', 'Amapiano', 'Dancehall', 'Reggae', 'Pop', 'Rock', 'Jazz', 'Classical', 'Electronic', 'Other'];

  const pickCover = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission Required', 'Please allow access to your photo library.'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 0.8 });
    if (!result.canceled && result.assets[0]) setCoverUri(result.assets[0].uri);
  };

  const handleSubmit = async () => {
    if (!title || !artistName) { Alert.alert('Error', 'Please fill in all required fields'); return; }
    setLoading(true);
    try {
      const release = await api.releases.create({ user_id: user.id, title, artist_name: artistName, genre, status: 'draft' });
      if (release && coverUri) await api.releases.uploadCoverArt(release.id, coverUri);
      Alert.alert('Success', 'Release created! You can now add tracks.', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (e: any) { Alert.alert('Error', e.message || 'Failed to create release'); } finally { setLoading(false); }
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.screenHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.backArrow}>←</Text></TouchableOpacity>
        <Text style={styles.screenTitle}>New Release</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView style={styles.uploadContent} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.coverPicker} onPress={pickCover}>
          {coverUri ? <Image source={{ uri: coverUri }} style={styles.coverPreview} /> : (
            <View style={styles.coverPlaceholder}>
              <Text style={styles.coverIcon}>🖼️</Text>
              <Text style={styles.coverText}>Upload Cover Art</Text>
              <Text style={styles.coverHint}>3000x3000px recommended</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Release Title *</Text>
          <TextInput style={styles.formInput} placeholder="Enter release title" placeholderTextColor={colors.mutedForeground} value={title} onChangeText={setTitle} />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Primary Artist *</Text>
          <TextInput style={styles.formInput} placeholder="Artist name" placeholderTextColor={colors.mutedForeground} value={artistName} onChangeText={setArtistName} />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Genre</Text>
          <TouchableOpacity style={styles.formSelect} onPress={() => setShowGenreModal(true)}>
            <Text style={[styles.formSelectText, genre && { color: colors.foreground }]}>{genre || 'Select genre'}</Text>
            <Text style={styles.formSelectArrow}>▼</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.addTrackBtn}>
          <Text style={styles.addTrackIcon}>🎵</Text>
          <Text style={styles.addTrackText}>Add Tracks (Coming Soon)</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.primaryBtn, { marginTop: 24 }]} onPress={handleSubmit} disabled={loading}>
          <LinearGradient colors={colors.gradientPrimary} style={styles.gradientBtn}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Create Release</Text>}
          </LinearGradient>
        </TouchableOpacity>
        <View style={{ height: 100 }} />
      </ScrollView>

      <Modal visible={showGenreModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Genre</Text>
            <ScrollView style={styles.genreList}>
              {genres.map((g) => (
                <TouchableOpacity key={g} style={[styles.genreItem, genre === g && styles.genreItemSelected]} onPress={() => { setGenre(g); setShowGenreModal(false); }}>
                  <Text style={[styles.genreText, genre === g && styles.genreTextSelected]}>{g}</Text>
                  {genre === g && <Text style={styles.genreCheck}>✓</Text>}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowGenreModal(false)}><Text style={styles.modalCloseText}>Cancel</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const ReleaseDetailScreen = ({ navigation, route }: any) => {
  const { id } = route.params;
  const [release, setRelease] = useState<Release | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await api.releases.getById(id);
      setRelease(data);
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) return <View style={styles.centerContent}><ActivityIndicator size="large" color={colors.primary} /></View>;
  if (!release) return <View style={styles.centerContent}><Text style={styles.emptyText}>Release not found</Text></View>;

  return (
    <View style={styles.screenContainer}>
      <View style={styles.screenHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.backArrow}>←</Text></TouchableOpacity>
        <Text style={styles.screenTitle}>Release Details</Text>
        <TouchableOpacity><Text style={styles.editBtn}>Edit</Text></TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
        <View style={styles.releaseDetailCover}>
          {release.cover_art_url ? <Image source={{ uri: release.cover_art_url }} style={styles.releaseDetailImg} /> : <Text style={styles.releaseDetailIcon}>🎵</Text>}
        </View>
        <Text style={styles.releaseDetailTitle}>{release.title}</Text>
        <Text style={styles.releaseDetailArtist}>{release.artist_name}</Text>
        <View style={styles.releaseDetailMeta}>
          <View style={styles.metaItem}><Text style={styles.metaLabel}>Status</Text><Text style={styles.metaValue}>{release.status}</Text></View>
          <View style={styles.metaItem}><Text style={styles.metaLabel}>Genre</Text><Text style={styles.metaValue}>{release.genre || 'Not set'}</Text></View>
          <View style={styles.metaItem}><Text style={styles.metaLabel}>UPC</Text><Text style={styles.metaValue}>{release.upc || 'Pending'}</Text></View>
        </View>
        <Text style={styles.tracksTitle}>Tracks ({release.tracks?.length || 0})</Text>
        {release.tracks && release.tracks.length > 0 ? release.tracks.map((track, i) => (
          <View key={track.id} style={styles.trackItem}>
            <Text style={styles.trackNumber}>{i + 1}</Text>
            <Text style={styles.trackTitle}>{track.title}</Text>
            <Text style={styles.trackDuration}>{track.duration ? `${Math.floor(track.duration / 60)}:${(track.duration % 60).toString().padStart(2, '0')}` : '--:--'}</Text>
          </View>
        )) : <Text style={styles.emptyText}>No tracks added yet</Text>}
      </ScrollView>
    </View>
  );
};

const PromoteScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const data = await api.campaigns.getAll(user.id);
      setCampaigns(data);
      setLoading(false);
    };
    load();
  }, [user]);

  return (
    <View style={styles.screenContainer}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>Promotions</Text>
        <TouchableOpacity style={styles.headerBtn}><Text style={styles.headerBtnText}>+ Campaign</Text></TouchableOpacity>
      </View>
      {loading ? <View style={styles.centerContent}><ActivityIndicator size="large" color={colors.primary} /></View> : campaigns.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📢</Text>
          <Text style={styles.emptyTitle}>Boost Your Music</Text>
          <Text style={styles.emptyDesc}>Create promotional campaigns to reach more listeners and grow your fanbase.</Text>
          <TouchableOpacity style={styles.emptyBtn}>
            <LinearGradient colors={colors.gradientPrimary} style={styles.gradientBtn}><Text style={styles.primaryBtnText}>Create Campaign</Text></LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList data={campaigns} keyExtractor={item => item.id} renderItem={({ item }) => (
          <View style={styles.campaignItem}>
            <Text style={styles.campaignName}>{item.name}</Text>
            <Text style={styles.campaignStatus}>{item.status}</Text>
          </View>
        )} contentContainerStyle={{ padding: 16 }} />
      )}
    </View>
  );
};

const EarningsScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, available: 0, pending: 0, thisMonth: 0 });
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const [s, e] = await Promise.all([api.earnings.getStats(user.id), api.earnings.getAll(user.id)]);
      setStats(s);
      setEarnings(e);
      setLoading(false);
    };
    load();
  }, [user]);

  return (
    <View style={styles.screenContainer}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>Earnings</Text>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.navigate('Analytics')}><Text style={styles.headerBtnText}>Analytics</Text></TouchableOpacity>
      </View>
      {loading ? <View style={styles.centerContent}><ActivityIndicator size="large" color={colors.primary} /></View> : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <LinearGradient colors={colors.gradientPrimary} style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <Text style={styles.balanceValue}>₦{stats.available.toLocaleString()}</Text>
            <TouchableOpacity style={styles.withdrawBtn}><Text style={styles.withdrawBtnText}>Withdraw</Text></TouchableOpacity>
          </LinearGradient>
          <View style={styles.earningsStats}>
            <View style={styles.earningStat}><Text style={styles.earningStatValue}>₦{stats.thisMonth.toLocaleString()}</Text><Text style={styles.earningStatLabel}>This Month</Text></View>
            <View style={styles.earningStat}><Text style={styles.earningStatValue}>₦{stats.pending.toLocaleString()}</Text><Text style={styles.earningStatLabel}>Pending</Text></View>
            <View style={styles.earningStat}><Text style={styles.earningStatValue}>₦{stats.total.toLocaleString()}</Text><Text style={styles.earningStatLabel}>Total</Text></View>
          </View>
          <View style={styles.transSection}>
            <Text style={styles.transTitle}>Recent Transactions</Text>
            {earnings.length === 0 ? <View style={styles.emptyTrans}><Text style={styles.emptyTransText}>No transactions yet</Text></View> : earnings.slice(0, 10).map(e => (
              <View key={e.id} style={styles.transItem}>
                <Text style={styles.transSource}>{e.source}</Text>
                <Text style={styles.transAmount}>₦{e.amount.toLocaleString()}</Text>
              </View>
            ))}
          </View>
          <View style={{ height: 100 }} />
        </ScrollView>
      )}
    </View>
  );
};

const AnalyticsScreen = ({ navigation }: any) => {
  const [period, setPeriod] = useState('30D');
  const periods = ['7D', '30D', '90D', '1Y', 'All'];

  return (
    <View style={styles.screenContainer}>
      <View style={styles.screenHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.backArrow}>←</Text></TouchableOpacity>
        <Text style={styles.screenTitle}>Analytics</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.periodSelector}>
          {periods.map(p => (
            <TouchableOpacity key={p} style={[styles.periodBtn, period === p && styles.periodBtnActive]} onPress={() => setPeriod(p)}>
              <Text style={[styles.periodBtnText, period === p && styles.periodBtnTextActive]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Streams Over Time</Text>
          <View style={styles.chartPlaceholder}><Text style={styles.chartPlaceholderText}>📊 Chart will appear here</Text></View>
        </View>
        <View style={styles.analyticsSection}><Text style={styles.analyticsSectionTitle}>Top Tracks</Text><View style={styles.emptyAnalytics}><Text style={styles.emptyAnalyticsText}>No data available yet</Text></View></View>
        <View style={styles.analyticsSection}><Text style={styles.analyticsSectionTitle}>Top Countries</Text><View style={styles.emptyAnalytics}><Text style={styles.emptyAnalyticsText}>No data available yet</Text></View></View>
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const NotificationsScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const data = await api.notifications.getAll(user.id);
      setNotifications(data);
      setLoading(false);
    };
    load();
  }, [user]);

  const markAllRead = async () => {
    if (!user) return;
    await api.notifications.markAllAsRead(user.id);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getTypeIcon = (type: string) => {
    switch (type) { case 'success': return '✅'; case 'warning': return '⚠️'; case 'error': return '❌'; default: return 'ℹ️'; }
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.screenHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.backArrow}>←</Text></TouchableOpacity>
        <Text style={styles.screenTitle}>Notifications</Text>
        <TouchableOpacity onPress={markAllRead}><Text style={styles.markReadBtn}>Mark all read</Text></TouchableOpacity>
      </View>
      {loading ? <View style={styles.centerContent}><ActivityIndicator size="large" color={colors.primary} /></View> : notifications.length === 0 ? (
        <View style={styles.emptyState}><Text style={styles.emptyIcon}>🔔</Text><Text style={styles.emptyTitle}>No Notifications</Text><Text style={styles.emptyDesc}>You're all caught up!</Text></View>
      ) : (
        <FlatList data={notifications} keyExtractor={item => item.id} renderItem={({ item }) => (
          <TouchableOpacity style={[styles.notifItem, !item.read && styles.notifItemUnread]} onPress={async () => { await api.notifications.markAsRead(item.id); setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, read: true } : n)); }}>
            <View style={styles.notifIcon}><Text>{getTypeIcon(item.type)}</Text></View>
            <View style={styles.notifContent}>
              <Text style={styles.notifTitle}>{item.title}</Text>
              <Text style={styles.notifMsg} numberOfLines={2}>{item.message}</Text>
            </View>
            {!item.read && <View style={styles.unreadDot} />}
          </TouchableOpacity>
        )} contentContainerStyle={{ padding: 16 }} />
      )}
    </View>
  );
};

const ProfileScreen = ({ navigation }: any) => {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => { setLoading(true); try { await signOut(); } finally { setLoading(false); } };

  const menuItems = [
    { icon: '👤', label: 'Edit Profile', screen: 'EditProfile' },
    { icon: '⚙️', label: 'Settings', screen: 'Settings' },
    { icon: '🔔', label: 'Notifications', screen: 'NotificationSettings' },
    { icon: '💳', label: 'Payment Methods', screen: 'PaymentMethods' },
    { icon: '📜', label: 'Terms of Service', screen: 'Terms' },
    { icon: '🔒', label: 'Privacy Policy', screen: 'Privacy' },
    { icon: '❓', label: 'Help & Support', screen: 'Support' },
  ];

  return (
    <View style={styles.screenContainer}>
      <View style={styles.screenHeader}><Text style={styles.screenTitle}>Profile</Text></View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <TouchableOpacity style={styles.profileAvatar} onPress={() => navigation.navigate('EditProfile')}>
            {profile?.avatar_url ? <Image source={{ uri: profile.avatar_url }} style={styles.profileAvatarImg} /> : <Text style={styles.profileAvatarText}>{profile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase() || 'U'}</Text>}
            <View style={styles.profileEditBadge}><Text style={styles.profileEditIcon}>✏️</Text></View>
          </TouchableOpacity>
          <Text style={styles.profileName}>{profile?.full_name || 'User'}</Text>
          <Text style={styles.profileEmail}>{user?.email}</Text>
          <View style={styles.profileBadge}><Text style={styles.profileBadgeText}>{profile?.user_type || 'Artist'}</Text></View>
        </View>
        <View style={styles.profileMenu}>
          {menuItems.map((item, i) => (
            <TouchableOpacity key={i} style={styles.menuItem} onPress={() => navigation.navigate(item.screen)}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut} disabled={loading}>
          {loading ? <ActivityIndicator color={colors.destructive} /> : <Text style={styles.signOutText}>Sign Out</Text>}
        </TouchableOpacity>
        <Text style={styles.versionText}>Version 1.0.0</Text>
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const EditProfileScreen = ({ navigation }: any) => {
  const { user, profile, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission Required', 'Please allow access to your photo library.'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 0.8 });
    if (!result.canceled && result.assets[0]) setAvatarUri(result.assets[0].uri);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.profile.update(user.id, { full_name: fullName, bio });
      if (avatarUri) await api.profile.uploadAvatar(user.id, avatarUri);
      await refreshProfile();
      Alert.alert('Success', 'Profile updated!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (e: any) { Alert.alert('Error', e.message || 'Failed to update profile'); } finally { setLoading(false); }
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.screenHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.backArrow}>←</Text></TouchableOpacity>
        <Text style={styles.screenTitle}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} disabled={loading}><Text style={styles.saveBtn}>{loading ? '...' : 'Save'}</Text></TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
        <TouchableOpacity style={styles.editAvatarContainer} onPress={pickAvatar}>
          {avatarUri || profile?.avatar_url ? <Image source={{ uri: avatarUri || profile?.avatar_url || '' }} style={styles.editAvatar} /> : <View style={styles.editAvatarPlaceholder}><Text style={styles.editAvatarText}>{profile?.full_name?.charAt(0) || 'U'}</Text></View>}
          <View style={styles.editAvatarOverlay}><Text style={styles.editAvatarIcon}>📷</Text></View>
        </TouchableOpacity>
        <View style={styles.formGroup}><Text style={styles.formLabel}>Full Name</Text><TextInput style={styles.formInput} value={fullName} onChangeText={setFullName} placeholder="Enter your name" placeholderTextColor={colors.mutedForeground} /></View>
        <View style={styles.formGroup}><Text style={styles.formLabel}>Email</Text><TextInput style={[styles.formInput, styles.formInputDisabled]} value={user?.email} editable={false} /></View>
        <View style={styles.formGroup}><Text style={styles.formLabel}>Bio</Text><TextInput style={[styles.formInput, styles.formTextArea]} value={bio} onChangeText={setBio} placeholder="Tell us about yourself" placeholderTextColor={colors.mutedForeground} multiline numberOfLines={4} textAlignVertical="top" /></View>
      </ScrollView>
    </View>
  );
};

const SettingsScreen = ({ navigation }: any) => {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const settingsGroups = [
    { title: 'Notifications', items: [
      { label: 'Push Notifications', value: pushEnabled, onChange: setPushEnabled, type: 'switch' },
      { label: 'Email Notifications', value: emailEnabled, onChange: setEmailEnabled, type: 'switch' },
    ]},
    { title: 'Appearance', items: [
      { label: 'Dark Mode', value: darkMode, onChange: setDarkMode, type: 'switch' },
    ]},
    { title: 'Account', items: [
      { label: 'Change Password', screen: 'ChangePassword', type: 'link' },
      { label: 'Delete Account', screen: 'DeleteAccount', type: 'link', danger: true },
    ]},
  ];

  return (
    <View style={styles.screenContainer}>
      <View style={styles.screenHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.backArrow}>←</Text></TouchableOpacity>
        <Text style={styles.screenTitle}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {settingsGroups.map((group, gi) => (
          <View key={gi} style={styles.settingsGroup}>
            <Text style={styles.settingsGroupTitle}>{group.title}</Text>
            {group.items.map((item: any, ii) => (
              <View key={ii} style={styles.settingsItem}>
                <Text style={[styles.settingsLabel, item.danger && styles.settingsLabelDanger]}>{item.label}</Text>
                {item.type === 'switch' ? <Switch value={item.value} onValueChange={item.onChange} trackColor={{ false: colors.secondary, true: colors.primary }} thumbColor="#fff" /> : <Text style={styles.settingsArrow}>›</Text>}
              </View>
            ))}
          </View>
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const SupportScreen = ({ navigation }: any) => {
  return (
    <View style={styles.screenContainer}>
      <View style={styles.screenHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.backArrow}>←</Text></TouchableOpacity>
        <Text style={styles.screenTitle}>Help & Support</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
        <View style={styles.supportCard}>
          <Text style={styles.supportIcon}>📧</Text>
          <Text style={styles.supportTitle}>Email Support</Text>
          <Text style={styles.supportDesc}>Get help via email within 24 hours</Text>
          <TouchableOpacity style={styles.supportBtn}><Text style={styles.supportBtnText}>support@murranno.com</Text></TouchableOpacity>
        </View>
        <View style={styles.supportCard}>
          <Text style={styles.supportIcon}>💬</Text>
          <Text style={styles.supportTitle}>Live Chat</Text>
          <Text style={styles.supportDesc}>Chat with our support team</Text>
          <TouchableOpacity style={styles.supportBtn}><Text style={styles.supportBtnText}>Start Chat</Text></TouchableOpacity>
        </View>
        <View style={styles.supportCard}>
          <Text style={styles.supportIcon}>📚</Text>
          <Text style={styles.supportTitle}>FAQ</Text>
          <Text style={styles.supportDesc}>Find answers to common questions</Text>
          <TouchableOpacity style={styles.supportBtn}><Text style={styles.supportBtnText}>View FAQ</Text></TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

// ============ NAVIGATION ============

const TabIcon = ({ icon, focused }: { icon: string; focused: boolean }) => (
  <View style={[styles.tabIconContainer, focused && styles.tabIconContainerActive]}><Text style={styles.tabIcon}>{icon}</Text></View>
);

const ReleasesStackNav = createNativeStackNavigator();
const ReleasesStack = () => (
  <ReleasesStackNav.Navigator screenOptions={{ headerShown: false }}>
    <ReleasesStackNav.Screen name="ReleasesList" component={ReleasesScreen} />
    <ReleasesStackNav.Screen name="Upload" component={UploadScreen} />
    <ReleasesStackNav.Screen name="ReleaseDetail" component={ReleaseDetailScreen} />
  </ReleasesStackNav.Navigator>
);

const EarningsStackNav = createNativeStackNavigator();
const EarningsStack = () => (
  <EarningsStackNav.Navigator screenOptions={{ headerShown: false }}>
    <EarningsStackNav.Screen name="EarningsMain" component={EarningsScreen} />
    <EarningsStackNav.Screen name="Analytics" component={AnalyticsScreen} />
  </EarningsStackNav.Navigator>
);

const ProfileStackNav = createNativeStackNavigator();
const ProfileStack = () => (
  <ProfileStackNav.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStackNav.Screen name="ProfileMain" component={ProfileScreen} />
    <ProfileStackNav.Screen name="EditProfile" component={EditProfileScreen} />
    <ProfileStackNav.Screen name="Settings" component={SettingsScreen} />
    <ProfileStackNav.Screen name="Support" component={SupportScreen} />
  </ProfileStackNav.Navigator>
);

const MainTabs = () => (
  <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: styles.tabBar, tabBarActiveTintColor: colors.primary, tabBarInactiveTintColor: colors.mutedForeground, tabBarLabelStyle: styles.tabBarLabel }}>
    <Tab.Screen name="HomeTab" component={DashboardScreen} options={{ tabBarLabel: 'Home', tabBarIcon: ({ focused }) => <TabIcon icon="🏠" focused={focused} /> }} />
    <Tab.Screen name="ReleasesTab" component={ReleasesStack} options={{ tabBarLabel: 'Releases', tabBarIcon: ({ focused }) => <TabIcon icon="📀" focused={focused} /> }} />
    <Tab.Screen name="PromoteTab" component={PromoteScreen} options={{ tabBarLabel: 'Promote', tabBarIcon: ({ focused }) => <TabIcon icon="📢" focused={focused} /> }} />
    <Tab.Screen name="EarningsTab" component={EarningsStack} options={{ tabBarLabel: 'Earnings', tabBarIcon: ({ focused }) => <TabIcon icon="💰" focused={focused} /> }} />
    <Tab.Screen name="ProfileTab" component={ProfileStack} options={{ tabBarLabel: 'Profile', tabBarIcon: ({ focused }) => <TabIcon icon="👤" focused={focused} /> }} />
  </Tab.Navigator>
);

// ============ AUTH PROVIDER ============

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    const p = await api.profile.get(user.id);
    setProfile(p);
  }, [user]);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        const p = await api.profile.get(data.session.user.id);
        setProfile(p);
      }
      setLoading(false);
    };
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const p = await api.profile.get(session.user.id);
        setProfile(p);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string, fullName: string, userType: string) => {
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName, user_type: userType } } });
    if (error) throw error;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut, refreshProfile }}>{children}</AuthContext.Provider>;
};

// ============ MAIN APP ============

export default function App() {
  return <AuthProvider><AppNavigator /></AuthProvider>;
}

const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <View style={styles.loadingContainer}><ExpoStatusBar style="light" /><Image source={mmLogo} style={styles.loadingLogo} resizeMode="contain" /><ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 24 }} /></View>;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
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
  loadingContainer: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  loadingLogo: { width: 120, height: 60 },
  centerContent: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  // Welcome
  carouselBg: { ...StyleSheet.absoluteFillObject },
  bgImage: { flex: 1, width: '100%', height: '100%' },
  bgOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
  welcomeContent: { flex: 1, justifyContent: 'flex-end' },
  carouselContainer: { paddingHorizontal: 16, marginBottom: 16 },
  carouselCard: { borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  blurCard: { padding: 24, alignItems: 'center' },
  carouselTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 12 },
  carouselDesc: { fontSize: 15, color: 'rgba(255,255,255,0.9)', textAlign: 'center', lineHeight: 22 },
  dots: { flexDirection: 'row', justifyContent: 'center', marginTop: 16, gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.5)' },
  dotActive: { width: 24, backgroundColor: colors.primary },
  bottomGradient: { paddingHorizontal: 24, paddingTop: 48, paddingBottom: Platform.OS === 'ios' ? 40 : 24 },
  primaryBtn: { borderRadius: 16, overflow: 'hidden', marginBottom: 16 },
  gradientBtn: { paddingVertical: 16, paddingHorizontal: 24, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  gradientBtnDisabled: { opacity: 0.5 },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  btnIcon: { color: '#fff', fontSize: 18, marginLeft: 8 },
  btnDisabled: { opacity: 0.5 },
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
  userTypeDesc: { fontSize: 13, color: colors.mutedForeground, marginTop: 2 },
  checkmark: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  checkmarkText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  drawerNote: { fontSize: 12, color: colors.mutedForeground, textAlign: 'center', marginTop: 8 },

  // Auth
  authContainer: { flexGrow: 1, justifyContent: 'flex-end', paddingHorizontal: 16, paddingBottom: Platform.OS === 'ios' ? 40 : 24 },
  backBtn: { position: 'absolute', top: Platform.OS === 'ios' ? 60 : 40, left: 16, zIndex: 10 },
  backBtnText: { fontSize: 28, color: '#fff' },
  authCard: { borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  authBlur: { overflow: 'hidden' },
  authHeader: { backgroundColor: 'rgba(255,255,255,0.05)', paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
  authTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  authContent: { padding: 20 },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 14, color: 'rgba(255,255,255,0.9)', marginBottom: 8 },
  passwordHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  forgotPw: { fontSize: 13, color: colors.primary },
  input: { backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: '#fff' },
  inputDark: { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground },
  msgBox: { padding: 12, borderRadius: 8, marginBottom: 16 },
  successBox: { backgroundColor: 'rgba(34, 197, 94, 0.2)' },
  errorBox: { backgroundColor: 'rgba(239, 68, 68, 0.2)' },
  msgText: { fontSize: 14, textAlign: 'center' },
  successText: { color: colors.success },
  errorText: { color: colors.destructive },
  signupPrompt: { textAlign: 'center', color: 'rgba(255,255,255,0.9)', fontSize: 14, marginTop: 8 },
  signupLink: { color: colors.primary, fontWeight: '600' },
  typeChip: { backgroundColor: colors.primary + '30', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, alignSelf: 'center', marginBottom: 16, borderWidth: 1, borderColor: colors.primary + '50' },
  typeChipText: { color: colors.primaryForeground, fontSize: 14, fontWeight: '500' },

  // Forgot Password
  forgotIcon: { fontSize: 64, marginBottom: 16 },
  forgotTitle: { fontSize: 24, fontWeight: 'bold', color: colors.foreground, marginBottom: 8 },
  forgotDesc: { fontSize: 14, color: colors.mutedForeground, textAlign: 'center', marginBottom: 24, paddingHorizontal: 32 },

  // Dashboard
  dashContainer: { flex: 1, backgroundColor: colors.background },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, paddingTop: Platform.OS === 'ios' ? 50 : 12, backgroundColor: colors.background },
  topBarLogo: { width: 80, height: 32 },
  badge: { backgroundColor: colors.primary + '25', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: colors.primary + '50' },
  badgeText: { color: colors.primary, fontSize: 12, fontWeight: '600', letterSpacing: 1 },
  notifBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  notifIcon: { fontSize: 24 },
  notifBadge: { position: 'absolute', top: 0, right: 0, backgroundColor: colors.destructive, width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  notifBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  dashScroll: { flex: 1, paddingHorizontal: 16 },
  greeting: { fontSize: 20, fontWeight: '600', color: colors.foreground, marginTop: 16, marginBottom: 8 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: colors.foreground, marginTop: 20, marginBottom: 12 },
  mainStatCard: { borderRadius: 20, padding: 20, marginBottom: 12 },
  mainStatHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  mainStatIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  changeBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  changeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  mainStatValue: { fontSize: 32, fontWeight: 'bold', color: '#fff' },
  mainStatLabel: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  statsRow: { flexDirection: 'row', gap: 8 },
  miniStatCard: { flex: 1, backgroundColor: colors.card, borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  miniStatIcon: { fontSize: 24, marginBottom: 8 },
  miniStatValue: { fontSize: 20, fontWeight: 'bold', color: colors.foreground },
  miniStatLabel: { fontSize: 11, color: colors.mutedForeground, marginTop: 4 },
  activityCard: { backgroundColor: colors.card, borderRadius: 20, padding: 16, marginTop: 16, borderWidth: 1, borderColor: colors.border },
  activityHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  activityIcon: { fontSize: 20 },
  activityTitle: { fontSize: 16, fontWeight: 'bold', color: colors.foreground },
  emptyActivity: { paddingVertical: 24, alignItems: 'center' },
  emptyText: { color: colors.mutedForeground, fontSize: 14, textAlign: 'center' },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  actionCard: { width: (SCREEN_WIDTH - 44) / 2, backgroundColor: colors.card, borderRadius: 16, padding: 20, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  actionIcon: { fontSize: 32, marginBottom: 8 },
  actionLabel: { fontSize: 14, fontWeight: '500', color: colors.foreground },
  fab: { position: 'absolute', bottom: 100, right: 24, borderRadius: 28, overflow: 'hidden' },
  fabGradient: { width: 56, height: 56, alignItems: 'center', justifyContent: 'center' },
  fabIcon: { color: '#fff', fontSize: 28, fontWeight: '300' },

  // Screen
  screenContainer: { flex: 1, backgroundColor: colors.background, paddingTop: Platform.OS === 'ios' ? 50 : 10 },
  screenHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  screenTitle: { fontSize: 24, fontWeight: 'bold', color: colors.foreground },
  headerBtn: { backgroundColor: colors.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  headerBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  backArrow: { fontSize: 24, color: colors.foreground },
  editBtn: { color: colors.primary, fontSize: 16, fontWeight: '600' },
  saveBtn: { color: colors.primary, fontSize: 16, fontWeight: '600' },
  markReadBtn: { color: colors.primary, fontSize: 14 },

  // Empty State
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: colors.foreground, marginBottom: 8 },
  emptyDesc: { fontSize: 14, color: colors.mutedForeground, textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  emptyBtn: { borderRadius: 16, overflow: 'hidden' },

  // Releases
  releaseItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: 16, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  releaseCover: { width: 56, height: 56, borderRadius: 8, backgroundColor: colors.secondary, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  releaseCoverImg: { width: 56, height: 56 },
  releaseCoverIcon: { fontSize: 24 },
  releaseInfo: { flex: 1, marginLeft: 12 },
  releaseTitle: { fontSize: 16, fontWeight: '600', color: colors.foreground },
  releaseArtist: { fontSize: 13, color: colors.mutedForeground, marginTop: 2 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, alignSelf: 'flex-start', marginTop: 4 },
  statusText: { fontSize: 10, fontWeight: '600' },
  releaseArrow: { fontSize: 24, color: colors.mutedForeground },

  // Release Detail
  releaseDetailCover: { width: 200, height: 200, borderRadius: 16, backgroundColor: colors.secondary, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  releaseDetailImg: { width: 200, height: 200, borderRadius: 16 },
  releaseDetailIcon: { fontSize: 64 },
  releaseDetailTitle: { fontSize: 24, fontWeight: 'bold', color: colors.foreground, textAlign: 'center' },
  releaseDetailArtist: { fontSize: 16, color: colors.mutedForeground, textAlign: 'center', marginTop: 4 },
  releaseDetailMeta: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: colors.card, borderRadius: 16, padding: 16, marginTop: 16, borderWidth: 1, borderColor: colors.border },
  metaItem: { alignItems: 'center' },
  metaLabel: { fontSize: 12, color: colors.mutedForeground },
  metaValue: { fontSize: 14, fontWeight: '600', color: colors.foreground, marginTop: 4 },
  tracksTitle: { fontSize: 18, fontWeight: '600', color: colors.foreground, marginTop: 24, marginBottom: 12 },
  trackItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: 12, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: colors.border },
  trackNumber: { width: 24, fontSize: 14, color: colors.mutedForeground },
  trackTitle: { flex: 1, fontSize: 14, color: colors.foreground },
  trackDuration: { fontSize: 12, color: colors.mutedForeground },

  // Upload
  uploadContent: { paddingHorizontal: 16 },
  coverPicker: { width: 200, height: 200, alignSelf: 'center', marginBottom: 24, borderRadius: 20, overflow: 'hidden' },
  coverPreview: { width: 200, height: 200 },
  coverPlaceholder: { width: 200, height: 200, backgroundColor: colors.card, borderWidth: 2, borderColor: colors.border, borderStyle: 'dashed', borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  coverIcon: { fontSize: 48, marginBottom: 8 },
  coverText: { fontSize: 14, fontWeight: '600', color: colors.foreground },
  coverHint: { fontSize: 11, color: colors.mutedForeground, marginTop: 4 },
  formGroup: { marginBottom: 16 },
  formLabel: { fontSize: 14, fontWeight: '500', color: colors.foreground, marginBottom: 8 },
  formInput: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: colors.foreground },
  formInputDisabled: { opacity: 0.6 },
  formTextArea: { height: 100, textAlignVertical: 'top', paddingTop: 14 },
  formSelect: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  formSelectText: { fontSize: 16, color: colors.mutedForeground },
  formSelectArrow: { fontSize: 12, color: colors.mutedForeground },
  addTrackBtn: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
  addTrackIcon: { fontSize: 24 },
  addTrackText: { fontSize: 16, fontWeight: '600', color: colors.foreground },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24, maxHeight: '70%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: colors.foreground, textAlign: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  genreList: { paddingHorizontal: 16 },
  genreItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  genreItemSelected: { backgroundColor: colors.primary + '10' },
  genreText: { fontSize: 16, color: colors.foreground },
  genreTextSelected: { color: colors.primary, fontWeight: '600' },
  genreCheck: { color: colors.primary, fontSize: 18 },
  modalClose: { padding: 16, alignItems: 'center' },
  modalCloseText: { color: colors.mutedForeground, fontSize: 16 },

  // Campaigns
  campaignItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.card, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  campaignName: { fontSize: 16, fontWeight: '600', color: colors.foreground },
  campaignStatus: { fontSize: 12, color: colors.primary },

  // Earnings
  balanceCard: { margin: 16, borderRadius: 20, padding: 24, alignItems: 'center' },
  balanceLabel: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  balanceValue: { fontSize: 36, fontWeight: 'bold', color: '#fff', marginVertical: 8 },
  withdrawBtn: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 20, marginTop: 8 },
  withdrawBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  earningsStats: { flexDirection: 'row', paddingHorizontal: 16, gap: 8 },
  earningStat: { flex: 1, backgroundColor: colors.card, borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  earningStatValue: { fontSize: 16, fontWeight: 'bold', color: colors.foreground },
  earningStatLabel: { fontSize: 11, color: colors.mutedForeground, marginTop: 4 },
  transSection: { margin: 16 },
  transTitle: { fontSize: 18, fontWeight: '600', color: colors.foreground, marginBottom: 12 },
  emptyTrans: { backgroundColor: colors.card, borderRadius: 16, padding: 32, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  emptyTransText: { color: colors.mutedForeground, fontSize: 14 },
  transItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.card, borderRadius: 12, padding: 16, marginBottom: 8, borderWidth: 1, borderColor: colors.border },
  transSource: { fontSize: 14, color: colors.foreground },
  transAmount: { fontSize: 14, fontWeight: '600', color: colors.success },

  // Analytics
  periodSelector: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 16, gap: 8 },
  periodBtn: { flex: 1, paddingVertical: 10, borderRadius: 20, backgroundColor: colors.card, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  periodBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  periodBtnText: { fontSize: 13, fontWeight: '500', color: colors.mutedForeground },
  periodBtnTextActive: { color: '#fff' },
  chartCard: { marginHorizontal: 16, backgroundColor: colors.card, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 16 },
  chartTitle: { fontSize: 16, fontWeight: '600', color: colors.foreground, marginBottom: 16 },
  chartPlaceholder: { height: 180, backgroundColor: colors.secondary, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  chartPlaceholderText: { color: colors.mutedForeground, fontSize: 14 },
  analyticsSection: { marginHorizontal: 16, marginBottom: 16 },
  analyticsSectionTitle: { fontSize: 16, fontWeight: '600', color: colors.foreground, marginBottom: 12 },
  emptyAnalytics: { backgroundColor: colors.card, borderRadius: 16, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  emptyAnalyticsText: { color: colors.mutedForeground, fontSize: 14 },

  // Notifications
  notifItem: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: colors.card, borderRadius: 16, padding: 16, marginBottom: 8, borderWidth: 1, borderColor: colors.border },
  notifItemUnread: { backgroundColor: colors.primary + '08', borderColor: colors.primary + '30' },
  notifIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.secondary, alignItems: 'center', justifyContent: 'center' },
  notifContent: { flex: 1, marginLeft: 12 },
  notifTitle: { fontSize: 15, fontWeight: '600', color: colors.foreground },
  notifMsg: { fontSize: 13, color: colors.mutedForeground, marginTop: 4, lineHeight: 18 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, marginLeft: 8 },

  // Profile
  profileHeader: { alignItems: 'center', paddingVertical: 24 },
  profileAvatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  profileAvatarImg: { width: 100, height: 100, borderRadius: 50 },
  profileAvatarText: { fontSize: 40, fontWeight: 'bold', color: '#fff' },
  profileEditBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: colors.card, width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.background },
  profileEditIcon: { fontSize: 14 },
  profileName: { fontSize: 20, fontWeight: 'bold', color: colors.foreground },
  profileEmail: { fontSize: 14, color: colors.mutedForeground, marginTop: 4 },
  profileBadge: { backgroundColor: colors.primary + '25', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginTop: 12, borderWidth: 1, borderColor: colors.primary + '50' },
  profileBadgeText: { color: colors.primary, fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
  profileMenu: { marginHorizontal: 16 },
  menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: 16, padding: 16, marginBottom: 8, borderWidth: 1, borderColor: colors.border },
  menuIcon: { fontSize: 20, marginRight: 12 },
  menuLabel: { flex: 1, fontSize: 16, color: colors.foreground },
  menuArrow: { fontSize: 20, color: colors.mutedForeground },
  signOutBtn: { marginHorizontal: 16, marginTop: 16, paddingVertical: 16, borderRadius: 16, borderWidth: 1, borderColor: colors.destructive, alignItems: 'center' },
  signOutText: { color: colors.destructive, fontSize: 16, fontWeight: '600' },
  versionText: { textAlign: 'center', color: colors.mutedForeground, fontSize: 12, marginTop: 24 },

  // Edit Profile
  editAvatarContainer: { width: 120, height: 120, alignSelf: 'center', marginBottom: 24 },
  editAvatar: { width: 120, height: 120, borderRadius: 60 },
  editAvatarPlaceholder: { width: 120, height: 120, borderRadius: 60, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  editAvatarText: { fontSize: 48, fontWeight: 'bold', color: '#fff' },
  editAvatarOverlay: { position: 'absolute', bottom: 0, right: 0, backgroundColor: colors.card, width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: colors.background },
  editAvatarIcon: { fontSize: 18 },

  // Settings
  settingsGroup: { marginBottom: 24 },
  settingsGroupTitle: { fontSize: 14, fontWeight: '600', color: colors.mutedForeground, paddingHorizontal: 16, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
  settingsItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.card, paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
  settingsLabel: { fontSize: 16, color: colors.foreground },
  settingsLabelDanger: { color: colors.destructive },
  settingsArrow: { fontSize: 20, color: colors.mutedForeground },

  // Support
  supportCard: { backgroundColor: colors.card, borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: colors.border },
  supportIcon: { fontSize: 48, marginBottom: 12 },
  supportTitle: { fontSize: 18, fontWeight: '600', color: colors.foreground, marginBottom: 4 },
  supportDesc: { fontSize: 14, color: colors.mutedForeground, textAlign: 'center', marginBottom: 16 },
  supportBtn: { backgroundColor: colors.primary + '20', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  supportBtnText: { color: colors.primary, fontSize: 14, fontWeight: '600' },

  // Tab Bar
  tabBar: { backgroundColor: colors.card, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 8, paddingBottom: Platform.OS === 'ios' ? 24 : 8, height: Platform.OS === 'ios' ? 88 : 64 },
  tabBarLabel: { fontSize: 10, fontWeight: '500' },
  tabIconContainer: { width: 40, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  tabIconContainerActive: { backgroundColor: colors.primary + '20' },
  tabIcon: { fontSize: 20 },
});
