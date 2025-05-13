const express = require('express');
const router = express.Router();
const RoleController = require('../controllers/RoleController');

router.post('/roles', RoleController.postRole);
router.get('/roles', RoleController.getAllRole);
router.put('/roles/:id', RoleController.softDeleteRole);

module.exports = router;