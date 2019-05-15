/* eslint-disable no-return-await */
const fetch = require('node-fetch');
const method = require('./method');
const AccessTokenException = require('./exception/access-token-exception');
const settings = require('../settings');

const spotify = (authorization) => {
    const fetchData = async (path, type, body) => {
        const accessToken = await authorization.getAccessToken();
        if (!accessToken) {
            throw new AccessTokenException('Redirecting the request after the access token');
        }

        let options = {
            method: type,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            }
        };

        if (!!body && !~[method.GET, method.HEAD].indexOf(type)) {
            options = { ...options, ...{ body: JSON.stringify(body) } };
        }

        return await fetch(`${settings.spotify.BASE_URL}/${settings.spotify.BASE_VERSION}/${path}`, options);
    };

    return {
        devices: async () => await fetchData('me/player/devices', method.GET)
            .then(response => response.json()),
        play: async (deviceId, albumId) => await fetchData(`me/player/play?device_id=${deviceId}`, method.PUT,
            {
                context_uri: `spotify:${albumId}`,
                offset: {
                    position: 0
                },
                position_ms: 0
            }).then(response => response.text()),
        pause: async deviceId => await fetchData(`me/player/pause?device_id=${deviceId}`, method.PUT)
            .then(response => response.text()),
        next: async deviceId => await fetchData(`me/player/next?device_id=${deviceId}`, method.POST)
            .then(response => response.text())
    };
};

module.exports = spotify;
