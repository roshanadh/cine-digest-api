/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
const mysql = require('mysql');

const {
    DBHOST,
    DBNAME,
    DBUSERNAME,
    DBPASSWORD,
} = require('../utility.js');

const dbConfig = {
    host: DBHOST,
    database: DBNAME,
    user: DBUSERNAME,
    password: DBPASSWORD,
};

let connection = mysql.createConnection(dbConfig);
const handleDisconnect = (connection) => {
    if (connection) {
        // Destroy current connection
        connection.destroy();
    }
    // Create a new connection
    const conn = mysql.createConnection(dbConfig);
    connection.connect((err) => {
        if (err) {
            console.log('Error connecting: ' + err.stack);
            setTimeout(handleDisconnect, 2000);
        } else {
            console.log('After reconnect, connected as ID: ' + connection.threadId);
            return conn;
        }
    });
};

connection.connect((err) => {
    if (err) {
        console.log('error connecting: ' + err.stack);
        connection = handleDisconnect(connection);
    }
    console.log('Connected as ID: ' + connection.threadId);
});


connection.on('error', (err) => {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        // Connection closed by server
        connection = handleDisconnect(connection);
        console.log('Couldn\'t establish a connection with the database. ' + err.code);
    } else if (err.code === 'PROTOCOL_ENQUEUE_AFTER_QUIT') {
        // PROTOCOL_ENQUEUE_AFTER-QUIT
        connection = handleDisconnect(connection);
        console.log('Couldn\'t establish a connection with the database. ' + err.code);
    } else if (err.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR') {
        // connection variable must be recreated
        connection = handleDisconnect(connection);
        console.log('Couldn\'t establish a connection with the database. ' + err.code);
    } else if (err.code === 'PROTOCOL_ENQUEUE_HANDSHAKE_TWICE') {
        // Connection is already being established
        console.log('Couldn\'t establish a connection with the database. ' + err.code);
    } else {
        // Anything else
        connection = handleDisconnect(connection);
        console.log('Couldn\'t establish a connection with the database. ' + err.code);
    }
});

module.exports = connection;
