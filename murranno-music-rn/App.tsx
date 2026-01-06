/**
 * Supabase Connection Test App
 * Tests connection to Supabase and displays status
 */
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { supabase } from './src/services/supabase';

export default function App() {
  const [connectionStatus, setConnectionStatus] = useState('Testing...');
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [hasKey, setHasKey] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [testResults, setTestResults] = useState<string[]>([]);

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const testSupabaseConnection = async () => {
    setIsLoading(true);
    setTestResults([]);
    addTestResult('Starting Supabase connection test...');

    try {
      // Check if Supabase client is initialized
      if (!supabase) {
        setConnectionStatus('❌ Failed');
        addTestResult('❌ Supabase client not initialized');
        setIsLoading(false);
        return;
      }
      addTestResult('✅ Supabase client initialized');

      // Get the URL from environment
      const url = process.env.EXPO_PUBLIC_SUPABASE_URL || 'Not set';
      setSupabaseUrl(url);
      addTestResult(`📍 URL: ${url}`);

      // Check if anon key exists
      const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
      setHasKey(!!key);
      addTestResult(key ? '🔑 Anon key found' : '❌ Anon key missing');

      // Test connection by checking auth status
      addTestResult('🔍 Testing auth connection...');
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        setConnectionStatus('❌ Connection Error');
        addTestResult(`❌ Error: ${error.message}`);
      } else {
        setConnectionStatus('✅ Connected!');
        addTestResult('✅ Successfully connected to Supabase');
        addTestResult(data.session ? '👤 User session found' : '👤 No active session (normal)');
      }

      // Test a simple query (optional - will fail if no tables)
      try {
        addTestResult('🗄️ Testing database query...');
        const { error: queryError } = await supabase.from('users').select('count').limit(0);
        if (queryError) {
          if (queryError.message.includes('relation') || queryError.message.includes('does not exist')) {
            addTestResult('ℹ️ Database connected (no tables yet)');
          } else {
            addTestResult(`⚠️ Query test: ${queryError.message}`);
          }
        } else {
          addTestResult('✅ Database query successful');
        }
      } catch (err) {
        addTestResult('ℹ️ Database query test skipped');
      }

    } catch (error: any) {
      setConnectionStatus('❌ Error');
      addTestResult(`❌ Exception: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    testSupabaseConnection();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>🎉 Murranno Music</Text>
        <Text style={styles.subtitle}>Supabase Connection Test</Text>
        
        {/* Connection Status Card */}
        <View style={[styles.card, styles.statusCard]}>
          <Text style={styles.cardTitle}>Connection Status</Text>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#7C3AED" />
              <Text style={styles.loadingText}>Testing connection...</Text>
            </View>
          ) : (
            <>
              <Text style={styles.statusText}>{connectionStatus}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={testSupabaseConnection}>
                <Text style={styles.retryButtonText}>🔄 Retry Connection</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Configuration Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📋 Configuration</Text>
          <Text style={styles.configLabel}>Supabase URL:</Text>
          <Text style={styles.configValue}>{supabaseUrl || 'Loading...'}</Text>
          
          <Text style={[styles.configLabel, { marginTop: 12 }]}>Anon Key:</Text>
          <Text style={styles.configValue}>{hasKey ? '✅ Configured' : '❌ Missing'}</Text>
        </View>

        {/* Test Results Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🔍 Test Results</Text>
          {testResults.length === 0 ? (
            <Text style={styles.cardText}>No tests run yet...</Text>
          ) : (
            testResults.map((result, index) => (
              <Text key={index} style={styles.testResult}>
                {result}
              </Text>
            ))
          )}
        </View>

        {/* Next Steps Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📱 Next Steps</Text>
          <Text style={styles.cardText}>
            {connectionStatus.includes('✅') 
              ? '✅ Supabase is connected!\n\n• Test authentication\n• Create database tables\n• Start building features'
              : '❌ Connection failed\n\n• Check .env file\n• Verify Supabase URL\n• Confirm anon key is correct'
            }
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            SDK 54 • React Native 0.81 • Supabase
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080C15',
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
  statusCard: {
    borderColor: '#7C3AED',
    borderWidth: 2,
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
  statusText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F8FAFC',
    textAlign: 'center',
    marginVertical: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#94A3B8',
  },
  retryButton: {
    backgroundColor: '#7C3AED',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  retryButtonText: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  configLabel: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 4,
  },
  configValue: {
    fontSize: 14,
    color: '#CBD5E1',
    fontFamily: 'monospace',
  },
  testResult: {
    fontSize: 14,
    color: '#CBD5E1',
    marginBottom: 8,
    lineHeight: 20,
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
