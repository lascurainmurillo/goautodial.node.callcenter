const socketIO = require('socket.io');
const Chat = require('../model/chat');
const moment = require('moment');
const chatmodel = new Chat();
// const twilio = require('../service/twilioService');
const chatapi = require('../service/chatapiService');

const socket_connection = (server, app) => {

    const formatMessage = require('../helpers/messages_format');

    let io = socketIO(server, {
        cors: {
            origin: process.env.DOMAIN, // "https://callcenter.net",
            methods: ["GET", "POST"]
        }
    });

    const botName = 'ChatCord Bot';
    // definir en variable el socketio configuration
    app.set('socketio', io);
    // Connection socket
    io.on('connection', async(socket) => {
        console.log("UN NUEVO USUARIO CONECTADO");

        // definiendo los salones al conectar el USUARIO
        var agent_username = socket.request._query.agent_username;
        if (agent_username != null) {
            var reg_client = await chatmodel.getRoomUsers(agent_username);
            reg_client.forEach(el => {
                socket.join(el.room);
            });
        }

        // envia un mensaje al cliente para verificar que ya está conectado
        io.emit('conectadocustom', true);

        socket.on('joinRoom', async(data) => {

            // Enviar usuarios e infos
            var reg_client = await chatmodel.getRoomUsers(data.agent_username);
            if (data.room != null && reg_client.find(el => el.room == data.room) == null) {
                reg_client.push(data);
            }

            // definiendo nuevos salones cuando entra un CLIENTE
            reg_client.forEach(el => {
                socket.join(el.room);
            });

            // cuando entra un (telefono) o room se emite para ese room
            if (data.room != null) {
                console.log("emitiendo room: " + data.room);
                io.to(data.room).emit('roomUsers', {
                    room: data.room, // phone number
                    agent_fromsocket: data.agent_username
                });
            } else if (reg_client.length > 0) { // cuando no hay ningun telefono entrando coge el primer room de la base
                console.log("emitiendo room reg_client: " + reg_client[0].room);
                io.to(reg_client[0].room).emit('roomUsers', {
                    room: reg_client[0].room, // phone number
                    agent_fromsocket: data.agent_username
                });
            }
        });

        // Escuchar chat_mensajes
        socket.on('chatMessage', async(data_call) => {
            // guardar mensaje en mongo
            chatmodel.saveMessage(socket.id, data_call);
            // enviar mensaje a WHATSAPP
            console.log(data_call);
            if (data_call.message.send_tipo == "video" || data_call.message.send_tipo == "image" || data_call.message.send_tipo == "document") {
                console.log("FILEEEEEEEE");
                var send_tipo = data_call.message.send_tipo;
                await chatapi.sendMessageFile(data_call.client_id, data_call.message.msg, data_call.message.filename); // enviando file a whatsapp
            } else if (data_call.message.send_tipo == 'chat') {
                console.log("CHATTTTTTTT");
                var send_tipo = 'chat';
                chatapi.sendMessageWhat(data_call.client_id, 'Agent', data_call.message.msg); // enviando a whatsapp
            }

            // emitiendo mensaje al fronend chat
            io.to(data_call.room).emit('message', {
                user: data_call.message.user,
                msg: data_call.message.msg,
                tipo: data_call.message.tipo,
                time: Date.now(),
                caption: null,
                send_tipo,
                room: data_call.client_id,
                id_tag_chatting: data_call.message.id_tag_chatting
            });
        });

        socket.on('disconnect', () => {
            console.log('User was disconnected');
            var self = this;
            if (self.rooms != null) {
                var rooms = Object.keys(self.rooms);
            }
            console.log(rooms);
        })
    });

}


module.exports = {
    socket_connection: socket_connection,
}