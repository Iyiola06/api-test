const mongoose = require('mongoose');

const prdSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide PRD title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  version: {
    type: String,
    required: true,
    default: '1.0.0'
  },
  status: {
    type: String,
    enum: ['draft', 'review', 'approved', 'deprecated'],
    default: 'draft'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  approvers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    comment: String,
    approvedAt: Date
  }],
  overview: {
    type: String,
    required: [true, 'Please provide PRD overview']
  },
  objectives: [{
    description: {
      type: String,
      required: true
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'completed'],
      default: 'not_started'
    }
  }],
  targetUsers: [{
    persona: String,
    description: String,
    needs: [String]
  }],
  features: [{
    name: {
      type: String,
      required: true
    },
    description: String,
    priority: {
      type: String,
      enum: ['must_have', 'should_have', 'could_have', 'wont_have'],
      default: 'should_have'
    },
    userStories: [{
      story: String,
      acceptanceCriteria: [String],
      estimatedEffort: Number
    }],
    dependencies: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PRD'
    }],
    status: {
      type: String,
      enum: ['planned', 'in_development', 'in_qa', 'completed', 'deferred'],
      default: 'planned'
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  technicalRequirements: {
    architecture: String,
    technologies: [String],
    integrations: [String],
    scalability: String,
    security: String,
    performance: String
  },
  nonFunctionalRequirements: {
    performance: [String],
    security: [String],
    usability: [String],
    reliability: [String],
    scalability: [String]
  },
  risks: [{
    description: String,
    impact: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical']
    },
    probability: {
      type: String,
      enum: ['low', 'medium', 'high']
    },
    mitigation: String
  }],
  timeline: {
    startDate: Date,
    endDate: Date,
    phases: [{
      name: String,
      startDate: Date,
      endDate: Date,
      deliverables: [String]
    }]
  },
  successMetrics: [{
    metric: String,
    target: String,
    measurement: String
  }],
  complianceScore: {
    overall: {
      type: Number,
      default: 100,
      min: 0,
      max: 100
    },
    lastChecked: Date,
    details: {
      featuresCompleted: Number,
      requirementsMet: Number,
      deviations: [{
        type: String,
        description: String,
        severity: {
          type: String,
          enum: ['low', 'medium', 'high', 'critical']
        },
        detectedAt: Date
      }]
    }
  },
  links: {
    documents: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document'
    }],
    tasks: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task'
    }],
    commits: [String],
    pullRequests: [String]
  },
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    content: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  changeLog: [{
    version: String,
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    changes: String,
    changedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Create indexes
prdSchema.index({ project: 1, version: 1 });
prdSchema.index({ status: 1 });
prdSchema.index({ author: 1 });

module.exports = mongoose.model('PRD', prdSchema);
