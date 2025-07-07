import 'dotenv/config';
import express from 'express';
import { Pool } from 'pg';
import cors from 'cors';
import morgan from 'morgan';
const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:5173', credentials: true }));
app.use(morgan('dev'));

// Postgres connection
const pool = new Pool({
  user: process.env.PGUSER || 'postgres',
  host: process.env.PGHOST || 'localhost',
  database: process.env.PGDATABASE || 'flagfit',
  password: process.env.PGPASSWORD || '',
  port: process.env.PGPORT ? parseInt(process.env.PGPORT) : 5432,
});

// Helper: Validate athlete data
function validateAthleteData(d) {
  if (!d.athlete_id || !d.log_date) return 'Missing athlete_id or log_date';
  if (typeof d.equipment_available !== 'boolean') return 'equipment_available must be boolean';
  if (d.rpe_score && (d.rpe_score < 1 || d.rpe_score > 10)) return 'rpe_score out of range';
  return null;
}

// Log athlete data
app.post('/api/athlete/data', async (req, res) => {
  try {
    const d = req.body;
    const validationError = validateAthleteData(d);
    if (validationError) return res.status(400).json({ error: validationError });
    await pool.query(
      `INSERT INTO athlete_data (
        athlete_id, log_date, position, forty_yard_dash, agility_time, vertical_jump,
        sleep_hours, hrv, rpe_score, stress_level, training_load, completion_rate,
        form_quality_score, weather, equipment_available, feedback
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
      ON CONFLICT (athlete_id, log_date) DO UPDATE SET
        position=EXCLUDED.position, forty_yard_dash=EXCLUDED.forty_yard_dash, agility_time=EXCLUDED.agility_time,
        vertical_jump=EXCLUDED.vertical_jump, sleep_hours=EXCLUDED.sleep_hours, hrv=EXCLUDED.hrv,
        rpe_score=EXCLUDED.rpe_score, stress_level=EXCLUDED.stress_level, training_load=EXCLUDED.training_load,
        completion_rate=EXCLUDED.completion_rate, form_quality_score=EXCLUDED.form_quality_score,
        weather=EXCLUDED.weather, equipment_available=EXCLUDED.equipment_available, feedback=EXCLUDED.feedback,
        created_at=NOW()`,
      [
        d.athlete_id, d.log_date, d.position, d.forty_yard_dash, d.agility_time, d.vertical_jump,
        d.sleep_hours, d.hrv, d.rpe_score, d.stress_level, d.training_load, d.completion_rate,
        d.form_quality_score, d.weather, d.equipment_available, d.feedback
      ]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Log recommendation engagement
app.post('/api/athlete/recommendation', async (req, res) => {
  try {
    const d = req.body;
    if (!d.athlete_id || !d.log_date || !d.recommendation_type) return res.status(400).json({ error: 'Missing required fields' });
    await pool.query(
      `INSERT INTO ai_recommendation_logs (
        athlete_id, log_date, recommendation_type, recommendation_value, accepted, engagement_score
      ) VALUES ($1,$2,$3,$4,$5,$6)`,
      [
        d.athlete_id, d.log_date, d.recommendation_type,
        d.recommendation_value, d.accepted, d.engagement_score
      ]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get latest athlete data
app.get('/api/athlete/data/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM athlete_data WHERE athlete_id = $1 ORDER BY log_date DESC LIMIT 1`, [req.params.id]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get athlete profile
app.get('/api/athlete/profile/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM athlete_profiles WHERE id = $1`, [req.params.id]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a test athlete (for demo)
app.post('/api/athlete/profile', async (req, res) => {
  try {
    const { name, position } = req.body;
    if (!name || !position) return res.status(400).json({ error: 'Missing name or position' });
    const { rows } = await pool.query(
      `INSERT INTO athlete_profiles (name, position) VALUES ($1, $2) RETURNING *`, [name, position]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API running on port ${PORT}`)); 