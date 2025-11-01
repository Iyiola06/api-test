const express = require('express');
const router = express.Router();
const {
  getPipelines,
  getPipeline,
  triggerDeployment,
  updatePipeline,
  githubWebhook,
  gitlabWebhook
} = require('../controllers/cicdController');
const { protect, authorize } = require('../middleware/auth');
const validators = require('../utils/validators');

// Webhook routes (public)
router.post('/webhooks/github', githubWebhook);
router.post('/webhooks/gitlab', gitlabWebhook);

// Protected routes
router.use(protect);

router
  .route('/pipelines')
  .get(validators.validatePagination, getPipelines);

router
  .route('/pipelines/:id')
  .get(validators.validateId, getPipeline)
  .put(validators.validateId, updatePipeline);

router
  .route('/deploy')
  .post(
    authorize('devops_engineer', 'backend_developer', 'admin'),
    triggerDeployment
  );

module.exports = router;
