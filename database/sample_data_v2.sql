-- Sample Data for FlagFit Pro Database v2.0
-- Comprehensive exercise library and training programs

-- Insert Exercise Categories
INSERT INTO exercise_categories (id, name, description, type, color_code, icon) VALUES
(gen_random_uuid(), 'Warm-up', 'Pre-training activation and mobility exercises', 'warmup', '#10B981', 'zap'),
(gen_random_uuid(), 'Strength Training', 'Resistance and bodyweight strength exercises', 'strength', '#F59E0B', 'dumbbell'),
(gen_random_uuid(), 'Plyometrics', 'Explosive power development exercises', 'plyometric', '#EF4444', 'trending-up'),
(gen_random_uuid(), 'Speed Development', 'Linear speed and acceleration training', 'speed', '#3B82F6', 'lightning-bolt'),
(gen_random_uuid(), 'Agility Training', 'Change of direction and coordination drills', 'agility', '#8B5CF6', 'navigation'),
(gen_random_uuid(), 'Skill Development', 'Position-specific football skills and techniques', 'skill', '#EC4899', 'target'),
(gen_random_uuid(), 'Recovery', 'Rest and regeneration activities', 'recovery', '#84CC16', 'heart'),
(gen_random_uuid(), 'Stretching', 'Flexibility and mobility exercises', 'stretching', '#06B6D4', 'flex'),
(gen_random_uuid(), 'Conditioning', 'Cardiovascular and endurance training', 'conditioning', '#F97316', 'activity');

-- Get category IDs for reference
DO $$
DECLARE
    warmup_id UUID;
    strength_id UUID;
    plyometric_id UUID;
    speed_id UUID;
    agility_id UUID;
    skill_id UUID;
    recovery_id UUID;
    stretching_id UUID;
    conditioning_id UUID;
