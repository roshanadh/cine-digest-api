/* eslint-disable consistent-return */
const bcrypt = require('bcryptjs');
const db = require('./index.js');

class UsersModel {
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

    verifyUser(req, res) {
        if (!req.body.username) {
            res.status(400).send({
                status: 'NO-USERNAME',
            });
        } else if (!req.body.password) {
            res.status(400).send({
                status: 'NO-PASSWORD',
            });
        }
        const {
            username,
            password,
        } = req.body;

        db.query('SELECT password FROM users WHERE username=?;', [username], (error, results, fields) => {
            if (error) {
                return db.rollback(() => {
                    res.send({
                        status: error.code,
                    });
                    throw error;
                });
            }
            console.log(results.length + ' user found!');
            const len = results.length;
            if (len > 0) {
                // User exists
                // Generate Salt for hashing (with 10 rounds) / ASYNC
                bcrypt.genSalt(5, (err, salt) => {
                    // Generate Hash for the password / ASYNC
                    bcrypt.hash(password, salt, (err, hash) => {
                        const retrievedHash = results[0].password;
                        // Compare plain password with retrieved hash
                        bcrypt.compare(password, retrievedHash, (err, result) => {
                            if (result === true) {
                                res.status(200).send({
                                    status: 'success',
                                });
                            } else {
                                // User exists but incorrect password
                                res.status(401).send({
                                    status: 'PASSWORD-MISMATCH',
                                });
                            }
                        });
                    });
                });
            } else {
                // User doesn't exist
                res.status(404).send({
                    status: 'USERNAME-NOT-FOUND',
                });
            }
        });
    }

    changePassword(req, res) {
        if (!req.body.username) {
            res.status(400).send({
                status: 'NO-USERNAME',
            });
        } else if (!req.body.newPassword) {
            res.status(400).send({
                status: 'NO-NEW-PASSWORD',
            });
        }
        const {
            username,
            newPassword,
        } = req.body;

        db.query('UPDATE users SET password=? WHERE username=?;', [newPassword, username], (error, results, fields) => {
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
                console.log = 'User ' + username + '\'s password updated.';
                res.status(200).send({
                    status: 'success',
                });
            });
        });
    }
}

const usersModel = new UsersModel();
module.exports = usersModel;
