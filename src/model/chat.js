const moment = require('moment');

function Chat() {
    this.users = [];
}

// Unir user a chat
Chat.prototype.userJoin = function(id, campania_id, room, data) {
    const user = {
        id,
        agent_id: data.agent_id,
        agent_username: data.agent_id,
        client_id: data.client_id, // phone number is code identity
        client_name: data.client_name,
        room,
        campania_id,
        msg: "",
        time: "" // moment().format('h:mm a')
    };
    this.users.push(user);

    return user;
}

// Obtener usuario actual
Chat.prototype.getCurrentUser = function(id) {
    return this.users.find(user => user.id === id);
}

// Usuario sale de chat
Chat.prototype.userLeave = function(id) {
    const index = this.users.findIndex(user => user.id === id);
    if (index !== -1) {
        return this.users.splice(index, 1)[0];
    }
}

// Obtener salones usuarios
Chat.prototype.getRoomUsers = function(room) {
    return this.users.filter(user => user.room === room);
}

module.exports = Chat;