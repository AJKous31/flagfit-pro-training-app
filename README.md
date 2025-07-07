# FlagFit Pro v2.0 - Flag Football Training App

A comprehensive Progressive Web App (PWA) for flag football training management with role-based dashboards for Athletes, Coaches, and Admins. Now featuring advanced wellness tracking, enhanced session management, and comprehensive progress monitoring.

## 🚀 Features

### Core Functionality
- **Role-Based Access**: Athlete, Coach, and Admin dashboards
- **Wellness Tracking**: Daily wellness monitoring with sleep, energy, motivation tracking
- **Training Programs**: Comprehensive program templates with weekly and daily sessions
- **Exercise Library**: 50+ exercises across 9 categories with detailed instructions
- **Session Management**: Daily training sessions with exercise assignments
- **Progress Tracking**: Performance metrics and training logs
- **Recovery Management**: Recovery routines and protocols
- **Real-time Updates**: Live data synchronization
- **Offline Support**: Full offline functionality with data sync
- **PWA Support**: Mobile app experience with installation

### Technical Features
- **Modern Tech Stack**: Vue 3 + Vite + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Real-time + Auth)
- **UUID Primary Keys**: Scalable and secure data structure
- **Row Level Security**: Comprehensive data protection
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG 2.1 AA compliant
- **Performance**: Optimized loading and caching

## 🆕 What's New in v2.0

### Major Enhancements
- **Wellness Tracker**: Comprehensive daily wellness monitoring with sleep, energy, motivation, and stress tracking
- **Enhanced Session Views**: Detailed daily and weekly session displays with exercise details
- **Advanced Progress Tracking**: Comprehensive performance metrics and trend analysis
- **Recovery Routines**: Structured recovery programs with exercise assignments
- **Offline-First Design**: Full offline functionality with intelligent data synchronization
- **Real-time Updates**: Live data updates across all connected devices
- **Enhanced Security**: Improved Row Level Security and data protection

### New Components
- `WellnessTracker.vue` - Daily wellness logging and history
- `DailySessionView.vue` - Individual session display with exercise details
- `WeeklyScheduleView.vue` - Weekly training overview with navigation
- Enhanced Pinia stores for state management and offline sync

### Database Improvements
- UUID primary keys for better scalability and security
- Comprehensive wellness tracking tables
- Enhanced performance metrics and recovery routines
- Improved data relationships and constraints

## 🏗️ Architecture

The app uses a comprehensive PostgreSQL schema with UUID primary keys and proper relationships:

#### Core Tables
- **users**: User authentication and profiles
- **teams**: Team management
- **exercise_categories**: Exercise categorization (9 types)
- **exercises**: Comprehensive exercise library (50+ exercises)
- **training_programs**: Program templates
- **weekly_templates**: Weekly training structure
- **daily_sessions**: Daily training sessions
- **session_exercises**: Exercise assignments within sessions

#### User Management
- **athlete_profiles**: Detailed athlete information
- **athlete_programs**: Program assignments
- **training_sessions**: Scheduled sessions
- **training_logs**: Performance tracking

#### Recovery & Assessment
- **recovery_routines**: Recovery protocols
- **recovery_exercises**: Recovery activities
- **recovery_logs**: Recovery tracking
- **athlete_assessments**: Performance assessments
- **athlete_metrics**: Progress metrics
- **athlete_questionnaires**: Feedback collection

### Exercise Categories
1. **Warm-up**: Pre-training activation
2. **Strength Training**: Resistance exercises
3. **Plyometrics**: Explosive power development
4. **Speed Development**: Linear speed training
5. **Agility Training**: Change of direction
6. **Skill Development**: Position-specific skills
7. **Recovery**: Rest and regeneration
8. **Stretching**: Flexibility and mobility
9. **Conditioning**: Cardiovascular training

### Training Programs
- **Offseason Foundation**: 16-week base building
- **Preseason Preparation**: 8-week sport-specific training
- **Competition Season**: 12-week maintenance and performance
- **Active Recovery**: 4-week rest and regeneration

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### 1. Clone Repository
```bash
git clone <repository-url>
cd flag-football-training-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create `.env.local` file:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_NAME=FlagFit Pro
VITE_APP_VERSION=2.0.0
```

### 4. Database Setup

#### Option A: Use Supabase Dashboard
1. Create new Supabase project
2. Run SQL from `database/schema_v2.sql`
3. Run SQL from `database/sample_data_v2.sql`

#### Option B: Command Line
```bash
# Connect to your Supabase database
psql "postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"

# Run schema
\i database/schema_v2.sql

# Run sample data
\i database/sample_data_v2.sql
```

### 5. Development Server
```bash
npm run dev
```

### 6. Build for Production
```bash
npm run build
npm run preview
```

