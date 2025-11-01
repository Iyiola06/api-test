const Project = require('../models/Project');
const Task = require('../models/Task');
const PRD = require('../models/PRD');
const Pipeline = require('../models/Pipeline');
const ComplianceReport = require('../models/ComplianceReport');
const asyncHandler = require('../utils/asyncHandler');
const { ErrorResponse } = require('../utils/errorHandler');

/**
 * @desc    Get role-specific dashboard data
 * @route   GET /api/v1/analytics/dashboard/:role
 * @access  Private
 */
exports.getRoleDashboard = asyncHandler(async (req, res, next) => {
  const { role } = req.params;
  const { projectId } = req.query;

  let dashboardData = {};

  // Common metrics for all roles
  const commonMetrics = await getCommonMetrics(req.user.id, projectId);

  switch (role) {
    case 'product_manager':
    case 'product_owner':
      dashboardData = await getPMDashboard(req.user.id, projectId);
      break;
    case 'frontend_developer':
    case 'backend_developer':
    case 'ai_ml_engineer':
      dashboardData = await getDeveloperDashboard(req.user.id, projectId);
      break;
    case 'devops_engineer':
      dashboardData = await getDevOpsDashboard(req.user.id, projectId);
      break;
    case 'qa_engineer':
      dashboardData = await getQADashboard(req.user.id, projectId);
      break;
    case 'cybersecurity_engineer':
      dashboardData = await getSecurityDashboard(req.user.id, projectId);
      break;
    case 'product_designer':
      dashboardData = await getDesignerDashboard(req.user.id, projectId);
      break;
    case 'stakeholder':
      dashboardData = await getStakeholderDashboard(req.user.id, projectId);
      break;
    default:
      return next(new ErrorResponse('Invalid role', 400));
  }

  res.status(200).json({
    success: true,
    data: {
      ...commonMetrics,
      ...dashboardData
    }
  });
});

/**
 * @desc    Get project velocity metrics
 * @route   GET /api/v1/analytics/velocity
 * @access  Private
 */
exports.getVelocityMetrics = asyncHandler(async (req, res, next) => {
  const { projectId, startDate, endDate } = req.query;

  let query = {};
  if (projectId) query.project = projectId;

  // Calculate completed tasks in time range
  const completedTasks = await Task.find({
    ...query,
    status: 'done',
    completedAt: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  }).lean();

  // Calculate story points completed
  const totalStoryPoints = completedTasks.reduce(
    (sum, task) => sum + (task.estimation?.storyPoints || 0),
    0
  );

  // Group by sprint
  const sprintVelocity = {};
  completedTasks.forEach(task => {
    if (task.sprint?.name) {
      if (!sprintVelocity[task.sprint.name]) {
        sprintVelocity[task.sprint.name] = {
          tasks: 0,
          storyPoints: 0
        };
      }
      sprintVelocity[task.sprint.name].tasks++;
      sprintVelocity[task.sprint.name].storyPoints += task.estimation?.storyPoints || 0;
    }
  });

  res.status(200).json({
    success: true,
    data: {
      totalTasksCompleted: completedTasks.length,
      totalStoryPoints,
      averageVelocity: totalStoryPoints / Object.keys(sprintVelocity).length || 0,
      sprintVelocity
    }
  });
});

/**
 * @desc    Get compliance analytics
 * @route   GET /api/v1/analytics/compliance
 * @access  Private
 */
exports.getComplianceAnalytics = asyncHandler(async (req, res, next) => {
  const { projectId } = req.query;

  let query = {};
  if (projectId) query.project = projectId;

  // Get latest compliance reports
  const reports = await ComplianceReport.find(query)
    .sort('-createdAt')
    .limit(10)
    .populate('prd', 'title version')
    .lean();

  // Calculate average score
  const avgScore = reports.length > 0
    ? reports.reduce((sum, r) => sum + r.overallScore, 0) / reports.length
    : 0;

  // Count deviations by severity
  const deviationsBySeverity = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0
  };

  reports.forEach(report => {
    report.deviations.forEach(dev => {
      deviationsBySeverity[dev.severity]++;
    });
  });

  res.status(200).json({
    success: true,
    data: {
      averageComplianceScore: avgScore,
      recentReports: reports,
      deviationsBySeverity,
      totalDeviations: Object.values(deviationsBySeverity).reduce((a, b) => a + b, 0)
    }
  });
});

/**
 * @desc    Get deployment analytics
 * @route   GET /api/v1/analytics/deployments
 * @access  Private
 */
exports.getDeploymentAnalytics = asyncHandler(async (req, res, next) => {
  const { projectId, days = 30 } = req.query;

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  let query = {
    createdAt: { $gte: startDate }
  };

  if (projectId) query.project = projectId;

  const pipelines = await Pipeline.find(query).lean();

  // Calculate metrics
  const successRate = pipelines.length > 0
    ? (pipelines.filter(p => p.status === 'success').length / pipelines.length) * 100
    : 0;

  const avgDuration = pipelines.length > 0
    ? pipelines.reduce((sum, p) => sum + (p.metrics?.duration || 0), 0) / pipelines.length
    : 0;

  // Group by environment
  const byEnvironment = {};
  pipelines.forEach(p => {
    if (!byEnvironment[p.environment]) {
      byEnvironment[p.environment] = {
        total: 0,
        success: 0,
        failed: 0
      };
    }
    byEnvironment[p.environment].total++;
    if (p.status === 'success') byEnvironment[p.environment].success++;
    if (p.status === 'failed') byEnvironment[p.environment].failed++;
  });

  res.status(200).json({
    success: true,
    data: {
      totalDeployments: pipelines.length,
      successRate: successRate.toFixed(2),
      averageDuration: avgDuration.toFixed(2),
      byEnvironment,
      recentPipelines: pipelines.slice(0, 10)
    }
  });
});

