/*
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import allroutes from './src/routes/index.js';
import connection from './database/db.js';
*/

// definir variables de entorno
const dotenv = require('dotenv');
dotenv.config({ path: './env/.env' });

const bodyParser = require('body-parser');
const http = require('http');
const https = require('https');
const socketIO = require('socket.io');
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');


// conectar a la base de datos
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/chatwhatsapp', { useNewUrlParser: true })
    .then(db => console.log('!Mongo está conectado'))
    .catch(err => console.log(err));


const allroutes = require('./src/routes');

const { json, urlencoded } = express;
const app = express();
var xhub = require('express-x-hub');

// definir cors
const corsOptions = {
    origin: process.env.DOMAIN, // 'https://callcenter.net',
    credentials: true,
    optionsSuccessStatus: 200
}

app.use(express.static(__dirname + '/public'));
app.use(xhub({ algorithm: 'sha1', secret: process.env.APP_SECRET_FACE }));
app.use(cors(corsOptions));
app.use(express.json());
app.use(urlencoded({ extended: false }));
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: __dirname + '/tmp/',
    limits: { fileSize: 30 * 1024 * 1024 } // 30mb
})); // upload files
app.use(allroutes);

const port = process.env.PORT || 3001;
const port_https = process.env.PORT || 3002;

app.use('/', (req, res) => {
    res.send("Bienvenido al servidor NODEjss");
});

let server = http.createServer(app);

// Certificate
let httpsServer = require('./certificate.js')(app);

// Sockets
const sockets_c = require('./src/service/socketsService').socket_connection(server, app);


// Levantar el servidor http
server.listen(port, () => console.log(`Servidor ejecutandose en el puerto: ${process.env.DOMAIN}`));

// levantar el servidor https
httpsServer.listen(port_https, 'localhost', () => console.log(`Servidor ejecutandose en el puerto: https:// ${process.env.DOMAIN}`));