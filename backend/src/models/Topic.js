const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tên chủ đề là bắt buộc'],
    trim: true
  },
  
  description: {
    type: String,
    trim: true
  },
  
  language: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Language',
    required: [true, 'Ngôn ngữ là bắt buộc']
  },
  
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  
  icon: {
    type: String,
    default: '📚' // Emoji icon
  },
  
  color: {
    type: String,
    default: 'blue' // Màu theme
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  order: {
    type: Number,
    default: 0 // Thứ tự hiển thị
  },
  
  // Thống kê
  vocabularyCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index để tìm kiếm nhanh
topicSchema.index({ language: 1, level: 1, isActive: 1 });
topicSchema.index({ language: 1, order: 1 });

// Middleware để tự động cập nhật vocabularyCount
topicSchema.methods.updateVocabularyCount = async function() {
  const Vocabulary = mongoose.model('Vocabulary');
  this.vocabularyCount = await Vocabulary.countDocuments({ topic: this._id });
  await this.save();
};

module.exports = mongoose.model('Topic', topicSchema);