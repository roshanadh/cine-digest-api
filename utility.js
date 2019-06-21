require('dotenv').config();

// Environment variables
const PORT = process.env.PORT || 3000;
const OMDB_KEY = process.env.OMDB_KEY;

module.exports.PORT = PORT;
module.exports.OMDB_KEY = OMDB_KEY;