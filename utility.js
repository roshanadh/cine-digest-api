require('dotenv').config();

// Environment variables
const PORT = process.env.PORT || 3000;
const OMDB_KEY = process.env.OMDB_KEY;
const TMDB_KEY = process.env.TMDB_KEY;
const BASE_URL = process.env.BASE_URL;
const API_KEY_STRING = process.env.API_KEY_STRING;
const QUERY_STRING = process.env.QUERY_STRING;

module.exports = {
    PORT: PORT,
    OMDB_KEY: OMDB_KEY,
    TMDB_KEY: TMDB_KEY,
    BASE_URL: BASE_URL,
    API_KEY_STRING: API_KEY_STRING,
    QUERY_STRING: QUERY_STRING,
}