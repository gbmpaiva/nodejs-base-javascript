const express = require('express');
const router = express.Router();
const models = require('../models');
const ClientController = require('../controllers/ClientController');

const clientController = new ClientController(models);

router.post('/clients', (req, res) => clientController.postClient(req, res));
router.get('/clients', (req, res) => clientController.getAllClients(req, res));
router.get('/clients/:id', (req, res) => clientController.getClientById(req, res));
router.put('/clients/delete/:id', (req, res) => clientController.softDeleteClient(req, res));

module.exports = router;
