# 🚀 Supabase Quick Reference - Murranno Music

## 📦 Files Created

1. **supabase-schema.sql** - Complete database schema (17 tables)
2. **supabase-storage.sql** - Storage buckets and policies
3. **SUPABASE_COMPLETE_SETUP.md** - Step-by-step setup guide

---

## ⚡ Quick Setup (5 Minutes)

### 1. Database Schema
```
Supabase Dashboard → SQL Editor → New Query
→ Paste supabase-schema.sql → Run
```

### 2. Storage Buckets
```
Supabase Dashboard → Storage → Create 4 buckets:
- avatars (public)
- covers (public)
- audio (private)
- documents (private)
```

### 3. Storage Policies
```
SQL Editor → New Query
→ Paste supabase-storage.sql → Run
```

### 4. Verify
```
Table Editor → See 17 tables ✅
Storage → See 4 buckets ✅
```

---

## 📊 Database Tables Summary

| Table | Purpose | Key Fields |
|-------|---------|------------|
| profiles | User accounts | user_type, email, full_name |
| artists | Artist profiles | artist_name, genre, streams |
| releases | Music releases | title, type, status, cover |
| tracks | Individual songs | title, duration, audio_url |
| campaigns | Promotions | name, budget, status |
| analytics | Stats/metrics | streams, saves, plays |
| earnings | Revenue | amount, platform, period |
| wallets | User balance | balance, total_earned |
| payouts | Withdrawals | amount, status |
| label_artists | Label roster | label_id, artist_id |
| agency_clients | Agency clients | agency_id, client_id |
| notifications | In-app alerts | user_id, message, read |

---

## 🔐 User Types

```typescript
type UserType = 'artist' | 'label' | 'agency' | 'admin';
```

**Permissions:**
- **Artist**: Manage releases, campaigns, earnings
- **Label**: View roster, manage artists' releases
- **Agency**: Manage clients, campaigns
- **Admin**: Full access to everything

---

## 💻 Common Code Examples

### Create Release
```typescript
const { data, error } = await supabase
  .from('releases')
  .insert({
    artist_id: artistId,
    title: 'My New Album',
    release_type: 'album',
    genre: ['pop', 'rock'],
    release_date: '2025-03-01',
  })
  .select()
  .single();
```

### Upload Cover
```typescript
const file = /* your image file */;
const filePath = `${artistId}/${releaseId}/cover.jpg`;

const { error } = await supabase.storage
  .from('covers')
  .upload(filePath, file, { upsert: true });

const { data: { publicUrl } } = supabase.storage
  .from('covers')
  .getPublicUrl(filePath);
```

### Get User's Releases
```typescript
const { data, error } = await supabase
  .from('releases')
  .select(`
    *,
    artists!inner(profile_id)
  `)
  .eq('artists.profile_id', userId)
  .order('created_at', { ascending: false });
```

### Create Campaign
```typescript
const { data, error } = await supabase
  .from('campaigns')
  .insert({
    release_id: releaseId,
    creator_id: userId,
    name: 'Spotify Campaign',
    campaign_type: 'spotify_promotion',
    budget: 500,
    status: 'active',
  });
```

### Get Earnings
```typescript
const { data, error } = await supabase
  .from('earnings')
  .select(`
    *,
    releases(title, cover_url)
  `)
  .eq('artist_id', artistId)
  .order('period_start', { ascending: false });
```

### Get Wallet Balance
```typescript
const { data, error } = await supabase
  .from('wallets')
  .select('balance, pending_balance, total_earned')
  .eq('profile_id', userId)
  .single();
```

### Create Notification
```typescript
const { error } = await supabase
  .from('notifications')
  .insert({
    user_id: userId,
    type: 'release_approved',
    title: 'Release Approved!',
    message: 'Your release has been approved.',
    data: { release_id: releaseId },
  });
```

---

## 🗄️ Storage Paths

### Avatar Upload
```
avatars/{user_id}/avatar.jpg
```

### Release Cover
```
covers/{artist_id}/{release_id}/cover.jpg
```

### Audio Track
```
audio/{artist_id}/{release_id}/{track_id}.mp3
```

### Document
```
documents/{user_id}/contracts/contract-{id}.pdf
```

---

## 🔍 Useful SQL Queries

### Count Users by Type
```sql
SELECT user_type, COUNT(*) as count
FROM profiles
GROUP BY user_type;
```

### Recent Releases
```sql
SELECT r.title, a.artist_name, r.status
FROM releases r
JOIN artists a ON a.id = r.artist_id
ORDER BY r.created_at DESC
LIMIT 10;
```

### Active Campaigns
```sql
SELECT name, budget, spent, status
FROM campaigns
WHERE status = 'active'
ORDER BY created_at DESC;
```

### Top Earning Artists
```sql
SELECT a.artist_name, SUM(e.revenue) as total
FROM earnings e
JOIN artists a ON a.id = e.artist_id
GROUP BY a.artist_name
ORDER BY total DESC
LIMIT 10;
```

---

## 🚨 Emergency Commands

### Disable RLS (Testing Only)
```sql
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
```

### Re-enable RLS
```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

### Delete Test Data
```sql
DELETE FROM releases WHERE title LIKE '%test%';
DELETE FROM artists WHERE artist_name LIKE '%test%';
```

### Reset Sequence (if needed)
```sql
ALTER SEQUENCE releases_id_seq RESTART WITH 1;
```

---

## 📱 React Native Hooks

### useProfile
```typescript
const { data: profile, error } = useQuery({
  queryKey: ['profile', userId],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) throw error;
    return data;
  },
});
```

### useReleases
```typescript
const { data: releases } = useQuery({
  queryKey: ['releases', artistId],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('releases')
      .select('*')
      .eq('artist_id', artistId)
      .order('release_date', { ascending: false });
    if (error) throw error;
    return data;
  },
});
```

### useWallet
```typescript
const { data: wallet } = useQuery({
  queryKey: ['wallet', userId],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('profile_id', userId)
      .single();
    if (error) throw error;
    return data;
  },
});
```

---

## ✅ Setup Checklist

- [ ] Run supabase-schema.sql
- [ ] Create 4 storage buckets
- [ ] Run supabase-storage.sql
- [ ] Verify 17 tables exist
- [ ] Test RLS policies
- [ ] Upload test file to storage
- [ ] Create test user
- [ ] Test app connection

---

## 📞 Quick Links

- Dashboard: https://supabase.com/dashboard/project/nqfltvbzqxdxsobhedci
- SQL Editor: https://supabase.com/dashboard/project/nqfltvbzqxdxsobhedci/sql
- Table Editor: https://supabase.com/dashboard/project/nqfltvbzqxdxsobhedci/editor
- Storage: https://supabase.com/dashboard/project/nqfltvbzqxdxsobhedci/storage/buckets
- Auth: https://supabase.com/dashboard/project/nqfltvbzqxdxsobhedci/auth/users

---

**Database is ready! Start building! 🚀**
