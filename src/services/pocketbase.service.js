import PocketBase from 'pocketbase';

/**
 * PocketBase Service for FlagFit Pro
 * Replaces Supabase functionality with PocketBase equivalent
 */
class PocketBaseService {
  constructor() {
    this.pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090');
    this.authStore = this.pb.authStore;
  }

  // Authentication Methods
  /**
   * Sign up a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} - Created user record
   */
  async signUp(userData) {
    try {
      const record = await this.pb.collection('users').create({
        email: userData.email,
        password: userData.password,
        passwordConfirm: userData.password,
        name: userData.name,
        role: userData.role || 'player'
      });
      
      // Auto-login after signup
      await this.signIn(userData.email, userData.password);
      
      return {
        user: record,
        token: this.authStore.token
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Sign in user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} - User session data
   */
  async signIn(email, password) {
    try {
      const authData = await this.pb.collection('users').authWithPassword(email, password);
      return {
        user: authData.record,
        token: authData.token
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Sign out user
   * @returns {Promise<void>}
   */
  async signOut() {
    this.pb.authStore.clear();
  }

  /**
   * Get current user
   * @returns {Promise<Object|null>} - Current user or null
   */
  async getCurrentUser() {
    if (!this.authStore.isValid) {
      return null;
    }
    return this.authStore.model;
  }

  /**
   * Update user profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise<Object>} - Updated user record
   */
  async updateProfile(profileData) {
    try {
      const record = await this.pb.collection('users').update(this.authStore.model.id, profileData);
      return { user: record };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Database Operations
  /**
   * Create a record in a collection
   * @param {string} collection - Collection name
   * @param {Object} data - Record data
   * @returns {Promise<Object>} - Created record
   */
  async create(collection, data) {
    try {
      const record = await this.pb.collection(collection).create(data);
      return { data: record, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }

  /**
   * Get records from a collection
   * @param {string} collection - Collection name
   * @param {Object} options - Query options
   * @returns {Promise<Object>} - Records and metadata
   */
  async getList(collection, options = {}) {
    try {
      const { page = 1, perPage = 50, sort = '-created', filter = '' } = options;
      const records = await this.pb.collection(collection).getList(page, perPage, {
        sort,
        filter
      });
      return { data: records.items, count: records.totalItems, error: null };
    } catch (error) {
      return { data: null, count: 0, error: error.message };
    }
  }

  /**
   * Get a single record by ID
   * @param {string} collection - Collection name
   * @param {string} id - Record ID
   * @returns {Promise<Object>} - Record data
   */
  async getOne(collection, id) {
    try {
      const record = await this.pb.collection(collection).getOne(id);
      return { data: record, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }

  /**
   * Update a record
   * @param {string} collection - Collection name
   * @param {string} id - Record ID
   * @param {Object} data - Update data
   * @returns {Promise<Object>} - Updated record
   */
  async update(collection, id, data) {
    try {
      const record = await this.pb.collection(collection).update(id, data);
      return { data: record, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }

  /**
   * Delete a record
   * @param {string} collection - Collection name
   * @param {string} id - Record ID
   * @returns {Promise<Object>} - Deletion result
   */
  async delete(collection, id) {
    try {
      await this.pb.collection(collection).delete(id);
      return { data: { success: true }, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }

  // Real-time subscriptions (PocketBase equivalent)
  /**
   * Subscribe to real-time updates
   * @param {string} collection - Collection name
   * @param {Function} callback - Callback function for updates
   * @returns {Function} - Unsubscribe function
   */
  subscribe(collection, callback) {
    return this.pb.collection(collection).subscribe('*', callback);
  }

  /**
   * Subscribe to specific record changes
   * @param {string} collection - Collection name
   * @param {string} recordId - Record ID
   * @param {Function} callback - Callback function for updates
   * @returns {Function} - Unsubscribe function
   */
  subscribeToRecord(collection, recordId, callback) {
    return this.pb.collection(collection).subscribe(recordId, callback);
  }

  // File upload
  /**
   * Upload a file
   * @param {File} file - File to upload
   * @returns {Promise<Object>} - Upload result
   */
  async uploadFile(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const record = await this.pb.collection('files').create(formData);
      return { data: record, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }

  // Utility methods
  /**
   * Get file URL
   * @param {string} collection - Collection name
   * @param {string} recordId - Record ID
   * @param {string} filename - Filename
   * @returns {string} - File URL
   */
  getFileUrl(collection, recordId, filename) {
    return this.pb.files.getUrl(collection, recordId, filename);
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} - Authentication status
   */
  isAuthenticated() {
    return this.authStore.isValid;
  }

  /**
   * Get authentication token
   * @returns {string|null} - Auth token
   */
  getToken() {
    return this.authStore.token;
  }

  /**
   * Set authentication token
   * @param {string} token - Auth token
   */
  setToken(token) {
    this.authStore.save(token, this.authStore.model);
  }

  // Supabase compatibility methods
  /**
   * Supabase-compatible auth object
   */
  get auth() {
    return {
      signUp: async (credentials) => {
        return this.signUp(credentials);
      },
      signInWithPassword: async (credentials) => {
        return this.signIn(credentials.email, credentials.password);
      },
      signOut: async () => {
        return this.signOut();
      },
      getUser: async () => {
        const user = await this.getCurrentUser();
        return { data: { user }, error: null };
      },
      refreshSession: async () => {
        try {
          const authData = await this.pb.collection('users').authRefresh();
          return {
            data: { user: authData.record, token: authData.token },
            error: null
          };
        } catch (error) {
          return { data: null, error: error.message };
        }
      },
      resetPasswordForEmail: async (email) => {
        try {
          await this.pb.collection('users').requestPasswordReset(email);
          return { error: null };
        } catch (error) {
          return { error: error.message };
        }
      },
      updateUser: async (userData) => {
        try {
          const record = await this.updateProfile(userData);
          return { data: { user: record.user }, error: null };
        } catch (error) {
          return { data: null, error: error.message };
        }
      }
    };
  }

  /**
   * Supabase-compatible from method
   */
  from(collection) {
    return {
      select: (fields = '*') => {
        return {
          eq: (field, value) => {
            return {
              single: () => {
                return {
                  then: async (callback) => {
                    try {
                      const result = await this.getOne(collection, value);
                      return callback(result);
                    } catch (error) {
                      return callback({ data: null, error: error.message });
                    }
                  }
                };
              },
              then: async (callback) => {
                try {
                  const result = await this.getList(collection, {
                    filter: `${field} = "${value}"`
                  });
                  return callback(result);
                } catch (error) {
                  return callback({ data: null, error: error.message });
                }
              }
            };
          },
          order: (field, options = {}) => {
            return {
              then: async (callback) => {
                try {
                  const result = await this.getList(collection, {
                    sort: options.ascending ? field : `-${field}`
                  });
                  return callback(result);
                } catch (error) {
                  return callback({ data: null, error: error.message });
                }
              }
            };
          },
          gte: (field, value) => {
            return {
              lte: (field2, value2) => {
                return {
                  single: () => {
                    return {
                      then: async (callback) => {
                        try {
                          const result = await this.getList(collection, {
                            filter: `${field} >= "${value}" && ${field2} <= "${value2}"`
                          });
                          return callback({ data: result.data[0] || null, error: null });
                        } catch (error) {
                          return callback({ data: null, error: error.message });
                        }
                      }
                    };
                  },
                  then: async (callback) => {
                    try {
                      const result = await this.getList(collection, {
                        filter: `${field} >= "${value}" && ${field2} <= "${value2}"`
                      });
                      return callback(result);
                    } catch (error) {
                      return callback({ data: null, error: error.message });
                    }
                  }
                };
              }
            };
          },
          then: async (callback) => {
            try {
              const result = await this.getList(collection);
              return callback(result);
            } catch (error) {
              return callback({ data: null, error: error.message });
            }
          }
        };
      },
      insert: (data) => {
        return {
          select: () => {
            return {
              single: () => {
                return {
                  then: async (callback) => {
                    try {
                      const result = await this.create(collection, data);
                      return callback(result);
                    } catch (error) {
                      return callback({ data: null, error: error.message });
                    }
                  }
                };
              }
            };
          }
        };
      }
    };
  }
}

// Export singleton instance
export const pocketbaseService = new PocketBaseService(); 