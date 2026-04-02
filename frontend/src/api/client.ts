import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api';

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding the bearer token
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mhrs_access');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling token refresh
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('mhrs_refresh');

      if (refreshToken) {
        try {
          const res = await axios.post(`${API_BASE}/users/token/refresh/`, {
            refresh: refreshToken,
          });

          if (res.status === 200) {
            const { access } = res.data;
            localStorage.setItem('mhrs_access', access);
            client.defaults.headers.common['Authorization'] = `Bearer ${access}`;
            return client(originalRequest);
          }
        } catch (refreshError) {
          // Refresh token expired or invalid
          localStorage.removeItem('mhrs_access');
          localStorage.removeItem('mhrs_refresh');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token available
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default client;
