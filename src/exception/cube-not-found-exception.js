class CubeNotFoundException extends Error {
    constructor(message) {
        super(message);

        this.name = 'CubeNotFoundException';
        this.status = 404;
    }
}

module.exports = CubeNotFoundException;
