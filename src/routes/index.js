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
const Controllertwilio = require('../controllers/twilio');
router.post('/whatsapp/receiver', Controllertwilio.whatReceiver); //recibe mensaje whatsapp de un numero externo

module.exports = router;
// export default router;