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
                console.warn(error);
                return res.send({
                    status: error.code,
                });
            }
            if (results.length > 0) {
                return res.status(200).send({
                    username: results[0].username,
                    email: results[0].email,
                    name: results[0].name,
                    validatedStatus: results[0].validatedStatus,
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
        } if (!req.body.email) {
            return res.status(400).send({
                status: 'NO-EMAIL',
            });
        } if (!req.body.password) {
            return res.status(400).send({
                status: 'NO-PASSWORD',
            });
        }
        const {
            username,
            name,
            email,
            password,
        } = req.body;

        const uuid = uuidv1();

        pool.query('INSERT INTO users(username, email, uuid, name, password, validatedStatus) VALUES(?,?,?,?,?,?);', [username, email, uuid, name, password, false], (error, results, fields) => {
            if (error) {
                console.warn(error);
                return res.send({
                    status: error.code,
                    message: error.sqlMessage,
                });
            }
            console.log = 'User ' + results.insertId + ' added';
            return res.status(200).send({
                status: 'success',
                uuid,
            });
        });
    }

    validateUser(req, res) {
        if (!req.body.username) {
            return res.status(400).send({
                status: 'NO-USERNAME',
            });
        } if (!req.body.email) {
            return res.status(400).send({
                status: 'NO-EMAIL',
            });
        }

        const {
            username,
        } = req.body;

        pool.query('UPDATE users SET validatedStatus=? WHERE username=?;', [true, username], (error, results, fields) => {
            if (error) {
                return res.send({
                    status: error.code,
                    message: error.sqlMessage,
                });
            }
            console.log = 'User ' + results.insertId + ' validated';
            return res.status(200).send({
                status: 'success',
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

        pool.query('SELECT uuid, password, validatedStatus, email FROM users WHERE username=?;', [username], (error, results, fields) => {
            if (error) {
                console.warn(error);
                return res.send({
                    status: error.code,
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
                                // Password is correct
                                // Check if user is validated
                                if (!results[0].validatedStatus) {
                                    // User's email is not validated
                                    return res.status(401).send({
                                        status: 'NOT-VALIDATED',
                                        email: results[0].email,
                                    });
                                }
                                // User is validated
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
                console.warn(error);
                return res.send({
                    status: error.code,
                });
            }
            console.log = 'User ' + username + '\'s password updated.';
            return res.status(200).send({
                status: 'success',
            });
        });
    }

    updateProfile(req, res) {
        if (!req.body.uuid) {
            return res.status(400).send({
                status: 'NO-UUID',
            });
        }

        if (req.body.newUsername && req.body.newName && req.body.newEmail) {
            // u, n ,e
            const {
                newUsername,
                newEmail,
                uuid,
                newName,
            } = req.body;
            console.warn('Name, email and username not null!');
            pool.query('UPDATE users SET name=?, email=?, username=?, validatedStatus=? WHERE uuid=?;', [newName, newEmail, newUsername, false, uuid], (error, results, fields) => {
                if (error) {
                    console.warn(error);
                    return res.send({
                        status: error.code,
                    });
                }
                return res.status(200).send({
                    status: 'success',
                });
            });
        } else if (req.body.newUsername && req.body.newName && !req.body.newEmail) {
            // u, n
            const {
                newUsername,
                uuid,
                newName,
            } = req.body;
            console.warn('Name and username not null!');
            pool.query('UPDATE users SET name=?, username=? WHERE uuid=?;', [newName, newUsername, uuid], (error, results, fields) => {
                if (error) {
                    console.warn(error);
                    return res.send({
                        status: error.code,
                    });
                }
                return res.status(200).send({
                    status: 'success',
                });
            });
        } else if (req.body.newUsername && !req.body.newName && req.body.newEmail) {
            // u ,e
            const {
                newUsername,
                newEmail,
                uuid,
            } = req.body;
            console.warn('Username and email not null!');
            pool.query('UPDATE users SET email=?, username=?, validatedStatus=? WHERE uuid=?;', [newEmail, newUsername, false, uuid], (error, results, fields) => {
                if (error) {
                    console.warn(error);
                    return res.send({
                        status: error.code,
                    });
                }
                return res.status(200).send({
                    status: 'success',
                });
            });
        } else if (!req.body.newUsername && req.body.newName && req.body.newEmail) {
            // n ,e
            const {
                newEmail,
                uuid,
                newName,
            } = req.body;
            console.warn('Name and email not null!');
            pool.query('UPDATE users SET name=?, email=?, validatedStatus=? WHERE uuid=?;', [newName, newEmail, false, uuid], (error, results, fields) => {
                if (error) {
                    console.warn(error);
                    return res.send({
                        status: error.code,
                    });
                }
                return res.status(200).send({
                    status: 'success',
                });
            });
        } else if (req.body.newUsername && !req.body.newName && !req.body.newEmail) {
            // u
            const {
                newUsername,
                uuid,
            } = req.body;
            console.warn('Username not null!');
            pool.query('UPDATE users SET username=? WHERE uuid=?;', [newUsername, uuid], (error, results, fields) => {
                if (error) {
                    console.warn(error);
                    return res.send({
                        status: error.code,
                    });
                }
                return res.status(200).send({
                    status: 'success',
                });
            });
        } else if (!req.body.newUsername && req.body.newName && !req.body.newEmail) {
            // n
            const {
                uuid,
                newName,
            } = req.body;
            console.warn('Name not null!');
            pool.query('UPDATE users SET name=? WHERE uuid=?;', [newName, uuid], (error, results, fields) => {
                if (error) {
                    console.warn(error);
                    return res.send({
                        status: error.code,
                    });
                }
                return res.status(200).send({
                    status: 'success',
                });
            });
        } else if (!req.body.newUsername && !req.body.newName && req.body.newEmail) {
            // e
            const {
                newEmail,
                uuid,
            } = req.body;
            console.warn('Email not null!');
            pool.query('UPDATE users SET email=?, validatedStatus=? WHERE uuid=?;', [newEmail, false, uuid], (error, results, fields) => {
                if (error) {
                    console.warn(error);
                    return res.send({
                        status: error.code,
                    });
                }
                return res.status(200).send({
                    status: 'success',
                });
            });
        } else {
            console.warn('Username, name and email all null!');
            return res.status(404).send({ status: 'NO-FIELD-TO-CHANGE' });
        }
    }
}

const usersModel = new UsersModel();
module.exports = usersModel;
