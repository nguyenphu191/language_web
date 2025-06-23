import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

// Tạo Context
const AuthContext = createContext();

// Custom hook để sử dụng AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được sử dụng trong AuthProvider');
  }
  return context;
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Kiểm tra authentication khi app khởi động
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setLoading(false);
      return;
    }
    
    try {
      console.log('🔍 Kiểm tra token...');
      const response = await API.get('/auth/me');
      setUser(response.data.user);
      console.log('✅ User authenticated:', response.data.user.username);
    } catch (error) {
      console.error('❌ Token không hợp lệ:', error.message);
      localStorage.removeItem('token');
      setError('Phiên đăng nhập đã hết hạn');
    } finally {
      setLoading(false);
    }
  };

  // Hàm đăng nhập
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔑 Đang đăng nhập...');
      
      const response = await API.post('/auth/login', {
        email,
        password
      });
      
      const { token, user } = response.data;
      
      // Lưu token vào localStorage
      localStorage.setItem('token', token);
      setUser(user);
      
      console.log('✅ Đăng nhập thành công:', user.username);
      return { success: true };
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Đăng nhập thất bại';
      console.error('❌ Lỗi đăng nhập:', errorMessage);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Hàm đăng ký
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      console.log('📝 Đang đăng ký...');
      
      const response = await API.post('/auth/register', userData);
      
      const { token, user } = response.data;
      
      // Lưu token vào localStorage
      localStorage.setItem('token', token);
      setUser(user);
      
      console.log('✅ Đăng ký thành công:', user.username);
      return { success: true };
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Đăng ký thất bại';
      console.error('❌ Lỗi đăng ký:', errorMessage);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Hàm đăng xuất
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setError(null);
    console.log('👋 Đã đăng xuất');
  };

  // Clear error
  const clearError = () => setError(null);

  // Value được chia sẻ qua Context
  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};