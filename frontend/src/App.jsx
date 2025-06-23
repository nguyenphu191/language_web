import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import LanguageSelection from './components/LanguageSelection'; // Thêm dòng này

// Component bảo vệ route (cần đăng nhập)
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  // Hiển thị loading khi đang kiểm tra auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }
  
  // Nếu chưa đăng nhập, chuyển về login
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Component chuyển hướng khi đã đăng nhập
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }
  
  // Nếu đã đăng nhập, chuyển về dashboard
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

function App() {
    return (
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Route mặc định */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* Routes công khai */}
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                } 
              />
              
              {/* Routes bảo vệ */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Thêm route mới */}
              <Route 
                path="/language-selection" 
                element={
                  <ProtectedRoute>
                    <LanguageSelection />
                  </ProtectedRoute>
                } 
              />
              
              {/* Route không tồn tại */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    );
  }
  
export default App;