// Imports
const express = require('express');
const router = require('./routes/index.js');
const { PORT } = require('./utility.js');

const app = express();

app.set('json spaces', 2);

app.use(express.static('public'));
app.use(router);

app.listen(PORT, () => {
    console.log(`Server is now listening on port ${PORT}`);
});
