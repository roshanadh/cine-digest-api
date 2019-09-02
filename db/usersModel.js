/* eslint-disable consistent-return */
const bcrypt = require('bcryptjs');
const uuidv1 = require('uuid/v1');
const pool = require('./index.js');

class UsersModel {
    getUser(req, res) {
        if (!req.body.uuid) {
            return res.status(400).send({
                status: 'NO-UUID',
            });
        }
        const { uuid } = req.body;
        pool.query('SELECT * FROM users WHERE uuid=?;', [uuid], (error, results, fields) => {
            if (error) {
                return pool.rollback(() => {
                    res.send({
                        status: error.code,
                    });
                    console.warn(error);
                });
            }
            if (results.length > 0) {
                return res.status(200).send({
                    username: results[0].username,
                    name: results[0].name,
                    uuid,
                });
            }
            return res.status(404).send({ status: 'NOT-FOUND' });
        });
    }

    addUser(req, res) {
        if (!req.body.username) {
            return res.status(400).send({
                status: 'NO-USERNAME',
            });
        } if (!req.body.name) {
            return res.status(400).send({
                status: 'NO-NAME',
            });
        } if (!req.body.password) {
            return res.status(400).send({
                status: 'NO-PASSWORD',
            });
        }
        const {
            username,
            name,
            password,
        } = req.body;

        const uuid = uuidv1();

        pool.query('INSERT INTO users(username, uuid, name, password) VALUES(?,?,?,?);', [username, uuid, name, password], (error, results, fields) => {
            if (error) {
                return pool.rollback(() => {
                    res.send({
                        status: error.code,
                    });
                    console.warn(error);
                });
            }
            console.log = 'User ' + results.insertId + ' added';
            return res.status(200).send({
                status: 'success',
                uuid,
            });
        });
    }

    verifyUser(req, res) {
        if (!req.body.username) {
            return res.status(400).send({
                status: 'NO-USERNAME',
            });
        } if (!req.body.password) {
            return res.status(400).send({
                status: 'NO-PASSWORD',
            });
        }
        const {
            username,
            password,
        } = req.body;

        pool.query('SELECT uuid, password FROM users WHERE username=?;', [username], (error, results, fields) => {
            if (error) {
                return pool.rollback(() => {
                    res.send({
                        status: error.code,
                    });
                    console.warn(error);
                });
            }
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
                                return res.status(200).send({
                                    status: 'success',
                                    uuid: results[0].uuid,
                                });
                            }
                            // User exists but incorrect password
                            return res.status(401).send({
                                status: 'PASSWORD-MISMATCH',
                            });
                        });
                    });
                });
            } else {
                // User doesn't exist
                return res.status(404).send({
                    status: 'USERNAME-NOT-FOUND',
                });
            }
        });
    }

    changePassword(req, res) {
        if (!req.body.username) {
            return res.status(400).send({
                status: 'NO-USERNAME',
            });
        } if (!req.body.newPassword) {
            return res.status(400).send({
                status: 'NO-NEW-PASSWORD',
            });
        }
        const {
            username,
            newPassword,
        } = req.body;

        pool.query('UPDATE users SET password=? WHERE username=?;', [newPassword, username], (error, results, fields) => {
            if (error) {
                return pool.rollback(() => {
                    res.send({
                        status: error.code,
                    });
                    console.warn(error);
                });
            }
            console.log = 'User ' + username + '\'s password updated.';
            return res.status(200).send({
                status: 'success',
            });
        });
    }

    updateProfile(req, res) {
        if (!req.body.username) {
            return res.status(400).send({
                status: 'NO-USERNAME',
            });
        } if (!req.body.uuid) {
            return res.status(400).send({
                status: 'NO-UUID',
            });
        }

        if (!req.body.newUsername && req.body.newName) {
            const {
                username,
                uuid,
                newName,
            } = req.body;
            console.warn('Name not null, username  null!');
            pool.query('UPDATE users SET name=? WHERE uuid=?;', [newName, uuid], (error, results, fields) => {
                if (error) {
                    return pool.rollback(() => {
                        res.send({
                            status: error.code,
                        });
                        console.warn(error);
                    });
                }
                console.log = 'User ' + username + '\'s password updated.';
                return res.status(200).send({
                    status: 'success',
                });
            });
        } else if (req.body.newUsername && req.body.newName) {
            const {
                uuid,
                newName,
                newUsername,
            } = req.body;
            console.warn('Name not null, username not null!');

            pool.query('UPDATE users SET name=?, username=? WHERE uuid=?;', [newName, newUsername, uuid], (error, results, fields) => {
                if (error) {
                    return pool.rollback(() => {
                        res.send({
                            status: error.code,
                        });
                        console.warn(error);
                    });
                }
                return res.status(200).send({ status: 'success' });
            });
        } else if (req.body.newUsername && !req.body.newName) {
            const {
                newUsername,
                uuid,
            } = req.body;
            console.warn('Name null, username not null!');

            pool.query('UPDATE users SET username=? WHERE uuid=?;', [newUsername, uuid], (error, results, fields) => {
                if (error) {
                    return pool.rollback(() => {
                        res.send({
                            status: error.code,
                        });
                        console.warn(error);
                    });
                }
                return res.status(200).send({ status: 'success' });
            });
        } else {
            console.warn('Username and Name both null!');
            return res.status(404).send({ status: 'NO-FIELD-TO-CHANGE' });
        }
    }
}

const usersModel = new UsersModel();
module.exports = usersModel;
