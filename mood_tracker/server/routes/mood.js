const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const moodController = require('../controllers/moodController');

router.post('/add', auth, moodController.addMood);
router.get('/all', auth, moodController.getAllMoods);
router.get('/stats', auth, moodController.getStats);

router.post('/sleep', auth, moodController.upsertSleep);
router.get('/sleep/all', auth, moodController.getAllSleep); 

router.post('/event', auth, moodController.addEvent);
router.get('/events/all', auth, moodController.getAllEvents); 

router.post('/physical', auth, moodController.addPhysicalState);
router.get('/physical/all', auth, moodController.getAllPhysicalStates); 

module.exports = router;