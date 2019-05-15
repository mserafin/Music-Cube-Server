const authorization = require('../authorization');

const setup = (app) => {
    app.get('/login', (req, res) => {
        res.redirect(301, authorization.authorizationUri());
    });

    app.get('/authorize', async (req, res) => {
        await authorization.authorizationCode(req.query.code || '');
        res.redirect('/');
    });
};

module.exports = { setup };