BEGIN
    -- Get category IDs
    SELECT id INTO warmup_id FROM exercise_categories WHERE type = 'warmup' LIMIT 1;
    SELECT id INTO strength_id FROM exercise_categories WHERE type = 'strength' LIMIT 1;
    SELECT id INTO plyometric_id FROM exercise_categories WHERE type = 'plyometric' LIMIT 1;
    SELECT id INTO speed_id FROM exercise_categories WHERE type = 'speed' LIMIT 1;
    SELECT id INTO agility_id FROM exercise_categories WHERE type = 'agility' LIMIT 1;
    SELECT id INTO skill_id FROM exercise_categories WHERE type = 'skill' LIMIT 1;
    SELECT id INTO recovery_id FROM exercise_categories WHERE type = 'recovery' LIMIT 1;
    SELECT id INTO stretching_id FROM exercise_categories WHERE type = 'stretching' LIMIT 1;
    SELECT id INTO conditioning_id FROM exercise_categories WHERE type = 'conditioning' LIMIT 1;

    -- Insert Warm-up Exercises
    INSERT INTO exercises (id, name, category_id, description, instructions, difficulty_level, duration_minutes, default_sets, default_reps, default_rest_seconds, target_muscles, equipment_needed) VALUES
    (gen_random_uuid(), 'Dynamic Stretching Routine', warmup_id, 'Comprehensive dynamic stretching for full body', 'Perform each stretch for 10-15 seconds, moving through full range of motion', 'beginner', 15, 1, '10-15 seconds each', 0, '["full_body"]', '[]'),
    (gen_random_uuid(), 'Light Jogging', warmup_id, 'Easy jogging to increase heart rate', 'Jog at 50-60% effort for 5-10 minutes', 'beginner', 10, 1, '5-10 minutes', 0, '["legs", "cardiovascular"]', '[]'),
    (gen_random_uuid(), 'Arm Circles', warmup_id, 'Shoulder mobility and warm-up', 'Make small circles with arms, gradually increasing size', 'beginner', 3, 2, '10 forward, 10 backward', 30, '["shoulders", "arms"]', '[]'),
    (gen_random_uuid(), 'High Knees', warmup_id, 'Dynamic leg warm-up', 'March in place, bringing knees to waist height', 'beginner', 5, 2, '30 seconds', 30, '["legs", "core"]', '[]'),
    (gen_random_uuid(), 'Butt Kicks', warmup_id, 'Hamstring warm-up', 'Jog in place, kicking heels toward glutes', 'beginner', 5, 2, '30 seconds', 30, '["legs", "hamstrings"]', '[]');

    -- Insert Strength Training Exercises
    INSERT INTO exercises (id, name, category_id, description, instructions, difficulty_level, duration_minutes, default_sets, default_reps, default_rest_seconds, target_muscles, equipment_needed) VALUES
    (gen_random_uuid(), 'Push-Up Progression', strength_id, 'Upper body pushing strength development', 'Start with wall push-ups, progress to standard, then advanced variations', 'beginner', 15, 3, '8-15', 90, '["chest", "shoulders", "triceps"]', '[]'),
    (gen_random_uuid(), 'Bodyweight Squats', strength_id, 'Fundamental leg strength exercise', 'Stand with feet shoulder-width, squat down until thighs are parallel to ground', 'beginner', 10, 3, '10-20', 120, '["legs", "glutes", "core"]', '[]'),
    (gen_random_uuid(), 'Pull-Up Progression', strength_id, 'Upper body pulling strength', 'Start with assisted pull-ups, progress to full pull-ups', 'intermediate', 15, 3, '3-12', 120, '["back", "biceps", "shoulders"]', '["pull-up_bar"]'),
    (gen_random_uuid(), 'Bulgarian Split Squats', strength_id, 'Single-leg strength and stability', 'Place rear foot on elevated surface, squat with front leg', 'intermediate', 12, 3, '8-12 each', 120, '["legs", "glutes", "core"]', '["bench", "chair"]'),
    (gen_random_uuid(), 'Plank Progressions', strength_id, 'Core stability and endurance', 'Hold plank position, progress to side planks and variations', 'beginner', 10, 3, '30-90 seconds', 60, '["core", "shoulders"]', '[]');

    -- Insert Plyometric Exercises
    INSERT INTO exercises (id, name, category_id, description, instructions, difficulty_level, duration_minutes, default_sets, default_reps, default_rest_seconds, target_muscles, equipment_needed) VALUES
    (gen_random_uuid(), 'Box Jumps', plyometric_id, 'Vertical power development', 'Jump onto box, land softly, step down', 'intermediate', 12, 3, '5-8', 180, '["legs", "glutes"]', '["box", "bench"]'),
    (gen_random_uuid(), 'Broad Jumps', plyometric_id, 'Horizontal power development', 'Jump forward maximally, stick landing', 'beginner', 10, 3, '3-5', 180, '["legs", "glutes"]', '[]'),
    (gen_random_uuid(), 'Depth Jumps', plyometric_id, 'Reactive strength development', 'Step off box, immediately jump vertically upon landing', 'advanced', 15, 3, '3-5', 240, '["legs", "glutes"]', '["box"]'),
    (gen_random_uuid(), 'Single-Leg Bounds', plyometric_id, 'Unilateral power and coordination', 'Alternate leg bounds for distance', 'intermediate', 12, 3, '6-8 each', 180, '["legs", "glutes"]', '[]'),
    (gen_random_uuid(), 'Reactive Jumping', plyometric_id, 'Quick ground contact training', 'Multiple small jumps, minimize ground contact time', 'intermediate', 8, 3, '10-15', 120, '["legs", "calves"]', '[]');

    -- Insert Speed Development Exercises
    INSERT INTO exercises (id, name, category_id, description, instructions, difficulty_level, duration_minutes, default_sets, default_reps, default_rest_seconds, target_muscles, equipment_needed) VALUES
    (gen_random_uuid(), '10-Yard Sprints', speed_id, 'Acceleration development', 'Maximum effort sprints from 3-point stance', 'beginner', 12, 6, '10 yards', 120, '["legs", "glutes"]', '["cones"]'),
    (gen_random_uuid(), '20-Yard Sprints', speed_id, 'Acceleration to speed transition', 'Focus on drive phase and stride development', 'beginner', 15, 5, '20 yards', 180, '["legs", "glutes"]', '["cones"]'),
    (gen_random_uuid(), '40-Yard Sprints', speed_id, 'Top speed development', 'Complete sprint with proper form', 'intermediate', 18, 3, '40 yards', 300, '["legs", "glutes"]', '["cones"]'),
    (gen_random_uuid(), 'Flying 30s', speed_id, 'Maximum velocity training', '20-yard build-up, 30-yard max speed zone', 'advanced', 20, 4, '30 yards', 300, '["legs", "glutes"]', '["cones"]'),
    (gen_random_uuid(), 'Hill Sprints', speed_id, 'Resistance sprint training', 'Sprint up hill at 5-10% grade', 'intermediate', 15, 6, '20m', 180, '["legs", "glutes"]', '["hill"]');

    -- Insert Agility Training Exercises
    INSERT INTO exercises (id, name, category_id, description, instructions, difficulty_level, duration_minutes, default_sets, default_reps, default_rest_seconds, target_muscles, equipment_needed) VALUES
    (gen_random_uuid(), 'Pro Agility (5-10-5)', agility_id, 'Multi-directional speed test', 'Start middle, 5 yards right, 10 left, 5 right to finish', 'intermediate', 10, 4, '1 attempt', 180, '["legs", "core"]', '["cones"]'),
    (gen_random_uuid(), 'T-Drill', agility_id, 'Forward, lateral, backward agility', 'Forward 10yds, left 5yds, right 10yds, left 5yds, back 10yds', 'intermediate', 12, 3, '1 attempt', 240, '["legs", "core"]', '["cones"]'),
    (gen_random_uuid(), 'L-Drill (3-Cone)', agility_id, 'Cutting and body control', 'Complex cone pattern with tight turns', 'advanced', 15, 3, '1 attempt', 300, '["legs", "core"]', '["cones"]'),
    (gen_random_uuid(), 'Box Drill', agility_id, 'Multi-directional movement', '5x5 yard box, forward, lateral, backward, lateral', 'beginner', 8, 4, '1 round', 120, '["legs", "core"]', '["cones"]'),
    (gen_random_uuid(), 'Ladder Drills', agility_id, 'Foot speed and coordination', 'Various patterns through agility ladder', 'beginner', 10, 4, '1 run each', 60, '["legs", "core"]', '["agility_ladder"]');

    -- Insert Skill Development Exercises
    INSERT INTO exercises (id, name, category_id, description, instructions, difficulty_level, duration_minutes, default_sets, default_reps, default_rest_seconds, target_muscles, equipment_needed, position_specific) VALUES
    (gen_random_uuid(), '3-Step Drop Mechanics', skill_id, 'QB footwork foundation', 'Crossover step, hitch step, throw step. Focus on depth and timing', 'beginner', 10, 3, '10 minutes', 120, '["legs", "core"]', '["football"]', '["QB"]'),
    (gen_random_uuid(), 'Route Tree Mastery', skill_id, 'Complete passing route repertoire', 'Practice all 9 routes: hitch, slant, comeback, out, in, post, corner, go, fade', 'intermediate', 25, 1, '25 minutes', 0, '["legs", "core"]', '["football", "cones"]', '["WR"]'),
    (gen_random_uuid(), 'Flag Pulling Technique', skill_id, 'Defensive fundamental skill', 'Two-hand approach, target base of flag, proper pursuit angles', 'beginner', 15, 3, '10 minutes', 90, '["legs", "core"]', '["flags"]', '["DB", "LB"]'),
    (gen_random_uuid(), 'Catching Progression', skill_id, 'Hand technique and ball security', 'Stationary → moving → contested → one-handed catches', 'beginner', 20, 4, '5 minutes each', 60, '["arms", "core"]', '["football"]', '["WR", "RB"]'),
    (gen_random_uuid(), 'Backpedal Technique', skill_id, 'Fundamental DB movement', 'Low stance, controlled arm swing, forward vision, smooth transitions', 'beginner', 15, 3, '10 minutes', 90, '["legs", "core"]', '[]', '["DB"]');

    -- Insert Recovery Exercises
    INSERT INTO exercises (id, name, category_id, description, instructions, difficulty_level, duration_minutes, default_sets, default_reps, default_rest_seconds, target_muscles, equipment_needed) VALUES
    (gen_random_uuid(), 'Foam Rolling - Lower Body', recovery_id, 'Release muscle tension', 'Roll IT band, quads, hamstrings, calves', 'beginner', 10, 1, '2 minutes each', 0, '["legs"]', '["foam_roller"]'),
    (gen_random_uuid(), 'Massage Gun Therapy', recovery_id, 'Percussive therapy', 'Use massage gun on major muscle groups', 'beginner', 15, 1, '15 minutes', 0, '["full_body"]', '["massage_gun"]'),
    (gen_random_uuid(), 'Static Stretching', recovery_id, 'Hold stretches for flexibility', 'Hold each stretch for 30-60 seconds', 'beginner', 20, 1, '30-60 seconds each', 0, '["full_body"]', '[]'),
    (gen_random_uuid(), 'Light Walking', recovery_id, 'Active recovery movement', 'Walk at easy pace for 20-30 minutes', 'beginner', 30, 1, '30 minutes', 0, '["legs", "cardiovascular"]', '[]'),
    (gen_random_uuid(), 'Compression Boots', recovery_id, 'Lower body compression therapy', 'Use compression boots for 15-20 minutes', 'beginner', 20, 1, '20 minutes', 0, '["legs"]', '["compression_boots"]');

    -- Insert Stretching Exercises
    INSERT INTO exercises (id, name, category_id, description, instructions, difficulty_level, duration_minutes, default_sets, default_reps, default_rest_seconds, target_muscles, equipment_needed) VALUES
    (gen_random_uuid(), 'Hip Flexor Stretch', stretching_id, 'Release tight hip flexors', 'Couch stretch position, 90 seconds each side', 'beginner', 3, 1, '90 seconds each', 0, '["hip_flexors"]', '[]'),
    (gen_random_uuid(), 'Hamstring Stretch', stretching_id, 'Posterior thigh flexibility', 'Seated or lying, straight leg, reach for toes', 'beginner', 2, 1, '60 seconds each', 0, '["hamstrings"]', '[]'),
    (gen_random_uuid(), 'Calf Stretch', stretching_id, 'Lower leg flexibility', 'Wall push-up position, heel down, lean forward', 'beginner', 2, 1, '60 seconds each', 0, '["calves"]', '[]'),
    (gen_random_uuid(), 'Chest Stretch', stretching_id, 'Anterior shoulder and chest opening', 'Doorway stretch, arm at 90 degrees', 'beginner', 2, 1, '60 seconds each', 0, '["chest", "shoulders"]', '[]'),
    (gen_random_uuid(), 'Shoulder Cross-Body Stretch', stretching_id, 'Posterior shoulder flexibility', 'Pull arm across body, hold with opposite hand', 'beginner', 1, 1, '30 seconds each', 0, '["shoulders"]', '[]');

    -- Insert Conditioning Exercises
    INSERT INTO exercises (id, name, category_id, description, instructions, difficulty_level, duration_minutes, default_sets, default_reps, default_rest_seconds, target_muscles, equipment_needed) VALUES
    (gen_random_uuid(), 'Interval Running', conditioning_id, 'High-intensity interval training', '30 seconds sprint, 30 seconds walk, repeat', 'intermediate', 20, 10, '30s sprint/30s walk', 0, '["legs", "cardiovascular"]', '[]'),
    (gen_random_uuid(), 'Circuit Training', conditioning_id, 'Full body conditioning circuit', 'Complete 5-6 exercises with minimal rest', 'intermediate', 30, 3, '1 round', 60, '["full_body"]', '[]'),
    (gen_random_uuid(), 'Shuttle Runs', conditioning_id, 'Multi-directional conditioning', 'Sprint 10 yards, touch line, sprint back, repeat', 'intermediate', 15, 5, '10 reps', 120, '["legs", "cardiovascular"]', '["cones"]'),
    (gen_random_uuid(), 'Burpees', conditioning_id, 'Full body conditioning exercise', 'Squat, push-up, jump sequence', 'intermediate', 10, 3, '10-15', 60, '["full_body"]', '[]'),
    (gen_random_uuid(), 'Mountain Climbers', conditioning_id, 'Dynamic core conditioning', 'Alternate knee drives in plank position', 'beginner', 8, 3, '30 seconds', 60, '["core", "shoulders"]', '[]');

