const express = require('express');
const router = express.Router();
const rolController = require('../controllers/rol.controller');

//Rutas para rol
router.post('/initialize', rolController.initialize);    

module.exports = router;