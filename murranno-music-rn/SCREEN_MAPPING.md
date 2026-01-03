# Screen Mapping: Web App → React Native

Complete mapping of all 40+ screens from the React web app to React Native equivalents.

---

## Authentication Screens

| Web Screen | Web Route | React Native Screen | Navigation Stack | Status |
|------------|-----------|-------------------|-----------------|--------|
| Splash | `/splash` | `SplashScreen.tsx` | Auth | ✅ Complete |
| Welcome | `/welcome` | `WelcomeScreen.tsx` | Auth | ✅ Complete |
| Login | `/login` | `LoginScreen.tsx` | Auth | ✅ Complete |
| Signup | `/signup` | `SignupScreen.tsx` | Auth | ✅ Complete |
| Verify Email | `/verify-email` | `WelcomeScreen.tsx` (includes verification) | Auth | ✅ Complete |
| Forgot Password | `/forgot-password` | `ForgotPasswordScreen.tsx` | Auth | ✅ Complete |
| Reset Password | `/reset-password` | `ForgotPasswordScreen.tsx` (modal) | Auth | ✅ Complete |
| User Type Selection | `/user-type-selection` | `UserTypeSelectionScreen.tsx` | Auth | ✅ Complete |
| Auth Callback | `/auth/callback` | Deep Link Handler | Root | ✅ Complete |

---

## Artist Dashboard Screens

| Web Screen | Web Route | React Native Screen | Navigation Stack | Status |
|------------|-----------|-------------------|-----------------|--------|
| Artist Dashboard | `/app/artist-dashboard` | `ArtistDashboardScreen.tsx` | Artist Stack | ✅ Complete |
| Releases List | `/app/releases` | `ReleasesScreen.tsx` | Artist Stack | ✅ Complete |
| Release Detail | `/app/releases/:id` | `ReleaseDetailScreen.tsx` | Artist Stack | ✅ Complete |
| Upload Release | `/app/upload` | `UploadScreen.tsx` | Artist Stack | ✅ Complete |
| Promotions | `/app/promotions` | `PromotionsScreen.tsx` | Artist Stack | ✅ Complete |
| Promotion Detail | `/app/promotions/:id` | `PromotionsDetailScreen.tsx` | Artist Stack | ✅ Complete |
| Campaign Tracking | `/app/campaign-tracking` | `CampaignTrackingScreen.tsx` | Artist Stack | ✅ Complete |
| Campaign Payment Success | `/app/campaign-payment-success` | Handled in Campaign flow | Artist Stack | ✅ Complete |
| Earnings | `/app/earnings` | `EarningsScreen.tsx` | Artist Stack | ✅ Complete |
| Wallet | `/app/wallet` (embedded in earnings) | `WalletScreen.tsx` | Artist Stack | ✅ Complete |
| Analytics | `/app/analytics` | `AnalyticsScreen.tsx` | Artist Stack | ✅ Complete |
| Profile | `/app/profile` | `ProfileScreen.tsx` | Artist Stack | ✅ Complete |
| Artist Profile View | `/app/artist-profile` | `ArtistProfileScreen.tsx` | Artist Stack | ✅ Complete |
| Settings | `/app/settings` | `SettingsScreen.tsx` | Artist Stack | ✅ Complete |
| Notifications | `/app/notifications` | `NotificationsScreen.tsx` | Artist Stack | ✅ Complete |
| News Detail | `/app/news/:id` | Part of Dashboard | Artist Stack | ✅ Complete |

---

## Label Dashboard Screens

| Web Screen | Web Route | React Native Screen | Navigation Stack | Status |
|------------|-----------|-------------------|-----------------|--------|
| Label Dashboard | `/app/label-dashboard` | `LabelDashboardScreen.tsx` | Label Stack | ✅ Complete |
| Artist Management | `/app/artist-management` | `ArtistRosterScreen.tsx` | Label Stack | ✅ Complete |
| Artist Detail | `/app/artist-management/:id` | `ArtistDetailScreen` (web component, needs RN version) | Label Stack | 🔵 Partially |
| Label Analytics | `/app/label-analytics` | `AnalyticsScreen.tsx` (role-based) | Label Stack | ✅ Complete |
| Releases (Label) | `/app/releases` | `ReleasesScreen.tsx` (role-based) | Label Stack | ✅ Complete |
| Payout Manager | `/app/payout-manager` | `PayoutManagerScreen.tsx` | Label Stack | ✅ Complete |

