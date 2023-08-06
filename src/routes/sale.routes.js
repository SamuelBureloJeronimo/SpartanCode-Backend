const express = require('express');
const saleController = require('../controllers/sales.controller');
const router = express.Router();

//Ruta pra creación de sales
router.post('/create-sale', saleController.createSale);
router.put('/cancel-sale/:id', saleController.cancelSale);
router.get('/get-sales', saleController.getSales);
router.get('/get-sale/:id', saleController.getSale);

module.exports = router;