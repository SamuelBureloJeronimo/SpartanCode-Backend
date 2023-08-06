const express = require('express');
const categoryController = require('../controllers/category.controller');
const router = express.Router();

router.post('/create-category',categoryController.createdCategory);
router.get('/get-categories',categoryController.getCategories);
router.get('/get-category/:id',categoryController.getCategorie);
router.delete('/delete-category/:id',categoryController.deleteCategorie);
router.put('/update-category/:id',categoryController.updatedCategorie);

module.exports = router;