# ✅ Supabase Connection Setup Complete!

## 🎯 What Was Configured

Your app is now set up to connect to Supabase with a **live connection test**!

---

## 📦 What's Included

### 1. Environment Configuration ✅
Created `.env` file with your Supabase credentials:
```env
EXPO_PUBLIC_SUPABASE_URL=https://nqfltvbzqxdxsobhedci.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ... (your key)
```

### 2. Supabase Service ✅
Already configured at `src/services/supabase.ts` with:
- AsyncStorage persistence
- Auto token refresh
- React Native optimized
- Helper functions (signIn, signUp, signOut, etc.)

### 3. Connection Test App ✅
New test app that shows:
- Real-time connection status
- Configuration details
- Live test results
- Connection troubleshooting

---

## 🚀 Test Supabase Connection Now

### Step 1: Start Expo
```bash
cd murranno-music-rn
npx expo start --clear
```

### Step 2: Scan QR Code
- Open Expo Go
- Scan the QR code
- Wait for bundle to build

### Step 3: See Connection Test
You'll see a screen showing:
- **Connection Status:** ✅ Connected! or ❌ Error
- **Configuration:** Your Supabase URL and key status
- **Test Results:** Live connection test logs
- **Retry button:** To test again

---

## 📱 Expected Screen

```
╔════════════════════════════╗
║ 🎉 Murranno Music         ║
║ Supabase Connection Test   ║
║                            ║
║ ┌─ Connection Status ───┐ ║
║ │                        │ ║
║ │   ✅ Connected!        │ ║
║ │                        │ ║
║ │   [🔄 Retry]          │ ║
║ └────────────────────────┘ ║
║                            ║
║ ┌─ Configuration ────────┐ ║
║ │ URL: nqfltvbz...       │ ║
║ │ Key: ✅ Configured     │ ║
║ └────────────────────────┘ ║
║                            ║
║ ┌─ Test Results ─────────┐ ║
║ │ ✅ Client initialized  │ ║
║ │ 📍 URL found           │ ║
║ │ 🔑 Anon key found      │ ║
║ │ 🔍 Testing auth...     │ ║
║ │ ✅ Connected!          │ ║
║ │ 👤 No session (normal) │ ║
║ └────────────────────────┘ ║
╚════════════════════════════╝
```

---

## ✅ What Gets Tested

The app automatically tests:

1. **Client Initialization**
   - Verifies Supabase client is created
   
2. **Environment Variables**
   - Checks SUPABASE_URL is set
   - Confirms ANON_KEY exists

3. **Auth Connection**
   - Tests connection to Supabase Auth
   - Checks session status

4. **Database Access** (optional)
   - Tries a simple query
   - Reports if database is accessible

---

## 🔧 Using Supabase in Your App

### Import the Client:
```typescript
import { supabase } from './src/services/supabase';
```

### Sign Up a User:
```typescript
import { signUpWithEmail } from './src/services/supabase';

const handleSignup = async () => {
  const { data, error } = await signUpWithEmail(
    'user@example.com',
    'password123',
    'John Doe'
  );
  
  if (error) {
    console.error('Signup error:', error);
  } else {
    console.log('User created:', data.user);
  }
};
```

### Sign In:
```typescript
import { signInWithEmail } from './src/services/supabase';

const handleLogin = async () => {
  const { data, error } = await signInWithEmail(
    'user@example.com',
    'password123'
  );
  
  if (error) {
    console.error('Login error:', error);
  } else {
    console.log('Logged in:', data.user);
  }
};
```

### Get Current User:
```typescript
import { getCurrentUser } from './src/services/supabase';

const checkUser = async () => {
  const user = await getCurrentUser();
  if (user) {
    console.log('Current user:', user);
  } else {
    console.log('Not logged in');
  }
};
```

### Listen to Auth Changes:
```typescript
import { onAuthStateChange } from './src/services/supabase';

// In your component
useEffect(() => {
  const { data: subscription } = onAuthStateChange((event, session) => {
    console.log('Auth event:', event);
    console.log('Session:', session);
  });

  return () => {
    subscription?.subscription.unsubscribe();
  };
}, []);
```

