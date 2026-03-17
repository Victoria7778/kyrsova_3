const mongoose = require('mongoose');
const ss = require('simple-statistics');
const Mood = require('../models/Mood');
const Sleep = require('../models/Sleep');
const PhysicalState = require('../models/PhysicalState');
const Event = require('../models/Event');

const formatDate = (date) => new Date(date).toISOString().split('T')[0];

async function calculateSleepCorrelation(userId) {
    const moods = await Mood.find({ user: userId }).sort({ date: 1 });
    const sleeps = await Sleep.find({ user: userId }).sort({ date: 1 });
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

    const score = pairs.length >= 3 ? ss.sampleRankCorrelation(pairs.map(p => p[0]), pairs.map(p => p[1])) : 0;
    let interpretation = "Недостатньо даних";
    if (pairs.length >= 3) {
        if (score > 0.6) interpretation = "Сильний зв'язок: настрій дуже залежить від сну.";
        else if (score > 0.3) interpretation = "Помірний зв'язок: сон впливає на стан.";
        else interpretation = "Слабкий зв'язок: настрій майже не залежить від сну.";
    }
    return { correlationScore: Number(score.toFixed(2)), chartData, interpretation };
}

async function calculateEnergyCorrelation(userId) {
    const moods = await Mood.find({ user: userId }).sort({ date: 1 });
    const states = await PhysicalState.find({ user: userId }).sort({ date: 1 });
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

    const score = pairs.length >= 3 ? ss.sampleRankCorrelation(pairs.map(p => p[0]), pairs.map(p => p[1])) : 0;
    return { 
        score: Number(score.toFixed(2)), 
        chartData, 
        interpretation: score > 0.5 ? "Висока залежність від фізичного ресурсу" : "Настрій стабільний незалежно від втоми" 
    };
}

async function calculateEventImpact(userId) {
    const events = await Event.find({ user: userId });
    const moods = await Mood.find({ user: userId });
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

    return { chartData, interpretation: "Аналіз активностей проведено успішно" };
}

exports.getMySleepStats = async (req, res) => {
    try {
        const results = await calculateSleepCorrelation(req.user.id);
        res.json(results);
    } catch (err) { res.status(500).json({ message: "Error sleep stats" }); }
};

exports.getMyEnergyStats = async (req, res) => {
    try {
        const results = await calculateEnergyCorrelation(req.user.id);
        res.json(results);
    } catch (err) { res.status(500).json({ message: "Error energy stats" }); }
};

exports.getMyEventImpact = async (req, res) => {
    try {
        const results = await calculateEventImpact(req.user.id);
        res.json(results);
    } catch (err) { res.status(500).json({ message: "Error event impact" }); }
};

exports.getPatientAnalysis = async (req, res) => {
    try {
        const { patientId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(patientId)) {
            return res.status(400).json({ message: "Невірний ID пацієнта" });
        }
        const sleep = await calculateSleepCorrelation(patientId);
        const energy = await calculateEnergyCorrelation(patientId);
        const events = await calculateEventImpact(patientId);
        res.json({ sleep, energy, events });
    } catch (err) { 
        res.status(500).json({ message: "Помилка аналізу пацієнта" }); 
    }
};