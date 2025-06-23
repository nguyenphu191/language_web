import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { 
  AiOutlineArrowLeft as ArrowLeft,
  AiOutlineSound as Volume,
  AiOutlineReload as RotateCcw,
  AiOutlineLoading3Quarters as Loader
} from 'react-icons/ai';

const VocabularyLearning = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [currentWord, setCurrentWord] = useState(null);
  const [wordQueue, setWordQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showDifficulty, setShowDifficulty] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    learned: 0,
    correct: 0,
    total: 0
  });

  // Get languageId từ URL params hoặc state
  const languageId = location.state?.languageId || user?.selectedLanguages?.[0]?.language._id;

  useEffect(() => {
    if (languageId) {
      fetchWordsToLearn();
    } else {
      setError('Vui lòng chọn ngôn ngữ trước khi học');
    }
  }, [languageId]);

  const fetchWordsToLearn = async () => {
    try {
      setLoading(true);
      
      // Lấy từ mới để học
      const response = await API.get(`/vocabulary/new/${languageId}?limit=10`);
      const newWords = response.data.words;
      
      if (newWords.length === 0) {
        // Nếu không có từ mới, lấy từ cần ôn tập
        const reviewResponse = await API.get(`/learning/review?languageId=${languageId}&limit=10`);
        const reviewWords = reviewResponse.data.words.map(progress => progress.vocabulary);
        
        if (reviewWords.length === 0) {
          setError('Không có từ nào để học. Vui lòng thêm từ vựng mới.');
          return;
        }
        
        setWordQueue(reviewWords);
        setCurrentWord(reviewWords[0]);
      } else {
        setWordQueue(newWords);
        setCurrentWord(newWords[0]);
      }
    } catch (error) {
      console.error('Lỗi khi tải từ vựng:', error);
      setError('Không thể tải từ vựng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped) {
      setShowDifficulty(true);
    }
  };

  const handleDifficultySelect = async (difficulty) => {
    if (!currentWord) return;
    
    try {
      setSubmitting(true);
      const isCorrect = difficulty >= 3;
      
      // Gửi kết quả học tập
      await API.post('/learning/review', {
        vocabularyId: currentWord._id,
        difficulty,
        isCorrect
      });
      
      // Cập nhật stats
      setStats(prev => ({
        learned: prev.learned + 1,
        correct: prev.correct + (isCorrect ? 1 : 0),
        total: prev.total + 1
      }));
      
      // Chuyển sang từ tiếp theo
      nextWord();
      
    } catch (error) {
      console.error('Lỗi khi gửi kết quả:', error);
      setError('Có lỗi xảy ra khi lưu kết quả');
    } finally {
      setSubmitting(false);
    }
  };

  const nextWord = () => {
    const nextIndex = currentIndex + 1;
    
    if (nextIndex >= wordQueue.length) {
      // Hết từ để học
      navigate('/learning-complete', {
        state: { stats, languageId }
      });
      return;
    }
    
    setCurrentIndex(nextIndex);
    setCurrentWord(wordQueue[nextIndex]);
    setIsFlipped(false);
    setShowDifficulty(false);
  };

  const playAudio = () => {
    if (currentWord?.audioUrl) {
      const audio = new Audio(currentWord.audioUrl);
      audio.play().catch(console.error);
    } else {
      // Fallback: Sử dụng Web Speech API
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(currentWord.word);
        utterance.lang = 'en-US'; // Có thể dynamic theo ngôn ngữ
        speechSynthesis.speak(utterance);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang chuẩn bị từ vựng...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="card max-w-md text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Có lỗi xảy ra
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-x-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="btn-secondary"
            >
              Quay lại Dashboard
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentWord) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="card max-w-md text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Không có từ để học
          </h2>
          <p className="text-gray-600 mb-6">
            Hiện tại không có từ mới hoặc từ cần ôn tập.
          </p>
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
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Quay lại
          </button>
          
          <div className="text-center">
            <h1 className="text-xl font-semibold text-gray-900">
              Học từ vựng
            </h1>
            <p className="text-sm text-gray-600">
              {currentIndex + 1} / {wordQueue.length}
            </p>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-600">
              Đã học: {stats.learned}
            </p>
            <p className="text-sm text-gray-600">
              Chính xác: {stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0}%
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / wordQueue.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Flashcard */}
        <div className="card min-h-[400px] relative overflow-hidden">
          <div 
            className={`transition-transform duration-500 ${
              isFlipped ? 'transform rotateY-180' : ''
            }`}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {!isFlipped ? (
              // Front of card
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center space-x-4">
                  <h2 className="text-4xl font-bold text-gray-800">
                    {currentWord.word}
                  </h2>
                  <button
                    onClick={playAudio}
                    className="p-3 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                  >
                    <Volume className="h-6 w-6" />
                  </button>
                </div>
                
                {currentWord.pronunciation && (
                  <p className="text-gray-600 text-xl">
                    /{currentWord.pronunciation}/
                  </p>
                )}
                
                <p className="text-sm text-gray-500 uppercase tracking-wide font-medium">
                  {currentWord.partOfSpeech}
                </p>
                
                {currentWord.imageUrl && (
                  <img
                    src={currentWord.imageUrl}
                    alt={currentWord.word}
                    className="mx-auto max-w-full h-40 object-contain rounded-lg shadow-sm"
                  />
                )}
                
                <button
                  onClick={handleFlip}
                  disabled={submitting}
                  className="btn-primary mt-8"
                >
                  Xem nghĩa
                </button>
              </div>
            ) : (
              // Back of card
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {currentWord.word}
                  </h2>
                  <button
                    onClick={() => setIsFlipped(false)}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                  >
                    <RotateCcw className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="text-left space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Nghĩa:</h3>
                    <p className="text-gray-800">{currentWord.meaning}</p>
                  </div>
                  
                  {currentWord.translation && (
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">Bản dịch:</h3>
                      <p className="text-gray-800">{currentWord.translation}</p>
                    </div>
                  )}
                  
                  {currentWord.example?.sentence && (
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">Ví dụ:</h3>
                      <p className="text-gray-800 italic">"{currentWord.example.sentence}"</p>
                      {currentWord.example.translation && (
                        <p className="text-gray-600 text-sm mt-1">
                          {currentWord.example.translation}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Difficulty Rating */}
                {showDifficulty && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-center mb-4">
                      Bạn thấy từ này như thế nào?
                    </h3>
                    
                    <div className="grid grid-cols-1 gap-3">
                      {[
                        { value: 1, label: 'Rất khó', color: 'bg-red-500 hover:bg-red-600', desc: 'Hoàn toàn không biết' },
                        { value: 2, label: 'Khó', color: 'bg-orange-500 hover:bg-orange-600', desc: 'Trả lời sai, nhưng nhớ lại được' },
                        { value: 3, label: 'Bình thường', color: 'bg-yellow-500 hover:bg-yellow-600', desc: 'Trả lời đúng sau khi suy nghĩ' },
                        { value: 4, label: 'Dễ', color: 'bg-green-500 hover:bg-green-600', desc: 'Trả lời đúng ngay lập tức' },
                        { value: 5, label: 'Rất dễ', color: 'bg-blue-500 hover:bg-blue-600', desc: 'Quá dễ, nhớ hoàn hảo' }
                      ].map((difficulty) => (
                        <button
                          key={difficulty.value}
                          onClick={() => handleDifficultySelect(difficulty.value)}
                          disabled={submitting}
                          className={`${difficulty.color} text-white text-left p-3 rounded-lg transition-colors disabled:opacity-50`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-semibold">{difficulty.label}</span>
                            <span className="text-sm opacity-90">{difficulty.desc}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VocabularyLearning;