/* eslint-disable prefer-template */
/* eslint-disable no-plusplus */
/* eslint-disable class-methods-use-this */
const request = require('request');
const respondMovie = require('../controllers/movieControllers.js');
const { respondShowBySeason, respondShowByEpisode } = require('../controllers/showControllers.js');
const {
    OMDB_KEY,
    TMDB_KEY,
    BASE_URL,
    API_KEY_STRING,
    QUERY_STRING,
    PRIMARY_RELEASE_YEAR_STRING,
} = require('../utility.js');

// Request URLs
const omdbApiUrl = 'http://www.omdbapi.com/';
const omdbApiKey = `&apikey=${OMDB_KEY}`;

// Final search URL
let finalSearchUrl;

class CallbackController {
    getLanding(req, res) {
        return res.send('API backend for Movie Digest');
    }

    getMovieByTitle(req, res) {
        const PATH = '/search/movie';
        const requestURL = BASE_URL + PATH + API_KEY_STRING + TMDB_KEY
            + QUERY_STRING + req.params.title;

        request.get(requestURL, (_error, response, body) => {
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

            if (responseStatus === 200 && totalResults > 0) {
                const message = true;
                for (let i = 0; i < totalResults; i++) {
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
            }
            return res.status(404).json({
                responseStatus: 404,
                message: 'false',
            });
        });
    }

    getMovieByTitleAndYear(req, res) {
        const PATH = '/search/movie';
        const requestURL = BASE_URL + PATH + API_KEY_STRING + TMDB_KEY
            + QUERY_STRING + req.params.title + PRIMARY_RELEASE_YEAR_STRING + req.params.year;

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

            if (responseStatus === 200 && totalResults > 0) {
                const message = true;
                for (let i = 0; i < totalResults; i++) {
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
            }
            return res.status(404).json({
                responseStatus: 404,
                message: 'false',
            });
        });
    }

    getShowBySeason(req, res) {
        const { query } = req.params; // Game+of+Thrones
        const { season } = req.params; // 1

        finalSearchUrl = omdbApiUrl + '?t=' + query + '&season=' + season + omdbApiKey;
        console.log(finalSearchUrl);

        request.get(finalSearchUrl, (error, resp, _body) => {
            if (error) console.log(error);
            else {
                console.log(resp);

                // response.body is a JSON object
                const fetchResponse = JSON.parse(resp.body);
                const response = respondShowBySeason(fetchResponse);

                if (response.Message == 'True') res.status(200);
                else res.status(404);
                res.send(response);
            }
        });
    }

    getShowBySeasonAndEpisode(req, res) {
        const { query } = req.params; // Game+of+Thrones
        const { season } = req.params; // 1
        const { episode } = req.params; // 1

        finalSearchUrl = omdbApiUrl + '?t=' + query + '&season=' + season + '&episode=' + episode + omdbApiKey;
        console.log(finalSearchUrl);

        request.get(finalSearchUrl, (error, resp, _body) => {
            if (error) console.log(error);
            else {
                console.log(resp);

                // response.body is a JSON object
                const fetchResponse = JSON.parse(resp.body);
                const response = respondShowByEpisode(fetchResponse);

                if (response.Message == 'True') res.status(200);
                else res.status(404);
                res.send(response);
            }
        });
    }
}

const callbackController = new CallbackController();
module.exports = callbackController;
