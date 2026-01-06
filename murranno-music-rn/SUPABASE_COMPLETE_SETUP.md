# 🗄️ Complete Supabase Setup Guide

## 🎯 Overview

This guide will help you set up the complete database schema for Murranno Music, including all tables, relationships, Row Level Security policies, storage buckets, and functions.

---

## 📋 What Will Be Created

### Database Tables (17 tables):
1. **profiles** - User profiles extending auth.users
2. **artists** - Artist information and stats
3. **releases** - Music releases (albums, EPs, singles)
4. **tracks** - Individual tracks within releases
5. **campaigns** - Marketing and promotion campaigns
6. **analytics** - Performance metrics and statistics
7. **earnings** - Revenue tracking per release/platform
8. **wallets** - User wallet balances
9. **payouts** - Payout requests and history
10. **label_artists** - Label-artist relationships
11. **agency_clients** - Agency client management
12. **notifications** - In-app notifications
13. **playlists** - Playlist tracking
14. **playlist_submissions** - Playlist submission tracking
15. **activity_logs** - User activity tracking
16. **subscription_plans** - Available subscription tiers
17. **subscriptions** - User subscriptions

### Storage Buckets (4 buckets):
1. **avatars** - Profile pictures (public)
2. **covers** - Release artwork (public)
3. **audio** - Audio files (private, authenticated)
4. **documents** - Contracts, invoices, etc. (private)

### Security Features:
- ✅ Row Level Security (RLS) on all tables
- ✅ Proper access control policies
- ✅ Secure storage with authentication
- ✅ Automated triggers and functions
- ✅ Data validation and constraints

---

## 🚀 Step-by-Step Setup

### Step 1: Access Supabase Dashboard

1. Go to: https://supabase.com/dashboard
2. Navigate to your project: **nqfltvbzqxdxsobhedci**
3. Or go directly to: https://nqfltvbzqxdxsobhedci.supabase.co

---

### Step 2: Create Database Schema

1. **Click on "SQL Editor"** in the left sidebar
2. **Click "New Query"**
3. **Copy the entire contents** of `supabase-schema.sql`
4. **Paste into the SQL editor**
5. **Click "Run"** (bottom right corner)

**Expected Result:**
```
Success. No rows returned
```

This creates all 17 tables with proper relationships and security.

---

### Step 3: Verify Tables Created

1. Click on **"Table Editor"** in sidebar
2. You should see all tables listed:
   - profiles
   - artists
   - releases
   - tracks
   - campaigns
   - analytics
   - earnings
   - wallets
   - payouts
   - label_artists
   - agency_clients
   - notifications
   - playlists
   - playlist_submissions
   - activity_logs
   - subscription_plans
   - subscriptions

✅ **If you see these, database setup is complete!**

---

### Step 4: Create Storage Buckets

1. Click on **"Storage"** in sidebar
2. Click **"Create a new bucket"**

#### Create Bucket 1: avatars
- **Name:** `avatars`
- **Public bucket:** ✅ **YES** (check the box)
- Click **"Create bucket"**

#### Create Bucket 2: covers
- **Name:** `covers`
- **Public bucket:** ✅ **YES**
- Click **"Create bucket"**

#### Create Bucket 3: audio
- **Name:** `audio`
- **Public bucket:** ❌ **NO** (uncheck)
- Click **"Create bucket"**

#### Create Bucket 4: documents
- **Name:** `documents`
- **Public bucket:** ❌ **NO**
- Click **"Create bucket"**

---

### Step 5: Set Up Storage Policies

1. Go back to **"SQL Editor"**
2. Click **"New Query"**
3. **Copy the entire contents** of `supabase-storage.sql`
4. **Paste and Run**

This sets up proper security for file uploads and downloads.

---

### Step 6: Verify Setup

#### Test 1: Check Tables
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Should return 17 tables.

#### Test 2: Check RLS is Enabled
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

All tables should show `rowsecurity = true`.

#### Test 3: Check Storage Buckets
Go to Storage → You should see 4 buckets.

---

## 📊 Database Schema Overview

### Core Entities Relationships:

```
auth.users (Supabase Auth)
    ↓
profiles (extends users)
    ↓
artists ←→ labels (label_artists)
    ↓
releases
    ↓
tracks

profiles → campaigns → analytics
profiles → wallets → payouts
profiles → subscriptions ← subscription_plans
profiles → notifications
profiles → activity_logs

agencies → agency_clients
labels → label_artists → artists
```

---

## 🔐 Security Features

### Row Level Security (RLS) Policies:

**What's Protected:**
- ✅ Users can only see their own data
- ✅ Artists can manage their releases
- ✅ Labels can view their artists' data
- ✅ Agencies can manage their clients
- ✅ Admins have full access
- ✅ Storage files are protected

**Example Policies:**
- Artists can create/edit their own releases
- Labels can view (but not edit) their artists' releases
- Users can only access their own wallet
- Notifications are user-specific
- File uploads require authentication

---

## 📁 Storage Structure

### Recommended Folder Organization:

```
avatars/
  └── {user_id}/
      └── avatar.jpg

covers/
  └── {artist_id}/
      └── {release_id}/
          └── cover.jpg

audio/
  └── {artist_id}/
      └── {release_id}/
          └── {track_id}.mp3
          └── {track_id}-preview.mp3

documents/
  └── {user_id}/
      └── contracts/
          └── contract-{id}.pdf
      └── invoices/
          └── invoice-{number}.pdf
```

---

## 🎨 Using the Database in Your App

