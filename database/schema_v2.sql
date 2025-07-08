-- FlagFit Pro Database Schema v2.0
-- Updated with UUID primary keys, proper enums, and improved structure

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom enums
CREATE TYPE category_type_enum AS ENUM (
    'warmup', 'strength', 'plyometric', 'speed', 'agility', 
    'skill', 'recovery', 'stretching', 'conditioning'
);

CREATE TYPE difficulty_enum AS ENUM ('beginner', 'intermediate', 'advanced');

CREATE TYPE program_type_enum AS ENUM ('offseason', 'preseason', 'inseason', 'recovery', 'custom');

CREATE TYPE day_enum AS ENUM ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');

CREATE TYPE session_type_enum AS ENUM ('strength_power', 'speed_agility', 'skills_technical', 'conditioning', 'recovery');

CREATE TYPE intensity_enum AS ENUM ('light', 'moderate', 'high', 'max');

CREATE TYPE user_role_enum AS ENUM ('athlete', 'coach', 'admin');

CREATE TYPE program_status_enum AS ENUM ('pending', 'active', 'paused', 'completed', 'cancelled');

CREATE TYPE metric_type_enum AS ENUM (
    'forty_yard_dash', 'ten_yard_split', 'twenty_yard_split',
    'vertical_jump', 'broad_jump', 'pro_agility', 't_drill',
    'body_weight', 'body_fat_percentage', 'vo2_max'
);

CREATE TYPE recovery_category_enum AS ENUM ('post_training', 'rest_day', 'pre_competition', 'injury_prevention');

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    role user_role_enum NOT NULL,
    team_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    organization TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exercise Categories
CREATE TABLE IF NOT EXISTS exercise_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    type category_type_enum NOT NULL,
    color_code VARCHAR(7) DEFAULT '#3B82F6',
    icon TEXT DEFAULT 'dumbbell',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exercises table
CREATE TABLE IF NOT EXISTS exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    category_id UUID REFERENCES exercise_categories(id),
    description TEXT,
    instructions TEXT,
    youtube_video_id VARCHAR(50),
    equipment_needed JSONB DEFAULT '[]',
    target_muscles JSONB DEFAULT '[]',
    difficulty_level difficulty_enum NOT NULL,
    position_specific JSONB DEFAULT '[]',
    duration_minutes INTEGER,
    default_sets INTEGER DEFAULT 3,
    default_reps VARCHAR(50),
    default_rest_seconds INTEGER DEFAULT 60,
    progression_notes TEXT,
    safety_notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Training Programs
CREATE TABLE IF NOT EXISTS training_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    program_type program_type_enum NOT NULL,
    duration_weeks INTEGER,
    target_level difficulty_enum NOT NULL,
    created_by UUID REFERENCES users(id),
    is_template BOOLEAN DEFAULT false,
    tags JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Weekly Templates
CREATE TABLE IF NOT EXISTS weekly_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID REFERENCES training_programs(id) ON DELETE CASCADE,
    week_number INTEGER NOT NULL,
    intensity_percentage INTEGER CHECK (intensity_percentage BETWEEN 50 AND 100),
    volume_multiplier DECIMAL(3,2) DEFAULT 1.0,
    focus_areas JSONB DEFAULT '[]',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily Sessions
CREATE TABLE IF NOT EXISTS daily_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    weekly_template_id UUID REFERENCES weekly_templates(id) ON DELETE CASCADE,
    day_of_week day_enum NOT NULL,
    session_name VARCHAR(200) NOT NULL,
    session_type session_type_enum NOT NULL,
    total_duration_minutes INTEGER,
    intensity_level intensity_enum NOT NULL,
    warmup_id UUID REFERENCES exercises(id),
    cooldown_id UUID REFERENCES exercises(id),
    recovery_protocol_id UUID,
    notes TEXT,
    is_rest_day BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Session Exercises
CREATE TABLE IF NOT EXISTS session_exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES daily_sessions(id) ON DELETE CASCADE,
    exercise_id UUID REFERENCES exercises(id),
    order_in_session INTEGER NOT NULL,
    sets INTEGER,
    reps VARCHAR(50),
    rest_seconds INTEGER,
    intensity_percentage INTEGER,
    weight_percentage DECIMAL(4,2),
    notes TEXT,
    is_optional BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Athlete Profiles
