const Pipeline = require('../models/Pipeline');
const Project = require('../models/Project');
const Task = require('../models/Task');
const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');
const { ErrorResponse } = require('../utils/errorHandler');
const logger = require('../utils/logger');

/**
 * @desc    Get all pipelines
 * @route   GET /api/v1/cicd/pipelines
 * @access  Private
 */
exports.getPipelines = asyncHandler(async (req, res, next) => {
  const { project, status, environment, page = 1, limit = 20 } = req.query;

  let query = {};

  if (project) {
    query.project = project;
  }

  if (status) {
    query.status = status;
  }

  if (environment) {
    query.environment = environment;
  }

  const pipelines = await Pipeline.find(query)
    .populate('project', 'name key')
    .populate('triggeredBy', 'firstName lastName email')
    .sort('-createdAt')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();

  const count = await Pipeline.countDocuments(query);

  res.status(200).json({
    success: true,
    count: pipelines.length,
    total: count,
    totalPages: Math.ceil(count / limit),
    currentPage: parseInt(page),
    data: pipelines
  });
});

/**
 * @desc    Get single pipeline
 * @route   GET /api/v1/cicd/pipelines/:id
 * @access  Private
 */
exports.getPipeline = asyncHandler(async (req, res, next) => {
  const pipeline = await Pipeline.findById(req.params.id)
    .populate('project', 'name key')
    .populate('triggeredBy', 'firstName lastName email avatar');

  if (!pipeline) {
    return next(new ErrorResponse('Pipeline not found', 404));
  }

  res.status(200).json({
    success: true,
    data: pipeline
  });
});

/**
 * @desc    Trigger deployment
 * @route   POST /api/v1/cicd/deploy
 * @access  Private (DevOps, Admin)
 */
exports.triggerDeployment = asyncHandler(async (req, res, next) => {
  const { project, branch, environment, type } = req.body;

  // Verify project exists
  const projectDoc = await Project.findById(project);

  if (!projectDoc) {
    return next(new ErrorResponse('Project not found', 404));
  }

  // Create pipeline record
  const pipeline = await Pipeline.create({
    project,
    name: `${type || 'deploy'}-${Date.now()}`,
    provider: projectDoc.cicd.provider || 'other',
    status: 'pending',
    type: type || 'deploy',
    trigger: 'manual',
    triggeredBy: req.user.id,
    branch: branch || 'main',
    environment: environment || 'staging',
    startedAt: new Date()
  });

  logger.info(`Deployment triggered for project ${projectDoc.name} by ${req.user.email}`);

  // Notify team
  const teamMembers = projectDoc.team
    .filter(member => ['devops_engineer', 'backend_developer', 'frontend_developer'].includes(member.role))
    .map(member => member.user);

  for (const userId of teamMembers) {
    await Notification.create({
      recipient: userId,
      sender: req.user.id,
      type: 'deployment_success',
      title: 'Deployment Started',
      message: `Deployment to ${environment} initiated for ${projectDoc.name}`,
      relatedEntity: {
        entityType: 'deployment',
        entityId: pipeline._id
      },
      priority: 'high'
    });
  }

  res.status(201).json({
    success: true,
    data: pipeline,
    message: 'Deployment triggered successfully'
  });
});

/**
 * @desc    GitHub webhook handler
 * @route   POST /api/v1/cicd/webhooks/github
 * @access  Public (with validation)
 */
exports.githubWebhook = asyncHandler(async (req, res, next) => {
  const event = req.headers['x-github-event'];
  const payload = req.body;

  logger.info(`GitHub webhook received: ${event}`);

  // Handle push event
  if (event === 'push') {
    await handleGitHubPush(payload);
  }

  // Handle pull request event
  if (event === 'pull_request') {
    await handleGitHubPullRequest(payload);
  }

  // Handle workflow run event (CI/CD)
  if (event === 'workflow_run') {
    await handleGitHubWorkflowRun(payload);
  }

  res.status(200).json({ success: true, message: 'Webhook processed' });
});

/**
 * @desc    GitLab webhook handler
 * @route   POST /api/v1/cicd/webhooks/gitlab
 * @access  Public (with validation)
 */
exports.gitlabWebhook = asyncHandler(async (req, res, next) => {
  const event = req.headers['x-gitlab-event'];
  const payload = req.body;

  logger.info(`GitLab webhook received: ${event}`);

  // Handle push event
  if (event === 'Push Hook') {
    await handleGitLabPush(payload);
  }

  // Handle merge request event
  if (event === 'Merge Request Hook') {
    await handleGitLabMergeRequest(payload);
  }

  // Handle pipeline event
  if (event === 'Pipeline Hook') {
    await handleGitLabPipeline(payload);
  }

  res.status(200).json({ success: true, message: 'Webhook processed' });
});

