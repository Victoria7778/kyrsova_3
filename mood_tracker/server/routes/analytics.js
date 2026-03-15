const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ss = require('simple-statistics');
const Mood = require('../models/Mood');
const Sleep = require('../models/Sleep');
const User = require('../models/User');
const PhysicalState = require('../models/PhysicalState'); 
const auth = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');


async function calculateCorrelation(userId) {
  try {
    const moodData = await Mood.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          avgMood: { $avg: "$moodScore" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const sleepData = await Sleep.find({ user: userId }).sort({ date: 1 });
    const chartData = [];
    const correlationPairs = [];

    moodData.forEach(m => {
      const sleep = sleepData.find(s => s.date === m._id);
      if (sleep) {
        correlationPairs.push([sleep.hours, m.avgMood]);
        chartData.push({
          date: m._id,
          sleepHours: sleep.hours,
          avgMood: Number(m.avgMood.toFixed(2))
        });
      }
    });

    let correlationScore = 0;
    let interpretation = "Недостатньо даних (потрібно хоча б 3 дні)";

    if (correlationPairs.length >= 3) {
      correlationScore = ss.sampleRankCorrelation(correlationPairs.map(p => p[0]), correlationPairs.map(p => p[1]));
      if (correlationScore > 0.6) interpretation = "Сильний зв'язок: ваш настрій дуже залежить від тривалості сну.";
      else if (correlationScore > 0.3) interpretation = "Помірний зв'язок: сон впливає на стан.";
      else interpretation = "Слабкий зв'язок: настрій майже не залежить від сну.";
    }

    return { correlationScore: Number(correlationScore.toFixed(2)), interpretation, chartData };
  } catch (err) {
    throw err;
  }
}


async function calculateEnergyCorrelation(userId) {
  try {
    const moodData = await Mood.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          avgMood: { $avg: "$moodScore" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const energyData = await PhysicalState.find({ user: userId });
    const chartData = [];
    const pairs = [];

    moodData.forEach(m => {
      const energy = energyData.find(e => 
        e.date.toISOString().split('T')[0] === m._id
      );

      if (energy) {
        pairs.push([energy.energyLevel, m.avgMood]);
        chartData.push({
          date: m._id,
          energyLevel: energy.energyLevel, 
          mood: Number(m.avgMood.toFixed(2))
        });
      }
    });

    let score = 0;
    if (pairs.length >= 3) {
      score = ss.sampleRankCorrelation(pairs.map(p => p[0]), pairs.map(p => p[1]));
    }

    return { 
      score: Number(score.toFixed(2)), 
      chartData,
      interpretation: score > 0.5 
        ? "Ваш емоційний стан сильно залежить від фізичного ресурсу." 
        : "Ваш настрій стабільний незалежно від рівня втоми."
    };
  } catch (err) {
    throw err;
  }
}


router.get('/my-correlation', auth, async (req, res) => {
  try {
    const results = await calculateCorrelation(req.user.id);
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Помилка аналізу сну" });
  }
});

router.get('/energy-correlation', auth, async (req, res) => {
  try {
    const results = await calculateEnergyCorrelation(req.user.id);
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Помилка аналізу енергії" });
  }
});

router.get('/patient-correlation/:patientId', auth, checkRole(['psychologist']), async (req, res) => {
  try {
    const { patientId } = req.params;
    const results = await calculateCorrelation(patientId);
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Помилка аналізу пацієнта" });
  }
});

module.exports = router;