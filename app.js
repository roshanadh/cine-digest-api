const app = require('express')();
const fs = require('fs');
const request = require('request');

const PORT = 5000;

app.get('/', (req, res) => {
    res.send("Hello World!");
});

app.listen(PORT, () => {
    console.log(`Server is now listening on port ${PORT}`);
});