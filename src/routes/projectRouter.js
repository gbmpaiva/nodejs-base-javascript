const express = require('express');
const router = express.Router();
const projectController = require('../controllers/ProjectController');

router.get('/projects', projectController.getAll);
router.get('/clients/:clientId/projects', projectController.getByClientId);
router.delete('/projects/delete/:id', projectController.delete);
router.post('/projects', projectController.create);

module.exports = router;