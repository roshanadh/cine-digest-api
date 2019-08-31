/* eslint-disable no-extra-boolean-cast */
/* eslint-disable no-loop-func */
/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
const axios = require('axios');
const querystring = require('querystring');
const db = require('./index.js');

class HistoryModel {
    isInList(req, res) {
        if (!req.body.username) {
            return res.status(400).send({
                status: 'NO-USERNAME',
            });
        }
        if (!req.body.titleId) {
            return res.status(400).send({
                status: 'NO-TITLE-ID',
            });
        }
        if (!req.body.titleType) {
            return res.status(400).send({
                status: 'NO-TITLE-NAME',
            });
        }

        if (!!req.body.listType) {
        // Check if in a particular list
            const {
                listType,
                titleId,
                titleType,
                username,
            } = req.body;
            db.query('SELECT * FROM history WHERE username=? AND listType=? AND titleId=? AND titleType=?;', [username, listType, titleId, titleType], (error, results, fields) => {
                if (error) {
                    return db.rollback(() => {
                        res.send({
                            status: error.code,
                        });
                        console.warn(error);
                    });
                }
                if (results.length > 0) {
                    // Title is in list
                    return res.status(200).send({ status: 'success' });
                }
                // Title is not in list
                return res.status(404).send({ status: 'NOT-FOUND' });
            });
        } else {
        // Check if in any list
            const {
                titleId,
                titleType,
                username,
            } = req.body;
            db.query('SELECT * FROM history WHERE username=? AND titleId=? AND titleType=?;', [username, titleId, titleType], (error, results, fields) => {
                if (error) {
                    return db.rollback(() => {
                        res.send({
                            status: error.code,
                        });
                        console.warn(error);
                    });
                }
                if (results.length > 0) {
                    // Title is in list
                    return res.status(200).send({ status: 'success' });
                }
                // Title is not in list
                return res.status(404).send({ status: 'NOT-FOUND' });
            });
        }
    }