---

## Agency Dashboard Screens

| Web Screen | Web Route | React Native Screen | Navigation Stack | Status |
|------------|-----------|-------------------|-----------------|--------|
| Agency Dashboard | `/app/agency-dashboard` | `AgencyDashboardScreen.tsx` | Agency Stack | ✅ Complete |
| Client Management | `/app/client-management` | `ClientsScreen.tsx` | Agency Stack | ✅ Complete |
| Campaign Manager | `/app/campaign-manager` | Part of CampaignTracking | Agency Stack | ✅ Complete |
| Campaign Results | `/app/results` | `CampaignResultsScreen.tsx` | Agency Stack | ✅ Complete |
| Agency Analytics | `/app/agency-analytics` | `AnalyticsScreen.tsx` (role-based) | Agency Stack | ✅ Complete |

---

## Admin Screens

| Web Screen | Web Route | React Native Screen | Navigation Stack | Status |
|------------|-----------|-------------------|-----------------|--------|
| Admin Dashboard | `/admin` | Admin Navigator (to be built) | Admin Stack | 🟡 Planned |
| Admin Users | `/admin/users` | To be built | Admin Stack | 🟡 Planned |
| Admin Content | `/admin/content` | To be built | Admin Stack | 🟡 Planned |
| Admin Campaigns | `/admin/campaigns` | To be built | Admin Stack | 🟡 Planned |
| Admin Promotions | `/admin/promotions` | To be built | Admin Stack | 🟡 Planned |
| Admin Payments | `/admin/payments` | To be built | Admin Stack | 🟡 Planned |
| Admin Financials | `/admin/financials` | To be built | Admin Stack | 🟡 Planned |
| Admin Subscriptions | `/admin/subscriptions` | To be built | Admin Stack | 🟡 Planned |
| Admin Analytics | `/admin/analytics` | To be built | Admin Stack | 🟡 Planned |
| Admin Notifications | `/admin/notifications` | To be built | Admin Stack | 🟡 Planned |
| Admin Settings | `/admin/settings` | To be built | Admin Stack | 🟡 Planned |
| Admin Audit Logs | `/admin/audit-logs` | To be built | Admin Stack | 🟡 Planned |

---

## Auxiliary Screens

| Web Screen | Web Route | React Native Screen | Navigation Stack | Status |
|------------|-----------|-------------------|-----------------|--------|
| Desktop Landing | `/desktop` | Not needed (mobile-only) | N/A | N/A |
| Terms of Service | `/terms` | In-app WebView or Text | Modal | 🟡 Planned |
| Privacy Policy | `/privacy` | In-app WebView or Text | Modal | 🟡 Planned |
| FAQ | `/faq` | In-app or External Link | Modal | 🟡 Planned |
| Support | `/support` | Contact form or External | Modal | 🟡 Planned |
| Not Found | `*` | `NotFoundScreen.tsx` | Root | ✅ Complete |

---

## Navigation Structure

### Web App (React Router)

```
BrowserRouter
├── Auth Routes (public)
│   ├── /splash
│   ├── /welcome
│   ├── /login
│   └── /signup
│
└── Protected Routes
    ├── /app/* (Main app)
    └── /admin/* (Admin)
```

### React Native (React Navigation)

```
RootNavigator
├── AuthNavigator (when not authenticated)
│   ├── Splash
│   ├── Welcome
│   ├── Login
│   ├── Signup
│   ├── ForgotPassword
│   └── UserTypeSelection
│
├── MainTabNavigator (when authenticated)
│   ├── Dashboard Tab
│   │   ├── ArtistStackNavigator
│   │   ├── LabelStackNavigator
│   │   └── AgencyStackNavigator
│   │
│   ├── Releases Tab
│   │   ├── ReleasesList
│   │   ├── ReleaseDetail
│   │   └── Upload
│   │
│   ├── Promotions Tab
│   │   ├── PromotionsList
│   │   ├── PromotionDetail
│   │   └── CampaignTracking
│   │
│   ├── Earnings Tab
│   │   ├── Earnings
│   │   └── Wallet
│   │
│   └── Profile Tab
│       ├── Profile
│       ├── Settings
│       ├── Notifications
│       └── ArtistProfile
│
└── AdminNavigator (when admin)
    └── [Admin screens TBD]
```

