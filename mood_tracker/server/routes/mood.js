const express = require('express');
const router = express.Router();
const Mood = require('../models/Mood');
const Sleep = require('../models/sleep'); 
const auth = require('../middleware/auth');
const Event = require('../models/Event');

router.post('/add', auth, async (req, res) => {
  try {
    const { moodScore, feelingType, comment } = req.body;
    const newMood = new Mood({
      user: req.user.id,
      moodScore,
      feelingType,
      comment
    });
    const mood = await newMood.save();
    res.json(mood);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Помилка при збереженні настрою');
  }
});

router.get('/all', auth, async (req, res) => {
  try {
    const moods = await Mood.find({ user: req.user.id }).sort({ date: -1 });
    res.json(moods);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Помилка сервера при отриманні настрою');
  }
});

router.post('/sleep', auth, async (req, res) => {
  try {
    const { date, hours, quality } = req.body; 
    const sleep = await Sleep.findOneAndUpdate(
      { user: req.user.id, date: date },
      { hours, quality },
      { new: true, upsert: true }
    );
    res.json(sleep);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Помилка при збереженні сну');
  }
});

router.get('/sleep/all', auth, async (req, res) => {
  try {
    const sleepRecords = await Sleep.find({ user: req.user.id }).sort({ date: -1 });
    res.json(sleepRecords);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Помилка сервера при отриманні історії сну');
  }
});

router.post('/event', auth, async (req, res) => {
  try {
    const { title, category, description, date } = req.body;
    const newEvent = new Event({
      user: req.user.id,
      title,
      category,
      description,
      date: date || Date.now()
    });
    const event = await newEvent.save();
    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Помилка при збереженні події');
  }
});


router.get('/events/all', auth, async (req, res) => {
  try {
    const events = await Event.find({ user: req.user.id }).sort({ date: -1 });
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Помилка при отриманні подій');
  }
});

router.get('/stats', auth, async (req, res) => {
  const { period } = req.query;
  let days = period === 'day' ? 1 : period === 'month' ? 30 : 7;
  
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);
  startDate.setDate(startDate.getDate() - (days - 1));

  try {
    const moods = await Mood.find({
      user: req.user.id,
      date: { $gte: startDate }
    }).sort({ date: 1 });

    const formattedData = moods.map(m => ({
      date: period === 'day' 
        ? m.date.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })
        : m.date.toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' }),
      
      mood: m.moodScore, 
      feeling: m.feelingType || "Не вказано",
      comment: m.comment || ""
    }));

    res.json(formattedData);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Помилка сервера при розрахунку статистики" });
  }
});
module.exports = router;


