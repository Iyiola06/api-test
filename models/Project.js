const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide project name'],
    trim: true,
    maxlength: [100, 'Project name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide project description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  key: {
    type: String,
    required: [true, 'Please provide project key'],
    unique: true,
    uppercase: true,
    trim: true,
    match: [/^[A-Z]{2,10}$/, 'Project key must be 2-10 uppercase letters']
  },
  status: {
    type: String,
    enum: ['planning', 'active', 'on_hold', 'completed', 'archived'],
    default: 'planning'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  team: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: [
        'product_manager',
        'product_owner',
        'product_designer',
        'frontend_developer',
        'backend_developer',
        'devops_engineer',
        'cybersecurity_engineer',
        'qa_engineer',
        'ai_ml_engineer',
        'stakeholder'
      ],
      required: true
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  startDate: {
    type: Date,
    default: Date.now
  },
  targetEndDate: {
    type: Date
  },
  actualEndDate: {
    type: Date
  },
  budget: {
    allocated: {
      type: Number,
      default: 0
    },
    spent: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  milestones: [{
    name: String,
    description: String,
    dueDate: Date,
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'delayed'],
      default: 'pending'
    },
    completedAt: Date
  }],
  tags: [{
    type: String,
    trim: true
  }],
  repository: {
    provider: {
      type: String,
      enum: ['github', 'gitlab', 'bitbucket', 'other']
    },
    url: String,
    branch: {
      type: String,
      default: 'main'
    }
  },
  cicd: {
    enabled: {
      type: Boolean,
      default: false
    },
    provider: {
      type: String,
      enum: ['github_actions', 'gitlab_ci', 'jenkins', 'circleci', 'other']
    },
    configUrl: String
  },
  settings: {
    allowPublicAccess: {
      type: Boolean,
      default: false
    },
    requireApproval: {
      type: Boolean,
      default: true
    },
    autoDeployment: {
      type: Boolean,
      default: false
    },
    notificationChannels: {
      slack: String,
      email: [String]
    }
  },
  isArchived: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create index for faster queries
projectSchema.index({ key: 1 });
projectSchema.index({ owner: 1 });
projectSchema.index({ status: 1 });

// Virtual for PRDs
projectSchema.virtual('prds', {
  ref: 'PRD',
  localField: '_id',
  foreignField: 'project'
});

// Virtual for tasks
projectSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'project'
});

module.exports = mongoose.model('Project', projectSchema);
