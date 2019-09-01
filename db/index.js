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
const handleDisconnect = () => {
    connection = mysql.createConnection(dbConfig);
    connection.connect((err) => {
        if (err) {
            console.log('error connecting: ' + err.stack);
            throw err;
        }

        console.log('After reconnect, connected as ID: ' + connection.threadId);
    });
};

connection.connect((err) => {
    if (err) {
        console.log('error connecting: ' + err.stack);
        setTimeout(handleDisconnect, 2000);
    }

    console.log('Connected as ID: ' + connection.threadId);
});


connection.on('error', (err) => {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        handleDisconnect();
    } else {
        throw err;
    }
});

module.exports = connection;
