const mongoose = require('mongoose');
const { Schema } = mongoose;

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
            type: Date,
            default: Date.now
        }
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ChatMessage', ChatSchema);