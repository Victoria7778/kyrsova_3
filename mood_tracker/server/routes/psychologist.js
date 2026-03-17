const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');
const psychologistController = require('../controllers/psychologistController');

router.get('/my-patients', auth, checkRole(['psychologist']), psychologistController.getMyPatients);
router.get('/patient-stats/:patientId', auth, checkRole(['psychologist']), psychologistController.getPatientStats);

router.get('/find/:id', auth, psychologistController.findPsychologist);
router.post('/connect', auth, psychologistController.connectToPsychologist);

module.exports = router;