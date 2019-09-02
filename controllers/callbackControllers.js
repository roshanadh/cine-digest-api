/* eslint-disable no-shadow */

// TODO
// Convert snake_case to camelCase in every response
const path = require('path');
const axios = require('axios');

const {
    TMDB_KEY,
    BASE_URL,
    API_KEY_STRING,
    QUERY_STRING,
    PRIMARY_RELEASE_YEAR_STRING,
} = require('../utility.js');

class CallbackController {
    getLanding(req, res) {
        return res.status(200).sendFile(path.join(__dirname, '../public/index.html'));
    }

    searchMoviesByTitle(req, res) {
        const PATH = '/search/movie';
        const requestURL = BASE_URL + PATH + API_KEY_STRING + TMDB_KEY
            + QUERY_STRING + req.params.title;

        axios.get(requestURL)
            .then((response) => {
                const responseStatus = parseInt(response.status, 10);
                const responseBody = response.data;

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
                return res.sendStatus(404);
            })
            .catch((error) => {
                res.sendStatus(error.response.status);
            });
    }

    searchMoviesByTitleAndYear(req, res) {
        const PATH = '/search/movie';
        const requestURL = BASE_URL + PATH + API_KEY_STRING + TMDB_KEY
            + QUERY_STRING + req.params.title + PRIMARY_RELEASE_YEAR_STRING + req.params.year;

        axios.get(requestURL)
            .then((response) => {
                const responseStatus = parseInt(response.status, 10);
                const responseBody = response.data;

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
                return res.sendStatus(404);
            })
            .catch((error) => {
                res.sendStatus(error.response.status);
            });
    }

    getMovieById(req, res) {
        let PATH = `/movie/${req.params.id}`;
        let requestURL = BASE_URL + PATH + API_KEY_STRING + TMDB_KEY;

        // Get Movie information
        axios.get(requestURL)
            .then((response) => {
                const responseStatus = parseInt(response.status, 10);
                const responseBody = response.data;
                if (responseStatus === 200) {
                    const {
                        backdrop_path,
                        budget,
                        genres,
                        homepage,
                        id,
                        original_language,
                        overview,
                        poster_path,
                        release_date,
                        revenue,
                        runtime,
                        status,
                        tagline,
                        title,
                        vote_average,
                        vote_count,
                    } = responseBody;

                    // Get credits
                    PATH = `/movie/${req.params.id}/credits`;
                    requestURL = BASE_URL + PATH + API_KEY_STRING + TMDB_KEY;
                    axios.get(requestURL)
                        .then((response) => {
                            const responseStatus = parseInt(response.status, 10);
                            const responseBody = response.data;

                            const credits = [];
                            const directors = [];
                            const directorsProfilePath = [];
                            const creditsProfilePath = [];
                            if (responseStatus === 200) {
                                const { cast, crew } = responseBody;
                                // Get only the first 6 cast details
                                const safeLength = cast.length <= 6 ? cast.length : 6;
                                for (let i = 0; i < safeLength; i++) {
                                    credits[i] = cast[i].name;
                                    creditsProfilePath[i] = cast[i].profile_path;
                                }
                                // Get directors
                                for (let i = 0; i < crew.length; i++) {
                                    if (crew[i].job === 'Director') {
                                        directors.push(crew[i].name);
                                        directorsProfilePath.push(crew[i].profile_path);
                                    }
                                }
                                return res.status(200).json({
                                    id,
                                    title,
                                    tagline,
                                    vote_average,
                                    vote_count,
                                    runtime,
                                    status,
                                    genres,
                                    credits,
                                    creditsProfilePath,
                                    directors,
                                    directorsProfilePath,
                                    backdrop_path,
                                    budget,
                                    revenue,
                                    homepage,
                                    original_language,
                                    overview,
                                    poster_path,
                                    release_date,
                                });
                            }
                        })
                        .catch(error => res.json(error));
                }
            })
            .catch(error => res.sendStatus(error.response.status));
    }

