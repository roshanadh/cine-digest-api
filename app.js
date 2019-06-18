// Imports
require('dotenv').config();
const app = require('express')();
const fs = require('fs');
const request = require('request');

// Environment variable
const PORT = process.env.PORT;
const OMDB_KEY = process.env.OMDB_KEY;

// Request URLs
const apiUrl = 'http://www.omdbapi.com/';
const apiKey = "&apikey=" + OMDB_KEY;
//  + movieTitle + '&apikey=' + OMDB_KEY;
let finalSearchUrl;

// GET method routes
// Landing route
app.get('/api/v1', (req, res) => {
    res.send("API backend for Movie Digest");
});

//Search movie by title http://www.omdbapi.com/?t=Pulp+fiction&y=1994
app.get('/api/v1/searchm/:query/', (req, res) => {
    let query = req.params.query;   // pulp+fiction

    finalSearchUrl = apiUrl + '?t=' + query + apiKey;
    console.log(finalSearchUrl);

    request.get(finalSearchUrl, (error, response, body) => {
        if(error)
            console.log(err);
        else{
            console.log(response);

            // response.body is a JSON object
            jsonResponse = JSON.parse(response.body); 
            let movieTitle = jsonResponse.Title;
            let movieYear = jsonResponse.Year;
            let movieRated = jsonResponse.Rated;
            let movieRuntime = jsonResponse.Runtime;
            let movieGenre = jsonResponse.Genre;
            let movieDirector = jsonResponse.Director;
            let movieActors = jsonResponse.Actors;
            let moviePlot = jsonResponse.Plot;
            let movieLanguage = jsonResponse.Language;
            let movieImdbRating = jsonResponse.imdbRating;  
            
            console.log(jsonResponse);
            res.send(jsonResponse + movieTitle + movieYear 
                + movieRated + movieRuntime + movieGenre + movieDirector 
                + movieActors + moviePlot + movieLanguage + movieImdbRating);
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