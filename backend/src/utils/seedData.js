const mongoose = require('mongoose');
const Language = require('../models/Language');
const Vocabulary = require('../models/Vocabulary');

const seedData = async () => {
  try {
    console.log('🌱 Bắt đầu tạo dữ liệu mẫu...');
    
    // Kết nối database
    await mongoose.connect('mongodb://localhost:27017/language-learning');
    console.log('✅ Đã kết nối MongoDB');
    
    // Xóa dữ liệu cũ
    await Language.deleteMany({});
    await Vocabulary.deleteMany({});
    console.log('🗑️ Đã xóa dữ liệu cũ');
    
    // Tạo ngôn ngữ
    const english = await Language.create({
      name: 'English',
      code: 'EN',
      flag: 'https://flagcdn.com/us.svg',
      description: 'Tiếng Anh Mỹ',
      difficulty: 'medium'
    });
    
    const japanese = await Language.create({
      name: 'Japanese',
      code: 'JA',
      flag: 'https://flagcdn.com/jp.svg',
      description: 'Tiếng Nhật',
      difficulty: 'hard'
    });
    
    console.log('✅ Đã tạo ngôn ngữ');
    
    // Tạo từ vựng tiếng Anh
    const englishVocabulary = [
      {
        word: 'hello',
        pronunciation: 'həˈloʊ',
        meaning: 'A greeting; an expression of goodwill',
        translation: 'xin chào',
        partOfSpeech: 'interjection',
        example: {
          sentence: 'Hello, how are you today?',
          translation: 'Xin chào, bạn có khỏe không?'
        },
        language: english._id,
        level: 'beginner',
        frequency: 10
      },
      {
        word: 'goodbye',
        pronunciation: 'ɡʊdˈbaɪ',
        meaning: 'A farewell remark',
        translation: 'tạm biệt',
        partOfSpeech: 'interjection',
        example: {
          sentence: 'Goodbye, see you tomorrow!',
          translation: 'Tạm biệt, hẹn gặp lại ngày mai!'
        },
        language: english._id,
        level: 'beginner',
        frequency: 9
      },
      {
        word: 'thank you',
        pronunciation: 'θæŋk ju',
        meaning: 'An expression of gratitude',
        translation: 'cảm ơn',
        partOfSpeech: 'interjection',
        example: {
          sentence: 'Thank you for your help.',
          translation: 'Cảm ơn bạn đã giúp đỡ.'
        },
        language: english._id,
        level: 'beginner',
        frequency: 10
      },
      {
        word: 'water',
        pronunciation: 'ˈwɔːtər',
        meaning: 'A colorless, transparent liquid',
        translation: 'nước',
        partOfSpeech: 'noun',
        example: {
          sentence: 'I drink water every day.',
          translation: 'Tôi uống nước mỗi ngày.'
        },
        language: english._id,
        level: 'beginner',
        frequency: 8
      },
      {
        word: 'food',
        pronunciation: 'fuːd',
        meaning: 'Any nutritious substance that people eat',
        translation: 'thức ăn',
        partOfSpeech: 'noun',
        example: {
          sentence: 'This food is delicious.',
          translation: 'Thức ăn này rất ngon.'
        },
        language: english._id,
        level: 'beginner',
        frequency: 8
      }
    ];
    
    await Vocabulary.insertMany(englishVocabulary);
    console.log('✅ Đã tạo từ vựng tiếng Anh');
    
    // Tạo từ vựng tiếng Nhật
    const japaneseVocabulary = [
      {
        word: 'こんにちは',
        pronunciation: 'konnichiwa',
        meaning: 'Hello (afternoon greeting)',
        translation: 'xin chào',
        partOfSpeech: 'interjection',
        example: {
          sentence: 'こんにちは、元気ですか？',
          translation: 'Xin chào, bạn có khỏe không?'
        },
        language: japanese._id,
        level: 'beginner',
        frequency: 10
      },
      {
        word: 'ありがとう',
        pronunciation: 'arigatou',
        meaning: 'Thank you',
        translation: 'cảm ơn',
        partOfSpeech: 'interjection',
        example: {
          sentence: 'ありがとうございます。',
          translation: 'Cảm ơn bạn (trang trọng).'
        },
        language: japanese._id,
        level: 'beginner',
        frequency: 10
      }
    ];
    
    await Vocabulary.insertMany(japaneseVocabulary);
    console.log('✅ Đã tạo từ vựng tiếng Nhật');
    
    console.log('🎉 Hoàn thành tạo dữ liệu mẫu!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Lỗi tạo dữ liệu:', error);
    process.exit(1);
  }
};

// Chạy hàm tạo dữ liệu
seedData();