END $$;

-- Insert Training Programs
INSERT INTO training_programs (id, name, description, program_type, duration_weeks, target_level, is_template, tags) VALUES
(gen_random_uuid(), 'Offseason Foundation', 'Build aerobic base, general strength, movement quality', 'offseason', 16, 'beginner', true, '["foundation", "strength", "mobility"]'),
(gen_random_uuid(), 'Preseason Preparation', 'Sport-specific conditioning and skill development', 'preseason', 8, 'intermediate', true, '["conditioning", "skills", "power"]'),
(gen_random_uuid(), 'Competition Season', 'Maintain fitness, peak for competitions', 'inseason', 12, 'advanced', true, '["maintenance", "performance", "recovery"]'),
(gen_random_uuid(), 'Active Recovery', 'Rest and regeneration period', 'recovery', 4, 'beginner', true, '["recovery", "mobility", "light_activity"]');

-- Get program IDs and create weekly templates
DO $$
DECLARE
    offseason_id UUID;
    preseason_id UUID;
    competition_id UUID;
    recovery_id UUID;
    week_template_id UUID;
BEGIN
    -- Get program IDs
    SELECT id INTO offseason_id FROM training_programs WHERE name = 'Offseason Foundation' LIMIT 1;
    SELECT id INTO preseason_id FROM training_programs WHERE name = 'Preseason Preparation' LIMIT 1;
    SELECT id INTO competition_id FROM training_programs WHERE name = 'Competition Season' LIMIT 1;
    SELECT id INTO recovery_id FROM training_programs WHERE name = 'Active Recovery' LIMIT 1;

    -- Create weekly templates for Offseason Foundation
    INSERT INTO weekly_templates (id, program_id, week_number, intensity_percentage, volume_multiplier, focus_areas) VALUES
    (gen_random_uuid(), offseason_id, 1, 65, 0.8, '["foundation", "mobility"]'),
    (gen_random_uuid(), offseason_id, 2, 68, 0.85, '["strength", "endurance"]'),
    (gen_random_uuid(), offseason_id, 3, 70, 0.9, '["strength", "power"]'),
    (gen_random_uuid(), offseason_id, 4, 60, 0.7, '["recovery", "mobility"]');

    -- Create weekly templates for Preseason Preparation
    INSERT INTO weekly_templates (id, program_id, week_number, intensity_percentage, volume_multiplier, focus_areas) VALUES
    (gen_random_uuid(), preseason_id, 1, 75, 1.0, '["conditioning", "skills"]'),
    (gen_random_uuid(), preseason_id, 2, 78, 1.05, '["power", "speed"]'),
    (gen_random_uuid(), preseason_id, 3, 65, 0.8, '["recovery", "maintenance"]'),
    (gen_random_uuid(), preseason_id, 4, 80, 1.1, '["competition_prep", "skills"]');

    -- Create weekly templates for Competition Season
    INSERT INTO weekly_templates (id, program_id, week_number, intensity_percentage, volume_multiplier, focus_areas) VALUES
    (gen_random_uuid(), competition_id, 1, 85, 1.0, '["maintenance", "performance"]'),
    (gen_random_uuid(), competition_id, 2, 80, 0.95, '["recovery", "skills"]'),
    (gen_random_uuid(), competition_id, 3, 75, 0.9, '["light_training", "mobility"]'),
    (gen_random_uuid(), competition_id, 4, 85, 1.0, '["competition", "performance"]');

    -- Create weekly templates for Active Recovery
    INSERT INTO weekly_templates (id, program_id, week_number, intensity_percentage, volume_multiplier, focus_areas) VALUES
    (gen_random_uuid(), recovery_id, 1, 50, 0.6, '["light_activity", "mobility"]'),
    (gen_random_uuid(), recovery_id, 2, 55, 0.65, '["stretching", "recovery"]'),
    (gen_random_uuid(), recovery_id, 3, 60, 0.7, '["light_movement", "flexibility"]'),
    (gen_random_uuid(), recovery_id, 4, 65, 0.75, '["transition", "preparation"]');

    -- Get a weekly template ID for daily sessions
    SELECT id INTO week_template_id FROM weekly_templates WHERE program_id = offseason_id AND week_number = 1 LIMIT 1;

    -- Create daily sessions for Offseason Foundation Week 1
    INSERT INTO daily_sessions (id, weekly_template_id, day_of_week, session_name, session_type, total_duration_minutes, intensity_level, notes) VALUES
    (gen_random_uuid(), week_template_id, 'monday', 'Speed Development & Agility Training', 'speed_agility', 120, 'high', 'Focus on acceleration and change of direction'),
    (gen_random_uuid(), week_template_id, 'tuesday', 'Functional Strength Development', 'strength_power', 90, 'moderate', 'Build foundational strength'),
    (gen_random_uuid(), week_template_id, 'wednesday', 'Position Skills & Recovery', 'skills_technical', 75, 'moderate', 'Skill work with light recovery'),
    (gen_random_uuid(), week_template_id, 'thursday', 'Cardiovascular Conditioning', 'conditioning', 90, 'moderate', 'Build aerobic capacity'),
    (gen_random_uuid(), week_template_id, 'friday', 'Power Development & Plyometrics', 'strength_power', 105, 'high', 'Explosive power training'),
    (gen_random_uuid(), week_template_id, 'saturday', 'Position-Specific Skills', 'skills_technical', 90, 'moderate', 'Focus on position-specific techniques'),
    (gen_random_uuid(), week_template_id, 'sunday', 'Active Recovery & Mobility', 'recovery', 60, 'light', 'Light movement and stretching');

