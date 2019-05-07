const settings = {
    auth: {
        CLIENT_ID: '###CLIENT_ID###',
        CLIENT_SECRET: '###CLIENT_SECRET###',
        REDIRECT_URI: 'http://127.0.0.1:3000/authorize',
        BASE_URL: 'https://accounts.spotify.com',
        SCOPE: ['user-read-playback-state', 'user-modify-playback-state']
    },
    spotify: {
        BASE_URL: 'https://api.spotify.com',
        BASE_VERSION: 'v1'
    }
};

module.exports = settings;
