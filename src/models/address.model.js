const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
    "_id": {type: mongoose.Schema.Types.ObjectId, required: true},
    "nombreRef": {type: String, required: true},
    "cp": {type: Number, required: true},
    "estado": {type: String, required: true},
    "municipio": {type: String, required: true},
    "colonia": {type: String, required: true},
    "calle": {type: String, required: true},
    "nExterior": {type: Number, required: false},
    "nInterior": {type: Number, required: false},
    "calleRef1": {type: String, required: true},
    "calleRef2": {type: String, required: true},
    "Tel": {type: Number, required: true},
    "descripcionDomicilio": {type: String, required: false}
});

module.exports = mongoose.model('Address', AddressSchema);
