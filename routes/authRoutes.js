const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/check-setup', authController.checkSetup);
router.post('/login', authController.login);
router.post('/setup', authController.setupAdmin); 
router.post('/create-admin', authMiddleware, authController.createAdmin);

module.exports = router;
