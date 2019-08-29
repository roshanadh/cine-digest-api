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
            res.status(400).send({
                status: 'NO-TITLE-OVERVIEW',
            });
        } else if (!req.body.titleVoteCount) {
            res.status(400).send({
                status: 'NO-TITLE-VOTE-COUNT',
            });
        } else if (!req.body.titleVoteAverage) {
            res.status(400).send({
                status: 'NO-TITLE-VOTE-AVERAGE',
            });
        } else if (!req.body.titlePosterPath) {
            res.status(400).send({
                status: 'NO-TITLE-POSTER-PATH',
            });
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
