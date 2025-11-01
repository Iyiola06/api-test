const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  prd: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PRD'
  },
  title: {
    type: String,
    required: [true, 'Please provide task title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide task description']
  },
  type: {
    type: String,
    enum: ['feature', 'bug', 'enhancement', 'research', 'documentation', 'testing', 'deployment'],
    required: true
  },
  status: {
    type: String,
    enum: ['backlog', 'todo', 'in_progress', 'in_review', 'in_qa', 'blocked', 'done', 'cancelled'],
    default: 'backlog'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sprint: {
    name: String,
    startDate: Date,
    endDate: Date
  },
  estimation: {
    storyPoints: Number,
    hours: Number
  },
  timeTracking: {
    originalEstimate: Number,
    timeSpent: Number,
    remainingTime: Number
  },
  tags: [{
    type: String,
    trim: true
  }],
  dependencies: [{
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task'
    },
    type: {
      type: String,
      enum: ['blocks', 'is_blocked_by', 'relates_to']
    }
  }],
  acceptanceCriteria: [{
    description: String,
    completed: {
      type: Boolean,
      default: false
    }
  }],
  workflow: {
    currentRole: {
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
        'ai_ml_engineer'
      ]
    },
    history: [{
      fromRole: String,
      toRole: String,
      handedOffBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      handedOffAt: Date,
      notes: String
    }]
  },
  commits: [{
    sha: String,
    message: String,
    author: String,
    timestamp: Date,
    url: String
  }],
  pullRequests: [{
    number: Number,
    title: String,
    status: {
      type: String,
      enum: ['open', 'closed', 'merged']
    },
    url: String,
    createdAt: Date
  }],
  testCases: [{
    name: String,
    status: {
      type: String,
      enum: ['pending', 'passed', 'failed', 'skipped']
    },
    executedAt: Date,
    executedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  attachments: [{
    fileName: String,
    fileUrl: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: Date
  }],
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
  dueDate: {
    type: Date
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Create indexes
taskSchema.index({ project: 1 });
taskSchema.index({ assignee: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ priority: 1 });

module.exports = mongoose.model('Task', taskSchema);
