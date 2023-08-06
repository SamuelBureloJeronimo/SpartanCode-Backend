const express = require('express');
const AddressController = require('../controllers/address.controller');
const router = express.Router();

//Ruta de Creación de direcciones
router.post('/create-address/:idUser', AddressController.createAddress);
router.put('/edit-address/:id', AddressController.editAddress);
router.get('/get-address', AddressController.getAllAddress);
router.get('/get-address/:id', AddressController.getAddress);
router.delete('/delete-address/:id', AddressController.deleteAddress);

module.exports = router;