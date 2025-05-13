const express = require('express');
const router = express.Router();
const SchedulingController = require('../controllers/SchedulingController');



router.get('/schedulings', SchedulingController.getAll);
router.get('/schedulings/pointed', SchedulingController.getAllPointed);
router.get('/schedulings/all', SchedulingController.getAllSchedulings);
router.get('/schedulings/client/:clientId', SchedulingController.getByClient);
router.get('/schedulings/:id', SchedulingController.getById); // rota específica para ID
router.post('/schedulings', SchedulingController.postScheduling);
router.put('/schedulings/delete/:id', SchedulingController.softDeleteScheduling);
router.put('/schedulings/apontamento/:id', SchedulingController.putSchedulingApontamento);


module.exports = router;