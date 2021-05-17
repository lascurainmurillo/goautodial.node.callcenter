const mysql = require('../../database/db');
const leadgen = require('../service/webhookleadgen');
const ControllerIndex = require('./index');
const twilio = require('../service/twilioService');
const mandrill = require('../service/nodemailerService');
const moment = require('moment');
const facee = require('../service/sdkfacebookService');


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
                result_data.field_data.forEach(async(eldata) => {
                    if (eldata.name == 'phone_number') {
                        dataform[eldata.name] = '5585353729'; // eldata.values[0].slice(2);
                    } else if (eldata.name == 'full_name') {
                        dataform['first_name'] = eldata.values[0];
                        dataform['last_name'] = '';
                    } else {
                        dataform[eldata.name] = eldata.values[0];
                    }

                    dataform['id'] = result_data.id;
                    dataform['created_time'] = result_data.created_time;
                });
                await mysql.query("INSERT INTO go_social_webhook_data SET ?", dataform);
                console.log("REGISTRADO en go_social_webhook_data");

                const entry_date = moment().format('YYYY-MM-DD HH:mm:ss');

                dataform['entry_date'] = entry_date; // `${yyyy}-${mm}-${dd} ${ho}:${mi}:${se}`;
                dataform['status'] = 'NEW';
                dataform['list_id'] = '1004'; // falta considerar este dato OJO
                dataform['gmt_offset_now'] = -6.00; // obtener segun el codigo postal o el pais
                dataform['phone_code'] = '52'; // obtener segun el pais o como lo entrega facebook
                // dataform['city'] = ;
                dataform['country_code'] = dataform.phone_code;
                // dataform['gender'] = ;
                dataform['date_of_birth'] = '0000-00-00';
                dataform['last_local_call_time'] = '0000-00-00 00:00:00';
                dataform['social_form_id'] = elchange.value.form_id; // id del formulario de facebook
                dataform['social_form_data'] = JSON.stringify(await facee.getDataFormLead(elchange.value.form_id, leadgen.access_token));

                /*INSERT INTO `asterisk`.
                `vicidial_list` (`lead_id`, `entry_date`, `modify_date`, `status`, `list_id`, `gmt_offset_now`, `phone_code`, `phone_number`, `first_name`, `last_name`, `address1`, `country_code`, `date_of_birth`, `email`, `last_local_call_time`, `rank`) VALUES(null, '2021-04-24 22:55:01', '2021-04-24 22:59:01', 'NEW', '1004', '-5.00', '52', '5585353729', 'Moises', 'Lascurain', 'jr. Mexico', '52', '1985-04-13', 'lascurainmurillo@gmail.com', '0000-00-00 00:00:00', 0);*/

                delete dataform.id
                delete dataform.created_time;
                console.log("VER DATA FORM -------------------------------------------");
                console.log(dataform);

                // registrar en la cola de llamadas VICIDIAL_LIST
                let row_vicial = await mysql.query_asterisk("INSERT INTO vicidial_list SET ?", dataform);
                console.log("REGISTRADO vicidial_list")

                datahopper = {
                    lead_id: row_vicial.insertId,
                    campaign_id: '11340326', // id de la campaña = valor estatico
                    status: 'READY',
                    list_id: 1004,
                    gmt_offset_now: -5.00,
                    alt_dial: 'NONE',
                    priority: 10,
                    source: 'S'
                }

                // registrar como prioridad en llamadas
                await mysql.query_asterisk("INSERT INTO vicidial_hopper SET ?", datahopper);
                console.log("REGISTRADO vicidial_hopper")

                // enviar mensaje a WHATSAPP
                twilio.sendMenssageSimple(dataform.phone_number, dataform.full_name);
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