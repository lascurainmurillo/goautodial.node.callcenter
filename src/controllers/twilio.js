const chatapi = require('../service/chatapiService');
const moment = require('moment');
const Chat = require('../model/chat');
const list_id = process.env.LIST_ID;
const number_phone = process.env.FROM_WHATSAPP;
const chatmodel = new Chat(); // crear instancia de chat

const whatReceiver = (req, res) => {


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

                saveSendMessageWhat(room, dataroom, el, 'receiver', dataroom[0].client_name, io);

            }
        } else if ('+' + el.author.slice(0, -5) == number_phone && el.self == "0") {
            console.log(" ---------------------- MENSAJE DESDE LA APP WHATSAPP ------------------------ ");
            let room = '+' + el.chatId.slice(0, -5);
            let dataroom = await chatmodel.verifyRoom(room);

            if (dataroom.length > 0) {

                saveSendMessageWhat(room, dataroom, el, 'sender', 'APP WHATSAPP', io);

            }
        }
    });
    // var respuesta = twilio.whatsReceiver();
    res.sendStatus(200);
}


const saveSendMessageWhat = function(room, dataroom, el, tipo, user, io) {
    console.log(" ---------------------- ENTREEEEEE ------------------------ ");
    // guardar mensaje en mongo
    const data_call = {
        // agent_username: dataroom[0].agent_username,
        client_id: room,
        client_name: dataroom[0].client_name,
        list_id: list_id,
        room, // phone number
        message: {
            user,
            msg: el.body,
            tipo, // sender or receiver
            caption: el.caption,
            send_tipo: el.type
        },
    }

    console.log(" --------------  recibi ?-----------------");
    console.log(room, data_call);
    chatmodel.saveMessage(null, data_call);

    // Emitir mensajes al dashboard Agent
    io.sockets.to(room).emit('message', { user, msg: el.body, tipo, time: Date.now(), caption: el.caption, send_tipo: el.type, room });
    // io.emit('whatss', { user: data_call.client_name, msg: el.body, type: 'receiver', time: moment().format('h:mm a'), room });
}

/**
 * 
 * Enviar mensajes de Whatsapp OJOOOOOOOOOOOOOOOOOOOOOO NO OLVIDAR PONERLE SEGURIDAD
 * @param {*} req 
 * @param {*} res 
 * 
 */
const getMessages = async(req, res) => {
    // console.log(req.query.room);
    var data = await chatmodel.getMessage(req.query.room);
    res.send(data);
}

/**
 * 
 * Enviar lista de rooms OJOOOOOOOOOOOOOOOOOOOOOOOOO NO OLVIDAR PONERLE SEGURIDAD
 * @param {*} req 
 * @param {*} res 
 */
const getRoomUsers = async(req, res) => {
    console.log(" ----------- GETROOMUSERS -------------- ");
    console.log(req.query.agent_username);
    var data = await chatmodel.getRoomUsers(req.query.agent_username, req.query.client_id);
    res.send(data);
}


const whatReceiver1 = (req, res) => {
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
    getMessages: getMessages,
    getRoomUsers: getRoomUsers
};