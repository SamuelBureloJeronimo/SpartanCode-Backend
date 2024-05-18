const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const salesSchema = new Schema({
    "user": {type: Schema.ObjectId, required: true, ref: 'User', required: true},
    "address": {type: Schema.ObjectId, required: true, ref: 'Address', required: true},
    "articulo": {type: Schema.ObjectId, required: true, ref: 'Product', required: true},
    "fecha": {type: Date, require: true, default: Date.now},
    "cantidad": {type: Number, require: true},
    "total": {type: Number, require: true},
    "status": {type: String, required: true},    
    "noDeGuia": {type: String, required: true}
});

module.exports = mongoose.model('Sales', salesSchema);