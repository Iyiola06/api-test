const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { ErrorResponse } = require('../utils/errorHandler');

/**
 * Protect routes - verify JWT token
 */
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Check for token in cookies (optional)
  else if (req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    req.user = await User.findById(decoded.id).select('-password -refreshToken');

    if (!req.user) {
      return next(new ErrorResponse('User not found', 404));
    }

    if (!req.user.isActive) {
      return next(new ErrorResponse('User account is inactive', 403));
    }

    next();
  } catch (error) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});

/**
 * Grant access to specific roles
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role '${req.user.role}' is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};

/**
 * Check if user is project team member
 */
exports.checkProjectAccess = asyncHandler(async (req, res, next) => {
  const Project = require('../models/Project');
  const projectId = req.params.projectId || req.body.project;

  if (!projectId) {
    return next(new ErrorResponse('Project ID is required', 400));
  }

  const project = await Project.findById(projectId);

  if (!project) {
    return next(new ErrorResponse('Project not found', 404));
  }

  // Check if user is owner or team member
  const isOwner = project.owner.toString() === req.user._id.toString();
  const isTeamMember = project.team.some(
    member => member.user.toString() === req.user._id.toString()
  );

  if (!isOwner && !isTeamMember && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to access this project', 403));
  }

  req.project = project;
  next();
});

/**
 * Check document access based on visibility settings
 */
exports.checkDocumentAccess = asyncHandler(async (req, res, next) => {
  const Document = require('../models/Document');
  const document = await Document.findById(req.params.id);

  if (!document) {
    return next(new ErrorResponse('Document not found', 404));
  }

  const { visibility, allowedRoles, allowedUsers } = document.accessControl;

  // Public documents are accessible to all
  if (visibility === 'public') {
    return next();
  }

  // Team visibility requires project access
  if (visibility === 'team') {
    req.params.projectId = document.project;
    return exports.checkProjectAccess(req, res, next);
  }

  // Restricted access - check roles and users
  if (visibility === 'restricted') {
    const hasRoleAccess = allowedRoles.includes(req.user.role);
    const hasUserAccess = allowedUsers.some(
      userId => userId.toString() === req.user._id.toString()
    );

    if (!hasRoleAccess && !hasUserAccess && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to access this document', 403));
    }
  }

  next();
});

/**
 * Rate limiting for sensitive operations
 */
exports.apiLimiter = require('express-rate-limit')({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Strict rate limiting for authentication endpoints
 */
exports.authLimiter = require('express-rate-limit')({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many authentication attempts, please try again later',
  skipSuccessfulRequests: true,
});
