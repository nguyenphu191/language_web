const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({ 
        message: 'Không có token, truy cập bị từ chối' 
      });
    }
    
    const token = authHeader.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        message: 'Token không hợp lệ' 
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        message: 'User không tồn tại' 
      });
    }
    
    req.user = user;
    
    next();
    
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ 
      message: 'Token không hợp lệ' 
    });
  }
};

module.exports = auth;