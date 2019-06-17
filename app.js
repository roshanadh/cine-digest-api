// Imports
require('dotenv').config();
const app = require('express')();
const fs = require('fs');
const request = require('request');

// Environment variable
const PORT = process.env.PORT;
const TMDB_KEY = process.env.TMDB_KEY;

// Request URLs
const searchMovieUrl = 'https://api.themoviedb.org/3/search/movie?api_key=' + TMDB_KEY;
let finalSearchUrl;

// GET method routes
// Landing route
app.get('/api/v1', (req, res) => {
    res.send("API backend for Movie Digest");
});

//Search movie
app.get('/api/v1/searchm/:movieName/:language/', (req, res) => {
    let movieName = req.params.movieName;   // pulp%20fiction
    let language = req.params.language;     // en-US

    finalSearchUrl = searchMovieUrl + '&language=' + language + '&query=' + movieName;
    console.log(finalSearchUrl);

    request.get(finalSearchUrl, (error, response, body) => {
        if(error)
            console.log(err);
        else{
            console.log(response);

            // response.body is a JSON object
            jsonResponse = JSON.parse(response.body); 
            let movieId = parseInt(jsonResponse.id, 10); // parse to base 10 (decimal)
            // TODO get movie description, poster and others from jsonResponse
            res.send(jsonResponse);
        }
    });

});
app.get('/api/v1/searchm/:movieName/:language/:year', (req, res) => {
    let movieName = req.params.movieName;   // pulp%20fiction
    let language = req.params.language;     // en-US
    let year = req.params.year;             // 2003

    finalSearchUrl = searchMovieUrl + '&language=' + language + '&query=' + movieName;
    if(year.trim != "")
        finalSearchUrl += '&year=' + year;
    console.log(finalSearchUrl);

    request.get(finalSearchUrl)

});

app.listen(PORT, () => {
    console.log(`Server is now listening on port ${PORT}`);
});