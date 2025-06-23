const mongoose = require('mongoose');

const languageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tên ngôn ngữ là bắt buộc'],
    unique: true,
    trim: true
  },
  
  code: {
    type: String,
    required: [true, 'Mã ngôn ngữ là bắt buộc'],
    unique: true,
    uppercase: true,
    length: 2 // Độ dài cố định 2 ký tự
  },
  
  flag: String,
  
  description: String,
  
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Language', languageSchema);