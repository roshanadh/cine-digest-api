// Imports
require('dotenv').config();
const app = require('express')();
const fs = require('fs');
const request = require('request');

// Environment variable
const PORT = process.env.PORT;
const OMDB_KEY = process.env.OMDB_KEY;

// Request URLs
const omdbApiUrl = 'http://www.omdbapi.com/';
const omdbApiKey = "&apikey=" + OMDB_KEY;

// Final search URL
let finalSearchUrl;

function respondMovie(fetchResponse){
    let response;

    if(fetchResponse.Response == "False"){
        response = {"Message": "False"};
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

        response = {
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
    }
    console.log(response);
    return response;
}

function respondShowBySeason(fetchResponse){
    let response;

    if(fetchResponse.Response == "False"){
        response = {"Message": "False"};
    }
    else{
        let message = "True";
        let showTitle = fetchResponse.Title;
        let showSeason = fetchResponse.Season;
        let showTotalSeasons = fetchResponse.totalSeasons; // display as 1/8 : current/total
        let showTotalEpisodesInSeason = fetchResponse.Episodes.length; 
        let showEpisodeName = [];
        // Get episodes
        for(i = 0; i < fetchResponse.Episodes.length; i++){
            showEpisodeName[i] = fetchResponse.Episodes[i].Title; 
        }

        response = {
            "Message": message,
            "Title": showTitle,
            "Season": showSeason,
            "totalSeasonsOfShow": showTotalSeasons,
            "totalEpisodesInSeason": showTotalEpisodesInSeason,
            "Episodes": showEpisodeName,
        }
    }
    console.log(response);
    return response;
}

// GET method routes
// Landing route
app.get('/api/v1', (req, res) => {
    res.send("API backend for Movie Digest");
});

// TODO both GET methods have similar functionality, employ it to a common function

//Search movie by title (without year) http://www.omdbapi.com/?t=Pulp+Fiction
app.get('/api/v1/searchm/:query/', (req, res) => {
    let query = req.params.query;   // pulp+fiction

    finalSearchUrl = omdbApiUrl + '?t=' + query + omdbApiKey;
    console.log(finalSearchUrl);

    request.get(finalSearchUrl, (error, resp, body) => {
        if(error)
            console.log(err);
        else{
            console.log(resp);

            // response.body is a JSON object
            fetchResponse = JSON.parse(resp.body); 
            let response = respondMovie(fetchResponse);

            if(response.Message == "True")
                res.status(200);
            else
                res.status(404);
            res.send(response);            
        }
    });

});

//Search movie by title (with year) http://www.omdbapi.com/?t=Pulp+Fiction&y=1994
app.get('/api/v1/searchm/:query/:year', (req, res) => {
    let query = req.params.query;   // pulp+fiction
    let year = req.params.year;

    finalSearchUrl = omdbApiUrl + '?t=' + query + "&y="+ year + omdbApiKey;
    console.log(finalSearchUrl);

    request.get(finalSearchUrl, (error, resp, body) => {
        if(error)
            console.log(err);
        else{
            console.log(resp);

            // response.body is a JSON object
            fetchResponse = JSON.parse(resp.body); 
            let response = respond(fetchResponse);

            if(response.Message == "True")
                res.status(200);
            else
                res.status(404);
            res.send(response);   
        }
    });

});

// Search TV show by seasons (without episodes); lists all episodes 
//http://www.omdbapi.com/?t=Game+of+Thrones&Season=1
app.get('/api/v1/searchs/:query/:season', (req, res) => {
    let query = req.params.query;   // pulp+fiction
    let season = req.params.season;

    finalSearchUrl = omdbApiUrl + '?t=' + query + "&season="+ season + omdbApiKey;
    console.log(finalSearchUrl);

    request.get(finalSearchUrl, (error, resp, body) => {
        if(error)
            console.log(err);
        else{
            console.log(resp);

            // response.body is a JSON object
            fetchResponse = JSON.parse(resp.body); 
            console.log(fetchResponse);
            let response = respondShowBySeason(fetchResponse);

            if(response.Message == "True")
                res.status(200);
            else
                res.status(404);
            res.send(response);   
        }
    });

});

// Search TV show by seasons (with episodes)
//http://www.omdbapi.com/?t=Game+of+Thrones&season=1&episode=1
app.listen(PORT, () => {
    console.log(`Server is now listening on port ${PORT}`);
});