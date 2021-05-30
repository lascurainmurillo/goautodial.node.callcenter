const moment = require('moment');
const ChatCollection = require('./chatMessage');

function Chat() {
    this.users = [];
}

// Unir user a chat
Chat.prototype.userJoin = async(socket_id, data_room) => {

    const user = {
        socket_id,
        // agent_id: data.agent_id,
        agent_username: data_room.agent_username,
        client_id: data_room.client_id, // phone number is code identity
        client_name: data_room.client_name,
        room: data_room.room,
        // msg: "",
        // time: "" // moment().format('h:mm a')
    };

    var regcount = await ChatCollection.find({ room: data_room.room });
    regcount.push(user);


    if (regcount == "0") {
        /*
        var newJoin = new ChatCollection({
            socket_id: socket_id,
            agent_username: data_call.agent_username,
            client_id: data_call.client_id, // phone number
            client_name: data_call.client_name,
            list_id: data_call.list_id,
            room: data_call.room,
        });
        await newJoin.save();
        */
    }

    // this.users.push(user);
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

Chat.prototype.saveMessage = function(socket_id, data_call) {
    data_call.socket_id = socket_id;
    var newJoin = new ChatCollection(data_call);
    newJoin.save();
    // return moment().format('h:mm a');
}

// Obtener salones usuarios para un agente
Chat.prototype.getRoomUsers = async(agent_username) => {
    // let room_client = await ChatCollection.find({ agent_username });
    let room_all = await ChatCollection.aggregate([

        {
            "$group": {
                "_id": {
                    "agent_username": "$agent_username",
                    "room": "$room",
                },
                "client_name": { $first: '$client_name' },
                "client_id": { $first: '$client_id' },
                "socket_id": { $first: '$socket_id' }
            }
        },
        {
            "$project": {
                "_id": 0,
                "agent_username": "$_id.agent_username",
                "room": "$_id.room",
                "client_name": "$client_name",
                "client_id": "$client_id",
                "socket_id": "$socket_id"
            }

        }
    ]);

    var room_clients = room_all.filter(room => room.agent_username === agent_username);
    return room_clients; // rooms.filter(user => user.room === room);
}

module.exports = Chat;