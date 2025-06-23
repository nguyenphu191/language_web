import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { 
  AiOutlineArrowLeft as ArrowLeft,
  AiOutlineCheck as Check,
  AiOutlineLoading3Quarters as Loader
} from 'react-icons/ai';

const LanguageSelection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [languages, setLanguages] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState(false);
  const [error, setError] = useState(null);

  // Load languages khi component mount
  useEffect(() => {
    fetchLanguages();
  }, []);

  // Load selected languages của user
  useEffect(() => {
    if (user?.selectedLanguages) {
      setSelectedLanguages(user.selectedLanguages.map(lang => lang.language._id));
    }
  }, [user]);

  const fetchLanguages = async () => {
    try {
      setLoading(true);
      const response = await API.get('/languages');
      setLanguages(response.data.languages);
    } catch (error) {
      console.error('Lỗi khi tải ngôn ngữ:', error);
      setError('Không thể tải danh sách ngôn ngữ');
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageSelect = async (languageId) => {
    try {
      setSelecting(true);
      setError(null);

      const isSelected = selectedLanguages.includes(languageId);

      if (isSelected) {
        // Bỏ chọn ngôn ngữ
        await API.delete(`/languages/unselect/${languageId}`);
        setSelectedLanguages(prev => prev.filter(id => id !== languageId));
      } else {
        // Chọn ngôn ngữ
        await API.post('/languages/select', {
          languageId,
          level: 'beginner'
        });
        setSelectedLanguages(prev => [...prev, languageId]);
      }
    } catch (error) {
      console.error('Lỗi khi chọn ngôn ngữ:', error);
      setError(error.response?.data?.message || 'Có lỗi xảy ra khi chọn ngôn ngữ');
    } finally {
      setSelecting(false);
    }
  };

  const handleContinue = () => {
    if (selectedLanguages.length > 0) {
      navigate('/dashboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải danh sách ngôn ngữ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Quay lại Dashboard
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🌍 Chọn ngôn ngữ bạn muốn học
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hãy chọn một hoặc nhiều ngôn ngữ bạn muốn học. Bạn có thể thay đổi lựa chọn bất cứ lúc nào.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Language Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {languages.map((language) => {
            const isSelected = selectedLanguages.includes(language._id);
            
            return (
              <div
                key={language._id}
                onClick={() => handleLanguageSelect(language._id)}
                className={`card cursor-pointer transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1 ${
                  isSelected 
                    ? 'border-2 border-blue-500 bg-blue-50' 
                    : 'border border-gray-200 hover:border-blue-300'
                } ${selecting ? 'pointer-events-none opacity-50' : ''}`}
              >
                <div className="text-center">
                  {/* Flag */}
                  <div className="mb-4">
                    {language.flag ? (
                      <img 
                        src={language.flag} 
                        alt={`${language.name} flag`}
                        className="h-16 w-24 mx-auto object-cover rounded shadow-sm"
                      />
                    ) : (
                      <div className="h-16 w-24 mx-auto bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-2xl">{language.code}</span>
                      </div>
                    )}
                  </div>

                  {/* Language Info */}
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {language.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {language.description}
                    </p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      language.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                      language.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {language.difficulty === 'easy' ? 'Dễ' :
                       language.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
                    </span>
                  </div>

                  {/* Selection Indicator */}
                  <div className="flex items-center justify-center">
                    {isSelected ? (
                      <div className="flex items-center text-blue-600">
                        <Check className="h-5 w-5 mr-2" />
                        <span className="font-medium">Đã chọn</span>
                      </div>
                    ) : (
                      <span className="text-gray-500">Click để chọn</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Languages Summary */}
        {selectedLanguages.length > 0 && (
          <div className="card mb-6 bg-green-50 border-green-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              📚 Ngôn ngữ đã chọn ({selectedLanguages.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {languages
                .filter(lang => selectedLanguages.includes(lang._id))
                .map(lang => (
                  <span 
                    key={lang._id}
                    className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                  >
                    {lang.flag && (
                      <img 
                        src={lang.flag} 
                        alt="" 
                        className="h-4 w-6 mr-2 object-cover rounded"
                      />
                    )}
                    {lang.name}
                  </span>
                ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="text-center">
          <button
            onClick={handleContinue}
            disabled={selectedLanguages.length === 0 || selecting}
            className="btn-primary px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {selecting ? (
              <span className="flex items-center">
                <Loader className="animate-spin h-5 w-5 mr-2" />
                Đang xử lý...
              </span>
            ) : (
              `Tiếp tục với ${selectedLanguages.length} ngôn ngữ`
            )}
          </button>
          
          {selectedLanguages.length === 0 && (
            <p className="text-sm text-gray-500 mt-2">
              Vui lòng chọn ít nhất một ngôn ngữ để tiếp tục
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LanguageSelection;