const Document = require('../models/Document');
const Project = require('../models/Project');
const asyncHandler = require('../utils/asyncHandler');
const { ErrorResponse } = require('../utils/errorHandler');
const aiService = require('../utils/aiService');
const logger = require('../utils/logger');
const fs = require('fs').promises;
const path = require('path');

/**
 * @desc    Get all documents
 * @route   GET /api/v1/documents
 * @access  Private
 */
exports.getDocuments = asyncHandler(async (req, res, next) => {
  const { project, type, category, search, page = 1, limit = 10 } = req.query;

  let query = {};

  if (project) {
    query.project = project;
  }

  if (type) {
    query.type = type;
  }

  if (category) {
    query.category = category;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } }
    ];
  }

  const documents = await Document.find(query)
    .populate('project', 'name key')
    .populate('uploadedBy', 'firstName lastName email avatar')
    .sort('-createdAt')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();

  const count = await Document.countDocuments(query);

  res.status(200).json({
    success: true,
    count: documents.length,
    total: count,
    totalPages: Math.ceil(count / limit),
    currentPage: parseInt(page),
    data: documents
  });
});

/**
 * @desc    Get single document
 * @route   GET /api/v1/documents/:id
 * @access  Private
 */
exports.getDocument = asyncHandler(async (req, res, next) => {
  const document = await Document.findById(req.params.id)
    .populate('project', 'name key')
    .populate('uploadedBy', 'firstName lastName email avatar')
    .populate('relatedDocuments')
    .populate('relatedPRDs');

  if (!document) {
    return next(new ErrorResponse('Document not found', 404));
  }

  // Increment view count
  document.views += 1;
  await document.save();

  res.status(200).json({
    success: true,
    data: document
  });
});

/**
 * @desc    Upload document
 * @route   POST /api/v1/documents
 * @access  Private
 */
exports.uploadDocument = asyncHandler(async (req, res, next) => {
  // Verify project exists
  const project = await Project.findById(req.body.project);

  if (!project) {
    return next(new ErrorResponse('Project not found', 404));
  }

  const documentData = {
    ...req.body,
    uploadedBy: req.user.id
  };

  // Handle file upload
  if (req.body.uploadType === 'file' && req.file) {
    documentData.file = {
      fileName: req.file.originalname,
      fileUrl: `/uploads/${req.file.filename}`,
      fileSize: req.file.size,
      mimeType: req.file.mimetype
    };
  }

  // Handle link
  if (req.body.uploadType === 'link' && req.body.url) {
    const url = new URL(req.body.url);
    documentData.link = {
      url: req.body.url,
      domain: url.hostname
    };
  }

  const document = await Document.create(documentData);

  // Generate AI summary if file is text-based
  if (document.uploadType === 'file' && 
      ['text/plain', 'application/pdf'].includes(document.file.mimeType)) {
    // This would be implemented with actual file reading logic
    // For now, we'll skip the actual summarization
  }

  logger.info(`Document uploaded: ${document.title} by ${req.user.email}`);

  res.status(201).json({
    success: true,
    data: document
  });
});

/**
 * @desc    Update document
 * @route   PUT /api/v1/documents/:id
 * @access  Private
 */
exports.updateDocument = asyncHandler(async (req, res, next) => {
  let document = await Document.findById(req.params.id);

  if (!document) {
    return next(new ErrorResponse('Document not found', 404));
  }

  // Check authorization
  if (document.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to update this document', 403));
  }

  document = await Document.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: document
  });
});

/**
 * @desc    Delete document
 * @route   DELETE /api/v1/documents/:id
 * @access  Private
 */
exports.deleteDocument = asyncHandler(async (req, res, next) => {
  const document = await Document.findById(req.params.id);

  if (!document) {
    return next(new ErrorResponse('Document not found', 404));
  }

  // Check authorization
  if (document.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to delete this document', 403));
  }

  // Delete file from filesystem if it exists
  if (document.uploadType === 'file' && document.file.fileUrl) {
    const filePath = path.join(__dirname, '..', document.file.fileUrl);
    try {
      await fs.unlink(filePath);
    } catch (error) {
      logger.error(`Error deleting file: ${error.message}`);
    }
  }

  await document.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
    message: 'Document deleted successfully'
  });
});

/**
 * @desc    Generate AI summary for document
 * @route   POST /api/v1/documents/:id/summarize
 * @access  Private
 */
exports.generateSummary = asyncHandler(async (req, res, next) => {
  const document = await Document.findById(req.params.id);

  if (!document) {
    return next(new ErrorResponse('Document not found', 404));
  }

  // For demo purposes, using placeholder content
  // In production, you'd read the actual file content
  const documentContent = req.body.content || 'Document content...';

  const summary = await aiService.summarizeDocument(documentContent, document.type);

  if (summary) {
    document.aiSummary = summary;
    await document.save();
  }

  res.status(200).json({
    success: true,
    data: summary
  });
});

/**
 * @desc    Add comment to document
 * @route   POST /api/v1/documents/:id/comments
 * @access  Private
 */
exports.addComment = asyncHandler(async (req, res, next) => {
  const document = await Document.findById(req.params.id);

  if (!document) {
    return next(new ErrorResponse('Document not found', 404));
  }

  const comment = {
    user: req.user.id,
    content: req.body.content,
    createdAt: new Date()
  };

  document.comments.push(comment);
  await document.save();

  await document.populate('comments.user', 'firstName lastName email avatar');

  res.status(200).json({
    success: true,
    data: document.comments
  });
});
