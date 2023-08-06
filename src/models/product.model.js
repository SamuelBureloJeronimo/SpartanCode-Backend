const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const productModel = new Schema({
    nombre: {type: String, required: true},
    precio: {type: Number, required: true},
    descripcion: {type: String, required: true},
    categoria: {type: Schema.ObjectId, required: true, ref: 'Category', required: true},
    marca: {type: Schema.ObjectId, required: true, ref: 'Brand', required: true},
    cantidad: {type: Number, required: true},
    imagen: {type: String, required: true},
    modelo: {type: String, required: true}

});

module.exports = mongoose.model('Product', productModel);