-- Performance Optimization SQL for FlagFit Pro
-- This file contains all database optimizations to improve query performance

-- =====================================================
-- CRITICAL INDEXES FOR PERFORMANCE
-- =====================================================

-- 1. Training Logs - Most critical for athlete progress queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_training_logs_athlete_date 
ON training_logs(athlete_id, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_training_logs_exercise_athlete 
ON training_logs(exercise_id, athlete_id, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_training_logs_recent 
ON training_logs(athlete_id, created_at) 
WHERE created_at > NOW() - INTERVAL '30 days';

-- 2. Athlete Sessions - For session management
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_athlete_sessions_athlete_date 
ON athlete_sessions(athlete_id, scheduled_date);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_athlete_sessions_completion 
ON athlete_sessions(athlete_id, completed_date) 
WHERE completed_date IS NOT NULL;

-- 3. Exercises - For exercise library queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_exercises_category_active 
ON exercises(category_id, is_active) WHERE is_active = true;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_exercises_difficulty_active 
ON exercises(difficulty_level, is_active) WHERE is_active = true;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_exercises_position_gin 
ON exercises USING GIN(position_specific);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_exercises_equipment_gin 
ON exercises USING GIN(equipment_needed);

-- 4. Athlete Profiles - For team analytics
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_athlete_profiles_team 
ON athlete_profiles(team_id, fitness_level);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_athlete_profiles_user 
ON athlete_profiles(user_id);

-- 5. Users - For authentication and role-based queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_team_role 
ON users(team_id, role);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_role 
ON users(role);

-- 6. Performance Metrics - For analytics
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_performance_metrics_athlete_date 
ON performance_metrics(athlete_id, test_date DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_performance_metrics_type_date 
ON performance_metrics(metric_type, test_date DESC);

-- 7. Training Programs - For program management
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_training_programs_team 
ON training_programs(team_id, is_active) WHERE is_active = true;

-- 8. Daily Sessions - For session templates
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_daily_sessions_template 
ON daily_sessions(weekly_template_id, day_of_week);

-- 9. Session Exercises - For exercise ordering
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_session_exercises_session_order 
ON session_exercises(session_id, order_in_session);

-- =====================================================
-- COMPOSITE INDEXES FOR COMPLEX QUERIES
-- =====================================================

-- Multi-column indexes for complex filtering
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_training_logs_athlete_exercise_date 
ON training_logs(athlete_id, exercise_id, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_athlete_sessions_athlete_status_date 
ON athlete_sessions(athlete_id, completion_percentage, scheduled_date);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_exercises_category_difficulty_active 
ON exercises(category_id, difficulty_level, is_active) WHERE is_active = true;

-- =====================================================
-- PARTIAL INDEXES FOR FILTERED QUERIES
-- =====================================================

-- Recent data only
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_training_logs_recent_7d 
ON training_logs(athlete_id, created_at) 
WHERE created_at > NOW() - INTERVAL '7 days';

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_training_logs_recent_90d 
ON training_logs(athlete_id, created_at) 
WHERE created_at > NOW() - INTERVAL '90 days';

-- Active sessions only
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_athlete_sessions_active 
ON athlete_sessions(athlete_id, scheduled_date) 
WHERE completion_percentage < 100;

-- Completed sessions only
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_athlete_sessions_completed 
ON athlete_sessions(athlete_id, completed_date) 
WHERE completion_percentage = 100;

-- =====================================================
-- FUNCTIONAL INDEXES FOR COMPLEX QUERIES
-- =====================================================

-- Date-based queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_training_logs_date_trunc 
ON training_logs(athlete_id, DATE_TRUNC('day', created_at));

-- Text search (if using full-text search)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_exercises_name_search 
ON exercises USING GIN(to_tsvector('english', name));

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- Athlete Progress Summary View
CREATE OR REPLACE VIEW athlete_progress_summary AS
SELECT 
    tl.athlete_id,
    DATE_TRUNC('week', tl.created_at) as week_start,
    COUNT(*) as total_sessions,
    AVG(tl.rpe_score) as avg_rpe,
    SUM(tl.duration_minutes) as total_duration,
    COUNT(DISTINCT tl.exercise_id) as unique_exercises
FROM training_logs tl
WHERE tl.created_at > NOW() - INTERVAL '90 days'
GROUP BY tl.athlete_id, DATE_TRUNC('week', tl.created_at);

-- Team Analytics View
CREATE OR REPLACE VIEW team_analytics_summary AS
SELECT 
    t.id as team_id,
    t.name as team_name,
    COUNT(DISTINCT ap.id) as athlete_count,
    COUNT(DISTINCT ap.id) FILTER (WHERE ap.fitness_level = 'beginner') as beginner_count,
    COUNT(DISTINCT ap.id) FILTER (WHERE ap.fitness_level = 'intermediate') as intermediate_count,
    COUNT(DISTINCT ap.id) FILTER (WHERE ap.fitness_level = 'advanced') as advanced_count,
    AVG(tl.rpe_score) as avg_team_rpe,
    COUNT(DISTINCT as.id) FILTER (WHERE as.completed_date::date = CURRENT_DATE) as sessions_today,
    COUNT(DISTINCT as.id) FILTER (WHERE as.completed_date >= CURRENT_DATE - INTERVAL '7 days') as sessions_this_week
FROM teams t
LEFT JOIN athlete_profiles ap ON ap.team_id = t.id
LEFT JOIN training_logs tl ON tl.athlete_id = ap.id AND tl.created_at > NOW() - INTERVAL '30 days'
LEFT JOIN athlete_sessions as ON as.athlete_id = ap.id
GROUP BY t.id, t.name;

-- Exercise Usage Analytics View
CREATE OR REPLACE VIEW exercise_usage_analytics AS
SELECT 
    e.id as exercise_id,
    e.name as exercise_name,
    ec.name as category_name,
    COUNT(tl.id) as usage_count,
    AVG(tl.rpe_score) as avg_rpe,
    AVG(tl.duration_minutes) as avg_duration,
    COUNT(DISTINCT tl.athlete_id) as unique_athletes
FROM exercises e
LEFT JOIN exercise_categories ec ON ec.id = e.category_id
LEFT JOIN training_logs tl ON tl.exercise_id = e.id AND tl.created_at > NOW() - INTERVAL '90 days'
WHERE e.is_active = true
GROUP BY e.id, e.name, ec.name
ORDER BY usage_count DESC;

-- =====================================================
-- MATERIALIZED VIEWS FOR HEAVY ANALYTICS
-- =====================================================

-- Athlete Performance Trends (refreshed daily)
CREATE MATERIALIZED VIEW IF NOT EXISTS athlete_performance_trends AS
SELECT 
    athlete_id,
    DATE_TRUNC('day', created_at) as date,
    COUNT(*) as sessions_count,
    AVG(rpe_score) as avg_rpe,
    SUM(duration_minutes) as total_duration,
    COUNT(DISTINCT exercise_id) as exercises_count
FROM training_logs
WHERE created_at > NOW() - INTERVAL '365 days'
GROUP BY athlete_id, DATE_TRUNC('day', created_at)
ORDER BY athlete_id, date;

-- Create index on materialized view
CREATE INDEX IF NOT EXISTS idx_athlete_performance_trends_athlete_date 
ON athlete_performance_trends(athlete_id, date);

-- Refresh function for materialized views
CREATE OR REPLACE FUNCTION refresh_analytics_views()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY athlete_performance_trends;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- QUERY OPTIMIZATION EXAMPLES
-- =====================================================

-- Example 1: Optimized athlete progress query
-- BEFORE: SELECT * FROM training_logs WHERE athlete_id = ? ORDER BY created_at DESC
-- AFTER: Uses idx_training_logs_athlete_date for efficient sorting

-- Example 2: Optimized team analytics query
-- BEFORE: Multiple separate queries for team data
-- AFTER: Use team_analytics_summary view

-- Example 3: Optimized exercise filtering
-- BEFORE: SELECT * FROM exercises WHERE category_id = ? AND is_active = true
-- AFTER: Uses idx_exercises_category_active partial index

-- =====================================================
-- PERFORMANCE MONITORING QUERIES
-- =====================================================

-- Check index usage
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;

-- Check slow queries
SELECT 
    query,
    calls,
    total_time,
    mean_time,
    rows
FROM pg_stat_statements
WHERE mean_time > 100  -- queries taking more than 100ms
ORDER BY mean_time DESC
LIMIT 10;

-- Check table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- =====================================================
-- MAINTENANCE SCRIPTS
-- =====================================================

-- Update table statistics (run weekly)
-- ANALYZE;

-- Vacuum tables (run monthly)
-- VACUUM ANALYZE;

-- Reindex tables (run quarterly)
-- REINDEX TABLE CONCURRENTLY training_logs;
-- REINDEX TABLE CONCURRENTLY athlete_sessions;
-- REINDEX TABLE CONCURRENTLY exercises;

-- =====================================================
-- PERFORMANCE CONFIGURATION
-- =====================================================

-- Recommended PostgreSQL settings for performance:
-- shared_buffers = 25% of RAM
-- effective_cache_size = 75% of RAM
-- work_mem = 4MB (adjust based on concurrent users)
-- maintenance_work_mem = 256MB
-- checkpoint_completion_target = 0.9
-- wal_buffers = 16MB
-- default_statistics_target = 100
-- random_page_cost = 1.1 (for SSD)
-- effective_io_concurrency = 200 (for SSD)

-- =====================================================
-- MONITORING AND ALERTS
-- =====================================================

-- Create function to monitor slow queries
CREATE OR REPLACE FUNCTION check_slow_queries()
RETURNS TABLE(query text, avg_time numeric) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pg_stat_statements.query,
        pg_stat_statements.mean_time
    FROM pg_stat_statements
    WHERE mean_time > 1000  -- 1 second threshold
    ORDER BY mean_time DESC;
END;
$$ LANGUAGE plpgsql;

-- Create function to monitor index usage
CREATE OR REPLACE FUNCTION check_unused_indexes()
RETURNS TABLE(tablename text, indexname text, indexdef text) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.tablename,
        i.indexname,
        i.indexdef
    FROM pg_indexes i
    JOIN pg_tables t ON i.tablename = t.tablename
    LEFT JOIN pg_stat_user_indexes s ON s.indexrelname = i.indexname
    WHERE s.idx_scan IS NULL OR s.idx_scan = 0
    AND i.schemaname = 'public';
END;
$$ LANGUAGE plpgsql; 