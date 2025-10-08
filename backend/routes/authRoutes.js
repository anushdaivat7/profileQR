// routes/authRoutes.js
const express = require('express');
const { register, login, verifyToken, logout } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify', authMiddleware, verifyToken); // New endpoint
router.post('/logout', authMiddleware, logout); // New endpoint

module.exports = router;