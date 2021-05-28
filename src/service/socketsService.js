const socketIO = require('socket.io');
const Chat = require('../model/chat');
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

        socket.on('joinRoom', ({ username, client, room }) => {

            const user = chatmodel.userJoin(socket.id, username, client, room);
            socket.join(user.room);

            // Send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: chatmodel.getRoomUsers(user.room),
            });

        });

        console.log("Un nuevo usuario conectado");
        socket.emit('message', formatMessage(botName, 'Bienvenido Chatbots!'));

        // Escuchar chat_mensajes
        socket.on('chatMessage', msg => {
            console.log(msg);
            // const user = getCurrentUser(socket.id);
            // io.to(user.room).emit('message', formatMessage(user.username, msg));
            io.emit('message', formatMessage('Usuario', msg));
        });

        socket.on('disconnect', () => {
            console.log('USer was disconnected');
        })
    });

}


module.exports = {
    socket_connection: socket_connection,
}