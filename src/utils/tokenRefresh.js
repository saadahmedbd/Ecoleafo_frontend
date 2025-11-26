import { store } from '../app/store';
import { updateToken, clearAuth } from '../features/auth/authSlice';
import { API_BASE_URL, STORAGE_KEYS } from './constants';

let refreshTimer = null;

const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  
  if (!refreshToken) {
    store.dispatch(clearAuth());
    return false;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      const newAccessToken = data.access_token || data.token;
      const newRefreshToken = data.refresh_token || refreshToken;
      
      store.dispatch(updateToken({ 
        access_token: newAccessToken, 
        refresh_token: newRefreshToken
      }));
      scheduleTokenRefresh(newAccessToken);
      return true;
    } else {
      store.dispatch(clearAuth());
      window.location.href = '/auth/login';
      return false;
    }
  } catch (error) {
    console.error('Token refresh failed:', error);
    return false;
  }
};

const scheduleTokenRefresh = (token) => {
  if (refreshTimer) clearTimeout(refreshTimer);

  const decoded = decodeToken(token);
  if (!decoded?.exp) return;

  const now = Date.now();
  const expiry = decoded.exp * 1000;
  const timeUntilRefresh = expiry - now - 60000; // Refresh 1 minute before expiry

  if (timeUntilRefresh > 0) {
    refreshTimer = setTimeout(() => {
      refreshAccessToken();
    }, timeUntilRefresh);
  } else {
    refreshAccessToken();
  }
};

export const initTokenRefresh = () => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  if (token) {
    scheduleTokenRefresh(token);
  }
};

export const stopTokenRefresh = () => {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
};
