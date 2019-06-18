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

// TODO both GET methods have similar functionality, employ it to a common function

//Search movie by title (without year) http://www.omdbapi.com/?t=Pulp+fiction
app.get('/api/v1/searchm/:query/', (req, res) => {
    let query = req.params.query;   // pulp+fiction

    finalSearchUrl = apiUrl + '?t=' + query + apiKey;
    console.log(finalSearchUrl);

    request.get(finalSearchUrl, (error, resp, body) => {
        if(error)
            console.log(err);
        else{
            console.log(resp);

           // response.body is a JSON object
           fetchResponse = JSON.parse(resp.body); 
           if(fetchResponse.Response == "False"){
               res.status(404).send({"message": "False"});
           }
           else{
               let message = "True";
               let movieTitle = fetchResponse.Title;
               let movieYear = fetchResponse.Year;
               let movieRated = fetchResponse.Rated;
               let movieRuntime = fetchResponse.Runtime;
               let movieGenre = fetchResponse.Genre;
               let movieDirector = fetchResponse.Director;
               let movieActors = fetchResponse.Actors;
               let moviePlot = fetchResponse.Plot;
               let movieLanguage = fetchResponse.Language;
               let movieImdbRating = fetchResponse.imdbRating; 
               let posterPath = fetchResponse.Poster;

               let sendResponse = {
                   "Message": message,
                   "Title": movieTitle,
                   "Year": movieYear,
                   "Rated": movieRated,
                   "Runtime": movieRuntime,
                   "Genre": movieGenre,
                   "Director": movieDirector,
                   "Actors": movieActors,
                   "Plot": moviePlot,
                   "Language": movieLanguage,
                   "imdbRating": movieImdbRating,
                   "Poster": posterPath
               }
           
               console.log(sendResponse);
               res.status(200).send(sendResponse);
           }
        }
    });

});

//Search movie by title (with year) http://www.omdbapi.com/?t=Pulp+fiction&y=1994
app.get('/api/v1/searchm/:query/:year', (req, res) => {
    let query = req.params.query;   // pulp+fiction
    let year = req.params.year;

    finalSearchUrl = apiUrl + '?t=' + query + "&y="+ year + apiKey;
    console.log(finalSearchUrl);

    request.get(finalSearchUrl, (error, resp, body) => {
        if(error)
            console.log(err);
        else{
            console.log(resp);

            // response.body is a JSON object
            fetchResponse = JSON.parse(resp.body); 
            if(fetchResponse.Response == "False"){
                res.status(404).send({"message": "False"});
            }
            else{
                let message = "True";
                let movieTitle = fetchResponse.Title;
                let movieYear = fetchResponse.Year;
                let movieRated = fetchResponse.Rated;
                let movieRuntime = fetchResponse.Runtime;
                let movieGenre = fetchResponse.Genre;
                let movieDirector = fetchResponse.Director;
                let movieActors = fetchResponse.Actors;
                let moviePlot = fetchResponse.Plot;
                let movieLanguage = fetchResponse.Language;
                let movieImdbRating = fetchResponse.imdbRating; 
                let posterPath = fetchResponse.Poster;

                let sendResponse = {
                    "Message": message,
                    "Title": movieTitle,
                    "Year": movieYear,
                    "Rated": movieRated,
                    "Runtime": movieRuntime,
                    "Genre": movieGenre,
                    "Director": movieDirector,
                    "Actors": movieActors,
                    "Plot": moviePlot,
                    "Language": movieLanguage,
                    "imdbRating": movieImdbRating,
                    "Poster": posterPath
                }
            
                console.log(sendResponse);
                res.status(200).send(sendResponse);
            }
        }
    });

});

app.listen(PORT, () => {
    console.log(`Server is now listening on port ${PORT}`);
});