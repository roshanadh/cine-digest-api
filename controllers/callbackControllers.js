const request = require('request');
const respondMovie = require('../controllers/movieControllers.js');
const {respondShowBySeason, respondShowByEpisode} = require('../controllers/showControllers.js');
const {OMDB_KEY} = require('../utility.js');
require('dotenv').config();

const TMDB_KEY = process.env.TMDB_KEY;
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL;
const API_KEY_PARAM = process.env.API_KEY_PARAM;
const QUERY_PARAM = process.env.QUERY_PARAM;

// Request URLs
const omdbApiUrl = 'http://www.omdbapi.com/';
const omdbApiKey = "&apikey=" + OMDB_KEY;

// Final search URL
let finalSearchUrl;

class CallbackController{
    getLanding(req, res){
        return res.send("API backend for Movie Digest");
    }

    getMovieByTitle(req, res){        
        const requestURL = BASE_URL + API_KEY_PARAM + TMDB_KEY
            + QUERY_PARAM + req.params.title;

        console.log(requestURL);
        request.get(requestURL, (error, response, body) => {
            const responseStatus = parseInt(response.statusCode, 10);
            const responseBody = JSON.parse(body);

            // Separating concerns
            const parsedTotalResults = parseInt(responseBody.total_results, 10);

            /*
                *   There are at most 20 results per page.
                *   Cine Digest API is to return information on the
                   first 20 (if there are) titles.
            */

            const totalResults = parsedTotalResults <= 20 ? parsedTotalResults : 20;
            const resultsArray = responseBody.results;
            const voteCounts = [];
            const titleIds = [];
            const voteAverages = [];
            const titles = [];
            const posterPaths = [];
            const languages = [];
            const overviews = [];
            const releaseDates = [];

            if (responseStatus === 200) {
                const message = true;
                for (var i = 0; i < totalResults; i++) {
                    voteCounts[i] = resultsArray[i].vote_count;
                    titleIds[i] = resultsArray[i].id;
                    voteAverages[i] = resultsArray[i].vote_average;
                    titles[i] = resultsArray[i].title;
                    posterPaths[i] = resultsArray[i].poster_path;
                    languages[i] = resultsArray[i].original_language;
                    overviews[i] = resultsArray[i].overview;
                    releaseDates[i] = resultsArray[i].release_date;
                }
                return res.status(200).json({
                    responseStatus,
                    message,
                    totalResults,
                    voteCounts,
                    titleIds,
                    voteAverages,
                    titles,
                    posterPaths,
                    languages,
                    overviews,
                    releaseDates,
                });
            } else {
                return res.status(404).json({
                    responseStatus,
                    message: 'false',
                });
            }
        });
    }

    getMovieByTitleAndYear(req, res){
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
                let fetchResponse = JSON.parse(resp.body); 
                let response = respondMovie(fetchResponse);

                if(response.Message == "True")
                    res.status(200);
                else
                    res.status(404);
                res.send(response);   
            }
        });
    }

    getShowBySeason(req, res){
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
                let fetchResponse = JSON.parse(resp.body); 
                let response = respondShowBySeason(fetchResponse);

                if(response.Message == "True")
                    res.status(200);
                else
                    res.status(404);
                res.send(response);   
            }
        });
    }

    getShowBySeasonAndEpisode(req, res){
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
                let fetchResponse = JSON.parse(resp.body); 
                let response = respondShowByEpisode(fetchResponse);
    
                if(response.Message == "True")
                    res.status(200);
                else
                    res.status(404);
                res.send(response);   
            }
        });    
    }
}

const callbackController = new CallbackController();
module.exports = callbackController;