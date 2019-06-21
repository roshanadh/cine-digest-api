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

function respondShowByEpisode(fetchResponse){
    let response;

    if(fetchResponse.Response == "False"){
        response = {"Message": "False"};
    }
    else{
        let message = "True";
        let episodeTitle = fetchResponse.Title;
        let episodeYear = fetchResponse.Year;
        let episodeRated = fetchResponse.Rated;
        let episodeSeason = fetchResponse.Season;
        let episodeNumber = fetchResponse.Episode;
        let episodeRuntime = fetchResponse.runtime;
        let episodeGenre = fetchResponse.Genre;
        let episodeDirector = fetchResponse.Director;
        let episodeActors = fetchResponse.Actors;
        let episodePlot = fetchResponse.Plot;
        let episodeLanguage = fetchResponse.Language;
        let episodeImdbRating = fetchResponse.imdbRating;
        let posterPath = fetchResponse.Poster;

        response = {
            "Message": message,
            "Title": episodeTitle,
            "Year": episodeYear,
            "Rated": episodeRated,
            "Season": episodeSeason,
            "Episode": episodeNumber,
            "Runtime": episodeRuntime,
            "Genre": episodeGenre,
            "Director": episodeDirector,
            "Actors": episodeActors,
            "Plot": episodePlot,
            "Language": episodeLanguage,
            "imdbRating": episodeImdbRating,
            "Poster": posterPath
        }
    }
    console.log(response);
    return response;
}

module.exports.respondShowBySeason = respondShowBySeason;
module.exports.respondShowByEpisode = respondShowByEpisode;