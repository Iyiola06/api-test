const mongoose = require('mongoose');

const complianceReportSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  prd: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PRD',
    required: true
  },
  reportType: {
    type: String,
    enum: ['manual', 'automatic', 'scheduled'],
    default: 'automatic'
  },
  overallScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  metrics: {
    totalRequirements: Number,
    completedRequirements: Number,
    inProgressRequirements: Number,
    pendingRequirements: Number,
    totalFeatures: Number,
    completedFeatures: Number,
    testCoverage: Number,
    codeQuality: Number
  },
  deviations: [{
    type: {
      type: String,
      enum: ['missing_requirement', 'scope_creep', 'incomplete_feature', 'test_failure', 'security_issue', 'performance_issue']
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical']
    },
    description: String,
    affectedFeature: String,
    relatedTask: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task'
    },
    recommendation: String,
    detectedAt: {
      type: Date,
      default: Date.now
    },
    resolvedAt: Date,
    status: {
      type: String,
      enum: ['open', 'in_progress', 'resolved', 'wont_fix'],
      default: 'open'
    }
  }],
  featureCompliance: [{
    featureId: mongoose.Schema.Types.ObjectId,
    featureName: String,
    status: String,
    completionPercentage: Number,
    issues: [String]
  }],
  recommendations: [{
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical']
    },
    category: String,
    description: String,
    actionItems: [String]
  }],
  aiAnalysis: {
    summary: String,
    keyFindings: [String],
    predictedRisks: [String],
    suggestedActions: [String],
    generatedAt: Date
  },
  nextReviewDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Create indexes
complianceReportSchema.index({ project: 1, createdAt: -1 });
complianceReportSchema.index({ prd: 1 });
complianceReportSchema.index({ overallScore: 1 });

module.exports = mongoose.model('ComplianceReport', complianceReportSchema);
