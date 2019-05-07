const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: './db.sqlite'
    },
    useNullAsDefault: true
});

const bookshelf = require('bookshelf')(knex);

module.exports = { knex, bookshelf };
