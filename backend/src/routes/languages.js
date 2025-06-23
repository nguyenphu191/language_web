const express = require('express');
const auth = require('../middleware/auth');
const {
  getAllLanguages,
  selectLanguage,
  unselectLanguage
} = require('../controllers/languageController');

const router = express.Router();

// Lấy danh sách ngôn ngữ (không cần đăng nhập)
router.get('/', getAllLanguages);

// Chọn ngôn ngữ học (cần đăng nhập)
router.post('/select', auth, selectLanguage);

// Bỏ chọn ngôn ngữ (cần đăng nhập)
router.delete('/unselect/:languageId', auth, unselectLanguage);

module.exports = router;