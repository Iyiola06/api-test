const Task = require('../models/Task');
const Project = require('../models/Project');
const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');
const { ErrorResponse } = require('../utils/errorHandler');
const logger = require('../utils/logger');

/**
 * @desc    Get all tasks
 * @route   GET /api/v1/tasks
 * @access  Private
 */
exports.getTasks = asyncHandler(async (req, res, next) => {
  const {
    project,
    assignee,
    status,
    priority,
    type,
    sprint,
    search,
    page = 1,
    limit = 20
  } = req.query;

  let query = {};

  if (project) {
    query.project = project;
  }

  if (assignee) {
    query.assignee = assignee === 'me' ? req.user.id : assignee;
  }

  if (status) {
    query.status = status;
  }

  if (priority) {
    query.priority = priority;
  }

  if (type) {
    query.type = type;
  }

  if (sprint) {
    query['sprint.name'] = sprint;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const tasks = await Task.find(query)
    .populate('project', 'name key')
    .populate('assignee', 'firstName lastName email avatar role')
    .populate('reporter', 'firstName lastName email avatar')
    .populate('prd', 'title version')
    .sort('-createdAt')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();

  const count = await Task.countDocuments(query);

  res.status(200).json({
    success: true,
    count: tasks.length,
    total: count,
    totalPages: Math.ceil(count / limit),
    currentPage: parseInt(page),
    data: tasks
  });
});

/**
 * @desc    Get single task
 * @route   GET /api/v1/tasks/:id
 * @access  Private
 */
exports.getTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id)
    .populate('project', 'name key description')
    .populate('assignee', 'firstName lastName email avatar role')
    .populate('reporter', 'firstName lastName email avatar')
    .populate('prd', 'title version')
    .populate('dependencies.task')
    .populate('workflow.history.handedOffBy', 'firstName lastName email');

  if (!task) {
    return next(new ErrorResponse('Task not found', 404));
  }

  res.status(200).json({
    success: true,
    data: task
  });
});

/**
 * @desc    Create new task
 * @route   POST /api/v1/tasks
 * @access  Private
 */
exports.createTask = asyncHandler(async (req, res, next) => {
  // Verify project exists
  const project = await Project.findById(req.body.project);

  if (!project) {
    return next(new ErrorResponse('Project not found', 404));
  }

  // Add reporter
  req.body.reporter = req.user.id;

  const task = await Task.create(req.body);

  // Create notification if task is assigned
  if (task.assignee) {
    await Notification.create({
      recipient: task.assignee,
      sender: req.user.id,
      type: 'task_assigned',
      title: 'New Task Assigned',
      message: `You have been assigned to task: ${task.title}`,
      relatedEntity: {
        entityType: 'task',
        entityId: task._id
      },
      actionUrl: `/tasks/${task._id}`,
      channels: {
        inApp: true,
        email: true
      }
    });
  }

  logger.info(`Task created: ${task.title} by ${req.user.email}`);

  res.status(201).json({
    success: true,
    data: task
  });
});

/**
 * @desc    Update task
 * @route   PUT /api/v1/tasks/:id
 * @access  Private
 */
exports.updateTask = asyncHandler(async (req, res, next) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    return next(new ErrorResponse('Task not found', 404));
  }

  // Check if status is being changed to 'done'
  if (req.body.status === 'done' && task.status !== 'done') {
    req.body.completedAt = new Date();
  }

  // Check if assignee is being changed
  const assigneeChanged = req.body.assignee && req.body.assignee !== task.assignee?.toString();

  task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  // Notify new assignee
  if (assigneeChanged) {
    await Notification.create({
      recipient: req.body.assignee,
      sender: req.user.id,
      type: 'task_assigned',
      title: 'Task Reassigned',
      message: `You have been assigned to task: ${task.title}`,
      relatedEntity: {
        entityType: 'task',
        entityId: task._id
      },
      actionUrl: `/tasks/${task._id}`
    });
  }

  res.status(200).json({
    success: true,
    data: task
  });
});

/**
 * @desc    Delete task
 * @route   DELETE /api/v1/tasks/:id
 * @access  Private
 */
exports.deleteTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return next(new ErrorResponse('Task not found', 404));
  }

  // Check authorization
  const isReporter = task.reporter.toString() === req.user.id;
  const isAuthorized = ['product_manager', 'product_owner', 'admin'].includes(req.user.role);

  if (!isReporter && !isAuthorized) {
    return next(new ErrorResponse('Not authorized to delete this task', 403));
  }

  await task.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
    message: 'Task deleted successfully'
  });
});

/**
 * @desc    Handoff task to next role
 * @route   POST /api/v1/tasks/:id/handoff
 * @access  Private
 */
exports.handoffTask = asyncHandler(async (req, res, next) => {
  const { toRole, toUser, notes } = req.body;

  const task = await Task.findById(req.params.id);

  if (!task) {
    return next(new ErrorResponse('Task not found', 404));
  }

  // Create handoff history entry
  const handoffEntry = {
    fromRole: task.workflow.currentRole,
    toRole: toRole,
    handedOffBy: req.user.id,
    handedOffAt: new Date(),
    notes: notes
  };

  if (!task.workflow.history) {
    task.workflow.history = [];
  }
  task.workflow.history.push(handoffEntry);
  task.workflow.currentRole = toRole;

  // Update assignee if specified
  if (toUser) {
    task.assignee = toUser;
  }

  // Update status based on role
  const statusMap = {
    'qa_engineer': 'in_qa',
    'product_designer': 'in_review',
    'devops_engineer': 'in_review'
  };

  if (statusMap[toRole]) {
    task.status = statusMap[toRole];
  }

  await task.save();

  // Create notification for new assignee
  if (toUser) {
    await Notification.create({
      recipient: toUser,
      sender: req.user.id,
      type: 'task_handoff',
      title: 'Task Handed Off to You',
      message: `Task "${task.title}" has been handed off to ${toRole}`,
      priority: 'high',
      relatedEntity: {
        entityType: 'task',
        entityId: task._id
      },
      actionUrl: `/tasks/${task._id}`,
      metadata: {
        notes: notes,
        fromRole: handoffEntry.fromRole
      },
      channels: {
        inApp: true,
        email: true,
        slack: true
      }
    });
  }

  logger.info(`Task ${task.title} handed off from ${handoffEntry.fromRole} to ${toRole}`);

  res.status(200).json({
    success: true,
    data: task,
    message: 'Task handed off successfully'
  });
});

/**
 * @desc    Add comment to task
 * @route   POST /api/v1/tasks/:id/comments
 * @access  Private
 */
exports.addComment = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return next(new ErrorResponse('Task not found', 404));
  }

  const comment = {
    user: req.user.id,
    content: req.body.content,
    createdAt: new Date()
  };

  task.comments.push(comment);
  await task.save();

  await task.populate('comments.user', 'firstName lastName email avatar');

  // Notify assignee if comment is from someone else
  if (task.assignee && task.assignee.toString() !== req.user.id) {
    await Notification.create({
      recipient: task.assignee,
      sender: req.user.id,
      type: 'comment_added',
      title: 'New Comment on Task',
      message: `${req.user.firstName} ${req.user.lastName} commented on: ${task.title}`,
      relatedEntity: {
        entityType: 'task',
        entityId: task._id
      },
      actionUrl: `/tasks/${task._id}`
    });
  }

  res.status(200).json({
    success: true,
    data: task.comments
  });
});
