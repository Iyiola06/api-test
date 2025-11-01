const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  handoffTask,
  addComment
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const validators = require('../utils/validators');

router.use(protect);

router
  .route('/')
  .get(validators.validatePagination, getTasks)
  .post(validators.createTask, createTask);

router
  .route('/:id')
  .get(validators.validateId, getTask)
  .put(validators.updateTask, updateTask)
  .delete(validators.validateId, deleteTask);

router
  .route('/:id/handoff')
  .post(validators.validateId, handoffTask);

router
  .route('/:id/comments')
  .post(validators.validateId, addComment);

module.exports = router;
