const socketIO = require('socket.io');
const Chat = require('../model/chat');
const moment = require('moment');
const chatmodel = new Chat();

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

        socket.on('joinRoom', async(data_room) => {

            const user = await chatmodel.userJoin(socket.id, data_room);
            socket.join(user.room);
            // Enviar usuarios e infos
            io.to(user.room).emit('roomUsers', {
                room: user.room, // phone number
                clients: await chatmodel.getRoomUsers(user.agent_username),
            });

        });

        // Escuchar chat_mensajes
        socket.on('chatMessage', (data_call) => {
            // console.log(data_call);
            chatmodel.saveMessage(socket.id, data_call);
            io.to(data_call.room).emit('message', { user: data_call.sender.user, msg: data_call.sender.msg, create_at: moment().format('h:mm a') });
        });

        socket.on('disconnect', () => {
            console.log('User was disconnected');
        })
    });

}


module.exports = {
    socket_connection: socket_connection,
}