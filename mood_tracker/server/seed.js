const mongoose = require('mongoose');
const User = require('./models/User');
const Mood = require('./models/Mood');
const Sleep = require('./models/Sleep');
require('dotenv').config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  

  const user = await User.findOne({ email: 'vic.rakhmanova@gmail.com' });
  
  if (!user) {
    console.log("Користувача не знайдено!");
    return;
  }

  user.name = "Viktoriaaa";
  await user.save();

  const data = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

   
    await Mood.create({
      user: user._id,
      moodScore: Math.floor(Math.random() * 6) + 4, 
      feelingType: i % 2 === 0 ? "спокій" : "втома",
      date: date
    });

    await Sleep.create({
      user: user._id,
      date: dateStr,
      hours: Math.floor(Math.random() * 4) + 5, 
      quality: "середня"
    });
  }

  console.log("Базу успішно наповнено тестовими даними для Вікторії!");
  process.exit();
};

seed();