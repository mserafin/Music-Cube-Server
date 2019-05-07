/* eslint-disable class-methods-use-this */

const { bookshelf } = require('./model');

class Playlist extends bookshelf.Model {
    get tableName() {
        return 'playlist';
    }

    get hasTimestamps() {
        return true;
    }

    static findAll(filter, options) {
        return this.forge().where(filter).fetchAll(options);
    }

    static findOne(query, options) {
        return this.forge(query).fetch(options);
    }

    static create(data, options) {
        return this.forge(data).save(null, options);
    }

    static byTagId(tagId) {
        return this.forge().query({ where: { tagId } }).fetch();
    }
}

module.exports = Playlist;
