const express = require('express');
const auth = require('../middleware/auth');
const {
  getTopicsByLanguage,
  getTopicById,
  startLearningTopic
} = require('../controllers/topicController');

const router = express.Router();

// Lấy danh sách chủ đề theo ngôn ngữ (có thể không cần đăng nhập)
router.get('/language/:languageId', (req, res, next) => {
  // Thử xác thực user, nhưng không bắt buộc
  const authHeader = req.header('Authorization');
  if (authHeader) {
    return auth(req, res, next);
  }
  next();
}, getTopicsByLanguage);

// Lấy thông tin chi tiết chủ đề
router.get('/:topicId', (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (authHeader) {
    return auth(req, res, next);
  }
  next();
}, getTopicById);

// Bắt đầu học chủ đề (cần đăng nhập)
router.get('/:topicId/learn', auth, startLearningTopic);

module.exports = router;