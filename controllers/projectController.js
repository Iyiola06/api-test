const Project = require('../models/Project');
const asyncHandler = require('../utils/asyncHandler');
const { ErrorResponse } = require('../utils/errorHandler');
const logger = require('../utils/logger');

/**
 * @desc    Get all projects for user
 * @route   GET /api/v1/projects
 * @access  Private
 */
exports.getProjects = asyncHandler(async (req, res, next) => {
  const { status, priority, search, page = 1, limit = 10 } = req.query;

  // Build query
  let query = {};

  // User must be owner or team member
  query.$or = [
    { owner: req.user.id },
    { 'team.user': req.user.id }
  ];

  if (status) {
    query.status = status;
  }

  if (priority) {
    query.priority = priority;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { key: { $regex: search, $options: 'i' } }
    ];
  }

  // Execute query with pagination
  const projects = await Project.find(query)
    .populate('owner', 'firstName lastName email avatar')
    .populate('team.user', 'firstName lastName email avatar role')
    .sort('-createdAt')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();

  const count = await Project.countDocuments(query);

  res.status(200).json({
    success: true,
    count: projects.length,
    total: count,
    totalPages: Math.ceil(count / limit),
    currentPage: parseInt(page),
    data: projects
  });
});

/**
 * @desc    Get single project
 * @route   GET /api/v1/projects/:id
 * @access  Private
 */
exports.getProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id)
    .populate('owner', 'firstName lastName email avatar')
    .populate('team.user', 'firstName lastName email avatar role');

  if (!project) {
    return next(new ErrorResponse('Project not found', 404));
  }

  // Check access
  const hasAccess = 
    project.owner._id.toString() === req.user.id ||
    project.team.some(member => member.user._id.toString() === req.user.id) ||
    req.user.role === 'admin';

  if (!hasAccess) {
    return next(new ErrorResponse('Not authorized to access this project', 403));
  }

  res.status(200).json({
    success: true,
    data: project
  });
});

/**
 * @desc    Create new project
 * @route   POST /api/v1/projects
 * @access  Private (PM, PO, Admin)
 */
exports.createProject = asyncHandler(async (req, res, next) => {
  // Add user as owner
  req.body.owner = req.user.id;

  const project = await Project.create(req.body);

  logger.info(`Project created: ${project.name} by ${req.user.email}`);

  res.status(201).json({
    success: true,
    data: project
  });
});

/**
 * @desc    Update project
 * @route   PUT /api/v1/projects/:id
 * @access  Private (Owner, Admin)
 */
exports.updateProject = asyncHandler(async (req, res, next) => {
  let project = await Project.findById(req.params.id);

  if (!project) {
    return next(new ErrorResponse('Project not found', 404));
  }

  // Check ownership
  if (project.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to update this project', 403));
  }

  project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: project
  });
});

/**
 * @desc    Delete project
 * @route   DELETE /api/v1/projects/:id
 * @access  Private (Owner, Admin)
 */
exports.deleteProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(new ErrorResponse('Project not found', 404));
  }

  // Check ownership
  if (project.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to delete this project', 403));
  }

  await project.deleteOne();

  logger.info(`Project deleted: ${project.name}`);

  res.status(200).json({
    success: true,
    data: {},
    message: 'Project deleted successfully'
  });
});

/**
 * @desc    Add team member to project
 * @route   POST /api/v1/projects/:id/team
 * @access  Private (Owner, PM, PO)
 */
exports.addTeamMember = asyncHandler(async (req, res, next) => {
  const { userId, role } = req.body;

  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(new ErrorResponse('Project not found', 404));
  }

  // Check if already a team member
  const exists = project.team.some(
    member => member.user.toString() === userId
  );

  if (exists) {
    return next(new ErrorResponse('User is already a team member', 400));
  }

  project.team.push({ user: userId, role });
  await project.save();

  res.status(200).json({
    success: true,
    data: project
  });
});

/**
 * @desc    Remove team member from project
 * @route   DELETE /api/v1/projects/:id/team/:userId
 * @access  Private (Owner, PM, PO)
 */
exports.removeTeamMember = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(new ErrorResponse('Project not found', 404));
  }

  project.team = project.team.filter(
    member => member.user.toString() !== req.params.userId
  );

  await project.save();

  res.status(200).json({
    success: true,
    data: project
  });
});
