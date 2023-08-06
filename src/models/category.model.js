const mongoose = require('mongoose');

const CategoryShema = new mongoose.Schema({
    "nombre":{type:String, required:true},
    "descripcion":{type:String,required:true}
});

module.exports = mongoose.model('Category',CategoryShema);