const express = require('express');
const router = express.Router();
const {
  getPRDs,
  getPRD,
  createPRD,
  updatePRD,
  deletePRD,
  approvePRD,
  runComplianceCheck,
  addComment
} = require('../controllers/prdController');
const { protect, authorize } = require('../middleware/auth');
const validators = require('../utils/validators');

router.use(protect);

router
  .route('/')
  .get(validators.validatePagination, getPRDs)
  .post(
    authorize('product_manager', 'product_owner', 'admin'),
    validators.createPRD,
    createPRD
  );

router
  .route('/:id')
  .get(validators.validateId, getPRD)
  .put(validators.updatePRD, updatePRD)
  .delete(validators.validateId, deletePRD);

router
  .route('/:id/approve')
  .post(validators.validateId, approvePRD);

router
  .route('/:id/compliance-check')
  .post(validators.validateId, runComplianceCheck);

router
  .route('/:id/comments')
  .post(validators.validateId, addComment);

module.exports = router;
