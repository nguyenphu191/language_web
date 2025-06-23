const LearningProgress = require('../models/LearningProgress');
const Vocabulary = require('../models/Vocabulary');

// Hàm tính toán Spaced Repetition (SM-2 Algorithm)
const calculateSpacedRepetition = (difficulty, easeFactor = 2.5, interval = 1, repetitions = 0) => {
  let newEaseFactor = easeFactor;
  let newInterval = interval;
  let newRepetitions = repetitions;
  
  // Chuyển đổi difficulty (1-5) thành quality (0-5)
  const quality = difficulty >= 3 ? difficulty : 0;
  
  if (quality >= 3) {
    // Trả lời đúng
    if (repetitions === 0) {
      newInterval = 1;
    } else if (repetitions === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.round(interval * easeFactor);
    }
    newRepetitions = repetitions + 1;
  } else {
    // Trả lời sai - reset
    newRepetitions = 0;
    newInterval = 1;
  }
  
  // Cập nhật ease factor
  newEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  
  // Đảm bảo ease factor >= 1.3
  if (newEaseFactor < 1.3) {
    newEaseFactor = 1.3;
  }
  
  // Tính ngày ôn tiếp theo
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + newInterval);
  
  return {
    easeFactor: Math.round(newEaseFactor * 100) / 100,
    interval: newInterval,
    repetitions: newRepetitions,
    nextReview
  };
};

// Lấy từ cần ôn tập
const getWordsForReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { languageId, limit = 20 } = req.query;
    
    let filter = {
      user: userId,
      nextReview: { $lte: new Date() }
    };
    
    // Nếu có chỉ định ngôn ngữ
    if (languageId) {
      const vocabularyIds = await Vocabulary.find({ language: languageId })
        .distinct('_id');
      filter.vocabulary = { $in: vocabularyIds };
    }
    
    const wordsForReview = await LearningProgress.find(filter)
      .populate({
        path: 'vocabulary',
        populate: {
          path: 'language',
          select: 'name code'
        }
      })
      .sort({ nextReview: 1 })
      .limit(parseInt(limit));
    
    res.json({
      message: 'Lấy từ cần ôn tập thành công',
      words: wordsForReview,
      count: wordsForReview.length
    });
  } catch (error) {
    console.error('Get words for review error:', error);
    res.status(500).json({ 
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// Gửi kết quả ôn tập
const submitReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { vocabularyId, difficulty, isCorrect } = req.body;
    
    if (!vocabularyId || !difficulty) {
      return res.status(400).json({
        message: 'Thiếu thông tin vocabularyId hoặc difficulty'
      });
    }
    
    // Tìm hoặc tạo learning progress
    let progress = await LearningProgress.findOne({
      user: userId,
      vocabulary: vocabularyId
    });
    
    if (!progress) {
      progress = new LearningProgress({
        user: userId,
        vocabulary: vocabularyId,
        firstLearned: new Date()
      });
    }
    
    // Cập nhật thống kê
    progress.totalReviews += 1;
    progress.lastReview = new Date();
    
    if (isCorrect) {
      progress.correctCount += 1;
    } else {
      progress.incorrectCount += 1;
    }
    
    // Tính toán spaced repetition
    const srData = calculateSpacedRepetition(
      difficulty,
      progress.easeFactor,
      progress.interval,
      progress.repetitions
    );
    
    // Cập nhật progress
    progress.easeFactor = srData.easeFactor;
    progress.interval = srData.interval;
    progress.repetitions = srData.repetitions;
    progress.nextReview = srData.nextReview;
    progress.difficulty = difficulty;
    
    // Cập nhật status
    const correctRate = progress.correctCount / progress.totalReviews;
    if (progress.repetitions === 0) {
      progress.status = 'new';
    } else if (progress.repetitions < 3) {
      progress.status = 'learning';
    } else if (progress.repetitions >= 8 && correctRate >= 0.9) {
      progress.status = 'mastered';
    } else {
      progress.status = 'review';
    }
    
    await progress.save();
    
    res.json({
      message: 'Gửi kết quả ôn tập thành công',
      progress: {
        nextReview: progress.nextReview,
        interval: progress.interval,
        status: progress.status,
        repetitions: progress.repetitions,
        correctRate: Math.round(correctRate * 100)
      }
    });
  } catch (error) {
    console.error('Submit review error:', error);
    res.status(500).json({ 
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// Lấy thống kê học tập
const getLearningStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const { languageId } = req.query;
    
    let matchFilter = { user: userId };
    
    if (languageId) {
      const vocabularyIds = await Vocabulary.find({ language: languageId })
        .distinct('_id');
      matchFilter.vocabulary = { $in: vocabularyIds };
    }
    
    // Thống kê theo status
    const statusStats = await LearningProgress.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          avgCorrectRate: {
            $avg: {
              $cond: {
                if: { $gt: ['$totalReviews', 0] },
                then: { $divide: ['$correctCount', '$totalReviews'] },
                else: 0
              }
            }
          }
        }
      }
    ]);
    
    // Số từ cần ôn hôm nay
    const todayDue = await LearningProgress.countDocuments({
      ...matchFilter,
      nextReview: { $lte: new Date() }
    });
    
    // Số từ đã ôn hôm nay
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayReviewed = await LearningProgress.countDocuments({
      ...matchFilter,
      lastReview: { $gte: today, $lt: tomorrow }
    });
    
    res.json({
      message: 'Lấy thống kê thành công',
      stats: {
        byStatus: statusStats,
        todayDue,
        todayReviewed
      }
    });
  } catch (error) {
    console.error('Get learning stats error:', error);
    res.status(500).json({ 
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

module.exports = {
  getWordsForReview,
  submitReview,
  getLearningStats
};