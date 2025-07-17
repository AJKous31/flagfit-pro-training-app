import PocketBase from 'pocketbase';
import { createContext, useState, useEffect, useMemo, useCallback, useContext } from 'react';

export const PocketContext = createContext(null);

export function PocketProvider({ children }) {
  // Create PocketBase instance ONCE and reuse it
  const pb = useMemo(() => new PocketBase(import.meta.env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090'), []);

  // Sync React state with PocketBase authStore
  const [token, setToken] = useState(pb.authStore.token);
  const [user, setUser] = useState(pb.authStore.model);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Subscribe to authStore changes to keep React state in sync
  useEffect(() => {
    const unsubscribe = pb.authStore.onChange((token, model) => {
      console.log('PocketBase authStore changed:', { hasToken: !!token, userEmail: model?.email });
      setToken(token);
      setUser(model);
    });

    return unsubscribe;
  }, [pb]);

  // Auto-refresh token every 2 minutes if valid
  useEffect(() => {
    const refreshInterval = setInterval(async () => {
      if (pb.authStore.isValid) {
        try {
          console.log('Auto-refreshing token...');
          await pb.collection('_pb_users_auth_').authRefresh();
        } catch (error) {
          console.error('Token refresh failed:', error);
          // Token is invalid, clear it
          pb.authStore.clear();
        }
      }
    }, 120000); // 2 minutes

    return () => clearInterval(refreshInterval);
  }, [pb]);

  // Actions
  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('PocketContext: Attempting login for:', email);
      
      // This will automatically update authStore and trigger onChange
      const authData = await pb.collection('_pb_users_auth_').authWithPassword(email, password);
      
      console.log('PocketContext: Login successful:', {
        userEmail: authData.record?.email,
        hasToken: !!authData.token
      });
      
      return authData;
    } catch (error) {
      console.error('PocketContext: Login failed:', error);
      setError(error.message || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [pb]);

  const register = useCallback(async (userData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('PocketContext: Attempting registration for:', userData.email);
      
      // Create user account
      const userPayload = {
        email: userData.email,
        password: userData.password,
        passwordConfirm: userData.password
      };
      
      // Add name if provided
      if (userData.firstName || userData.lastName) {
        userPayload.name = `${userData.firstName || ''} ${userData.lastName || ''}`.trim();
      }
      
      const record = await pb.collection('_pb_users_auth_').create(userPayload);
      
      console.log('PocketContext: Registration successful for:', record.email);
      
      // Don't auto-login after registration to avoid conflicts
      return {
        user: record,
        requiresLogin: true
      };
    } catch (error) {
      console.error('PocketContext: Registration failed:', error);
      setError(error.message || 'Registration failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [pb]);

  const logout = useCallback(() => {
    console.log('PocketContext: Logging out');
    pb.authStore.clear(); // This will trigger onChange and clear React state
    setError(null);
  }, [pb]);

  const updateProfile = useCallback(async (profileData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('PocketContext: Updating profile');
      
      // Update user profile via PocketBase
      const record = await pb.collection('_pb_users_auth_').update(pb.authStore.model.id, profileData);
      
      // The authStore should update automatically, but we can force it
      setUser(record);
      
      console.log('PocketContext: Profile updated successfully');
      return { user: record };
    } catch (error) {
      console.error('PocketContext: Profile update failed:', error);
      setError(error.message || 'Profile update failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [pb]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = useMemo(() => ({
    pb,
    token,
    user,
    isLoading,
    error,
    isAuthenticated: !!token && pb.authStore.isValid,
    login,
    register,
    logout,
    updateProfile,
    clearError
  }), [pb, token, user, isLoading, error, login, register, logout, updateProfile, clearError]);

  return (
    <PocketContext.Provider value={value}>
      {children}
    </PocketContext.Provider>
  );
}

// Custom hook to use PocketBase context
export const usePocket = () => {
  const context = useContext(PocketContext);
  if (!context) {
    throw new Error('usePocket must be used within a PocketProvider');
  }
  return context;
};