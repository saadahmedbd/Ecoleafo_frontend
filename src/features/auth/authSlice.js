import { createSlice } from '@reduxjs/toolkit';
import { buyerAuthApi } from './buyerAuthApi';
import { sellerAuthApi } from './sellerAuthApi';
import { adminAuthApi } from './adminAuthApi';

const loadInitialState = () => {
  try {
    const token = localStorage.getItem('auth_token');
    const refreshToken = localStorage.getItem('refresh_token'); // ADD THIS
    const userData = localStorage.getItem('user_data');
    const rememberMe = localStorage.getItem('remember_me') === 'true';

    if (token && userData) {
      const user = JSON.parse(userData);
      return {
        isAuthenticated: true,
        token,
        refreshToken, 
        user,
        role: user?.userType || user?.role || null,
        rememberMe,
        isLoading: false,
        error: null,
        profileStatus: null,
      };
    }
  } catch (error) {
    console.error('Error loading auth state:', error);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token'); 
    localStorage.removeItem('user_data');
  }

  return {
    isAuthenticated: false,
    token: null,
    refreshToken: null, 
    user: null,
    role: null,
    rememberMe: false,
    isLoading: false,
    error: null,
    profileStatus: null,
  };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: loadInitialState(),
  
  reducers: {
    setCredentials: (state, action) => {
      const { token, refresh_token, user, rememberMe } = action.payload;
      
      state.isAuthenticated = true;
      state.token = token;
      state.refreshToken = refresh_token; 
      state.user = user;
      state.role = user.userType || user.role || user.user_type;
      state.rememberMe = rememberMe || false;
      state.error = null;

      // Persist to localStorage
      localStorage.setItem('auth_token', token);
      localStorage.setItem('refresh_token', refresh_token); 
      localStorage.setItem('user_data', JSON.stringify(user));
      
      if (rememberMe) {
        localStorage.setItem('remember_me', 'true');
      }
    },

    // FIX: Correct syntax for updateToken
    updateToken: (state, action) => {
      const { access_token, refresh_token } = action.payload;
      state.token = access_token;
      state.refreshToken = refresh_token;
      localStorage.setItem('auth_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
    },

    setProfileStatus: (state, action) => {
      state.profileStatus = action.payload;
    },

    setAdminAuth: (state, action) => {
      const { token, refresh_token, user } = action.payload;
      state.isAuthenticated = true;
      state.token = token;
      state.refreshToken = refresh_token;
      state.user = user;
      state.role = 'admin';
      state.error = null;
      
      localStorage.setItem('auth_token', token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('user_data', JSON.stringify(user));
    },

    clearAdminAuth: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.refreshToken = null;
      state.user = null;
      state.role = null;
      state.error = null;

      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_data');
    },

    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.refreshToken = null; 
      state.user = null;
      state.role = null;
      state.rememberMe = false;
      state.error = null;
      state.profileStatus = null;

      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token'); 
      localStorage.removeItem('user_data');
      localStorage.removeItem('remember_me');
    },

    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.refreshToken = null;
      state.user = null;
      state.role = null;
      state.rememberMe = false;
      state.error = null;
      state.profileStatus = null;

      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_data');
      localStorage.removeItem('remember_me');
    },

    setAuthError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    clearAuthError: (state) => {
      state.error = null;
    },

    setAuthLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },

  extraReducers: (builder) => {
    // Buyer Registration
    builder.addMatcher(
      buyerAuthApi.endpoints.register.matchFulfilled,
      (state, action) => {
        const { token, refresh_token, user } = action.payload; 
        
        state.isAuthenticated = true;
        state.token = token;
        state.refreshToken = refresh_token; 
        state.user = user;
        state.role = 'buyer';
        state.isLoading = false;
        state.error = null;

        localStorage.setItem('auth_token', token);
        localStorage.setItem('refresh_token', refresh_token);
        localStorage.setItem('user_data', JSON.stringify(user));
      }
    );

    // Buyer Login
    builder.addMatcher(
      buyerAuthApi.endpoints.login.matchFulfilled,
      (state, action) => {
        const { token, refresh_token, user, rememberMe } = action.payload;// ADD refresh_token
        
        state.isAuthenticated = true;
        state.token = token;
        state.refreshToken = refresh_token; // ADD THIS
        state.user = user;
        state.role = 'buyer';
        state.rememberMe = rememberMe || false;
        state.isLoading = false;
        state.error = null;

        localStorage.setItem('auth_token', token);
        localStorage.setItem('refresh_token', refresh_token); // ADD THIS
        localStorage.setItem('user_data', JSON.stringify(user));
        
        if (rememberMe) {
          localStorage.setItem('remember_me', 'true');
        }
      }
    );

    // Seller Registration
    builder.addMatcher(
      sellerAuthApi.endpoints.registerSeller.matchFulfilled,
      (state, action) => {
        const { token, refresh_token, user_id, seller_id, profile_status } = action.payload;
        
        state.isAuthenticated = true;
        state.token = token;
        state.refreshToken = refresh_token; 
        state.user = {
          id: user_id,
          seller_id: seller_id,
          userType: 'seller',
        };
        state.role = 'seller';
        state.profileStatus = profile_status;
        state.isLoading = false;
        state.error = null;

        localStorage.setItem('auth_token', token);
        localStorage.setItem('refresh_token', refresh_token); // ADD THIS
        localStorage.setItem('user_data', JSON.stringify(state.user));
      }
    );

    // Seller Login
    builder.addMatcher(
      sellerAuthApi.endpoints.loginSeller.matchFulfilled,
      (state, action) => {
        const { token, refresh_token, user, profile_status } = action.payload;
        
        state.isAuthenticated = true;
        state.token = token;
        state.refreshToken = refresh_token;
        state.user = user;
        state.role = user?.userType || 'seller';
        state.profileStatus = profile_status;
        state.isLoading = false;
        state.error = null;

        localStorage.setItem('auth_token', token);
        localStorage.setItem('refresh_token', refresh_token);
        localStorage.setItem('user_data', JSON.stringify(user));
      }
    );
     // Admin Login
    builder.addMatcher(
      adminAuthApi.endpoints.adminLogin.matchFulfilled,
      (state, action) => {
        const { token, refresh_token, user } = action.payload;
        
        state.isAuthenticated = true;
        state.token = token;
        state.refreshToken = refresh_token;
        state.user = user;
        state.role = 'admin';
        state.isLoading = false;
        state.error = null;

        localStorage.setItem('auth_token', token);
        localStorage.setItem('refresh_token', refresh_token);
        localStorage.setItem('user_data', JSON.stringify(user));
      }
    );

    // Admin Registration
    builder.addMatcher(
      adminAuthApi.endpoints.registerAdmin.matchFulfilled,
      (state, action) => {
        const { token, refresh_token, user } = action.payload;
        
        state.isAuthenticated = true;
        state.token = token;
        state.refreshToken = refresh_token;
        state.user = user;
        state.role = 'admin';
        state.isLoading = false;
        state.error = null;

        localStorage.setItem('auth_token', token);
        localStorage.setItem('refresh_token', refresh_token);
        localStorage.setItem('user_data', JSON.stringify(user));
      }
    );

    // Logout
    builder.addMatcher(
      (action) => 
        action.type === buyerAuthApi.endpoints.logout.matchFulfilled.type ||
        action.type === sellerAuthApi.endpoints.logoutSeller.matchFulfilled.type ||
        action.type === adminAuthApi.endpoints.adminLogout.matchFulfilled.type,
      (state) => {
        state.isAuthenticated = false;
        state.token = null;
        state.refreshToken = null; 
        state.user = null;
        state.role = null;
        state.rememberMe = false;
        state.error = null;
        state.profileStatus = null;

        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_data');
        localStorage.removeItem('remember_me');
      }
    );
  },
});

export const {
  setCredentials,
  updateToken,
  setProfileStatus,
  setAdminAuth,
  clearAdminAuth,
  clearAuth,
  logout,
  setAuthError,
  clearAuthError,
  setAuthLoading,
  
} = authSlice.actions;

export const selectAuth = (state) => state.auth;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUser = (state) => state.auth.user;
export const selectUserRole = (state) => state.auth.role;
export const selectRefreshToken = (state) => state.auth.refreshToken;
export const selectProfileStatus = (state) => state.auth.profileStatus;
export const selectAuthError = (state) => state.auth.error;
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectAdminAuth = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  role: state.auth.role,
  token: state.auth.token,
});

export default authSlice.reducer;
