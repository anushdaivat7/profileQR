// routes/profileRoutes.js
const express = require('express');
const { getProfile, updateProfile, getPublicProfile, generateQR } = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.get('/profile/qr', authMiddleware, generateQR);
router.get('/profile/public/:userId', getPublicProfile);

module.exports = router;