END $$;

-- Create session exercises for the first daily session (Monday)
DO $$
DECLARE
    session_id UUID;
    warmup_ex_id UUID;
    speed_ex_id UUID;
    agility_ex_id UUID;
    plyo_ex_id UUID;
    recovery_ex_id UUID;
BEGIN
    -- Get session ID
    SELECT id INTO session_id FROM daily_sessions WHERE session_name = 'Speed Development & Agility Training' LIMIT 1;
    
    -- Get exercise IDs
    SELECT id INTO warmup_ex_id FROM exercises WHERE name = 'Dynamic Stretching Routine' LIMIT 1;
    SELECT id INTO speed_ex_id FROM exercises WHERE name = '10-Yard Sprints' LIMIT 1;
    SELECT id INTO agility_ex_id FROM exercises WHERE name = 'Pro Agility (5-10-5)' LIMIT 1;
    SELECT id INTO plyo_ex_id FROM exercises WHERE name = 'Box Jumps' LIMIT 1;
    SELECT id INTO recovery_ex_id FROM exercises WHERE name = 'Foam Rolling - Lower Body' LIMIT 1;

    -- Insert session exercises
    INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, sets, reps, rest_seconds, intensity_percentage, notes) VALUES
    (gen_random_uuid(), session_id, warmup_ex_id, 1, 1, '15 minutes', 0, 70, 'Comprehensive warm-up routine'),
    (gen_random_uuid(), session_id, speed_ex_id, 2, 6, '10 yards', 120, 95, 'Maximum effort sprints'),
    (gen_random_uuid(), session_id, agility_ex_id, 3, 4, '1 attempt', 180, 90, 'Pro agility drill'),
    (gen_random_uuid(), session_id, plyo_ex_id, 4, 3, '5 jumps', 120, 85, 'Box jumps for power'),
    (gen_random_uuid(), session_id, recovery_ex_id, 5, 1, '15 minutes', 0, 60, 'Recovery work');

