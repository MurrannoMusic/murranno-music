import React, { useEffect, useState } from 'react';
import { NavigationContainer, DefaultTheme, LinkingOptions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Linking from 'expo-linking';
import * as SplashScreen from 'expo-splash-screen';
import { RootStackParamList } from './types';
import { colors } from '../theme/colors';
import { useAuth } from '../hooks/useAuth';

// Navigators
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import AdminNavigator from './stacks/AdminNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Custom navigation theme matching the app design
const NavigationTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.card,
    text: colors.foreground,
    border: colors.border,
    notification: colors.destructive,
  },
};

// Deep linking configuration
const prefix = Linking.createURL('/');

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [prefix, 'murranno://'],
  config: {
    screens: {
      Auth: {
        screens: {
          Splash: 'splash',
          Welcome: 'welcome',
          GetStarted: 'get-started',
          Login: 'login',
          Signup: 'signup',
          VerifyEmail: 'verify-email',
          ForgotPassword: 'forgot-password',
          ResetPassword: 'reset-password',
        },
      },
      Main: {
        screens: {
          DashboardTab: {
            screens: {
              ArtistDashboard: 'app/artist-dashboard',
              LabelDashboard: 'app/label-dashboard',
              AgencyDashboard: 'app/agency-dashboard',
              NewsDetail: 'app/news/:id',
            },
          },
          ReleasesTab: {
            screens: {
              ReleasesList: 'app/releases',
              ReleaseDetail: 'app/releases/:id',
              Upload: 'app/upload',
            },
          },
          PromotionsTab: {
            screens: {
              PromotionsList: 'app/promotions',
              CampaignTracking: 'app/campaign-tracking',
              CampaignPaymentSuccess: 'app/campaign-payment-success',
            },
          },
          EarningsTab: {
            screens: {
              EarningsOverview: 'app/earnings',
              Analytics: 'app/analytics',
            },
          },
          ProfileTab: {
            screens: {
              ProfileOverview: 'app/profile',
              Settings: 'app/settings',
              SubscriptionPlans: 'app/subscription/plans',
            },
          },
        },
      },
      Admin: {
        screens: {
          AdminDashboard: 'admin',
          AdminUsers: 'admin/users',
          AdminContent: 'admin/content',
          AdminCampaigns: 'admin/campaigns',
          AdminPromotions: 'admin/promotions',
          AdminPayments: 'admin/payments',
          AdminFinancials: 'admin/financials',
          AdminSubscriptions: 'admin/subscriptions',
          AdminAnalytics: 'admin/analytics',
          AdminNotifications: 'admin/notifications',
          AdminSettings: 'admin/settings',
          AdminAuditLogs: 'admin/audit-logs',
        },
      },
      NotFound: '*',
    },
  },
};

interface RootNavigatorProps {
  onReady?: () => void;
}

export const RootNavigator: React.FC<RootNavigatorProps> = ({ onReady }) => {
  const { user, loading, isAdmin } = useAuth();
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  useEffect(() => {
    if (isNavigationReady && !loading) {
      SplashScreen.hideAsync();
      onReady?.();
    }
  }, [isNavigationReady, loading, onReady]);

  const handleNavigationReady = () => {
    setIsNavigationReady(true);
  };

  return (
    <NavigationContainer
      theme={NavigationTheme}
      linking={linking}
      onReady={handleNavigationReady}
      fallback={null}
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        {!user ? (
          // Auth flow
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : isAdmin ? (
          // Admin flow
          <>
            <Stack.Screen name="Admin" component={AdminNavigator} />
            <Stack.Screen name="Main" component={MainTabNavigator} />
          </>
        ) : (
          // Main app flow
          <>
            <Stack.Screen name="Main" component={MainTabNavigator} />
            <Stack.Screen 
              name="NotFound" 
              component={require('../screens/NotFoundScreen').default}
              options={{
                presentation: 'modal',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
