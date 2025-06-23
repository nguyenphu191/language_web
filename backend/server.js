const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect('mongodb://localhost:27017/language-learning', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('✅ Đã kết nối MongoDB thành công!');
});

mongoose.connection.on('error', (err) => {
  console.log('❌ Lỗi kết nối MongoDB:', err);
});

// === ROUTES ===
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/languages', require('./src/routes/languages'));
app.use('/api/vocabulary', require('./src/routes/vocabulary'));
app.use('/api/learning', require('./src/routes/learning'));
app.use('/api/topics', require('./src/routes/topics'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại port ${PORT}`);
  console.log(`📝 API URL: http://localhost:${PORT}`);
});