END $$;

-- Insert Recovery Routines
INSERT INTO recovery_routines (id, name, category, duration_minutes, description, equipment_needed, instructions) VALUES
(gen_random_uuid(), 'Post-Training Recovery', 'post_training', 20, 'Comprehensive recovery routine after intense training', '["foam_roller", "massage_gun"]', 'Complete all exercises in order, focusing on breathing and relaxation'),
(gen_random_uuid(), 'Rest Day Mobility', 'rest_day', 30, 'Light mobility work for rest days', '["yoga_mat", "resistance_band"]', 'Gentle movements to maintain range of motion'),
(gen_random_uuid(), 'Pre-Competition Prep', 'pre_competition', 15, 'Light activation before competition', '["resistance_band"]', 'Light activation work to prepare for competition'),
(gen_random_uuid(), 'Injury Prevention', 'injury_prevention', 25, 'Preventive exercises to reduce injury risk', '["foam_roller", "resistance_band"]', 'Focus on form and controlled movements');

-- Get recovery routine IDs and create recovery exercises
DO $$
DECLARE
    post_training_id UUID;
    rest_day_id UUID;
    pre_competition_id UUID;
    injury_prevention_id UUID;
    foam_roll_id UUID;
    stretch_id UUID;
    mobility_id UUID;
    activation_id UUID;
