const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');

router.post('/add-cart/:idUser',cartController.addCart);
router.put('/deleteItem-cart/:idUser',cartController.deleteItem);
router.put('/updateItem-cart/:idUser',cartController.updateItem);

module.exports = router;



 