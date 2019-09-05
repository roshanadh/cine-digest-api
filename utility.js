require('dotenv').config();

// Environment variables
const PORT = process.env.PORT || 3000;
const {
    OMDB_KEY,
    TMDB_KEY,
    BASE_URL,
    API_KEY_STRING,
    QUERY_STRING,
    PRIMARY_RELEASE_YEAR_STRING,
    DBHOST,
    DBNAME,
    DBUSERNAME,
    DBPASSWORD,
    EMAILER,
    EMAILERPASS,
} = process.env;

module.exports = {
    PORT,
    OMDB_KEY,
    TMDB_KEY,
    BASE_URL,
    API_KEY_STRING,
    QUERY_STRING,
    PRIMARY_RELEASE_YEAR_STRING,
    DBHOST,
    DBNAME,
    DBUSERNAME,
    DBPASSWORD,
    EMAILER,
    EMAILERPASS,
};