CREATE TABLE IF NOT EXISTS athlete_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    position TEXT,
    height_cm INTEGER,
    weight_kg DECIMAL(5,2),
    experience_years INTEGER DEFAULT 0,
    fitness_level difficulty_enum DEFAULT 'beginner',
    goals JSONB DEFAULT '{}',
    medical_notes TEXT,
    emergency_contact JSONB,
    injury_history JSONB DEFAULT '[]',
    gdpr_consent_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Individual athlete program assignments
CREATE TABLE IF NOT EXISTS athlete_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    athlete_id UUID REFERENCES athlete_profiles(id) ON DELETE CASCADE,
    program_id UUID REFERENCES training_programs(id),
    assigned_date DATE DEFAULT CURRENT_DATE,
    start_date DATE,
    end_date DATE,
    current_week INTEGER DEFAULT 1,
    status program_status_enum DEFAULT 'active',
    customizations JSONB DEFAULT '{}',
    assigned_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Session completion tracking
CREATE TABLE IF NOT EXISTS athlete_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    athlete_id UUID REFERENCES athlete_profiles(id),
    session_id UUID REFERENCES daily_sessions(id),
    scheduled_date DATE,
    completed_date TIMESTAMP,
    completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage BETWEEN 0 AND 100),
    rpe_score INTEGER CHECK (rpe_score BETWEEN 1 AND 10),
    duration_minutes INTEGER,
    location VARCHAR(100),
    weather_conditions VARCHAR(100),
    notes TEXT,
    satisfaction_rating INTEGER CHECK (satisfaction_rating BETWEEN 1 AND 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exercise performance logs
CREATE TABLE IF NOT EXISTS exercise_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    athlete_session_id UUID REFERENCES athlete_sessions(id) ON DELETE CASCADE,
    exercise_id UUID REFERENCES exercises(id),
    sets_completed INTEGER DEFAULT 0,
    reps_completed VARCHAR(50),
    weight_used DECIMAL(5,2),
    time_taken_seconds INTEGER,
    distance_meters DECIMAL(6,2),
    difficulty_rating INTEGER CHECK (difficulty_rating BETWEEN 1 AND 5),
    form_rating INTEGER CHECK (form_rating BETWEEN 1 AND 5),
    completed BOOLEAN DEFAULT false,
    modifications TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance metrics tracking
CREATE TABLE IF NOT EXISTS performance_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    athlete_id UUID REFERENCES athlete_profiles(id),
    metric_type metric_type_enum NOT NULL,
    value DECIMAL(8,3) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    test_date DATE DEFAULT CURRENT_DATE,
    test_conditions VARCHAR(200),
    notes TEXT,
    verified_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recovery routine templates
CREATE TABLE IF NOT EXISTS recovery_routines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    category recovery_category_enum NOT NULL,
    duration_minutes INTEGER,
    description TEXT,
    equipment_needed JSONB DEFAULT '[]',
    instructions TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recovery activities
CREATE TABLE IF NOT EXISTS recovery_exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    routine_id UUID REFERENCES recovery_routines(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    duration_minutes INTEGER,
    description TEXT,
    equipment VARCHAR(100),
    body_parts JSONB DEFAULT '[]',
    order_in_routine INTEGER,
    intensity_level intensity_enum DEFAULT 'light',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily wellness tracking
CREATE TABLE IF NOT EXISTS wellness_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    athlete_id UUID REFERENCES athlete_profiles(id),
    log_date DATE DEFAULT CURRENT_DATE,
    sleep_hours DECIMAL(3,1),
    sleep_quality INTEGER CHECK (sleep_quality BETWEEN 1 AND 10),
    energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 10),
    muscle_soreness INTEGER CHECK (muscle_soreness BETWEEN 1 AND 10),
    stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 10),
    motivation INTEGER CHECK (motivation BETWEEN 1 AND 10),
    hydration_liters DECIMAL(3,1),
    nutrition_quality INTEGER CHECK (nutrition_quality BETWEEN 1 AND 10),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Training Sessions (legacy - keeping for backward compatibility)
CREATE TABLE IF NOT EXISTS training_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    athlete_id UUID REFERENCES users(id) ON DELETE CASCADE,
    program_id UUID REFERENCES training_programs(id) ON DELETE SET NULL,
    daily_session_id UUID REFERENCES daily_sessions(id) ON DELETE SET NULL,
    session_name TEXT,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME,
    duration_minutes INTEGER,
    completed BOOLEAN DEFAULT FALSE,
    completion_time TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Training Logs (legacy - keeping for backward compatibility)
