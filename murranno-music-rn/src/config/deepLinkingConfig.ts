/**
 * Deep Linking Configuration
 * Handles app deep links and universal links
 */

export const URL_SCHEME = 'murranno';
export const WEB_DOMAIN = 'https://nqfltvbzqxdxsobhedci.supabase.co';

export const getNavigationLinkingConfig = () => ({
  prefixes: [
    `${URL_SCHEME}://`,
    WEB_DOMAIN,
  ],
  config: {
    screens: {
      Auth: {
        screens: {
          Splash: 'splash',
          Welcome: 'welcome',
          Login: 'login',
          Signup: 'signup',
          ForgotPassword: 'forgot-password',
          ResetPassword: 'reset-password',
          UserTypeSelection: 'user-type-selection',
        },
      },
      Main: {
        screens: {
          Dashboard: 'dashboard',
          Releases: 'releases',
          Promotions: 'promotions',
          Earnings: 'earnings',
          Profile: 'profile',
        },
      },
      ReleaseDetail: 'release/:id',
      NotFound: '*',
    },
  },
});
