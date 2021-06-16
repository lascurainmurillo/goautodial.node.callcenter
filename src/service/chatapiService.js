const request = require('request'); //bash: npm install request
// URL for request POST /message
const token = process.env.CHATAPI_TOKEN;
const instanceId = process.env.CHATAPI_INSTANCE;
const __URL = `https://api.chat-api.com/${instanceId}`;

/**
 * 
 *
 */
const sendMessageWhat = function(user_phone_number, user_fullname = null, msg = null) {

    var url = `${__URL}/message?token=${token}`; // enviar mensaje

    if (!msg) {
        msg = `Hola ${user_fullname}, gracias por enviar tu información, estaremos llamandote en unos momentos.`
    }

    var data = {
        phone: user_phone_number, // Receivers phone
        body: msg, // Message
    };
    // Send a request
    request({
        url: url,
        method: "POST",
        json: data
    }, function(error, response, body) {
        if (error) {
            return console.error('upload failed:', error);
        }
        console.log('Upload successful!  Server responded with:', body);
    });
}

/**
 * 
 * @param {*} user_phone_number 
 * @param {*} msg 
 * @param {*} filename 
 */
const sendMessageFile = async(user_phone_number, msg, filename) => {

    var url = `${__URL}/sendFile?token=${token}`; // enviar mensaje

    var data = {
        phone: user_phone_number, // Receivers phone
        body: msg, // Message
        filename
    };

    // Send a request
    let miPromise = new Promise((resolve, reject) => {
        request({
            url: url,
            method: "POST",
            json: data
        }, function(error, response, body) {
            if (error) {
                console.error('upload failed FILE:', error);
                resolve(false);
                // return console.error('upload failed FILE:', error);
            }
            console.log('Upload successful! Server responded with FILE:', body);
            resolve(true);
        });
    });

    return miPromise;
}


module.exports = {
    sendMessageWhat: sendMessageWhat,
    sendMessageFile: sendMessageFile,
}