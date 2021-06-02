/*
 *
 *
 *
 *
 *
 * NO SE ESTÁ USANDO TWILIO PARA ESTA APLICACION
 *
 *
 *
 *
 *
 *
 */




const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

//const MessagingResponse = require('twilio').twiml.MessagingResponse;

// enviar mensaje simple a wahtsapp

/**
 *
 * Enviar un Whatsapp
 * sendMenssageSimple
 * @param string user_phone_number
 * @param string user_fullname
 * 
 */
const sendMenssageSimple = (user_phone_number, user_fullname = null, msg = null) => {

    if (!msg) {
        msg = `Hola ${user_fullname}, gracias por enviar tu información, estaremos llamandote en unos momentos.`
    }

    client.messages
        .create({
            from: 'whatsapp:' + process.env.FROM_WHATSAPP,
            body: msg,
            to: `whatsapp:${user_phone_number}`
        })
        .then(message => console.log(message.sid))
        .catch((err) => {
            // notificar al administrador de los errores
            console.log("Sucedio un error en twitli ---------------");
            console.log(err)
        });

}

const whatsReceiver = () => {
    const response = new MessagingResponse();
    // const message = response.message();
    console.log(response.body);
    response.message('This is message 1 of 2.');
    response.message('This is message 2 of 2.');

    return response.toString();
}


module.exports = {
    sendMenssageSimple: sendMenssageSimple,
    whatsReceiver: whatsReceiver
}