    addMovieToWishList(req, res) {
        if (!req.body.username) {
            res.status(400).send({
                status: 'NO-USERNAME',
            });
        } else if (!req.body.listType) {
            res.status(400).send({
                status: 'NO-LIST-TYPE',
            });
        } else if (!req.body.titleId) {
            res.status(400).send({
                status: 'NO-TITLE-ID',
            });
        } else if (!req.body.titleName) {
            res.status(400).send({
                status: 'NO-TITLE-NAME',
            });
        } else if (!req.body.titleOverview) {
            console.warn('NO titleOverview');
        } else if (!req.body.titleVoteCount) {
            console.warn('NO titleVoteCount');
        } else if (!req.body.titleVoteAverage) {
            console.warn('NO titleVoteAverage');
        } else if (!req.body.titlePosterPath) {
            console.warn('NO titlePosterPath');
        } else if (!req.body.titleType) {
            res.status(400).send({
                status: 'NO-TITLE-TYPE',
            });
        }

        const {
            listType,
            titleId,
            titleName,
            titleOverview,
            titleVoteCount,
            titleVoteAverage,
            titlePosterPath,
            titleType,
            username,
        } = req.body;

        db.query('INSERT INTO history(listType, titleId, titleName,titleOverview, titleVoteCount, titleVoteAverage,titlePosterPath, titleType, username) VALUES (?,?,?,?,?,?,?,?,?);',
            [listType, titleId, titleName, titleOverview, titleVoteCount, titleVoteAverage, titlePosterPath, titleType, username], (error, results, fields) => {
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
                    console.log = 'Movie ' + titleId + ' added to ' + username + '\'s ' + listType;
                    res.status(200).send({
                        status: 'success',
                    });
                });
            });
    }

    addMovieToWatchedList(req, res) {
        if (!req.body.username) {
            res.status(400).send({
                status: 'NO-USERNAME',
            });
        } else if (!req.body.listType) {
            res.status(400).send({
                status: 'NO-LIST-TYPE',
            });
        } else if (!req.body.titleId) {
            res.status(400).send({
                status: 'NO-TITLE-ID',
            });
        } else if (!req.body.titleName) {
            res.status(400).send({
                status: 'NO-TITLE-NAME',
            });
        } else if (!req.body.titleOverview) {
            console.warn('NO titleOverview');
        } else if (!req.body.titleVoteCount) {
            console.warn('NO titleVoteCount');
        } else if (!req.body.titleVoteAverage) {
            console.warn('NO titleVoteAverage');
        } else if (!req.body.titlePosterPath) {
            console.warn('NO titlePosterPath');
        } else if (!req.body.titleType) {
            res.status(400).send({
                status: 'NO-TITLE-TYPE',
            });
        }

        const {
            listType,
            titleId,
            titleName,
            titleOverview,
            titleVoteCount,
            titleVoteAverage,
            titlePosterPath,
            titleType,
            username,
        } = req.body;

        db.query('INSERT INTO history(listType, titleId, titleName,titleOverview, titleVoteCount, titleVoteAverage,titlePosterPath, titleType, username) VALUES (?,?,?,?,?,?,?,?,?);',
            [listType, titleId, titleName, titleOverview, titleVoteCount, titleVoteAverage, titlePosterPath, titleType, username], (error, results, fields) => {
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
                    console.log = 'Movie ' + titleId + ' added to ' + username + '\'s ' + listType;

                    // Added to watchedList, now check if movie is present in wishlist (then remove)
                    db.query('SELECT * FROM history WHERE username=? AND listType=? AND titleId=? AND titleType=?;', [username, 'wishList', titleId, titleType], (error, results, fields) => {
                        if (error) {
                            return db.rollback(() => {
                                res.send({
                                    status: error.code,
                                });
                                console.warn(error);
                            });
                        }
                        if (results.length > 0) {
                            // Movie is in wishList..
                            // so remove it from wishList
                            db.query('DELETE FROM history WHERE listType=? AND titleId=? AND username=? AND titleType=?;',
                                ['wishList', titleId, username, titleType],
                                (error, results, fields) => {
                                    if (error) {
                                        console.warn(error);
                                        return res.send({
                                            status: error.code,
                                        });
                                    }
                                    // Removed from wishList, and has been added to watchedList
                                    // console.log('Deleted ' + results.affectedRows + ' rows from wishList');
                                });
                        }
                        res.status(200).send({
                            status: 'success',
                        });
                    });
                });
            });
    }

    addShowToWishList(req, res) {
        if (!req.body.username) {
            res.status(400).send({
                status: 'NO-USERNAME',
            });
        } else if (!req.body.listType) {
            res.status(400).send({
                status: 'NO-LIST-TYPE',
            });
        } else if (!req.body.titleId) {
            res.status(400).send({
                status: 'NO-TITLE-ID',
            });
        } else if (!req.body.titleName) {
            res.status(400).send({
                status: 'NO-TITLE-NAME',
            });
        } else if (!req.body.titleOverview) {
            console.warn('NO titleOverview');
        } else if (!req.body.titleVoteCount) {
            console.warn('NO titleVoteCount');
        } else if (!req.body.titleVoteAverage) {
            console.warn('NO titleVoteAverage');
        } else if (!req.body.titlePosterPath) {
            console.warn('NO titlePosterPath');
        } else if (!req.body.titleType) {
            res.status(400).send({
                status: 'NO-TITLE-TYPE',
            });
        }

        const {
            listType,
            titleId,
            titleName,
            titleOverview,
            titleVoteCount,
            titleVoteAverage,
            titlePosterPath,
            titleType,
            username,
        } = req.body;

        db.query('INSERT INTO history(listType, titleId, titleName,titleOverview, titleVoteCount, titleVoteAverage,titlePosterPath, titleType, username) VALUES (?,?,?,?,?,?,?,?,?);',
            [listType, titleId, titleName, titleOverview, titleVoteCount, titleVoteAverage, titlePosterPath, titleType, username], (error, results, fields) => {
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
                    console.log = 'Movie ' + titleId + ' added to ' + username + '\'s ' + listType;
                    res.status(200).send({
                        status: 'success',
                    });
                });
            });
    }

    addShowToWatchingList(req, res) {
        if (!req.body.username) {
            res.status(400).send({
                status: 'NO-USERNAME',
            });
        } else if (!req.body.listType) {
            res.status(400).send({
                status: 'NO-LIST-TYPE',
            });
        } else if (!req.body.titleId) {
            res.status(400).send({
                status: 'NO-TITLE-ID',
            });
        } else if (!req.body.titleName) {
            res.status(400).send({
                status: 'NO-TITLE-NAME',
            });
        } else if (!req.body.titleOverview) {
            console.warn('NO titleOverview');
        } else if (!req.body.titleVoteCount) {
            console.warn('NO titleVoteCount');
        } else if (!req.body.titleVoteAverage) {
            console.warn('NO titleVoteAverage');
        } else if (!req.body.titlePosterPath) {
            console.warn('NO titlePosterPath');
        } else if (!req.body.titleType) {
            res.status(400).send({
                status: 'NO-TITLE-TYPE',
            });
        }

        const {
            listType,
            titleId,
            titleName,
            titleOverview,
            titleVoteCount,
            titleVoteAverage,
            titlePosterPath,
            titleType,
            username,
        } = req.body;

        db.query('INSERT INTO history(listType, titleId, titleName,titleOverview, titleVoteCount, titleVoteAverage,titlePosterPath, titleType, username) VALUES (?,?,?,?,?,?,?,?,?);',
            [listType, titleId, titleName, titleOverview, titleVoteCount, titleVoteAverage, titlePosterPath, titleType, username], (error, results, fields) => {
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
                    console.log = 'Show ' + titleId + ' added to ' + username + '\'s ' + listType;
                    res.status(200).send({
                        status: 'success',
                    });
                });
                // Added to watchingList, now check if show is present in wishlist (then remove)
                db.query('SELECT * FROM history WHERE username=? AND listType=? AND titleId=? AND titleType=?;', [username, 'wishList', titleId, titleType], (error, results, fields) => {
                    if (error) {
                        return db.rollback(() => {
                            res.send({
                                status: error.code,
                            });
                            console.warn(error);
                        });
                    }
                    if (results.length > 0) {
                        // Show is in wishList..
                        // so remove it from wishList
                        db.query('DELETE FROM history WHERE listType=? AND titleId=? AND username=? AND titleType=?;',
                            ['wishList', titleId, username, titleType],
                            (error, results, fields) => {
                                if (error) {
                                    console.warn(error);
                                    return res.send({
                                        status: error.code,
                                    });
                                }
                                // Removed from wishList, and has been added to watchingList
                            });
                    }
                    res.status(200).send({
                        status: 'success',
                    });
                });
            });
    }

    addShowToWatchedList(req, res) {
        if (!req.body.username) {
            res.status(400).send({
                status: 'NO-USERNAME',
            });
        } else if (!req.body.listType) {
            res.status(400).send({
                status: 'NO-LIST-TYPE',
            });
        } else if (!req.body.titleId) {
            res.status(400).send({
                status: 'NO-TITLE-ID',
            });
        } else if (!req.body.titleName) {
            res.status(400).send({
                status: 'NO-TITLE-NAME',
            });
        } else if (!req.body.titleOverview) {
            console.warn('NO titleOverview');
        } else if (!req.body.titleVoteCount) {
            console.warn('NO titleVoteCount');
        } else if (!req.body.titleVoteAverage) {
            console.warn('NO titleVoteAverage');
        } else if (!req.body.titlePosterPath) {
            console.warn('NO titlePosterPath');
        } else if (!req.body.titleType) {
            res.status(400).send({
                status: 'NO-TITLE-TYPE',
            });
        }

        const {
            listType,
            titleId,
            titleName,
            titleOverview,
            titleVoteCount,
            titleVoteAverage,
            titlePosterPath,
            titleType,
            username,
        } = req.body;

        db.query('INSERT INTO history(listType, titleId, titleName,titleOverview, titleVoteCount, titleVoteAverage,titlePosterPath, titleType, username) VALUES (?,?,?,?,?,?,?,?,?);',
            [listType, titleId, titleName, titleOverview, titleVoteCount, titleVoteAverage, titlePosterPath, titleType, username], (error, results, fields) => {
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
                    console.log = 'Show ' + titleId + ' added to ' + username + '\'s ' + listType;
                });
                // Added to watchedList, now check if show is present in wishlist (then remove)
                db.query('SELECT * FROM history WHERE username=? AND listType=? AND titleId=? AND titleType=?;', [username, 'wishList', titleId, titleType], (error, results, fields) => {
                    if (error) {
                        return db.rollback(() => {
                            res.send({
                                status: error.code,
                            });
                            console.warn(error);
                        });
                    }
                    if (results.length > 0) {
                        // Show is in wishList..
                        // so remove it from wishList
                        db.query('DELETE FROM history WHERE listType=? AND titleId=? AND username=? AND titleType=?;',
                            ['wishList', titleId, username, titleType],
                            (error, results, fields) => {
                                if (error) {
                                    console.warn(error);
                                    return res.send({
                                        status: error.code,
                                    });
                                }
                                // Removed from wishList, and has been added to watchedList
                            });
                    }
                    // Check to see if it is in watchingList (then remove it)
                    db.query('SELECT * FROM history WHERE username=? AND listType=? AND titleId=? AND titleType=?;', [username, 'watchingList', titleId, titleType], (error, results, fields) => {
                        if (error) {
                            return db.rollback(() => {
                                res.send({
                                    status: error.code,
                                });
                                console.warn(error);
                            });
                        }
                        if (results.length > 0) {
                            // Show is in watchingList..
                            // so remove it from watchingList
                            db.query('DELETE FROM history WHERE listType=? AND titleId=? AND username=? AND titleType=?;',
                                ['watchingList', titleId, username, titleType],
                                (error, results, fields) => {
                                    if (error) {
                                        console.warn(error);
                                        return res.send({
                                            status: error.code,
                                        });
                                    }
                                    // Removed from watchingList, and has been added to watchedList
                                });
                        }
                    });
                });
                return res.status(200).send({
                    status: 'success',
                });
            });
    }

    removeFromList(req, res) {
        if (!req.body.username) {
            res.status(400).send({
                status: 'NO-USERNAME',
            });
        } else if (!req.body.listType) {
            res.status(400).send({
                status: 'NO-LIST-TYPE',
            });
        } else if (!req.body.titleType) {
            res.status(400).send({
                status: 'NO-TITLE-TYPE',
            });
        }

        if (!req.body.titleId) {
            // If titleId is not specified, empty the specified list
            const {
                listType,
                username,
                titleType,
            } = req.body;

            db.query('DELETE FROM history WHERE listType=? AND username=? AND titleType=?;',
                [listType, username, titleType],
                (error, results, fields) => {
                    if (error) {
                        console.warn(error);
                        return res.send({
                            status: error.code,
                        });
                    }
                    // Removed from the list
                    return res.status(200).send({
                        status: 'success',
                    });
                });
        } else {
            // Remove the specified titleId from list
            const {
                listType,
                titleId,
                username,
                titleType,
            } = req.body;

            db.query('DELETE FROM history WHERE listType=? AND titleId=? AND username=? AND titleType=?;',
                [listType, titleId, username, titleType],
                (error, results, fields) => {
                    if (error) {
                        console.warn(error);
                        return res.send({
                            status: error.code,
                        });
                    }
                    // Removed from the list
                    return res.status(200).send({
                        status: 'success',
                    });
                });
        }
    }

    getHistory(req, res) {
        if (!req.body.username) {
            return res.status(400).send({
                status: 'NO-USERNAME',
            });
        } if (!req.body.listType) {
            return res.status(400).send({
                status: 'NO-LIST-TYPE',
            });
        } if (!req.body.titleType) {
            return res.status(400).send({
                status: 'NO-TITLE-TYPE',
            });
        }

        const {
            listType,
            username,
            titleType,
        } = req.body;

        db.query('SELECT * FROM history WHERE username=? AND listType=? AND titleType=?;', [username, listType, titleType], (error, results, fields) => {
            if (error) {
                return db.rollback(() => {
                    res.send({
                        status: error.code,
                    });
                    console.warn(error);
                });
            }
            if (results.length > 0) {
                const rows = [];
                for (let i = 0; i < results.length; i++)
                    rows.push(results[i]);
                return res.status(200).send(rows);
            }
            return res.status(404).send({
                status: 'NOT-FOUND',
            });
        });
    }

    getStats(req, res) {
        if (!req.body.username) {
            res.status(400).send({
                status: 'NO-USERNAME',
            });
        }

        const { username } = req.body;

        db.query('SELECT * FROM history WHERE username=?;', [username], (error, results, fields) => {
            if (error) {
                return db.rollback(() => {
                    res.send({
                        status: error.code,
                    });
                    console.warn(error);
                });
            }
            if (results.length > 0) {
                let listedMovies = 0;
                let listedShows = 0;
                let listedInWishMovies = 0;
                let listedInWishShows = 0;
                let listedInWatchedMovies = 0;
                let listedInWatchedShows = 0;
                let listedInWatchingShows = 0;

                for (let i = 0; i < results.length; i++) {
                    const row = results[i];
                    if (row.titleType === 'movie') {
                        listedMovies++;
                        if (row.listType === 'wishList') {
                            listedInWishMovies++;
                        } else if (row.listType === 'watchedList') {
                            listedInWatchedMovies++;
                        }
                    } else if (row.titleType === 'show') {
                        listedShows++;
                        if (row.listType === 'wishList') {
                            listedInWishShows++;
                        } else if (row.listType === 'watchedList') {
                            listedInWatchedShows++;
                        } else if (row.listType === 'watchingList') {
                            listedInWatchingShows++;
                        }
                    }
                }
                res.status(200).send({
                    listedMovies,
                    listedShows,
                    listedInWishMovies,
                    listedInWishShows,
                    listedInWatchedMovies,
                    listedInWatchedShows,
                    listedInWatchingShows,
                });
            } else {
                res.status(404).send({
                    status: 'NOT-FOUND',
                });
            }
        });
    }

    getRecentTitles(req, res) {
        if (!req.body.username) {
            res.status(400).send({
                status: 'NO-USERNAME',
            });
        } else if (!req.body.titleType) {
            res.status(400).send({
                status: 'NO-TITLE-TYPE',
            });
        }

        const { username, titleType } = req.body;
        db.query('SELECT * FROM history WHERE titleType=? AND username=?;', [titleType, username], (error, results, fields) => {
            if (error) {
                return db.rollback(() => {
                    res.send({
                        status: error.code,
                    });
                    console.warn(error);
                });
            }
            if (results.length > 0) {
                const len = results.length;
                const recentTitles = [];
                let lowerLimit = 0;
                switch (len) {
                case len <= 5:
                    lowerLimit = 0;
                    break;
                case len > 6:
                    lowerLimit = len - 6;
                    break;
                default:
                    break;
                }

                for (let i = len - 1; i >= lowerLimit; i--) {
                    const row = results[i];
                    recentTitles.push({
                        title: row.titleName,
                        titleId: row.titleId,
                        posterPath: row.titlePosterPath,
                    });
                }
                return res.status(200).send(recentTitles);
            }
            return res.status(404).send({
                status: 'NOT-FOUND',
            });
        });
    }
}

const historyModel = new HistoryModel();
module.exports = historyModel;