BEGIN
    -- Get recovery routine IDs
    SELECT id INTO post_training_id FROM recovery_routines WHERE name = 'Post-Training Recovery' LIMIT 1;
    SELECT id INTO rest_day_id FROM recovery_routines WHERE name = 'Rest Day Mobility' LIMIT 1;
    SELECT id INTO pre_competition_id FROM recovery_routines WHERE name = 'Pre-Competition Prep' LIMIT 1;
    SELECT id INTO injury_prevention_id FROM recovery_routines WHERE name = 'Injury Prevention' LIMIT 1;

    -- Get exercise IDs for recovery
    SELECT id INTO foam_roll_id FROM exercises WHERE name = 'Foam Rolling - Lower Body' LIMIT 1;
    SELECT id INTO stretch_id FROM exercises WHERE name = 'Static Stretching' LIMIT 1;
    SELECT id INTO mobility_id FROM exercises WHERE name = 'Dynamic Stretching Routine' LIMIT 1;
    SELECT id INTO activation_id FROM exercises WHERE name = 'Arm Circles' LIMIT 1;

    -- Insert recovery exercises for Post-Training Recovery
    INSERT INTO recovery_exercises (id, routine_id, name, duration_minutes, description, equipment, body_parts, order_in_routine, intensity_level) VALUES
    (gen_random_uuid(), post_training_id, 'Foam Rolling - Lower Body', 10, 'Release muscle tension in legs', 'foam_roller', '["legs"]', 1, 'light'),
    (gen_random_uuid(), post_training_id, 'Static Stretching', 10, 'Hold stretches for flexibility', 'none', '["full_body"]', 2, 'light');

    -- Insert recovery exercises for Rest Day Mobility
    INSERT INTO recovery_exercises (id, routine_id, name, duration_minutes, description, equipment, body_parts, order_in_routine, intensity_level) VALUES
    (gen_random_uuid(), rest_day_id, 'Dynamic Stretching Routine', 15, 'Gentle mobility work', 'none', '["full_body"]', 1, 'light'),
    (gen_random_uuid(), rest_day_id, 'Light Walking', 15, 'Easy movement', 'none', '["legs"]', 2, 'light');

    -- Insert recovery exercises for Pre-Competition Prep
    INSERT INTO recovery_exercises (id, routine_id, name, duration_minutes, description, equipment, body_parts, order_in_routine, intensity_level) VALUES
    (gen_random_uuid(), pre_competition_id, 'Arm Circles', 5, 'Shoulder activation', 'none', '["shoulders"]', 1, 'light'),
    (gen_random_uuid(), pre_competition_id, 'Light Jogging', 10, 'Cardiovascular activation', 'none', '["legs", "cardiovascular"]', 2, 'light');

    -- Insert recovery exercises for Injury Prevention
    INSERT INTO recovery_exercises (id, routine_id, name, duration_minutes, description, equipment, body_parts, order_in_routine, intensity_level) VALUES
    (gen_random_uuid(), injury_prevention_id, 'Hip Flexor Stretch', 5, 'Prevent hip tightness', 'none', '["hip_flexors"]', 1, 'light'),
    (gen_random_uuid(), injury_prevention_id, 'Calf Stretch', 5, 'Prevent calf tightness', 'none', '["calves"]', 2, 'light'),
    (gen_random_uuid(), injury_prevention_id, 'Shoulder Cross-Body Stretch', 5, 'Prevent shoulder tightness', 'none', '["shoulders"]', 3, 'light'),
    (gen_random_uuid(), injury_prevention_id, 'Foam Rolling - Lower Body', 10, 'Release muscle tension', 'foam_roller', '["legs"]', 4, 'light');

