/* eslint-disable no-loop-func */
/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
const axios = require('axios');
const db = require('./index.js');

class HistoryModel {
    isInList(req, res) {
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
        } else if (!req.body.titleType) {
            res.status(400).send({
                status: 'NO-TITLE-NAME',
            });
        }

        const {
            listType,
            titleId,
            titleType,
            username,
        } = req.body;

        db.query('SELECT * FROM history WHERE username=? AND listType=? AND titleId=? AND titleType=?;', [username, listType, titleId, titleType], (error, results, fields) => {
            if (error) {
                return db.rollback(() => {
                    res.send({ status: error });
                    console.warn(error);
                });
            }
            if (results.length > 0) {
                // Title is in list
                res.status(200).send({ status: 'success' });
            } else {
                // Title is not in list
                res.status(404).send({ status: 'NOT-FOUND' });
            }
        });
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
                    db.query('SELECT * FROM history WHERE username=? AND listType=? AND titleId=? AND titleType=?;', [username, 'wishList', titleId, titleType], (error, results, fields) => {
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
                    console.log = 'Show ' + titleId + ' added to ' + username + '\'s ' + listType;
                    res.status(200).send({
                        status: 'success',
                    });
                });
                // Added to watchingList, now check if show is present in wishlist (then remove)
                db.query('SELECT * FROM history WHERE username=? AND listType=? AND titleId=? AND titleType=?;', [username, 'wishList', titleId, titleType], (error, results, fields) => {
                    if (error) {
                        return db.rollback(() => {
                            throw error;
                        });
                    }
                    if (results.length > 0) {
                        // Show is in wishList..
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
                    console.log = 'Show ' + titleId + ' added to ' + username + '\'s ' + listType;
                });
                // Added to watchedList, now check if show is present in wishlist (then remove)
                db.query('SELECT * FROM history WHERE username=? AND listType=? AND titleId=? AND titleType=?;', [username, 'wishList', titleId, titleType], (error, results, fields) => {
                    if (error) {
                        return db.rollback(() => {
                            throw error;
                        });
                    }
                    if (results.length > 0) {
                        // Show is in wishList..
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
                            });
                    }
                    // Check to see if it is in watchingList (then remove it)
                    db.query('SELECT * FROM history WHERE username=? AND listType=? AND titleId=? AND titleType=?;', [username, 'watchingList', titleId, titleType], (error, results, fields) => {
                        if (error) {
                            return db.rollback(() => {
                                throw error;
                            });
                        }
                        if (results.length > 0) {
                            // Show is in watchingList..
                            // so remove it from watchingList
                            db.query('DELETE FROM history WHERE listType=? AND titleId=? AND username=? AND titleType=?;',
                                ['watchingList', titleId, username, titleType],
                                (error, results, fields) => {
                                    if (error) {
                                        res.status(404).send({
                                            status: error.code,
                                        });
                                        throw error;
                                    }
                                    // Removed from watchingList, and has been added to watchedList
                                });
                        }
                    });
                });
                res.status(200).send({
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
        } else if (!req.body.titleId) {
            res.status(400).send({
                status: 'NO-TITLE-ID',
            });
        }

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
                    res.status(404).send({
                        status: error.code,
                    });
                    throw error;
                }
                // Removed from the list
                res.status(200).send({
                    status: 'success',
                });
            });
    }

    getHistory(req, res) {
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

        const {
            listType,
            username,
            titleType,
        } = req.body;

        db.query('SELECT * FROM history WHERE username=? AND listType=? AND titleType=?;', [username, listType, titleType], (error, results, fields) => {
            if (error) {
                return db.rollback(() => {
                    res.send({ status: error });
                    console.warn(error);
                });
            }
            if (results.length > 0) {
                const rows = [];
                for (let i = 0; i < results.length; i++)
                    rows.push(results[i]);
                res.status(200).send(rows);
            } else {
                res.status(404).send({
                    status: 'NOT-FOUND',
                });
            }
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
                    throw error;
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
                    throw error;
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
                res.status(200).send(recentTitles);
            } else {
                res.status(404).send({
                    status: 'NOT-FOUND',
                });
            }
        });
    }

    getTitleRecommendations(req, res) {
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
        // Get recent titles
        db.query('SELECT * FROM history WHERE titleType=? AND username=?;', [titleType, username], (error, results, fields) => {
            if (error) {
                return db.rollback(() => {
                    throw error;
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

                if (recentTitles.length > 2) {
                    // Proceed only if atleast 3 titles have been added to lists
                    const recoms = [];
                    const titleIds = [];
                    const getRecomPath = titleType === 'movie' ? 'getmr' : 'getsr';

                    // Iterate through recommendations for the 3 recently listed titles
                    for (let i = 0; i < 3; i++) {
                        titleIds.push(recentTitles[i].titleId);
                        axios.get(`https://api-cine-digest.herokuapp.com/api/v1/${getRecomPath}/${titleIds[i]};`)
                            .then((response) => {
                                // console.warn(response);
                                let index = 0;
                                const upperLimit = response.titleIds.length < 3
                                    ? response.titleIds.length : 3;

                                // Check if movie is already in a list, if so then don't recommend it
                                let currentTitleId = response.titleIds[index];
                                db.query('SELECT * FROM history WHERE username=? AND titleId=? AND titleType=?;', [username, currentTitleId, titleType], (error, results, fields) => {
                                    if (error) {
                                        return db.rollback(() => {
                                            throw error;
                                        });
                                    }
                                    const len = results.length;
                                    while (true) {
                                        if (len === 0) {
                                            // Movie is not in a list, can be recommended
                                            recoms.push({
                                                title: response.titles[index],
                                                titleId: response.titleIds[index],
                                                posterPath: `https://image.tmdb.org/t/p/original/${response.posterPaths[index]}`,
                                            });
                                        }

                                        if (index >= upperLimit) {
                                            // Break if index crosses the upper limit
                                            break;
                                        }
                                        ++index;
                                    }
                                });
                            })
                            .catch((error) => {
                                console.warn(error.message);
                            });
                    }
                    res.status(200).send(recoms);
                }
            } else {
                res.status(404).send({
                    status: 'NOT-FOUND',
                });
            }
        });
    }
}

const historyModel = new HistoryModel();
module.exports = historyModel;
