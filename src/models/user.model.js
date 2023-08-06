const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    "nick": {type: String, required: true},
    "correo_electronico": {type: String, required: true},
    "nombre": {type: String, required: true},
    "rol": {"_id": mongoose.Schema.ObjectId, type: String, ref: 'Rol'},
    "imagen": {type: String},
    "fecha_registro": {type: Date, required: false},
    "fecha_nacimiento": {type: Date, required: true},
    "password": {type: String, required: true},
    "sexo": {type: String, required: true},
    "addresses": [{"_id": mongoose.Schema.ObjectId, type: String, ref: 'Address'}],
    "carrito": {type: Array, required: false}
});

module.exports = mongoose.model('User', userSchema);