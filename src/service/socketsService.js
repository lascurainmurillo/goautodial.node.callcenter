const socketIO = require('socket.io');
const Chat = require('../model/chat');
const moment = require('moment');
const chatmodel = new Chat();
const twilio = require('../service/twilioService');

const socket_connection = (server, app) => {

    const formatMessage = require('../helpers/messages_format');

    let io = socketIO(server, {
        cors: {
            origin: process.env.DOMAIN // "https://callcenter.net",
                //methods: ["GET", "POST"]
        }
    });

    const botName = 'ChatCord Bot';
    // definir en variable el socketio configuration
    // app.set('socketio', io);
    // Connection socket
    io.on('connection', (socket) => {
        console.log("Un nuevo usuario conectado");

        socket.on('joinRoom', async(data) => {

            // const user = await chatmodel.userRoomsJoin(socket.id, data);
            socket.join(data.room);
            // Enviar usuarios e infos
            var reg_client = await chatmodel.getRoomUsers(data.agent_username, data.client_id);
            console.log(reg_client);
            if (reg_client.length == "0") {
                reg_client.push(data);
            }

            io.to(data.room).emit('roomUsers', {
                room: data.room, // phone number
                clients: reg_client,
            });

        });

        // Escuchar chat_mensajes
        socket.on('chatMessage', (data_call) => {
            // console.log(data_call);
            chatmodel.saveMessage(socket.id, data_call);

            // enviar mensaje a WHATSAPP
            twilio.sendMenssageSimple(data_call.client_id, 'Agent', data_call.message.msg);

            // emitiendo mensaje al fronend chat
            io.to(data_call.room).emit('message', { user: data_call.message.user, msg: data_call.message.msg, type: data_call.message.tipo, time: moment().format('h:mm a') });
        });

        socket.on('disconnect', () => {
            console.log('User was disconnected');
        })
    });

}


module.exports = {
    socket_connection: socket_connection,
}