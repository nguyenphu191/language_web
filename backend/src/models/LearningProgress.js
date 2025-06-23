const mongoose = require('mongoose');

const learningProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  vocabulary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vocabulary',
    required: true
  },
  
  
  // Hệ số dễ nhớ (càng cao càng dễ nhớ)
  easeFactor: {
    type: Number,
    default: 2.5
  },
  
  // Khoảng thời gian đến lần ôn tiếp theo (ngày)
  interval: {
    type: Number,
    default: 1
  },
  
  // Số lần ôn thành công liên tiếp
  repetitions: {
    type: Number,
    default: 0
  },
  
  // Thời gian ôn tiếp theo
  nextReview: {
    type: Date,
    default: Date.now
  },
  
  // Lần ôn cuối cùng
  lastReview: Date,
  
  // === THỐNG KÊ HỌC TẬP ===
  
  // Số lần trả lời đúng
  correctCount: {
    type: Number,
    default: 0
  },
  
  // Số lần trả lời sai
  incorrectCount: {
    type: Number,
    default: 0
  },
  
  // Tổng số lần ôn
  totalReviews: {
    type: Number,
    default: 0
  },
  
  // Độ khó do người dùng đánh giá (1-5)
  difficulty: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  
  // Trạng thái học
  status: {
    type: String,
    enum: ['new', 'learning', 'review', 'mastered'],
    default: 'new'
  },
  
  // Ngày học lần đầu
  firstLearned: Date
}, {
  timestamps: true
});

// Index để tìm kiếm nhanh
learningProgressSchema.index({ user: 1, vocabulary: 1 }, { unique: true });
learningProgressSchema.index({ user: 1, nextReview: 1 });

module.exports = mongoose.model('LearningProgress', learningProgressSchema);