CREATE TABLE IF NOT EXISTS training_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    athlete_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id UUID REFERENCES training_sessions(id) ON DELETE SET NULL,
    exercise_id UUID REFERENCES exercises(id) ON DELETE SET NULL,
    sets_completed INTEGER,
    reps_completed INTEGER,
    duration_minutes INTEGER,
    weight_kg DECIMAL(5,2),
    distance_meters INTEGER,
    notes TEXT,
    perceived_exertion INTEGER CHECK (perceived_exertion BETWEEN 1 AND 10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recovery Logs (legacy - keeping for backward compatibility)
CREATE TABLE IF NOT EXISTS recovery_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    athlete_id UUID REFERENCES users(id) ON DELETE CASCADE,
    routine_id UUID REFERENCES recovery_routines(id) ON DELETE SET NULL,
    duration_minutes INTEGER,
    notes TEXT,
    perceived_effectiveness INTEGER CHECK (perceived_effectiveness BETWEEN 1 AND 10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Athlete Assessments
CREATE TABLE IF NOT EXISTS athlete_assessments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    athlete_id UUID REFERENCES users(id) ON DELETE CASCADE,
    assessment_type TEXT CHECK (assessment_type IN ('fitness', 'skill', 'injury', 'performance')),
    assessment_date DATE NOT NULL,
    results JSONB NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Athlete Metrics (legacy - keeping for backward compatibility)
CREATE TABLE IF NOT EXISTS athlete_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    athlete_id UUID REFERENCES users(id) ON DELETE CASCADE,
    metric_type TEXT NOT NULL,
    metric_value DECIMAL(10,2),
    metric_unit TEXT,
    recorded_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Athlete Questionnaires
CREATE TABLE IF NOT EXISTS athlete_questionnaires (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    athlete_id UUID REFERENCES users(id) ON DELETE CASCADE,
    questionnaire_type TEXT CHECK (questionnaire_type IN ('initial', 'progress', 'feedback')),
    responses JSONB NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics Events Table
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_name VARCHAR(100) NOT NULL,
    user_id VARCHAR(100) NOT NULL,
    session_id VARCHAR(100),
    test_mode VARCHAR(10),
    user_agent TEXT,
    screen_size VARCHAR(50),
    event_data JSONB NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_exercises_category ON exercises(category_id);
CREATE INDEX idx_exercises_difficulty ON exercises(difficulty_level);
CREATE INDEX idx_exercises_position ON exercises USING GIN(position_specific);
CREATE INDEX idx_exercises_active ON exercises(is_active);
CREATE INDEX idx_training_logs_athlete_date ON training_logs(athlete_id, created_at);
CREATE INDEX idx_training_sessions_athlete_date ON training_sessions(athlete_id, scheduled_date);
CREATE INDEX idx_athlete_programs_athlete ON athlete_programs(athlete_id, status);
CREATE INDEX idx_daily_sessions_weekly_template ON daily_sessions(weekly_template_id);
CREATE INDEX idx_daily_sessions_day ON daily_sessions(day_of_week);
CREATE INDEX idx_session_exercises_session ON session_exercises(session_id);
CREATE INDEX idx_session_exercises_order ON session_exercises(session_id, order_in_session);
CREATE INDEX idx_athlete_sessions_athlete_date ON athlete_sessions(athlete_id, scheduled_date);
CREATE INDEX idx_exercise_logs_session ON exercise_logs(athlete_session_id);
CREATE INDEX idx_performance_metrics_athlete_type ON performance_metrics(athlete_id, metric_type);
CREATE INDEX idx_wellness_logs_athlete_date ON wellness_logs(athlete_id, log_date);
CREATE INDEX idx_recovery_exercises_routine ON recovery_exercises(routine_id);

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE athlete_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE athlete_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE athlete_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE recovery_routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE recovery_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE recovery_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

-- Athletes can view their own profiles
CREATE POLICY "Athletes can view own profile" ON athlete_profiles
    FOR SELECT USING (auth.uid() = user_id);

-- Athletes can update their own profiles
CREATE POLICY "Athletes can update own profile" ON athlete_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Athletes can view their own programs
CREATE POLICY "Athletes can view own programs" ON athlete_programs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM athlete_profiles 
            WHERE athlete_profiles.id = athlete_programs.athlete_id 
            AND athlete_profiles.user_id = auth.uid()
        )
    );

-- Athletes can view their own sessions
CREATE POLICY "Athletes can view own sessions" ON athlete_sessions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM athlete_profiles 
            WHERE athlete_profiles.id = athlete_sessions.athlete_id 
            AND athlete_profiles.user_id = auth.uid()
        )
    );

