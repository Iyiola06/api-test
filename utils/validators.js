const { body, param, query, validationResult } = require('express-validator');
const { ErrorResponse } = require('./errorHandler');

/**
 * Validate request and return errors if any
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg).join(', ');
    return next(new ErrorResponse(errorMessages, 400));
  }
  next();
};

/**
 * Common validation rules
 */
const validators = {
  // User validations
  registerUser: [
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('role').isIn([
      'product_manager', 'product_owner', 'product_designer',
      'frontend_developer', 'backend_developer', 'devops_engineer',
      'cybersecurity_engineer', 'qa_engineer', 'ai_ml_engineer', 'stakeholder'
    ]).withMessage('Invalid role'),
    validate
  ],

  loginUser: [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    validate
  ],

  // Project validations
  createProject: [
    body('name').trim().notEmpty().withMessage('Project name is required'),
    body('description').trim().notEmpty().withMessage('Project description is required'),
    body('key').trim().isLength({ min: 2, max: 10 }).isUppercase()
      .withMessage('Project key must be 2-10 uppercase letters'),
    validate
  ],

  updateProject: [
    param('id').isMongoId().withMessage('Invalid project ID'),
    validate
  ],

  // PRD validations
  createPRD: [
    body('project').isMongoId().withMessage('Valid project ID is required'),
    body('title').trim().notEmpty().withMessage('PRD title is required'),
    body('overview').trim().notEmpty().withMessage('PRD overview is required'),
    validate
  ],

  updatePRD: [
    param('id').isMongoId().withMessage('Invalid PRD ID'),
    validate
  ],

  // Task validations
  createTask: [
    body('project').isMongoId().withMessage('Valid project ID is required'),
    body('title').trim().notEmpty().withMessage('Task title is required'),
    body('description').trim().notEmpty().withMessage('Task description is required'),
    body('type').isIn(['feature', 'bug', 'enhancement', 'research', 'documentation', 'testing', 'deployment'])
      .withMessage('Invalid task type'),
    validate
  ],

  updateTask: [
    param('id').isMongoId().withMessage('Invalid task ID'),
    validate
  ],

  // Document validations
  createDocument: [
    body('project').isMongoId().withMessage('Valid project ID is required'),
    body('title').trim().notEmpty().withMessage('Document title is required'),
    body('type').isIn([
      'competitor_analysis', 'api_documentation', 'research_paper',
      'design_asset', 'technical_spec', 'user_guide', 'meeting_notes',
      'reference_material', 'other'
    ]).withMessage('Invalid document type'),
    body('uploadType').isIn(['file', 'link']).withMessage('Invalid upload type'),
    validate
  ],

  // Generic ID validation
  validateId: [
    param('id').isMongoId().withMessage('Invalid ID format'),
    validate
  ],

  // Pagination validation
  validatePagination: [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    validate
  ]
};

module.exports = validators;
