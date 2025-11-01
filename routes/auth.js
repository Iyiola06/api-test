const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
  updatePassword,
  refreshToken,
  logout
} = require('../controllers/authController');
const { protect, authLimiter } = require('../middleware/auth');
const validators = require('../utils/validators');

// Public routes
router.post('/register', authLimiter, validators.registerUser, register);
router.post('/login', authLimiter, validators.loginUser, login);
router.post('/refresh', refreshToken);

// Protected routes
router.use(protect);
router.get('/me', getMe);
router.put('/profile', updateProfile);
router.put('/password', updatePassword);
router.post('/logout', logout);

module.exports = router;
