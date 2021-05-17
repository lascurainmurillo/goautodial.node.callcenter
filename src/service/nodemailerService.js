var nodemailer = require("nodemailer");
var mandrillTransport = require('nodemailer-mandrill-transport');
var handlebars = require('handlebars');
var fs = require('fs');

/*
 * Configuring mandrill transport.
 * Copy your API key here.
 */
const smtpTransport = nodemailer.createTransport(mandrillTransport({
    auth: {
        apiKey: process.env.EMAIL_KEY_MANDRILL
    }
}));

/**
 *
 * Leer html file
 * readHTMLFile
 * @param string path
 * @param function callback
 * 
 */
const readHTMLFile = function(path, callback) {
    fs.readFile(path, { encoding: 'utf-8' }, function(err, html) {
        if (err) {
            throw err;
            callback(err);
        } else {
            callback(null, html);
        }
    });
};

/**
 *
 * Enviar un mensaje email
 * sendEmailSimple
 * @param string user_email
 * @param string user_fullname
 * 
 */
const sendEmailSimple = (user_email, user_fullname) => {

    // const subject = "Este es el titulo de callcenter";

    readHTMLFile(__dirname + '/../../public/template_html/index.htm', function(err, html) {
        var template = handlebars.compile(html);
        var replacements = {
            full_name: user_fullname,
            domain: process.env.DOMAIN
        };
        var htmlToSend = template(replacements); // reemplazar los variables dentro del template_html
        var mailOptions = {
            from: process.env.FROM_EMAIL,
            to: user_email, // user_email,
            subject: process.env.EMAIL_SUBJECT,
            html: htmlToSend
        };
        smtpTransport.sendMail(mailOptions, function(error, response) {
            if (error) {
                console.log(error);
                // callback(error);
            }
        });
    });

}

/*
const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
*/

module.exports = {
        sendEmailSimple: sendEmailSimple
    }
    // Sending email.
    /*
    smtpTransport.sendMail(mailOptions, function(error, response) {
        if (error) {
            throw new Error("Error in sending email");
        }
        console.log("Message sent: " + JSON.stringify(response));
    });
    */