### Query Data:
```typescript
// Get data
const { data, error } = await supabase
  .from('releases')
  .select('*')
  .eq('artist_id', userId);

// Insert data
const { data, error } = await supabase
  .from('releases')
  .insert({
    title: 'New Song',
    artist_id: userId,
    release_date: new Date().toISOString()
  });

// Update data
const { data, error } = await supabase
  .from('releases')
  .update({ status: 'published' })
  .eq('id', releaseId);

// Delete data
const { data, error } = await supabase
  .from('releases')
  .delete()
  .eq('id', releaseId);
```

---

## 🗄️ Database Setup

Your Supabase project needs tables. Here's a quick start:

### 1. Go to Supabase Dashboard
https://nqfltvbzqxdxsobhedci.supabase.co

### 2. Create Tables
SQL Editor → New Query:

```sql
-- Users table (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade,
  full_name text,
  user_type text check (user_type in ('artist', 'label', 'agency', 'admin')),
  avatar_url text,
  created_at timestamp with time zone default now(),
  primary key (id)
);

-- Releases table
create table public.releases (
  id uuid default uuid_generate_v4() primary key,
  artist_id uuid references public.profiles(id),
  title text not null,
  cover_url text,
  release_date date,
  status text,
  created_at timestamp with time zone default now()
);

-- Campaigns table
create table public.campaigns (
  id uuid default uuid_generate_v4() primary key,
  release_id uuid references public.releases(id),
  name text not null,
  budget numeric,
  status text,
  created_at timestamp with time zone default now()
);
```

### 3. Set Row Level Security (RLS)
```sql
-- Enable RLS
alter table public.profiles enable row level security;
alter table public.releases enable row level security;
alter table public.campaigns enable row level security;

-- Profiles: Users can read their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Profiles: Users can update their own profile
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);
```

---

## 🔐 Current Credentials

**Supabase Project:**
- URL: `https://nqfltvbzqxdxsobhedci.supabase.co`
- Anon Key: Configured in `.env`
- Project: Already set up with these credentials

**Status:** Ready to use!

---

## 📊 Test Results Meaning

| Result | Meaning |
|--------|---------|
| ✅ Connected! | Supabase is working perfectly |
| ❌ Connection Error | Check URL or key |
| 👤 No session | Normal - no user logged in yet |
| 🗄️ Database connected | Can query database |
| ⚠️ Query test failed | Tables may not exist yet |

---

## 🐛 Troubleshooting

### "❌ Connection Error"

**Check these:**
1. Verify `.env` file exists
2. Check SUPABASE_URL is correct
3. Verify ANON_KEY is valid
4. Restart Expo: `npx expo start --clear`

### "❌ Anon key missing"

**Fix:**
```bash
# Check if .env exists
cat .env

# If not, copy from example
cp .env.example .env

# Edit with correct key
nano .env
```

### "Network request failed"

**Possible causes:**
- No internet connection
- Supabase project is paused
- Firewall blocking requests

**Test in browser:**
Visit: https://nqfltvbzqxdxsobhedci.supabase.co

---

## 🔄 Switch to Full App

Once Supabase connection is verified:

```bash
# Save current test app
mv App.tsx App.supabase-test.tsx

# Restore full app with all features
mv App.full.tsx App.tsx

# Restart
npx expo start --clear
```

The full app already has:
- Complete auth flow
- User profile management
- Database queries
- All Supabase features

---

## 📚 Available Helper Functions

All in `src/services/supabase.ts`:

- `supabase` - Main client
- `getSession()` - Get current session
- `getCurrentUser()` - Get current user
- `onAuthStateChange()` - Listen to auth
- `signInWithEmail()` - Login
- `signUpWithEmail()` - Register
- `signOut()` - Logout
- `resetPassword()` - Password reset
- `updatePassword()` - Update password
- `callEdgeFunction()` - Call Supabase functions

---

## ✨ Next Steps

1. ✅ **Test connection** (current app)
2. ✅ **Verify it works** (check green status)
3. 📊 **Create database tables** (Supabase dashboard)
4. 🔐 **Set up RLS policies** (security)
5. 🎨 **Switch to full app** (with UI)
6. 🚀 **Start building features!**

---

## 🎊 Ready to Test!

Run this now:
```bash
npx expo start --clear
```

You should see:
- ✅ Connection Status: Connected!
- 🔑 Anon key: Configured
- 📍 URL: Your Supabase project
- Test results showing successful connection

---

**Supabase is ready to use! 🎉**

Test the connection and let me know what you see!
