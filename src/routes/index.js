const express = require('express');
const router = express.Router();

const jwtMiddleware = require('../middleware/jwtMiddleware');


/* index */
const ControllerIndex = require('../controllers/index');
router.get('/', ControllerIndex.getIndex);

/* user */
const ControllerUser = require('../controllers/userController');
router.route('/user/verifytoken').post(jwtMiddleware.verifytoken, ControllerUser.verifytoken);

/* Route webhook*/
const ConTrollerWebhook = require('../controllers/webhook');
router.get('/webhookFace', ConTrollerWebhook.getWebhook);
router.post('/webhookface', ConTrollerWebhook.postWebhookFace);
router.get('/webhookInst', ConTrollerWebhook.getWebhook);
router.post('/webhookinst', ConTrollerWebhook.postWebhookInst);

/* Route twilio */
const Controllertwilio = require('../controllers/twilio.js');
router.post('/whatsapp/receiver', Controllertwilio.whatReceiver); //recibe mensaje whatsapp de un numero externo / chat-api
router.route('/whatsapp/message').get(jwtMiddleware.verifytoken, Controllertwilio.getMessages); // enviar la lista de rooms de whatsapp
router.route('/whatsapp/rooms').get(jwtMiddleware.verifytoken, Controllertwilio.getRoomUsers); // enviar la lista de rooms de whatsapp
router.route('/whatsapp/send-file').post(jwtMiddleware.verifytoken, Controllertwilio.sendUploadFile); // enviar la lista de rooms de whatsapp

/* Route Galery */
const Controllergalery = require('../controllers/galery.js');
router.route('/galery/file').post(jwtMiddleware.verifytoken, Controllergalery.postUploadGalery);
router.route('/galery/file').get(jwtMiddleware.verifytoken, Controllergalery.index);
router.route('/galery/file/:id').delete(jwtMiddleware.verifytoken, Controllergalery.deletefile);

module.exports = router;
// export default router;