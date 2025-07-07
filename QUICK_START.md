# FlagFit Pro v2.0 - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Environment Setup
```bash
# Copy environment template
cp env.example .env.local

# Edit .env.local with your Supabase credentials
# Replace the placeholder values with your actual Supabase URL and anon key
```

### 2. Database Setup
1. **Go to Supabase Dashboard**
   - Open your Supabase project
   - Navigate to SQL Editor

2. **Run Schema**
   - Copy content from `database/schema_v2.sql`
   - Paste and run in SQL Editor

3. **Load Sample Data**
   - Copy content from `database/sample_data_v2.sql`
   - Paste and run in SQL Editor

### 3. Start Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

### 4. Test Features
1. **Open Browser Console**
2. **Run Test Script**
   ```javascript
   // Copy and paste the content of test-features.js
   ```

3. **Test Components**
   - Navigate to Athlete Dashboard
   - Click "Show Wellness" button
   - Test wellness tracking
   - Test other components

### 5. Verify Database Connection
```javascript
// In browser console
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
console.log('App Version:', import.meta.env.VITE_APP_VERSION)
```

## 🎯 What's New in v2.0

### ✅ New Features
- **Wellness Tracker**: Daily wellness monitoring
- **Enhanced Sessions**: Detailed daily and weekly views
- **Progress Tracking**: Comprehensive metrics
- **Recovery Routines**: Structured recovery programs
- **Offline Support**: Work without internet
- **Real-time Updates**: Live data synchronization

### ✅ New Components
- `WellnessTracker.vue` - Daily wellness logging
- `DailySessionView.vue` - Individual session display
- `WeeklyScheduleView.vue` - Weekly training overview
- Enhanced Pinia stores for state management

### ✅ Database Enhancements
- UUID primary keys for better scalability
- Comprehensive wellness tracking tables
- Performance metrics and recovery routines
- Enhanced security with RLS policies

## 🔧 Troubleshooting

### Common Issues

#### 1. Environment Variables Not Loading
```bash
# Check if .env.local exists
ls -la .env.local

# Restart dev server after creating .env.local
npm run dev
```

#### 2. Database Connection Errors
- Verify Supabase URL and anon key are correct
- Check if database schema is applied
- Ensure RLS policies are active

#### 3. Component Not Loading
- Check browser console for errors
- Verify all imports are correct
- Ensure Vue 3 and Pinia are installed

#### 4. Build Errors
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📱 Testing Checklist

### Basic Functionality
- [ ] App loads without errors
- [ ] Athlete dashboard displays
- [ ] Wellness tracker opens/closes
- [ ] Database connection works
- [ ] Offline mode functions

### Advanced Features
- [ ] Wellness data saves correctly
- [ ] Session views display properly
- [ ] Progress tracking works
- [ ] Real-time updates function
- [ ] PWA installs correctly

## 🚀 Ready for Production?

Once testing is complete:

1. **Update Environment Variables**
   ```env
   VITE_APP_ENVIRONMENT=production
   VITE_ENABLE_ANALYTICS=true
   ```

2. **Build for Production**
   ```bash
   npm run build
   ```

3. **Deploy**
   - Vercel: `vercel --prod`
   - Netlify: Connect repository and deploy

4. **Verify Production**
   - Test all features in production
   - Monitor for errors
   - Check performance

---

**🎉 You're all set! FlagFit Pro v2.0 is ready to use!** 