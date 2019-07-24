require('dotenv').config();

// Environment variables
const PORT = process.env.PORT || 3000;
const { OMDB_KEY } = process.env;
const { TMDB_KEY } = process.env;
const { BASE_URL } = process.env;
const { API_KEY_STRING } = process.env;
const { QUERY_STRING } = process.env;
const { PRIMARY_RELEASE_YEAR_STRING } = process.env;

module.exports = {
    PORT,
    OMDB_KEY,
    TMDB_KEY,
    BASE_URL,
    API_KEY_STRING,
    QUERY_STRING,
    PRIMARY_RELEASE_YEAR_STRING,
};
