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
const fs = require('fs');
const http = require('http');
const https = require('https');
const socketIO = require('socket.io');
const express = require('express');
const cors = require('cors');

// Certificate

const privateKey = fs.readFileSync('/etc/letsencrypt/live/go.callmarket.cc/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/go.callmarket.cc/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/go.callmarket.cc/chain.pem', 'utf8');

const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
};


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
app.use(allroutes);
app.use(bodyParser.json());
app.use(urlencoded({ extended: false }));

const port = process.env.PORT || 3001;
const port_https = process.env.PORT || 3002;

app.use('/', (req, res) => {
    res.send("Bienvenido al servidor NODEjss");
});

let server = http.createServer(app);
let httpsServer = https.createServer(credentials, app);

// cors de socket.io
let io = socketIO(server, {
    cors: {
        origin: process.env.DOMAIN // "https://callcenter.net",
            //methods: ["GET", "POST"]
    }
});

// definir en variable el socketio configuration
app.set('socketio', io);

// Connection socket
io.on('connection', (socket) => {
    console.log("A new user just connectedd");

    socket.on('disconnect', () => {
        console.log('USer was disconnected');
    })
});

/*app.all('*', (req, res) => {
    res.send("You've tried reaching a route that doesn't exist.");
})*/

// Levantar el servidor http
// server.listen(port, 'localhost', () => console.log(`Servidor ejecutandose en el puerto: ${process.env.DOMAIN}`));
server.listen(port, () => console.log(`Servidor ejecutandose en el puerto: ${process.env.DOMAIN}`));

// levantar el servidor https
httpsServer.listen(port_https, 'localhost', () => console.log(`Servidor ejecutandose en el puerto: https:// ${process.env.DOMAIN}`));