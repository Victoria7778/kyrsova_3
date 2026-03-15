const mongoose = require('mongoose');
const Mood = require('./models/Mood');
const Sleep = require('./models/Sleep');
const PhysicalState = require('./models/PhysicalState');
const Event = require('./models/Event'); 

const DB_URI = "mongodb+srv://vicra_test:Vicra12345@cluster0.9d3hfpj.mongodb.net/mood_tracker_db?retryWrites=true&w=majority";
const USER_ID = "69b6f16db82835af16f37354"; 

const seedData = async () => {
  try {
    console.log("⏳ Глибоке наповнення бази для всіх видів аналітики...");
    await mongoose.connect(DB_URI);

   
    await Promise.all([
      Mood.deleteMany({ user: USER_ID }),
      Sleep.deleteMany({ user: USER_ID }),
      PhysicalState.deleteMany({ user: USER_ID }),
      Event.deleteMany({ user: USER_ID })
    ]);

    const categories = ['Навчання 📚', 'Відпочинок 🌴', 'Робота 💼', 'Здоров\'я 🏥'];
    const days = 14;

    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      
      const isGoodDay = i % 2 === 0;
      const moodScore = isGoodDay ? (8 + Math.random() * 2) : (3 + Math.random() * 2);
      const sleepHours = isGoodDay ? (7 + Math.random() * 2) : (4 + Math.random() * 2);
      const energyLevel = isGoodDay ? (7 + Math.random() * 3) : (2 + Math.random() * 3);

    
      await Sleep.create({ user: USER_ID, date: dateStr, hours: Number(sleepHours.toFixed(1)), quality: isGoodDay ? 'good' : 'bad' });
      
      
      await Mood.create({ user: USER_ID, date: date, moodScore: Number(moodScore.toFixed(1)), feelingType: isGoodDay ? 'спокій' : 'втома' });
      
      
      await PhysicalState.create({ user: USER_ID, date: date, energyLevel: Math.round(energyLevel), symptoms: isGoodDay ? [] : ['Втома'] });

      
      await Event.create({
        user: USER_ID,
        title: isGoodDay ? "Прогулянка в парку" : "Складна лекція в НаУКМА",
        category: isGoodDay ? categories[1] : categories[0],
        date: date
      });
    }

    console.log(`🎉 Базу успішно наповнено! Сон, Енергія та Події готові до аналізу.`);
    process.exit();
  } catch (err) {
    console.error("❌ Помилка сидування:", err);
    process.exit(1);
  }
};
seedData();