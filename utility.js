require('dotenv').config();

// Environment variable
const PORT = process.env.PORT;
const OMDB_KEY = process.env.OMDB_KEY;

module.exports.PORT = PORT;
module.exports.OMDB_KEY = OMDB_KEY;