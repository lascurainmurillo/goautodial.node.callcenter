const moment = require('moment');
const { prototype } = require('twilio/lib/jwt/taskrouter/TaskRouterCapability');
const ChatCollection = require('./chatMessage');

function Chat() {
    this.users = [];
}

// Unir user a chat
Chat.prototype.userRoomsJoin = async(socket_id, data_room) => {

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

    // var regcount = await ChatCollection.find({ room: data_room.room });
    // regcount.push(user);
    var reg_clients = await getRoomUsers(user.agent_username);
    reg_clients.push(user);


    if (reg_clients.length == "0") {

    }

    // this.users.push(user);
    return { user, list: reg_clients };
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
    console.log("--- entrando a guardar mensaje ----");
    data_call.socket_id = socket_id;
    data_call.message.time = Date.now();
    var newJoin = new ChatCollection(data_call);
    newJoin.save();
    // return moment().format('h:mm a');
}

Chat.prototype.getMessage = async(room, datee, ini = 0) => {
    // return ChatCollection.find({ room }, {}, { sort: { 'created_at': -1 } }).limit(10);
    var cou = await ChatCollection.find({ room, created_at: { $lt: new Date(datee) } }).count();

    if (cou > 15) {
        cou = cou - 15;
        var data = await ChatCollection.find({ room, created_at: { $lt: new Date(datee) } }).skip(cou); // .limit(10);

        data.push({ previous: true });
        return data;

    } else if (cou > 0) {
        var data = await ChatCollection.find({ room, created_at: { $lt: new Date(datee) } }); // .limit(10);

        return data;
    } else {
        return [];
    }
}

// Obtener salones usuarios para un agente
Chat.prototype.getRoomUsers = async(agent_username, client_id = null) => {
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
                "socket_id": "$socket_id",
                "agent_username": "$_id.agent_username",
                "room": "$_id.room",
                "client_name": "$client_name",
                "client_id": "$client_id",
            }

        }
    ]);

    if (!client_id) {
        var room_clients = room_all.filter(room => room.agent_username === agent_username);
    } else {
        var room_clients = room_all.filter(room => (room.agent_username === agent_username && room.client_id === client_id));

    }
    return room_clients; // rooms.filter(user => user.room === room);
}

/**
 * 
 * 
 * 
 */
Chat.prototype.verifyRoom = async(room) => {
    return await ChatCollection.find({ room }).limit(1);
}

module.exports = Chat;