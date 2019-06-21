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

module.exports.respondMovie = respondMovie;