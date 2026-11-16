/**
 * Centralized API Service for Program 5 Full-Stack Integration
 * Handles HTTP requests, JWT injection, and unified error parsing.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const TOKEN_KEY = 'mumbai_bus_pass_jwt_token';
const USER_KEY = 'mumbai_bus_pass_user_info';

// Auth token helpers
export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);
export const setStoredToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const removeStoredToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
export const setStoredUser = (user) => localStorage.setItem(USER_KEY, JSON.stringify(user));

/**
 * Generic Fetch Wrapper
 */
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const token = getStoredToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.error || `HTTP ${response.status}: Request failed`);
    error.status = response.status;
    error.details = data.details || null;
    throw error;
  }

  return data;
}

// API Methods
export const api = {
  // Auth
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),

  // Passes
  getPasses: (search = '', type = 'ALL') => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (type && type !== 'ALL') params.append('type', type);
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return request(`/passes${queryString}`, { method: 'GET' });
  },

  getPassById: (id) => request(`/passes/${id}`, { method: 'GET' }),

  createPass: (payload) => request('/passes', { method: 'POST', body: JSON.stringify(payload) }),

  updatePass: (id, payload) => request(`/passes/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),

  deletePass: (id) => request(`/passes/${id}`, { method: 'DELETE' })
};

