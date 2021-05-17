// import mysql from 'mysql';
const mysql = require('mysql');
const util = require('util');

const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'call_goautodial'
});

connection.connect((error) => {
    // console.log(error);
    if (error) {
        console.log('El error de conexión es goautodial: ' + error);
        return;
    }
    console.log('!Conectado a la base de datos goautodial');
});

// con esta funcion se puede trabajar directo con promise
const query = util.promisify(connection.query).bind(connection);



// conexion a base de datos asterisk
const connection_asterisk = mysql.createConnection({
    host: process.env.DB_HOST_ASTERISK || 'localhost',
    user: process.env.DB_USER_ASTERISK || 'root',
    password: process.env.DB_PASSWORD_ASTERISK || '',
    database: process.env.DB_DATABASE_ASTERISK || 'call_asterisk'
});

connection_asterisk.connect((error) => {
    // console.log(error);
    if (error) {
        console.log('El error de conexión es asterisk: ' + error);
        return;
    }
    console.log('!Conectado a la base de datos asterisk');
});

const query_asterisk = util.promisify(connection_asterisk.query).bind(connection_asterisk);

module.exports = {
        connection: connection,
        query: query,
        connection_asterisk: connection_asterisk,
        query_asterisk: query_asterisk
    }
    // export default connection;