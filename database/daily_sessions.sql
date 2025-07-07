-- Daily Sessions for FlagFit Pro Training Programs
-- Complete weekly templates with structured daily sessions

-- First, let's create the daily_sessions table if it doesn't exist
CREATE TABLE IF NOT EXISTS daily_sessions (
    id SERIAL PRIMARY KEY,
    weekly_template_id INTEGER REFERENCES weekly_templates(id) ON DELETE CASCADE,
    day_of_week TEXT CHECK (day_of_week IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')),
    session_name TEXT NOT NULL,
    total_duration_minutes INTEGER NOT NULL,
    intensity_level TEXT CHECK (intensity_level IN ('low', 'moderate', 'high', 'very_high')),
    session_type TEXT CHECK (session_type IN ('warmup', 'strength_power', 'speed_agility', 'skills_technical', 'conditioning', 'recovery', 'prevention')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Offseason Foundation Week 1 Template
-- Monday: Speed & Agility + Prevention
INSERT INTO daily_sessions (weekly_template_id, day_of_week, session_name, total_duration_minutes, intensity_level, session_type, notes) VALUES
(1, 'monday', 'Speed Development & Agility Training', 120, 'high', 'speed_agility', 'Focus on acceleration and change of direction');

-- Tuesday: Strength Training
INSERT INTO daily_sessions (weekly_template_id, day_of_week, session_name, total_duration_minutes, intensity_level, session_type) VALUES
(1, 'tuesday', 'Functional Strength Development', 90, 'moderate', 'strength_power');

-- Wednesday: Skills & Recovery
INSERT INTO daily_sessions (weekly_template_id, day_of_week, session_name, total_duration_minutes, intensity_level, session_type) VALUES
(1, 'wednesday', 'Position Skills & Recovery', 75, 'moderate', 'skills_technical');

-- Thursday: Conditioning & Prevention
INSERT INTO daily_sessions (weekly_template_id, day_of_week, session_name, total_duration_minutes, intensity_level, session_type) VALUES
(1, 'thursday', 'Cardiovascular Conditioning', 90, 'moderate', 'conditioning');

-- Friday: Strength & Power
INSERT INTO daily_sessions (weekly_template_id, day_of_week, session_name, total_duration_minutes, intensity_level, session_type) VALUES
(1, 'friday', 'Power Development & Plyometrics', 105, 'high', 'strength_power');

-- Saturday: Skills & Technical
INSERT INTO daily_sessions (weekly_template_id, day_of_week, session_name, total_duration_minutes, intensity_level, session_type) VALUES
(1, 'saturday', 'Position-Specific Skills', 90, 'moderate', 'skills_technical');

-- Sunday: Active Recovery
INSERT INTO daily_sessions (weekly_template_id, day_of_week, session_name, total_duration_minutes, intensity_level, session_type) VALUES
(1, 'sunday', 'Active Recovery & Mobility', 60, 'low', 'recovery');

-- Preseason Preparation Week 1 Template
-- Monday: High-Intensity Speed Work
INSERT INTO daily_sessions (weekly_template_id, day_of_week, session_name, total_duration_minutes, intensity_level, session_type, notes) VALUES
(9, 'monday', 'Maximum Speed & Acceleration', 105, 'very_high', 'speed_agility', 'Focus on top-end speed and explosive starts');

-- Tuesday: Strength & Power
INSERT INTO daily_sessions (weekly_template_id, day_of_week, session_name, total_duration_minutes, intensity_level, session_type) VALUES
(9, 'tuesday', 'Maximal Strength Training', 90, 'high', 'strength_power');

-- Wednesday: Skills & Recovery
INSERT INTO daily_sessions (weekly_template_id, day_of_week, session_name, total_duration_minutes, intensity_level, session_type) VALUES
(9, 'wednesday', 'Advanced Skills & Light Recovery', 75, 'moderate', 'skills_technical');

-- Thursday: Conditioning & Agility
INSERT INTO daily_sessions (weekly_template_id, day_of_week, session_name, total_duration_minutes, intensity_level, session_type) VALUES
(9, 'thursday', 'High-Intensity Conditioning', 90, 'high', 'conditioning');

-- Friday: Power & Plyometrics
INSERT INTO daily_sessions (weekly_template_id, day_of_week, session_name, total_duration_minutes, intensity_level, session_type) VALUES
(9, 'friday', 'Explosive Power Development', 90, 'very_high', 'strength_power');

-- Saturday: Competition Prep
INSERT INTO daily_sessions (weekly_template_id, day_of_week, session_name, total_duration_minutes, intensity_level, session_type) VALUES
(9, 'saturday', 'Competition Simulation', 120, 'high', 'skills_technical');

-- Sunday: Recovery & Maintenance
INSERT INTO daily_sessions (weekly_template_id, day_of_week, session_name, total_duration_minutes, intensity_level, session_type) VALUES
(9, 'sunday', 'Recovery & Mobility Maintenance', 45, 'low', 'recovery');

-- Competition Season Week 1 Template
-- Monday: Maintenance Speed
INSERT INTO daily_sessions (weekly_template_id, day_of_week, session_name, total_duration_minutes, intensity_level, session_type, notes) VALUES
(17, 'monday', 'Speed Maintenance & Agility', 75, 'moderate', 'speed_agility', 'Maintain speed while reducing volume');

-- Tuesday: Light Strength
INSERT INTO daily_sessions (weekly_template_id, day_of_week, session_name, total_duration_minutes, intensity_level, session_type) VALUES
(17, 'tuesday', 'Maintenance Strength', 60, 'low', 'strength_power');

-- Wednesday: Skills Focus
INSERT INTO daily_sessions (weekly_template_id, day_of_week, session_name, total_duration_minutes, intensity_level, session_type) VALUES
(17, 'wednesday', 'Technical Skills Refinement', 60, 'moderate', 'skills_technical');

-- Thursday: Light Conditioning
INSERT INTO daily_sessions (weekly_template_id, day_of_week, session_name, total_duration_minutes, intensity_level, session_type) VALUES
(17, 'thursday', 'Light Cardiovascular Work', 45, 'low', 'conditioning');

-- Friday: Recovery & Prep
INSERT INTO daily_sessions (weekly_template_id, day_of_week, session_name, total_duration_minutes, intensity_level, session_type) VALUES
(17, 'friday', 'Pre-Competition Recovery', 30, 'low', 'recovery');

-- Saturday: Competition Day
INSERT INTO daily_sessions (weekly_template_id, day_of_week, session_name, total_duration_minutes, intensity_level, session_type) VALUES
(17, 'saturday', 'Competition Day', 180, 'very_high', 'skills_technical');

-- Sunday: Post-Competition Recovery
INSERT INTO daily_sessions (weekly_template_id, day_of_week, session_name, total_duration_minutes, intensity_level, session_type) VALUES
(17, 'sunday', 'Post-Competition Recovery', 90, 'low', 'recovery');

-- Active Recovery Week 1 Template
-- Monday: Light Movement
INSERT INTO daily_sessions (weekly_template_id, day_of_week, session_name, total_duration_minutes, intensity_level, session_type, notes) VALUES
(29, 'monday', 'Light Movement & Mobility', 45, 'low', 'recovery', 'Gentle movement to promote blood flow');

-- Tuesday: Walking & Stretching
INSERT INTO daily_sessions (weekly_template_id, day_of_week, session_name, total_duration_minutes, intensity_level, session_type) VALUES
(29, 'tuesday', 'Walking & Dynamic Stretching', 30, 'low', 'recovery');

-- Wednesday: Yoga or Pilates
INSERT INTO daily_sessions (weekly_template_id, day_of_week, session_name, total_duration_minutes, intensity_level, session_type) VALUES
(29, 'wednesday', 'Yoga or Pilates Session', 60, 'low', 'recovery');

-- Thursday: Light Swimming
INSERT INTO daily_sessions (weekly_template_id, day_of_week, session_name, total_duration_minutes, intensity_level, session_type) VALUES
(29, 'thursday', 'Light Swimming or Cycling', 45, 'low', 'conditioning');

-- Friday: Mobility Work
INSERT INTO daily_sessions (weekly_template_id, day_of_week, session_name, total_duration_minutes, intensity_level, session_type) VALUES
(29, 'friday', 'Mobility & Flexibility', 30, 'low', 'recovery');

-- Saturday: Light Skills
INSERT INTO daily_sessions (weekly_template_id, day_of_week, session_name, total_duration_minutes, intensity_level, session_type) VALUES
(29, 'saturday', 'Light Skills Practice', 45, 'low', 'skills_technical');

-- Sunday: Complete Rest
INSERT INTO daily_sessions (weekly_template_id, day_of_week, session_name, total_duration_minutes, intensity_level, session_type) VALUES
(29, 'sunday', 'Complete Rest Day', 0, 'low', 'recovery');

-- Now let's create the session_exercises table with enhanced structure
CREATE TABLE IF NOT EXISTS session_exercises (
    id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES daily_sessions(id) ON DELETE CASCADE,
    exercise_id INTEGER REFERENCES exercises(id) ON DELETE CASCADE,
    order_in_session INTEGER DEFAULT 0,
    sets INTEGER,
    reps TEXT, -- Can be "3x10", "30 minutes", "5 attempts", etc.
    rest_seconds INTEGER DEFAULT 60,
    intensity_percentage INTEGER CHECK (intensity_percentage BETWEEN 0 AND 100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Offseason Foundation Week 1 - Monday Session Exercises
INSERT INTO session_exercises (session_id, exercise_id, order_in_session, sets, reps, rest_seconds, intensity_percentage, notes) VALUES
-- Warm-up (30 minutes)
(1, 1, 1, 1, '30 minutes', 0, 70, 'Comprehensive warm-up routine'),
-- Speed Development
(1, 45, 2, 6, '10 yards', 120, 95, 'Maximum effort sprints'),
(1, 46, 3, 5, '20 yards', 180, 90, 'Focus on drive phase'),
-- Agility Training
(1, 47, 4, 4, '1 attempt', 180, 90, 'Pro agility drill'),
(1, 48, 5, 3, '1 attempt', 240, 85, 'T-drill'),
-- Plyometric Power
(1, 23, 6, 3, '5 jumps', 120, 85, 'Box jumps for power'),
(1, 24, 7, 3, '3 jumps', 120, 85, 'Broad jumps'),
-- Reactive Training
(1, 55, 8, 4, '30 seconds', 90, 80, 'Mirror drill'),
(1, 56, 9, 3, '20 attempts', 60, 75, 'Reaction ball'),
-- Recovery
(1, 33, 10, 1, '15 minutes', 0, 60, 'Foam rolling session');

-- Offseason Foundation Week 1 - Tuesday Session Exercises
INSERT INTO session_exercises (session_id, exercise_id, order_in_session, sets, reps, rest_seconds, intensity_percentage, notes) VALUES
-- Warm-up
(2, 1, 1, 1, '15 minutes', 0, 70, 'Dynamic warm-up'),
-- Upper Body Strength
(2, 15, 2, 3, '8-12', 90, 80, 'Push-up progression'),
(2, 16, 3, 3, '6-12', 90, 75, 'Pike push-ups'),
(2, 19, 4, 3, '6-15', 90, 80, 'Inverted rows'),
-- Lower Body Strength
(2, 20, 5, 3, '10-20', 120, 75, 'Bodyweight squats'),
(2, 22, 6, 3, '8-12 each', 120, 80, 'Bulgarian split squats'),
(2, 24, 7, 3, '6-10', 120, 85, 'Jump squats'),
-- Core Strength
(2, 25, 8, 3, '30-60 seconds', 60, 70, 'Plank progressions'),
(2, 26, 9, 3, '8-12 each', 60, 70, 'Dead bug'),
-- Cool-down
(2, 33, 10, 1, '10 minutes', 0, 60, 'Static stretching');

-- Offseason Foundation Week 1 - Wednesday Session Exercises
INSERT INTO session_exercises (session_id, exercise_id, order_in_session, sets, reps, rest_seconds, intensity_percentage, notes) VALUES
-- Light Warm-up
(3, 1, 1, 1, '10 minutes', 0, 60, 'Light warm-up'),
-- Position-Specific Skills (QB Focus)
(3, 2, 2, 3, '10 minutes', 120, 75, '3-step drop mechanics'),
(3, 4, 3, 3, '20 throws', 90, 80, 'Throwing accuracy'),
(3, 5, 4, 2, '15 minutes', 120, 75, 'Throwing on the run'),
-- Recovery Techniques
(3, 33, 5, 1, '20 minutes', 0, 60, 'Foam rolling'),
(3, 34, 6, 1, '10 minutes', 0, 60, 'Massage gun therapy'),
(3, 35, 7, 1, '15 minutes', 0, 60, 'Static stretching');

-- Offseason Foundation Week 1 - Thursday Session Exercises
INSERT INTO session_exercises (session_id, exercise_id, order_in_session, sets, reps, rest_seconds, intensity_percentage, notes) VALUES
-- Warm-up
(4, 1, 1, 1, '15 minutes', 0, 70, 'Cardio warm-up'),
-- Hill Training
(4, 40, 2, 6, '20m', 180, 95, 'Short hill sprints'),
(4, 41, 3, 4, '40m', 240, 90, 'Medium hill sprints'),
-- Agility Work
(4, 49, 4, 3, '1 attempt', 180, 85, 'L-drill'),
(4, 50, 5, 4, '1 round', 120, 80, 'Box drill'),
-- Conditioning
(4, 51, 6, 4, '30 seconds', 90, 85, 'Mirror drill'),
(4, 52, 7, 3, '20 attempts', 60, 75, 'Reaction ball'),
-- Cool-down
(4, 33, 8, 1, '15 minutes', 0, 60, 'Recovery work');

-- Offseason Foundation Week 1 - Friday Session Exercises
INSERT INTO session_exercises (session_id, exercise_id, order_in_session, sets, reps, rest_seconds, intensity_percentage, notes) VALUES
-- Warm-up
(5, 1, 1, 1, '15 minutes', 0, 70, 'Dynamic warm-up'),
-- Plyometric Power
(5, 23, 2, 3, '5-8', 180, 90, 'Box jumps'),
(5, 24, 3, 3, '3-5', 180, 90, 'Broad jumps'),
(5, 25, 4, 3, '6-8 each', 180, 85, 'Single-leg bounds'),
-- Advanced Strength
(5, 17, 5, 3, '30-60 seconds', 120, 80, 'Handstand progression'),
(5, 18, 6, 3, '3-12', 120, 85, 'Pull-up progression'),
(5, 21, 7, 3, '3-8 each', 180, 85, 'Single-leg squat progression'),
-- Core Power
(5, 27, 8, 3, '20 steps', 90, 80, 'Bear crawl'),
(5, 28, 9, 3, '20-45 seconds', 90, 75, 'Hollow body hold'),
-- Cool-down
(5, 33, 10, 1, '15 minutes', 0, 60, 'Recovery work');

-- Offseason Foundation Week 1 - Saturday Session Exercises
INSERT INTO session_exercises (session_id, exercise_id, order_in_session, sets, reps, rest_seconds, intensity_percentage, notes) VALUES
-- Light Warm-up
(6, 1, 1, 1, '10 minutes', 0, 60, 'Light warm-up'),
-- Position Skills (WR Focus)
(6, 8, 2, 3, '15 minutes', 120, 75, 'Route tree mastery'),
(6, 9, 3, 3, '10 minutes', 90, 80, 'Release techniques'),
(6, 10, 4, 3, '15 minutes', 120, 75, 'Catching progression'),
-- Technical Work
(6, 11, 5, 2, '10 minutes', 90, 70, 'Separation techniques'),
(6, 12, 6, 2, '10 minutes', 90, 75, 'YAC drills'),
-- Recovery
(6, 33, 7, 1, '20 minutes', 0, 60, 'Foam rolling'),
(6, 35, 8, 1, '15 minutes', 0, 60, 'Static stretching');

-- Offseason Foundation Week 1 - Sunday Session Exercises
INSERT INTO session_exercises (session_id, exercise_id, order_in_session, sets, reps, rest_seconds, intensity_percentage, notes) VALUES
-- Active Recovery
(7, 33, 1, 1, '20 minutes', 0, 50, 'Full body foam rolling'),
(7, 34, 2, 1, '15 minutes', 0, 50, 'Massage gun therapy'),
(7, 35, 3, 1, '20 minutes', 0, 50, 'Static stretching'),
(7, 36, 4, 1, '10 minutes', 0, 50, 'Mobility work'),
-- Light Movement
(7, 37, 5, 1, '15 minutes', 0, 40, 'Light walking or cycling');

-- Preseason Preparation Week 1 - Monday Session Exercises
INSERT INTO session_exercises (session_id, exercise_id, order_in_session, sets, reps, rest_seconds, intensity_percentage, notes) VALUES
-- Warm-up
(8, 1, 1, 1, '20 minutes', 0, 75, 'Comprehensive warm-up'),
-- Maximum Speed
(8, 47, 2, 3, '1 attempt', 300, 100, 'Pro agility - maximum effort'),
(8, 48, 3, 3, '1 attempt', 300, 100, 'T-drill - maximum effort'),
-- Flying Sprints
(8, 49, 4, 4, '30 yards', 240, 95, 'Flying 30s'),
(8, 50, 5, 3, '1 round', 180, 90, 'Box drill'),
-- Reactive Training
(8, 55, 6, 4, '45 seconds', 120, 85, 'Mirror drill'),
(8, 56, 7, 3, '25 attempts', 90, 80, 'Reaction ball'),
-- Recovery
(8, 33, 8, 1, '20 minutes', 0, 60, 'Recovery work');

-- Preseason Preparation Week 1 - Tuesday Session Exercises
INSERT INTO session_exercises (session_id, exercise_id, order_in_session, sets, reps, rest_seconds, intensity_percentage, notes) VALUES
-- Warm-up
(9, 1, 1, 1, '15 minutes', 0, 70, 'Dynamic warm-up'),
-- Maximal Strength
(9, 15, 2, 4, '5-8', 180, 90, 'Push-up progression - heavy'),
(9, 18, 3, 4, '3-6', 180, 95, 'Pull-up progression - heavy'),
(9, 20, 4, 4, '8-12', 180, 85, 'Bodyweight squats - heavy'),
-- Power Development
(9, 23, 5, 4, '3-5', 180, 95, 'Box jumps - maximum height'),
(9, 24, 6, 4, '2-3', 180, 95, 'Broad jumps - maximum distance'),
-- Core Strength
(9, 25, 7, 3, '45-90 seconds', 90, 80, 'Plank progressions'),
(9, 28, 8, 3, '30-60 seconds', 90, 80, 'Hollow body hold'),
-- Cool-down
(9, 33, 9, 1, '15 minutes', 0, 60, 'Recovery work');

-- Competition Season Week 1 - Monday Session Exercises
INSERT INTO session_exercises (session_id, exercise_id, order_in_session, sets, reps, rest_seconds, intensity_percentage, notes) VALUES
-- Light Warm-up
(15, 1, 1, 1, '10 minutes', 0, 60, 'Light warm-up'),
-- Maintenance Speed
(15, 45, 2, 3, '10 yards', 180, 80, 'Light sprints'),
(15, 46, 3, 2, '20 yards', 240, 75, 'Light acceleration'),
-- Light Agility
(15, 47, 4, 2, '1 attempt', 300, 70, 'Pro agility - light'),
(15, 50, 5, 2, '1 round', 180, 65, 'Box drill - light'),
-- Recovery
(15, 33, 6, 1, '20 minutes', 0, 50, 'Recovery work');

-- Competition Season Week 1 - Tuesday Session Exercises
INSERT INTO session_exercises (session_id, exercise_id, order_in_session, sets, reps, rest_seconds, intensity_percentage, notes) VALUES
-- Light Warm-up
(16, 1, 1, 1, '10 minutes', 0, 60, 'Light warm-up'),
-- Maintenance Strength
(16, 15, 2, 2, '8-10', 120, 70, 'Light push-ups'),
(16, 20, 3, 2, '8-10', 120, 70, 'Light squats'),
(16, 25, 4, 2, '30 seconds', 60, 65, 'Light planks'),
-- Recovery
(16, 33, 5, 1, '15 minutes', 0, 50, 'Recovery work');

-- Active Recovery Week 1 - Monday Session Exercises
INSERT INTO session_exercises (session_id, exercise_id, order_in_session, sets, reps, rest_seconds, intensity_percentage, notes) VALUES
-- Light Movement
(22, 33, 1, 1, '20 minutes', 0, 40, 'Gentle foam rolling'),
(22, 35, 2, 1, '15 minutes', 0, 40, 'Light stretching'),
(22, 36, 3, 1, '10 minutes', 0, 40, 'Mobility work');

-- Active Recovery Week 1 - Sunday Session Exercises
INSERT INTO session_exercises (session_id, exercise_id, order_in_session, sets, reps, rest_seconds, intensity_percentage, notes) VALUES
-- Complete Rest
(28, 1, 1, 0, '0 minutes', 0, 0, 'Complete rest day - no exercise');

-- Create indexes for performance
CREATE INDEX idx_daily_sessions_weekly_template ON daily_sessions(weekly_template_id);
CREATE INDEX idx_daily_sessions_day ON daily_sessions(day_of_week);
CREATE INDEX idx_session_exercises_session ON session_exercises(session_id);
CREATE INDEX idx_session_exercises_order ON session_exercises(session_id, order_in_session);

-- Add RLS policies for daily_sessions and session_exercises
ALTER TABLE daily_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_exercises ENABLE ROW LEVEL SECURITY;

-- Everyone can view daily sessions (they're templates)
CREATE POLICY "Everyone can view daily sessions" ON daily_sessions
    FOR SELECT USING (true);

-- Everyone can view session exercises (they're templates)
CREATE POLICY "Everyone can view session exercises" ON session_exercises
    FOR SELECT USING (true); 