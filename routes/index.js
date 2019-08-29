const express = require('express');

const router = express.Router();
const CallbackController = require('../controllers/callbackControllers.js');
const usersModel = require('../db/usersModel.js');
const historyModel = require('../db/historyModel.js');

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

// Get TV show by id
// https://api.themoviedb.org/3/tv/{tv-show-id}?api_key={}
router.get('/api/v1/gets/:id', CallbackController.getShowById);

// Get TV show season
// https://api.themoviedb.org/3/tv/{tv-show-id}/season/{season-number}?api_key={}
router.get('/api/v1/gets/:id/:seasonNo', CallbackController.getSeason);

// Get Movie recommendations
// https://api.themoviedb.org/3/movie/{movie-id}/recommendations?api_key={}
router.get('/api/v1/getmr/:id/', CallbackController.getMovieR);

// Get TV show recommendations
// https://api.themoviedb.org/3/tv/{tv-show-id}/recommendations?api_key={}
router.get('/api/v1/getsr/:id/', CallbackController.getShowR);

// Start MySQL database connection
router.post('/api/v1/register/', usersModel.addUser);
router.post('/api/v1/verify/', usersModel.verifyUser);
router.post('/api/v1/changePassword/', usersModel.changePassword);

// History model
router.post('/api/v1/addMovieToWishList/', historyModel.addMovieToWishList);
router.post('/api/v1/addMovieToWatchedList/', historyModel.addMovieToWatchedList);

router.post('/api/v1/addShowToWishList/', historyModel.addShowToWishList);
router.post('/api/v1/addShowToWatchingList/', historyModel.addShowToWatchingList);
router.post('/api/v1/addShowToWatchedList/', historyModel.addShowToWatchedList);

router.post('/api/v1/removeFromList/', historyModel.removeFromList);

router.post('/api/v1/getHistory/', historyModel.getHistory);
// Error handling
// Redirect to the landing route
router.get('*', (req, res) => {
    // TODO
    // Redirect to a 404 page
    res.redirect('/api/v1');
});
module.exports = router;