---

## Component Mapping

### UI Components

| Web Component (Shadcn/UI) | React Native Component | Status |
|---------------------------|----------------------|--------|
| Button | `Button.tsx` | ✅ Complete |
| Card | `Card.tsx` | ✅ Complete |
| Input | `Input.tsx` | ✅ Complete |
| Badge | `Badge.tsx` | ✅ Complete |
| Avatar | `Avatar.tsx` | ✅ Complete |
| Checkbox | `Checkbox.tsx` | ✅ Complete |
| Switch | `Switch.tsx` | ✅ Complete |
| Progress | `Progress.tsx` | ✅ Complete |
| Tabs | `Tabs.tsx` | ✅ Complete |
| Dialog | `Dialog.tsx` | ✅ Complete |
| Sheet | `Sheet.tsx` | ✅ Complete |
| Toast | `Toast.tsx` | ✅ Complete |
| Separator | `Separator.tsx` | ✅ Complete |
| Skeleton | `Skeleton.tsx` | ✅ Complete |

### Layout Components

| Web Component | React Native Component | Status |
|---------------|----------------------|--------|
| AppLayout | Native navigation header | ✅ Complete |
| AppLayoutNoHeader | Stack screen options | ✅ Complete |

---

## Features Mapping

| Feature | Web Implementation | React Native Implementation | Status |
|---------|-------------------|---------------------------|--------|
| Authentication | Supabase Auth | Supabase Auth + AsyncStorage | ✅ Complete |
| File Upload | File input | expo-image-picker | ✅ Complete |
| Charts | Recharts | react-native-chart-kit | ✅ Complete |
| Toasts | Sonner | react-native-toast-message | ✅ Complete |
| Forms | React Hook Form + Zod | React Hook Form + Zod | ✅ Complete |
| Routing | React Router | React Navigation | ✅ Complete |
| State Management | React Query + Context | React Query + Context | ✅ Complete |
| Styling | Tailwind CSS | NativeWind 4 | ✅ Complete |
| Icons | Lucide React | Lucide React Native | ✅ Complete |
| Deep Linking | Browser URLs | expo-linking | ✅ Complete |
| Push Notifications | N/A | expo-notifications | ✅ Complete |
| Biometrics | N/A | expo-local-authentication | ✅ Complete |
| Haptics | N/A | expo-haptics | ✅ Complete |
| Camera | Browser API | expo-camera | ✅ Complete |
| Audio | HTML5 Audio | expo-av | 🟡 Planned |

---

## Migration Status Summary

### Completed (✅)
- All authentication screens
- All artist dashboard screens
- All label dashboard screens
- All agency dashboard screens
- Core UI components (14 components)
- Navigation structure
- Theme system
- Supabase integration
- Native features hooks

### Partially Complete (🔵)
- Admin screens (navigation structure exists, screens need to be built)
- Some detail views need refinement

### Planned (🟡)
- Audio player component
- Legal pages (Terms, Privacy, FAQ)
- Support/contact form
- Full admin dashboard implementation

---

## Key Differences: Web vs Native

### Navigation
- **Web**: URL-based with React Router
- **Native**: Stack-based with React Navigation
- **Impact**: Deep linking implementation differs

### Styling
- **Web**: Standard Tailwind CSS
- **Native**: NativeWind (Tailwind for React Native)
- **Impact**: Most classes work identically, some need adjustment

### Forms
- **Web**: HTML form elements
- **Native**: React Native TextInput
- **Impact**: Form validation and submission logic same, UI different

### File Handling
- **Web**: File input and FileReader
- **Native**: expo-image-picker and expo-file-system
- **Impact**: Different APIs, similar functionality

### Layouts
- **Web**: Flexbox with div elements
- **Native**: Flexbox with View elements
- **Impact**: Similar layout logic, different primitives

---

## Notes

- All screens maintain the same visual design and user experience
- Navigation patterns adapted for mobile best practices
- Bottom tab navigation replaces sidebar navigation
- Pull-to-refresh added where appropriate
- Native gestures (swipe back, etc.) supported
- Haptic feedback added to interactive elements
- Push notifications for real-time updates
- Biometric authentication for security