// Helper functions for role-specific dashboards

async function getCommonMetrics(userId, projectId) {
  let projectQuery = { 'team.user': userId };
  if (projectId) projectQuery._id = projectId;

  const projects = await Project.find(projectQuery).lean();
  const projectIds = projects.map(p => p._id);

  const myTasks = await Task.countDocuments({
    assignee: userId,
    status: { $ne: 'done' }
  });

  return {
    activeProjects: projects.length,
    myActiveTasks: myTasks
  };
}

async function getPMDashboard(userId, projectId) {
  let query = {};
  if (projectId) query.project = projectId;

  const totalProjects = await Project.countDocuments({
    $or: [{ owner: userId }, { 'team.user': userId }],
    ...query
  });

  const prds = await PRD.countDocuments({ ...query, author: userId });
  const tasks = await Task.find(query).lean();

  return {
    totalProjects,
    totalPRDs: prds,
    tasksByStatus: {
      backlog: tasks.filter(t => t.status === 'backlog').length,
      inProgress: tasks.filter(t => t.status === 'in_progress').length,
      done: tasks.filter(t => t.status === 'done').length
    }
  };
}

async function getDeveloperDashboard(userId, projectId) {
  let query = { assignee: userId };
  if (projectId) query.project = projectId;

  const tasks = await Task.find(query).lean();
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
  const completedThisWeek = tasks.filter(t => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return t.status === 'done' && t.completedAt >= weekAgo;
  });

  return {
    tasksInProgress: inProgressTasks.length,
    completedThisWeek: completedThisWeek.length,
    blockedTasks: tasks.filter(t => t.status === 'blocked').length
  };
}

async function getDevOpsDashboard(userId, projectId) {
  let query = {};
  if (projectId) query.project = projectId;

  const recentPipelines = await Pipeline.find(query)
    .sort('-createdAt')
    .limit(10)
    .lean();

  const successRate = recentPipelines.length > 0
    ? (recentPipelines.filter(p => p.status === 'success').length / recentPipelines.length) * 100
    : 0;

  return {
    recentPipelines: recentPipelines.length,
    successRate: successRate.toFixed(2),
    failedPipelines: recentPipelines.filter(p => p.status === 'failed').length
  };
}

async function getQADashboard(userId, projectId) {
  let query = { 'workflow.currentRole': 'qa_engineer' };
  if (projectId) query.project = projectId;

  const tasksInQA = await Task.countDocuments(query);
  const tasks = await Task.find({ assignee: userId }).lean();

  return {
    tasksInQA,
    testsPassed: tasks.filter(t => 
      t.testCases?.every(tc => tc.status === 'passed')
    ).length,
    testsFailed: tasks.filter(t => 
      t.testCases?.some(tc => tc.status === 'failed')
    ).length
  };
}

async function getSecurityDashboard(userId, projectId) {
  let query = {};
  if (projectId) query.project = projectId;

  const pipelines = await Pipeline.find(query)
    .sort('-createdAt')
    .limit(20)
    .lean();

  const vulnerabilities = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0
  };

  pipelines.forEach(p => {
    if (p.securityScan?.vulnerabilities) {
      vulnerabilities.critical += p.securityScan.vulnerabilities.critical || 0;
      vulnerabilities.high += p.securityScan.vulnerabilities.high || 0;
      vulnerabilities.medium += p.securityScan.vulnerabilities.medium || 0;
      vulnerabilities.low += p.securityScan.vulnerabilities.low || 0;
    }
  });

  return {
    totalVulnerabilities: Object.values(vulnerabilities).reduce((a, b) => a + b, 0),
    vulnerabilitiesBySeverity: vulnerabilities
  };
}

async function getDesignerDashboard(userId, projectId) {
  let query = { 'workflow.currentRole': 'product_designer' };
  if (projectId) query.project = projectId;

  const designTasks = await Task.countDocuments(query);
  const myTasks = await Task.find({ assignee: userId }).lean();

  return {
    designTasksPending: designTasks,
    reviewsNeeded: myTasks.filter(t => t.status === 'in_review').length
  };
}

async function getStakeholderDashboard(userId, projectId) {
  let query = {};
  if (projectId) query._id = projectId;

  const projects = await Project.find({
    $or: [{ owner: userId }, { 'team.user': userId }],
    ...query
  }).lean();

  const projectIds = projects.map(p => p._id);

  const tasks = await Task.find({ project: { $in: projectIds } }).lean();
  const prds = await PRD.find({ project: { $in: projectIds } }).lean();

  return {
    totalProjects: projects.length,
    projectsOnTrack: projects.filter(p => p.status === 'active').length,
    totalTasks: tasks.length,
    completionRate: tasks.length > 0
      ? ((tasks.filter(t => t.status === 'done').length / tasks.length) * 100).toFixed(2)
      : 0,
    approvedPRDs: prds.filter(p => p.status === 'approved').length
  };
}

module.exports = exports;