END $$;

-- Insert sample wellness logs (last 7 days)
DO $$
DECLARE
    athlete_profile_id UUID;
    current_date DATE := CURRENT_DATE;
    i INTEGER;
BEGIN
    -- Get a sample athlete profile ID (you'll need to create this first)
    -- For now, we'll use a placeholder - in real implementation, create athlete profiles first
    SELECT id INTO athlete_profile_id FROM athlete_profiles LIMIT 1;
    
    -- If no athlete profile exists, we'll skip this section
    IF athlete_profile_id IS NOT NULL THEN
        -- Insert wellness logs for the last 7 days
        FOR i IN 0..6 LOOP
            INSERT INTO wellness_logs (
                athlete_id, 
                log_date, 
                sleep_hours, 
                sleep_quality, 
                energy_level, 
                muscle_soreness, 
                stress_level, 
                motivation, 
                hydration_liters, 
                nutrition_quality, 
                notes
            ) VALUES (
                athlete_profile_id,
                current_date - i,
                7.5 + (random() * 2 - 1), -- 6.5 to 8.5 hours
                7 + floor(random() * 4), -- 7-10 quality
                8 + floor(random() * 3), -- 8-10 energy
                3 + floor(random() * 4), -- 3-6 soreness
                4 + floor(random() * 4), -- 4-7 stress
                8 + floor(random() * 3), -- 8-10 motivation
                2.5 + (random() * 1), -- 2.5-3.5 liters
                7 + floor(random() * 4), -- 7-10 nutrition
                CASE 
                    WHEN i = 0 THEN 'Feeling great today, ready for training'
                    WHEN i = 1 THEN 'Good recovery from yesterday''s session'
                    WHEN i = 2 THEN 'Slightly tired but motivated'
                    WHEN i = 3 THEN 'Well rested, high energy'
                    WHEN i = 4 THEN 'Normal day, consistent energy'
                    WHEN i = 5 THEN 'Good sleep, feeling strong'
                    ELSE 'Standard wellness check'
                END
            );
        END LOOP;
    END IF;
END $$;

-- Insert sample performance metrics
DO $$
DECLARE
    athlete_profile_id UUID;
    test_date DATE := CURRENT_DATE - 30; -- 30 days ago
    i INTEGER;
BEGIN
    -- Get a sample athlete profile ID
    SELECT id INTO athlete_profile_id FROM athlete_profiles LIMIT 1;
    
    -- If no athlete profile exists, we'll skip this section
    IF athlete_profile_id IS NOT NULL THEN
        -- Insert various performance metrics
        INSERT INTO performance_metrics (athlete_id, metric_type, value, unit, test_date, test_conditions, notes) VALUES
        (athlete_profile_id, 'forty_yard_dash', 4.8, 'seconds', test_date, 'Indoor facility, good conditions', 'Personal best'),
        (athlete_profile_id, 'vertical_jump', 28.5, 'inches', test_date, 'Indoor facility', 'Improved from last test'),
        (athlete_profile_id, 'broad_jump', 8.2, 'feet', test_date, 'Indoor facility', 'Good power output'),
        (athlete_profile_id, 'pro_agility', 4.6, 'seconds', test_date, 'Indoor facility', 'Quick change of direction'),
        (athlete_profile_id, 'body_weight', 175.5, 'pounds', test_date, 'Morning weigh-in', 'Maintaining weight'),
        (athlete_profile_id, 'body_fat_percentage', 12.5, 'percent', test_date, 'DEXA scan', 'Optimal for position');
    END IF;
END $$; 