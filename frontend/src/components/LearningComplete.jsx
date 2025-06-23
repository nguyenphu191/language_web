import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Trophy, 
  Target, 
  Star, 
  CheckCircle, 
  RotateCcw, 
  Home,
  BookOpen,
  TrendingUp,
  Award
} from 'lucide-react';

const LearningComplete = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { 
    sessionStats = {}, 
    topicName = 'Chủ đề', 
    mode = 'học',
    totalWords = 0 
  } = location.state || {};

  const accuracy = sessionStats.total > 0 ? Math.round((sessionStats.correct / sessionStats.total) * 100) : 0;
  
  const getPerformanceMessage = () => {
    if (accuracy >= 90) return { message: "Xuất sắc! 🌟", color: "text-green-600", bg: "bg-green-50" };
    if (accuracy >= 80) return { message: "Rất tốt! 👏", color: "text-blue-600", bg: "bg-blue-50" };
    if (accuracy >= 70) return { message: "Tốt! 👍", color: "text-yellow-600", bg: "bg-yellow-50" };
    if (accuracy >= 60) return { message: "Khá ổn! 💪", color: "text-orange-600", bg: "bg-orange-50" };
    return { message: "Cần cố gắng thêm! 📚", color: "text-red-600", bg: "bg-red-50" };
  };

  const performance = getPerformanceMessage();

  const getStreakMessage = () => {
    if (sessionStats.maxStreak >= 10) return "Streak Master! 🔥";
    if (sessionStats.maxStreak >= 5) return "Streak tuyệt vời! ⚡";
    if (sessionStats.maxStreak >= 3) return "Streak tốt! ✨";
    return "Hãy cố gắng streak cao hơn! 💫";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Celebration Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Hoàn thành xuất sắc!
          </h1>
          <p className="text-gray-600 text-lg">
            Bạn đã hoàn thành phiên học "{topicName}"
          </p>
        </div>

        {/* Performance Card */}
        <div className={`card mb-6 ${performance.bg} border-l-4 border-l-green-500`}>
          <div className="text-center">
            <div className="text-4xl mb-2">🏆</div>
            <h2 className={`text-2xl font-bold mb-2 ${performance.color}`}>
              {performance.message}
            </h2>
            <p className="text-gray-700">
              Độ chính xác: <span className="font-bold text-2xl">{accuracy}%</span>
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="card text-center bg-blue-50 border-blue-200">
            <div className="flex items-center justify-center mb-2">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">{sessionStats.learned || 0}</div>
            <div className="text-sm text-gray-600">Từ đã học</div>
          </div>
          
          <div className="card text-center bg-green-50 border-green-200">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">{sessionStats.correct || 0}</div>
            <div className="text-sm text-gray-600">Đúng</div>
          </div>
          
          <div className="card text-center bg-orange-50 border-orange-200">
            <div className="flex items-center justify-center mb-2">
              <Star className="h-6 w-6 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-orange-600">{sessionStats.maxStreak || 0}</div>
            <div className="text-sm text-gray-600">Max Streak</div>
          </div>
          
          <div className="card text-center bg-purple-50 border-purple-200">
            <div className="flex items-center justify-center mb-2">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-600">{totalWords}</div>
            <div className="text-sm text-gray-600">Tổng từ</div>
          </div>
        </div>

        {/* Achievements */}
        <div className="card mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Award className="h-5 w-5 mr-2" />
            Thành tích
          </h3>
          
          <div className="space-y-3">
            {/* Accuracy Achievement */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="text-2xl mr-3">
                  {accuracy >= 90 ? '🏆' : accuracy >= 80 ? '🥈' : accuracy >= 70 ? '🥉' : '📝'}
                </div>
                <div>
                  <div className="font-medium">Độ chính xác {accuracy}%</div>
                  <div className="text-sm text-gray-600">{performance.message}</div>
                </div>
              </div>
            </div>

            {/* Streak Achievement */}
            {sessionStats.maxStreak >= 3 && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="text-2xl mr-3">🔥</div>
                  <div>
                    <div className="font-medium">Streak {sessionStats.maxStreak}</div>
                    <div className="text-sm text-gray-600">{getStreakMessage()}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Perfect Session */}
            {accuracy === 100 && (
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                <div className="flex items-center">
                  <div className="text-2xl mr-3">⭐</div>
                  <div>
                    <div className="font-medium text-yellow-800">Phiên học hoàn hảo!</div>
                    <div className="text-sm text-yellow-600">100% chính xác - tuyệt vời!</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Learning Tips */}
        <div className="card mb-6 bg-blue-50 border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Gợi ý học tập
          </h3>
          
          <div className="space-y-2 text-blue-800">
            {accuracy < 70 && (
              <p className="text-sm">• Hãy ôn lại những từ khó và học chậm hơn một chút</p>
            )}
            {sessionStats.maxStreak < 3 && (
              <p className="text-sm">• Cố gắng tập trung để tạo streak dài hơn</p>
            )}
            <p className="text-sm">• Học đều đặn mỗi ngày sẽ giúp bạn ghi nhớ tốt hơn</p>
            <p className="text-sm">• Hãy sử dụng các từ đã học trong câu để ghi nhớ lâu hơn</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/topics', { 
              state: { 
                languageId: location.state?.languageId 
              } 
            })}
            className="w-full btn bg-green-600 text-white hover:bg-green-700 flex items-center justify-center py-3"
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            Học tiếp chủ đề khác
          </button>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => window.location.reload()}
              className="btn-secondary flex items-center justify-center"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Học lại
            </button>
            
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-secondary flex items-center justify-center"
            >
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </button>
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="text-center mt-8 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
          <p className="text-purple-800 italic">
            "Every word you learn is a step closer to fluency. Keep going! 🌟"
          </p>
        </div>
      </div>
    </div>
  );
};

export default LearningComplete;