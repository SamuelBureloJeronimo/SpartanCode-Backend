const express = require('express');
const brandController = require('../controllers/brand.controller');
const router = express.Router();

//Ruta para creación de brands
router.post('/create-brand', brandController.createBrand);
router.get('/get-brands', brandController.getBrands);
router.get('/get-brand/:id', brandController.getBrand);
router.put('/update-brand/:id', brandController.updateBrand);
router.delete('/delete-brand/:id', brandController.deleteBrand);

module.exports = router;
