const express = require('express');
const router = express.Router();
const {
  getDocuments,
  getDocument,
  uploadDocument,
  updateDocument,
  deleteDocument,
  generateSummary,
  addComment
} = require('../controllers/documentController');
const { protect, checkDocumentAccess } = require('../middleware/auth');
const { uploadSingle, handleUploadError } = require('../middleware/upload');
const validators = require('../utils/validators');

router.use(protect);

router
  .route('/')
  .get(validators.validatePagination, getDocuments)
  .post(
    uploadSingle,
    handleUploadError,
    validators.createDocument,
    uploadDocument
  );

router
  .route('/:id')
  .get(validators.validateId, checkDocumentAccess, getDocument)
  .put(validators.validateId, updateDocument)
  .delete(validators.validateId, deleteDocument);

router
  .route('/:id/summarize')
  .post(validators.validateId, generateSummary);

router
  .route('/:id/comments')
  .post(validators.validateId, addComment);

module.exports = router;