-- Athletes can insert their own sessions
CREATE POLICY "Athletes can insert own sessions" ON athlete_sessions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM athlete_profiles 
            WHERE athlete_profiles.id = athlete_sessions.athlete_id 
            AND athlete_profiles.user_id = auth.uid()
        )
    );

-- Athletes can view their own exercise logs
CREATE POLICY "Athletes can view own exercise logs" ON exercise_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM athlete_sessions 
            JOIN athlete_profiles ON athlete_profiles.id = athlete_sessions.athlete_id
            WHERE athlete_sessions.id = exercise_logs.athlete_session_id 
            AND athlete_profiles.user_id = auth.uid()
        )
    );

-- Athletes can insert their own exercise logs
CREATE POLICY "Athletes can insert own exercise logs" ON exercise_logs
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM athlete_sessions 
            JOIN athlete_profiles ON athlete_profiles.id = athlete_sessions.athlete_id
            WHERE athlete_sessions.id = exercise_logs.athlete_session_id 
            AND athlete_profiles.user_id = auth.uid()
        )
    );

-- Athletes can view their own performance metrics
CREATE POLICY "Athletes can view own performance metrics" ON performance_metrics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM athlete_profiles 
            WHERE athlete_profiles.id = performance_metrics.athlete_id 
            AND athlete_profiles.user_id = auth.uid()
        )
    );

-- Athletes can insert their own performance metrics
CREATE POLICY "Athletes can insert own performance metrics" ON performance_metrics
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM athlete_profiles 
            WHERE athlete_profiles.id = performance_metrics.athlete_id 
            AND athlete_profiles.user_id = auth.uid()
        )
    );

-- Athletes can view their own wellness logs
CREATE POLICY "Athletes can view own wellness logs" ON wellness_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM athlete_profiles 
            WHERE athlete_profiles.id = wellness_logs.athlete_id 
            AND athlete_profiles.user_id = auth.uid()
        )
    );

-- Athletes can insert their own wellness logs
CREATE POLICY "Athletes can insert own wellness logs" ON wellness_logs
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM athlete_profiles 
            WHERE athlete_profiles.id = wellness_logs.athlete_id 
            AND athlete_profiles.user_id = auth.uid()
        )
    );

-- Coaches can view team data
CREATE POLICY "Coaches can view team data" ON athlete_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'coach' 
            AND users.team_id = athlete_profiles.team_id
        )
    );

-- Everyone can view exercises (public data)
CREATE POLICY "Everyone can view exercises" ON exercises
    FOR SELECT USING (is_active = true);

-- Everyone can view exercise categories (public data)
CREATE POLICY "Everyone can view exercise categories" ON exercise_categories
    FOR SELECT USING (true);

-- Everyone can view training programs (public data)
CREATE POLICY "Everyone can view training programs" ON training_programs
    FOR SELECT USING (true);

-- Everyone can view weekly templates (public data)
CREATE POLICY "Everyone can view weekly templates" ON weekly_templates
    FOR SELECT USING (true);

-- Everyone can view daily sessions (public data)
CREATE POLICY "Everyone can view daily sessions" ON daily_sessions
    FOR SELECT USING (true);

-- Everyone can view session exercises (public data)
CREATE POLICY "Everyone can view session exercises" ON session_exercises
    FOR SELECT USING (true);

-- Everyone can view recovery routines (public data)
CREATE POLICY "Everyone can view recovery routines" ON recovery_routines
    FOR SELECT USING (true);

-- Everyone can view recovery exercises (public data)
CREATE POLICY "Everyone can view recovery exercises" ON recovery_exercises
    FOR SELECT USING (true);

-- Analytics events policies
CREATE POLICY "Users can insert their own analytics events" ON analytics_events
    FOR INSERT WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Admins can view all analytics events" ON analytics_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exercises_updated_at BEFORE UPDATE ON exercises
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_training_programs_updated_at BEFORE UPDATE ON training_programs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_athlete_profiles_updated_at BEFORE UPDATE ON athlete_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_athlete_programs_updated_at BEFORE UPDATE ON athlete_programs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_training_sessions_updated_at BEFORE UPDATE ON training_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 