import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { 
  ArrowLeft,
  BookOpen,
  Users,
  Award,
  Clock,
  PlayCircle,
  RefreshCw,
  Shuffle
} from 'lucide-react';

const TopicSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [topics, setTopics] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState('all');

  // Lấy languageId từ URL params hoặc user's selected languages
  const languageId = location.state?.languageId || user?.selectedLanguages?.[0]?.language._id;

  useEffect(() => {
    if (languageId) {
      fetchTopics();
      // Tìm thông tin ngôn ngữ
      const language = user?.selectedLanguages?.find(
        lang => lang.language._id === languageId
      )?.language;
      setSelectedLanguage(language);
    } else {
      setError('Vui lòng chọn ngôn ngữ trước');
      setLoading(false);
    }
  }, [languageId, user]);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/topics/language/${languageId}?level=${selectedLevel !== 'all' ? selectedLevel : ''}`);
      setTopics(response.data.topics);
    } catch (error) {
      console.error('Lỗi khi tải chủ đề:', error);
      setError('Không thể tải danh sách chủ đề');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (languageId) {
      fetchTopics();
    }
  }, [selectedLevel]);

  const handleTopicSelect = (topic, mode) => {
    navigate('/vocabulary-learning', {
      state: {
        topicId: topic._id,
        topicName: topic.name,
        languageId,
        mode
      }
    });
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelText = (level) => {
    switch (level) {
      case 'beginner': return 'Cơ bản';
      case 'intermediate': return 'Trung bình';
      case 'advanced': return 'Nâng cao';
      default: return level;
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    if (progress >= 20) return 'bg-orange-500';
    return 'bg-blue-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải chủ đề...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="card max-w-md text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Có lỗi xảy ra</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="btn-primary"
          >
            Quay lại Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-6 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Quay lại Dashboard
          </button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              📚 Chọn chủ đề học
            </h1>
            {selectedLanguage && (
              <p className="text-gray-600">
                {selectedLanguage.name} - {getLevelText(selectedLanguage.level)}
              </p>
            )}
          </div>
          
          <div className="w-20"></div> {/* Spacer for center alignment */}
        </div>

        {/* Level Filter */}
        <div className="card mb-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Lọc theo cấp độ</h3>
            <div className="flex space-x-2">
              {['all', 'beginner', 'intermediate', 'advanced'].map(level => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedLevel === level
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {level === 'all' ? 'Tất cả' : getLevelText(level)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Topics Grid */}
        {topics.length === 0 ? (
          <div className="card text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Chưa có chủ đề nào
            </h3>
            <p className="text-gray-600">
              Hiện tại chưa có chủ đề nào cho cấp độ này.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic) => (
              <div
                key={topic._id}
                className="card hover:shadow-lg transition-all duration-200 border-l-4"
                style={{ borderLeftColor: topic.color === 'blue' ? '#3B82F6' : 
                  topic.color === 'green' ? '#10B981' :
                  topic.color === 'orange' ? '#F59E0B' :
                  topic.color === 'purple' ? '#8B5CF6' :
                  topic.color === 'red' ? '#EF4444' :
                  topic.color === 'pink' ? '#EC4899' :
                  topic.color === 'indigo' ? '#6366F1' :
                  topic.color === 'gray' ? '#6B7280' : '#3B82F6' }}
              >
                {/* Topic Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-3xl mr-3">{topic.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {topic.name}
                      </h3>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(topic.level)}`}>
                        {getLevelText(topic.level)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4">
                  {topic.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="flex items-center justify-center mb-1">
                      <BookOpen className="h-4 w-4 text-gray-600 mr-1" />
                      <span className="text-sm font-medium text-gray-600">Từ vựng</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">
                      {topic.vocabularyCount}
                    </span>
                  </div>
                  
                  {topic.userStats && (
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="flex items-center justify-center mb-1">
                        <Award className="h-4 w-4 text-gray-600 mr-1" />
                        <span className="text-sm font-medium text-gray-600">Tiến độ</span>
                      </div>
                      <span className="text-lg font-bold text-gray-900">
                        {topic.userStats.progress}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                {topic.userStats && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Đã học: {topic.userStats.learned}</span>
                      <span>Thành thạo: {topic.userStats.mastered}</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(topic.userStats.progress)}`}
                        style={{ width: `${topic.userStats.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={() => handleTopicSelect(topic, 'new')}
                    className="w-full btn-primary flex items-center justify-center"
                  >
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Học từ mới
                  </button>
                  
                  {topic.userStats && topic.userStats.learned > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleTopicSelect(topic, 'review')}
                        className="btn bg-orange-500 text-white hover:bg-orange-600 flex items-center justify-center text-sm"
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Ôn tập
                      </button>
                      
                      <button
                        onClick={() => handleTopicSelect(topic, 'mixed')}
                        className="btn bg-purple-500 text-white hover:bg-purple-600 flex items-center justify-center text-sm"
                      >
                        <Shuffle className="h-3 w-3 mr-1" />
                        Trộn lẫn
                      </button>
                    </div>
                  )}
                </div>

                {/* User Stats Detail */}
                {topic.userStats && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-4 gap-2 text-xs text-center">
                      <div>
                        <div className="font-medium text-blue-600">{topic.userStats.new}</div>
                        <div className="text-gray-500">Mới</div>
                      </div>
                      <div>
                        <div className="font-medium text-yellow-600">{topic.userStats.learned - topic.userStats.mastered}</div>
                        <div className="text-gray-500">Học</div>
                      </div>
                      <div>
                        <div className="font-medium text-orange-600">
                          {topic.userStats.total - topic.userStats.learned}
                        </div>
                        <div className="text-gray-500">Ôn</div>
                      </div>
                      <div>
                        <div className="font-medium text-green-600">{topic.userStats.mastered}</div>
                        <div className="text-gray-500">Thạo</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        {topics.length > 0 && (
          <div className="card mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              📊 Tổng quan
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {topics.length}
                </div>
                <div className="text-sm text-gray-600">Chủ đề</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {topics.reduce((sum, topic) => sum + topic.vocabularyCount, 0)}
                </div>
                <div className="text-sm text-gray-600">Từ vựng</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {topics.reduce((sum, topic) => sum + (topic.userStats?.learned || 0), 0)}
                </div>
                <div className="text-sm text-gray-600">Đã học</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {topics.reduce((sum, topic) => sum + (topic.userStats?.mastered || 0), 0)}
                </div>
                <div className="text-sm text-gray-600">Thành thạo</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicSelection;