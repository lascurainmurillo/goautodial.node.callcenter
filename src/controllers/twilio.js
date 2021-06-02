const chatapi = require('../service/chatapiService');
const moment = require('moment');
const Chat = require('../model/chat');
const list_id = process.env.LIST_ID;
const number_phone = process.env.FROM_WHATSAPP;

const whatReceiver = (req, res) => {

    const chatmodel = new Chat(); // crear instancia de chat
    const io = req.app.get('socketio'); // invocar a socket io
    console.log("-------------------- EN WHAT RECEIVER --------------------");
    console.log(req.body);

    req.body.messages.forEach(async(el) => {

        if ('+' + el.author.slice(0, -5) != number_phone) {
            console.log(" ---------------------- NO ES EL NUMBER PHONE ------------------------ ");
            let room = '+' + el.author.slice(0, -5);
            let dataroom = await chatmodel.verifyRoom(room);
            // console.log(verify, room)
            if (dataroom.length > 0) {
                console.log(" ---------------------- ENTREEEEEE ------------------------ ");
                // guardar mensaje en mongo
                const data_call = {
                    // agent_username: dataroom[0].agent_username,
                    client_id: room,
                    client_name: dataroom[0].client_name,
                    list_id: list_id,
                    room, // phone number
                    message: {
                        user: dataroom[0].client_name,
                        msg: el.body,
                        tipo: 'receiver'
                    },
                }

                console.log(" --------------  recibi ?-----------------");
                console.log(room, data_call);
                chatmodel.saveMessage(null, data_call);

                // Emitir mensajes al dashboard Agent
                io.sockets.to(room).emit('message', { user: data_call.client_name, msg: el.body, type: 'receiver', time: moment().format('h:mm a') });
                // console.log("dsdsdsdsdsdsdsd");
                // io.emit('whatss', { user: data_call.client_name, msg: el.body, type: 'receiver', time: moment().format('h:mm a'), room });

            }
            /*
            var msg = el.body;
            var phone_number = el.chatId;
            var type = el.type;*/
        }
    });

    // var respuesta = twilio.whatsReceiver();
    res.sendStatus(200);
}

const whatReceiver1 = (req, res) => {
    // console.log("-------------------- EN WHAT RECEIVER1111 --------------------");
    // console.log(req.body);
    res.sendStatus(200);
}

const whatSend = (req, res) => {
    console.log("-------------------- EN WHAT ENVIENDO --------------------");
    // console.log(req.body);
    chatapi.sendMessageWhat('+51955794343', 'Agent', 'Your TV order of 273723 has shipped and should be delivered on now. Details: More soon');
    res.sendStatus(200);
}

module.exports = {
    whatReceiver: whatReceiver,
    whatReceiver1: whatReceiver1,
    whatSend: whatSend,
};