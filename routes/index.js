const express = require('express');
const router = express.Router();
const request = require('request');
const {OMDB_KEY} = require('../utility.js');
const {respondMovie, respondShowBySeason, respondShowByEpisode} = require('../controllers/controllers.js');

// Request URLs
const omdbApiUrl = 'http://www.omdbapi.com/';
const omdbApiKey = "&apikey=" + OMDB_KEY;

// Final search URL
let finalSearchUrl;

// GET method routes
// Landing route
router.get('/api/v1', (req, res) => {
    res.send("API backend for Movie Digest");
});

//Search movie by title (without year) http://www.omdbapi.com/?t=Pulp+Fiction
router.get('/api/v1/searchm/:query/', (req, res) => {
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
router.get('/api/v1/searchm/:query/:year', (req, res) => {
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
            let response = respondMovie(fetchResponse);

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
router.get('/api/v1/searchs/:query/:season', (req, res) => {
    let query = req.params.query;       // Game+of+Thrones
    let season = req.params.season;     //1

    finalSearchUrl = omdbApiUrl + '?t=' + query + "&season="+ season + omdbApiKey;
    console.log(finalSearchUrl);

    request.get(finalSearchUrl, (error, resp, body) => {
        if(error)
            console.log(err);
        else{
            console.log(resp);

            // response.body is a JSON object
            fetchResponse = JSON.parse(resp.body); 
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
router.get('/api/v1/searchs/:query/:season/:episode', (req, res) => {
    let query = req.params.query;       // Game+of+Thrones
    let season = req.params.season;     //1
    let episode = req.params.episode;     //1

    finalSearchUrl = omdbApiUrl + '?t=' + query + "&season="+ season + "&episode=" + episode + omdbApiKey;
    console.log(finalSearchUrl);

    request.get(finalSearchUrl, (error, resp, body) => {
        if(error)
            console.log(err);
        else{
            console.log(resp);

            // response.body is a JSON object
            fetchResponse = JSON.parse(resp.body); 
            let response = respondShowByEpisode(fetchResponse);

            if(response.Message == "True")
                res.status(200);
            else
                res.status(404);
            res.send(response);   
        }
    });

});

module.exports = router;