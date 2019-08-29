/* eslint-disable consistent-return */
const db = require('./index.js');

class HistoryModel {
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
                        res.status(404).send({
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
                        res.status(404).send({
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
                    console.log = 'Movie ' + titleId + ' added to ' + username + '\'s ' + listType;

                    // Added to watchedList, now check if movie is present in wishlist (then remove)
                    db.query('SELECT * FROM history WHERE username=? AND listType=? AND titleId=? AND titleType=?;', [username, listType, titleId, titleType], (error, results, fields) => {
                        if (error) {
                            return db.rollback(() => {
                                throw error;
                            });
                        }
                        if (results.length > 0) {
                            // Movie is in wishList..
                            // so remove it from wishList
                            db.query('DELETE FROM history WHERE listType=? AND titleId=? AND username=? AND titleType=?;',
                                ['wishList', titleId, username, titleType],
                                (error, results, fields) => {
                                    if (error) {
                                        res.status(404).send({
                                            status: error.code,
                                        });
                                        throw error;
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
                        res.status(404).send({
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
                    console.log = 'Movie ' + titleId + ' added to ' + username + '\'s ' + listType;
                    res.status(200).send({
                        status: 'success',
                    });
                });
            });
    }
}

const historyModel = new HistoryModel();
module.exports = historyModel;
