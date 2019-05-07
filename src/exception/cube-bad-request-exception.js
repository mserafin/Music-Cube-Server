class CubeBadRequestException extends Error {
    constructor(message) {
        super(message);

        this.name = 'CubeBadRequestException';
        this.status = 400;
    }
}

module.exports = CubeBadRequestException;
