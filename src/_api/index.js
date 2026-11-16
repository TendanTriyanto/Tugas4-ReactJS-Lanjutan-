import axios from 'axios';

export const TOKEN_KEY = 'booksales_token';
export const USER_KEY = 'booksales_user';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Selalu kirim token Sanctum jika user sudah login
API.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Jika token tidak valid / kedaluwarsa, bersihkan sesi.
// Redirect ditangani oleh ProtectedRoute lewat event ini.
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      window.dispatchEvent(new Event('booksales:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default API;
