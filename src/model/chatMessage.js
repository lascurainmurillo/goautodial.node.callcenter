const mongoose = require('mongoose');
const { Schema } = mongoose;
const moment = require('moment');

const ChatSchema = new Schema({
    socket_id: String,
    agent_username: String,
    client_id: String, // phone number
    client_name: String,
    list_id: Number,
    room: String,
    message: {
        user: String,
        msg: String,
        tipo: String,
        time: {
            type: String,
            default: moment().format('h:mm a')
        }
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ChatMessage', ChatSchema);