    searchShowsByTitle(req, res) {
        const PATH = '/search/tv';
        const requestURL = BASE_URL + PATH + API_KEY_STRING + TMDB_KEY
            + QUERY_STRING + req.params.title;

        axios.get(requestURL)
            .then((response) => {
                const responseStatus = parseInt(response.status, 10);
                const responseBody = response.data;

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
                const firstAirDates = [];

                if (responseStatus === 200 && totalResults > 0) {
                    const message = true;
                    for (let i = 0; i < totalResults; i++) {
                        voteCounts[i] = resultsArray[i].vote_count;
                        titleIds[i] = resultsArray[i].id;
                        voteAverages[i] = resultsArray[i].vote_average;
                        titles[i] = resultsArray[i].name;
                        posterPaths[i] = resultsArray[i].poster_path;
                        languages[i] = resultsArray[i].original_language;
                        overviews[i] = resultsArray[i].overview;
                        firstAirDates[i] = resultsArray[i].first_air_date;
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
                        firstAirDates,
                    });
                }
                return res.sendStatus(404);
            })
            .catch((error) => {
                res.sendStatus(error.response.status);
            });
    }

    getShowById(req, res) {
        const PATH = `/tv/${req.params.id}`;
        const requestURL = BASE_URL + PATH + API_KEY_STRING + TMDB_KEY;
        axios.get(requestURL)
            .then((response) => {
                const responseStatus = parseInt(response.status, 10);
                const responseBody = response.data;

                if (responseStatus === 200) {
                    const {
                        backdrop_path,
                        created_by,
                        episode_run_time,
                        first_air_date,
                        genres,
                        homepage,
                        id,
                        last_air_date,
                        name,
                        next_episode_to_air,
                        networks,
                        number_of_episodes,
                        number_of_seasons,
                        overview,
                        poster_path,
                        seasons,
                        status,
                        vote_average,
                        vote_count,
                    } = responseBody;

                    // Set length = 0 if returned null by TMDB API
                    const createdByLength = created_by.length > 0 ? created_by.length : 0;
                    const episodeRunTimeLength = episode_run_time.length > 0 ? episode_run_time.length : 0;
                    const networksLength = networks.length > 0 ? networks.length : 0;
                    const seasonsLength = seasons.length > 0 ? seasons.length : 0;

                    const createdBy = [];
                    const episodeRunTime = [];

                    for (let i = 0; i < createdByLength; i++)
                        createdBy[i] = created_by[i].name;

                    for (let i = 0; i < episodeRunTimeLength; i++)
                        episodeRunTime[i] = episode_run_time[i];

                    for (let i = 0; i < networksLength; i++)
                        networks[i] = networks[i].name;

                    for (let i = 0; i < seasonsLength; i++)
                        seasons[i] = seasons[i].name;

                    return res.status(200).json({
                        responseStatus,
                        name,
                        id,
                        backdrop_path,
                        createdBy,
                        poster_path,
                        seasons,
                        status,
                        vote_average,
                        vote_count,
                        episodeRunTime,
                        first_air_date,
                        last_air_date,
                        genres,
                        homepage,
                        next_episode_to_air,
                        networks,
                        number_of_episodes,
                        number_of_seasons,
                        overview,
                    });
                }
            })
            .catch(error => res.sendStatus(error.response.status));
    }

    getSeason(req, res) {
        const PATH = `/tv/${req.params.id}/season/${req.params.seasonNo}`;
        const requestURL = BASE_URL + PATH + API_KEY_STRING + TMDB_KEY;
        axios.get(requestURL)
            .then((response) => {
                const responseStatus = parseInt(response.status, 10);
                const responseBody = response.data;

                if (responseStatus === 200) {
                    const {
                        air_date,
                        episodes,
                        poster_path,
                        season_number,
                    } = responseBody;

                    // Set length = 0 if returned null by TMDB API
                    const episodesLength = episodes.length > 0 ? episodes.length : 0;

                    for (let i = 0; i < episodesLength; i++) {
                        const {
                            air_date,
                            episode_number,
                            name,
                            overview,
                            vote_average,
                            vote_count,
                        } = episodes[i];

                        episodes[i] = {
                            air_date,
                            episode_number,
                            name,
                            overview,
                            vote_average,
                            vote_count,
                        };
                    }
                    return res.status(200).json({
                        poster_path,
                        season_number,
                        air_date,
                        episodes,
                    });
                }
                return res.sendStatus(404);
            })
            .catch((error) => {
                res.sendStatus(error.response.status);
            });
    }

    getMovieR(req, res) {
        const PATH = `/movie/${req.params.id}/recommendations`;
        const requestURL = BASE_URL + PATH + API_KEY_STRING + TMDB_KEY;

        axios.get(requestURL)
            .then((response) => {
                const responseStatus = parseInt(response.status, 10);
                const responseBody = response.data;

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
                        // Only return titles with non-adult category
                        if (resultsArray[i].adult === false) {
                            voteCounts[i] = resultsArray[i].vote_count;
                            titleIds[i] = resultsArray[i].id;
                            voteAverages[i] = resultsArray[i].vote_average;
                            titles[i] = resultsArray[i].title;
                            posterPaths[i] = resultsArray[i].poster_path;
                            languages[i] = resultsArray[i].original_language;
                            overviews[i] = resultsArray[i].overview;
                            releaseDates[i] = resultsArray[i].release_date;
                        }
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
                return res.sendStatus(404);
            })
            .catch((error) => {
                res.sendStatus(error.response.status);
            });
    }

    getShowR(req, res) {
        const PATH = `/tv/${req.params.id}/recommendations`;
        const requestURL = BASE_URL + PATH + API_KEY_STRING + TMDB_KEY;

        axios.get(requestURL)
            .then((response) => {
                const responseStatus = parseInt(response.status, 10);
                const responseBody = response.data;

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
                const firstAirDates = [];

                if (responseStatus === 200 && totalResults > 0) {
                    const message = true;
                    for (let i = 0; i < totalResults; i++) {
                        voteCounts[i] = resultsArray[i].vote_count;
                        titleIds[i] = resultsArray[i].id;
                        voteAverages[i] = resultsArray[i].vote_average;
                        titles[i] = resultsArray[i].name;
                        posterPaths[i] = resultsArray[i].poster_path;
                        languages[i] = resultsArray[i].original_language;
                        overviews[i] = resultsArray[i].overview;
                        firstAirDates[i] = resultsArray[i].first_air_date;
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
                        firstAirDates,
                    });
                }
                return res.sendStatus(404);
            })
            .catch((error) => {
                res.sendStatus(error.response.status);
            });
    }
}

const callbackController = new CallbackController();
module.exports = callbackController;
