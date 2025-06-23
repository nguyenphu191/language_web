const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const {
  register,
  login,
  getMe
} = require('../controllers/authController');

const router = express.Router();

router.post('/register', [
  body('username')
    .isLength({ min: 3 })
    .withMessage('Username phải có ít nhất 3 ký tự')
    .isAlphanumeric()
    .withMessage('Username chỉ được chứa chữ và số'),
    
  body('email')
    .isEmail()
    .withMessage('Email không hợp lệ')
    .normalizeEmail(),
    
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password phải có ít nhất 6 ký tự'),
    
  body('firstName')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Họ là bắt buộc'),
    
  body('lastName')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Tên là bắt buộc')
], register);

router.post('/login', [
  body('email')
    .isEmail()
    .withMessage('Email không hợp lệ')
    .normalizeEmail(),
    
  body('password')
    .exists()
    .withMessage('Password là bắt buộc')
], login);

router.get('/me', auth, getMe);

module.exports = router;