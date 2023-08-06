const express = require('express');
const productController = require('../controllers/product.controller');

const router = express.Router();

router.post('/create-product', productController.createProduct);
router.get('/get-products', productController.getProducts);
router.get('/get-product/:id', productController.getProduct);
router.put('/update-product/:id', productController.updateProduct);
router.delete('/delete-product/:id', productController.deleteProduct);
router.get('/search-product/:name',productController.searchProduct);

module.exports = router;