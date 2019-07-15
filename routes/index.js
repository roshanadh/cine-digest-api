const express = require('express');
const router = express.Router();
const CallbackController = require('../controllers/callbackControllers.js');

// GET method routes
// Landing route
router.get('/api/v1', CallbackController.getLanding);

// Search movie by title (without year) http://www.omdbapi.com/?t=Pulp+Fiction
router.get('/api/v1/searchm/:query', CallbackController.getMovieByTitle);

// Search movie by title (with year) http://www.omdbapi.com/?t=Pulp+Fiction&y=1994
router.get('/api/v1/searchm/:query/:year', CallbackController.getMovieByTitleAndYear);

// Search TV show by seasons (without episodes); lists all episodes 
// http://www.omdbapi.com/?t=Game+of+Thrones&Season=1
router.get('/api/v1/searchs/:query/:season', CallbackController.getShowBySeason);

// Search TV show by seasons (with episodes)
// http://www.omdbapi.com/?t=Game+of+Thrones&season=1&episode=1
router.get('/api/v1/searchs/:query/:season/:episode', CallbackController.getShowBySeasonAndEpisode);

// Error handling
// Redirect to the landing route
router.get('*', (req, res) => {
    res.redirect('/api/v1');
});
module.exports = router;