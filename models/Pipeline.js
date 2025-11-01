const mongoose = require('mongoose');

const pipelineSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  provider: {
    type: String,
    enum: ['github_actions', 'gitlab_ci', 'jenkins', 'circleci', 'travis', 'bitbucket', 'other'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'running', 'success', 'failed', 'cancelled', 'skipped'],
    default: 'pending'
  },
  type: {
    type: String,
    enum: ['build', 'test', 'deploy', 'security_scan', 'quality_check'],
    required: true
  },
  trigger: {
    type: String,
    enum: ['manual', 'webhook', 'scheduled', 'automatic'],
    required: true
  },
  triggeredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  branch: {
    type: String,
    required: true
  },
  commit: {
    sha: String,
    message: String,
    author: String,
    timestamp: Date
  },
  environment: {
    type: String,
    enum: ['development', 'staging', 'production'],
    required: true
  },
  stages: [{
    name: String,
    status: {
      type: String,
      enum: ['pending', 'running', 'success', 'failed', 'skipped']
    },
    startedAt: Date,
    completedAt: Date,
    duration: Number,
    logs: String
  }],
  artifacts: [{
    name: String,
    url: String,
    size: Number,
    type: String
  }],
  testResults: {
    total: Number,
    passed: Number,
    failed: Number,
    skipped: Number,
    coverage: Number,
    reportUrl: String
  },
  securityScan: {
    vulnerabilities: {
      critical: Number,
      high: Number,
      medium: Number,
      low: Number
    },
    reportUrl: String
  },
  metrics: {
    duration: Number,
    queueTime: Number,
    buildTime: Number
  },
  externalId: {
    type: String
  },
  externalUrl: {
    type: String
  },
  startedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  logs: {
    type: String
  },
  errorMessage: {
    type: String
  }
}, {
  timestamps: true
});

// Create indexes
pipelineSchema.index({ project: 1, createdAt: -1 });
pipelineSchema.index({ status: 1 });
pipelineSchema.index({ environment: 1 });

module.exports = mongoose.model('Pipeline', pipelineSchema);
