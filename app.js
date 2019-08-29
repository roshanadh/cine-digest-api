// Imports
const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes/index.js');
const { PORT } = require('./utility.js');

const app = express();

app.set('json spaces', 2);

// parse incoming requests' data
// bodyParser parses a JSON data sent from client to the server with a POST request
// it parses the JSON data and makes it available under the req.body as a property
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));
app.use(router);

app.listen(PORT, () => {
    console.log(`Server is now listening on port ${PORT}`);
});
