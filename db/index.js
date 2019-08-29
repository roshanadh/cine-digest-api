/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
const mysql = require('mysql');

const {
    DBHOST,
    DBNAME,
    DBUSERNAME,
    DBPASSWORD,
} = require('../utility.js');


class DB {
    static getConnection() {
        const connection = mysql.createConnection({
            host: DBHOST,
            database: DBNAME,
            user: DBUSERNAME,
            password: DBPASSWORD,
        });
        connection.connect((err) => {
            if (err) {
                console.error('error connecting: ' + err.stack);
                return;
            }

            console.log('Connected as ID: ' + connection.threadId);
        });
        return connection;
    }

    addUser(req, res) {
        const connection = DB.getConnection();
        connection.beginTransaction((err) => {
            if (err) { throw err; }
            connection.query('INSERT INTO users(username, name, password) VALUES(?,?,?);', ['roshanusername1211', 'roshan1', 'pass123'], (error, results, fields) => {
                if (error) {
                    return connection.rollback(() => {
                        res.send({
                            status: error.code,
                        });
                        throw error;
                    });
                }
                connection.commit((err) => {
                    if (err) {
                        return connection.rollback(() => {
                            res.send({
                                status: error.code,
                            });
                            throw err;
                        });
                    }
                    console.log = 'User ' + results.insertId + ' added';
                    res.status(200).send({
                        status: 'success',
                    });
                });
            });
        });
    }
}

const db = new DB();
module.exports = db;