### Example: Create a Profile (Auto-triggered on signup)
```typescript
import { supabase } from './services/supabase';

// This happens automatically via trigger
// But you can update:
const { data, error } = await supabase
  .from('profiles')
  .update({
    full_name: 'John Doe',
    user_type: 'artist',
    bio: 'Music producer',
  })
  .eq('id', user.id);
```

### Example: Create an Artist Profile
```typescript
const { data, error } = await supabase
  .from('artists')
  .insert({
    profile_id: user.id,
    artist_name: 'DJ Cool',
    genre: ['electronic', 'house'],
    spotify_url: 'https://open.spotify.com/artist/...',
  });
```

### Example: Create a Release
```typescript
const { data, error } = await supabase
  .from('releases')
  .insert({
    artist_id: artistId,
    title: 'New Album',
    release_type: 'album',
    release_date: '2025-03-01',
    genre: ['pop', 'rock'],
    status: 'draft',
  });
```

### Example: Upload Cover Art
```typescript
import { supabase } from './services/supabase';

const uploadCover = async (artistId: string, releaseId: string, imageFile: File) => {
  const filePath = `${artistId}/${releaseId}/cover.jpg`;
  
  const { data, error } = await supabase.storage
    .from('covers')
    .upload(filePath, imageFile, {
      upsert: true,
      contentType: 'image/jpeg',
    });
  
  if (error) throw error;
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('covers')
    .getPublicUrl(filePath);
  
  // Update release with cover URL
  await supabase
    .from('releases')
    .update({ cover_url: publicUrl })
    .eq('id', releaseId);
  
  return publicUrl;
};
```

### Example: Query Analytics
```typescript
const { data, error } = await supabase
  .from('analytics')
  .select('*')
  .eq('entity_type', 'release')
  .eq('entity_id', releaseId)
  .gte('date', startDate)
  .lte('date', endDate)
  .order('date', { ascending: true });
```

### Example: Get Earnings
```typescript
const { data, error } = await supabase
  .from('earnings')
  .select(`
    *,
    releases:release_id (
      title,
      cover_url
    )
  `)
  .eq('artist_id', artistId)
  .order('period_start', { ascending: false });
```

---

## 🧪 Testing Your Setup

### Test 1: Create a Test User

1. Go to **Authentication** → **Users**
2. Click **"Add user"**
3. Enter:
   - Email: `test@murranno.com`
   - Password: `TestPass123!`
4. Click **"Create user"**

### Test 2: Verify Profile Created

Go to **Table Editor** → **profiles**
- You should see the test user with their email
- This confirms the trigger is working

### Test 3: Create Test Data

Run in SQL Editor:
```sql
-- Get the test user's ID
SELECT id FROM auth.users WHERE email = 'test@murranno.com';

-- Use that ID to create an artist (replace {user_id})
INSERT INTO public.artists (profile_id, artist_name, genre)
VALUES ('{user_id}', 'Test Artist', ARRAY['pop', 'rock']);

-- Create a release
INSERT INTO public.releases (artist_id, title, release_type, status)
SELECT id, 'Test Album', 'album', 'draft'
FROM public.artists
WHERE artist_name = 'Test Artist';
```

### Test 4: Test Storage Upload

1. Go to **Storage** → **avatars**
2. Create folder: `{user_id}`
3. Upload a test image
4. Verify you can see it (public bucket)

---

## ✅ Setup Verification Checklist

- [ ] All 17 database tables created
- [ ] RLS enabled on all tables
- [ ] All 4 storage buckets created
- [ ] Storage policies applied
- [ ] Sample subscription plans inserted
- [ ] Test user created and profile auto-created
- [ ] Test artist and release created
- [ ] Test file uploaded to storage
- [ ] No errors in SQL execution

**If all checked, you're ready to use the database!** ✅

---

## 🔧 Useful Queries

### View All User Types
```sql
SELECT user_type, COUNT(*) 
FROM public.profiles 
GROUP BY user_type;
```

### View Recent Releases
```sql
SELECT r.*, a.artist_name 
FROM public.releases r
JOIN public.artists a ON a.id = r.artist_id
ORDER BY r.created_at DESC
LIMIT 10;
```

### View Active Campaigns
```sql
SELECT c.*, r.title as release_title
FROM public.campaigns c
LEFT JOIN public.releases r ON r.id = c.release_id
WHERE c.status = 'active'
ORDER BY c.created_at DESC;
```

### Check Wallet Balances
```sql
SELECT p.email, p.full_name, w.balance, w.total_earned
FROM public.wallets w
JOIN public.profiles p ON p.id = w.profile_id
WHERE w.balance > 0
ORDER BY w.balance DESC;
```

---

## 📞 Troubleshooting

### Issue: Tables not created
**Solution:** Make sure you're in the correct project and run the full SQL script.

### Issue: RLS blocking queries
**Solution:** Check that policies are created. Temporarily disable RLS to test:
```sql
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
```
(Re-enable after testing)

### Issue: Storage upload fails
**Solution:** Check bucket exists and policies are applied. Test with public bucket first.

### Issue: Functions not working
**Solution:** Ensure they're marked as `SECURITY DEFINER` and have proper permissions.

---

## 🎊 Next Steps

1. ✅ Complete this setup
2. ✅ Test the connection in your React Native app
3. ✅ Create your first user via the app
4. ✅ Build out features using the database
5. ✅ Monitor usage in Supabase dashboard

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Guide](https://supabase.com/docs/guides/storage)
- [PostgreSQL Functions](https://www.postgresql.org/docs/current/functions.html)

---

**Your Murranno Music database is now fully configured! 🎉**

Run the setup and let me know if you encounter any issues!
