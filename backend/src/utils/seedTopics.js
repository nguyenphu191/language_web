const mongoose = require('mongoose');
const Language = require('../models/Language');
const Topic = require('../models/Topic');
const Vocabulary = require('../models/Vocabulary');

const seedTopics = async () => {
  try {
    console.log('🌱 Bắt đầu tạo Topics và cập nhật Vocabulary...');
    
    // Kết nối database
    await mongoose.connect('mongodb://localhost:27017/language-learning');
    console.log('✅ Đã kết nối MongoDB');
    
    // Lấy ngôn ngữ
    const english = await Language.findOne({ code: 'EN' });
    const japanese = await Language.findOne({ code: 'JA' });
    
    if (!english || !japanese) {
      console.log('❌ Vui lòng chạy seedData.js trước để tạo Languages');
      process.exit(1);
    }
    
    // Xóa topics cũ
    await Topic.deleteMany({});
    console.log('🗑️ Đã xóa Topics cũ');
    
    // Tạo Topics cho tiếng Anh
    const englishTopics = [
      {
        name: 'Greetings & Basic Phrases',
        description: 'Các cụm từ chào hỏi và giao tiếp cơ bản',
        language: english._id,
        level: 'beginner',
        icon: '👋',
        color: 'green',
        order: 1
      },
      {
        name: 'Food & Drinks',
        description: 'Từ vựng về đồ ăn và thức uống',
        language: english._id,
        level: 'beginner',
        icon: '🍕',
        color: 'orange',
        order: 2
      },
      {
        name: 'Family & Relationships',
        description: 'Gia đình và các mối quan hệ',
        language: english._id,
        level: 'beginner',
        icon: '👨‍👩‍👧‍👦',
        color: 'pink',
        order: 3
      },
      {
        name: 'Numbers & Time',
        description: 'Số đếm và thời gian',
        language: english._id,
        level: 'beginner',
        icon: '🕐',
        color: 'blue',
        order: 4
      },
      {
        name: 'Colors & Shapes',
        description: 'Màu sắc và hình dạng',
        language: english._id,
        level: 'beginner',
        icon: '🌈',
        color: 'purple',
        order: 5
      },
      {
        name: 'Transportation',
        description: 'Phương tiện giao thông',
        language: english._id,
        level: 'intermediate',
        icon: '🚗',
        color: 'indigo',
        order: 6
      },
      {
        name: 'Business & Work',
        description: 'Kinh doanh và công việc',
        language: english._id,
        level: 'intermediate',
        icon: '💼',
        color: 'gray',
        order: 7
      },
      {
        name: 'Technology',
        description: 'Công nghệ và máy tính',
        language: english._id,
        level: 'advanced',
        icon: '💻',
        color: 'blue',
        order: 8
      }
    ];
    
    // Tạo Topics cho tiếng Nhật
    const japaneseTopics = [
      {
        name: 'Hiragana Basics',
        description: 'Học Hiragana cơ bản',
        language: japanese._id,
        level: 'beginner',
        icon: 'あ',
        color: 'red',
        order: 1
      },
      {
        name: 'Greetings (あいさつ)',
        description: 'Các cách chào hỏi trong tiếng Nhật',
        language: japanese._id,
        level: 'beginner',
        icon: '🙇',
        color: 'green',
        order: 2
      },
      {
        name: 'Food Culture (食べ物)',
        description: 'Văn hóa ẩm thực Nhật Bản',
        language: japanese._id,
        level: 'intermediate',
        icon: '🍣',
        color: 'orange',
        order: 3
      }
    ];
    
    // Lưu topics
    const createdEnglishTopics = await Topic.insertMany(englishTopics);
    const createdJapaneseTopics = await Topic.insertMany(japaneseTopics);
    
    console.log(`✅ Đã tạo ${createdEnglishTopics.length} topics tiếng Anh`);
    console.log(`✅ Đã tạo ${createdJapaneseTopics.length} topics tiếng Nhật`);
    
    // Tạo thêm từ vựng cho các topics
    const greetingsTopic = createdEnglishTopics.find(t => t.name.includes('Greetings'));
    const foodTopic = createdEnglishTopics.find(t => t.name.includes('Food'));
    const japaneseGreetingsTopic = createdJapaneseTopics.find(t => t.name.includes('Greetings'));
    
    // Từ vựng cho Greetings
    const greetingsVocab = [
      {
        word: 'good morning',
        pronunciation: 'ɡʊd ˈmɔrnɪŋ',
        meaning: 'A greeting used in the morning',
        translation: 'chào buổi sáng',
        partOfSpeech: 'interjection',
        example: {
          sentence: 'Good morning! How did you sleep?',
          translation: 'Chào buổi sáng! Bạn ngủ thế nào?'
        },
        language: english._id,
        topic: greetingsTopic._id,
        level: 'beginner',
        frequency: 9
      },
      {
        word: 'good night',
        pronunciation: 'ɡʊd naɪt',
        meaning: 'A farewell greeting used in the evening',
        translation: 'chúc ngủ ngon',
        partOfSpeech: 'interjection',
        example: {
          sentence: 'Good night, sweet dreams!',
          translation: 'Chúc ngủ ngon, nằm mơ đẹp!'
        },
        language: english._id,
        topic: greetingsTopic._id,
        level: 'beginner',
        frequency: 9
      },
      {
        word: 'how are you',
        pronunciation: 'haʊ ɑr ju',
        meaning: 'A common greeting asking about someone\'s wellbeing',
        translation: 'bạn có khỏe không',
        partOfSpeech: 'interjection',
        example: {
          sentence: 'Hi John! How are you today?',
          translation: 'Chào John! Hôm nay bạn thế nào?'
        },
        language: english._id,
        topic: greetingsTopic._id,
        level: 'beginner',
        frequency: 10
      },
      {
        word: 'nice to meet you',
        pronunciation: 'naɪs tu mit ju',
        meaning: 'An expression used when meeting someone for the first time',
        translation: 'rất vui được gặp bạn',
        partOfSpeech: 'interjection',
        example: {
          sentence: 'Hello, I\'m Sarah. Nice to meet you!',
          translation: 'Xin chào, tôi là Sarah. Rất vui được gặp bạn!'
        },
        language: english._id,
        topic: greetingsTopic._id,
        level: 'beginner',
        frequency: 8
      }
    ];
    
    // Từ vựng cho Food
    const foodVocab = [
      {
        word: 'apple',
        pronunciation: 'ˈæpəl',
        meaning: 'A round fruit with red or green skin',
        translation: 'táo',
        partOfSpeech: 'noun',
        example: {
          sentence: 'I eat an apple every day.',
          translation: 'Tôi ăn một quả táo mỗi ngày.'
        },
        language: english._id,
        topic: foodTopic._id,
        level: 'beginner',
        frequency: 7
      },
      {
        word: 'bread',
        pronunciation: 'bred',
        meaning: 'A food made from flour, water and yeast',
        translation: 'bánh mì',
        partOfSpeech: 'noun',
        example: {
          sentence: 'I love fresh bread with butter.',
          translation: 'Tôi thích bánh mì tươi với bơ.'
        },
        language: english._id,
        topic: foodTopic._id,
        level: 'beginner',
        frequency: 7
      },
      {
        word: 'coffee',
        pronunciation: 'ˈkɔfi',
        meaning: 'A hot drink made from coffee beans',
        translation: 'cà phê',
        partOfSpeech: 'noun',
        example: {
          sentence: 'I need my morning coffee.',
          translation: 'Tôi cần cà phê buổi sáng.'
        },
        language: english._id,
        topic: foodTopic._id,
        level: 'beginner',
        frequency: 8
      }
    ];
    
    // Từ vựng tiếng Nhật
    const japaneseVocab = [
      {
        word: 'おはよう',
        pronunciation: 'ohayou',
        meaning: 'Good morning (casual)',
        translation: 'chào buổi sáng (thân mật)',
        partOfSpeech: 'interjection',
        example: {
          sentence: 'おはよう！今日はいい天気ですね。',
          translation: 'Chào buổi sáng! Hôm nay thời tiết đẹp nhỉ.'
        },
        language: japanese._id,
        topic: japaneseGreetingsTopic._id,
        level: 'beginner',
        frequency: 10
      },
      {
        word: 'おはようございます',
        pronunciation: 'ohayou gozaimasu',
        meaning: 'Good morning (polite)',
        translation: 'chào buổi sáng (lịch sự)',
        partOfSpeech: 'interjection',
        example: {
          sentence: 'おはようございます、田中さん。',
          translation: 'Chào buổi sáng, anh/chị Tanaka.'
        },
        language: japanese._id,
        topic: japaneseGreetingsTopic._id,
        level: 'beginner',
        frequency: 10
      }
    ];
    
    // Lưu từ vựng mới
    await Vocabulary.insertMany([...greetingsVocab, ...foodVocab, ...japaneseVocab]);
    console.log(`✅ Đã tạo ${greetingsVocab.length + foodVocab.length + japaneseVocab.length} từ vựng mới`);
    
    // Cập nhật từ vựng cũ với topic
    const existingEnglishWords = await Vocabulary.find({ 
      language: english._id, 
      topic: { $exists: false } 
    });
    
    for (const word of existingEnglishWords) {
      if (['hello', 'goodbye', 'thank you'].includes(word.word.toLowerCase())) {
        word.topic = greetingsTopic._id;
      } else if (['water', 'food'].includes(word.word.toLowerCase())) {
        word.topic = foodTopic._id;
      }
      await word.save();
    }
    
    // Cập nhật từ vựng tiếng Nhật cũ
    const existingJapaneseWords = await Vocabulary.find({ 
      language: japanese._id, 
      topic: { $exists: false } 
    });
    
    for (const word of existingJapaneseWords) {
      word.topic = japaneseGreetingsTopic._id;
      await word.save();
    }
    
    console.log('✅ Đã cập nhật topic cho từ vựng cũ');
    
    // Cập nhật vocabularyCount cho các topics
    for (const topic of [...createdEnglishTopics, ...createdJapaneseTopics]) {
      await topic.updateVocabularyCount();
    }
    
    console.log('✅ Đã cập nhật vocabularyCount cho topics');
    
    console.log('🎉 Hoàn thành tạo Topics và cập nhật Vocabulary!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Lỗi tạo topics:', error);
    process.exit(1);
  }
};

// Chạy hàm tạo dữ liệu
seedTopics();