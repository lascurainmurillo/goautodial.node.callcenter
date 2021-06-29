/*
import express from 'express';
import { getWebhook } from '../controllers/webhook.js';
*/

const express = require('express');
const router = express.Router();

/* index */
const ControllerIndex = require('../controllers/index');
router.get('/', ControllerIndex.getIndex);

/* Route webhook*/
const ConTrollerWebhook = require('../controllers/webhook');
router.get('/webhookFace', ConTrollerWebhook.getWebhook);
router.post('/webhookface', ConTrollerWebhook.postWebhookFace);
router.get('/webhookInst', ConTrollerWebhook.getWebhook);
router.post('/webhookinst', ConTrollerWebhook.postWebhookInst);

/* Route twilio */
const Controllertwilio = require('../controllers/twilio.js');
router.post('/whatsapp/receiver', Controllertwilio.whatReceiver); //recibe mensaje whatsapp de un numero externo
router.post('/whatsapp/receiver1', Controllertwilio.whatReceiver1);
router.get('/whatsapp/send', Controllertwilio.whatSend);
router.get('/whatsapp/message', Controllertwilio.getMessages); //enviar mensajes anteriores de whatsapp
router.get('/whatsapp/rooms', Controllertwilio.getRoomUsers); // enviar la lista de rooms de whatsapp
router.post('/whatsapp/send-file', Controllertwilio.sendUploadFile);


/* Route Galery */
const Controllergalery = require('../controllers/galery.js');
router.post('/galery/file', Controllergalery.postUploadGalery);
router.get('/galery/file', Controllergalery.index);
router.delete('/galery/file/:id', Controllergalery.deletefile);

module.exports = router;
// export default router;