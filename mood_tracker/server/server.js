const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const psychologistRoutes = require('./routes/psychologist');
app.use(cors());
app.use(express.json()); 


app.use('/api/auth', authRoutes);
app.use('/api/mood', require('./routes/mood'));
app.use('/api/admin', adminRoutes);
app.use('/api/psychologist', psychologistRoutes);
app.use('/api/analytics', require('./routes/analytics'));

const uri = process.env.MONGODB_URI;
mongoose.connect(uri)
  .then(() => console.log("✅ Успішно підключено до MongoDB Atlas"))
  .catch(err => console.error("❌ Помилка підключення до MongoDB:", err));

app.get('/', (req, res) => {
  res.send('Сервер Mood Tracker працює і підключений до БД!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущено на порту ${PORT}`);
});