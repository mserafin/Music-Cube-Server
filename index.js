const express = require('express');
const CubeBadRequestException = require('./src/exception/cube-bad-request-exception');
const authorization = require('./src/authorization');
const spotify = require('./src/spotify')(authorization);
const db = require('./src/database');

const app = express();
const port = 3000;

const storage = {};

const isPresentOrElseThrow = (isValid) => {
    if (!isValid()) {
        throw new CubeBadRequestException('Invalid request syntax');
    }

    return true;
};

const executeAsync = (res, isValid, fn) => {
    let response = { status: 202, message: '' };

    try {
        isPresentOrElseThrow(() => isValid);
        setTimeout(fn, 0);
    } catch (ex) {
        response = {
            ...response, ...{ status: ex.status, message: ex.message }
        };
    } finally {
        res.status(response.status).send(response.message);
    }
};

app.get('/player/play', (req, res) => {
    const tagId = req.query.tag;
    const deviceName = req.query.device;
    const isValid = (!!deviceName && !!tagId);

    executeAsync(res, isValid, async () => {
        const devices = await spotify.devices();
        const device = devices.devices.filter(x => x.is_active)[0];

        if (device) {
            const data = await db.playlist.byTagId(tagId)
                || await db.playlist.create({ tagId });

            const deviceId = device.id;
            const albumId = data.get('albumId');

            storage[deviceName] = {
                ...storage[deviceName], ...{ tagId, deviceId, albumId }
            };

            // eslint-disable-next-line no-console
            console.log(`tagId: ${tagId}, deviceId: ${deviceId}, albumId: ${albumId}`);

            if (!!deviceId && !!albumId) {
                await spotify.play(deviceId, albumId);
            }
        }
    });
});

app.get('/player/pause', (req, res) => {
    const device = storage[req.query.device];
    const isValid = !!device;

    executeAsync(res, isValid, async () => { await spotify.pause(device.deviceId); });
});

app.get('/player/next', (req, res) => {
    const device = storage[req.query.device];
    const isValid = !!device;

    executeAsync(res, isValid, async () => { await spotify.next(device.deviceId); });
});

app.get('/login', (req, res) => {
    res.redirect(301, authorization.authorizationUri());
});

app.get('/authorize', async (req, res) => {
    await authorization.authorizationCode(req.query.code || '');
    res.redirect('/');
});

app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`App listening on port: ${port}`);
});
