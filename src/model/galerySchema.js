const mongoose = require('mongoose');
const { Schema } = mongoose;
const moment = require('moment');

const GalerySchema = new Schema({
    file: String,
    name: String,
    agent_username: String,
    tipo: String,
    created_at: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Galery', GalerySchema);