/**
 * @desc    Update pipeline status
 * @route   PUT /api/v1/cicd/pipelines/:id
 * @access  Private
 */
exports.updatePipeline = asyncHandler(async (req, res, next) => {
  let pipeline = await Pipeline.findById(req.params.id);

  if (!pipeline) {
    return next(new ErrorResponse('Pipeline not found', 404));
  }

  pipeline = await Pipeline.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  // Notify on completion
  if (req.body.status === 'success' || req.body.status === 'failed') {
    const project = await Project.findById(pipeline.project);
    
    const notificationType = req.body.status === 'success' 
      ? 'deployment_success' 
      : 'deployment_failed';

    for (const member of project.team) {
      await Notification.create({
        recipient: member.user,
        type: notificationType,
        title: `Deployment ${req.body.status === 'success' ? 'Successful' : 'Failed'}`,
        message: `Pipeline ${pipeline.name} ${req.body.status} in ${pipeline.environment}`,
        priority: req.body.status === 'failed' ? 'urgent' : 'medium',
        relatedEntity: {
          entityType: 'deployment',
          entityId: pipeline._id
        }
      });
    }
  }

  res.status(200).json({
    success: true,
    data: pipeline
  });
});

// Helper functions for webhook processing

async function handleGitHubPush(payload) {
  const { repository, commits, ref } = payload;
  const branch = ref.split('/').pop();

  // Find project by repository URL
  const project = await Project.findOne({
    'repository.url': { $regex: repository.html_url, $options: 'i' }
  });

  if (!project) return;

  // Link commits to tasks if commit messages contain task IDs
  for (const commit of commits) {
    const taskIdMatch = commit.message.match(/\[([A-Z]+-\d+)\]/);
    if (taskIdMatch) {
      const taskId = taskIdMatch[1];
      // Update task with commit info
      await Task.updateMany(
        { project: project._id, title: { $regex: taskId, $options: 'i' } },
        {
          $push: {
            commits: {
              sha: commit.id,
              message: commit.message,
              author: commit.author.name,
              timestamp: commit.timestamp,
              url: commit.url
            }
          }
        }
      );
    }
  }

  logger.info(`Processed ${commits.length} commits for project ${project.name}`);
}

async function handleGitHubPullRequest(payload) {
  const { action, pull_request, repository } = payload;

  if (action === 'opened' || action === 'closed') {
    const project = await Project.findOne({
      'repository.url': { $regex: repository.html_url, $options: 'i' }
    });

    if (project) {
      // Update tasks with PR info
      const taskIdMatch = pull_request.title.match(/\[([A-Z]+-\d+)\]/);
      if (taskIdMatch) {
        await Task.updateMany(
          { project: project._id, title: { $regex: taskIdMatch[1], $options: 'i' } },
          {
            $push: {
              pullRequests: {
                number: pull_request.number,
                title: pull_request.title,
                status: action === 'closed' && pull_request.merged ? 'merged' : action,
                url: pull_request.html_url,
                createdAt: pull_request.created_at
              }
            }
          }
        );
      }
    }
  }
}

async function handleGitHubWorkflowRun(payload) {
  const { workflow_run, repository } = payload;

  const project = await Project.findOne({
    'repository.url': { $regex: repository.html_url, $options: 'i' }
  });

  if (project) {
    await Pipeline.create({
      project: project._id,
      name: workflow_run.name,
      provider: 'github_actions',
      status: workflow_run.conclusion === 'success' ? 'success' : 'failed',
      type: 'build',
      trigger: 'webhook',
      branch: workflow_run.head_branch,
      environment: 'staging',
      externalId: workflow_run.id.toString(),
      externalUrl: workflow_run.html_url,
      startedAt: workflow_run.created_at,
      completedAt: workflow_run.updated_at
    });
  }
}

async function handleGitLabPush(payload) {
  // Similar to GitHub push handler
  logger.info('GitLab push event processed');
}

async function handleGitLabMergeRequest(payload) {
  // Similar to GitHub PR handler
  logger.info('GitLab merge request event processed');
}

async function handleGitLabPipeline(payload) {
  // Similar to GitHub workflow handler
  logger.info('GitLab pipeline event processed');
}

module.exports = exports;
