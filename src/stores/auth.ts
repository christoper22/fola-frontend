import { defineStore } from 'pinia';
import axios from 'axios';

interface AuthState {
  token: string | null;
  user: { id: number; email: string; role: string } | null;
  loading: boolean;
  error: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem('token'),
    user: null,
    loading: false,
    error: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin',
  },
  actions: {
    async login(email: string, password: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
        this.token = response.data.token;
        localStorage.setItem('token', this.token as string);
        // Decode token to get user info (for simplicity, in a real app, you might fetch user profile)
        const base64Url = (this.token as string).split('.')[1];
        if (!base64Url) {
          throw new Error('Invalid token: missing base64Url part');
        }
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const decodedToken = JSON.parse(window.atob(base64));
        this.user = {
          id: decodedToken.userId,
          email: decodedToken.email, // Assuming email is in token payload
          role: decodedToken.role,
        };
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
        return true;
      } catch (err: any) {
        this.error = err.response?.data?.error || 'Login failed';
        this.token = null;
        this.user = null;
        localStorage.removeItem('token');
        return false;
      } finally {
        this.loading = false;
      }
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    },
    initializeAuth() {
      if (this.token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
        // Attempt to decode token to get user info if available
        try {
          const base64Url = (this.token as string).split('.')[1];
          if (!base64Url) {
            throw new Error('Invalid token: missing base64Url part');
          }
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const decodedToken = JSON.parse(window.atob(base64));
          this.user = {
            id: decodedToken.userId,
            email: decodedToken.email,
            role: decodedToken.role,
          };
        } catch (e) {
          console.error('Failed to decode token:', e);
          this.logout(); // Clear invalid token
        }
      }
    },
  },
});