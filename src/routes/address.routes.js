const express = require('express');
const AddressController = require('../controllers/address.controller');
const router = express.Router();

//Ruta de Creación de direcciones
router.post('/create-address/:idUser', AddressController.createAddress);
router.get('/get-addressByUser/:idUser', AddressController.getAddressByUser);
router.put('/change-addressUser/:idUser', AddressController.changeAddress);

module.exports = router;