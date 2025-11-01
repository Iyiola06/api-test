const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide document title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  type: {
    type: String,
    enum: [
      'competitor_analysis',
      'api_documentation',
      'research_paper',
      'design_asset',
      'technical_spec',
      'user_guide',
      'meeting_notes',
      'reference_material',
      'other'
    ],
    required: true
  },
  category: {
    type: String,
    trim: true
  },
  uploadType: {
    type: String,
    enum: ['file', 'link'],
    required: true
  },
  file: {
    fileName: String,
    fileUrl: String,
    fileSize: Number,
    mimeType: String,
    s3Key: String
  },
  link: {
    url: String,
    domain: String
  },
  tags: [{
    type: String,
    trim: true
  }],
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  version: {
    type: String,
    default: '1.0'
  },
  status: {
    type: String,
    enum: ['active', 'archived', 'deprecated'],
    default: 'active'
  },
  aiSummary: {
    summary: String,
    keyPoints: [String],
    generatedAt: Date
  },
  metadata: {
    author: String,
    createdDate: Date,
    lastModified: Date,
    language: String,
    wordCount: Number,
    pageCount: Number
  },
  accessControl: {
    visibility: {
      type: String,
      enum: ['public', 'team', 'restricted'],
      default: 'team'
    },
    allowedRoles: [{
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
        'stakeholder',
        'admin'
      ]
    }],
    allowedUsers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  relatedDocuments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  }],
  relatedPRDs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PRD'
  }],
  downloads: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
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
  }]
}, {
  timestamps: true
});

// Create indexes
documentSchema.index({ project: 1 });
documentSchema.index({ type: 1 });
documentSchema.index({ uploadedBy: 1 });
documentSchema.index({ tags: 1 });

module.exports = mongoose.model('Document', documentSchema);
