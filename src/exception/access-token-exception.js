class AccessTokenException extends Error {
    constructor(message) {
        super(message);

        this.name = 'AccessTokenException';
        this.status = 401;
    }
}

module.exports = AccessTokenException;
