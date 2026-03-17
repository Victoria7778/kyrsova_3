const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');
const analyticsController = require('../controllers/analyticsController');

router.get('/my-correlation', auth, analyticsController.getMySleepStats);
router.get('/energy-correlation', auth, analyticsController.getMyEnergyStats);
router.get('/event-impact', auth, analyticsController.getMyEventImpact);

router.get(
    '/patient-analysis/:patientId', 
    auth, 
    checkRole(['psychologist']), 
    analyticsController.getPatientAnalysis
);

module.exports = router;