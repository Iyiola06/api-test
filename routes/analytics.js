const express = require('express');
const router = express.Router();
const {
  getRoleDashboard,
  getVelocityMetrics,
  getComplianceAnalytics,
  getDeploymentAnalytics
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/dashboard/:role', getRoleDashboard);
router.get('/velocity', getVelocityMetrics);
router.get('/compliance', getComplianceAnalytics);
router.get('/deployments', getDeploymentAnalytics);

module.exports = router;
