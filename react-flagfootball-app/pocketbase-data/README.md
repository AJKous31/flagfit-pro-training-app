# PocketBase Sample Data

This directory contains sample data files for importing into your PocketBase collections.

## Files

1. **training_sessions.json** - Sample training sessions with various workout types
2. **training_goals.json** - Sample fitness and training goals with progress tracking
3. **analytics_events.json** - Sample user activity and event tracking data

## How to Import

### Method 1: Through PocketBase Admin Interface
1. Go to http://127.0.0.1:8090/_/
2. Navigate to each collection
3. Use the "Import" feature to upload the corresponding JSON file

### Method 2: Using the API (with authentication)
You can also import these programmatically using the PocketBase API.

## Data Details

### Training Sessions
- 5 sample sessions covering all workout types (strength, agility, endurance, skills)
- Mix of completed and upcoming sessions
- Realistic exercise data with sets, reps, and performance metrics

### Training Goals
- 6 sample goals with different completion states
- Progress tracking from 16% to 100%
- Mix of short-term and long-term objectives

### Analytics Events
- 8 sample events tracking user activity
- Session completions, goal updates, logins, and page views
- Realistic event data with timestamps and metadata

## User ID
All sample data is tied to the test user ID: `2r0qfh3uy6j8zui`

This matches the test user created with:
- Email: test@flagfitpro.com
- Password: testpassword123

## After Import
Once imported, the app will show:
- Training session history and upcoming workouts
- Goal progress with visual indicators
- Analytics data for dashboard insights
- Realistic user experience with actual data