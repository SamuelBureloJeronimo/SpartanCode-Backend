const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let statusModel = new Schema({
    status: {type: String}
});

module.exports = mongoose.model('Status', statusModel);