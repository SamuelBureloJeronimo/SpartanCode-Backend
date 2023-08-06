const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    "nombre": {type: String, required: true},
    "logo": {type: String, required: true}
});

module.exports = mongoose.model('Brand', brandSchema);