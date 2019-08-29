/* eslint-disable consistent-return */
const db = require('./index.js');

class UserModel {
    addUser(req, res) {
        if (!req.body.username) {
            res.status(400).send({
                status: 'NO-USERNAME',
            });
        } else if (!req.body.name) {
            res.status(400).send({
                status: 'NO-NAME',
            });
        } else if (!req.body.password) {
            res.status(400).send({
                status: 'NO-PASSWORD',
            });
        }
        const {
            username,
            name,
            password,
        } = req.body;

        // connection.beginTransaction((err) => {
        //     if (err) {
        //         res.send({
        //             status: err.code,
        //         });
        //         throw err;
        //     }
        db.query('INSERT INTO users(username, name, password) VALUES(?,?,?);', [username, name, password], (error, results, fields) => {
            if (error) {
                return db.rollback(() => {
                    res.send({
                        status: error.code,
                    });
                    throw error;
                });
            }
            db.commit((err) => {
                if (err) {
                    return db.rollback(() => {
                        res.send({
                            status: err.code,
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
    }
}

const userModel = new UserModel();
module.exports = userModel;
