const PRD = require('../models/PRD');
const Project = require('../models/Project');
const asyncHandler = require('../utils/asyncHandler');
const { ErrorResponse } = require('../utils/errorHandler');
const aiService = require('../utils/aiService');
const logger = require('../utils/logger');

/**
 * @desc    Get all PRDs
 * @route   GET /api/v1/prds
 * @access  Private
 */
exports.getPRDs = asyncHandler(async (req, res, next) => {
  const { project, status, page = 1, limit = 10 } = req.query;

  let query = {};

  if (project) {
    query.project = project;
  }

  if (status) {
    query.status = status;
  }

  const prds = await PRD.find(query)
    .populate('project', 'name key')
    .populate('author', 'firstName lastName email avatar')
    .populate('approvers.user', 'firstName lastName email')
    .sort('-createdAt')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();

  const count = await PRD.countDocuments(query);

  res.status(200).json({
    success: true,
    count: prds.length,
    total: count,
    totalPages: Math.ceil(count / limit),
    currentPage: parseInt(page),
    data: prds
  });
});

/**
 * @desc    Get single PRD
 * @route   GET /api/v1/prds/:id
 * @access  Private
 */
exports.getPRD = asyncHandler(async (req, res, next) => {
  const prd = await PRD.findById(req.params.id)
    .populate('project', 'name key description')
    .populate('author', 'firstName lastName email avatar')
    .populate('approvers.user', 'firstName lastName email avatar')
    .populate('features.assignedTo', 'firstName lastName email avatar')
    .populate('links.documents')
    .populate('links.tasks');

  if (!prd) {
    return next(new ErrorResponse('PRD not found', 404));
  }

  res.status(200).json({
    success: true,
    data: prd
  });
});

/**
 * @desc    Create new PRD
 * @route   POST /api/v1/prds
 * @access  Private (PM, PO)
 */
exports.createPRD = asyncHandler(async (req, res, next) => {
  // Verify project exists
  const project = await Project.findById(req.body.project);

  if (!project) {
    return next(new ErrorResponse('Project not found', 404));
  }

  // Add author
  req.body.author = req.user.id;

  const prd = await PRD.create(req.body);

  logger.info(`PRD created: ${prd.title} for project ${project.name}`);

  res.status(201).json({
    success: true,
    data: prd
  });
});

/**
 * @desc    Update PRD
 * @route   PUT /api/v1/prds/:id
 * @access  Private (Author, PM, PO)
 */
exports.updatePRD = asyncHandler(async (req, res, next) => {
  let prd = await PRD.findById(req.params.id);

  if (!prd) {
    return next(new ErrorResponse('PRD not found', 404));
  }

  // Check authorization
  const isAuthor = prd.author.toString() === req.user.id;
  const isAuthorized = ['product_manager', 'product_owner', 'admin'].includes(req.user.role);

  if (!isAuthor && !isAuthorized) {
    return next(new ErrorResponse('Not authorized to update this PRD', 403));
  }

  // Add to change log
  if (req.body.version && req.body.version !== prd.version) {
    const changeLogEntry = {
      version: req.body.version,
      changedBy: req.user.id,
      changes: req.body.changeDescription || 'Updated PRD',
      changedAt: new Date()
    };
    
    if (!prd.changeLog) {
      prd.changeLog = [];
    }
    prd.changeLog.push(changeLogEntry);
  }

  prd = await PRD.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: prd
  });
});

/**
 * @desc    Delete PRD
 * @route   DELETE /api/v1/prds/:id
 * @access  Private (Author, Admin)
 */
exports.deletePRD = asyncHandler(async (req, res, next) => {
  const prd = await PRD.findById(req.params.id);

  if (!prd) {
    return next(new ErrorResponse('PRD not found', 404));
  }

  // Check authorization
  if (prd.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to delete this PRD', 403));
  }

  await prd.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
    message: 'PRD deleted successfully'
  });
});

/**
 * @desc    Approve or reject PRD
 * @route   POST /api/v1/prds/:id/approve
 * @access  Private (Approvers)
 */
exports.approvePRD = asyncHandler(async (req, res, next) => {
  const { status, comment } = req.body; // status: 'approved' or 'rejected'

  const prd = await PRD.findById(req.params.id);

  if (!prd) {
    return next(new ErrorResponse('PRD not found', 404));
  }

  // Find approver entry
  const approverIndex = prd.approvers.findIndex(
    approver => approver.user.toString() === req.user.id
  );

  if (approverIndex === -1) {
    return next(new ErrorResponse('You are not an approver for this PRD', 403));
  }

  // Update approval status
  prd.approvers[approverIndex].status = status;
  prd.approvers[approverIndex].comment = comment;
  prd.approvers[approverIndex].approvedAt = new Date();

  // Check if all approvers have approved
  const allApproved = prd.approvers.every(
    approver => approver.status === 'approved'
  );

  if (allApproved) {
    prd.status = 'approved';
  }

  await prd.save();

  res.status(200).json({
    success: true,
    data: prd
  });
});

/**
 * @desc    Run compliance check on PRD
 * @route   POST /api/v1/prds/:id/compliance-check
 * @access  Private
 */
exports.runComplianceCheck = asyncHandler(async (req, res, next) => {
  const prd = await PRD.findById(req.params.id)
    .populate('links.tasks')
    .populate('project');

  if (!prd) {
    return next(new ErrorResponse('PRD not found', 404));
  }

  // Gather data for compliance analysis
  const commits = prd.links.commits || [];
  const tasks = prd.links.tasks || [];

  // Use AI service to analyze compliance
  const aiAnalysis = await aiService.analyzeComplianceScore(
    prd,
    commits,
    { tasks }
  );

  // Update compliance score
  prd.complianceScore = {
    overall: aiAnalysis.overallScore,
    lastChecked: new Date(),
    details: {
      featuresCompleted: tasks.filter(t => t.status === 'done').length,
      requirementsMet: tasks.length,
      deviations: []
    }
  };

  await prd.save();

  logger.info(`Compliance check completed for PRD: ${prd.title}`);

  res.status(200).json({
    success: true,
    data: {
      complianceScore: prd.complianceScore,
      analysis: aiAnalysis
    }
  });
});

/**
 * @desc    Add comment to PRD
 * @route   POST /api/v1/prds/:id/comments
 * @access  Private
 */
exports.addComment = asyncHandler(async (req, res, next) => {
  const prd = await PRD.findById(req.params.id);

  if (!prd) {
    return next(new ErrorResponse('PRD not found', 404));
  }

  const comment = {
    user: req.user.id,
    content: req.body.content,
    createdAt: new Date()
  };

  prd.comments.push(comment);
  await prd.save();

  await prd.populate('comments.user', 'firstName lastName email avatar');

  res.status(200).json({
    success: true,
    data: prd.comments
  });
});
