const express = require('express');
const router = express.Router();
const RoleUserController = require('../controllers/RolerUserController');

router.post('/roleUsers', RoleUserController.postRoleUser);
router.get('/roleUsers', RoleUserController.getAll);
router.put('/users/:id', RoleUserController.softDeleteRoleUser);

module.exports = router;