# React Native Migration Assets

This folder contains complete React Native (Expo) templates that match the current web app's design system exactly.

## Directory Structure

```
migration-assets/
├── theme/                    # Design system tokens
│   ├── colors.ts            # Color palette (dark/light themes)
│   ├── typography.ts        # Font styles, sizes, weights
│   ├── spacing.ts           # Spacing scale, border radius
│   ├── shadows.ts           # Shadow presets (iOS/Android)
│   ├── animations.ts        # Animation helpers
│   └── index.ts             # Central export
│
├── components/
│   ├── ui/                  # Base UI components
│   │   ├── Button.tsx       # All button variants
│   │   ├── Card.tsx         # Card with glass morphism
│   │   └── Input.tsx        # Text input with states
│   │
│   ├── layout/              # Layout components
│   │   ├── BottomNavigation.tsx
│   │   ├── PageContainer.tsx
│   │   └── AppHeader.tsx
│   │
│   └── modern/              # Modern design components
│       ├── StatCard.tsx
│       └── PortfolioCard.tsx
│
├── screens/                  # Screen templates
│   ├── SplashScreen.tsx     # Animated splash
│   └── WelcomeScreen.tsx    # Onboarding with carousel
│
├── hooks/                    # React Native hooks
│   ├── useAuth.ts           # Authentication hook
│   └── useNativeFeatures.ts # Native feature hooks
│
├── App.tsx.template         # Main app template
├── package.json.template    # Dependencies
├── supabase-client.ts       # Supabase configuration
└── tailwind.config.js       # NativeWind configuration
```

## Setup Instructions

### 1. Create New Expo Project

```bash
npx create-expo-app murranno-music-rn --template expo-template-blank-typescript
cd murranno-music-rn
```

### 2. Install Dependencies

```bash
# Copy package.json dependencies and run:
npm install

# Or using the template:
cp migration-assets/package.json.template package.json
npm install
```

### 3. Copy Theme Files

```bash
mkdir -p src/theme
cp migration-assets/theme/* src/theme/
```

### 4. Copy Components

```bash
mkdir -p src/components/{ui,layout,modern}
cp migration-assets/components/ui/* src/components/ui/
cp migration-assets/components/layout/* src/components/layout/
cp migration-assets/components/modern/* src/components/modern/
```

### 5. Copy Screens

```bash
mkdir -p src/screens
cp migration-assets/screens/* src/screens/
```

### 6. Configure NativeWind

```bash
cp migration-assets/tailwind.config.js tailwind.config.js

# Add to babel.config.js:
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['nativewind/babel'],
  };
};
```

### 7. Configure Supabase

```bash
mkdir -p src/services
cp migration-assets/supabase-client.ts src/services/supabase.ts

# Update with your project credentials
```

## Design System Mapping

### Colors (Web → React Native)

| CSS Variable | React Native |
|--------------|--------------|
| `hsl(var(--primary))` | `colors.dark.primary` |
| `hsl(var(--background))` | `colors.dark.background` |
| `hsl(var(--card))` | `colors.dark.card` |
| `hsl(var(--muted-foreground))` | `colors.dark.mutedForeground` |

### Components (Web → React Native)

| Web Component | React Native Component |
|---------------|------------------------|
| `<Button variant="pill">` | `<Button variant="pill">` |
| `<Card>` | `<Card>` |
| `<Input>` | `<Input>` |
| `BottomNavigation` | `BottomNavigation` |
| `PageContainer` | `PageContainer` |

### Tailwind Classes (Web → NativeWind)

| Web Class | NativeWind Class |
|-----------|------------------|
| `bg-card/80` | `bg-card/80` ✅ |
| `rounded-3xl` | `rounded-3xl` ✅ |
| `shadow-primary` | Use `shadows.primary` style |
| `glass-card` | Use `<Card variant="glass">` |

### Animations

| Web Animation | React Native Equivalent |
|---------------|------------------------|
| `transition-smooth` | `Animated.timing` with `timing.smooth` |
| `transition-bounce` | `Animated.spring` with `spring.bouncy` |
| `hover:scale-105` | `onPressIn` → `Animated.spring(scale, 1.05)` |
| `animate-float` | `createFloatAnimation()` |

## Component Usage Examples

### Button

```tsx
import { Button } from '@/components/ui/Button';

// Primary pill button (matches web)
<Button variant="pill" size="lg" onPress={handlePress}>
  Get Started
</Button>

// With haptic feedback disabled
<Button variant="ghost" disableHaptics>
  Cancel
</Button>
```

### Card with Glass Effect

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

<Card variant="glass" onPress={handlePress}>
  <CardHeader>
    <CardTitle>Earnings</CardTitle>
  </CardHeader>
  <CardContent>
    <PortfolioCard value="₦125,000" change={12.5} changeType="positive" />
  </CardContent>
</Card>
```

### Page Layout

```tsx
import { PageContainer } from '@/components/layout/PageContainer';
import { BottomNavigation } from '@/components/layout/BottomNavigation';

export const DashboardScreen = () => {
  return (
    <>
      <PageContainer scrollable hasBottomNav useMeshBackground>
        {/* Content */}
      </PageContainer>
      <BottomNavigation 
        currentRoute="ArtistDashboard"
        onNavigate={handleNavigate}
        userType="artist"
      />
    </>
  );
};
```

## Files That Can Be Directly Copied

These files from the web app can be used with minimal changes:

### Types (No changes needed)
- `src/types/analytics.ts`
- `src/types/campaign.ts`
- `src/types/news.ts`
- `src/types/payout.ts`
- `src/types/promotion.ts`
- `src/types/release.ts`
- `src/types/stats.ts`
- `src/types/user.ts`
- `src/types/wallet.ts`

### Utils (Minor changes)
- `src/utils/formatters.ts` - Direct copy
- `src/lib/cloudinary.ts` - Update imports

### Contexts (Update imports)
- `src/contexts/CartContext.tsx` - Update supabase import

### Data Hooks (Update imports)
- All `use*.ts` hooks in `src/hooks/` that don't use Capacitor

## Backend Compatibility

All existing edge functions work without changes:
- Same Supabase project
- Same API endpoints
- Same database schema
- Same RLS policies

## Next Steps

1. **Phase 2**: Migrate remaining UI components
2. **Phase 3**: Set up React Navigation
3. **Phase 4**: Convert all screens
4. **Phase 5**: Implement native features
5. **Phase 6**: Testing and QA
6. **Phase 7**: App store submission

## Support

For questions about the migration, refer to:
- `REACT_NATIVE_MIGRATION.md` - Full migration guide
- Expo documentation: https://docs.expo.dev
- NativeWind documentation: https://www.nativewind.dev
