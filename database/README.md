# Database Setup Guide

This guide will help you set up the Supabase database for FlagFit Pro.

## 🗄️ Database Overview

The FlagFit Pro database uses PostgreSQL with the following key features:
- **Row Level Security (RLS)** for data protection
- **Real-time subscriptions** for live updates
- **JSONB columns** for flexible data storage
- **Foreign key relationships** for data integrity
- **Indexes** for optimal query performance

## 🚀 Quick Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `flagfit-pro`
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
6. Click "Create new project"

### 2. Get Your Credentials

1. Go to **Settings** → **API**
2. Copy your **Project URL** and **anon public** key
3. Add them to your `.env` file:
   ```env
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

### 3. Apply Database Schema

1. Go to **SQL Editor** in your Supabase dashboard
2. Create a new query
3. Copy the entire contents of `database/schema.sql`
4. Paste and run the query

This will create:
- ✅ All database tables
- ✅ Row Level Security policies
- ✅ Sample data (exercises, programs, etc.)
- ✅ Indexes for performance
- ✅ Triggers for timestamps

## 📊 Database Schema

### Core Tables

#### `users`
- Extends Supabase auth.users
- Stores user profile information
- Role-based access (athlete, coach, admin)

#### `teams`
- Team and organization data
- Supports multi-team organizations

#### `exercises`
- Complete exercise library
- Categorized by type and difficulty
- Position-specific filtering
- Equipment requirements

#### `training_programs`
- Program templates and configurations
- Weekly progression templates
- Difficulty and duration settings

#### `athlete_profiles`
- Detailed athlete information
- Physical metrics and goals
- Medical notes and emergency contacts

#### `training_sessions`
- Individual training sessions
- Scheduling and completion tracking
- Exercise assignments

#### `training_logs`
- Performance tracking data
- Sets, reps, weights, durations
- Perceived exertion ratings

#### `recovery_routines`
- Recovery and regeneration protocols
- Equipment-based routines
- Duration and effectiveness tracking

### Relationships

```
users (1) ←→ (1) athlete_profiles
teams (1) ←→ (many) athlete_profiles
exercises (many) ←→ (many) training_sessions
training_programs (1) ←→ (many) athlete_programs
athlete_profiles (1) ←→ (many) training_logs
```

## 🔐 Security Configuration

### Row Level Security (RLS)

The database uses RLS policies to ensure data security:

- **Users can only access their own data**
- **Coaches can view their team's data**
- **Admins have full access**
- **Public data (exercises, programs) is readable by all**

### Authentication

- **Supabase Auth** handles user authentication
- **Social login** support (Google, GitHub, etc.)
- **Email/password** authentication
- **Magic link** authentication

## 📈 Performance Optimization

### Indexes

The schema includes strategic indexes for common queries:

```sql
-- Exercise filtering
CREATE INDEX idx_exercises_category ON exercises(category_id);
CREATE INDEX idx_exercises_difficulty ON exercises(difficulty_level);
CREATE INDEX idx_exercises_position ON exercises USING GIN(position_specific);

-- Performance tracking
CREATE INDEX idx_training_logs_athlete_date ON training_logs(athlete_id, created_at);
CREATE INDEX idx_training_sessions_athlete_date ON training_sessions(athlete_id, scheduled_date);

-- Program management
CREATE INDEX idx_athlete_programs_athlete ON athlete_programs(athlete_id, status);
```

### Query Optimization

- **JSONB columns** for flexible data storage
- **Composite indexes** for multi-column queries
- **Partial indexes** for filtered queries
- **Covering indexes** for common SELECT patterns

## 🔄 Data Management

### Sample Data

The schema includes comprehensive sample data:

- **100+ exercises** across all categories
- **4 training programs** with weekly templates
- **4 recovery routines** with detailed exercises
- **Exercise categories** with proper organization

### Data Migration

For production deployments:

1. **Backup existing data** (if any)
2. **Run schema migrations** in order
3. **Verify data integrity** with foreign key checks
4. **Test RLS policies** with different user roles

## 🛠️ Database Functions

### Utility Functions

```sql
-- Update timestamps automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';
```

### Triggers

Automatic timestamp updates on key tables:
- `users`
- `exercises`
- `training_programs`
- `athlete_profiles`
- `athlete_programs`
- `training_sessions`

## 📊 Monitoring & Analytics

### Supabase Dashboard

Monitor your database through:
- **Table Editor** - View and edit data
- **SQL Editor** - Run custom queries
- **Logs** - Monitor API requests
- **Metrics** - Performance analytics

### Common Queries

```sql
-- Get athlete progress
SELECT 
  tl.*,
  e.name as exercise_name,
  e.category_id
FROM training_logs tl
JOIN exercises e ON tl.exercise_id = e.id
WHERE tl.athlete_id = 'user-uuid'
ORDER BY tl.created_at DESC;

-- Get team analytics
SELECT 
  ap.position,
  COUNT(*) as athlete_count,
  AVG(ap.experience_years) as avg_experience
FROM athlete_profiles ap
WHERE ap.team_id = 'team-uuid'
GROUP BY ap.position;

-- Get exercise recommendations
SELECT 
  e.*,
  ec.name as category_name
FROM exercises e
JOIN exercise_categories ec ON e.category_id = ec.id
WHERE e.difficulty_level = 'beginner'
  AND e.position_specific @> '["QB"]'
ORDER BY e.name;
```

## 🔧 Troubleshooting

### Common Issues

1. **RLS Policy Errors**
   - Check user authentication
   - Verify policy conditions
   - Test with different user roles

2. **Foreign Key Violations**
   - Ensure referenced data exists
   - Check cascade delete settings
   - Verify data types match

3. **Performance Issues**
   - Check query execution plans
   - Verify indexes are being used
   - Monitor slow query logs

### Support

- **Supabase Documentation**: [docs.supabase.com](https://docs.supabase.com)
- **PostgreSQL Documentation**: [postgresql.org/docs](https://www.postgresql.org/docs)
- **GitHub Issues**: Report bugs and feature requests

## 🚀 Next Steps

After setting up the database:

1. **Test the API** with the provided service layer
2. **Configure authentication** in your app
3. **Set up real-time subscriptions** for live updates
4. **Deploy to production** with proper environment variables
5. **Monitor performance** and optimize as needed

---

**Need help?** Check the main README or create an issue on GitHub. 