/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
const mysql = require('mysql');

const {
    DBHOST,
    DBNAME,
    DBUSERNAME,
    DBPASSWORD,
} = require('../utility.js');

const connection = mysql.createConnection({
    host: DBHOST,
    database: DBNAME,
    user: DBUSERNAME,
    password: DBPASSWORD,
});
connection.connect((err) => {
    if (err) {
        console.error('error connecting: ' + err.stack);
        throw err;
    }

    console.log('Connected as ID: ' + connection.threadId);
});

module.exports = connection;
