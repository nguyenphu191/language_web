const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const generateToken = (userId) => {
  return jwt.sign(
    { userId }, 
    process.env.JWT_SECRET, 
    { expiresIn: '7d' } 
  );
};

const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Dữ liệu không hợp lệ',
        errors: errors.array() 
      });
    }
    
    const { username, email, password, firstName, lastName } = req.body;
    
    const existingUser = await User.findOne({
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({
        message: 'Email hoặc username đã được sử dụng'
      });
    }
    
    const user = new User({
      username,
      email,
      password, 
      profile: {
        firstName,
        lastName
      }
    });
    
    await user.save();
    
    const token = generateToken(user._id);
    
    res.status(201).json({
      message: 'Đăng ký thành công',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profile: user.profile
      }
    });
    
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Dữ liệu không hợp lệ',
        errors: errors.array() 
      });
    }
    
    const { email, password } = req.body;
    
    const user = await User.findOne({ email })
      .populate('selectedLanguages.language'); // Lấy thông tin ngôn ngữ đã chọn
    
    if (!user) {
      return res.status(400).json({ 
        message: 'Email hoặc mật khẩu không đúng' 
      });
    }
    
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(400).json({ 
        message: 'Email hoặc mật khẩu không đúng' 
      });
    }
    
    const token = generateToken(user._id);
    
    res.json({
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profile: user.profile,
        selectedLanguages: user.selectedLanguages,
        settings: user.settings
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('selectedLanguages.language')
      .select('-password'); // Không trả về password
    
    res.json({ user });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ 
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

module.exports = {
  register,
  login,
  getMe
};