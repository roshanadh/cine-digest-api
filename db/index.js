const mysql = require('mysql');

const {
    DBHOST,
    DBUSERNAME,
    DBPASSWORD,
} = require('../utility.js');


class DB {
    getConnection(req, res) {
        const connection = mysql.createConnection({
            host: DBHOST,
            user: DBUSERNAME,
            password: DBPASSWORD,
        });
        connection.connect((err) => {
            if (err) {
                console.error('error connecting: ' + err.stack);
                return;
            }

            res.send('Connected as ID: ' + connection.threadId);
        });
    }
}

const db = new DB();
module.exports = db;
