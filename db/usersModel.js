/* eslint-disable consistent-return */
const bcrypt = require('bcryptjs');
const uuidv1 = require('uuid/v1');
const db = require('./index.js');

class UsersModel {
    getUser(req, res) {
        if (!req.body.username) {
            return res.status(400).send({
                status: 'NO-USERNAME',
            });
        }
        const { username } = req.body;
        db.query('SELECT * FROM users WHERE username=?;', [username], (error, results, fields) => {
            if (error) {
                return db.rollback(() => {
                    res.send({
                        status: error.code,
                    });
                    console.warn(error);
                });
            }
            if (results.length > 0) {
                return res.status(200).send({
                    username,
                    name: results[0].name,
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

        db.query('INSERT INTO users(username, uuid, name, password) VALUES(?,?,?,?);', [username, uuidv1(), name, password], (error, results, fields) => {
            if (error) {
                return db.rollback(() => {
                    res.send({
                        status: error.code,
                    });
                    console.warn(error);
                });
            }
            db.commit((err) => {
                if (err) {
                    return db.rollback(() => {
                        res.send({
                            status: err.code,
                        });
                        console.warn(error);
                    });
                }
                console.log = 'User ' + results.insertId + ' added';
                return res.status(200).send({
                    status: 'success',
                });
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

        db.query('SELECT password FROM users WHERE username=?;', [username], (error, results, fields) => {
            if (error) {
                return db.rollback(() => {
                    res.send({
                        status: error.code,
                    });
                    console.warn(error);
                });
            }
            // console.log(results.length + ' user found!');
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

        db.query('UPDATE users SET password=? WHERE username=?;', [newPassword, username], (error, results, fields) => {
            if (error) {
                return db.rollback(() => {
                    res.send({
                        status: error.code,
                    });
                    console.warn(error);
                });
            }
            db.commit((err) => {
                if (err) {
                    return db.rollback(() => {
                        res.send({
                            status: err.code,
                        });
                        console.warn(err);
                    });
                }
                console.log = 'User ' + username + '\'s password updated.';
                return res.status(200).send({
                    status: 'success',
                });
            });
        });
    }

    updateProfile(req, res) {
        if (!req.body.username) {
            return res.status(400).send({
                status: 'NO-USERNAME',
            });
        }

        if (!req.body.newUsername && req.body.newName) {
            const {
                username,
                newName,
            } = req.body;
            console.warn('Name not null, username  null!');

            db.query('UPDATE users SET name=? WHERE username=?;', [newName, username], (error, results, fields) => {
                if (error) {
                    return db.rollback(() => {
                        res.send({
                            status: error.code,
                        });
                        console.warn(error);
                    });
                }
                db.commit((err) => {
                    if (err) {
                        return db.rollback(() => {
                            res.send({
                                status: err.code,
                            });
                            console.warn(err);
                        });
                    }
                    console.log = 'User ' + username + '\'s password updated.';
                    res.status(200).send({
                        status: 'success',
                    });
                });
            });
        } else if (req.body.newUsername && req.body.newName) {
            const {
                username,
                newName,
                newUsername,
            } = req.body;
            console.warn('Name not null, username not null!');

            db.query('UPDATE users SET name=?, username=? WHERE username=?;', [newName, newUsername, username], (error, results, fields) => {
                if (error) {
                    return db.rollback(() => {
                        res.send({
                            status: error.code,
                        });
                        console.warn(error);
                    });
                }
                db.commit((err) => {
                    if (err) {
                        return db.rollback(() => {
                            res.send({
                                status: err.code,
                            });
                            console.warn(err);
                        });
                    }
                });
            });
            // Since username is also used in ...
            // history table, update history table as well
            db.query('UPDATE history SET username=? WHERE username=?;', [newUsername, username], (error, results, fields) => {
                if (error) {
                    return db.rollback(() => {
                        res.send({
                            status: error.code,
                        });
                        console.warn(error);
                    });
                }
                db.commit((err) => {
                    if (err) {
                        return db.rollback(() => {
                            res.send({
                                status: err.code,
                            });
                            console.warn(err);
                        });
                    }
                    res.status(200).send({ status: 'success' });
                });
            });
        } else if (req.body.newUsername && !req.body.newName) {
            const {
                username,
                newUsername,
            } = req.body;
            console.warn('Name null, username not null!');

            db.query('UPDATE users SET username=? WHERE username=?;', [newUsername, username], (error, results, fields) => {
                if (error) {
                    return db.rollback(() => {
                        res.send({
                            status: error.code,
                        });
                        console.warn(error);
                    });
                }
                db.commit((err) => {
                    if (err) {
                        return db.rollback(() => {
                            res.send({
                                status: err.code,
                            });
                            console.warn(err);
                        });
                    }
                });
            });
            // Since username is also used in ...
            // history table, update history table as well
            db.query('UPDATE history SET username=? WHERE username=?;', [newUsername, username], (error, results, fields) => {
                if (error) {
                    return db.rollback(() => {
                        res.send({
                            status: error.code,
                        });
                        console.warn(error);
                    });
                }
                db.commit((err) => {
                    if (err) {
                        return db.rollback(() => {
                            res.send({
                                status: err.code,
                            });
                            console.warn(err);
                        });
                    }
                    res.status(200).send({ status: 'success' });
                });
            });
        } else {
            console.warn('Username and Name both null!');
            res.status(404).send({ status: 'NO-FIELD-TO-CHANGE' });
        }
    }
}

const usersModel = new UsersModel();
module.exports = usersModel;
