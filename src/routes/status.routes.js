const express = require('express');
const statusController = require('../controllers/status.controller');
const router = express.Router();

//Ruta para tipos de estados
router.post('/create-status', statusController.createStatus);
router.delete('/delete-status/:id', statusController.removeStatus);
router.get('/get-status', statusController.getStatus);

module.exports = router;