# Debugging Steps for Login Issues

## Step 1: Clear Browser Cache and Local Storage

### Chrome/Edge:
1. Open DevTools (F12)
2. Right-click the refresh button → "Empty Cache and Hard Reload"
3. Go to Application tab → Storage → Clear storage → "Clear site data"

### Alternative method:
1. Open DevTools (F12)
2. Go to Application tab
3. Under Storage:
   - Click "Local Storage" → delete all entries
   - Click "Session Storage" → delete all entries
   - Click "Cookies" → delete all cookies for localhost

## Step 2: Check Network Requests

### What to Look For:
1. **PocketBase API calls** to http://127.0.0.1:8090
2. **Authentication requests** to `/api/collections/users/auth-with-password`
3. **Data fetching requests** after login
4. **Failed requests** (red entries in Network tab)

### How to Check:
1. Open DevTools → Network tab
2. Refresh page and attempt login
3. Look for:
   - ✅ 200 responses for successful requests
   - ❌ 401/403 for auth failures
   - ❌ 404 for missing endpoints
   - ❌ 500 for server errors

## Step 3: Verify API Endpoints

### Manual PocketBase Check:
```bash
# Test PocketBase health
curl http://127.0.0.1:8090/api/health

# Test collections exist
curl http://127.0.0.1:8090/api/collections

# Test user authentication (should work after login via app)
curl -X POST http://127.0.0.1:8090/api/collections/users/auth-with-password \
  -H "Content-Type: application/json" \
  -d '{"identity":"aljosa@ljubljanafrogs.si","password":"Futsal12!!!"}'
```

## Step 4: Review Authentication Flow

### Expected Console Messages:
```
AuthContext: Starting login process
Attempting login with: {email: "aljosa@ljubljanafrogs.si", password: "Fut***"}
Login successful: {user: "aljosa@ljubljanafrogs.si", hasToken: true}
AuthContext: Login service returned result, calling loginSuccess
AuthContext: LoginSuccess called, new auth state should be: {isAuthenticated: true, user: "aljosa@..."}
AuthContext: Current state update: {isAuthenticated: true, isLoading: false, hasUser: true, ...}
Initializing training data for authenticated user...
Initializing analytics data for authenticated user...
```

### If You See:
- ❌ "Failed to authenticate" → Check PocketBase user exists
- ❌ "Connection refused" → Check PocketBase is running
- ❌ "Auth not ready" loops → Auth state not updating properly

## Step 5: Console Error Details

### Environment Errors:
- ✅ Should be FIXED: No more Sentry DSN validation errors
- ✅ Should be FIXED: No more environment configuration errors

### Authentication Errors:
- Look for PocketBase connection issues
- Check for JWT token problems
- Verify user credentials

### Context Errors:
- ✅ Should be FIXED: No more infinite "auth not ready" loops
- ✅ Should be FIXED: Contexts should initialize after login

## Troubleshooting Actions

### If Login Still Fails:
1. **Check PocketBase is running**: `curl http://127.0.0.1:8090/api/health`
2. **Verify user exists**: Check PocketBase admin at http://127.0.0.1:8090/_/
3. **Check credentials**: Email: `aljosa@ljubljanafrogs.si`, Password: `Futsal12!!!`
4. **Clear all storage**: Use Step 1 above
5. **Restart dev server**: `npm run dev`

### If Environment Errors Persist:
1. Check `.env` and `.env.local` files have `VITE_ENABLE_SENTRY=false`
2. Restart dev server after environment changes
3. Check no hardcoded Sentry DSN values remain

### If Auth State Doesn't Update:
1. Look for "AuthContext: Current state update" messages
2. Check if `isAuthenticated` changes to `true` after login
3. Verify contexts respond to auth state changes