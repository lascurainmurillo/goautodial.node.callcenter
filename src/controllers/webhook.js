const mysql = require('../../database/db');
const ControllerIndex = require('./index');

// const twilio = require('../service/twilioService');
const leadgen = require('../service/webhookleadgen');
const chatapi = require('../service/chatapiService');
const mandrill = require('../service/nodemailerService');
const facee = require('../service/sdkfacebookService');

const moment = require('moment');
const Chat = require('../model/chat');
const Formdata = require('../model/formdata');

const list_id = process.env.LIST_ID;
const token = process.env.TOKEN_SUSBCRIPTION_FACE || 'token';


const getWebhook = (req, res) => {
    // console.log(req.query);
    // console.log(token);
    if (
        req.query['hub.mode'] == 'subscribe' &&
        req.query['hub.verify_token'] == token
    ) {
        res.send(req.query['hub.challenge']);
    } else {
        res.sendStatus(400);
    }
}


const postWebhookFace = (req, res) => {

    console.log('Facebook request body:', req.body);
    const chatmodel = new Chat();

    if (!req.isXHubValid()) {
        console.log('Warning - request header X-Hub-Signature not present or invalid');
        res.sendStatus(401);
        return;
    }

    console.log('request header X-Hub-Signature validated');
    // Process the Facebook updates here
    ControllerIndex.received_updates.unshift(req.body);

    //obtener access_token de user de la base de datos
    mysql.connection.query("SELECT id, user_id, token FROM go_social_token WHERE status = '1'", async(err, rows) => {
        if (err) { console.log("error query SELECT"); throw err };
        let id = 0;
        rows.forEach((row) => {
            leadgen.access_token = row.token; // token del usuario
            id = row.id;
        });

        //validar acceso al api de business facebook
        leadgen.debugads(leadgen.access_token);

        req.body.entry.forEach(async(elpage) => {

            let inse_page = {
                    go_social_token_id: id,
                    object_id: elpage.id,
                    time: elpage.time
                }
                // registrar id del object de webook
            let row_page = await mysql.query("INSERT INTO go_social_webhook_page SET ?", inse_page);

            elpage.changes.forEach(async(elchange) => {
                let inse_change = {
                    social_webhook_page_id: row_page.insertId,
                    form_id: elchange.value.form_id,
                    leadgen_id: elchange.value.leadgen_id,
                    created_time: elchange.value.created_time
                }

                // registrar ids de los cambios. leadgen_id
                await mysql.query("INSERT INTO go_social_webhook_change SET ?", inse_change);

                //obtener datos de leadgen_id
                result_data = await leadgen.apiCallResult(elchange.value.leadgen_id);

                // registrar data de leadgen
                dataform = {};
                let fdata = new Formdata();
                // obtener name field de formulario de facebook
                dataform = fdata.formatleaddata(result_data.field_data);

                // await mysql.query("INSERT INTO go_social_webhook_data SET ?", dataform);
                // console.log("REGISTRADO en go_social_webhook_data");
                const entry_date = moment().format('YYYY-MM-DD HH:mm:ss');

                dataform['entry_date'] = entry_date; // `${yyyy}-${mm}-${dd} ${ho}:${mi}:${se}`;
                dataform['status'] = 'NEW';
                dataform['list_id'] = '1004'; // falta considerar este dato OJO
                dataform['gmt_offset_now'] = -6.00; // obtener segun el codigo postal o el pais
                dataform['last_local_call_time'] = '0000-00-00 00:00:00';
                dataform['social_form_id'] = elchange.value.form_id; // id del formulario de facebook
                dataform['social_form_data'] = JSON.stringify(await facee.getDataFormLead(elchange.value.form_id, leadgen.access_token));

                console.log("-------------------------- INICIO DATAFORM-------------------------");
                console.log(dataform);
                console.log("-------------------------- FIN DATAFORM-------------------------");
                /*INSERT INTO `asterisk`.
                `vicidial_list` (`lead_id`, `entry_date`, `modify_date`, `status`, `list_id`, `gmt_offset_now`, `phone_code`, `phone_number`, `first_name`, `last_name`, `address1`, `country_code`, `date_of_birth`, `email`, `last_local_call_time`, `rank`) VALUES(null, '2021-04-24 22:55:01', '2021-04-24 22:59:01', 'NEW', '1004', '-5.00', '52', '5585353729', 'Moises', 'Lascurain', 'jr. Mexico', '52', '1985-04-13', 'lascurainmurillo@gmail.com', '0000-00-00 00:00:00', 0);*/

                delete dataform.id
                delete dataform.created_time;
                // registrar en la cola de llamadas VICIDIAL_LIST
                let row_vicial = await mysql.query_asterisk("INSERT INTO vicidial_list SET ?", dataform);
                console.log("REGISTRADO vicidial_list")

                datahopper = {
                    lead_id: row_vicial.insertId,
                    campaign_id: '11340326', // id de la campaña = valor estatico
                    status: 'READY',
                    list_id, // list_id capañama = valor estatico
                    gmt_offset_now: -6.00,
                    alt_dial: 'NONE',
                    priority: 10,
                    source: 'S'
                }

                // registrar como prioridad en llamadas
                await mysql.query_asterisk("INSERT INTO vicidial_hopper SET ?", datahopper);
                console.log("REGISTRADO vicidial_hopper")


                let data_call = {
                    // agent_username: dataroom[0].agent_username,
                    client_id: dataform.phone_number,
                    client_name: dataform.full_name,
                    list_id,
                    room: dataform.phone_number, // phone number
                    message: {
                        user: dataform.full_name,
                        msg: `Hola ${dataform.full_name}, gracias por enviar tu información, estaremos llamandote en unos momentos.`,
                        tipo: 'sender',
                        caption: null,
                        send_tipo: 'chat'
                    },
                }

                // enviar y guardar mensaje a WHATSAPP
                await chatmodel.saveMessage(null, data_call);
                console.log("---- guardando chat en leaged");
                chatapi.sendMessageWhat(dataform.phone_number, dataform.full_name);
                console.log("WHATSAPP ENVIADO")

                // enviar email
                mandrill.sendEmailSimple(dataform.email, dataform.full_name);
                console.log("EMAIL ENVIADO");

                // notificar a todos los agent via socket
                let io = req.app.get('socketio');
                io.sockets.emit('notify_leadgen', dataform);

            });
        });

    });

    res.sendStatus(200);
}


const postWebhookInst = (req, res) => {

    // falta desarrollar
    console.log('Instagram request body:');
    console.log(req.body);
    // Process the Instagram updates here
    ControllerIndex.received_updates.unshift(req.body);
    res.sendStatus(200);
}

module.exports = {
    getWebhook: getWebhook,
    postWebhookFace: postWebhookFace,
    postWebhookInst: postWebhookInst,
};