# 🆕 Create Your Supabase Project

## Step 1: Create Supabase Account (if you don't have one)

1. Go to: https://supabase.com
2. Click **"Start your project"** or **"Sign In"**
3. Sign up with:
   - GitHub (recommended)
   - Google
   - Email

---

## Step 2: Create New Project

1. After logging in, you'll see the dashboard
2. Click **"New Project"** button
3. Fill in the details:

### Project Settings:
```
Name: Murranno Music
Database Password: [Create a strong password - SAVE THIS!]
Region: Choose closest to your users
  - US East (recommended for US)
  - Europe (for EU)
  - Asia Pacific (for Asia)
Pricing Plan: Free (perfect to start)
```

4. Click **"Create new project"**
5. Wait 2-3 minutes for setup

---

## Step 3: Get Your Project Credentials

Once the project is created:

1. Go to **Settings** (gear icon in sidebar)
2. Click **"API"**
3. You'll see:

```
Project URL: https://[YOUR-PROJECT-ID].supabase.co
Project API keys:
  - anon/public: eyJhbGci... [Long key]
  - service_role: eyJhbGci... [Long key - KEEP SECRET]
```

**Copy these two values:**
- ✅ Project URL
- ✅ anon public key

---

## Step 4: Update Your .env File

### Option 1: I'll Update It For You

**Just tell me:**
1. Your Project URL
2. Your anon public key

And I'll update the configuration automatically.

### Option 2: Update Manually

Edit `/app/murranno-music-rn/.env`:

```env
# Replace with YOUR credentials
EXPO_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-ID.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.YOUR_ACTUAL_KEY_HERE

# Keep these
EXPO_PUBLIC_APP_NAME=Murranno Music
EXPO_PUBLIC_APP_SCHEME=murranno
```

**Commands:**
```bash
cd /app/murranno-music-rn
nano .env
# Paste your credentials
# Save: Ctrl+X, Y, Enter
```

---

## Step 5: Run the Database Setup

Once your project is created and .env is updated:

1. Go to your Supabase dashboard
2. Click **"SQL Editor"** in sidebar
3. Click **"New Query"**
4. Copy the entire `supabase-schema.sql` file
5. Paste and click **"Run"**
6. Wait for success message

Then:
1. Click **"Storage"** in sidebar
2. Create 4 buckets as described before

---

## 🔍 Finding Your Project

Your Supabase project URL will look like:
```
https://abcdefghijklmnop.supabase.co
         ^^^^^^^^^^^^^^^^
         This is your Project ID
```

You can also find it at:
- Dashboard → Settings → General → Reference ID

---

## ✅ What to Share With Me

Once you create the project, share:

1. **Project URL** (starts with https://)
2. **Anon Public Key** (starts with eyJhbGci...)

And I'll:
- ✅ Update your .env file
- ✅ Update all configuration
- ✅ Test the connection
- ✅ Make sure everything works

---

## 💡 Quick Option: Use Test Credentials

If you just want to test the app first, I can set up with temporary test values, but you'll need a real project for production.

---

## 🆘 Need Help?

**Option A:** Create the project now and share credentials
- I'll configure everything for you
- Takes 2 minutes

**Option B:** Want me to walk you through it step-by-step?
- Tell me where you're stuck
- I'll provide detailed guidance

**Option C:** Already have a Supabase project?
- Share the URL and anon key
- I'll update the config

---

## 📸 Visual Guide

When you create a project, you'll see:

```
┌─────────────────────────────────┐
│  Create a new project           │
├─────────────────────────────────┤
│  Name: Murranno Music          │
│  Password: ●●●●●●●●●●●●        │
│  Region: [Select]              │
│  Plan: Free                    │
│                                 │
│  [Create new project]          │
└─────────────────────────────────┘
```

Then after creation:

```
┌─────────────────────────────────┐
│  Settings > API                 │
├─────────────────────────────────┤
│  Project URL:                   │
│  https://xyz.supabase.co       │
│                                 │
│  API Keys:                      │
│  anon/public: eyJhbGci...      │
│  [Copy to clipboard]           │
└─────────────────────────────────┘
```

---

## 🎯 What I Need From You

Please:
1. Create a Supabase project (or use existing)
2. Get the Project URL
3. Get the anon public key
4. Share them with me

Then I'll configure everything! 🚀

---

**Do you want to:**
- A) Create a new project now (I'll guide you)?
- B) You already have one (share credentials)?
- C) Need more help deciding?
