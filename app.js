// Imports
const app = require('express')();
const dotenv = require('dotenv').config();
const fs = require('fs');
const request = require('request');

// Environment variable
const PORT = process.env.PORT;

// GET method routes
app.get('/api', (req, res) => {
    res.send("API backend for Movie Digest");
});

app.get('/api', (req, res) => {
    res.send("API backend for Movie Digest");
});

app.listen(PORT, () => {
    console.log(`Server is now listening on port ${PORT}`);
});