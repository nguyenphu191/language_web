const mongoose = require('mongoose');

const vocabularySchema = new mongoose.Schema({
  word: {
    type: String,
    required: [true, 'Từ vựng là bắt buộc'],
    trim: true
  },
  
  pronunciation: String,
  
  meaning: {
    type: String,
    required: [true, 'Nghĩa là bắt buộc']
  },
  
  translation: String,
  
  partOfSpeech: {
    type: String,
    enum: ['noun', 'verb', 'adjective', 'adverb', 'preposition', 'conjunction', 'interjection'],
    required: [true, 'Từ loại là bắt buộc']
  },
  
  // Ví dụ sử dụng
  example: {
    sentence: String,      // Câu ví dụ
    translation: String    // Bản dịch câu ví dụ
  },
  
  language: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Language',
    required: [true, 'Ngôn ngữ là bắt buộc']
  },
  
  // Thuộc chủ đề nào (sẽ tạo sau)
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic'
  },
  
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  
  audioUrl: String,
  
  imageUrl: String,
  
  tags: [String],
  
  frequency: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  }
}, {
  timestamps: true
});


module.exports = mongoose.model('Vocabulary', vocabularySchema);