const Topic = require('../models/Topic');
const Vocabulary = require('../models/Vocabulary');
const LearningProgress = require('../models/LearningProgress');

// Lấy danh sách chủ đề theo ngôn ngữ
const getTopicsByLanguage = async (req, res) => {
  try {
    const { languageId } = req.params;
    const { level } = req.query;
    
    const filter = { 
      language: languageId, 
      isActive: true 
    };
    
    if (level) {
      filter.level = level;
    }
    
    const topics = await Topic.find(filter)
      .populate('language', 'name code')
      .sort({ order: 1, name: 1 });
    
    // Thêm thông tin thống kê cho từng topic
    const topicsWithStats = await Promise.all(
      topics.map(async (topic) => {
        const vocabularyCount = await Vocabulary.countDocuments({ topic: topic._id });
        
        // Nếu user đăng nhập, lấy thống kê học tập
        let userStats = null;
        if (req.user) {
          const vocabularyIds = await Vocabulary.find({ topic: topic._id }).distinct('_id');
          
          const learnedCount = await LearningProgress.countDocuments({
            user: req.user.id,
            vocabulary: { $in: vocabularyIds },
            status: { $in: ['learning', 'review', 'mastered'] }
          });
          
          const masteredCount = await LearningProgress.countDocuments({
            user: req.user.id,
            vocabulary: { $in: vocabularyIds },
            status: 'mastered'
          });
          
          userStats = {
            learned: learnedCount,
            mastered: masteredCount,
            total: vocabularyCount,
            progress: vocabularyCount > 0 ? Math.round((learnedCount / vocabularyCount) * 100) : 0
          };
        }
        
        return {
          ...topic.toObject(),
          vocabularyCount,
          userStats
        };
      })
    );
    
    res.json({
      message: 'Lấy danh sách chủ đề thành công',
      topics: topicsWithStats
    });
  } catch (error) {
    console.error('Get topics error:', error);
    res.status(500).json({ 
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// Lấy thông tin chi tiết một chủ đề
const getTopicById = async (req, res) => {
  try {
    const { topicId } = req.params;
    
    const topic = await Topic.findById(topicId)
      .populate('language', 'name code');
    
    if (!topic) {
      return res.status(404).json({
        message: 'Không tìm thấy chủ đề'
      });
    }
    
    // Lấy từ vựng trong chủ đề
    const vocabulary = await Vocabulary.find({ topic: topicId })
      .sort({ frequency: -1, word: 1 })
      .limit(20);
    
    // Thống kê học tập của user
    let userStats = null;
    if (req.user) {
      const vocabularyIds = vocabulary.map(v => v._id);
      
      const progresses = await LearningProgress.find({
        user: req.user.id,
        vocabulary: { $in: vocabularyIds }
      });
      
      const statusCounts = progresses.reduce((acc, progress) => {
        acc[progress.status] = (acc[progress.status] || 0) + 1;
        return acc;
      }, {});
      
      userStats = {
        new: vocabulary.length - progresses.length,
        learning: statusCounts.learning || 0,
        review: statusCounts.review || 0,
        mastered: statusCounts.mastered || 0,
        total: vocabulary.length
      };
    }
    
    res.json({
      message: 'Lấy thông tin chủ đề thành công',
      topic: {
        ...topic.toObject(),
        vocabularyCount: vocabulary.length,
        vocabulary: vocabulary.slice(0, 10), // Chỉ trả về 10 từ đầu tiên
        userStats
      }
    });
  } catch (error) {
    console.error('Get topic by id error:', error);
    res.status(500).json({ 
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// Bắt đầu học một chủ đề
const startLearningTopic = async (req, res) => {
  try {
    const userId = req.user.id;
    const { topicId } = req.params;
    const { mode = 'new', limit = 10 } = req.query; // mode: 'new', 'review', 'mixed'
    
    const topic = await Topic.findById(topicId);
    if (!topic) {
      return res.status(404).json({
        message: 'Không tìm thấy chủ đề'
      });
    }
    
    let wordsToLearn = [];
    
    if (mode === 'new') {
      // Lấy từ mới chưa học
      const learnedWordIds = await LearningProgress.find({ user: userId })
        .distinct('vocabulary');
      
      wordsToLearn = await Vocabulary.find({
        topic: topicId,
        _id: { $nin: learnedWordIds }
      })
        .populate('language', 'name code')
        .sort({ frequency: -1 })
        .limit(parseInt(limit));
        
    } else if (mode === 'review') {
      // Lấy từ cần ôn tập
      const reviewProgresses = await LearningProgress.find({
        user: userId,
        nextReview: { $lte: new Date() }
      })
        .populate({
          path: 'vocabulary',
          match: { topic: topicId },
          populate: {
            path: 'language',
            select: 'name code'
          }
        })
        .sort({ nextReview: 1 })
        .limit(parseInt(limit));
      
      wordsToLearn = reviewProgresses
        .filter(p => p.vocabulary) // Lọc những vocabulary match với topic
        .map(p => p.vocabulary);
        
    } else if (mode === 'mixed') {
      // Trộn từ mới và từ cần ôn tập
      const halfLimit = Math.floor(limit / 2);
      
      // Lấy từ cần ôn tập trước
      const reviewProgresses = await LearningProgress.find({
        user: userId,
        nextReview: { $lte: new Date() }
      })
        .populate({
          path: 'vocabulary',
          match: { topic: topicId },
          populate: {
            path: 'language',
            select: 'name code'
          }
        })
        .sort({ nextReview: 1 })
        .limit(halfLimit);
      
      const reviewWords = reviewProgresses
        .filter(p => p.vocabulary)
        .map(p => p.vocabulary);
      
      // Lấy từ mới để bù vào
      const learnedWordIds = await LearningProgress.find({ user: userId })
        .distinct('vocabulary');
      
      const newWords = await Vocabulary.find({
        topic: topicId,
        _id: { $nin: learnedWordIds }
      })
        .populate('language', 'name code')
        .sort({ frequency: -1 })
        .limit(limit - reviewWords.length);
      
      wordsToLearn = [...reviewWords, ...newWords];
    }
    
    if (wordsToLearn.length === 0) {
      return res.json({
        message: 'Không có từ nào để học trong chủ đề này',
        words: [],
        count: 0,
        topic: topic.name
      });
    }
    
    res.json({
      message: 'Lấy từ học thành công',
      words: wordsToLearn,
      count: wordsToLearn.length,
      topic: topic.name,
      mode
    });
  } catch (error) {
    console.error('Start learning topic error:', error);
    res.status(500).json({ 
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

module.exports = {
  getTopicsByLanguage,
  getTopicById,
  startLearningTopic
};