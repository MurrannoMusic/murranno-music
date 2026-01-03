# GitHub Deployment Instructions

## 📦 Deploying to GitHub Repository

### Step 1: Prepare the Repository

```bash
# Navigate to the project
cd /app/murranno-music-rn

# Initialize git (if not already done)
git init

# Create .gitignore if needed (already exists)
# Verify it includes:
# - node_modules/
# - .expo/
# - .env
# - ios/Pods/
# - android/.gradle/
```

### Step 2: Create GitHub Repository

1. Go to [github.com](https://github.com)
2. Click "New Repository"
3. Name it: `murranno-music-rn`
4. Choose: Private (recommended) or Public
5. **DO NOT** initialize with README (we already have one)
6. Create repository

### Step 3: Push to GitHub

```bash
# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Complete React Native migration

- 27+ screens implemented
- 14 UI components
- Complete navigation system
- Supabase integration
- Native features configured
- Full documentation included"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/murranno-music-rn.git

# Push to main branch
git branch -M main
git push -u origin main
```

### Step 4: Verify Upload

Check that these files/folders are on GitHub:
- ✅ `src/` folder with all source code
- ✅ `package.json`
- ✅ `App.tsx`
- ✅ All `.md` documentation files
- ✅ Configuration files (app.config.ts, eas.json, etc.)
- ❌ `node_modules/` (should NOT be uploaded)
- ❌ `.env` (should NOT be uploaded)

---

## 🔐 Setting Up Secrets

### GitHub Secrets (for CI/CD)

If you plan to use GitHub Actions:

1. Go to repository Settings
2. Navigate to Secrets and variables > Actions
3. Add these secrets:
   - `EXPO_TOKEN` - Your Expo access token
   - `SUPABASE_URL` - Your Supabase URL
   - `SUPABASE_ANON_KEY` - Your Supabase anon key

### Get Expo Token

```bash
# Login to Expo
eas login

# Get access token
eas whoami --json | jq -r '.token'

# Or create a personal access token at:
# https://expo.dev/accounts/[account]/settings/access-tokens
```

---

## 🔄 Setting Up CI/CD (Optional)

### Create GitHub Actions Workflow

Create `.github/workflows/build.yml`:

```yaml
name: EAS Build

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    name: Install and build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18.x
          cache: npm
          
      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
          
      - name: Install dependencies
        run: npm install
        
      - name: Run tests
        run: npm test
        
      - name: Build on EAS
        run: eas build --platform all --non-interactive
```

---

## 📋 Repository Settings

### Branch Protection

1. Go to Settings > Branches
2. Add rule for `main` branch
3. Enable:
   - ✅ Require pull request reviews
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date

### Collaborators

1. Go to Settings > Collaborators
2. Add team members with appropriate permissions:
   - Admin: Full access
   - Write: Push to branches
   - Read: View only

---

## 📝 README Badge (Optional)

Add build status badge to your README:

```markdown
![Build Status](https://github.com/YOUR_USERNAME/murranno-music-rn/actions/workflows/build.yml/badge.svg)
```

---

## 🏷️ Creating Releases

### Create a Release

```bash
# Tag the current commit
git tag -a v1.0.0 -m "Release v1.0.0 - Initial public release"

# Push the tag
git push origin v1.0.0
```

### GitHub Release Page

1. Go to Releases on GitHub
2. Click "Draft a new release"
3. Choose the tag (v1.0.0)
4. Title: "Version 1.0.0 - Initial Release"
5. Description:
```markdown
## 🎉 Initial Release

### Features
- Complete React Native migration from web app
- 27+ screens for Artist, Label, and Agency users
- Native features: camera, biometrics, push notifications
- Supabase backend integration
- Beautiful UI with NativeWind (Tailwind CSS)

### Downloads
- iOS: Available on App Store
- Android: Available on Google Play

### Documentation
See README.md for setup instructions
```

---

## 👥 Team Workflow

### For Team Members

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/murranno-music-rn.git
   cd murranno-music-rn
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env
   # Get credentials from team lead
   ```

4. **Create feature branch**
   ```bash
   git checkout -b feature/my-feature
   ```

5. **Make changes and commit**
   ```bash
   git add .
   git commit -m "feat: add my feature"
   git push origin feature/my-feature
   ```

6. **Create Pull Request on GitHub**

---

## 🔄 Keeping Fork Updated

If team members fork the repository:

```bash
# Add upstream remote
git remote add upstream https://github.com/YOUR_USERNAME/murranno-music-rn.git

# Fetch upstream changes
git fetch upstream

# Merge into your branch
git merge upstream/main

# Push to your fork
git push origin main
```

---

## 📦 Distributing to Local Machine

### Option 1: Clone from GitHub

```bash
git clone https://github.com/YOUR_USERNAME/murranno-music-rn.git
cd murranno-music-rn
npm install
```

### Option 2: Download ZIP

1. Go to GitHub repository
2. Click "Code" > "Download ZIP"
3. Extract and run:
   ```bash
   cd murranno-music-rn
   npm install
   ```

### Option 3: GitHub Desktop

1. Download [GitHub Desktop](https://desktop.github.com)
2. File > Clone Repository
3. Choose `murranno-music-rn`
4. Open in terminal and run `npm install`

---

## 🛠️ Troubleshooting GitHub

### Large File Issues

If you accidentally committed large files:

```bash
# Remove from git history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch path/to/large/file" \
  --prune-empty --tag-name-filter cat -- --all

# Force push
git push origin --force --all
```

### Authentication Issues

If you can't push:

```bash
# Use SSH instead of HTTPS
git remote set-url origin git@github.com:YOUR_USERNAME/murranno-music-rn.git

# Or set up GitHub CLI
gh auth login
```

### Merge Conflicts

```bash
# Pull latest
git pull origin main

# If conflicts occur:
# 1. Open conflicted files
# 2. Resolve conflicts (remove <<<<, ====, >>>>)
# 3. Add and commit
git add .
git commit -m "fix: resolve merge conflicts"
git push origin main
```

---

## 📊 GitHub Features to Use

### Projects

1. Go to Projects tab
2. Create project board
3. Add columns: To Do, In Progress, In Review, Done
4. Link issues and PRs

### Issues

1. Go to Issues tab
2. Create issue templates for:
   - Bug reports
   - Feature requests
   - Questions

### Wiki

1. Go to Wiki tab
2. Create pages for:
   - Setup guide
   - Architecture
   - API documentation
   - Troubleshooting

### Discussions

Enable Discussions for:
- Q&A
- General discussions
- Announcements

---

## 🎯 Next Steps

After pushing to GitHub:

1. ✅ Verify all files uploaded correctly
2. ✅ Set up branch protection
3. ✅ Add team members
4. ✅ Configure secrets
5. ✅ Set up CI/CD (optional)
6. ✅ Create first release
7. ✅ Share repo link with team

---

## 📞 Support

If you encounter issues:
- Check GitHub documentation
- Review `.gitignore` for excluded files
- Ensure credentials are in secrets, not code
- Contact DevOps team for CI/CD help

---

**Repository is ready for collaboration! 🚀**