## 📱 PWA Features

### Installation
- **iOS**: Add to Home Screen via Safari
- **Android**: Install via Chrome
- **Desktop**: Install via browser menu

### Offline Support
- Caches essential resources
- Works without internet connection
- Syncs when connection restored

## 🔐 Security

### Row Level Security (RLS)
- **Users**: Can only access own profile
- **Athletes**: Can view own data and public content
- **Coaches**: Can view team data and public content
- **Admins**: Full access to all data

### Data Protection
- UUID primary keys for security
- Encrypted connections (HTTPS/WSS)
- Secure authentication via Supabase Auth
- GDPR compliant data handling

## 🎯 Usage Guide

### For Athletes
1. **Complete Profile**: Fill out position, experience, goals
2. **Select Program**: Choose from available training programs
3. **Follow Schedule**: View weekly schedule and daily sessions
4. **Track Progress**: Log completed exercises and metrics
5. **Recovery**: Use recovery routines between sessions

### For Coaches
1. **Team Management**: View athlete profiles and progress
2. **Program Assignment**: Assign programs to athletes
3. **Progress Monitoring**: Track team performance metrics
4. **Customization**: Modify programs for individual needs

### For Admins
1. **User Management**: Manage all users and roles
2. **Content Management**: Update exercises and programs
3. **Analytics**: View system-wide performance data
4. **System Configuration**: Manage app settings

## 📊 API Reference

### Core Endpoints
```javascript
// Authentication
api.register(userData)
api.login(email, password)
api.logout()

// User Management
api.getAthleteProfile(athleteId)
api.updateAthleteProfile(athleteId, profileData)

// Training Programs
api.getTrainingPrograms()
api.getTrainingProgram(programId)
api.assignProgramToAthlete(programId, athleteId)

// Sessions
api.getDailySessions(weeklyTemplateId)
api.getDailySession(sessionId)
api.getSessionExercises(sessionId)

// Exercises
api.getExercises(filters)
api.getExerciseCategories()
api.getExerciseById(exerciseId)

// Progress Tracking
api.getAthleteProgress(athleteId)
api.logSessionExercise(sessionId, exerciseData)
api.submitMetrics(athleteId, metricsData)
```

## 🎨 UI Components

### Core Components
- **DailySessionView**: Display individual training sessions
- **WeeklyScheduleView**: Show weekly training schedule
- **ExerciseLibrary**: Browse and filter exercises
- **ProgressDashboard**: Track performance metrics
- **RecoveryRoutines**: Manage recovery protocols

### Design System
- **Colors**: Blue primary (#3B82F6), semantic colors
- **Typography**: Inter font family
- **Spacing**: Tailwind CSS spacing scale
- **Components**: Consistent button, card, and form styles

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
# Upload dist folder to Netlify
```

### Manual Deployment
```bash
npm run build
# Upload dist folder to your web server
```

## 🔧 Configuration

### Vite Configuration
- PWA plugin for offline support
- Tailwind CSS for styling
- Vue 3 with Composition API
- Environment variable support

### Supabase Configuration
- Real-time subscriptions
- Row Level Security policies
- Database triggers for timestamps
- Storage for media files

## 📈 Performance

### Optimization Features
- **Code Splitting**: Lazy-loaded components
- **Image Optimization**: WebP format support
- **Caching**: Service worker for offline support
- **Database Indexing**: Optimized queries
- **CDN**: Global content delivery

### Monitoring
- **Error Tracking**: Console error logging
- **Performance Metrics**: Core Web Vitals
- **User Analytics**: Usage patterns
- **Database Performance**: Query optimization

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request
5. Code review and merge

### Code Standards
- **ESLint**: JavaScript/TypeScript linting
- **Prettier**: Code formatting
- **Vue Style Guide**: Vue.js best practices
- **Accessibility**: WCAG 2.1 AA compliance

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [API Documentation](docs/api.md)
- [Database Schema](docs/schema.md)
- [Component Library](docs/components.md)
- [Deployment Guide](docs/deployment.md)

### Community
- [GitHub Issues](https://github.com/your-repo/issues)
- [Discord Community](https://discord.gg/flagfit)
- [Email Support](mailto:support@flagfit.com)

## 🔄 Changelog

### v2.0.0 (Current)
- **New**: UUID-based database schema
- **New**: Comprehensive exercise library (50+ exercises)
- **New**: Enhanced training program system
- **New**: Improved session management
- **New**: Better progress tracking
- **Improved**: Performance and security
- **Updated**: UI components and design system

### v1.0.0
- Initial release with basic functionality
- Role-based dashboards
- Basic training programs
- Exercise library
- Progress tracking

---

**FlagFit Pro** - Empowering flag football athletes with comprehensive training solutions. 