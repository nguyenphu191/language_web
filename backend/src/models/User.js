const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Định nghĩa cấu trúc dữ liệu User
const userSchema = new mongoose.Schema({
  // Tên đăng nhập (bắt buộc, duy nhất)
  username: {
    type: String,
    required: [true, 'Username là bắt buộc'],
    unique: true,
    trim: true, // Loại bỏ khoảng trắng
    minlength: [3, 'Username phải có ít nhất 3 ký tự'],
    maxlength: [30, 'Username không được quá 30 ký tự']
  },
  
  // Email (bắt buộc, duy nhất)
  email: {
    type: String,
    required: [true, 'Email là bắt buộc'],
    unique: true,
    trim: true,
    lowercase: true // Chuyển thành chữ thường
  },
  
  // Mật khẩu (bắt buộc)
  password: {
    type: String,
    required: [true, 'Password là bắt buộc'],
    minlength: [6, 'Password phải có ít nhất 6 ký tự']
  },
  
  // Thông tin cá nhân
  profile: {
    firstName: {
      type: String,
      trim: true
    },
    lastName: {
      type: String,
      trim: true
    },
    avatar: String // URL hình đại diện
  },
  
  // Ngôn ngữ đã chọn học
  selectedLanguages: [{
    language: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Language' // Tham chiếu đến collection Language
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner'
    },
    startDate: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Cài đặt người dùng
  settings: {
    dailyGoal: {
      type: Number,
      default: 20 // Số từ mới mỗi ngày
    },
    notifications: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true // Tự động thêm createdAt và updatedAt
});

userSchema.pre('save', async function(next) {
  // Chỉ mã hóa khi password được thay đổi
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    // Tạo salt (chuỗi ngẫu nhiên) với độ phức tạp 12
    const salt = await bcrypt.genSalt(12);
    
    // Mã hóa password với salt
    this.password = await bcrypt.hash(this.password, salt);
    
    next();
  } catch (error) {
    next(error); 
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  // So sánh password nhập vào với password đã mã hóa
  return bcrypt.compare(candidatePassword, this.password);
};

// Xuất model
module.exports = mongoose.model('User', userSchema);