// Imports
const app = require('express')();
const router = require('./routes/index.js');
const {PORT} = require('./utility.js');

app.use(router);

app.listen(PORT, () => {
    console.log(`Server is now listening on port ${PORT}`);
});