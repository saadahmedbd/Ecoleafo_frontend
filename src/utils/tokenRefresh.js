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
  const accessToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
  
  if (!refreshToken || refreshToken === 'undefined' || refreshToken === 'null') {
    store.dispatch(clearAuth());
    return false;
  }

  let userType = 'buyer';
  try {
    if (userData) {
      const user = JSON.parse(userData);
      userType = user.userType || user.role || 'buyer';
    }
  } catch (e) {
    console.error('Failed to parse user data:', e);
  }

  const refreshEndpoint = userType === 'seller' 
    ? `${API_BASE_URL}/seller/auth/refresh` 
    : userType === 'admin'
    ? `${API_BASE_URL}/admin/auth/refresh`
    : `${API_BASE_URL}/buyer/auth/refresh`;

  try {
    const bodyFormats = [
      { refresh_token: refreshToken },
      { refreshToken: refreshToken },
      { token: refreshToken },
    ];
    
    let response;
    
    for (const body of bodyFormats) {
      response = await fetch(refreshEndpoint, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(body),
        credentials: 'include'
      });
      
      if (response.ok) {
        break;
      } else if (response.status === 400) {
        await response.json().catch(() => ({}));
        continue;
      } else {
        break;
      }
    }

    if (response.ok) {
      const data = await response.json();
      const newAccessToken = data.access_token || data.token;
      const newRefreshToken = data.refresh_token || data.refreshToken;
      
      localStorage.setItem('auth_token', newAccessToken);
      localStorage.setItem('refresh_token', newRefreshToken);
      
      store.dispatch(updateToken({ 
        access_token: newAccessToken, 
        refresh_token: newRefreshToken
      }));
      scheduleTokenRefresh(newAccessToken);
      return true;
    } else {
      localStorage.clear();
      store.dispatch(clearAuth());
      window.location.href = userType === 'seller' ? '/seller/login' 
        : userType === 'admin' ? '/admin/login' 
        : '/buyer/login';
      return false;
    }
  } catch (error) {
    store.dispatch(clearAuth());
    window.location.href = userType === 'seller' ? '/seller/login' 
      : userType === 'admin' ? '/admin/login' 
      : '/buyer/login';
    return false;
  }
};

const scheduleTokenRefresh = (token) => {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
  }

  const decoded = decodeToken(token);
  
  if (!decoded?.exp) {
    return;
  }

  const now = Date.now();
  const expiry = decoded.exp * 1000;
  const timeUntilRefresh = expiry - now - 300000;

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
