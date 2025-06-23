import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser, loading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm();

  // Theo dõi giá trị password để so sánh confirm password
  const password = watch('password');

  // Clear error khi component mount
  useEffect(() => {
    clearError();
  }, [clearError]);

  const onSubmit = async (data) => {
    console.log('📝 Register data:', data);
    
    const result = await registerUser({
      username: data.username,
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName
    });
    
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Đăng ký tài khoản
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Hoặc{' '}
            <Link
              to="/login"
              className="font-medium text-green-600 hover:text-green-500 transition-colors"
            >
              đăng nhập nếu đã có tài khoản
            </Link>
          </p>
        </div>

        {/* Form */}
        <div className="card">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Hiển thị lỗi global */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                  <span className="text-red-700 text-sm">{error}</span>
                </div>
              </div>
            )}

            {/* First Name & Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ
                </label>
                <input
                  {...register('firstName', {
                    required: 'Họ là bắt buộc',
                    minLength: {
                      value: 1,
                      message: 'Họ không được để trống'
                    }
                  })}
                  type="text"
                  className={`input ${errors.firstName ? 'border-red-300' : ''}`}
                  placeholder="Nguyen"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên
                </label>
                <input
                  {...register('lastName', {
                    required: 'Tên là bắt buộc',
                    minLength: {
                      value: 1,
                      message: 'Tên không được để trống'
                    }
                  })}
                  type="text"
                  className={`input ${errors.lastName ? 'border-red-300' : ''}`}
                  placeholder="Van A"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên đăng nhập
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('username', {
                    required: 'Tên đăng nhập là bắt buộc',
                    minLength: {
                      value: 3,
                      message: 'Tên đăng nhập phải có ít nhất 3 ký tự'
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9]+$/,
                      message: 'Tên đăng nhập chỉ được chứa chữ và số'
                    }
                  })}
                  type="text"
                  className={`input pl-10 ${errors.username ? 'border-red-300' : ''}`}
                  placeholder="username123"
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('email', {
                    required: 'Email là bắt buộc',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email không hợp lệ'
                    }
                  })}
                  type="email"
                  className={`input pl-10 ${errors.email ? 'border-red-300' : ''}`}
                  placeholder="your@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('password', {
                    required: 'Mật khẩu là bắt buộc',
                    minLength: {
                      value: 6,
                      message: 'Mật khẩu phải có ít nhất 6 ký tự'
                    }
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className={`input pl-10 pr-10 ${errors.password ? 'border-red-300' : ''}`}
                  placeholder="Nhập mật khẩu"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('confirmPassword', {
                    required: 'Vui lòng xác nhận mật khẩu',
                    validate: (value) =>
                      value === password || 'Mật khẩu xác nhận không khớp'
                  })}
                  type="password"
                  className={`input pl-10 ${errors.confirmPassword ? 'border-red-300' : ''}`}
                  placeholder="Nhập lại mật khẩu"
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang đăng ký...
                  </span>
                ) : (
                  'Đăng ký'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;