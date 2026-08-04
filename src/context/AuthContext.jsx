import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser, registerUser, logoutUser } from '../services/authService';
import { getAccessToken, getRefreshToken } from '../services/api';
import { jwtDecode } from './jwtDecode';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Decode token to extract user info
  const extractUser = useCallback((token) => {
    try {
      const payload = jwtDecode(token);
      return {
        id: payload.user_id,
        email: payload.email || '',
        name: payload.username || payload.email || '',
      };
    } catch {
      return null;
    }
  }, []);

  // On mount, check for existing token
  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      const userData = extractUser(token);
      if (userData) {
        setUser(userData);
      }
    }
    setLoading(false);
  }, [extractUser]);

  const login = async (email, password) => {
    const data = await loginUser(email, password);
    const userData = extractUser(data.access);
    setUser(userData);
    return data;
  };

  const register = async (formData) => {
    await registerUser(formData);
    // Auto-login after registration
    const data = await loginUser(formData.email, formData.password);
    const userData = extractUser(data.access);
    setUser(userData);
    return data;
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  const isAuthenticated = !!user && !!getAccessToken();

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
