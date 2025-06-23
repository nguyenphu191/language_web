import axios from 'axios';

// Tạo instance axios với config cơ bản
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - tự động thêm token
API.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage
    const token = localStorage.getItem('token');
    
    if (token) {
      // Thêm Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log('🚀 API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - xử lý response và lỗi
API.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.status, error.message);
    
    // Nếu token hết hạn (401), xóa token và reload
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      
      if (!window.location.pathname.includes('/login') && 
          !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default API;