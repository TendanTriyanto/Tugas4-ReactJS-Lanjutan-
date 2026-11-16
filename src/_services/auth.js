import API, { TOKEN_KEY, USER_KEY } from '../_api';

export const saveSession = (data) => {
  localStorage.setItem(TOKEN_KEY, data.access_token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
};

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getStoredUser = () => {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const login = async (payload) => {
  const { data } = await API.post('/login', payload);
  saveSession(data);
  return data;
};

export const register = async (payload) => {
  const { data } = await API.post('/register', payload);
  saveSession(data);
  return data;
};

export const me = async () => {
  const { data } = await API.get('/me');
  localStorage.setItem(USER_KEY, JSON.stringify(data));
  return data;
};

export const updateProfile = async (payload) => {
  const { data } = await API.put('/profile', payload);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  return data;
};

export const logout = async () => {
  try {
    await API.post('/logout');
  } catch {
    // abaikan jika token sudah tidak valid
  } finally {
    clearSession();
  }
};
