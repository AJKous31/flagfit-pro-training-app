-- Add unique constraint for daily logs
ALTER TABLE athlete_data
ADD CONSTRAINT unique_athlete_log_date UNIQUE (athlete_id, log_date);

-- Add indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_athlete_data_athlete_id ON athlete_data(athlete_id);
CREATE INDEX IF NOT EXISTS idx_athlete_data_log_date ON athlete_data(log_date);

-- Add value constraints for RPE and form quality
ALTER TABLE athlete_data
ADD CONSTRAINT chk_rpe_score CHECK (rpe_score BETWEEN 1 AND 10),
ADD CONSTRAINT chk_form_quality_score CHECK (form_quality_score BETWEEN 0 AND 10);

-- Ensure boolean consistency (no code needed if using BOOLEAN type, but document for devs)
-- All code should use true/false for equipment_available, not 0/1 or string values. 