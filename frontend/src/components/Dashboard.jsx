import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, BookOpen, Target, BarChart3, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
    const navigate = useNavigate();
  const handleLogout = () => {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
      logout();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                Language Learning
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-700">
                <User className="h-4 w-4 mr-2" />
                <span>Xin chào, <strong>{user?.profile?.firstName || user?.username}</strong>!</span>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center text-sm text-gray-700 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Section */}
          <div className="card mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              🎉 Chào mừng trở lại!
            </h2>
            <p className="text-gray-600 mb-6">
              Hãy tiếp tục hành trình học ngoại ngữ của bạn. Mỗi ngày một chút tiến bộ!
            </p>
            
            {/* User Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center">
                  <User className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Tài khoản</p>
                    <p className="text-sm text-gray-600">{user?.username}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center">
                  <BookOpen className="h-8 w-8 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Ngôn ngữ</p>
                    <p className="text-sm text-gray-600">
                      {user?.selectedLanguages?.length || 0} đã chọn
                    </p>
                    <p className="text-xs text-gray-500">
                      {user?.selectedLanguages?.length ? 'Đã có ngôn ngữ' : 'Chưa chọn ngôn ngữ'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center">
                  <Target className="h-8 w-8 text-yellow-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Mục tiêu hàng ngày</p>
                    <p className="text-sm text-gray-600">
                      {user?.settings?.dailyGoal || 20} từ mới
                    </p>
                    <p className="text-xs text-gray-500">Hôm nay: 0/20 từ</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Learning Actions */}
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Bắt đầu học
              </h3>
              
              <div className="grid grid-cols-1 gap-3">
                {user?.selectedLanguages?.length > 0 ? (
                  <>
                    <button 
                      onClick={() => navigate('/topics', { 
                        state: { languageId: user?.selectedLanguages?.[0]?.language._id } 
                      })}
                      className="btn-primary justify-start"
                    >
                      📚 Học theo chủ đề
                    </button>
                    
                    <button className="btn bg-green-500 text-white hover:bg-green-600 justify-start">
                      🔄 Ôn tập từ cũ
                    </button>
                    
                    <button className="btn bg-purple-500 text-white hover:bg-purple-600 justify-start">
                      📝 Kiểm tra kiến thức
                    </button>
                  </>
                ) : (
                  <div className="text-center py-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-yellow-800 text-sm mb-3">
                      Bạn chưa chọn ngôn ngữ nào để học
                    </p>
                  </div>
                )}
                
                <button 
                    onClick={() => navigate('/language-selection')}
                    className="btn-secondary justify-start"
                >
                    🌍 Chọn ngôn ngữ học
                </button>
              </div>
            </div>

            {/* Statistics */}
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Thống kê học tập
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Tổng từ đã học</span>
                  <span className="font-semibold text-gray-900">0 từ</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Streak hiện tại</span>
                  <span className="font-semibold text-gray-900">0 ngày</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Độ chính xác</span>
                  <span className="font-semibold text-gray-900">---%</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Cần ôn hôm nay</span>
                  <span className="font-semibold text-orange-600">0 từ</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Hoạt động gần đây
            </h3>
            
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">
                <Calendar className="h-12 w-12 mx-auto" />
              </div>
              <p className="text-gray-500">Chưa có hoạt động nào</p>
              <p className="text-sm text-gray-400">Bắt đầu học để xem lịch sử học tập</p>
            </div>
          </div>

          {/* Debug Info (chỉ hiển thị trong development) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-6 card bg-gray-50">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                🔧 Debug - Thông tin user:
              </h4>
              <pre className="text-xs text-gray-600 overflow-x-auto bg-white p-3 rounded border">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;