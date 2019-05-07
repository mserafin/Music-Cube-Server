const OAuth2 = require('simple-oauth2');
const { auth } = require('../settings');

const _oauth2 = Symbol('authorization.oauth2');
const _credentials = Symbol('authorization.credentials');
const _tokenConfig = Symbol('authorization.tokenConfig');
const _accessToken = Symbol('authorization.accessToken');

class Authorization {
    constructor() {
        this[_credentials] = {
            client: {
                id: auth.CLIENT_ID,
                secret: auth.CLIENT_SECRET
            },
            auth: {
                tokenHost: auth.BASE_URL,
                tokenPath: '/api/token',
                authorizePath: '/authorize'
            }
        };

        this[_tokenConfig] = {
            scope: auth.SCOPE,
            redirect_uri: auth.REDIRECT_URI
        };

        this[_oauth2] = OAuth2.create(this[_credentials]);

        this._setAccessToken(null);
    }

    async getAccessToken() {
        if (this[_accessToken].expired()) {
            this._setAccessToken(await this.refreshAccessToken());
        }

        return this._getToken();
    }

    async authorizationCode(code) {
        this._setAccessToken(await this.createAccessToken(code));
    }

    async createAccessToken(code) {
        try {
            const token = await this[_oauth2].authorizationCode.getToken(
                {
                    ...this[_tokenConfig],
                    ...{ code }
                }
            );
            return this[_oauth2].accessToken.create(token);
        } catch (ex) {
            // eslint-disable-next-line no-console
            console.error('Access Token Error', ex.message);
        }
        return undefined;
    }

    async refreshAccessToken() {
        try {
            return await this[_accessToken].refresh();
        } catch (ex) {
            // eslint-disable-next-line no-console
            console.error('Error refreshing access token: ', ex.message);
        }
        return undefined;
    }

    authorizationUri() {
        return this[_oauth2].authorizationCode.authorizeURL({ ...this[_tokenConfig] });
    }

    _setAccessToken(accessToken) {
        this[_accessToken] = accessToken || {
            token: {
                access_token: null
            },
            expired: () => false,
            refresh: () => null
        };
    }

    _getToken() {
        return this[_accessToken].token.access_token;
    }
}

module.exports = new Authorization();
