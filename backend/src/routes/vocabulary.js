const express = require('express');
const auth = require('../middleware/auth');
const {
  getVocabularyByLanguage,
  getNewWordsToLearn,
  searchVocabulary
} = require('../controllers/vocabularyController');

const router = express.Router();

// Tìm kiếm từ vựng
router.get('/search', searchVocabulary);

// Lấy từ vựng theo ngôn ngữ
router.get('/language/:languageId', getVocabularyByLanguage);

// Lấy từ mới để học (cần đăng nhập)
router.get('/new/:languageId', auth, getNewWordsToLearn);

module.exports = router;