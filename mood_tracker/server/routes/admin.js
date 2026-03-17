const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');
const adminController = requi
router.get('/users', auth, checkRole(['admin']), adminController.getAllUsers);
router.put('/update-role', auth, checkRole(['admin']), adminController.updateUserRole);
router.get('/audit-connections', auth, checkRole(['admin']), adminController.auditConnections);
router.get('/stats', auth, checkRole(['admin']), adminController.getSystemStats);

module.exports = router;