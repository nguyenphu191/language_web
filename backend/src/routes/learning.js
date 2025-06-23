const express = require('express');
const auth = require('../middleware/auth');
const {
  getWordsForReview,
  submitReview,
  getLearningStats
} = require('../controllers/learningController');

const router = express.Router();

// Tất cả routes đều cần đăng nhập
router.use(auth);

// Lấy từ cần ôn tập
router.get('/review', getWordsForReview);

// Gửi kết quả ôn tập
router.post('/review', submitReview);

// Lấy thống kê học tập
router.get('/stats', getLearningStats);

module.exports = router;