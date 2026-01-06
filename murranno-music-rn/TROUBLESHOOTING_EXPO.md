# Expo Go Troubleshooting Guide

## 🔍 App Not Opening on Expo Go - Quick Fixes

### Step 1: Test Basic Connection

I've created a **simplified App.tsx** that should definitely work.

**What was changed:**
- Removed all complex dependencies (navigation, contexts, etc.)
- Created a simple working app
- Uses only basic React Native components

**Try again now:**
```bash
# Make sure you're in the project directory
cd murranno-music-rn

# Start Expo
npx expo start

# Scan QR with Expo Go
```

---

## 🚨 Common Issues & Solutions

### Issue 1: "Unable to connect to Metro"

**Solution:**
```bash
# Clear cache and restart
npx expo start --clear

# Or
rm -rf .expo node_modules
npm install
npx expo start
```

### Issue 2: "Network error" or "Couldn't connect"

**Solution:**
- ✅ Ensure phone and computer are on **same WiFi**
- ✅ Check firewall isn't blocking port 8081
- ✅ Try using **tunnel mode**:
  ```bash
  npx expo start --tunnel
  ```

### Issue 3: "Expo SDK version mismatch"

**Solution:**
```bash
# Update packages to match
npx expo install --fix

# Or update specific packages
npx expo install expo-status-bar react-native-safe-area-context
```

### Issue 4: Red screen with error messages

**Check the error message:**

- **"Module not found"**: Missing dependency
  ```bash
  npm install
  ```

- **"Invalid hook call"**: Multiple React versions
  ```bash
  npm list react react-native
  # If duplicates found, remove node_modules
  rm -rf node_modules
  npm install
  ```

- **"Unable to resolve module './src/...'**: File doesn't exist
  - Check if the file path is correct
  - Check if all context files exist

### Issue 5: White screen or blank screen

**Solutions:**
1. Check Metro bundler logs in terminal
2. Shake device → Reload
3. Clear cache:
   ```bash
   npx expo start --clear
   ```

---

## ✅ Current Status

**Simplified App Active:**
- ✅ No external dependencies
- ✅ No navigation complexity
- ✅ No context providers
- ✅ Just pure React Native components

**This should work 100%**

---

## 🔧 Step-by-Step Debug Process

### 1. Check Metro Bundler
Look at your terminal after scanning QR code:
- ✅ Should show: "Building JavaScript bundle..."
- ✅ Should show progress percentage
- ❌ If errors appear, note the error message

### 2. Check Expo Go App
After scanning:
- ✅ Should show loading indicator
- ✅ Should build bundle (may take 30-60 seconds first time)
- ❌ If immediate error, check network

### 3. Common Error Messages

**"Uncaught Error: Module './src/contexts/AuthContext' not found"**
→ This means full app is trying to load. Use simplified version.

**"Network request failed"**
→ Connection issue. Try tunnel mode: `npx expo start --tunnel`

**"Something went wrong"**
→ Generic error. Check Metro terminal for details.

---

## 🎯 Quick Test Checklist

Before testing again:

- [ ] Terminal shows "Metro Bundler ready"
- [ ] No error messages in terminal
- [ ] Phone and computer on same WiFi
- [ ] Expo Go app is up to date
- [ ] QR code scanned correctly
- [ ] Using simplified App.tsx (already done)

---

## 📱 Alternative Testing Methods

### Option 1: Use Tunnel (Bypass WiFi)
```bash
npx expo start --tunnel
# Slower but more reliable
```

### Option 2: Use LAN IP directly
```bash
npx expo start --lan
```

### Option 3: Use iOS Simulator (Mac only)
```bash
npx expo start --ios
```

### Option 4: Use Android Emulator
```bash
npx expo start --android
```

---

## 🔄 Reset Everything (Nuclear Option)

If nothing works:
```bash
# 1. Kill all processes
pkill -f expo
pkill -f node

# 2. Clean everything
rm -rf node_modules
rm -rf .expo
rm package-lock.json
rm yarn.lock

# 3. Reinstall
npm install

# 4. Start fresh
npx expo start --clear
```

---

## 📊 What Error Are You Seeing?

Please check your Expo Go app and tell me which one:

1. **🔴 Red error screen** → Tell me the error message
2. **⚪ White blank screen** → Check Metro bundler logs
3. **🔄 Stuck on loading** → Network issue, try tunnel
4. **❌ "Unable to connect"** → WiFi or firewall issue
5. **📱 App crashes immediately** → SDK version mismatch

---

## 🆘 Get More Info

To help you better, run this and share output:

```bash
# Check your setup
npx expo-doctor

# Check running processes
lsof -i :8081

# Check Expo version
npx expo --version

# Check Node version
node --version
```

---

## ✨ Success Indicators

When it works, you should see:
1. ✅ Terminal: "Building JavaScript bundle [======] 100%"
2. ✅ Expo Go: Loading bar completing
3. ✅ Screen showing: "🎉 Murranno Music" title
4. ✅ Cards with "✅ Expo Go Connected!" message

---

## 🔙 Restore Full App

Once simplified version works, restore full app:

```bash
# Restore full version
mv App.tsx App.simple.tsx
mv App.full.tsx App.tsx

# You'll also need to ensure these exist:
# - src/contexts/AuthContext.tsx
# - src/contexts/CartContext.tsx
# - src/contexts/ThemeContext.tsx
# - src/navigation/RootNavigator.tsx
```

---

**Try the simplified app now and let me know what happens!** 🚀
