const mongoose = require('mongoose');
const Mood = require('./models/Mood');
const Sleep = require('./models/Sleep');
const PhysicalState = require('./models/PhysicalState');
const Event = require('./models/Event'); 



const seedData = async () => {
  try {
    console.log("⏳ Починаємо повне перенаповнення бази даних...");
    await mongoose.connect(DB_URI);
    console.log("✅ Підключено до MongoDB Atlas");

    await Promise.all([
      Mood.deleteMany({ user: USER_ID }),
      Sleep.deleteMany({ user: USER_ID }),
      PhysicalState.deleteMany({ user: USER_ID }),
      Event.deleteMany({ user: USER_ID })
    ]);
    console.log("🗑️ Старі дані видалено");

    const categories = [
      'навчання', 'робота', 'відпочинок', 'спорт', 
      'хобі', 'соціалізація', 'здоров\'я', 
      'побутові справи', 'подорожі', 'інше'
    ];

    const days = 14; 
    console.log(`🚀 Створюємо записи для ${days} днів...`);

    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const currentCategory = categories[i % categories.length];
      
      let moodScore, energyLevel, sleepHours, title;
      if (['спорт', 'хобі', 'відпочинок', 'подорожі'].includes(currentCategory)) {
        // Позитивні активності
        moodScore = 8.5 + Math.random() * 1.5; // 8.5 - 10.0
        energyLevel = 7 + Math.random() * 3;
        sleepHours = 8 + Math.random();
        title = `Активний розвиток: ${currentCategory}`;
      } 
      else if (['соціалізація', 'здоров\'я', 'інше'].includes(currentCategory)) {
        // Нейтральні активності
        moodScore = 6 + Math.random() * 2; // 6.0 - 8.0
        energyLevel = 5 + Math.random() * 2;
        sleepHours = 7;
        title = `Баланс: ${currentCategory}`;
      } 
      else {
        // Виснажливі активності (навчання, робота, побут)
        moodScore = 3 + Math.random() * 2.5; // 3.0 - 5.5
        energyLevel = 2 + Math.random() * 3;
        sleepHours = 5 + Math.random() * 1.5;
        title = `Виконання завдань: ${currentCategory}`;
      }

      // 3. Створюємо записи в усіх колекціях синхронно
      
      // Запис про Сон
      await Sleep.create({ 
        user: USER_ID, 
        date: dateStr, 
        hours: Number(sleepHours.toFixed(1)), 
        quality: sleepHours > 7 ? 'good' : 'bad' 
      });

      // Запис про Настрій
      await Mood.create({ 
        user: USER_ID, 
        date: date, 
        moodScore: Number(moodScore.toFixed(1)), 
        feelingType: moodScore > 7 ? 'радість' : (moodScore > 5 ? 'спокій' : 'втома'),
        comment: `Аналіз дня для категорії ${currentCategory}`
      });

      // Запис про Фізичний стан
      await PhysicalState.create({ 
        user: USER_ID, 
        date: date, 
        energyLevel: Math.round(energyLevel), 
        symptoms: energyLevel < 4 ? ['Втома', 'Сонливість'] : [] 
      });

      // Запис про Подію (Activity)
      await Event.create({
        user: USER_ID,
        title: title,
        category: currentCategory,
        date: date,
        description: "Автоматично згенеровано для тестування аналітики"
      });
    }

    console.log("-----------------------------------------");
    console.log("🎉 УСПІХ! Базу повністю оновлено.");
    console.log(`📊 Категорій додано: ${categories.length}`);
    console.log("💡 Тепер онови сторінку статистики у браузері.");
    console.log("-----------------------------------------");
    
    process.exit(0);
  } catch (err) {
    console.error("❌ КРИТИЧНА ПОМИЛКА СИДУВАННЯ:", err);
    process.exit(1);
  }
};

seedData();