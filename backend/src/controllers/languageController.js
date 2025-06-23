const Language = require('../models/Language');
const User = require('../models/User');

// Lấy danh sách tất cả ngôn ngữ
const getAllLanguages = async (req, res) => {
  try {
    const languages = await Language.find({ isActive: true })
      .sort({ name: 1 }); // Sắp xếp theo tên A-Z
    
    res.json({
      message: 'Lấy danh sách ngôn ngữ thành công',
      languages
    });
  } catch (error) {
    console.error('Get languages error:', error);
    res.status(500).json({ 
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// Chọn ngôn ngữ học
const selectLanguage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { languageId, level = 'beginner' } = req.body;

    // Kiểm tra ngôn ngữ có tồn tại không
    const language = await Language.findById(languageId);
    if (!language) {
      return res.status(404).json({
        message: 'Không tìm thấy ngôn ngữ'
      });
    }

    // Tìm user
    const user = await User.findById(userId);
    
    // Kiểm tra đã chọn ngôn ngữ này chưa
    const existingLanguage = user.selectedLanguages.find(
      lang => lang.language.toString() === languageId
    );

    if (existingLanguage) {
      return res.status(400).json({
        message: 'Bạn đã chọn ngôn ngữ này rồi'
      });
    }

    // Thêm ngôn ngữ mới
    user.selectedLanguages.push({
      language: languageId,
      level,
      startDate: new Date()
    });

    await user.save();

    // Populate để trả về thông tin đầy đủ
    await user.populate('selectedLanguages.language');

    res.json({
      message: 'Chọn ngôn ngữ thành công',
      selectedLanguages: user.selectedLanguages
    });
  } catch (error) {
    console.error('Select language error:', error);
    res.status(500).json({ 
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// Bỏ chọn ngôn ngữ
const unselectLanguage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { languageId } = req.params;

    const user = await User.findById(userId);
    
    // Xóa ngôn ngữ khỏi danh sách
    user.selectedLanguages = user.selectedLanguages.filter(
      lang => lang.language.toString() !== languageId
    );

    await user.save();
    await user.populate('selectedLanguages.language');

    res.json({
      message: 'Bỏ chọn ngôn ngữ thành công',
      selectedLanguages: user.selectedLanguages
    });
  } catch (error) {
    console.error('Unselect language error:', error);
    res.status(500).json({ 
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

module.exports = {
  getAllLanguages,
  selectLanguage,
  unselectLanguage
};