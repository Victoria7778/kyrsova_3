const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ss = require('simple-statistics');
const Mood = require('../models/Mood');
const Sleep = require('../models/Sleep');
const PhysicalState = require('../models/PhysicalState');
const Event = require('../models/Event');
const auth = require('../middleware/auth');

const formatDate = (date) => new Date(date).toISOString().split('T')[0];

// 1. Кореляція Сну
router.get('/my-correlation', auth, async (req, res) => {
  try {
    const moods = await Mood.find({ user: req.user.id }).sort({ date: 1 });
    const sleeps = await Sleep.find({ user: req.user.id }).sort({ date: 1 });

    const chartData = [];
    const pairs = [];

    moods.forEach(m => {
      const d = formatDate(m.date);
      const sleep = sleeps.find(s => s.date === d);
      if (sleep) {
        pairs.push([sleep.hours, m.moodScore]);
        chartData.push({ date: d, sleepHours: sleep.hours, avgMood: m.moodScore });
      }
    });

    let score = pairs.length >= 3 ? ss.sampleRankCorrelation(pairs.map(p => p[0]), pairs.map(p => p[1])) : 0;
    res.json({ correlationScore: Number(score.toFixed(2)), chartData });
  } catch (err) { res.status(500).json({ message: "Error" }); }
});

// 2. Кореляція Енергії
router.get('/energy-correlation', auth, async (req, res) => {
  try {
    const moods = await Mood.find({ user: req.user.id }).sort({ date: 1 });
    const states = await PhysicalState.find({ user: req.user.id }).sort({ date: 1 });

    const chartData = [];
    const pairs = [];

    moods.forEach(m => {
      const d = formatDate(m.date);
      const state = states.find(s => formatDate(s.date) === d);
      if (state) {
        pairs.push([state.energyLevel, m.moodScore]);
        chartData.push({ date: d, energyLevel: state.energyLevel, mood: m.moodScore });
      }
    });

    let score = pairs.length >= 3 ? ss.sampleRankCorrelation(pairs.map(p => p[0]), pairs.map(p => p[1])) : 0;
    res.json({ score: Number(score.toFixed(2)), chartData, interpretation: score > 0.5 ? "Висока залежність від ресурсу" : "Стабільний стан" });
  } catch (err) { res.status(500).json({ message: "Error" }); }
});

// 3. Вплив Подій
router.get('/event-impact', auth, async (req, res) => {
  try {
    const events = await Event.find({ user: req.user.id });
    const moods = await Mood.find({ user: req.user.id });
    const impactMap = {};

    events.forEach(ev => {
      const d = formatDate(ev.date);
      const mood = moods.find(m => formatDate(m.date) === d);
      if (mood) {
        if (!impactMap[ev.category]) impactMap[ev.category] = { sum: 0, count: 0 };
        impactMap[ev.category].sum += mood.moodScore;
        impactMap[ev.category].count += 1;
      }
    });

    const chartData = Object.keys(impactMap).map(cat => ({
      category: cat,
      avgMood: Number((impactMap[cat].sum / impactMap[cat].count).toFixed(2))
    }));

    res.json({ chartData, interpretation: "Аналіз активностей готовий" });
  } catch (err) { res.status(500).json({ message: "Error" }); }
});

module.exports = router;