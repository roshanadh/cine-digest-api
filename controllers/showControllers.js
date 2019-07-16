/* eslint-disable no-plusplus */
/* eslint-disable linebreak-style */
function respondShowBySeason(fetchResponse) {
  // returns the show information as a JSON response
  let response;

  if (fetchResponse.Response == 'False') {
    response = { Message: 'False' };
  } else {
    const message = 'True';
    const showTitle = fetchResponse.Title;
    const showSeason = fetchResponse.Season;
    const showTotalSeasons = fetchResponse.totalSeasons; // display as 1/8 : current/total
    const showTotalEpisodesInSeason = fetchResponse.Episodes.length;
    const showEpisodeName = [];
    // Get episodes
    for (let i = 0; i < fetchResponse.Episodes.length; i++) {
      showEpisodeName[i] = fetchResponse.Episodes[i].Title;
    }

    response = {
      Message: message,
      Title: showTitle,
      Season: showSeason,
      totalSeasonsOfShow: showTotalSeasons,
      totalEpisodesInSeason: showTotalEpisodesInSeason,
      Episodes: showEpisodeName,
    };
  }
  console.log(response);
  return response;
}

function respondShowByEpisode(fetchResponse) {
  // returns the show information as a JSON response
  let response;

  if (fetchResponse.Response == 'False') {
    response = { Message: 'False' };
  } else {
    const message = 'True';
    const episodeTitle = fetchResponse.Title;
    const episodeYear = fetchResponse.Year;
    const episodeRated = fetchResponse.Rated;
    const episodeSeason = fetchResponse.Season;
    const episodeNumber = fetchResponse.Episode;
    const episodeRuntime = fetchResponse.runtime;
    const episodeGenre = fetchResponse.Genre;
    const episodeDirector = fetchResponse.Director;
    const episodeActors = fetchResponse.Actors;
    const episodePlot = fetchResponse.Plot;
    const episodeLanguage = fetchResponse.Language;
    const episodeImdbRating = fetchResponse.imdbRating;
    const posterPath = fetchResponse.Poster;

    response = {
      Message: message,
      Title: episodeTitle,
      Year: episodeYear,
      Rated: episodeRated,
      Season: episodeSeason,
      Episode: episodeNumber,
      Runtime: episodeRuntime,
      Genre: episodeGenre,
      Director: episodeDirector,
      Actors: episodeActors,
      Plot: episodePlot,
      Language: episodeLanguage,
      imdbRating: episodeImdbRating,
      Poster: posterPath,
    };
  }
  console.log(response);
  return response;
}

module.exports.respondShowBySeason = respondShowBySeason;
module.exports.respondShowByEpisode = respondShowByEpisode;
