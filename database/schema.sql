-- Flag Football Training App Database Schema
-- Comprehensive schema with all tables, relationships, and sample data

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    role TEXT CHECK (role IN ('athlete', 'coach', 'admin')) NOT NULL,
    team_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    organization TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exercise Categories
CREATE TABLE IF NOT EXISTS exercise_categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    color TEXT DEFAULT '#3B82F6',
    icon TEXT DEFAULT 'dumbbell',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exercises table
CREATE TABLE IF NOT EXISTS exercises (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category_id INTEGER REFERENCES exercise_categories(id) ON DELETE CASCADE,
    description TEXT,
    instructions TEXT,
    position_specific JSONB DEFAULT '[]',
    equipment_needed JSONB DEFAULT '[]',
    duration_minutes INTEGER,
    reps_sets TEXT,
    difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    video_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Training Programs
CREATE TABLE IF NOT EXISTS training_programs (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    program_type TEXT CHECK (program_type IN ('offseason', 'preseason', 'inseason', 'recovery')),
    duration_weeks INTEGER,
    target_level TEXT CHECK (target_level IN ('beginner', 'intermediate', 'advanced')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Weekly Templates
CREATE TABLE IF NOT EXISTS weekly_templates (
    id SERIAL PRIMARY KEY,
    program_id INTEGER REFERENCES training_programs(id) ON DELETE CASCADE,
    week_number INTEGER NOT NULL,
    intensity_percentage INTEGER CHECK (intensity_percentage BETWEEN 0 AND 100),
    volume_multiplier DECIMAL(3,2) DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Athlete Profiles
CREATE TABLE IF NOT EXISTS athlete_profiles (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    position TEXT,
    height_cm INTEGER,
    weight_kg DECIMAL(5,2),
    experience_years INTEGER DEFAULT 0,
    fitness_level TEXT CHECK (fitness_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
    goals JSONB DEFAULT '{}',
    medical_notes TEXT,
    emergency_contact JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Athlete Programs (assignment of programs to athletes)
CREATE TABLE IF NOT EXISTS athlete_programs (
    id SERIAL PRIMARY KEY,
    athlete_id UUID REFERENCES users(id) ON DELETE CASCADE,
    program_id INTEGER REFERENCES training_programs(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE,
    status TEXT CHECK (status IN ('active', 'completed', 'paused')) DEFAULT 'active',
    is_generated BOOLEAN DEFAULT FALSE,
    customizations JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Training Sessions
CREATE TABLE IF NOT EXISTS training_sessions (
    id SERIAL PRIMARY KEY,
    athlete_id UUID REFERENCES users(id) ON DELETE CASCADE,
    program_id INTEGER REFERENCES training_programs(id) ON DELETE SET NULL,
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

-- Session Exercises (many-to-many relationship)
CREATE TABLE IF NOT EXISTS session_exercises (
    id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES training_sessions(id) ON DELETE CASCADE,
    exercise_id INTEGER REFERENCES exercises(id) ON DELETE CASCADE,
    order_in_session INTEGER DEFAULT 0,
    target_sets INTEGER,
    target_reps INTEGER,
    target_duration_minutes INTEGER,
    rest_seconds INTEGER DEFAULT 60,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Training Logs (actual performance data)
CREATE TABLE IF NOT EXISTS training_logs (
    id SERIAL PRIMARY KEY,
    athlete_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id INTEGER REFERENCES training_sessions(id) ON DELETE SET NULL,
    exercise_id INTEGER REFERENCES exercises(id) ON DELETE SET NULL,
    sets_completed INTEGER,
    reps_completed INTEGER,
    duration_minutes INTEGER,
    weight_kg DECIMAL(5,2),
    distance_meters INTEGER,
    notes TEXT,
    perceived_exertion INTEGER CHECK (perceived_exertion BETWEEN 1 AND 10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recovery Routines
CREATE TABLE IF NOT EXISTS recovery_routines (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT CHECK (category IN ('post_training', 'rest_day', 'pre_competition')),
    duration_minutes INTEGER,
    description TEXT,
    equipment_needed JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recovery Exercises
CREATE TABLE IF NOT EXISTS recovery_exercises (
    id SERIAL PRIMARY KEY,
    routine_id INTEGER REFERENCES recovery_routines(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    duration_minutes INTEGER,
    description TEXT,
    equipment TEXT,
    body_parts JSONB DEFAULT '[]',
    order_in_routine INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recovery Logs
CREATE TABLE IF NOT EXISTS recovery_logs (
    id SERIAL PRIMARY KEY,
    athlete_id UUID REFERENCES users(id) ON DELETE CASCADE,
    routine_id INTEGER REFERENCES recovery_routines(id) ON DELETE SET NULL,
    duration_minutes INTEGER,
    notes TEXT,
    perceived_effectiveness INTEGER CHECK (perceived_effectiveness BETWEEN 1 AND 10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Athlete Assessments
CREATE TABLE IF NOT EXISTS athlete_assessments (
    id SERIAL PRIMARY KEY,
    athlete_id UUID REFERENCES users(id) ON DELETE CASCADE,
    assessment_type TEXT CHECK (assessment_type IN ('fitness', 'skill', 'injury', 'performance')),
    assessment_date DATE NOT NULL,
    results JSONB NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Athlete Metrics
CREATE TABLE IF NOT EXISTS athlete_metrics (
    id SERIAL PRIMARY KEY,
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
    id SERIAL PRIMARY KEY,
    athlete_id UUID REFERENCES users(id) ON DELETE CASCADE,
    questionnaire_type TEXT CHECK (questionnaire_type IN ('initial', 'progress', 'feedback')),
    responses JSONB NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE athlete_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE recovery_logs ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

-- Athletes can view their own profiles
CREATE POLICY "Athletes can view own profile" ON athlete_profiles
    FOR SELECT USING (auth.uid() = user_id);

-- Athletes can update their own profiles
CREATE POLICY "Athletes can update own profile" ON athlete_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Athletes can view their own sessions
CREATE POLICY "Athletes can view own sessions" ON training_sessions
    FOR SELECT USING (auth.uid() = athlete_id);

-- Athletes can view their own logs
CREATE POLICY "Athletes can view own logs" ON training_logs
    FOR SELECT USING (auth.uid() = athlete_id);

-- Athletes can insert their own logs
CREATE POLICY "Athletes can insert own logs" ON training_logs
    FOR INSERT WITH CHECK (auth.uid() = athlete_id);

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
    FOR SELECT USING (true);

-- Everyone can view training programs (public data)
CREATE POLICY "Everyone can view training programs" ON training_programs
    FOR SELECT USING (true);

-- Indexes for performance
CREATE INDEX idx_exercises_category ON exercises(category_id);
CREATE INDEX idx_exercises_difficulty ON exercises(difficulty_level);
CREATE INDEX idx_exercises_position ON exercises USING GIN(position_specific);
CREATE INDEX idx_training_logs_athlete_date ON training_logs(athlete_id, created_at);
CREATE INDEX idx_training_sessions_athlete_date ON training_sessions(athlete_id, scheduled_date);
CREATE INDEX idx_athlete_programs_athlete ON athlete_programs(athlete_id, status);

-- Insert sample data

-- Exercise Categories
INSERT INTO exercise_categories (name, description, color, icon) VALUES
('Warm-up', 'Pre-training activation and mobility', '#10B981', 'zap'),
('Strength Training', 'Resistance and bodyweight exercises', '#F59E0B', 'dumbbell'),
('Plyometrics', 'Explosive power development', '#EF4444', 'trending-up'),
('Skill Development', 'Sport-specific techniques and drills', '#3B82F6', 'target'),
('Agility', 'Change of direction and coordination', '#8B5CF6', 'navigation'),
('Flag Pulling', 'Defensive technique and practice', '#EC4899', 'shield'),
('Conditioning', 'Cardiovascular and endurance training', '#06B6D4', 'activity'),
('Recovery', 'Rest and regeneration activities', '#84CC16', 'heart');

-- Insert all the exercises from your provided data
INSERT INTO exercises (name, category_id, description, instructions, position_specific, duration_minutes, difficulty_level) VALUES
-- QB Training
('3-Step Drop Mechanics', 4, 'Footwork foundation for quick passes', 'Crossover step, hitch step, throw step. Focus on depth and timing', '["QB"]', 10, 'beginner'),
('5-Step Drop Mechanics', 4, 'Intermediate timing routes', 'Deeper drop for intermediate routes, maintain pocket presence', '["QB"]', 10, 'intermediate'),
('Pocket Movement', 4, 'Evasion skills in compressed space', 'Step up, slide left/right, keep eyes downfield', '["QB"]', 15, 'intermediate'),
('Throwing Accuracy - Stationary', 4, 'Precision passing from pocket', '20 throws at 5, 10, 15-yard targets, 80% completion goal', '["QB"]', 15, 'beginner'),
('Throwing on the Run', 4, 'Mobile passing skills', 'Roll out left/right, maintain accuracy while moving', '["QB"]', 20, 'advanced'),
('Pre-Snap Recognition', 4, 'Reading defensive alignments', 'Identify coverage, count defenders, find mismatches', '["QB"]', 15, 'intermediate'),
('Spiral Snapping Practice', 4, 'Center skills for dual-position players', 'One-hand spiral delivery accurate to 10 yards', '["QB", "C"]', 10, 'intermediate'),

-- Wide Receiver Training
('Route Tree Mastery', 4, 'Complete passing route repertoire', 'Practice all 9 routes: hitch, slant, comeback, out, in, post, corner, go, fade', '["WR"]', 25, 'intermediate'),
('Release Techniques', 4, 'Getting off the line vs coverage', 'Inside release, outside release, vertical release vs press coverage', '["WR"]', 15, 'intermediate'),
('Catching Progression', 4, 'Hand technique and ball security', 'Stationary → moving → contested → one-handed catches', '["WR"]', 20, 'beginner'),
('Separation Techniques', 4, 'Creating space from defenders', 'Stutter step, head fake, shoulder dip, speed burst', '["WR"]', 15, 'intermediate'),
('YAC Drills', 4, 'Yards after catch maximization', 'Catch and run, avoid cones representing defenders', '["WR"]', 15, 'intermediate'),
('Red Zone Routes', 4, 'Scoring area precision', 'Back shoulder throws, fade routes, quick slants in tight spaces', '["WR"]', 15, 'advanced'),

-- Defensive Back Training
('Backpedal Technique', 4, 'Fundamental DB movement', 'Low stance, controlled arm swing, forward vision, smooth transitions', '["DB"]', 15, 'beginner'),
('Man Coverage Drills', 4, 'Tight coverage techniques', 'Mirror receiver movements, maintain inside leverage', '["DB"]', 20, 'intermediate'),
('Zone Coverage', 4, 'Area responsibility and awareness', 'Cover assigned zone, read QB eyes, communicate with teammates', '["DB"]', 20, 'intermediate'),
('Flag Pulling Technique', 4, 'Fundamental defensive skill', 'Two-hand approach, target base of flag, proper pursuit angles', '["DB", "LB"]', 15, 'beginner'),
('Ball Skills', 4, 'Interception and deflection techniques', 'High point drills, tip drills, catch at highest point', '["DB"]', 15, 'intermediate'),
('Break on Ball', 4, 'Recognition and reaction timing', 'Plant and drive on underthrown balls, break on QB release', '["DB"]', 15, 'advanced'),

-- Flag Pulling Drills
('1v1 Flag Pulling', 6, 'Basic defensive technique', 'RB tries to reach endzone, DB pulls flag', '["DB", "LB"]', 15, 'beginner'),
('Gauntlet Drill', 6, 'Multiple defender flag pulling', 'RB runs through line of defenders', '["DB", "LB", "RB"]', 12, 'intermediate'),
('Flag Pulling Technique', 6, 'Proper approach and technique', 'Two-hand approach, grab base of flag, pursuit angles', '["DB", "LB"]', 10, 'beginner'),
('Group Tag', 6, 'Multi-player defensive drill', 'Multiple RBs vs multiple DBs in defined area', '["DB", "LB", "RB"]', 15, 'intermediate'),

-- Route Running Drills
('5-Yard Hitch', 6, 'Quick timing route', 'Run 5 yards, turn back to QB, catch', '["WR"]', 8, 'beginner'),
('10-Yard Out', 6, 'Intermediate timing route', 'Run 10 yards, plant and cut to sideline', '["WR"]', 10, 'beginner'),
('15-Yard Comeback', 6, 'Advanced route technique', 'Run 15 yards, turn back to QB at 45-degree angle', '["WR"]', 12, 'intermediate'),
('Post Route', 6, 'Deep crossing route', 'Run 12-15 yards, plant and cut toward goal posts', '["WR"]', 12, 'intermediate'),
('Corner Route', 6, 'Deep outside route', 'Run 12-15 yards, plant and cut to corner of endzone', '["WR"]', 12, 'advanced'),
('Slant Route', 6, 'Quick inside route', 'Run 3-5 yards, plant and cut inside sharply', '["WR"]', 8, 'beginner'),

-- Catching Drills
('Stationary Catching', 6, 'Basic hand technique', 'Catch passes from 5 yards, focus on hand position', '["WR", "RB"]', 10, 'beginner'),
('Catching on the Run', 6, 'Dynamic catching skills', 'Catch while running various routes', '["WR", "RB"]', 15, 'intermediate'),
('Over-the-Shoulder Catch', 6, 'Deep ball technique', 'Look ball into hands while running away from QB', '["WR"]', 12, 'intermediate'),
('One-Hand Catches', 6, 'Advanced catching technique', 'Catch with non-dominant hand, then dominant', '["WR"]', 10, 'advanced'),
('Contested Catches', 6, 'Catching under pressure', 'Catch with defender applying pressure', '["WR"]', 15, 'advanced'),

-- Throwing Drills (QB/Multi-position)
('5-Step Drop and Throw', 6, 'Basic QB mechanics', 'Drop back 5 steps, set and throw to target', '["QB"]', 12, 'beginner'),
('Play Action Fake', 6, 'Deception technique', 'Fake handoff, then drop back and throw', '["QB"]', 10, 'intermediate'),
('Rollout Passing', 6, 'Mobile QB technique', 'Roll out left/right, throw on the run', '["QB"]', 15, 'intermediate'),
('Deep Ball Accuracy', 6, 'Long-range passing', 'Throw 20+ yard passes with accuracy', '["QB"]', 15, 'advanced'),
('Quick Release', 6, 'Fast passing technique', 'Get ball out in under 2.5 seconds', '["QB"]', 10, 'intermediate'),

-- Center/Snapping Drills
('Long Snap Accuracy', 6, 'Punting snap technique', 'Snap ball 15 yards with spiral and accuracy', '["C"]', 10, 'intermediate'),
('Quick Snap', 6, 'Fast game tempo', 'Snap and release to route in under 1 second', '["C"]', 8, 'beginner'),
('Snap and Block', 6, 'Dual responsibility', 'Snap ball then immediately set up in protection', '["C"]', 10, 'intermediate'),

-- Running Back Drills
('Handoff Technique', 6, 'Proper ball exchange', 'Create pocket with arms, secure ball immediately', '["RB"]', 8, 'beginner'),
('Cut and Go', 6, 'Evasion technique', 'Sharp cut to avoid defender, accelerate upfield', '["RB"]', 12, 'intermediate'),
('Screen Pass', 6, 'Outlet passing technique', 'Let rushers pass, catch ball behind line', '["RB"]', 10, 'intermediate'),
('Goal Line Drill', 6, 'Short yardage technique', 'Power through goal line with ball security', '["RB"]', 8, 'beginner');

-- Insert strength training exercises
INSERT INTO exercises (name, category_id, description, instructions, equipment_needed, duration_minutes, reps_sets, difficulty_level) VALUES
-- Upper Body Strength
('Push-Up Progression', 2, 'Upper body pushing strength', 'Standard → diamond → archer → one-arm progression', '[]', 10, '3x8-15', 'beginner'),
('Pike Push-Ups', 2, 'Shoulder strength and stability', 'Downward dog position, lower head to ground, press up', '[]', 8, '3x6-12', 'intermediate'),
('Handstand Progression', 2, 'Advanced shoulder strength', 'Wall walks → chest-to-wall → freestanding holds', '["wall"]', 15, '3x30-60sec', 'advanced'),
('Pull-Up Progression', 2, 'Upper body pulling strength', 'Assisted → negative → full → weighted progression', '["pull-up bar"]', 10, '3x3-12', 'intermediate'),
('Inverted Rows', 2, 'Horizontal pulling strength', 'Under table/bar, pull chest to bar, control descent', '["table/bar"]', 8, '3x6-15', 'beginner'),

-- Lower Body Strength  
('Bodyweight Squat', 2, 'Fundamental leg strength', 'Hip-width stance, full depth, drive through heels', '[]', 8, '3x10-20', 'beginner'),
('Single-Leg Squat Progression', 2, 'Unilateral leg strength', 'Assisted → pistol squat progression', '[]', 12, '3x3-8 each', 'advanced'),
('Bulgarian Split Squat', 2, 'Single-leg strength and stability', 'Rear foot elevated, descend until front thigh parallel', '["bench/chair"]', 10, '3x8-12 each', 'intermediate'),
('Jump Squats', 2, 'Explosive leg power', 'Rapid descent, explosive jump, soft landing', '[]', 8, '3x6-10', 'intermediate'),
('Single-Leg Romanian Deadlift', 2, 'Hamstring and glute strength', 'Balance on one leg, hinge at hip, touch ground', '[]', 10, '3x6-10 each', 'intermediate'),

-- Core Strength
('Plank Progressions', 2, 'Core stability and endurance', 'Standard → side → up-down → single-arm/leg', '[]', 12, '3x30-90sec', 'beginner'),
('Dead Bug', 2, 'Anti-extension core control', 'Lie supine, opposite arm/leg extensions, maintain neutral spine', '[]', 8, '3x8-12 each', 'beginner'),
('Bear Crawl', 2, 'Total body core integration', 'Hands and feet only, knees 1 inch off ground, crawl forward/back', '[]', 10, '3x20 steps', 'intermediate'),
('Hollow Body Hold', 2, 'Core compression strength', 'Press lower back to ground, hold C-shape position', '[]', 8, '3x20-45sec', 'intermediate'),

-- Plyometric Power
('Box Jumps', 3, 'Vertical power development', 'Jump onto box, soft landing, step down', '["box/bench"]', 12, '3x5-8', 'intermediate'),
('Broad Jumps', 3, 'Horizontal power development', 'Jump forward maximally, stick landing', '[]', 10, '3x3-5', 'beginner'),
('Single-Leg Bounds', 3, 'Unilateral power and coordination', 'Alternate leg bounds for distance, soft landings', '[]', 12, '3x6-8 each', 'intermediate'),
('Depth Jumps', 3, 'Reactive strength development', 'Step off box, immediately jump vertically upon landing', '["box"]', 15, '3x3-5', 'advanced'),
('Reactive Jumping', 3, 'Quick ground contact training', 'Multiple small jumps, minimize ground contact time', '[]', 8, '3x10-15', 'intermediate');

-- Insert speed and agility exercises
INSERT INTO exercises (name, category_id, description, instructions, equipment_needed, duration_minutes, reps_sets, difficulty_level) VALUES
-- Hill Sprint Variations
('Hill Sprints - Short', 4, 'Maximum acceleration development', '20-meter hill sprints, 5-10% grade, maximum effort', '["hill"]', 15, '6x20m', 'intermediate'),
('Hill Sprints - Medium', 4, 'Speed endurance development', '40-meter hill sprints, 5-10% grade, 90% effort', '["hill"]', 20, '4x40m', 'intermediate'),
('Hill Sprints - Long', 4, 'Lactate tolerance development', '60-meter hill sprints, 5-10% grade, 85% effort', '["hill"]', 25, '3x60m', 'advanced'),
('Hill Bounds', 4, 'Power and stride length development', 'Exaggerated bounding up hill, focus on air time', '["hill"]', 12, '3x30m', 'intermediate'),
('Hill Backpedal', 4, 'Defensive back specific training', 'Backpedal up hill, maintain posture and control', '["hill"]', 10, '4x20m', 'intermediate'),

-- Linear Speed Development
('10-Yard Sprints', 4, 'Acceleration development', 'Maximum effort from 3-point stance', '["cones"]', 12, '6x10yds', 'beginner'),
('20-Yard Sprints', 4, 'Acceleration to speed transition', 'Focus on drive phase and stride development', '["cones"]', 15, '5x20yds', 'beginner'),
('40-Yard Sprints', 4, 'Top speed development', 'Complete sprint with electronic timing if possible', '["cones"]', 18, '3x40yds', 'intermediate'),
('Flying 30s', 4, 'Maximum velocity training', '20-yard build-up, 30-yard max speed zone', '["cones"]', 20, '4x30yds', 'advanced'),
('Build-Up Sprints', 4, 'Progressive speed development', '50% → 75% → 90% → 95% over 40 yards', '["cones"]', 15, '4x40yds', 'beginner'),

-- Agility and Change of Direction
('Pro Agility (5-10-5)', 5, 'Multi-directional speed test', 'Start middle, 5 yards right, 10 left, 5 right to finish', '["cones"]', 10, '4 attempts', 'intermediate'),
('T-Drill', 5, 'Forward, lateral, backward agility', 'Forward 10yds, left 5yds, right 10yds, left 5yds, back 10yds', '["cones"]', 12, '3 attempts', 'intermediate'),
('L-Drill (3-Cone)', 5, 'Cutting and body control', 'Complex cone pattern with tight turns', '["cones"]', 15, '3 attempts', 'advanced'),
('Box Drill', 5, 'Multi-directional movement', '5x5 yard box, forward, lateral, backward, lateral', '["cones"]', 8, '4 rounds', 'beginner'),
('Star Drill', 5, 'Reactive agility training', '5 cones in star pattern, sprint to called cone', '["cones", "partner"]', 15, '30-60sec sets', 'intermediate'),

-- Ladder Drills
('Ladder - Two Feet In', 5, 'Basic foot speed', 'Two feet in each box, quick cadence', '["agility_ladder"]', 5, '4 runs', 'beginner'),
('Ladder - In-In-Out-Out', 5, 'Lateral foot coordination', 'Both feet in box, both feet out wide, repeat', '["agility_ladder"]', 5, '4 runs', 'beginner'),
('Ladder - Lateral Shuffle', 5, 'Side movement coordination', 'Side shuffle through ladder, face same direction', '["agility_ladder"]', 5, '4 runs each direction', 'beginner'),
('Ladder - Ickey Shuffle', 5, 'Complex coordination pattern', 'In-out-in pattern moving laterally', '["agility_ladder"]', 6, '3 runs each direction', 'intermediate'),

-- Reactive Drills
('Mirror Drill', 5, 'Reactive movement training', 'Mirror partner movements for 30 seconds', '[]', 10, '4x30sec', 'beginner'),
('Reaction Ball', 5, 'Hand-eye coordination and reaction', 'Catch irregularly bouncing ball', '["reaction_ball"]', 8, '20 attempts', 'beginner'),
('Light Reaction', 5, 'Visual stimulus response', 'Sprint to light/color signal', '["lights/cones"]', 12, '8-10 attempts', 'intermediate'),
('Whistle Reaction', 5, 'Auditory stimulus response', 'Change direction on whistle signal', '[]', 10, '6-8 signals', 'beginner');

-- Insert recovery and self-care exercises
INSERT INTO exercises (name, category_id, description, instructions, equipment_needed, duration_minutes, difficulty_level) VALUES
-- Foam Rolling Techniques
('IT Band Foam Rolling', 8, 'Release lateral thigh tension', 'Side position, roll from hip to knee, pause on tender spots', '["foam_roller"]', 2, 'beginner'),
('Quadriceps Foam Rolling', 8, 'Front thigh muscle release', 'Prone position, roll from hip to knee, avoid kneecap', '["foam_roller"]', 2, 'beginner'),
('Hamstring Foam Rolling', 8, 'Posterior thigh muscle release', 'Seated position, roll from glute to knee', '["foam_roller"]', 2, 'beginner'),
('Calf Foam Rolling', 8, 'Lower leg muscle release', 'Seated, cross legs, roll from knee to ankle', '["foam_roller"]', 2, 'beginner'),
('Glute Foam Rolling', 8, 'Hip muscle release', 'Seated on roller, lean to one side, roll glute muscle', '["foam_roller"]', 2, 'beginner'),

-- Massage Gun Protocols
('Massage Gun - Quadriceps', 8, 'Percussive therapy for front thigh', '2-3 minutes per leg, medium intensity, avoid bones', '["massage_gun"]', 3, 'beginner'),
('Massage Gun - Hamstrings', 8, 'Percussive therapy for rear thigh', '2-3 minutes per leg, medium intensity, sit or lie prone', '["massage_gun"]', 3, 'beginner'),
('Massage Gun - Calves', 8, 'Percussive therapy for lower leg', '1-2 minutes per leg, light to medium intensity', '["massage_gun"]', 2, 'beginner'),
('Massage Gun - Glutes', 8, 'Percussive therapy for hip muscles', '2-3 minutes per side, medium to high intensity', '["massage_gun"]', 3, 'beginner'),

-- Self-Massage Techniques
('Self-Massage - Feet', 8, 'Plantar fascia and arch release', 'Tennis ball or hands, roll arch and massage toes', '["tennis_ball"]', 3, 'beginner'),
('Self-Massage - Neck', 8, 'Cervical tension release', 'Gentle circular motions, base of skull to shoulders', '[]', 2, 'beginner'),
('Self-Massage - Hands', 8, 'Forearm and hand tension release', 'Massage palm, fingers, and forearm muscles', '[]', 2, 'beginner'),

-- Stretching Routines
('Hip Flexor Stretch', 8, 'Release tight hip flexors', 'Couch stretch position, 90 seconds each side', '[]', 3, 'beginner'),
('Hamstring Stretch', 8, 'Posterior thigh flexibility', 'Seated or lying, straight leg, reach for toes', '[]', 2, 'beginner'),
('Calf Stretch', 8, 'Lower leg flexibility', 'Wall push-up position, heel down, lean forward', '[]', 2, 'beginner'),
('Chest Stretch', 8, 'Anterior shoulder and chest opening', 'Doorway stretch, arm at 90 degrees', '[]', 2, 'beginner'),
('Shoulder Cross-Body Stretch', 8, 'Posterior shoulder flexibility', 'Pull arm across body, hold with opposite hand', '[]', 1, 'beginner');

-- Insert training programs
INSERT INTO training_programs (name, description, program_type, duration_weeks, target_level) VALUES
('Offseason Foundation', 'Build aerobic base, general strength, movement quality', 'offseason', 16, 'beginner'),
('Preseason Preparation', 'Sport-specific conditioning and skill development', 'preseason', 8, 'intermediate'),
('Competition Season', 'Maintain fitness, peak for competitions', 'inseason', 12, 'advanced'),
('Active Recovery', 'Rest and regeneration period', 'recovery', 4, 'beginner');

-- Insert weekly templates
INSERT INTO weekly_templates (program_id, week_number, intensity_percentage, volume_multiplier) VALUES
-- Offseason Foundation (16 weeks)
(1, 1, 65, 0.8), (1, 2, 68, 0.85), (1, 3, 70, 0.9), (1, 4, 60, 0.7), -- Week 4 deload
(1, 5, 72, 0.95), (1, 6, 75, 1.0), (1, 7, 78, 1.05), (1, 8, 65, 0.75), -- Week 8 deload
(1, 9, 75, 1.0), (1, 10, 78, 1.05), (1, 11, 80, 1.1), (1, 12, 70, 0.8), -- Week 12 deload
(1, 13, 80, 1.1), (1, 14, 82, 1.15), (1, 15, 85, 1.2), (1, 16, 75, 0.9),

-- Preseason Preparation (8 weeks)
(2, 1, 75, 1.0), (2, 2, 78, 1.05), (2, 3, 65, 0.8), -- Week 3 deload
(2, 4, 80, 1.1), (2, 5, 85, 1.15), (2, 6, 70, 0.85), -- Week 6 deload
(2, 7, 88, 1.2), (2, 8, 90, 1.25),

-- Competition Season (12 weeks)
(3, 1, 85, 1.0), (3, 2, 80, 0.95), (3, 3, 75, 0.9), -- Competition taper
(3, 4, 85, 1.0), (3, 5, 80, 0.95), (3, 6, 75, 0.9),
(3, 7, 85, 1.0), (3, 8, 80, 0.95), (3, 9, 75, 0.9),
(3, 10, 85, 1.0), (3, 11, 80, 0.95), (3, 12, 75, 0.9),

-- Active Recovery (4 weeks)
(4, 1, 50, 0.6), (4, 2, 55, 0.65), (4, 3, 60, 0.7), (4, 4, 65, 0.75);

-- Insert recovery routines
INSERT INTO recovery_routines (name, category, duration_minutes, description, equipment_needed) VALUES
('Post-Training Recovery', 'post_training', 20, 'Comprehensive recovery after intense training', '["foam_roller", "massage_gun"]'),
('Rest Day Maintenance', 'rest_day', 30, 'Active recovery and mobility maintenance', '["foam_roller", "resistance_bands"]'),
('Pre-Competition Prep', 'pre_competition', 15, 'Light activation and tension release', '["massage_gun", "compression_boots"]'),
('Deep Recovery Session', 'rest_day', 45, 'Complete recovery with all modalities', '["foam_roller", "massage_gun", "compression_boots"]');

-- Insert recovery exercises
INSERT INTO recovery_exercises (routine_id, name, duration_minutes, description, equipment, body_parts, order_in_routine) VALUES
-- Post-Training Recovery (20 min)
(1, 'Foam Rolling - Lower Body', 8, 'Target IT band, quads, hamstrings, calves', 'foam_roller', '["IT_band", "quadriceps", "hamstrings", "calves"]', 1),
(1, 'Massage Gun Therapy', 7, 'Percussive therapy on major muscle groups', 'massage_gun', '["quadriceps", "hamstrings", "glutes", "calves"]', 2),
(1, 'Static Stretching', 5, 'Hold stretches for tight areas', 'none', '["hip_flexors", "hamstrings", "calves", "chest"]', 3),

-- Rest Day Maintenance (30 min)
(2, 'Light Movement', 5, 'Easy walking or stationary bike', 'none', '["full_body"]', 1),
(2, 'Foam Rolling - Full Body', 12, 'Comprehensive foam rolling session', 'foam_roller', '["all_major_muscle_groups"]', 2),
(2, 'Mobility Routine', 8, 'Dynamic and static stretching combination', 'resistance_bands', '["hips", "shoulders", "spine", "ankles"]', 3),
(2, 'Self-Massage', 5, 'Manual pressure point release', 'none', '["feet", "hands", "neck", "face"]', 4),

-- Pre-Competition Prep (15 min)
(3, 'Compression Boots', 10, 'Lower body compression therapy', 'compression_boots', '["legs", "feet"]', 1),
(3, 'Massage Gun - Light', 3, 'Light percussive therapy for activation', 'massage_gun', '["quadriceps", "calves"]', 2),
(3, 'Mental Preparation', 2, 'Visualization and breathing exercises', 'none', '["mind"]', 3),

-- Deep Recovery Session (45 min)
(4, 'Compression Boots', 15, 'Extended compression therapy', 'compression_boots', '["legs", "feet"]', 1),
(4, 'Foam Rolling - Comprehensive', 15, 'Detailed foam rolling all muscle groups', 'foam_roller', '["all_major_muscle_groups"]', 2),
(4, 'Massage Gun - Full Body', 10, 'Complete percussive therapy session', 'massage_gun', '["all_accessible_muscles"]', 3),
(4, 'Stretching and Mobility', 5, 'Deep stretching and joint mobility', 'none', '["full_body"]', 4);

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