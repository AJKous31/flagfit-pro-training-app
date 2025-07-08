-- Database Fixes and Migrations
-- Run this after the main schema to fix inconsistencies

-- 1. Add missing custom_exercises table
CREATE TABLE IF NOT EXISTS custom_exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    category_id UUID REFERENCES exercise_categories(id),
    description TEXT,
    instructions TEXT,
    equipment_needed JSONB DEFAULT '[]',
    target_muscles JSONB DEFAULT '[]',
    difficulty_level difficulty_enum NOT NULL,
    position_specific JSONB DEFAULT '[]',
    duration_minutes INTEGER,
    default_sets INTEGER DEFAULT 3,
    default_reps VARCHAR(50),
    default_rest_seconds INTEGER DEFAULT 60,
    created_by UUID REFERENCES users(id),
    team_id UUID REFERENCES teams(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Add missing RLS policies for coaches and admins
-- Coaches can manage their team's programs
CREATE POLICY "Coaches can manage team programs" ON training_programs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'coach' 
            AND users.team_id = training_programs.team_id
        )
    );

-- Coaches can view team athlete sessions
CREATE POLICY "Coaches can view team sessions" ON athlete_sessions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM athlete_profiles 
            JOIN users ON users.id = auth.uid() 
            WHERE athlete_profiles.id = athlete_sessions.athlete_id 
            AND users.role = 'coach' 
            AND users.team_id = athlete_profiles.team_id
        )
    );

-- Coaches can view team exercise logs
CREATE POLICY "Coaches can view team exercise logs" ON exercise_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM athlete_sessions 
            JOIN athlete_profiles ON athlete_profiles.id = athlete_sessions.athlete_id
            JOIN users ON users.id = auth.uid() 
            WHERE athlete_sessions.id = exercise_logs.athlete_session_id 
            AND users.role = 'coach' 
            AND users.team_id = athlete_profiles.team_id
        )
    );

-- Coaches can view team performance metrics
CREATE POLICY "Coaches can view team performance metrics" ON performance_metrics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM athlete_profiles 
            JOIN users ON users.id = auth.uid() 
            WHERE athlete_profiles.id = performance_metrics.athlete_id 
            AND users.role = 'coach' 
            AND users.team_id = athlete_profiles.team_id
        )
    );

-- Coaches can view team wellness logs
CREATE POLICY "Coaches can view team wellness logs" ON wellness_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM athlete_profiles 
            JOIN users ON users.id = auth.uid() 
            WHERE athlete_profiles.id = wellness_logs.athlete_id 
            AND users.role = 'coach' 
            AND users.team_id = athlete_profiles.team_id
        )
    );

-- Admins can view all data
CREATE POLICY "Admins can view all data" ON users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Admins can view all athlete profiles" ON athlete_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Admins can view all teams" ON teams
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- 3. Add missing indexes for performance
CREATE INDEX IF NOT EXISTS idx_custom_exercises_team ON custom_exercises(team_id);
CREATE INDEX IF NOT EXISTS idx_custom_exercises_created_by ON custom_exercises(created_by);
CREATE INDEX IF NOT EXISTS idx_users_team ON users(team_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_athlete_profiles_team ON athlete_profiles(team_id);

-- 4. Add missing foreign key constraints
ALTER TABLE users ADD CONSTRAINT IF NOT EXISTS fk_users_team 
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL;

-- 5. Add missing columns to existing tables
ALTER TABLE training_programs ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES teams(id);
ALTER TABLE training_programs ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;

-- 6. Create view for easier team analytics
CREATE OR REPLACE VIEW team_analytics AS
SELECT 
    t.id as team_id,
    t.name as team_name,
    COUNT(DISTINCT ap.id) as athlete_count,
    COUNT(DISTINCT ap.id) FILTER (WHERE ap.fitness_level = 'beginner') as beginner_count,
    COUNT(DISTINCT ap.id) FILTER (WHERE ap.fitness_level = 'intermediate') as intermediate_count,
    COUNT(DISTINCT ap.id) FILTER (WHERE ap.fitness_level = 'advanced') as advanced_count,
    AVG(wl.energy_level) as avg_energy_level,
    AVG(wl.sleep_quality) as avg_sleep_quality,
    COUNT(DISTINCT as.id) FILTER (WHERE as.completed_date::date = CURRENT_DATE) as sessions_today,
    COUNT(DISTINCT as.id) FILTER (WHERE as.completed_date >= CURRENT_DATE - INTERVAL '7 days') as sessions_this_week
FROM teams t
LEFT JOIN athlete_profiles ap ON ap.team_id = t.id
LEFT JOIN wellness_logs wl ON wl.athlete_id = ap.id AND wl.log_date = CURRENT_DATE
LEFT JOIN athlete_sessions as ON as.athlete_id = ap.id
GROUP BY t.id, t.name;

-- 7. Add triggers for updated_at timestamps
CREATE TRIGGER update_custom_exercises_updated_at BEFORE UPDATE ON custom_exercises
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. Add function to calculate workout completion rate
CREATE OR REPLACE FUNCTION calculate_workout_completion_rate(athlete_id UUID, start_date DATE, end_date DATE)
RETURNS DECIMAL AS $$
DECLARE
    total_sessions INTEGER;
    completed_sessions INTEGER;
BEGIN
    SELECT COUNT(*), COUNT(*) FILTER (WHERE completed_date IS NOT NULL)
    INTO total_sessions, completed_sessions
    FROM athlete_sessions
    WHERE athlete_sessions.athlete_id = $1
    AND scheduled_date BETWEEN $2 AND $3;
    
    IF total_sessions = 0 THEN
        RETURN 0;
    END IF;
    
    RETURN ROUND((completed_sessions::DECIMAL / total_sessions) * 100, 2);
END;
$$ LANGUAGE plpgsql;

-- 9. Add function to get athlete streak
CREATE OR REPLACE FUNCTION get_athlete_streak(athlete_id UUID)
RETURNS INTEGER AS $$
DECLARE
    current_streak INTEGER := 0;
    check_date DATE := CURRENT_DATE;
BEGIN
    WHILE EXISTS (
        SELECT 1 FROM athlete_sessions 
        WHERE athlete_sessions.athlete_id = $1 
        AND completed_date::date = check_date
    ) LOOP
        current_streak := current_streak + 1;
        check_date := check_date - INTERVAL '1 day';
    END LOOP;
    
    RETURN current_streak;
END;
$$ LANGUAGE plpgsql;

-- 10. Grant necessary permissions
GRANT SELECT ON team_analytics TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_workout_completion_rate(UUID, DATE, DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION get_athlete_streak(UUID) TO authenticated; 