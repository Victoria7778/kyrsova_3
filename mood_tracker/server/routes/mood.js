const express = require('express');
const router = express.Router();
const Mood = require('../models/Mood');
const Sleep = require('../models/sleep'); 
const auth = require('../middleware/auth');


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

module.exports = router;