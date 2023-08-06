const express = require('express');
const userController = require('../controllers/user.controller');
const router = express.Router();

//Ruta de Creación de usuarios
router.post('/create-user', userController.createUser);
router.put('/edit-user/:id', userController.updatedUser);
router.get('/get-users', userController.getUsers);
router.get('/get-user/:id', userController.getUser);
router.delete('/delete-user/:id', userController.deleteUser);
router.post('/login', userController.login);

module.exports = router;