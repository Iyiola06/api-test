const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearReadNotifications
} = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');
const validators = require('../utils/validators');

router.use(protect);

router
  .route('/')
  .get(validators.validatePagination, getNotifications);

router
  .route('/read-all')
  .put(markAllAsRead);

router
  .route('/clear-read')
  .delete(clearReadNotifications);

router
  .route('/:id')
  .delete(validators.validateId, deleteNotification);

router
  .route('/:id/read')
  .put(validators.validateId, markAsRead);

module.exports = router;
