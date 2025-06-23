const Vocabulary = require('../models/Vocabulary');
const Language = require('../models/Language');
const LearningProgress = require('../models/LearningProgress');

// Lấy từ vựng theo ngôn ngữ
const getVocabularyByLanguage = async (req, res) => {
  try {
    const { languageId } = req.params;
    const { page = 1, limit = 20, level, search } = req.query;

    // Tạo query filter
    const filter = { language: languageId };
    
    if (level) {
      filter.level = level;
    }

    if (search) {
      filter.$or = [
        { word: { $regex: search, $options: 'i' } },
        { meaning: { $regex: search, $options: 'i' } },
        { translation: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const skip = (page - 1) * limit;

    const vocabulary = await Vocabulary.find(filter)
      .populate('language', 'name code')
      .sort({ frequency: -1, word: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Vocabulary.countDocuments(filter);

    res.json({
      message: 'Lấy từ vựng thành công',
      vocabulary,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        totalItems: total
      }
    });
  } catch (error) {
    console.error('Get vocabulary error:', error);
    res.status(500).json({ 
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// Lấy từ mới để học
const getNewWordsToLearn = async (req, res) => {
  try {
    const userId = req.user.id;
    const { languageId } = req.params;
    const { limit = 10 } = req.query;

    // Tìm các từ đã học
    const learnedWords = await LearningProgress.find({ user: userId })
      .distinct('vocabulary');

    // Tìm từ chưa học
    const newWords = await Vocabulary.find({
      language: languageId,
      _id: { $nin: learnedWords }
    })
      .populate('language', 'name code')
      .sort({ frequency: -1 }) // Ưu tiên từ phổ biến
      .limit(parseInt(limit));

    res.json({
      message: 'Lấy từ mới thành công',
      words: newWords,
      count: newWords.length
    });
  } catch (error) {
    console.error('Get new words error:', error);
    res.status(500).json({ 
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// Tìm kiếm từ vựng
const searchVocabulary = async (req, res) => {
  try {
    const { q, languageId, limit = 20 } = req.query;

    if (!q) {
      return res.status(400).json({
        message: 'Vui lòng nhập từ khóa tìm kiếm'
      });
    }

    const filter = {
      $or: [
        { word: { $regex: q, $options: 'i' } },
        { meaning: { $regex: q, $options: 'i' } },
        { translation: { $regex: q, $options: 'i' } }
      ]
    };

    if (languageId) {
      filter.language = languageId;
    }

    const results = await Vocabulary.find(filter)
      .populate('language', 'name code')
      .sort({ frequency: -1 })
      .limit(parseInt(limit));

    res.json({
      message: 'Tìm kiếm thành công',
      results,
      count: results.length,
      query: q
    });
  } catch (error) {
    console.error('Search vocabulary error:', error);
    res.status(500).json({ 
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

module.exports = {
  getVocabularyByLanguage,
  getNewWordsToLearn,
  searchVocabulary
};