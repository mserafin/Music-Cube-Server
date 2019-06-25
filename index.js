const express = require('express');
const player = require('./src/express/player');
const authorize = require('./src/express/authorize');

const app = express();
const port = process.argv[2] || 3000;

player.setup(app);
authorize.setup(app);

app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`App listening on port: ${port}`);
});
