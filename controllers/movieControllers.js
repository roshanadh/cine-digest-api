/* eslint-disable indent */
/* eslint-disable linebreak-style */
function respondMovie(fetchResponse) {
    // returns the movie information as a JSON response
    let response;

    if (fetchResponse.Response == 'False') {
        response = { Message: 'False' };
    } else {
        const message = 'True';
        const movieTitle = fetchResponse.Title;
        const movieYear = fetchResponse.Year;
        const movieRated = fetchResponse.Rated;
        const movieRuntime = fetchResponse.Runtime;
        const movieGenre = fetchResponse.Genre;
        const movieDirector = fetchResponse.Director;
        const movieActors = fetchResponse.Actors;
        const moviePlot = fetchResponse.Plot;
        const movieLanguage = fetchResponse.Language;
        const movieImdbRating = fetchResponse.imdbRating;
        const posterPath = fetchResponse.Poster;

        response = {
            Message: message,
            Title: movieTitle,
            Year: movieYear,
            Rated: movieRated,
            Runtime: movieRuntime,
            Genre: movieGenre,
            Director: movieDirector,
            Actors: movieActors,
            Plot: moviePlot,
            Language: movieLanguage,
            imdbRating: movieImdbRating,
            Poster: posterPath,
        };
    }
    console.log(response);
    return response;
}

module.exports = respondMovie;
