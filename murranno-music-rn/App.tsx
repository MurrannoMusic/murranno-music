/**
 * Simplified App Entry - Guaranteed to work on Expo Go
 * Use this to test if Expo Go connection is working
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>🎉 Murranno Music</Text>
        <Text style={styles.subtitle}>React Native App</Text>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>✅ Expo Go Connected!</Text>
          <Text style={styles.cardText}>
            Your app is running successfully on Expo Go.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>📱 Next Steps:</Text>
          <Text style={styles.cardText}>
            1. Install all dependencies{'\n'}
            2. Configure environment variables{'\n'}
            3. Switch to full App.tsx
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>🎨 Features Ready:</Text>
          <Text style={styles.cardText}>
            • 27+ Screens{'\n'}
            • 14 UI Components{'\n'}
            • Supabase Integration{'\n'}
            • Native Features{'\n'}
            • Full Navigation
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Built with React Native & Expo
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080C15', // background color from theme
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#F8FAFC',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 40,
  },
  card: {
    backgroundColor: '#1E2936',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#F8FAFC',
    marginBottom: 12,
  },
  cardText: {
    fontSize: 16,
    color: '#CBD5E1',
    lineHeight: 24,
  },
  footer: {
    marginTop: 40,
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#64748B',
  },
});
