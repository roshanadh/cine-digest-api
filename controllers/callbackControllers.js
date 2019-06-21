const request = require('request');
const {respondMovie, respondShowBySeason, respondShowByEpisode} = require('../controllers/controllers.js');
const {OMDB_KEY} = require('../utility.js');

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
                return res.send(response);            
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
                fetchResponse = JSON.parse(resp.body); 
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
                fetchResponse = JSON.parse(resp.body); 
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
                fetchResponse = JSON.parse(resp.body); 
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