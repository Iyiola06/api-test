const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addTeamMember,
  removeTeamMember
} = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/auth');
const validators = require('../utils/validators');

router.use(protect);

router
  .route('/')
  .get(validators.validatePagination, getProjects)
  .post(
    authorize('product_manager', 'product_owner', 'admin'),
    validators.createProject,
    createProject
  );

router
  .route('/:id')
  .get(validators.validateId, getProject)
  .put(
    authorize('product_manager', 'product_owner', 'admin'),
    validators.updateProject,
    updateProject
  )
  .delete(
    authorize('product_manager', 'product_owner', 'admin'),
    validators.validateId,
    deleteProject
  );

router
  .route('/:id/team')
  .post(
    authorize('product_manager', 'product_owner', 'admin'),
    addTeamMember
  );

router
  .route('/:id/team/:userId')
  .delete(
    authorize('product_manager', 'product_owner', 'admin'),
    removeTeamMember
  );

module.exports = router;
