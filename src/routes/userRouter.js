const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

router.post('/users', UserController.postUser);
router.get('/users', UserController.getAll);
router.get('/users/:email', UserController.getByEmail);
router.put('/users/delete/:id', UserController.softDeleteUser);

module.exports = router;