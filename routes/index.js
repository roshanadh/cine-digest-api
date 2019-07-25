const express = require('express');

const router = express.Router();
const CallbackController = require('../controllers/callbackControllers.js');

// GET method routes
// Landing route
router.get('/api/v1', CallbackController.getLanding);

// Search movies by title (without year)
//  https://api.themoviedb.org/3/search/movie?api_key={}&query={}
router.get('/api/v1/searchm/:title', CallbackController.searchMoviesByTitle);

// Search movies by title (with year)
// https://api.themoviedb.org/3/search/movie?api_key={}&query={}&primary_release_year={}
router.get('/api/v1/searchm/:title/:year', CallbackController.searchMoviesByTitleAndYear);

// Get movie by ID
// https://api.themoviedb.org/3/movie/{movie-id}?api_key={}
router.get('/api/v1/getm/:id', CallbackController.getMovieById);

// Search TV shows by title
// https://api.themoviedb.org/3/search/tv?api_key={}&query={}
router.get('/api/v1/searchs/:title', CallbackController.searchShowsByTitle);

// Search TV shows by seasons (without episodes); lists all episodes
// http://www.omdbapi.com/?t=Game+of+Thrones&Season=1
router.get('/api/v1/searchs/:query/:season', CallbackController.getShowBySeason);

// Search TV show by seasons (with episodes)
// http://www.omdbapi.com/?t=Game+of+Thrones&season=1&episode=1
router.get('/api/v1/searchs/:query/:season/:episode', CallbackController.getShowBySeasonAndEpisode);

// Error handling
// Redirect to the landing route
router.get('*', (req, res) => {
    // TODO
    // Redirect to a 404 page
    res.redirect('/api/v1');
});
module.exports = router;
