# PocketBase Collection Setup Guide

## Step 1: Create training_sessions Collection

Go to http://127.0.0.1:8090/_/ and create a new collection with these settings:

### Collection: training_sessions
**Type**: Base collection

**Fields**:
1. `user_id` (Relation)
   - Collection: users
   - Required: Yes

2. `title` (Text)
   - Required: Yes
   - Max length: 255

3. `description` (Text)
   - Required: No
   - Max length: 1000

4. `session_type` (Select)
   - Required: Yes
   - Values: strength, agility, endurance, skills

5. `duration` (Number)
   - Required: No
   - Min: 0
   - Max: 300

6. `date` (Date)
   - Required: Yes

7. `exercises` (JSON)
   - Required: No

8. `completed` (Bool)
   - Required: No
   - Default: false

**API Rules**:
- List/Search: `@request.auth.id != ""`
- View: `@request.auth.id != ""`
- Create: `@request.auth.id != "" && @request.data.user_id = @request.auth.id`
- Update: `@request.auth.id != "" && user_id = @request.auth.id`
- Delete: `@request.auth.id != "" && user_id = @request.auth.id`

## Step 2: Create training_goals Collection

### Collection: training_goals
**Type**: Base collection

**Fields**:
1. `user_id` (Relation)
   - Collection: users
   - Required: Yes

2. `title` (Text)
   - Required: Yes
   - Max length: 255

3. `description` (Text)
   - Required: No
   - Max length: 1000

4. `target_date` (Date)
   - Required: No

5. `completed` (Bool)
   - Required: Yes
   - Default: false

6. `progress` (Number)
   - Required: No
   - Min: 0
   - Max: 100

**API Rules**: Same as training_sessions

## Step 3: Create analytics_events Collection

### Collection: analytics_events
**Type**: Base collection

**Fields**:
1. `user_id` (Relation)
   - Collection: users
   - Required: Yes

2. `event_type` (Text)
   - Required: Yes
   - Max length: 100

3. `event_data` (JSON)
   - Required: No

4. `timestamp` (Date)
   - Required: Yes

5. `session_id` (Text)
   - Required: No
   - Max length: 100

**API Rules**: Same as training_sessions

## Step 4: Import Data

After creating the collections with the exact field types above, try importing:

1. `training_sessions_simple.json` first (without complex exercises data)
2. `training_goals.json`
3. `analytics_events.json`

## Troubleshooting

If you still get "Invalid collections configuration":

1. **Check field types** - Make sure JSON fields are set to "JSON" type
2. **Check required fields** - All required fields must have values
3. **Check user_id** - Make sure the user ID `2r0qfh3uy6j8zui` exists
4. **Date format** - Try format: `2025-07-14T07:00:00.000Z`

## Alternative: Manual Entry

If import continues to fail, you can manually create 1-2 records through the PocketBase admin interface to test the app functionality.