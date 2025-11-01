const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');
const { ErrorResponse } = require('../utils/errorHandler');

/**
 * @desc    Get all notifications for user
 * @route   GET /api/v1/notifications
 * @access  Private
 */
exports.getNotifications = asyncHandler(async (req, res, next) => {
  const { isRead, type, page = 1, limit = 20 } = req.query;

  let query = { recipient: req.user.id };

  if (isRead !== undefined) {
    query.isRead = isRead === 'true';
  }

  if (type) {
    query.type = type;
  }

  const notifications = await Notification.find(query)
    .populate('sender', 'firstName lastName email avatar')
    .sort('-createdAt')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();

  const count = await Notification.countDocuments(query);
  const unreadCount = await Notification.countDocuments({
    recipient: req.user.id,
    isRead: false
  });

  res.status(200).json({
    success: true,
    count: notifications.length,
    total: count,
    unreadCount,
    totalPages: Math.ceil(count / limit),
    currentPage: parseInt(page),
    data: notifications
  });
});

/**
 * @desc    Mark notification as read
 * @route   PUT /api/v1/notifications/:id/read
 * @access  Private
 */
exports.markAsRead = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    recipient: req.user.id
  });

  if (!notification) {
    return next(new ErrorResponse('Notification not found', 404));
  }

  notification.isRead = true;
  notification.readAt = new Date();
  await notification.save();

  res.status(200).json({
    success: true,
    data: notification
  });
});

/**
 * @desc    Mark all notifications as read
 * @route   PUT /api/v1/notifications/read-all
 * @access  Private
 */
exports.markAllAsRead = asyncHandler(async (req, res, next) => {
  await Notification.updateMany(
    { recipient: req.user.id, isRead: false },
    { isRead: true, readAt: new Date() }
  );

  res.status(200).json({
    success: true,
    message: 'All notifications marked as read'
  });
});

/**
 * @desc    Delete notification
 * @route   DELETE /api/v1/notifications/:id
 * @access  Private
 */
exports.deleteNotification = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    recipient: req.user.id
  });

  if (!notification) {
    return next(new ErrorResponse('Notification not found', 404));
  }

  await notification.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Notification deleted'
  });
});

/**
 * @desc    Delete all read notifications
 * @route   DELETE /api/v1/notifications/clear-read
 * @access  Private
 */
exports.clearReadNotifications = asyncHandler(async (req, res, next) => {
  await Notification.deleteMany({
    recipient: req.user.id,
    isRead: true
  });

  res.status(200).json({
    success: true,
    message: 'Read notifications cleared'
  });
});
